/* Worker cho app Lộ trình JLPT N2: phục vụ file tĩnh (public/) + API đồng bộ trên D1.
   Một người dùng: không gian đồng bộ đầu tiên được tạo là "chủ"; các máy khác vào bằng mã ghép.
   Khóa đồng bộ chỉ lưu dưới dạng SHA-256 trong DB. */
const REPORT_HASH = '072d55652a81b1b6b93460e12e54198d6069e0c3b28483f347937f5bd944e69e'; // sha256 của mã báo cáo (mã nằm trong lịch báo cáo, không có trong repo)
const PAIR_TTL = 10 * 60 * 1000;
const MAX_DATA = 1_800_000;
const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const err = (code, msg, status) => json({ error: code, message: msg }, status);
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
function randKey() { const b = crypto.getRandomValues(new Uint8Array(32)); return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function randCode(n) { const b = crypto.getRandomValues(new Uint8Array(n)); return [...b].map(x => ALPHA[x % ALPHA.length]).join(''); }

let ready = false;
async function init(db) {
  if (ready) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS space (id TEXT PRIMARY KEY, data TEXT, upd INTEGER DEFAULT 0, rev INTEGER DEFAULT 0, summary TEXT, recovery TEXT, created_at INTEGER, updated_at INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS pair (code TEXT PRIMARY KEY, k TEXT, exp INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS device (space TEXT, dev TEXT, name TEXT, first_seen INTEGER, last_seen INTEGER, PRIMARY KEY (space, dev))'),
  ]);
  ready = true;
}
async function auth(req, db) {
  const h = req.headers.get('authorization') || '';
  const key = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
  if (key.length < 20) return null;
  const id = await sha(key);
  const row = await db.prepare('SELECT id, upd, rev, updated_at FROM space WHERE id = ?').bind(id).first();
  if (!row) return null;
  const dev = (req.headers.get('x-device') || '').replace(/[^a-z0-9]/gi, '').slice(0, 16), name = (() => { try { return decodeURIComponent(req.headers.get('x-device-name') || ''); } catch (e) { return ''; } })().slice(0, 60), now = Date.now();
  if (dev) await db.prepare('INSERT INTO device (space, dev, name, first_seen, last_seen) VALUES (?, ?, ?, ?, ?) ON CONFLICT(space, dev) DO UPDATE SET name = excluded.name, last_seen = excluded.last_seen').bind(id, dev, name, now, now).run();
  return { id, key, row, dev };
}
async function body(req) { try { return await req.json(); } catch (e) { return {}; } }

async function api(req, env, url) {
  const db = env.DB; if (!db) return err('no_db', 'Chưa gắn database D1', 500);
  await init(db);
  const p = url.pathname, m = req.method;

  if (p === '/api/status' && m === 'GET') {
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    return json({ ok: true, hasOwner: !!owner });
  }
  if (p === '/api/space/init' && m === 'POST') {
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    if (owner) return err('exists', 'Đã có dữ liệu đồng bộ. Hãy ghép máy này bằng mã từ máy đã kết nối, hoặc dùng mã khôi phục.', 409);
    const key = randKey(), recovery = randCode(4) + '-' + randCode(4) + '-' + randCode(4) + '-' + randCode(4);
    const id = await sha(key), now = Date.now();
    await db.batch([
      db.prepare('INSERT INTO space (id, data, upd, rev, recovery, created_at, updated_at) VALUES (?, NULL, 0, 0, ?, ?, ?)').bind(id, await sha(recovery.replace(/-/g, '')), now, now),
      db.prepare("INSERT INTO meta (k, v) VALUES ('owner', ?)").bind(id),
    ]);
    return json({ key, recovery });
  }
  if (p === '/api/space/recover' && m === 'POST') {
    const b = await body(req); const code = String(b.recovery || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length < 16) return err('bad_code', 'Mã khôi phục không đúng.', 400);
    const row = await db.prepare('SELECT id FROM space WHERE recovery = ?').bind(await sha(code)).first();
    if (!row) return err('bad_code', 'Mã khôi phục không đúng.', 403);
    return rotate(db, row.id);
  }
  if (p === '/api/pair/claim' && m === 'POST') {
    const b = await body(req); const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    await db.prepare('DELETE FROM pair WHERE exp < ?').bind(Date.now()).run();
    const row = code.length === 8 ? await db.prepare('SELECT k FROM pair WHERE code = ?').bind(code).first() : null;
    if (!row) return err('bad_code', 'Mã ghép sai hoặc đã hết hạn (10 phút). Tạo mã mới trên máy đã kết nối.', 403);
    await db.prepare('DELETE FROM pair WHERE code = ?').bind(code).run();
    return json({ key: row.k });
  }
  if (p.startsWith('/api/report/') && m === 'GET') {
    const tok = p.slice('/api/report/'.length);
    if (!tok || (await sha(tok)) !== REPORT_HASH) return err('forbidden', 'Sai mã báo cáo.', 403);
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    const row = owner ? await db.prepare('SELECT summary, updated_at, rev FROM space WHERE id = ?').bind(owner.v).first() : null;
    if (!row) return err('empty', 'Chưa có dữ liệu.', 404);
    const devs = await db.prepare('SELECT name, first_seen, last_seen FROM device WHERE space = ? ORDER BY last_seen DESC').bind(owner.v).all();
    const iso = t => t ? new Date(t).toISOString() : null;
    return json({ lastSync: iso(row.updated_at), rev: row.rev, devices: (devs.results || []).map(d => ({ name: d.name, firstSeen: iso(d.first_seen), lastSeen: iso(d.last_seen) })), summary: row.summary ? JSON.parse(row.summary) : null });
  }

  const a = await auth(req, db);
  if (!a) return err('unauthorized', 'Máy này chưa được ghép hoặc khóa đã bị đổi. Hãy ghép lại.', 401);

  if (p === '/api/sync' && m === 'GET') {
    const row = await db.prepare('SELECT data, upd, rev FROM space WHERE id = ?').bind(a.id).first();
    return json({ data: row.data, upd: row.upd, rev: row.rev });
  }
  if (p === '/api/sync' && m === 'PUT') {
    const b = await body(req);
    if (typeof b.data !== 'string' || b.data.length > MAX_DATA) return err('too_large', 'Dữ liệu quá lớn.', 413);
    const base = Number(b.baseRev) || 0, now = Date.now();
    const r = await db.prepare('UPDATE space SET data = ?, upd = ?, rev = rev + 1, summary = COALESCE(?, summary), updated_at = ? WHERE id = ? AND rev = ?')
      .bind(b.data, Number(b.upd) || now, b.summary ? JSON.stringify(b.summary).slice(0, 200000) : null, now, a.id, base).run();
    if (!r.meta || !r.meta.changes) { const cur = await db.prepare('SELECT rev FROM space WHERE id = ?').bind(a.id).first(); return json({ error: 'conflict', message: 'Có dữ liệu mới hơn từ máy khác.', rev: cur ? cur.rev : 0 }, 409); }
    return json({ ok: true, rev: base + 1 });
  }
  if (p === '/api/pair/create' && m === 'POST') {
    await db.prepare('DELETE FROM pair WHERE exp < ?').bind(Date.now()).run();
    const code = randCode(8), exp = Date.now() + PAIR_TTL;
    await db.prepare('INSERT INTO pair (code, k, exp) VALUES (?, ?, ?)').bind(code, a.key, exp).run();
    return json({ code: code.slice(0, 4) + '-' + code.slice(4), exp });
  }
  if (p === '/api/devices' && m === 'GET') {
    const r = await db.prepare('SELECT dev, name, first_seen, last_seen FROM device WHERE space = ? ORDER BY last_seen DESC').bind(a.id).all();
    return json({ me: a.dev, devices: r.results || [] });
  }
  if (p === '/api/devices/remove' && m === 'POST') { const b = await body(req); await db.prepare('DELETE FROM device WHERE space = ? AND dev = ?').bind(a.id, String(b.dev || '')).run(); return json({ ok: true }); }
  if (p === '/api/space/rotate' && m === 'POST') return rotate(db, a.id, a.dev);
  return err('not_found', 'Không có API này.', 404);
}
async function rotate(db, oldId, keepDev) {
  const key = randKey(), id = await sha(key);
  await db.batch([
    db.prepare('DELETE FROM device WHERE space = ? AND dev != ?').bind(oldId, keepDev || ''),
    db.prepare('UPDATE device SET space = ? WHERE space = ?').bind(id, oldId),
    db.prepare('UPDATE space SET id = ?, updated_at = ? WHERE id = ?').bind(id, Date.now(), oldId),
    db.prepare("UPDATE meta SET v = ? WHERE k = 'owner' AND v = ?").bind(id, oldId),
    db.prepare('DELETE FROM pair'),
  ]);
  return json({ key });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await api(req, env, url); } catch (e) { return err('server', 'Lỗi máy chủ: ' + (e && e.message || e), 500); }
    }
    return env.ASSETS.fetch(req);
  },
};
