/* Worker cho app Luyện đề JLPT N2: phục vụ file tĩnh (public/) + API đồng bộ, nội dung bài tập và file nghe (D1/R2).
   Một người dùng: không gian đồng bộ đầu tiên được tạo là "chủ"; các máy khác vào bằng mã ghép.
   Khóa đồng bộ chỉ lưu dưới dạng SHA-256 trong DB. */
const REPORT_HASH = '072d55652a81b1b6b93460e12e54198d6069e0c3b28483f347937f5bd944e69e'; // sha256 của mã báo cáo (mã nằm trong lịch báo cáo, không có trong repo)
const PAIR_TTL = 10 * 60 * 1000;
const MAX_DATA = 1_800_000;
const MAX_CONTENT = 1_950_000, MAX_AUDIO = 12_000_000, MAX_R2 = 99_000_000, CHUNK = 900_000, TOK_TTL = 12 * 3600 * 1000;
const AID = /^[A-Za-z0-9-]{1,40}$/;
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
    db.prepare('CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY, data TEXT, upd INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS audio_meta (id TEXT PRIMARY KEY, size INTEGER, parts INTEGER, store TEXT, upd INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS audio_part (id TEXT, part INTEGER, data BLOB, PRIMARY KEY (id, part))'),
    db.prepare('CREATE TABLE IF NOT EXISTS tok (t TEXT PRIMARY KEY, exp INTEGER)'),
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

  if (p.startsWith('/api/audio/') && (m === 'GET' || m === 'HEAD')) {
    const id = decodeURIComponent(p.slice('/api/audio/'.length));
    if (!AID.test(id)) return err('bad_id', 'Mã file không hợp lệ.', 400);
    const t = url.searchParams.get('t');
    let ok = false;
    if (t) { const r = await db.prepare('SELECT exp FROM tok WHERE t = ?').bind(await sha(t)).first(); ok = !!r && r.exp > Date.now(); }
    else ok = !!(await auth(req, db));
    if (!ok) return err('unauthorized', 'Cần khóa đồng bộ.', 401);
    return media(req, env, db, id);
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

  /* Nội dung bài tập (tài liệu khóa học riêng): chỉ máy đã ghép mới đọc/ghi được */
  if (p === '/api/content' && m === 'GET') {
    const since = Number(url.searchParams.get('since')) || 0;
    const row = await db.prepare("SELECT upd FROM content WHERE id = 'main'").first();
    if (!row) return json({ data: null });
    if (since && row.upd <= since) return json({ data: null, upd: row.upd, same: true });
    const full = await db.prepare("SELECT data, upd FROM content WHERE id = 'main'").first();
    return json({ data: full.data, upd: full.upd });
  }
  if (p === '/api/content' && m === 'PUT') {
    const b = await body(req);
    if (typeof b.data !== 'string' || b.data.length > MAX_CONTENT) return err('too_large', 'Nội dung quá lớn.', 413);
    try { const o = JSON.parse(b.data); if (!Array.isArray(o.sets)) throw 0; } catch (e) { return err('bad', 'Nội dung không đúng định dạng.', 400); }
    const now = Date.now();
    await db.prepare("INSERT INTO content (id, data, upd) VALUES ('main', ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, upd = excluded.upd").bind(b.data, now).run();
    return json({ ok: true, upd: now });
  }
  /* File nghe / PDF đề: R2 nếu đã gắn bucket (AUDIO); chưa có R2 thì file nhỏ (≤12MB) chia khúc lưu trong D1 */
  if (p === '/api/audio' && m === 'GET') {
    const r = await db.prepare('SELECT id, size FROM audio_meta').all();
    return json({ ids: (r.results || []).map(x => x.id), r2: !!env.AUDIO });
  }
  if (p === '/api/media-token' && m === 'POST') {
    const now = Date.now(), t = randKey(), exp = now + TOK_TTL;
    await db.batch([db.prepare('DELETE FROM tok WHERE exp < ?').bind(now), db.prepare('INSERT INTO tok (t, exp) VALUES (?, ?)').bind(await sha(t), exp)]);
    return json({ t, exp });
  }
  if (p.startsWith('/api/audio/') && m === 'PUT') {
    const id = decodeURIComponent(p.slice('/api/audio/'.length));
    if (!AID.test(id)) return err('bad_id', 'Mã file không hợp lệ.', 400);
    const len = Number(req.headers.get('content-length')) || 0, type = (req.headers.get('content-type') || 'audio/mpeg').split(';')[0];
    const now = Date.now();
    if (env.AUDIO) {
      if (!len || len > MAX_R2) return err('too_large', 'File quá lớn hoặc thiếu kích thước.', 413);
      await env.AUDIO.put('a/' + id, req.body, { httpMetadata: { contentType: type } });
      await db.batch([db.prepare('DELETE FROM audio_part WHERE id = ?').bind(id), db.prepare('INSERT INTO audio_meta (id, size, parts, store, upd) VALUES (?, ?, 0, ?, ?) ON CONFLICT(id) DO UPDATE SET size = excluded.size, parts = 0, store = excluded.store, upd = excluded.upd').bind(id, len, 'r2:' + type, now)]);
      return json({ ok: true, size: len });
    }
    if (len > MAX_AUDIO) return err('need_r2', 'File lớn (' + Math.round(len / 1e6) + 'MB) cần kho R2. Tạo bucket R2 jlpt-n2-audio rồi báo để gắn vào.', 507);
    const buf = new Uint8Array(await req.arrayBuffer());
    if (!buf.length || buf.length > MAX_AUDIO) return err('too_large', 'File quá lớn hoặc rỗng.', 413);
    const parts = Math.ceil(buf.length / CHUNK), st = [db.prepare('DELETE FROM audio_part WHERE id = ?').bind(id)];
    for (let i = 0; i < parts; i++) st.push(db.prepare('INSERT INTO audio_part (id, part, data) VALUES (?, ?, ?)').bind(id, i, buf.slice(i * CHUNK, (i + 1) * CHUNK)));
    st.push(db.prepare('INSERT INTO audio_meta (id, size, parts, store, upd) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET size = excluded.size, parts = excluded.parts, store = excluded.store, upd = excluded.upd').bind(id, buf.length, parts, 'd1:' + type, now));
    await db.batch(st);
    return json({ ok: true, size: buf.length });
  }
  return err('not_found', 'Không có API này.', 404);
}
async function media(req, env, db, id) {
  const meta = await db.prepare('SELECT size, parts, store FROM audio_meta WHERE id = ?').bind(id).first();
  if (!meta) return err('not_found', 'Chưa có file này.', 404);
  const [where, type0] = String(meta.store || 'd1').split(':'), type = type0 || 'audio/mpeg';
  const base = { 'content-type': type, 'cache-control': 'private, max-age=31536000, immutable', 'accept-ranges': 'bytes' };
  if (where === 'r2' && env.AUDIO) {
    const rg = req.headers.get('range');
    const o = await env.AUDIO.get('a/' + id, rg ? { range: req.headers } : undefined);
    if (!o) return err('not_found', 'Thiếu file trong R2.', 404);
    if (rg && o.range) {
      const off = o.range.offset || 0, len = o.range.length != null ? o.range.length : o.size - off;
      return new Response(req.method === 'HEAD' ? null : o.body, { status: 206, headers: { ...base, 'content-range': `bytes ${off}-${off + len - 1}/${o.size}`, 'content-length': String(len) } });
    }
    return new Response(req.method === 'HEAD' ? null : o.body, { headers: { ...base, 'content-length': String(o.size) } });
  }
  if (req.method === 'HEAD') return new Response(null, { headers: { ...base, 'content-length': String(meta.size) } });
  const out = new Uint8Array(meta.size); let off = 0;
  for (let i = 0; i < meta.parts; i++) { const r = await db.prepare('SELECT data FROM audio_part WHERE id = ? AND part = ?').bind(id, i).first(); const d = new Uint8Array(r.data); out.set(d, off); off += d.length; }
  if (env.AUDIO) { await env.AUDIO.put('a/' + id, out, { httpMetadata: { contentType: type } }); await db.batch([db.prepare('UPDATE audio_meta SET store = ?, parts = 0 WHERE id = ?').bind('r2:' + type, id), db.prepare('DELETE FROM audio_part WHERE id = ?').bind(id)]); }
  const rg = (req.headers.get('range') || '').match(/bytes=(\d+)-(\d*)/);
  if (rg) { const s0 = +rg[1], e0 = rg[2] ? Math.min(+rg[2], meta.size - 1) : meta.size - 1; return new Response(out.slice(s0, e0 + 1), { status: 206, headers: { ...base, 'content-range': `bytes ${s0}-${e0}/${meta.size}`, 'content-length': String(e0 - s0 + 1) } }); }
  return new Response(out, { headers: { ...base, 'content-length': String(meta.size) } });
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
