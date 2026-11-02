/* ===== UTIL ===== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jp = s => `<span lang="ja">${esc(s)}</span>`;
const pad = n => String(n).padStart(2, '0');
const dayNum = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromDayNum = n => { const d = new Date(n * 864e5); return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); };
const fmtDate = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const WD = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const unbr = s => s.replace(/[\[\]]/g, '');
const brHi = s => esc(s).replace(/\[(.+?)\]/g, '<mark>$1</mark>');
const isoWeek = (d = new Date()) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${pad(Math.ceil(((t - y0) / 864e5 + 1) / 7))}`; };
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2600); }
function speak(text, rate = 0.9) {
  try {
    const u = new SpeechSynthesisUtterance(String(text).replace(/[\[\]～〜()（）]/g, ' '));
    u.lang = 'ja-JP'; u.rate = rate; try { const v = speechSynthesis.getVoices().find(x => /^ja/i.test(x.lang)); if (v) u.voice = v; } catch (e) { } speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { toast('Thiết bị này chưa đọc được tiếng Nhật'); }
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Đã chép, dán vào Claude'); }
  catch (e) { const ta = $('#copyfall'); ta.value = text; ta.hidden = false; ta.focus(); ta.select(); toast('Hãy chép đoạn đang được chọn'); }
}

/* ===== DECKS ===== */
const DECKS = [];
function deck(id, name, lv, cards, small = false) { DECKS.push({ id, name, lv, small, cards: cards.map((c, i) => ({ ...c, k: id + ':' + i, d: id })) }); }
deck('hira', 'Hiragana', 'Chữ', KANA.map(([h, r]) => ({ f: h, m: r })));
deck('kata', 'Katakana', 'Chữ', KANA.map(([h, r]) => ({ f: toKata(h), m: r })));
deck('kanji5', 'Kanji N5', 'N5', KANJI5.map(([c, hv, on, kun, m, ex]) => ({ f: c, hv, r: `On ${on} · Kun ${kun}`, m, x: ex, say: ex.split(' ')[0] })));
deck('radical', 'Bộ thủ', 'N5', RADICALS.map(([b, hv, m, ex]) => ({ f: b, hv, m, x: 'Ví dụ: ' + ex })));
deck('g5', 'Ngữ pháp N5', 'N5', G5.map(([p, m, x]) => ({ f: p, m, x: unbr(x) })), true);
deck('kanji4', 'Kanji N4', 'N4', KANJI4.map(([c, hv, on, kun, m, ex]) => ({ f: c, hv, r: `On ${on} · Kun ${kun}`, m, x: ex, say: ex.split(' ')[0] })));
deck('g4', 'Ngữ pháp N4', 'N4', G4.map(([p, m, x]) => ({ f: p, m, x: unbr(x) })), true);
deck('jita', 'Tự / tha động từ', 'N4', JITA.map(([a, b, m]) => ({ f: '自 ' + a, m: 'Tha (を): ' + b, n: m, say: a })), true);
deck('g3', 'Ngữ pháp N3', 'N3', G3.map(([p, m, x]) => ({ f: p, m, x: unbr(x) })), true);
deck('keigo', 'Kính ngữ', 'N3', KEIGO.map(([a, s, k]) => ({ f: a, m: `尊敬: ${s}`, n: `謙譲: ${k}` })), true);
deck('kaiwa', 'Văn nói rút gọn', 'N3', KAIWA.map(([a, b, x]) => ({ f: a, m: 'Gốc: ' + b, x })), true);
deck('fukugo', 'Động từ ghép', 'N3', FUKUGO.map(([a, m, x]) => ({ f: a, m, x })), true);
deck('g2', 'Ngữ pháp N2', 'N2', G2.map(([g, p, m, x]) => ({ f: p, m, x: unbr(x), n: G2_GROUPS[g] })), true);
deck('fukushi', 'Phó từ N2', 'N2', FUKUSHI.map(([a, m, x]) => ({ f: a, m, x })), true);
deck('gokei', 'Tiền tố / hậu tố', 'N2', GOKEI.map(([a, m, x]) => ({ f: a, m, x: 'Ví dụ: ' + x })), true);
deck('nise', 'Bạn giả Hán-Việt', 'N2', NISE.map(([w, r, hv, m]) => ({ f: w, r, hv, m, n: 'Nghĩa khác tiếng Việt' })));
deck('senmon', 'Từ ngành môi trường', 'N3', SENMON.map(([w, r, hv, m]) => ({ f: w, r, hv, m })));
Object.entries(VOCAB_TOPICS).forEach(([id, name]) => deck('v-' + id, 'Từ vựng: ' + name, id === 'econ' || id === 'mt' || id === 'study' ? 'N2' : 'N3', VOCAB.filter(v => v[1] === id).map(([lv, t, w, r, hv, m, x]) => ({ f: w, r, hv: hv === '—' ? '' : hv, m, x, n: lv, say: x }))));
const DECK = Object.fromEntries(DECKS.map(d => [d.id, d]));
const CARD = {}; DECKS.forEach(d => d.cards.forEach(c => CARD[c.k] = c));
/* Thẻ của mình (S.custom), khóa thẻ theo id nên thêm/xóa không làm lệch tiến độ */
function buildCustom() {
  let d = DECK.mine;
  if (!d) { d = { id: 'mine', name: 'Thẻ của mình', lv: 'Mình', small: false, cards: [] }; DECKS.unshift(d); DECK.mine = d; }
  d.cards.forEach(c => delete CARD[c.k]);
  d.cards = (S.custom || []).map(c => ({ f: c.f, r: c.r, m: c.m, x: c.x, k: 'mine:' + c.id, d: 'mine', small: [...c.f].length > 5 }));
  d.cards.forEach(c => CARD[c.k] = c);
}

/* ===== STATE + SYNC ===== */
const LSK = 'jlpt-n2-son-v1';
const DEF = () => ({ v: 1, upd: 0, srs: {}, log: {}, nw: { d: 0, c: 0 }, set: { newPer: 10, decks: ['hira', 'kata', 'kanji5', 'g5'], target: '', rev: false }, exams: [], week: {}, chk: {}, qs: {}, place: [], custom: [] });
let S = DEF();
function merge(o) { const d = DEF(); return { ...d, ...o, set: { ...d.set, ...(o.set || {}) } }; }
try { const raw = localStorage.getItem(LSK); if (raw) S = merge(JSON.parse(raw)); } catch (e) { }
let SY = { mode: 'local', msg: 'Đang kiểm tra đồng bộ…', kind: null, writing: false, again: false, t: 0 };
const IN_CLAUDE = !!(window.claude && window.claude.use);
function save() {
  S.upd = Date.now();
  try { localStorage.setItem(LSK, JSON.stringify(S)); } catch (e) { }
  if (SY.kind) { clearTimeout(SY.t); SY.t = setTimeout(pushRemote, 2000); }
}
async function pushRemote() {
  if (!SY.kind) return;
  if (SY.writing) { SY.again = true; return; }
  SY.writing = true;
  try {
    const s = JSON.stringify(S);
    if (SY.kind === 'db' && s.length > 250000) setSync('error', 'Dữ liệu quá lớn để đồng bộ, hãy xuất file sao lưu');
    else { await (SY.kind === 'db' ? SY.ref.set({ s, upd: S.upd }) : GIST.push(s)); setSync('cloud', 'Đã đồng bộ ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + (SY.kind === 'gist' ? ' (GitHub Gist)' : '')); }
  } catch (e) { setSync('error', 'Chưa lưu lên ' + (SY.kind === 'gist' ? 'GitHub' : 'tài khoản') + ' được (' + (e && (e.code || e.status) || 'lỗi mạng') + '). Tiến độ vẫn lưu trên máy này.'); }
  SY.writing = false;
  if (SY.again) { SY.again = false; pushRemote(); }
}
function setSync(mode, msg) { SY.mode = mode; SY.msg = msg; document.querySelectorAll('.syncdot').forEach(el => { el.dataset.m = mode; el.title = msg; }); document.querySelectorAll('.synctext').forEach(t => t.textContent = msg); const s = $('#syncshort'); if (s) s.textContent = mode === 'cloud' ? 'Đã đồng bộ' : mode === 'error' ? 'Lỗi đồng bộ' : 'Lưu trên máy'; }
function adoptRemote(data) {
  if (!data || typeof data.s !== 'string') return false;
  if ((data.upd || 0) <= (S.upd || 0)) return false;
  try { S = merge(JSON.parse(data.s)); localStorage.setItem(LSK, JSON.stringify(S)); buildCustom(); return true; } catch (e) { return false; }
}
function rerenderAfterRemote() { if (!(route === 'review' && RV && !RV.done)) render(); else RV.remoteNote = true; }
async function initSync() {
  if (!IN_CLAUDE) { GIST.init(); return; }
  const timer = setTimeout(() => { if (SY.mode !== 'cloud') setSync('local', 'Chưa kết nối được tài khoản. Tiến độ đang lưu trên máy này.'); }, 10000);
  try {
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    const uid = user ? await user.id() : null;
    if (!db || !uid) { clearTimeout(timer); setSync('local', 'Chỉ lưu trên máy này (cần đăng nhập claude.ai để đồng bộ).'); return; }
    SY.ref = db.doc('data/users/' + uid + '/jlpt'); SY.kind = 'db';
    let first = true;
    SY.ref.onSnapshot(snap => {
      if (snap.metadata.hasPendingWrites) return;
      const data = snap.exists ? snap.data() : null;
      if (adoptRemote(data)) rerenderAfterRemote();
      if (!snap.metadata.fromCache) {
        clearTimeout(timer);
        if (first) { first = false; if (!data || (data.upd || 0) < (S.upd || 0)) { if (S.upd) pushRemote(); else setSync('cloud', 'Đồng bộ với tài khoản đã bật'); } else setSync('cloud', 'Đã đồng bộ với tài khoản'); }
      }
    }, err => { clearTimeout(timer); setSync('error', 'Mất kết nối đồng bộ (' + err.code + '). Tiến độ vẫn lưu trên máy này.'); });
  } catch (e) { clearTimeout(timer); setSync('local', 'Chỉ lưu trên máy này.'); }
}

/* ----- GitHub Gist sync (khi chạy PWA ngoài claude.ai) ----- */
const GIST = {
  KEY: 'jlpt-n2-son-gist', FILE: 'jlpt-n2-progress.json', cfg: null,
  load() { try { this.cfg = JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch (e) { this.cfg = null; } return this.cfg; },
  store() { try { this.cfg ? localStorage.setItem(this.KEY, JSON.stringify(this.cfg)) : localStorage.removeItem(this.KEY); } catch (e) { } },
  async api(path, opts = {}) {
    const r = await fetch('https://api.github.com' + path, { ...opts, headers: { Authorization: 'Bearer ' + this.cfg.token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, cache: 'no-store' });
    if (!r.ok) { const e = new Error('GitHub ' + r.status); e.code = r.status; throw e; }
    return r.status === 204 ? null : r.json();
  },
  async findOrCreate() {
    for (let page = 1; page <= 5; page++) {
      const list = await this.api(`/gists?per_page=100&page=${page}`);
      const g = list.find(x => x.files && x.files[this.FILE]);
      if (g) return g.id;
      if (list.length < 100) break;
    }
    const g = await this.api('/gists', { method: 'POST', body: JSON.stringify({ description: 'Tiến độ app Lộ trình JLPT N2 (tự động)', public: false, files: { [this.FILE]: { content: JSON.stringify(S) } } }) });
    return g.id;
  },
  async pull() {
    const g = await this.api('/gists/' + this.cfg.id);
    const f = g.files && g.files[this.FILE]; if (!f) return null;
    let content = f.content;
    if (f.truncated && f.raw_url) content = await (await fetch(f.raw_url, { cache: 'no-store' })).text();
    let upd = 0; try { upd = JSON.parse(content).upd || 0; } catch (e) { return null; }
    return { s: content, upd };
  },
  push(s) { return this.api('/gists/' + this.cfg.id, { method: 'PATCH', body: JSON.stringify({ files: { [this.FILE]: { content: s } } }) }); },
  async sync() {
    if (!this.cfg || !this.cfg.id) return;
    try {
      const data = await this.pull();
      if (adoptRemote(data)) { rerenderAfterRemote(); setSync('cloud', 'Đã tải tiến độ mới từ GitHub Gist'); }
      else if (!data || (data.upd || 0) < (S.upd || 0)) await pushRemote();
      else setSync('cloud', 'Đã đồng bộ (GitHub Gist)');
    } catch (e) { setSync(navigator.onLine === false ? 'local' : 'error', navigator.onLine === false ? 'Đang offline. Tiến độ lưu trên máy, sẽ đồng bộ khi có mạng.' : 'Không đồng bộ được với GitHub (' + (e.code || 'lỗi mạng') + '). Kiểm tra lại token.'); }
  },
  async connect(token) {
    this.cfg = { token: token.trim() };
    try {
      setSync('local', 'Đang kết nối GitHub…');
      const me = await this.api('/user');
      this.cfg.login = me.login;
      this.cfg.id = await this.findOrCreate();
      this.store(); SY.kind = 'gist';
      await this.sync(); this.listen();
      return true;
    } catch (e) { this.cfg = null; this.store(); SY.kind = null; setSync('error', e.code === 401 ? 'Token không hợp lệ hoặc đã hết hạn.' : e.code === 404 || e.code === 403 ? 'Token thiếu quyền gist.' : 'Không kết nối được GitHub (' + (e.code || 'lỗi mạng') + ').'); return false; }
  },
  disconnect() { this.cfg = null; this.store(); SY.kind = null; setSync('local', 'Chỉ lưu trên máy này. Kết nối GitHub Gist ở mục Kế hoạch để đồng bộ.'); },
  init() {
    if (!this.load() || !this.cfg.id) { setSync('local', 'Chỉ lưu trên máy này. Kết nối GitHub Gist ở mục Kế hoạch để đồng bộ.'); return; }
    SY.kind = 'gist'; this.sync(); this.listen();
  },
  listen() {
    if (this.on) return; this.on = true;
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.sync(); else if (SY.t) { clearTimeout(SY.t); pushRemote(); } });
    window.addEventListener('online', () => this.sync());
    setInterval(() => { if (document.visibilityState === 'visible') this.sync(); }, 5 * 60 * 1000);
  },
};

/* ===== SRS (SM-2 rút gọn) ===== */
const today = () => dayNum();
function logAdd(field, n = 1) { const k = dayKey(); const l = S.log[k] || (S.log[k] = { r: 0, q: 0, c: 0, m: 0 }); l[field] = (l[field] || 0) + n; }
function newLeft() { const d = today(); return Math.max(0, S.set.newPer - (S.nw.d === d ? S.nw.c : 0)); }
/* FSRS-4.5 (tham số mặc định), độ chính xác theo ngày. Trạng thái: [due, ivl, D, S, reps, lapses, lastReview].
   Thẻ cũ dạng SM-2 [due, ivl, ease, reps, lapses] được chuyển đổi khi ôn lần kế tiếp. */
const FW = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const F_DECAY = -0.5, F_FACTOR = 19 / 81;
const clampD = d => Math.min(10, Math.max(1, d));
const fD0 = g => clampD(FW[4] - (g - 3) * FW[5]);
function fIvl(st) { const r = S.set.ret || 0.9; return Math.max(1, Math.min(3650, Math.round(st / F_FACTOR * (Math.pow(r, 1 / F_DECAY) - 1)))); }
function sched(st, g) {
  const dn = today();
  let D, Sx, reps = 0, lap = 0, last = dn, fresh = !st;
  if (st && st.length === 5) { const [due, ivl, ease, r, l] = st; Sx = Math.max(ivl, 0.5); D = clampD(11 - (ease - 1.3) / 1.5 * 9); reps = r; lap = l; last = due - ivl; }
  else if (st) { D = st[2]; Sx = st[3]; reps = st[4]; lap = st[5]; last = st[6]; }
  let nD, nS;
  if (fresh) { nS = FW[g - 1]; nD = fD0(g); }
  else {
    const t = Math.max(0, dn - last), R = Math.pow(1 + F_FACTOR * t / Sx, F_DECAY);
    nD = clampD(FW[7] * fD0(3) + (1 - FW[7]) * (D - FW[6] * (g - 3)));
    if (g === 1) { nS = Math.min(Sx, FW[11] * Math.pow(D, -FW[12]) * (Math.pow(Sx + 1, FW[13]) - 1) * Math.exp(FW[14] * (1 - R))); lap++; }
    else nS = Sx * (Math.exp(FW[8]) * (11 - D) * Math.pow(Sx, -FW[9]) * (Math.exp(FW[10] * (1 - R)) - 1) * (g === 2 ? FW[15] : 1) * (g === 4 ? FW[16] : 1) + 1);
  }
  nS = Math.max(0.1, nS); nD = +nD.toFixed(3); nS = +nS.toFixed(4);
  if (g === 1) return { st: [dn, 0, nD, nS, reps, lap, dn], again: true };
  const ivl = fIvl(nS);
  return { st: [dn + ivl, ivl, nD, nS, reps + 1, lap, dn], again: false };
}
const ivlLabel = n => n <= 0 ? '<10 phút' : n === 1 ? '1 ngày' : n < 31 ? n + ' ngày' : n < 365 ? Math.round(n / 30) + ' tháng' : (n / 365).toFixed(1) + ' năm';
function deckStats(d) {
  const dn = today(); let seen = 0, mature = 0, due = 0;
  d.cards.forEach(c => { const s = S.srs[c.k]; if (!s) return; seen++; if (s[1] >= 21) mature++; if (s[0] <= dn) due++; });
  return { total: d.cards.length, seen, mature, due };
}
function buildQueue(onlyDeck) {
  const dn = today();
  const pool = onlyDeck ? DECK[onlyDeck].cards : DECKS.flatMap(d => d.cards);
  const due = pool.filter(c => S.srs[c.k] && S.srs[c.k][0] <= dn).sort((a, b) => S.srs[a.k][0] - S.srs[b.k][0]);
  const decks = onlyDeck ? [onlyDeck] : S.set.decks;
  const fresh = []; let left = newLeft();
  for (const id of decks) { if (!DECK[id]) continue; for (const c of DECK[id].cards) { if (left <= 0) break; if (!S.srs[c.k]) { fresh.push(c); left--; } } }
  // trộn: cứ 3 thẻ ôn chen 1 thẻ mới
  const q = []; let i = 0, j = 0;
  while (i < due.length || j < fresh.length) { for (let t = 0; t < 3 && i < due.length; t++) q.push(due[i++]); if (j < fresh.length) q.push(fresh[j++]); }
  return q;
}
function dueCount() { const dn = today(); let n = 0; for (const k in S.srs) if (S.srs[k][0] <= dn && CARD[k]) n++; return n; }
function newAvail() { let left = newLeft(), n = 0; for (const id of S.set.decks) { if (!DECK[id]) continue; for (const c of DECK[id].cards) { if (n >= left) return n; if (!S.srs[c.k]) n++; } } return n; }

/* ===== CONJUGATION ===== */
const GODAN = { う: 'わいえお', く: 'かきけこ', ぐ: 'がぎげご', す: 'さしせそ', つ: 'たちてと', ぬ: 'なにねの', ぶ: 'ばびべぼ', む: 'まみめも', る: 'らりれろ' };
function conj(v, g, f) {
  g = +g;
  if (g === 3) {
    if (v.endsWith('来る')) {
      const p = v.slice(0, -2);
      const M = { masu: '来ます (きます)', nai: '来ない (こない)', te: '来て (きて)', ta: '来た (きた)', pot: '来られる (こられる)', vol: '来よう (こよう)', ba: '来れば (くれば)', imp: '来い (こい)', pass: '来られる (こられる)', caus: '来させる (こさせる)', cp: '来させられる (こさせられる)' };
      return p + M[f];
    }
    const p = v.slice(0, -2);
    const M = { masu: 'します', nai: 'しない', te: 'して', ta: 'した', pot: 'できる', vol: 'しよう', ba: 'すれば', imp: 'しろ', pass: 'される', caus: 'させる', cp: 'させられる' };
    return p + M[f];
  }
  const last = v.slice(-1), st = v.slice(0, -1);
  if (g === 2) {
    const M = { masu: 'ます', nai: 'ない', te: 'て', ta: 'た', pot: 'られる', vol: 'よう', ba: 'れば', imp: 'ろ', pass: 'られる', caus: 'させる', cp: 'させられる' };
    return st + M[f];
  }
  const row = GODAN[last]; if (!row) return v;
  const [a, i, e, o] = row;
  const teT = () => { if (v === '行く' || v.endsWith('行く')) return ['って', 'った']; if ('うつる'.includes(last)) return ['って', 'った']; if ('むぶぬ'.includes(last)) return ['んで', 'んだ']; if (last === 'く') return ['いて', 'いた']; if (last === 'ぐ') return ['いで', 'いだ']; return ['して', 'した']; };
  switch (f) {
    case 'masu': return st + i + 'ます';
    case 'nai': return st + a + 'ない';
    case 'te': return st + teT()[0];
    case 'ta': return st + teT()[1];
    case 'pot': return st + e + 'る';
    case 'vol': return st + o + 'う';
    case 'ba': return st + e + 'ば';
    case 'imp': return st + e;
    case 'pass': return st + a + 'れる';
    case 'caus': return st + a + 'せる';
    case 'cp': return st + a + (last === 'す' ? 'せられる' : 'される');
  }
}
const GROUP_NAME = { 1: 'Nhóm 1 (五段)', 2: 'Nhóm 2 (一段)', 3: 'Nhóm 3 (bất quy tắc)' };

/* ===== EXAM DATES ===== */
function firstSunday(y, m) { const d = new Date(y, m, 1); d.setDate(1 + (7 - d.getDay()) % 7); return d; }
const OFFICIAL = ['2026-07-05', '2026-12-06'];
function examDates() {
  const out = []; const now = dayNum();
  for (let y = 2026; y <= 2029; y++) for (const m of [6, 11]) { const d = firstSunday(y, m); const k = dayKey(d); if (dayNum(d) >= now) out.push({ k, d, official: OFFICIAL.includes(k) }); }
  return out;
}
function targetExam() { const list = examDates(); return list.find(x => x.k === S.set.target) || list[0]; }
const LEVEL_RULES = {
  N2: { pass: 90, secs: [['Kiến thức ngôn ngữ', 60, 19], ['Đọc hiểu', 60, 19], ['Nghe hiểu', 60, 19]] },
  N3: { pass: 95, secs: [['Kiến thức ngôn ngữ', 60, 19], ['Đọc hiểu', 60, 19], ['Nghe hiểu', 60, 19]] },
  N4: { pass: 90, secs: [['Kiến thức + Đọc hiểu', 120, 38], ['Nghe hiểu', 60, 19]] },
  N5: { pass: 80, secs: [['Kiến thức + Đọc hiểu', 120, 38], ['Nghe hiểu', 60, 19]] },
};
function judge(lv, scores) {
  const R = LEVEL_RULES[lv]; const total = scores.reduce((a, b) => a + b, 0);
  const fails = R.secs.map((s, i) => scores[i] < s[2] ? s[0] : null).filter(Boolean);
  return { total, ok: total >= R.pass && !fails.length, fails, need: R.pass };
}

/* ===== ROUTER ===== */
const ROUTES = [
  ['today', 'Hôm nay', '今日'], ['review', 'Ôn thẻ', '復習'], ['practice', 'Luyện tập', '練習'],
  ['lookup', 'Tra cứu', '辞書'], ['exam', 'Thi thử', '模試'], ['plan', 'Kế hoạch', '計画'],
];
let route = 'today';
function go(r) { if (location.hash !== '#' + r) location.hash = r; else { route = r; render(); } }
function readHash() { const h = location.hash.slice(1); route = ROUTES.some(x => x[0] === h) ? h : 'today'; }
window.addEventListener('hashchange', () => { readHash(); render(); window.scrollTo(0, 0); });

function renderNav() {
  $('#nav').innerHTML = ROUTES.map(([id, vi, ja]) => `<a href="#${id}" class="nv${route === id ? ' on' : ''}" ${route === id ? 'aria-current="page"' : ''}><span class="nvj" lang="ja">${ja}</span><span class="nvv">${vi}</span>${id === 'review' && dueCount() + newAvail() > 0 ? `<span class="badge">${dueCount() + newAvail()}</span>` : ''}</a>`).join('');
}
function render() {
  renderNav();
  const v = $('#view');
  v.innerHTML = ({ today: vToday, review: vReview, practice: vPractice, lookup: vLookup, exam: vExam, plan: vPlan })[route]();
  setSync(SY.mode, SY.msg);
  if (route === 'exam') drawExamTimer();
  if (route === 'lookup') { const i = $('#lkq'); if (i && LK.focus) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); LK.focus = false; } }
}

/* ===== TODAY ===== */
function streak() {
  let n = 0, d = new Date(); const act = k => { const l = S.log[k]; return l && (l.r + l.q + (l.m || 0)) > 0; };
  if (!act(dayKey(d))) d.setDate(d.getDate() - 1);
  while (act(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function currentStage() {
  for (let i = 0; i < STAGES.length; i++) { const p = stageProg(i); if (p < 0.8) return i; }
  return STAGES.length - 1;
}
function stageProg(i) { let t = 0, s = 0; STAGES[i].decks.forEach(id => { const st = deckStats(DECK[id]); t += st.total; s += st.seen; }); return t ? s / t : 0; }
function vToday() {
  const now = new Date(), te = targetExam(); const days = te ? dayNum(te.d) - dayNum(now) : 0;
  const due = dueCount(), nw = newAvail(), wk = isoWeek(), wd = now.getDay();
  const doneToday = !!(S.week[wk] && S.week[wk][wd]);
  const l = S.log[dayKey()] || { r: 0, q: 0, c: 0, m: 0 };
  const bars = []; for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const x = S.log[dayKey(d)]; bars.push({ d, n: x ? x.r + x.q : 0 }); }
  const mx = Math.max(10, ...bars.map(b => b.n));
  const cs = currentStage();
  return `
  <header class="hero">
    <div class="hero-l">
      <p class="eyebrow">${WD[now.getDay()]}, ${fmtDate(now)}</p>
      <h1>Chào Son. <span lang="ja">今日も一歩ずつ。</span></h1>
      <p class="muted">Giai đoạn hiện tại: <b>${STAGES[cs].n}</b> · ${esc(STAGES[cs].goal)}</p>
    </div>
    ${te ? `<div class="count" title="Kỳ thi mục tiêu">
      <span class="count-l" lang="ja">あと</span><span class="count-n">${days}</span><span class="count-l" lang="ja">日</span>
      <span class="count-d">đến ${fmtDate(te.d)}${te.official ? '' : ' (dự kiến)'}</span>
    </div>` : ''}
  </header>

  ${(S.place || []).length ? '' : `<div class="panel ptnudge"><div><b>Chưa biết mình đang ở đâu?</b> <span class="muted">Làm bài kiểm tra trình độ 10–20 phút để app chọn giai đoạn và bộ thẻ phù hợp.</span></div><button class="btn pri" data-a="ptStart">Kiểm tra trình độ</button></div>`}
  <section class="grid2">
    <div class="panel">
      <div class="ph"><h2>Ôn thẻ hôm nay</h2><span class="tag">FSRS · nhớ ${Math.round((S.set.ret || 0.9) * 100)}%</span></div>
      <div class="kpis">
        <div><b class="num">${due}</b><span>đến hạn</span></div>
        <div><b class="num">${nw}</b><span>thẻ mới</span></div>
        <div><b class="num">${l.r}</b><span>đã ôn hôm nay</span></div>
      </div>
      <button class="btn pri wide" data-a="startReview" ${due + nw ? '' : 'disabled'}>${due + nw ? `Ôn ${due + nw} thẻ` : 'Hôm nay đã xong thẻ'}</button>
      <p class="hint">Thẻ mới lấy từ: ${S.set.decks.map(id => DECK[id] ? DECK[id].name : '').filter(Boolean).join(', ')} · ${S.set.newPer} thẻ/ngày. Đổi ở mục Kế hoạch.</p>
    </div>

    <div class="panel">
      <div class="ph"><h2>Lịch hôm nay</h2><span class="tag">${WEEK[wd][0]}</span></div>
      <label class="check big"><input type="checkbox" id="wk-today" data-a="weekTick" data-d="${wd}" ${doneToday ? 'checked' : ''}><span>15′ ôn thẻ + ${esc(WEEK[wd][1])}</span></label>
      <div class="sess" id="sess">${sessHTML()}</div>
    </div>
  </section>

  <section class="grid2">
    <div class="panel">
      <div class="ph"><h2>Chuỗi ngày học</h2><span class="streak"><b class="num">${streak()}</b> ngày</span></div>
      <div class="bars" role="img" aria-label="Số thẻ và câu hỏi đã làm 14 ngày qua">
        ${bars.map((b, i) => `<div class="bar${i === 13 ? ' now' : ''}" title="${fmtDate(b.d)}: ${b.n}"><i style="height:${Math.round(b.n / mx * 100)}%"></i><span>${b.d.getDate()}</span></div>`).join('')}
      </div>
      <p class="hint">Mỗi cột: số thẻ đã ôn + câu luyện tập trong ngày.</p>
    </div>
    <div class="panel">
      <div class="ph"><h2>Lộ trình 0 → N2</h2><a class="lnk" href="#plan">Chi tiết</a></div>
      <ol class="stages">
        ${STAGES.map((s, i) => { const p = stageProg(i); return `<li class="${i === cs ? 'cur' : p >= 0.8 ? 'done' : ''}"><span class="sn">${s.n}</span><span class="sbar"><i style="width:${Math.round(p * 100)}%"></i></span><span class="sp num">${Math.round(p * 100)}%</span></li>`; }).join('')}
      </ol>
      <p class="hint">% = số thẻ đã học trong các bộ của giai đoạn đó.</p>
    </div>
  </section>`;
}

/* buổi học 60' */
let SESS = null;
function sessHTML() {
  if (!SESS) return `<div class="ph sm"><h3>Buổi học chuẩn 60′</h3></div>
    <ol class="blocks">${SESSION.map(b => `<li><b>${b[1]}′</b> ${esc(b[0])}<small>${esc(b[2])}</small></li>`).join('')}</ol>
    <button class="btn" data-a="sessStart">Bắt đầu buổi học</button>`;
  const el = (Date.now() - SESS.t0) / 1000; let acc = 0, idx = SESSION.length, rem = 0;
  for (let i = 0; i < SESSION.length; i++) { acc += SESSION[i][1] * 60; if (el < acc) { idx = i; rem = acc - el; break; } }
  if (idx >= SESSION.length) return `<p class="done-msg">Xong buổi học 60′. <span lang="ja">お疲れさまでした。</span></p><button class="btn" data-a="sessStop">Đóng</button>`;
  return `<div class="ph sm"><h3>Đang học: ${esc(SESSION[idx][0])}</h3><span class="num timer-s">${pad(Math.floor(rem / 60))}:${pad(Math.floor(rem % 60))}</span></div>
    <ol class="blocks">${SESSION.map((b, i) => `<li class="${i < idx ? 'past' : i === idx ? 'cur' : ''}"><b>${b[1]}′</b> ${esc(b[0])}<small>${esc(b[2])}</small></li>`).join('')}</ol>
    <div class="row">${idx === 0 ? '<button class="btn pri" data-a="startReview">Mở Ôn thẻ</button>' : ''}<button class="btn" data-a="sessNext">Chuyển phần tiếp</button><button class="btn ghost" data-a="sessStop">Dừng</button></div>`;
}
setInterval(() => {
  if (SESS) { const el = $('#sess'); if (el) el.innerHTML = sessHTML(); const elapsed = (Date.now() - SESS.t0) / 1000; let acc = 0, idx = 4; for (let i = 0; i < 4; i++) { acc += SESSION[i][1] * 60; if (elapsed < acc) { idx = i; break; } } if (SESS.idx !== idx) { if (SESS.idx != null) beep(); SESS.idx = idx; if (idx >= 4) { logAdd('m', 60); save(); } } }
  if (EX.run) drawExamTimer();
}, 1000);
function beep() { try { const a = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)()); const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.value = 0.08; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.35); } catch (e) { } if (navigator.vibrate) try { navigator.vibrate(200); } catch (e) { } }

/* ===== REVIEW ===== */
let RV = null;
function startReview(only) {
  const q = buildQueue(only);
  RV = { q, i: 0, flip: false, done: q.length === 0, total: q.length, only, n: 0, again: 0 };
  try { beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)()); } catch (e) { }
}
function cardFront(c) {
  const d = DECK[c.d];
  if (S.set.rev && c.d !== 'hira' && c.d !== 'kata') return `<div class="cf vi">${esc(c.m)}${c.n && c.d !== 'g2' ? `<small>${esc(c.n)}</small>` : ''}</div>`;
  return `<div class="cf${d.small || c.small ? ' small' : ''}" lang="ja">${esc(c.f)}</div>`;
}
function cardBack(c) {
  const rows = [];
  if (S.set.rev && c.d !== 'hira' && c.d !== 'kata') rows.push(`<div class="cb-main" lang="ja">${esc(c.f)}</div>`);
  if (c.r) rows.push(`<div class="cb-r" lang="ja">${esc(c.r)}</div>`);
  if (c.hv) rows.push(`<div class="cb-hv"><span class="lbl">Hán-Việt</span> ${esc(c.hv)}</div>`);
  if (!S.set.rev || c.d === 'hira' || c.d === 'kata') rows.push(`<div class="cb-m">${esc(c.m)}</div>`);
  if (c.n) rows.push(`<div class="cb-n">${esc(c.n)}</div>`);
  if (c.x) rows.push(`<div class="cb-x" lang="ja">${esc(c.x)}</div>`);
  return rows.join('');
}
function vReview() {
  if (!RV) {
    const due = dueCount(), nw = newAvail();
    return `<h1 class="pt">Ôn thẻ <span lang="ja">復習</span></h1>
    <div class="panel">
      <div class="kpis"><div><b class="num">${due}</b><span>đến hạn</span></div><div><b class="num">${nw}</b><span>thẻ mới hôm nay</span></div><div><b class="num">${Object.keys(S.srs).length}</b><span>thẻ đã học</span></div></div>
      <div class="row"><button class="btn pri" data-a="startReview" ${due + nw ? '' : 'disabled'}>Ôn tất cả (${due + nw})</button>
      <label class="check"><input type="checkbox" id="rev-toggle" data-a="toggleRev" ${S.set.rev ? 'checked' : ''}><span>Đảo chiều: nhìn nghĩa tiếng Việt, nhớ tiếng Nhật</span></label></div>
    </div>
    ${customPanel()}
    <h2 class="sh">Các bộ thẻ</h2>
    <div class="decks">${DECKS.map(d => { const s = deckStats(d); const on = S.set.decks.includes(d.id); return `<div class="dk">
      <div class="dk-h"><span class="lv">${d.lv}</span><b>${esc(d.name)}</b>${on ? '<span class="tag on">đang học</span>' : ''}</div>
      <div class="dk-bar" title="Đã học ${s.seen}/${s.total}, thuộc lâu ${s.mature}"><i class="m" style="width:${s.mature / s.total * 100}%"></i><i class="s" style="width:${(s.seen - s.mature) / s.total * 100}%"></i></div>
      <div class="dk-f"><span class="num">${s.seen}/${s.total}</span><span>${s.due ? `<b class="due">${s.due} đến hạn</b>` : ''}</span><button class="btn sm" data-a="deckReview" data-d="${d.id}">Học bộ này</button></div>
    </div>`; }).join('')}</div>
    <p class="hint">Thanh đậm: thẻ đã nhớ lâu (khoảng ôn ≥ 21 ngày). Thanh nhạt: đang học.</p>`;
  }
  if (RV.done || RV.i >= RV.q.length) {
    return `<h1 class="pt">Ôn thẻ <span lang="ja">復習</span></h1><div class="panel center">
      <div class="stamp" lang="ja">完</div>
      <h2>${RV.total ? `Xong ${RV.n} lượt ôn` : 'Không còn thẻ nào'}</h2>
      <p class="muted">${RV.total ? `${RV.again} lần bấm "Lại". Thẻ khó sẽ quay lại sớm.` : 'Thêm bộ thẻ mới hoặc tăng số thẻ mới/ngày ở mục Kế hoạch.'}</p>
      ${RV.remoteNote ? '<p class="hint">Có tiến độ mới từ thiết bị khác, đã cập nhật.</p>' : ''}
      <div class="row center"><button class="btn pri" data-a="reviewClose">Về danh sách bộ</button><a class="btn" href="#practice">Sang Luyện tập</a></div></div>`;
  }
  const c = RV.q[RV.i], st = S.srs[c.k], isNew = !st;
  const prev = [1, 2, 3, 4].map(g => sched(st, g)).map(r => r.again ? '<10 phút' : ivlLabel(r.st[1]));
  const left = RV.q.length - RV.i;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="reviewClose">Thoát</button><span class="muted">${esc(DECK[c.d].name)}${isNew ? ' · <b class="new">mới</b>' : ''}</span><span class="num muted">còn ${left}</span></div>
  <div class="rv-prog"><i style="width:${Math.round(RV.i / RV.q.length * 100)}%"></i></div>
  <div class="flash${RV.flip ? ' flipped' : ''}" data-a="${RV.flip ? '' : 'flip'}">
    ${cardFront(c)}
    ${RV.flip ? `<div class="cb">${cardBack(c)}</div>` : '<p class="tap">Chạm hoặc nhấn Space để lật</p>'}
  </div>
  <div class="rv-act">
    ${RV.flip ? `<div class="grades">
      <button class="g g1" data-a="grade" data-g="1"><b>Lại</b><span>${prev[0]}</span></button>
      <button class="g g2" data-a="grade" data-g="2"><b>Khó</b><span>${prev[1]}</span></button>
      <button class="g g3" data-a="grade" data-g="3"><b>Được</b><span>${prev[2]}</span></button>
      <button class="g g4" data-a="grade" data-g="4"><b>Dễ</b><span>${prev[3]}</span></button>
    </div>` : `<button class="btn pri wide" data-a="flip">Lật thẻ</button>`}
    <button class="btn ghost sm" data-a="speakCard">Nghe phát âm</button>
  </div>
  <p class="hint center">Phím tắt: Space lật · 1 Lại · 2 Khó · 3 Được · 4 Dễ</p>`;
}
function grade(g) {
  const c = RV.q[RV.i]; const wasNew = !S.srs[c.k];
  const r = sched(S.srs[c.k], g);
  S.srs[c.k] = r.st;
  if (wasNew) { const d = today(); if (S.nw.d !== d) S.nw = { d, c: 0 }; S.nw.c++; }
  logAdd('r'); RV.n++;
  if (r.again) { RV.again++; RV.q.splice(Math.min(RV.q.length, RV.i + 5), 0, c); }
  RV.i++; RV.flip = false;
  save(); render();
}

/* ===== PRACTICE ===== */
let QZ = null;
const PMODES = [
  { id: 'cloze', t: 'Chọn mẫu ngữ pháp', ja: '問題7', d: 'Điền mẫu đúng vào chỗ trống trong câu ví dụ.', lv: true },
  { id: 'gmean', t: 'Nghĩa mẫu ngữ pháp', ja: '意味', d: 'Nhìn mẫu, chọn nghĩa tiếng Việt.', lv: true },
  { id: 'conj', t: 'Chia động từ', ja: '活用', d: '41 động từ × 11 thể, đáp án sinh tự động.' },
  { id: 'joshi', t: 'Trợ từ', ja: '助詞', d: 'は/が, に/で, まで/までに, しか/だけ…' },
  { id: 'keigo', t: 'Kính ngữ', ja: '敬語', d: 'Chọn 尊敬語 hoặc 謙譲語 đúng.' },
  { id: 'jita', t: 'Tự / tha động từ', ja: '自他', d: 'Cho một vế, chọn vế còn lại.' },
  { id: 'yomi', t: 'Đọc kanji', ja: '問題1', d: 'Chọn cách đọc đúng của từ Hán, có bẫy trường âm, っ, âm đục.', lv: true },
  { id: 'gokei', t: 'Tiền tố / hậu tố', ja: '問題3', d: 'Điền 不・無・未・化・性… vào chỗ trống.' },
  { id: 'narabe', t: 'Sắp xếp câu ★', ja: '問題8', d: 'Xếp 4 mảnh, chọn mảnh ở vị trí ★.', lv: true },
  { id: 'shadow', t: 'Nghe & shadowing', ja: '聴解', d: 'Nghe câu ví dụ (bình thường / chậm), nhại theo, rồi mới hiện chữ.', lv: true },
  { id: 'deck', t: 'Trắc nghiệm theo bộ thẻ', ja: '単語', d: 'Kana, kanji, phó từ, bạn giả Hán-Việt…', deck: true },
];
let PR = { lv: 'N5', deck: 'hira', forms: ['masu', 'nai', 'te', 'ta'] };
function mkOpts(ans, pool, n = 4) { const set = [ans]; for (const x of shuffle(pool)) { if (set.length >= n) break; if (x && !set.includes(x)) set.push(x); } const o = shuffle(set); return { opts: o, ans: o.indexOf(ans) }; }
function genQuiz(mode) {
  const N = 10; const qs = [];
  if (mode === 'cloze') {
    const items = GRAMMAR.filter(g => g.lv === PR.lv && /\[.+\]/.test(g.x));
    for (const g of shuffle(items).slice(0, N)) {
      const ans = g.x.match(/\[(.+?)\]/)[1];
      const same = items.filter(o => o !== g && (g.gr ? o.gr === g.gr : true)).map(o => o.x.match(/\[(.+?)\]/)[1]);
      const other = items.filter(o => o !== g).map(o => o.x.match(/\[(.+?)\]/)[1]);
      const SYN = { 'へ': ['に'], 'に': ['へ'] };
      const bad = SYN[ans] || [];
      const { opts, ans: a } = mkOpts(ans, (same.length >= 6 ? same : other).filter(x => !bad.includes(x)));
      qs.push({ q: `<p class="qs" lang="ja">${esc(g.x.replace(/\[.+?\]/, '（　　）'))}</p>`, opts, ans: a, jp: true, exp: `<b lang="ja">${esc(g.p)}</b>: ${esc(g.m)}<br><span lang="ja">${brHi(g.x)}</span>`, say: unbr(g.x) });
    }
  } else if (mode === 'gmean') {
    const items = GRAMMAR.filter(g => g.lv === PR.lv);
    for (const g of shuffle(items).slice(0, N)) { const { opts, ans } = mkOpts(g.m, items.map(o => o.m)); qs.push({ q: `<p class="qs big" lang="ja">${esc(g.p)}</p>`, opts, ans, exp: `<span lang="ja">${brHi(g.x)}</span>`, say: unbr(g.x) }); }
  } else if (mode === 'conj') {
    const forms = PR.forms.length ? PR.forms : ['masu'];
    for (let n = 0; n < N; n++) {
      const [v, g, m] = pick(VERBS), f = pick(forms), fm = FORMS.find(x => x[0] === f);
      const ans = conj(v, g, f);
      const pool = FORMS.map(x => conj(v, g, x[0]));
      if (+g === 1 && v.endsWith('る')) pool.unshift(conj(v, 2, f), conj(v, 2, f));
      if (+g === 2) pool.unshift(conj(v, 1, f), conj(v, 1, f));
      const { opts, ans: a } = mkOpts(ans, pool);
      qs.push({ q: `<p class="qs big" lang="ja">${esc(v)}</p><p class="qsub">${esc(m)} → thể <b lang="ja">${fm[1]}</b> (${fm[2]})</p>`, opts, ans: a, jp: true, exp: `${GROUP_NAME[g]}. <span lang="ja">${esc(v)} → ${esc(ans)}</span>${['帰る', '入る', '走る', '知る', '切る'].includes(v) ? '. Đuôi -iru/-eru nhưng vẫn là nhóm 1.' : ''}`, say: ans.split(' (')[0] });
    }
  } else if (mode === 'joshi') {
    for (const [s, a, o, e] of shuffle(JOSHI_Q).slice(0, N)) { const opts = shuffle([a, ...o.split(',')]); qs.push({ q: `<p class="qs" lang="ja">${esc(s).replace('＿＿', '<span class="blank">（　）</span>')}</p>`, opts, ans: opts.indexOf(a), jp: true, exp: esc(e), say: s.replace('＿＿', a) }); }
  } else if (mode === 'keigo') {
    const all = KEIGO.flatMap(r => [r[1], r[2]]).filter(x => x !== '—');
    const cand = []; KEIGO.forEach(r => { if (r[1] !== '—') cand.push([r, 1]); if (r[2] !== '—') cand.push([r, 2]); });
    for (const [r, t] of shuffle(cand).slice(0, N)) {
      const ans = r[t], other = r[3 - t];
      const { opts, ans: a } = mkOpts(ans, other !== '—' && other !== ans ? [other, ...shuffle(all)] : all);
      qs.push({ q: `<p class="qs big" lang="ja">${esc(r[0])}</p><p class="qsub">→ <b lang="ja">${t === 1 ? '尊敬語' : '謙譲語'}</b> (${t === 1 ? 'tôn kính: người khác làm' : 'khiêm nhường: mình làm'})</p>`, opts, ans: a, jp: true, exp: `<span lang="ja">${esc(r[0])}</span>: 尊敬 <span lang="ja">${esc(r[1])}</span> · 謙譲 <span lang="ja">${esc(r[2])}</span>` });
    }
  } else if (mode === 'jita') {
    for (const r of shuffle(JITA).slice(0, N)) {
      const t = Math.random() < 0.5 ? 0 : 1, ans = r[1 - t];
      const { opts, ans: a } = mkOpts(ans, JITA.map(x => x[1 - t]));
      qs.push({ q: `<p class="qs big" lang="ja">${esc(r[t])}</p><p class="qsub">${esc(r[2])} → chọn ${t === 0 ? 'tha động từ (を)' : 'tự động từ (が)'}</p>`, opts, ans: a, jp: true, exp: `自 <span lang="ja">${esc(r[0])}</span> ↔ 他 <span lang="ja">${esc(r[1])}</span>` });
    }
  } else if (mode === 'yomi') {
    const pool = yomiPool(PR.lv);
    for (const [w, r] of shuffle(pool).slice(0, N)) {
      const near = pool.map(x => x[1]).filter(x => x !== r && Math.abs(x.length - r.length) <= 1);
      const traps = mutateReading(r);
      const { opts, ans } = mkOpts(r, [...shuffle(traps).slice(0, 2), ...shuffle(near)]);
      qs.push({ q: `<p class="qsub">Cách đọc của từ gạch chân</p><p class="qs huge" lang="ja"><u>${esc(w)}</u></p>`, opts, ans, jp: true, exp: `<span lang="ja">${esc(w)} → ${esc(r)}</span>`, say: r });
    }
  } else if (mode === 'gokei') {
    const items = gokeiItems();
    for (const it of shuffle(items).slice(0, N)) {
      const { opts, ans } = mkOpts(it.a, items.filter(x => x.pre === it.pre).map(x => x.a));
      qs.push({ q: `<p class="qs big" lang="ja">${esc(it.q)}</p><p class="qsub">${it.pre ? 'Tiền tố' : 'Hậu tố'} phù hợp</p>`, opts, ans, jp: true, exp: `<span lang="ja">${esc(it.w)}</span>: ${esc(it.m)}` , say: it.w });
    }
  } else if (mode === 'narabe') {
    for (const it of shuffle(narabeItems(PR.lv)).slice(0, N)) qs.push(it);
  } else if (mode === 'deck') {
    const d = DECK[PR.deck];
    for (const c of shuffle(d.cards).slice(0, N)) {
      const { opts, ans } = mkOpts(c.m, d.cards.map(o => o.m));
      qs.push({ q: `<p class="qs ${d.small ? '' : 'huge'}" lang="ja">${esc(c.f)}</p>`, opts, ans, exp: [c.r, c.hv ? 'Hán-Việt: ' + c.hv : '', c.x].filter(Boolean).map(esc).join('<br>'), say: c.say || c.f });
    }
  }
  return qs;
}
function yomiPool(lv) {
  const out = []; const kj = /[\u4e00-\u9fff]/;
  const fromEx = rows => rows.forEach(k => k[5].split(' · ').forEach(p => { const [w, r] = p.split(' '); if (w && r && kj.test(w)) out.push([w, r]); }));
  if (lv === 'N5') fromEx(KANJI5);
  else if (lv === 'N4') fromEx(KANJI4);
  else { VOCAB.filter(v => v[0] === lv && kj.test(v[2])).forEach(v => out.push([v[2], v[3]])); if (lv === 'N3') SENMON.forEach(v => out.push([v[0], v[1]])); if (lv === 'N2') NISE.forEach(v => out.push([v[0], v[1]])); }
  return out.filter((x, i) => out.findIndex(y => y[0] === x[0]) === i);
}
function mutateReading(r) {
  const out = new Set();
  const DAK = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
  const UN = Object.fromEntries(Object.entries(DAK).map(([a, b]) => [b, a]));
  const i = r.search(/[ょゅ]う|[おこそとのほもよろごぞどぼ]う/); if (i >= 0) out.add(r.slice(0, i + 1) + r.slice(i + 2));
  const j = r.search(/[ょゅ][^う]|[こそと][^うっ]/); if (j >= 0 && j < r.length - 1) out.add(r.slice(0, j + 1) + 'う' + r.slice(j + 1));
  if (r.includes('っ')) out.add(r.replace('っ', '')); else { const k = r.search(/[くきつち][かきくけこさしすせそたちつてとぱぴぷぺぽ]/); if (k >= 0) out.add(r.slice(0, k) + 'っ' + r.slice(k + 1)); }
  for (let n = 0; n < r.length; n++) { const c = r[n]; if (DAK[c] || UN[c]) { out.add(r.slice(0, n) + (DAK[c] || UN[c]) + r.slice(n + 1)); break; } }
  out.delete(r); return [...out];
}
function gokeiItems() {
  const items = [];
  GOKEI.forEach(([pat, m, ex]) => {
    const affs = pat.split('/').map(x => x.trim()); const pre = !pat.trim().startsWith('〜');
    ex.split(',').map(x => x.trim()).forEach(w => {
      for (const a of affs) { const af = a.replace(/〜/g, ''); if (pre ? w.startsWith(af) : w.endsWith(af)) { items.push({ w, a: af, pre, m, q: pre ? '（　）' + w.slice(af.length) : w.slice(0, w.length - af.length) + '（　）' }); break; } }
    });
  });
  return items;
}
function narabeItems(lv) {
  const out = [];
  GRAMMAR.filter(g => g.lv === lv && /\[.+\]/.test(g.x)).forEach(g => {
    const m = g.x.match(/^(.*?)\[(.+?)\](.*)$/); if (!m) return;
    const end = m[3].match(/[。?？]$/) ? m[3].slice(-1) : ''; const after = end ? m[3].slice(0, -1) : m[3];
    const cut = t => t ? t.split(/(?<=[はがをにでともへ、])/).filter(Boolean) : [];
    const segs = [...cut(m[1]), m[2], ...cut(after)]; const mi = cut(m[1]).length;
    if (segs.length < 5) return;
    let st = Math.max(0, Math.min(mi - 1, segs.length - 4)); if (st === 0 && segs.length > 4 && mi >= 1) st = Math.min(1, segs.length - 4);
    const pieces = segs.slice(st, st + 4); if (new Set(pieces).size < 4 || pieces.some(p => p.length < 1)) return;
    const pre = segs.slice(0, st).join(''), post = segs.slice(st + 4).join('') + end;
    const star = Math.floor(Math.random() * 4); const opts = shuffle(pieces); const ans = opts.indexOf(pieces[star]);
    const slots = [0, 1, 2, 3].map(i => i === star ? '<b class="star">★</b>' : '<span class="slot">＿＿</span>').join(' ');
    out.push({ q: `<p class="qs" lang="ja">${esc(pre)} ${slots} ${esc(post)}</p>`, opts, ans, jp: true, exp: `Câu đúng: <span lang="ja">${brHi(g.x)}</span><br>Mẫu <b lang="ja">${esc(g.p)}</b>: ${esc(g.m)}`, say: unbr(g.x) });
  });
  return out;
}
function startQuiz(mode) { if (mode === 'shadow') { startShadow(); return; } QZ = { mode, qs: genQuiz(mode), i: 0, pick: null, ok: 0, wrong: [] }; render(); }
function vPractice() {
  if (typeof PT !== 'undefined' && PT) return vPlacement();
  if (SH) return vShadow();
  if (QZ) return vQuiz();
  const lvSel = `<div class="seg" role="group" aria-label="Cấp">${['N5', 'N4', 'N3', 'N2'].map(l => `<button class="${PR.lv === l ? 'on' : ''}" data-a="prLv" data-v="${l}">${l}</button>`).join('')}</div>`;
  return `<h1 class="pt">Luyện tập <span lang="ja">練習</span></h1>
  ${placementCard()}
  <h2 class="sh">Luyện theo dạng</h2>
  <p class="muted">Mỗi lượt 10 câu, có giải thích ngay sau khi chọn. Kết quả tính vào chuỗi ngày học.</p>
  <div class="modes">${PMODES.map(m => { const st = S.qs[m.id]; return `<div class="mode">
    <div class="mh"><span class="mj" lang="ja">${m.ja}</span><h3>${m.t}</h3></div>
    <p>${m.d}</p>
    ${m.lv ? lvSel : ''}
    ${m.id === 'conj' ? `<div class="chips">${FORMS.map(f => `<button class="chip${PR.forms.includes(f[0]) ? ' on' : ''}" data-a="prForm" data-v="${f[0]}" lang="ja">${f[1]}</button>`).join('')}</div>` : ''}
    ${m.deck ? `<select id="pr-deck" data-a="prDeck">${DECKS.map(d => `<option value="${d.id}" ${PR.deck === d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}</select>` : ''}
    <div class="mf"><span class="muted num">${st ? `Đúng ${st.c}/${st.n} (${Math.round(st.c / st.n * 100)}%)` : 'Chưa làm'}</span><button class="btn pri sm" data-a="startQuiz" data-v="${m.id}">Bắt đầu</button></div>
  </div>`; }).join('')}</div>`;
}
function vQuiz() {
  const m = PMODES.find(x => x.id === QZ.mode);
  if (!QZ.qs.length) return `<div class="panel center"><p>Chưa có câu hỏi cho lựa chọn này.</p><button class="btn" data-a="quizClose">Quay lại</button></div>`;
  if (QZ.i >= QZ.qs.length) {
    const pct = Math.round(QZ.ok / QZ.qs.length * 100);
    return `<div class="panel center"><div class="stamp${pct >= 70 ? '' : ' grey'}" lang="ja">${pct >= 70 ? '良' : '復'}</div>
    <h2>${QZ.ok}/${QZ.qs.length} câu đúng</h2><p class="muted">${pct >= 70 ? 'Đạt mức an toàn khi luyện đề (≥ 65–70%).' : 'Dưới 70%. Xem lại các câu sai bên dưới rồi làm lượt mới.'}</p>
    ${QZ.wrong.length ? `<div class="wrong">${QZ.wrong.map(w => `<div class="wi">${w.q}<p class="ok">→ <span lang="ja">${esc(w.opts[w.ans])}</span></p><p class="exp">${w.exp}</p></div>`).join('')}</div>` : ''}
    <div class="row center"><button class="btn pri" data-a="startQuiz" data-v="${QZ.mode}">Lượt mới</button><button class="btn" data-a="quizClose">Các dạng khác</button></div></div>`;
  }
  const q = QZ.qs[QZ.i], done = QZ.pick != null;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="quizClose">Thoát</button><span class="muted"><span lang="ja">${m.ja}</span> · ${m.t}${m.lv ? ' ' + PR.lv : ''}</span><span class="num muted">${QZ.i + 1}/${QZ.qs.length}</span></div>
  <div class="rv-prog"><i style="width:${Math.round(QZ.i / QZ.qs.length * 100)}%"></i></div>
  <div class="qcard">${q.q}</div>
  <div class="opts">${q.opts.map((o, i) => `<button class="opt${done ? (i === q.ans ? ' right' : i === QZ.pick ? ' wrongp' : ' dim') : ''}" data-a="answer" data-i="${i}" ${done ? 'disabled' : ''} ${q.jp ? 'lang="ja"' : ''}><span class="ok-n">${i + 1}</span>${esc(o)}</button>`).join('')}</div>
  ${done ? `<div class="expl ${QZ.pick === q.ans ? 'good' : 'bad'}"><b>${QZ.pick === q.ans ? 'Đúng.' : 'Chưa đúng.'}</b> ${q.exp}</div>
  <div class="row">${q.say ? '<button class="btn ghost" data-a="speakQ">Nghe câu</button>' : ''}<button class="btn pri" data-a="nextQ" id="nextq">${QZ.i + 1 < QZ.qs.length ? 'Câu tiếp' : 'Xem kết quả'}</button></div>` : '<p class="hint">Phím tắt: 1–4 để chọn, Enter sang câu tiếp.</p>'}`;
}

/* ===== LOOKUP ===== */
let LK = { sec: 'grammar', q: '', lv: 'all', gr: 'all', verb: 0, hv: 'học' };
const LSECS = [['grammar', 'Ngữ pháp'], ['hv', 'Hán-Việt → On'], ['kanji', 'Kanji & bộ thủ'], ['verb', 'Chia động từ'], ['keigo', 'Kính ngữ'], ['joshi', 'Trợ từ'], ['vocab', 'Từ vựng'], ['kaiwa', 'Văn nói'], ['tips', 'Mẹo phân biệt']];
function match(...parts) { if (!LK.q) return true; const q = LK.q.toLowerCase(); return parts.join(' ').toLowerCase().includes(q); }
function vLookup() {
  const hasSearch = !['verb', 'hv', 'tips'].includes(LK.sec);
  return `<h1 class="pt">Tra cứu <span lang="ja">辞書</span></h1>
  <div class="tabs" role="tablist">${LSECS.map(([id, t]) => `<button role="tab" class="${LK.sec === id ? 'on' : ''}" aria-selected="${LK.sec === id}" data-a="lkSec" data-v="${id}">${t}</button>`).join('')}</div>
  ${hasSearch ? `<div class="search"><input id="lkq" type="search" placeholder="Tìm: mẫu, nghĩa, ví dụ, Hán-Việt…" value="${esc(LK.q)}" data-a="lkSearch" autocomplete="off"></div>` : ''}
  <div id="lkbody">${lkBody()}</div>`;
}
function lkBody() {
  switch (LK.sec) {
    case 'grammar': {
      const rows = GRAMMAR.filter(g => (LK.lv === 'all' || g.lv === LK.lv) && (LK.gr === 'all' || g.gr === LK.gr) && match(g.p, g.m, g.x, g.lv));
      return `<div class="row wrap">
        <div class="seg">${['all', 'N5', 'N4', 'N3', 'N2'].map(l => `<button class="${LK.lv === l ? 'on' : ''}" data-a="lkLv" data-v="${l}">${l === 'all' ? 'Tất cả' : l}</button>`).join('')}</div>
        ${LK.lv === 'N2' ? `<select id="lk-gr" data-a="lkGr"><option value="all">Mọi nhóm N2</option>${Object.entries(G2_GROUPS).map(([k, v]) => `<option value="${k}" ${LK.gr === k ? 'selected' : ''}>${k}. ${v}</option>`).join('')}</select>` : ''}
        <span class="muted num">${rows.length} mẫu</span></div>
      <div class="glist">${rows.map(g => `<article class="gi">
        <div class="gh"><span class="lv">${g.lv}${g.gr ? '·' + g.gr : ''}</span><h3 lang="ja">${esc(g.p)}</h3></div>
        <p class="gm">${esc(g.m)}</p>
        <p class="gx" lang="ja">${brHi(g.x)}</p>
        <div class="ga"><button class="btn ghost sm" data-a="say" data-v="${esc(unbr(g.x))}">Nghe</button><button class="btn ghost sm" data-a="askG" data-v="${esc(g.p)}" data-l="${g.lv}">Hỏi Claude</button></div>
      </article>`).join('') || '<p class="muted">Không tìm thấy mẫu nào.</p>'}</div>`;
    }
    case 'hv': return `<div class="panel">
        <div class="ph"><h2>Đoán âm On từ âm Hán-Việt</h2></div>
        <div class="row"><input id="hvq" type="text" value="${esc(LK.hv)}" data-a="hvInput" placeholder="Nhập 1 âm, ví dụ: học, thuyết, đông" autocomplete="off"></div>
        <div id="hvout">${hvGuess(LK.hv)}</div>
        <p class="hint">Đây là xu hướng đúng phần lớn trường hợp, không phải luật tuyệt đối. Âm Kun không theo quy tắc này.</p>
      </div>
      <h2 class="sh">Vần cuối</h2>${table(['Hán-Việt', '→ âm On', 'Ví dụ'], HV_FINAL)}
      <h2 class="sh">Phụ âm đầu</h2>${table(['Hán-Việt', '→ âm On', 'Ví dụ'], HV_INITIAL)}
      <h2 class="sh">Bạn giả: từ Hán nghĩa khác tiếng Việt</h2>${table(['Từ', 'Đọc', 'Hán-Việt', 'Nghĩa tiếng Nhật'], NISE, [0, 1])}
      <h2 class="sh">Từ ngành môi trường / xử lý nước</h2>${table(['Từ', 'Đọc', 'Hán-Việt', 'Nghĩa'], SENMON, [0, 1])}`;
    case 'kanji': {
      const ks = KANJI5.filter(k => match(...k)); const k4 = KANJI4.filter(k => match(...k));
      const rs = RADICALS.filter(r => match(...r));
      return `<h2 class="sh">Kanji N5 <span class="muted num">${ks.length}</span></h2>
      <div class="kgrid">${ks.map(([c, hv, on, kun, m, ex]) => `<button class="kc" data-a="say" data-v="${esc(ex.split(' ')[0])}" title="Nghe từ ví dụ"><span class="kch" lang="ja">${c}</span><span class="khv">${hv}</span><span class="km">${esc(m)}</span><span class="kr" lang="ja">${esc(on)} · ${esc(kun)}</span><span class="kx" lang="ja">${esc(ex)}</span></button>`).join('')}</div>
      <h2 class="sh">Kanji N4 <span class="muted num">${k4.length}</span></h2>
      <div class="kgrid">${k4.map(([c, hv, on, kun, m, ex]) => `<button class="kc" data-a="say" data-v="${esc(ex.split(' ')[0])}" title="Nghe từ ví dụ"><span class="kch" lang="ja">${c}</span><span class="khv">${hv}</span><span class="km">${esc(m)}</span><span class="kr" lang="ja">${esc(on)} · ${esc(kun)}</span><span class="kx" lang="ja">${esc(ex)}</span></button>`).join('')}</div>
      <h2 class="sh">Bộ thủ quan trọng <span class="muted num">${rs.length}</span></h2>${table(['Bộ', 'Tên', 'Nghĩa gợi ý', 'Ví dụ'], rs, [0, 3])}
      <h2 class="sh">Chữ hay nhầm</h2><p class="pairs" lang="ja">待/持/特 · 未/末 · 土/士 · 責/積/績 · 険/検/験 · 復/複/腹 · 微/徴 · 析/折 · 侍/待</p>`;
    }
    case 'verb': {
      const [v, g, m] = VERBS[LK.verb];
      return `<div class="row wrap"><label for="lk-verb">Động từ</label><select id="lk-verb" data-a="lkVerb">${VERBS.map(([vv, gg, mm], i) => `<option value="${i}" ${i === LK.verb ? 'selected' : ''}>${vv} · ${mm}</option>`).join('')}</select><span class="tag">${GROUP_NAME[g]}</span></div>
      <div class="tbl"><table><thead><tr><th>Thể</th><th>Dùng khi</th><th>Dạng</th></tr></thead><tbody>${FORMS.map(f => `<tr><td lang="ja">${f[1]}</td><td>${f[2]}</td><td lang="ja" class="em"><button class="lnkb" data-a="say" data-v="${esc(conj(v, g, f[0]).split(' (')[0])}">${esc(conj(v, g, f[0]))}</button></td></tr>`).join('')}</tbody></table></div>
      <h2 class="sh">Ba nhóm</h2>
      <ul class="plain"><li><b>Nhóm 1 (五段)</b>: đuôi u bất kỳ. Cẩn thận: <span lang="ja">帰る, 入る, 走る, 知る, 切る, 要る, 減る, 限る, 喋る</span> đuôi -iru/-eru nhưng vẫn là nhóm 1.</li><li><b>Nhóm 2 (一段)</b>: đuôi -iru / -eru: <span lang="ja">食べる, 見る, 起きる</span>.</li><li><b>Nhóm 3</b>: <span lang="ja">する, 来る</span>, N + する.</li></ul>
      <h2 class="sh">Thể て / た nhóm 1</h2>
      ${table(['Đuôi', '→ て', 'Ví dụ'], L(`う, つ, る|って|買って, 待って, 帰って\nむ, ぶ, ぬ|んで|読んで, 遊んで, 死んで\nく|いて (riêng 行く → 行って)|書いて\nぐ|いで|泳いで\nす|して|話して`), [0, 1, 2])}
      <p class="hint">Thể khả năng nhóm 2 bỏ ら (見れる, 食べれる) chỉ dùng trong văn nói, không dùng khi thi. Tính từ: 高い → 高くない / 高かった / 高くて / 高ければ · いい → よくない / よかった.</p>`;
    }
    case 'keigo': {
      const rows = KEIGO.filter(r => match(...r));
      return `${table(['Thường', '尊敬語 (người khác làm)', '謙譲語 (mình làm)'], rows, [0, 1, 2])}
      <h2 class="sh">Công thức chung</h2>
      <ul class="plain"><li><b>尊敬</b>: <span lang="ja">お + Vます + になる</span> (お待ちになる) · <span lang="ja">ご + N + になる</span> (ご利用になる) · <span lang="ja">Vられる</span> · <span lang="ja">お/ご～ください</span></li>
      <li><b>謙譲</b>: <span lang="ja">お + Vます + する / いたす</span> (お持ちします) · <span lang="ja">ご + N + する</span> (ご案内します) · <span lang="ja">Vさせていただく</span></li>
      <li>Không dùng 尊敬語 cho người trong công ty mình khi nói với khách.</li></ul>
      <h2 class="sh">Câu mẫu ở lab, công ty</h2>${table(['Câu', 'Nghĩa'], KEIGO_PHRASES.filter(r => match(...r)), [0])}`;
    }
    case 'joshi': return table(['Cặp', 'Phân biệt', 'Ví dụ'], L(`
は / が|は nêu chủ đề (thông tin cũ, đối chiếu); が nêu chủ ngữ (thông tin mới, câu hỏi với 誰/何, mệnh đề phụ)|私は学生です。/ 誰が来ましたか。/ 私が作った料理
に / で (nơi chốn)|に: nơi tồn tại, đích đến; で: nơi xảy ra hành động|部屋にいる。/ 部屋で勉強する。
に / へ|gần giống; に nhấn đích, へ nhấn hướng|駅に着く。/ 北へ向かう。
を (đi qua)|nơi đi qua, rời khỏi|公園を散歩する。/ 家を出る。
から / ので|から chủ quan, văn nói; ので khách quan, lịch sự|熱があるので、休みます。
と / や|と liệt kê đủ; や liệt kê tiêu biểu (còn nữa)|机の上にペンやノートがある。
まで / までに|まで: liên tục đến lúc; までに: hạn chót|5時まで待つ。/ 5時までに来る。
に (bị động, cho/nhận)|người thực hiện|先生にほめられた。/ 友達にもらった。
で (nguyên nhân, phạm vi)|do, trong|風邪で休んだ。/ クラスで一番
しか～ない / だけ|しか + phủ định nhấn "chỉ có (ít)"|100円しかない。/ 100円だけある。`).filter(r => match(...r)), [2]);
    case 'vocab': return `${Object.entries(VOCAB_TOPICS).map(([id, name]) => { const rows = VOCAB.filter(v => v[1] === id && match(...v)).map(v => [v[2], v[3], v[4], v[5], v[0], v[6]]); return rows.length ? `<h2 class="sh">${esc(name)} <span class="muted num">${rows.length}</span></h2>${table(['Từ', 'Đọc', 'Hán-Việt', 'Nghĩa', 'Cấp', 'Ví dụ'], rows, [0, 1, 5])}` : ''; }).join('')}
      <h2 class="sh">Tự / tha động từ</h2><p class="hint">Cặp -aru / -eru: -aru là tự. Cặp có -su: -su là tha.</p>${table(['Tự (が)', 'Tha (を)', 'Nghĩa'], JITA.filter(r => match(...r)), [0, 1])}
      <h2 class="sh">Phó từ N2</h2>${table(['Từ', 'Nghĩa', 'Ví dụ'], FUKUSHI.filter(r => match(...r)), [0, 2])}
      <h2 class="sh">Động từ ghép (Vます + …)</h2>${table(['Hậu tố', 'Nghĩa', 'Ví dụ'], FUKUGO.filter(r => match(...r)), [0, 2])}
      <h2 class="sh">Tiền tố / hậu tố (問題3)</h2>${table(['Phụ tố', 'Nghĩa', 'Ví dụ'], GOKEI.filter(r => match(...r)), [0, 2])}
      <h2 class="sh">Từ ngành</h2>${table(['Từ', 'Đọc', 'Hán-Việt', 'Nghĩa'], SENMON.filter(r => match(...r)), [0, 1])}`;
    case 'kaiwa': return `${table(['Văn nói', 'Gốc', 'Ví dụ'], KAIWA.filter(r => match(...r)), [0, 1, 2])}<p class="hint">Bắt buộc cho phần nghe 即時応答 (問題4).</p>`;
    case 'tips': return `<div class="tips">${TIPS.map(([t, d]) => `<div class="tip"><h3 lang="ja">${esc(t)}</h3><p>${d}</p></div>`).join('')}</div>`;
  }
}
function table(head, rows, jpCols = []) {
  if (!rows.length) return '<p class="muted">Không có kết quả.</p>';
  return `<div class="tbl"><table><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${jpCols.includes(i) ? ' lang="ja"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function hvGuess(raw) {
  const s = (raw || '').trim().toLowerCase(); if (!s) return '';
  const plain = s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const isD = s.startsWith('đ');
  let fin = null;
  const F = [[/(c|ch)$/, 0], [/t$/, 1], [/p$/, 2], [/ng$/, 4], [/nh$/, 5], [/(m|n)$/, 3], [/(ao|ieu)$/, 6], [/(uu)$/, 7], [/(ai|oi)$/, 8], [/(i|y)$/, 9], [/u$/, 7]];
  for (const [re, i] of F) if (re.test(plain)) { fin = HV_FINAL[i]; break; }
  let ini = null;
  if (isD) ini = HV_INITIAL[4];
  else if (/^(gi)/.test(plain)) ini = HV_INITIAL[0];
  else if (/^(ng|nh)/.test(plain)) ini = HV_INITIAL[2];
  else if (/^(kh|qu|c|k)/.test(plain)) ini = HV_INITIAL[0];
  else if (/^(th|tr|ch|t|s|x)/.test(plain)) ini = HV_INITIAL[3];
  else if (/^(ph|b|v)/.test(plain)) ini = HV_INITIAL[5];
  else if (/^h/.test(plain)) ini = HV_INITIAL[1];
  else if (/^m/.test(plain)) ini = HV_INITIAL[6];
  else if (/^l/.test(plain)) ini = HV_INITIAL[7];
  else if (/^(d)/.test(plain)) ini = HV_INITIAL[8];
  else if (/^[aeiouy]/.test(plain)) ini = HV_INITIAL[9];
  const ex = KANJI5.filter(k => k[1].split(/[ /]/).some(x => x === s));
  return `<div class="guess">
    ${ini ? `<div><span class="lbl">Phụ âm đầu</span><b>${esc(ini[0])} → ${esc(ini[1])}</b><small lang="ja">${esc(ini[2])}</small></div>` : ''}
    ${fin ? `<div><span class="lbl">Vần cuối</span><b>${esc(fin[0])} → ${esc(fin[1])}</b><small lang="ja">${esc(fin[2])}</small></div>` : ''}
    ${ex.length ? `<div><span class="lbl">Kanji N5 có âm này</span><b lang="ja">${ex.map(k => k[0] + ' ' + k[2]).join(' · ')}</b></div>` : ''}
    ${!ini && !fin ? '<p class="muted">Không khớp quy tắc nào.</p>' : ''}
  </div>`;
}

/* ===== EXAM ===== */
let EX = { run: false, part: 0, t0: 0, acc: 0, lv: 'N2' };
try { const e = JSON.parse(localStorage.getItem(LSK + '-timer') || 'null'); if (e) EX = { ...EX, ...e }; } catch (e) { }
const PARTS = [['Kiến thức ngôn ngữ + Đọc hiểu', 105], ['Nghe hiểu', 50]];
function exSave() { try { localStorage.setItem(LSK + '-timer', JSON.stringify(EX)); } catch (e) { } }
function exElapsed() { return EX.acc + (EX.run ? (Date.now() - EX.t0) / 1000 : 0); }
let wakeLock = null;
async function wake(on) { try { if (on && navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen'); else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; } } catch (e) { } }
function drawExamTimer() {
  const el = $('#extimer'); if (!el) return;
  const tot = PARTS[EX.part][1] * 60, e = exElapsed(), rem = Math.max(0, tot - e);
  if (EX.run && rem <= 0) { EX.run = false; EX.acc = tot; exSave(); beep(); wake(false); }
  const min = e / 60;
  let note = '';
  if (EX.part === 0) note = min < 30 ? 'Đang ở phần Kiến thức ngôn ngữ: mục tiêu xong trong 30 phút.' : min < 100 ? 'Chuyển sang Đọc hiểu (~70 phút). Không quay lại câu khó quá 1 lần.' : '5 phút cuối: dò lại phiếu, không bỏ trống câu nào.';
  else note = 'Nghe hiểu: không quay lại câu đã qua; tô đáp án ngay.';
  el.innerHTML = `<div class="clock num ${rem < 300 ? 'late' : ''}">${pad(Math.floor(rem / 60))}:${pad(Math.floor(rem % 60))}</div>
    <div class="cbar"><i style="width:${Math.min(100, e / tot * 100)}%"></i>${EX.part === 0 ? '<b style="left:28.57%" title="30 phút"></b><b style="left:95.24%" title="100 phút"></b>' : ''}</div>
    <p class="cnote">${note}</p>
    <div class="row">${EX.run ? '<button class="btn" data-a="exPause">Tạm dừng</button>' : `<button class="btn pri" data-a="exStart" ${rem <= 0 ? 'disabled' : ''}>${e > 0 ? 'Tiếp tục' : 'Bắt đầu'}</button>`}<button class="btn ghost" data-a="exReset">Đặt lại</button></div>`;
}
function vExam() {
  const R = LEVEL_RULES[EX.lv];
  const hist = S.exams.slice().sort((a, b) => a.d < b.d ? -1 : 1);
  return `<h1 class="pt">Thi thử <span lang="ja">模試</span></h1>
  <section class="grid2">
    <div class="panel">
      <div class="ph"><h2>Đồng hồ thi</h2></div>
      <div class="seg">${PARTS.map((p, i) => `<button class="${EX.part === i ? 'on' : ''}" data-a="exPart" data-v="${i}">${p[0]} · ${p[1]}′</button>`).join('')}</div>
      <div id="extimer" class="extimer"></div>
    </div>
    <div class="panel">
      <div class="ph"><h2>Nhập điểm</h2><div class="seg sm">${Object.keys(LEVEL_RULES).map(l => `<button class="${EX.lv === l ? 'on' : ''}" data-a="exLv" data-v="${l}">${l}</button>`).join('')}</div></div>
      <form id="scoreform" class="sform" data-a="noop">
        <label>Ngày <input id="sf-d" type="date" value="${dayKey()}" required></label>
        ${R.secs.map((s, i) => `<label>${s[0]} <small>(0–${s[1]}, liệt &lt; ${s[2]})</small><input id="sf-${i}" type="number" inputmode="numeric" min="0" max="${s[1]}" required placeholder="0–${s[1]}"></label>`).join('')}
        <button class="btn pri" type="submit">Lưu và chấm</button>
      </form>
      <div id="judge"></div>
      <p class="hint">${EX.lv}: đỗ khi tổng ≥ ${R.pass}/180 và mỗi phần đạt điểm liệt. Mục tiêu an toàn khi luyện: đúng ~65–70% mỗi phần.</p>
    </div>
  </section>
  <section class="panel">
    <div class="ph"><h2>Lịch sử điểm</h2><span class="muted num">${hist.length} đề</span></div>
    ${hist.length ? examChart(hist) + `<div class="tbl"><table><thead><tr><th>Ngày</th><th>Cấp</th><th>Điểm từng phần</th><th>Tổng</th><th>Kết quả</th><th></th></tr></thead><tbody>${hist.map(h => { const j = judge(h.lv, h.s); return `<tr><td class="num">${h.d}</td><td>${h.lv}</td><td class="num">${h.s.join(' / ')}</td><td class="num"><b>${j.total}</b></td><td>${j.ok ? '<span class="pill good">Đỗ</span>' : `<span class="pill bad">Trượt</span>${j.fails.length ? ' <small>liệt: ' + j.fails.join(', ') + '</small>' : ''}`}</td><td>${EX.del === h.id ? `<button class="btn sm danger" data-a="exDelYes" data-v="${h.id}">Xóa?</button>` : `<button class="btn ghost sm" data-a="exDel" data-v="${h.id}" aria-label="Xóa">Xóa</button>`}</td></tr>`; }).join('')}</tbody></table></div>`
      : '<p class="muted">Chưa có đề nào. Từ giai đoạn N2, làm 1 đề thi thử mỗi 2 tuần, bấm giờ đủ 105 + 50 phút, rồi nhập điểm ở đây.</p>'}
  </section>
  ${(S.place || []).length ? `<section class="panel"><div class="ph"><h2>Lịch sử kiểm tra trình độ</h2><button class="btn sm" data-a="ptStart">Làm lại</button></div>${ptHistoryHTML()}</section>` : ''}
  <section class="grid2">
    <details class="panel" open><summary><h2>Cấu trúc N2: Kiến thức + Đọc (105′)</h2></summary>${table(['問題', 'Dạng', 'Làm gì', 'Số câu'], EXAM_PARTS, [1])}</details>
    <details class="panel" open><summary><h2>Nghe hiểu (50′)</h2></summary>${table(['問題', 'Dạng', 'Mẹo', 'Số câu'], LISTEN_PARTS, [1])}
    <ul class="plain"><li>Kiến thức ngôn ngữ là phần dễ kéo điểm nhất (học thuộc được).</li><li>Đọc hiểu tốn thời gian nhất: đọc câu hỏi trước, ý chính thường ở đoạn cuối hoặc sau しかし / つまり.</li><li>Nghe hiểu là phần người sống ở Nhật có lợi thế.</li><li>Không bỏ trống câu nào: câu sai không bị trừ điểm.</li></ul></details>
  </section>`;
}
function examChart(h) {
  const W = 640, H = 180, P = { l: 34, r: 12, t: 12, b: 26 };
  const xs = i => P.l + (h.length === 1 ? (W - P.l - P.r) / 2 : i * (W - P.l - P.r) / (h.length - 1));
  const ys = v => P.t + (1 - v / 180) * (H - P.t - P.b);
  const pass = judge(h[h.length - 1].lv, h[h.length - 1].s).need;
  const pts = h.map((x, i) => [xs(i), ys(judge(x.lv, x.s).total)]);
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tổng điểm các đề thi thử">
    ${[0, 60, 120, 180].map(v => `<line x1="${P.l}" x2="${W - P.r}" y1="${ys(v)}" y2="${ys(v)}" class="gl"/><text x="${P.l - 6}" y="${ys(v) + 4}" text-anchor="end" class="ax">${v}</text>`).join('')}
    <line x1="${P.l}" x2="${W - P.r}" y1="${ys(pass)}" y2="${ys(pass)}" class="passl"/><text x="${W - P.r}" y="${ys(pass) - 5}" text-anchor="end" class="ax shu">đỗ ${pass}</text>
    ${pts.length > 1 ? `<polyline points="${pts.map(p => p.join(',')).join(' ')}" class="ln" fill="none"/>` : ''}
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 5 : 3.5}" class="dot"/><text x="${p[0]}" y="${H - 8}" text-anchor="middle" class="ax">${h[i].d.slice(5).replace('-', '/')}</text>`).join('')}
  </svg></div>`;
}

/* ===== PLAN ===== */
let PL = { reset: false, imp: '', pr: 0, vals: {} };
function vPlan() {
  const wk = isoWeek(), wkS = S.week[wk] || {}, list = examDates(), te = targetExam();
  const p = PROMPTS[PL.pr];
  const filled = p.p.replace(/\{(\w+)\}/g, (_, k) => (PL.vals[PL.pr + k] ?? p.f.find(f => f[0] === k)[2]));
  const order = [1, 2, 3, 4, 5, 6, 0];
  return `<h1 class="pt">Kế hoạch <span lang="ja">計画</span></h1>
  <section class="grid2">
    <div class="panel">
      <div class="ph"><h2>Kỳ thi mục tiêu</h2></div>
      <label class="fld" for="pl-target">Chọn kỳ thi
      <select id="pl-target" data-a="setTarget">${list.map(x => `<option value="${x.k}" ${te && te.k === x.k ? 'selected' : ''}>${fmtDate(x.d)} (Chủ nhật đầu tháng ${x.d.getMonth() + 1})${x.official ? ' · đã công bố' : ' · dự kiến'}</option>`).join('')}</select></label>
      <p class="hint">Ở Nhật thi 2 lần/năm. Năm 2026: 5/7 và 6/12. Ngày 2027 trở đi chưa công bố. Đăng ký qua MyJLPT, hạn khoảng 3–4 tháng trước ngày thi: kiểm tra từ tháng 3 (kỳ tháng 7) và tháng 8 (kỳ tháng 12).</p>
      <a class="lnk" href="https://jlpt.jp/e/application/domestic_index.html" target="_blank" rel="noopener">jlpt.jp: đăng ký trong Nhật</a>
    </div>
    <div class="panel">
      <div class="ph"><h2>Mốc thời gian</h2></div>
      <ol class="tl">${MILESTONES.map(m => `<li><b class="num">${m[0]}</b><span>${esc(m[1])}</span></li>`).join('')}</ol>
      <p class="hint">Ước tính 1.200–1.800 giờ từ con số 0 đến N2 với nền Hán-Việt và sống ở Nhật.</p>
    </div>
  </section>

  <section class="panel">
    <div class="ph"><h2>Các giai đoạn</h2></div>
    <div class="stg">${STAGES.map((s, i) => { const pr = stageProg(i); return `<div class="sg"><div class="sgh"><span class="lv">${i}</span><b>${s.n}</b><span class="num muted">${Math.round(pr * 100)}%</span></div><p>${esc(s.goal)}</p><p class="muted">${s.time} · ${esc(s.out)}</p><div class="dk-bar"><i class="m" style="width:${pr * 100}%"></i></div><small class="muted">Bộ thẻ: ${s.decks.map(d => DECK[d].name).join(', ')}</small></div>`; }).join('')}</div>
  </section>

  <section class="grid2">
    <div class="panel">
      <div class="ph"><h2>Lịch tuần</h2><span class="muted num">${wk}</span></div>
      <div class="weeklist">${order.map(d => `<label class="check${d === new Date().getDay() ? ' today' : ''}"><input type="checkbox" id="wk-${d}" data-a="weekTick" data-d="${d}" ${wkS[d] ? 'checked' : ''}><span><b>${WEEK[d][0]}</b> ${esc(WEEK[d][1])}</span></label>`).join('')}</div>
      <p class="hint">Mỗi ngày thêm 15′ ôn thẻ. Ghi 3 từ/câu gặp ngoài đời (biển báo, siêu thị, lab) để hỏi Claude.</p>
    </div>
    <div class="panel">
      <div class="ph"><h2>Checklist trước ngày thi</h2><span class="muted num">${CHECKLIST.filter((_, i) => S.chk[i]).length}/${CHECKLIST.length}</span></div>
      <div class="weeklist">${CHECKLIST.map((c, i) => `<label class="check"><input type="checkbox" id="chk-${i}" data-a="chk" data-i="${i}" ${S.chk[i] ? 'checked' : ''}><span>${esc(c)}</span></label>`).join('')}</div>
    </div>
  </section>

  ${reminderPanel()}

  <section class="panel" id="ask">
    <div class="ph"><h2>Hỏi Claude</h2><span class="tag">dán vào project tiếng Nhật</span></div>
    <div class="chips">${PROMPTS.map((x, i) => `<button class="chip${PL.pr === i ? ' on' : ''}" data-a="prPick" data-v="${i}">${esc(x.t)}</button>`).join('')}</div>
    <div class="pfields">${p.f.map(f => `<label class="fld" for="pf-${f[0]}">${esc(f[1])}${f[0] === 'doan' ? `<textarea id="pf-${f[0]}" data-a="pfIn" data-k="${f[0]}" rows="3">${esc(PL.vals[PL.pr + f[0]] ?? f[2])}</textarea>` : `<input id="pf-${f[0]}" data-a="pfIn" data-k="${f[0]}" value="${esc(PL.vals[PL.pr + f[0]] ?? f[2])}">`}</label>`).join('')}</div>
    <pre class="prompt" id="promptout">${esc(filled)}</pre>
    <button class="btn pri" data-a="copyPrompt">Chép câu hỏi</button>
  </section>

  <section class="panel">
    <div class="ph"><h2>Tài liệu theo cấp</h2></div>
    ${table(['Cấp', 'Giáo trình chính', 'Bổ trợ'], MATERIALS)}
  </section>

  <section class="panel" id="setup">
    <div class="ph"><h2>Cài đặt và đồng bộ</h2></div>
    <div class="syncline"><span class="dot syncdot"></span><span class="synctext">${esc(SY.msg)}</span></div>
    ${IN_CLAUDE ? '' : gistUI()}
    <label class="fld" for="set-new">Thẻ mới mỗi ngày
      <select id="set-new" data-a="setNew">${[5, 10, 15, 20, 30, 50].map(n => `<option ${S.set.newPer === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <p class="hint">Gợi ý: 10 thẻ/ngày giai đoạn N5–N4, 15–20 thẻ giai đoạn N3–N2. Học kana có thể để 30.</p>
    <fieldset class="fs"><legend>Bộ thẻ lấy thẻ mới</legend>
      <div class="deckpick">${DECKS.map(d => `<label class="check"><input type="checkbox" id="dk-${d.id}" data-a="deckTog" data-v="${d.id}" ${S.set.decks.includes(d.id) ? 'checked' : ''}><span><span class="lv">${d.lv}</span> ${esc(d.name)} <small class="muted num">${d.cards.length}</small></span></label>`).join('')}</div>
    </fieldset>
    <label class="fld" for="set-ret">Mức nhớ mục tiêu (FSRS)
      <select id="set-ret" data-a="setRet">${[[0.85, '85% · ít lượt ôn hơn'], [0.9, '90% · khuyên dùng'], [0.95, '95% · ôn nhiều hơn']].map(([v, t]) => `<option value="${v}" ${(S.set.ret || 0.9) === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    <p class="hint">Lịch ôn dùng FSRS-4.5 với tham số mặc định. Thẻ học từ trước được chuyển sang FSRS ở lần ôn kế tiếp, không mất tiến độ.</p>
    <div class="row wrap">
      <button class="btn" data-a="exportData">Xuất tiến độ</button>
      <button class="btn" data-a="importShow">Nhập tiến độ</button>
      ${PL.reset ? '<button class="btn danger" data-a="resetYes">Xóa hết, không hoàn tác được</button><button class="btn ghost" data-a="resetNo">Hủy</button>' : '<button class="btn ghost" data-a="resetAsk">Xóa toàn bộ tiến độ</button>'}
    </div>
    <div id="iobox"></div>
  </section>
  <p class="foot muted">Nội dung từ "JLPT_N2_tong_hop.md" (soạn 2/11/2026). Số kanji/từ theo cấp là ước tính phổ biến, JLPT không công bố danh sách chính thức.</p>`;
}

function gistUI() {
  const c = GIST.cfg;
  if (c && c.id) return `<div class="gist"><p>Đồng bộ qua GitHub Gist riêng tư của <b>${esc(c.login || '')}</b>. Mở app trên máy khác và dán cùng token là tiến độ tự về.</p>
    <div class="row"><button class="btn" data-a="gistSync">Đồng bộ ngay</button><a class="btn ghost" href="https://gist.github.com/${esc(c.id)}" target="_blank" rel="noopener">Xem gist</a><button class="btn ghost" data-a="gistOff">Ngắt kết nối</button></div></div>`;
  return `<div class="gist"><p><b>Đồng bộ điện thoại ↔ máy tính qua GitHub Gist.</b> Tạo token (chỉ cần quyền <code>gist</code>), dán vào đây trên từng thiết bị. Token chỉ lưu trong trình duyệt của thiết bị đó.</p>
    <a class="lnk" href="https://github.com/settings/tokens/new?scopes=gist&description=JLPT%20N2%20app" target="_blank" rel="noopener">Tạo token trên GitHub (chọn hạn dùng, giữ quyền gist)</a>
    <div class="row"><input id="gist-token" type="password" placeholder="ghp_… hoặc github_pat_…" autocomplete="off" style="flex:1;min-width:0"><button class="btn pri" data-a="gistOn">Kết nối</button></div></div>`;
}

/* ----- Nghe & shadowing ----- */
let SH = null;
function startShadow() { const list = shuffle(GRAMMAR.filter(g => g.lv === PR.lv)).slice(0, 15); SH = { list, i: 0, show: false, n: 0 }; render(); }
function vShadow() {
  if (SH.i >= SH.list.length) return `<div class="panel center"><div class="stamp" lang="ja">聴</div><h2>Xong ${SH.list.length} câu</h2><p class="muted">Mẹo: nhại ngay sau người nói, giữ đúng độ dài âm và nhịp.</p><div class="row center"><button class="btn pri" data-a="shAgain">Lượt mới</button><button class="btn" data-a="shClose">Các dạng khác</button></div></div>`;
  const g = SH.list[SH.i], t = unbr(g.x);
  return `<div class="rv-top"><button class="btn ghost sm" data-a="shClose">Thoát</button><span class="muted"><span lang="ja">聴解</span> · Nghe & shadowing ${PR.lv}</span><span class="num muted">${SH.i + 1}/${SH.list.length}</span></div>
  <div class="rv-prog"><i style="width:${Math.round(SH.i / SH.list.length * 100)}%"></i></div>
  <div class="qcard">
    <div class="row center"><button class="btn pri" data-a="shPlay" data-r="0.9">Nghe</button><button class="btn" data-a="shPlay" data-r="0.65">Nghe chậm</button><button class="btn" data-a="shPlay" data-r="1.1">Nhanh</button></div>
    ${SH.show ? `<p class="qs" lang="ja">${brHi(g.x)}</p><p class="qsub"><b lang="ja">${esc(g.p)}</b>: ${esc(g.m)}</p>` : '<p class="hint">Nghe 2–3 lần, nhại theo thành tiếng, sau đó mới hiện chữ để kiểm tra.</p>'}
  </div>
  <div class="row">${SH.show ? '' : '<button class="btn" data-a="shShow">Hiện chữ</button>'}<button class="btn pri" data-a="shNext">Câu tiếp</button></div>
  ${typeof hasJaVoice === 'function' && !hasJaVoice() ? '<p class="hint">Thiết bị chưa có giọng đọc tiếng Nhật. Trên điện thoại: cài giọng Nhật trong phần Cài đặt → Trợ năng → Nội dung đọc.</p>' : ''}`;
}

/* ----- Thẻ của mình ----- */
function customPanel() {
  const list = S.custom || [];
  return `<details class="panel" ${list.length ? '' : 'open'} id="mine"><summary><h2>Thẻ của mình <span class="muted num">${list.length}</span></h2></summary>
    <p class="hint">Ghi từ gặp ngoài đời (biển báo, siêu thị, lab) hoặc dán CSV do Claude tạo. Thẻ mới tự vào bộ "Thẻ của mình".</p>
    <div class="cuform">
      <label class="fld" for="cu-f">Tiếng Nhật<input id="cu-f" placeholder="例: 浄水場" autocomplete="off"></label>
      <label class="fld" for="cu-r">Cách đọc<input id="cu-r" placeholder="じょうすいじょう" autocomplete="off"></label>
      <label class="fld" for="cu-m">Nghĩa / Hán-Việt<input id="cu-m" placeholder="nhà máy lọc nước (tịnh thủy trường)" autocomplete="off"></label>
      <label class="fld" for="cu-x">Câu ví dụ (không bắt buộc)<input id="cu-x" autocomplete="off"></label>
    </div>
    <div class="row"><button class="btn pri" data-a="cuAdd">Thêm thẻ</button></div>
    <label class="fld" for="cu-csv">Nhập nhiều thẻ (CSV: mỗi dòng <code>tiếng Nhật;nghĩa</code> hoặc <code>tiếng Nhật;cách đọc;nghĩa;ví dụ</code>)<textarea id="cu-csv" rows="4" placeholder="浄水場;じょうすいじょう;nhà máy lọc nước;浄水場を見学した。"></textarea></label>
    <div class="row"><button class="btn" data-a="cuImport">Nhập CSV</button><span class="hint">Dấu phân cách: ; hoặc Tab hoặc ,</span></div>
    ${list.length ? `<div class="tbl"><table><thead><tr><th>Thẻ</th><th>Đọc</th><th>Nghĩa</th><th></th></tr></thead><tbody>${list.slice().reverse().map(c => `<tr><td lang="ja">${esc(c.f)}</td><td lang="ja">${esc(c.r || '')}</td><td>${esc(c.m)}</td><td>${CU_DEL === c.id ? `<button class="btn sm danger" data-a="cuDelYes" data-v="${c.id}">Xóa?</button>` : `<button class="btn ghost sm" data-a="cuDel" data-v="${c.id}">Xóa</button>`}</td></tr>`).join('')}</tbody></table></div>` : ''}
  </details>`;
}
let CU_DEL = null;
function parseCSV(text) {
  const out = [];
  text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(line => {
    const sep = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
    const c = line.split(sep).map(x => x.trim().replace(/^"(.*)"$/, '$1').replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, ''));
    if (!c[0] || /^(front|mặt trước|tiếng nhật)$/i.test(c[0])) return;
    if (c.length === 1) return;
    if (c.length === 2) out.push({ f: c[0], r: '', m: c[1], x: '' });
    else if (c.length === 3) out.push({ f: c[0], r: c[1], m: c[2], x: '' });
    else out.push({ f: c[0], r: c[1], m: c[2], x: c.slice(3).join(sep === ',' ? ', ' : ' ') });
  });
  return out;
}
function addCustom(cards) {
  S.custom = S.custom || []; const have = new Set(S.custom.map(c => c.f + '|' + c.m)); let n = 0;
  cards.forEach(c => { if (!c.f || !c.m || have.has(c.f + '|' + c.m)) return; S.custom.push({ ...c, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }); have.add(c.f + '|' + c.m); n++; });
  if (n && !S.set.decks.includes('mine')) S.set.decks = ['mine', ...S.set.decks];
  buildCustom(); save(); return n;
}

/* ----- Nhắc học hằng ngày ----- */
function reminderTimes() { const t = (S.set.remind || '20:30').split(':').map(Number); const d = new Date(); d.setHours(t[0], t[1], 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); const e = new Date(d.getTime() + 30 * 60000); const f = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`; return { s: f(d), e: f(e) }; }
function appURL() { return location.href.split('#')[0]; }
function gcalLink() {
  const { s, e } = reminderTimes(); const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Học tiếng Nhật 30′ (JLPT N2)') + '&details=' + encodeURIComponent('Ôn thẻ đến hạn + 1 phần trong lịch tuần. Mở app: ' + appURL()) + '&dates=' + s + '/' + e + '&ctz=' + encodeURIComponent(tz) + '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY');
}
function icsText() {
  const { s, e } = reminderTimes(); const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo';
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JLPT N2//VI', 'BEGIN:VEVENT', 'UID:jlpt-n2-daily-' + Date.now() + '@app', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', `DTSTART;TZID=${tz}:${s}`, `DTEND;TZID=${tz}:${e}`, 'RRULE:FREQ=DAILY', 'SUMMARY:Học tiếng Nhật 30′ (JLPT N2)', 'DESCRIPTION:Ôn thẻ đến hạn + 1 phần trong lịch tuần. ' + appURL(), 'URL:' + appURL(), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Đến giờ học tiếng Nhật', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function reminderPanel() {
  return `<section class="panel" id="remind"><div class="ph"><h2>Nhắc học hằng ngày</h2></div>
    <p class="hint">Tạo sự kiện lặp mỗi ngày trong lịch của bạn, có báo đúng giờ và link mở app. Cách này chạy trên mọi máy, không cần server.</p>
    <div class="row"><label class="fld" for="rm-time">Giờ nhắc<input id="rm-time" type="time" value="${esc(S.set.remind || '20:30')}" data-a="rmTime"></label></div>
    <div class="row"><a class="btn pri" id="rm-gcal" href="${esc(gcalLink())}" target="_blank" rel="noopener">Thêm vào Google Calendar</a>${IN_CLAUDE ? '' : '<button class="btn" data-a="rmIcs">Tải file lịch (.ics) cho iPhone / Outlook</button>'}</div>
  </section>`;
}

/* ===== ACTIONS ===== */
const ACT = {
  shPlay(t) { const g = SH.list[SH.i]; speak(unbr(g.x), +t.dataset.r); },
  shShow() { SH.show = true; render(); },
  shNext() { SH.i++; SH.show = false; logAdd('q'); logAdd('c'); save(); render(); },
  shAgain() { startShadow(); },
  shClose() { SH = null; render(); },
  cuAdd() { const v = id => ($('#' + id).value || '').trim(); const n = addCustom([{ f: v('cu-f'), r: v('cu-r'), m: v('cu-m'), x: v('cu-x') }]); toast(n ? 'Đã thêm thẻ' : 'Cần có tiếng Nhật và nghĩa (hoặc thẻ đã có)'); if (n) render(); },
  cuImport() { const cards = parseCSV($('#cu-csv').value || ''); const n = addCustom(cards); toast(n ? `Đã nhập ${n} thẻ` : 'Không đọc được dòng nào, kiểm tra dấu phân cách'); if (n) render(); },
  cuDel(t) { CU_DEL = t.dataset.v; render(); },
  cuDelYes(t) { const id = t.dataset.v; S.custom = (S.custom || []).filter(c => c.id !== id); delete S.srs['mine:' + id]; CU_DEL = null; buildCustom(); save(); render(); },
  setRet(t) { S.set.ret = +t.value; save(); toast('Đã đổi mức nhớ; áp dụng từ lần ôn tới'); },
  rmTime(t) { S.set.remind = t.value; save(); const a = $('#rm-gcal'); if (a) a.href = gcalLink(); },
  rmIcs() { try { const blob = new Blob([icsText()], { type: 'text/calendar' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'nhac-hoc-tieng-nhat.ics'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Mở file vừa tải để thêm vào lịch'); } catch (e) { toast('Thiết bị không tải được file; dùng nút Google Calendar'); } },
  async gistOn() { const t = $('#gist-token').value; if (!t.trim()) { toast('Hãy dán token trước'); return; } const ok = await GIST.connect(t); toast(ok ? 'Đã kết nối GitHub Gist' : 'Chưa kết nối được, xem thông báo ở trên'); render(); },
  gistOff() { GIST.disconnect(); render(); },
  gistSync() { GIST.sync(); },
  startReview() { startReview(); go('review'); if (route === 'review') render(); },
  deckReview(t) { startReview(t.dataset.d); render(); window.scrollTo(0, 0); },
  reviewClose() { RV = null; render(); },
  flip() { if (RV && !RV.flip) { RV.flip = true; render(); } },
  grade(t) { grade(+t.dataset.g); },
  speakCard() { const c = RV && RV.q[RV.i]; if (c) speak(c.say || c.f.replace(/^自 /, '').split(/[ (]/)[0]); },
  toggleRev(t) { S.set.rev = t.checked; save(); },
  sessStart() { SESS = { t0: Date.now(), idx: null }; beep(); $('#sess').innerHTML = sessHTML(); },
  sessNext() { if (!SESS) return; const el = (Date.now() - SESS.t0) / 1000; let acc = 0; for (const b of SESSION) { acc += b[1] * 60; if (el < acc) { SESS.t0 -= (acc - el) * 1000; break; } } $('#sess').innerHTML = sessHTML(); },
  sessStop() { SESS = null; $('#sess').innerHTML = sessHTML(); },
  weekTick(t) { const wk = isoWeek(); S.week[wk] = S.week[wk] || {}; S.week[wk][t.dataset.d] = t.checked; if (t.checked) logAdd('m', 1); save(); },
  chk(t) { S.chk[t.dataset.i] = t.checked; save(); render(); },
  prLv(t) { PR.lv = t.dataset.v; render(); },
  prForm(t) { const v = t.dataset.v; PR.forms = PR.forms.includes(v) ? PR.forms.filter(x => x !== v) : [...PR.forms, v]; render(); },
  prDeck(t) { PR.deck = t.value; },
  startQuiz(t) { startQuiz(t.dataset.v); window.scrollTo(0, 0); },
  quizClose() { QZ = null; render(); },
  answer(t) {
    if (!QZ || QZ.pick != null) return; const q = QZ.qs[QZ.i]; QZ.pick = +t.dataset.i;
    const ok = QZ.pick === q.ans; if (ok) QZ.ok++; else QZ.wrong.push(q);
    const st = S.qs[QZ.mode] || (S.qs[QZ.mode] = { n: 0, c: 0 }); st.n++; if (ok) st.c++;
    logAdd('q'); if (ok) logAdd('c'); save(); render(); const n = $('#nextq'); if (n) n.focus();
  },
  nextQ() { QZ.i++; QZ.pick = null; render(); },
  speakQ() { const q = QZ.qs[QZ.i]; if (q.say) speak(q.say); },
  lkSec(t) { LK.sec = t.dataset.v; LK.q = ''; render(); },
  lkLv(t) { LK.lv = t.dataset.v; LK.gr = 'all'; $('#lkbody').innerHTML = lkBody(); render(); },
  lkGr(t) { LK.gr = t.value; $('#lkbody').innerHTML = lkBody(); },
  lkVerb(t) { LK.verb = +t.value; $('#lkbody').innerHTML = lkBody(); },
  say(t) { speak(t.dataset.v); },
  askG(t) { copyText(`Giải thích lại mẫu ${t.dataset.v} (${t.dataset.l}) theo file JLPT_N2_tong_hop.md, phân biệt với các mẫu dễ nhầm, cho thêm 5 câu ví dụ về cuộc sống ở Nhật và phòng thí nghiệm xử lý nước, rồi cho mình 3 câu luyện kiểu 問題7.`); },
  exPart(t) { if (EX.run) { toast('Tạm dừng đồng hồ trước khi đổi phần'); return; } EX.part = +t.dataset.v; EX.acc = 0; exSave(); render(); },
  exStart() { EX.run = true; EX.t0 = Date.now(); exSave(); wake(true); try { beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)()); } catch (e) { } drawExamTimer(); },
  exPause() { EX.acc = exElapsed(); EX.run = false; exSave(); wake(false); drawExamTimer(); },
  exReset() { EX.run = false; EX.acc = 0; exSave(); wake(false); drawExamTimer(); },
  exLv(t) { EX.lv = t.dataset.v; exSave(); render(); },
  exDel(t) { EX.del = t.dataset.v; render(); },
  exDelYes(t) { S.exams = S.exams.filter(e => e.id !== t.dataset.v); EX.del = null; save(); render(); },
  setTarget(t) { S.set.target = t.value; save(); toast('Đã đặt kỳ thi mục tiêu'); },
  setNew(t) { S.set.newPer = +t.value; save(); },
  deckTog(t) { const v = t.dataset.v; S.set.decks = t.checked ? [...S.set.decks.filter(x => x !== v), v] : S.set.decks.filter(x => x !== v); S.set.decks.sort((a, b) => DECKS.findIndex(d => d.id === a) - DECKS.findIndex(d => d.id === b)); save(); },
  prPick(t) { PL.pr = +t.dataset.v; render(); },
  pfIn(t) { PL.vals[PL.pr + t.dataset.k] = t.value; const p = PROMPTS[PL.pr]; $('#promptout').textContent = p.p.replace(/\{(\w+)\}/g, (_, k) => (PL.vals[PL.pr + k] ?? p.f.find(f => f[0] === k)[2])); },
  copyPrompt() { copyText($('#promptout').textContent); },
  exportData() {
    const s = JSON.stringify(S);
    $('#iobox').innerHTML = `<label class="fld" for="io-out">Sao chép toàn bộ đoạn này, dán vào ghi chú hoặc gửi cho chính mình. Trên máy khác: Nhập tiến độ → dán vào.<textarea id="io-out" rows="5" readonly>${esc(s)}</textarea></label><button class="btn pri" data-a="copyExport">Chép</button>`;
    const ta = $('#io-out'); ta.focus(); ta.select();
  },
  copyExport() { copyText($('#io-out').value); },
  importShow() { $('#iobox').innerHTML = `<label class="fld" for="io-in">Dán dữ liệu đã xuất<textarea id="io-in" rows="5" placeholder='{"v":1,...}'></textarea></label><button class="btn pri" data-a="importDo">Nhập</button>`; $('#io-in').focus(); },
  importDo() {
    try { const o = JSON.parse($('#io-in').value); if (!o || o.v !== 1 || !o.srs) throw 0; S = merge(o); save(); toast('Đã nhập tiến độ'); render(); }
    catch (e) { toast('Dữ liệu không hợp lệ. Hãy dán đúng đoạn đã xuất.'); }
  },
  resetAsk() { PL.reset = true; render(); },
  resetNo() { PL.reset = false; render(); },
  resetYes() { const keep = S.set; S = DEF(); S.set = keep; PL.reset = false; save(); toast('Đã xóa tiến độ'); render(); },
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const a = t.dataset.a; if (!a || !ACT[a]) return;
  if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return;
  ACT[a](t, e);
});
document.addEventListener('change', e => { const t = e.target; const a = t.dataset && t.dataset.a; if (a && ACT[a] && (t.tagName === 'INPUT' || t.tagName === 'SELECT')) ACT[a](t, e); });
document.addEventListener('input', e => {
  const t = e.target, a = t.dataset && t.dataset.a;
  if (a === 'lkSearch') { LK.q = t.value; $('#lkbody').innerHTML = lkBody(); }
  else if (a === 'hvInput') { LK.hv = t.value; $('#hvout').innerHTML = hvGuess(t.value); }
  else if (a === 'pfIn') ACT.pfIn(t);
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'scoreform') return; e.preventDefault();
  const R = LEVEL_RULES[EX.lv]; const s = R.secs.map((x, i) => Math.max(0, Math.min(x[1], +$('#sf-' + i).value || 0)));
  const d = $('#sf-d').value || dayKey();
  S.exams.push({ id: Date.now().toString(36), d, lv: EX.lv, s }); logAdd('m', 1); save();
  const j = judge(EX.lv, s);
  render();
  $('#judge').innerHTML = `<div class="verdict ${j.ok ? 'good' : 'bad'}"><span class="stamp ${j.ok ? '' : 'grey'}" lang="ja">${j.ok ? '合格' : '不合格'}</span><div><b class="num">${j.total}/180</b><p>${j.ok ? 'Đạt cả tổng điểm và điểm liệt từng phần.' : j.fails.length ? 'Dưới điểm liệt ở: ' + j.fails.join(', ') + '.' : `Thiếu ${j.need - j.total} điểm so với mức đỗ ${j.need}.`}</p></div></div>`;
});
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (route === 'review' && RV && !RV.done && RV.i < RV.q.length) {
    if (e.code === 'Space' || e.key === 'Enter') { if (!RV.flip) { e.preventDefault(); ACT.flip(); } }
    else if (RV.flip && '1234'.includes(e.key)) { e.preventDefault(); grade(+e.key); }
  } else if (route === 'practice' && QZ && QZ.i < QZ.qs.length) {
    if (QZ.pick == null && '1234'.includes(e.key)) { const b = document.querySelector(`[data-a="answer"][data-i="${+e.key - 1}"]`); if (b) ACT.answer(b); }
    else if (QZ.pick != null && e.key === 'Enter') { e.preventDefault(); ACT.nextQ(); }
  }
});

