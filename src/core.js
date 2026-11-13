/* ===== UTIL ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jp = s => `<span lang="ja">${esc(s)}</span>`;
const pad = n => String(n).padStart(2, '0');
const dayNum = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const mmss = s => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
const CIRC = ['①', '②', '③', '④'];
const isoWeek = (d = new Date()) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${pad(Math.ceil(((t - y0) / 864e5 + 1) / 7))}`; };
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2800); }
function speak(text, rate = 0.9) {
  try { const u = new SpeechSynthesisUtterance(String(text)); u.lang = 'ja-JP'; u.rate = rate; try { const v = speechSynthesis.getVoices().find(x => /^ja/i.test(x.lang)); if (v) u.voice = v; } catch (e) { } speechSynthesis.cancel(); speechSynthesis.speak(u); }
  catch (e) { toast('Thiết bị này chưa đọc được tiếng Nhật'); }
}

/* ===== TRẠNG THÁI =====
   att[itemId] = [[ts, chọn, đúng(1/0), giây, số lần nghe, lý do sai], ...]  (mỗi lần làm một dòng)
   phr[id] = { t: cụm từ, n: ghi chú, src: itemId, at, s: FSRS }  (cụm lưu từ script/bài đọc, ôn trên điện thoại)
   dlog[máy][ngày] = { l: giây nghe, r: giây đọc, d: giây ôn, n: câu, c: câu đúng } */
const LSK = 'jlpt-n2-v2', LSK_OLD = 'jlpt-n2-son-v1';
const DEF = () => ({ v: 2, upd: 0, set: { target: '2028-07-02', dev: 'auto', showOpts: false, onePlay: false, lv: 'N2' }, setUpd: 0, att: {}, phr: {}, pdel: [], flag: {}, dlog: {}, log: {}, exams: [] });
let S = DEF();
function migrate(o) {
  const d = DEF(); o = o || {};
  if ((o.v || 1) < 2) return { ...d, exams: o.exams || [], set: { ...d.set, target: (o.set && o.set.target) || d.set.target, dev: (o.set && o.set.dev) || 'auto' } };
  return { ...d, ...o, set: { ...d.set, ...(o.set || {}) } };
}
try {
  const raw = localStorage.getItem(LSK);
  if (raw) S = migrate(JSON.parse(raw));
  else { const old = localStorage.getItem(LSK_OLD); if (old) S = migrate(JSON.parse(old)); }
} catch (e) { }
rebuildLog(S);
let SY = { mode: 'local', msg: 'Chưa bật đồng bộ', kind: null };
function save() {
  S.upd = Date.now();
  const sj = JSON.stringify(S.set); if (save._set !== undefined && sj !== save._set) S.setUpd = Date.now(); save._set = sj;
  try { localStorage.setItem(LSK, JSON.stringify(S)); } catch (e) { }
  if (SY.kind === 'cf') CF.schedule();
}
save._set = JSON.stringify(S.set);
function setSync(mode, msg) { SY.mode = mode; SY.msg = msg; $$('.syncdot').forEach(el => { el.dataset.m = mode; el.title = msg; }); $$('.synctext').forEach(t => t.textContent = msg); const s = $('#syncshort'); if (s) s.textContent = mode === 'cloud' ? 'Đã đồng bộ' : mode === 'error' ? 'Lỗi đồng bộ' : 'Lưu trên máy'; }
function rerenderAfterRemote() { if (!busyView()) render(); }
function logAdd(field, n = 1) { const k = dayKey(); const dd = (S.dlog[DEV] || (S.dlog[DEV] = {})); const x = dd[k] || (dd[k] = {}); x[field] = (x[field] || 0) + n; const l = S.log[k] || (S.log[k] = {}); l[field] = (l[field] || 0) + n; }

/* Thiết bị: điện thoại = ôn phần yếu; máy tính = luyện chính */
function devMode() { const s = S.set.dev; if (s === 'phone' || s === 'pc') return s; try { return matchMedia('(max-width: 860px)').matches ? 'phone' : 'pc'; } catch (e) { return 'pc'; } }

/* Đếm thời gian học thật (chỉ khi tab đang mở và có thao tác trong 2 phút gần nhất) */
const ACTIVE = { last: Date.now() };
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, () => { ACTIVE.last = Date.now(); }, { passive: true }));
setInterval(() => {
  if (document.visibilityState !== 'visible' || Date.now() - ACTIVE.last > 120000) return;
  const audioOn = window.AU && ((AU.el && !AU.el.paused) || (AU.tts && AU.tts.on));
  const exl = route === 'exam' && EXM && EXM.run && !EXM.graded ? (exLisOn() ? 'l' : 'r') : null;
  const f = exl || (route === 'listen' && (LP || audioOn) ? 'l' : route === 'read' && RP ? 'r' : (route === 'drill' && DR) || (route === 'grammar' && GP) ? 'd' : null);
  if (!f && !audioOn) return;
  logAdd(f || 'l', 15); tickSave();
}, 15000);
function tickSave() { clearTimeout(tickSave.t); tickSave.t = setTimeout(save, 3000); }

/* FSRS-4.5 cho thẻ cụm từ. Trạng thái: [due, ivl, D, S, reps, lapses, lastReview] */
const FW = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const F_DECAY = -0.5, F_FACTOR = 19 / 81;
const clampD = d => Math.min(10, Math.max(1, d));
const fD0 = g => clampD(FW[4] - (g - 3) * FW[5]);
const fIvl = st => Math.max(1, Math.min(3650, Math.round(st / F_FACTOR * (Math.pow(0.9, 1 / F_DECAY) - 1))));
function sched(st, g) {
  const dn = dayNum(); let D, Sx, reps = 0, lap = 0, last = dn; const fresh = !st;
  if (st) { D = st[2]; Sx = st[3]; reps = st[4]; lap = st[5]; last = st[6]; }
  let nD, nS;
  if (fresh) { nS = FW[g - 1]; nD = fD0(g); }
  else {
    const t = Math.max(0, dn - last), R = Math.pow(1 + F_FACTOR * t / Sx, F_DECAY);
    nD = clampD(FW[7] * fD0(3) + (1 - FW[7]) * (D - FW[6] * (g - 3)));
    if (g === 1) { nS = Math.min(Sx, FW[11] * Math.pow(D, -FW[12]) * (Math.pow(Sx + 1, FW[13]) - 1) * Math.exp(FW[14] * (1 - R))); lap++; }
    else nS = Sx * (Math.exp(FW[8]) * (11 - D) * Math.pow(Sx, -FW[9]) * (Math.exp(FW[10] * (1 - R)) - 1) * (g === 2 ? FW[15] : 1) * (g === 4 ? FW[16] : 1) + 1);
  }
  nS = +Math.max(0.1, nS).toFixed(4); nD = +nD.toFixed(3);
  if (g === 1) return [dn, 0, nD, nS, reps, lap, dn];
  const ivl = fIvl(nS); return [dn + ivl, ivl, nD, nS, reps + 1, lap, dn];
}

/* ===== NGÀY THI ===== */
function firstSunday(y, m) { const d = new Date(y, m, 1); d.setDate(1 + (7 - d.getDay()) % 7); return d; }
function examDates() { const out = [], now = dayNum(); for (let y = 2026; y <= 2030; y++) for (const m of [6, 11]) { const d = firstSunday(y, m); if (dayNum(d) >= now) out.push({ k: dayKey(d), d }); } return out; }
function targetExam() { const l = examDates(); return l.find(x => x.k === S.set.target) || l[0]; }
function judge(lv, s) { const R = LVD(LVDEF[lv] ? lv : 'N2').rule; const total = s.reduce((a, b) => a + b, 0); const fails = R.secs.map((x, i) => (s[i] || 0) < x[2] ? x[0] : null).filter(Boolean); return { total, ok: total >= R.pass && !fails.length, fails, need: R.pass }; }
/* Đổi cấp đang luyện: nội dung, dạng bài, phân tích điểm yếu đều theo cấp này */
function setLevel(lv) { if (!LVDEF[lv] || lv === curLv()) return; if (typeof audioStop === 'function') audioStop(); LP = null; RP = null; DR = null; EXM = null; S.set.lv = lv; save(); buildC(); render(); }
function lvSwitchHTML() { return `<div class="seg lvsw" role="group" aria-label="Cấp đang luyện">${LVS.map(l => `<button class="${l === curLv() ? 'on' : ''}" data-a="setLv" data-v="${l}">${l}</button>`).join('')}</div>`; }

/* ===== ĐIỀU HƯỚNG ===== */
const ROUTES = [['today', 'Hôm nay', '今日'], ['listen', 'Luyện nghe', '聴解'], ['read', 'Luyện đọc', '読解'], ['grammar', 'Ngữ pháp', '文法'], ['weak', 'Điểm yếu', '弱点'], ['drill', 'Ôn nhanh', '復習'], ['exam', 'Thi thử', '模試'], ['plan', 'Cài đặt', '設定']];
const PHONE_NAV = ['today', 'drill', 'weak', 'read', 'grammar', 'plan'];
let route = 'today';
function go(r) { if (location.hash !== '#' + r) location.hash = r; else { route = r; render(); } }
function readHash() { const h = location.hash.slice(1); route = ROUTES.some(x => x[0] === h) ? h : 'today'; }
addEventListener('hashchange', () => { readHash(); render(); scrollTo(0, 0); });
const ACT = { setLv(t) { setLevel(t.dataset.v || t.value); } };
function renderNav() {
  const ph = devMode() === 'phone', due = drillCount();
  $('#nav').innerHTML = ROUTES.filter(r => !ph || PHONE_NAV.includes(r[0]) || r[0] === route).map(([id, vi, ja]) => `<a href="#${id}" class="nv${route === id ? ' on' : ''}" ${route === id ? 'aria-current="page"' : ''}><span class="nvj" lang="ja">${ja}</span><span class="nvv">${vi}</span>${id === 'drill' && due ? `<span class="badge">${due}</span>` : ''}</a>`).join('');
}
const VIEWS = {};
function render() {
  if (render.lv !== curLv()) { render.lv = curLv(); buildC(); }
  renderNav();
  document.body.dataset.dev = devMode(); const bl = $('#brandlv'); if (bl) bl.textContent = curLv();
  $('#view').innerHTML = (VIEWS[route] || VIEWS.today)();
  setSync(SY.mode, SY.msg);
  (AFTER[route] || (() => { }))();
}
const AFTER = {};
function busyView() { return (route === 'listen' && LP && !LP.done) || (route === 'read' && RP && !RP.done) || (route === 'drill' && DR && !DR.done) || (route === 'grammar' && GP && !GP.done); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const a = t.dataset.a; if (!a || !ACT[a]) return;
  if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return;
  ACT[a](t, e);
});
document.addEventListener('change', e => { const t = e.target; const a = t.dataset && t.dataset.a; if (a && ACT[a] && (t.tagName === 'INPUT' || t.tagName === 'SELECT')) ACT[a](t, e); });
