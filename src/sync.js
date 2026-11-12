/* ===== ĐỒNG BỘ: gộp dữ liệu giữa các máy + Cloudflare (Worker + D1) ===== */
const DEV = (() => { try { let d = localStorage.getItem('jlpt-n2-dev'); if (!d) { d = Math.random().toString(36).slice(2, 10); localStorage.setItem('jlpt-n2-dev', d); } return d; } catch (e) { return 'nodev'; } })();
const LOCAL_SET_KEYS = ['dev'];
function devName() {
  const u = navigator.userAgent;
  const os = /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? 'Android' : /Mac/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : /Linux/.test(u) ? 'Linux' : 'Máy';
  const br = /Edg\//.test(u) ? 'Edge' : /CriOS|Chrome\//.test(u) ? 'Chrome' : /FxiOS|Firefox\//.test(u) ? 'Firefox' : /Safari\//.test(u) ? 'Safari' : 'trình duyệt';
  let pwa = false; try { pwa = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { }
  return os + ' · ' + (pwa ? 'app đã cài' : br);
}

/* Nhật ký thời gian lưu riêng theo máy (S.dlog[máy][ngày]) rồi cộng lại thành S.log */
function rebuildLog(st) {
  const out = {};
  Object.values(st.dlog || {}).forEach(days => Object.entries(days || {}).forEach(([d, l]) => { const o = out[d] || (out[d] = {}); Object.entries(l || {}).forEach(([f, v]) => { o[f] = (o[f] || 0) + (+v || 0); }); }));
  st.log = out; return st;
}
function unionBy(a = [], b = [], key) { const m = new Map(); [...a, ...b].forEach(x => { const k = key(x); if (!m.has(k)) m.set(k, x); }); return [...m.values()]; }
const phrReps = p => p && p.s ? (p.s[4] || 0) + (p.s[5] || 0) : -1;
/* Gộp 2 bản dữ liệu: lần làm bài gộp theo thời điểm, cụm từ theo id (giữ bản ôn nhiều hơn), nhật ký theo máy */
function mergeState(local, remote) {
  if (!remote) return local;
  const a = migrate(JSON.parse(JSON.stringify(local))), b = migrate(JSON.parse(JSON.stringify(remote)));
  const o = { ...a };
  o.resetAt = Math.max(a.resetAt || 0, b.resetAt || 0);
  o.att = {};
  new Set([...Object.keys(a.att || {}), ...Object.keys(b.att || {})]).forEach(id => {
    const m = new Map();
    [...(a.att[id] || []), ...(b.att[id] || [])].forEach(x => { if (x[0] <= o.resetAt) return; const y = m.get(x[0]); if (!y || (!y[5] && x[5])) m.set(x[0], x); });
    const arr = [...m.values()].sort((p, q) => p[0] - q[0]).slice(-30); if (arr.length) o.att[id] = arr;
  });
  o.pdel = [...new Set([...(a.pdel || []), ...(b.pdel || [])])];
  o.phr = { ...a.phr }; Object.entries(b.phr || {}).forEach(([id, p]) => { if (!o.phr[id] || phrReps(p) > phrReps(o.phr[id])) o.phr[id] = p; });
  o.pdel.forEach(id => delete o.phr[id]);
  Object.keys(o.phr).forEach(id => { if (o.phr[id].at <= o.resetAt) delete o.phr[id]; });
  o.dlog = { ...a.dlog };
  Object.entries(b.dlog || {}).forEach(([dev, days]) => {
    if (dev === DEV) return;
    const mine = o.dlog[dev] || {}; const merged = { ...mine };
    Object.entries(days || {}).forEach(([d, l]) => { const x = { ...(mine[d] || {}) }; Object.entries(l || {}).forEach(([f, v]) => { x[f] = Math.max(x[f] || 0, +v || 0); }); merged[d] = x; });
    o.dlog[dev] = merged;
  });
  rebuildLog(o);
  o.exdel = [...new Set([...(a.exdel || []), ...(b.exdel || [])])];
  o.exams = unionBy(a.exams, b.exams, x => x.id || JSON.stringify(x)).filter(x => !o.exdel.includes(x.id));
  if ((b.setUpd || 0) > (a.setUpd || 0)) { const keep = {}; LOCAL_SET_KEYS.forEach(k => { if (k in a.set) keep[k] = a.set[k]; }); o.set = { ...a.set, ...b.set, ...keep }; o.setUpd = b.setUpd; }
  o.v = 2; o.upd = Math.max(a.upd || 0, b.upd || 0);
  return o;
}

/* ----- Cloudflare ----- */
const CF = {
  KEY: 'jlpt-n2-cf', cfg: null, rev: 0, busy: false, again: false, t: 0, lastOk: 0, pair: null, recovery: null, hasOwner: null, on: false,
  load() { try { this.cfg = JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch (e) { this.cfg = null; } return this.cfg; },
  store() { try { this.cfg ? localStorage.setItem(this.KEY, JSON.stringify(this.cfg)) : localStorage.removeItem(this.KEY); } catch (e) { } },
  async call(path, opts = {}) {
    const r = await fetch('/api' + path, { method: opts.method || 'GET', body: opts.body ? JSON.stringify(opts.body) : undefined, keepalive: !!opts.keepalive, cache: 'no-store', headers: { 'content-type': 'application/json', 'x-device': DEV, 'x-device-name': encodeURIComponent(devName()), ...(this.cfg && this.cfg.key ? { authorization: 'Bearer ' + this.cfg.key } : {}) } });
    let j = null; try { j = await r.json(); } catch (e) { }
    if (!r.ok) { const e = new Error((j && j.message) || ('HTTP ' + r.status)); e.status = r.status; e.code = j && j.error; throw e; }
    return j;
  },
  async status() { try { const s = await this.call('/status'); this.hasOwner = s.hasOwner; } catch (e) { this.hasOwner = null; } return this.hasOwner; },
  schedule(ms = 15000) { if (!this.cfg) return; clearTimeout(this.t); this.t = setTimeout(() => this.sync(), Date.now() - this.lastOk > 60000 ? 3000 : ms); },
  async sync(opts = {}) {
    if (!this.cfg) return false;
    if (this.busy) { this.again = true; return false; }
    this.busy = true; let changed = false;
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const g = await this.call('/sync');
        let remote = null; if (g.data) { try { remote = JSON.parse(g.data); } catch (e) { } }
        const before = JSON.stringify(S);
        if (remote) { S = mergeState(S, remote); try { localStorage.setItem(LSK, JSON.stringify(S)); } catch (e) { } }
        if (JSON.stringify(S) !== before) changed = true;
        const data = JSON.stringify(S);
        if (data === g.data) { this.rev = g.rev; break; }
        let summary = null; try { summary = weeklySummary(); } catch (e) { }
        try { const r = await this.call('/sync', { method: 'PUT', body: { data, upd: S.upd, baseRev: g.rev, summary }, keepalive: !!opts.keepalive && data.length < 60000 }); this.rev = r.rev; break; }
        catch (e) { if (e.status !== 409) throw e; }
      }
      this.lastOk = Date.now();
      setSync('cloud', 'Đã đồng bộ ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' (Cloudflare)');
      if (changed) rerenderAfterRemote();
      if (!C || Date.now() - (CF.cAt || 0) > 6 * 3600e3) { CF.cAt = Date.now(); fetchContent().then(ok => { if (ok && !busyView()) render(); }); }
      if (route === 'plan' && !opts.keepalive) { await this.devices(); if (!changed) { const box = document.querySelector('.devlist'); if (box) box.outerHTML = devListHTML(); } }
    } catch (e) {
      if (e.status === 401) { this.cfg = null; this.store(); SY.kind = null; setSync('error', 'Máy này đã bị ngắt (khóa đồng bộ đã đổi). Hãy ghép lại ở mục Cài đặt.'); }
      else setSync(navigator.onLine === false ? 'local' : 'error', navigator.onLine === false ? 'Đang offline. Tiến độ lưu trên máy, sẽ đồng bộ khi có mạng.' : 'Chưa đồng bộ được (' + (e.message || 'lỗi mạng') + '). Tiến độ vẫn lưu trên máy.');
    }
    this.busy = false;
    if (this.again) { this.again = false; this.schedule(2000); }
    return changed;
  },
  start(noSync) {
    if (!this.load()) return false;
    SY.kind = 'cf'; setSync('local', 'Đang đồng bộ với Cloudflare…'); if (!noSync) this.sync();
    if (!this.on) {
      this.on = true;
      document.addEventListener('visibilitychange', () => { if (!this.cfg) return; if (document.visibilityState === 'visible') this.sync(); else this.sync({ keepalive: true }); });
      window.addEventListener('online', () => this.cfg && this.sync());
      setInterval(() => { if (this.cfg && document.visibilityState === 'visible') this.sync(); }, 120000);
    }
    return true;
  },
  async connectWith(key, label) {
    this.cfg = { key, at: Date.now(), label }; this.store();
    this.start(true); await this.sync(); render();
  },
  async init() { const r = await this.call('/space/init', { method: 'POST' }); this.recovery = r.recovery; await this.connectWith(r.key, 'máy đầu tiên'); },
  async claim(code) { const r = await this.call('/pair/claim', { method: 'POST', body: { code } }); await this.connectWith(r.key, 'ghép bằng mã'); },
  async recover(code) { const r = await this.call('/space/recover', { method: 'POST', body: { recovery: code } }); await this.connectWith(r.key, 'khôi phục'); },
  async createPair() { this.pair = await this.call('/pair/create', { method: 'POST' }); return this.pair; },
  async rotate() { const r = await this.call('/space/rotate', { method: 'POST' }); this.cfg.key = r.key; this.store(); this.pair = null; },
  async devices() { try { this.devs = await this.call('/devices'); } catch (e) { this.devs = null; } return this.devs; },
  disconnect() { this.cfg = null; this.store(); SY.kind = null; this.pair = null; setSync('local', 'Đã ngắt đồng bộ trên máy này. Tiến độ vẫn lưu trên máy.'); },
};

let SYU = { busy: false, confirmRotate: false };
function syncUI() {
  const c = CF.cfg;
  if (c) {
    const p = CF.pair && CF.pair.exp > Date.now() ? CF.pair : null;
    return `<div class="gist">
      <p><b>Đồng bộ Cloudflare đang bật trên máy này.</b> Dữ liệu được gộp theo từng thẻ, nên học trên cả hai máy (kể cả lúc offline) đều không mất.</p>
      ${CF.recovery ? `<div class="expl bad"><b>Lưu mã khôi phục này</b> (chụp màn hình hoặc ghi vào trình quản lý mật khẩu). Dùng khi mất hết các máy đã ghép: <code class="big">${esc(CF.recovery)}</code><div class="row"><button class="btn sm" data-a="cfRecOk">Mình đã lưu</button></div></div>` : ''}
      ${p ? `<div class="pairbox"><p>Trên máy kia: mở app → Cài đặt → <b>Nhập mã ghép</b>:</p><p class="paircode num">${esc(p.code)}</p><div id="qr" class="qr" aria-label="Mã QR để ghép"></div><p class="hint">Hết hạn lúc ${new Date(p.exp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}. Quét QR mở bằng trình duyệt; với app đã cài trên iPhone hãy nhập mã trong app.</p></div>` : ''}
      ${devListHTML()}
      <div class="row wrap"><button class="btn pri" data-a="cfPair">${p ? 'Tạo mã mới' : 'Ghép thêm máy'}</button><button class="btn" data-a="cfSync">Đồng bộ ngay</button>
      ${SYU.confirmRotate ? '<button class="btn danger" data-a="cfRotateYes">Đổi khóa: các máy khác phải ghép lại</button><button class="btn ghost" data-a="cfRotateNo">Hủy</button>' : '<button class="btn ghost" data-a="cfRotate">Đổi khóa (ngắt mọi máy khác)</button>'}
      <button class="btn ghost" data-a="cfOff">Ngắt máy này</button></div>
    </div>`;
  }
  return `<div class="gist">
    <p><b>Đồng bộ điện thoại ↔ laptop (Cloudflare).</b> Làm một lần: bật trên máy đầu tiên, rồi ghép máy còn lại bằng mã 8 ký tự.</p>
    ${CF.hasOwner === false ? '<div class="row"><button class="btn pri" data-a="cfInit">Bật đồng bộ (máy đầu tiên)</button></div>' : ''}
    <label class="fld" for="cf-code">${CF.hasOwner === false ? 'Hoặc nhập mã ghép' : 'Nhập mã ghép từ máy đã kết nối'}<div class="row"><input id="cf-code" class="num" placeholder="XXXX-XXXX" autocomplete="off" autocapitalize="characters" maxlength="9" style="flex:1;min-width:0"><button class="btn${CF.hasOwner === false ? '' : ' pri'}" data-a="cfClaim">Ghép máy này</button></div></label>
    <details><summary class="hint">Mất hết các máy? Dùng mã khôi phục</summary><div class="row"><input id="cf-rec" placeholder="XXXX-XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" style="flex:1;min-width:0"><button class="btn" data-a="cfRecover">Khôi phục</button></div></details>
    ${CF.hasOwner === null ? '<p class="hint">Chưa kết nối được máy chủ đồng bộ (offline hoặc máy chủ chưa sẵn sàng).</p>' : ''}
  </div>`;
}
function devListHTML() {
  const d = CF.devs; if (!d) return '<p class="hint"><button class="lnkb lnk" data-a="cfDevs">Xem các thiết bị đã ghép</button></p>';
  const ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'vừa xong' : m < 60 ? m + ' phút trước' : m < 1440 ? Math.round(m / 60) + ' giờ trước' : Math.round(m / 1440) + ' ngày trước'; };
  return `<div class="devlist"><p><b>${d.devices.length} thiết bị đã ghép</b></p>${d.devices.map(x => `<div class="devrow"><span>${esc(x.name || 'Máy')}${x.dev === d.me ? ' <span class="tag on">máy này</span>' : ''}</span><span class="muted">đồng bộ ${ago(x.last_seen)}</span>${x.dev === d.me ? '' : `<button class="btn ghost sm" data-a="cfDevRm" data-v="${esc(x.dev)}">Bỏ khỏi danh sách</button>`}</div>`).join('')}<p class="hint">"Bỏ khỏi danh sách" chỉ xóa dòng này; muốn chặn hẳn một máy, dùng Đổi khóa.</p></div>`;
}
function drawQR() {
  const el = $('#qr'); if (!el || !CF.pair || typeof qrcode !== 'function') return;
  try { const q = qrcode(0, 'M'); q.addData(location.origin + location.pathname + '#pair-' + CF.pair.code.replace('-', '')); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); } catch (e) { el.textContent = ''; }
}
function loadQR() { if (typeof qrcode === 'function') return Promise.resolve(); return new Promise(res => { const s = document.createElement('script'); s.src = 'vendor/qrcode.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }
async function cfRun(fn, okMsg) { if (SYU.busy) return; SYU.busy = true; try { await fn(); if (okMsg) toast(okMsg); } catch (e) { toast(e.message || 'Lỗi mạng'); } SYU.busy = false; render(); }
Object.assign(ACT, {
  cfInit() { cfRun(() => CF.init(), 'Đã bật đồng bộ. Hãy lưu mã khôi phục.'); },
  cfClaim() { const v = ($('#cf-code') || {}).value || ''; if (v.replace(/[^A-Za-z0-9]/g, '').length !== 8) { toast('Mã ghép gồm 8 ký tự, ví dụ ABCD-2345'); return; } cfRun(() => CF.claim(v), 'Đã ghép máy này và gộp dữ liệu'); },
  cfRecover() { const v = ($('#cf-rec') || {}).value || ''; cfRun(() => CF.recover(v), 'Đã khôi phục. Các máy cũ cần ghép lại.'); },
  cfPair() { cfRun(async () => { await CF.createPair(); await loadQR(); }); },
  cfSync() { cfRun(() => CF.sync(), 'Đã đồng bộ'); },
  cfRotate() { SYU.confirmRotate = true; render(); },
  cfRotateNo() { SYU.confirmRotate = false; render(); },
  cfRotateYes() { SYU.confirmRotate = false; cfRun(() => CF.rotate(), 'Đã đổi khóa. Máy khác cần ghép lại.'); },
  cfOff() { CF.disconnect(); render(); },
  cfDevs() { cfRun(() => CF.devices()); },
  cfDevRm(t) { cfRun(async () => { await CF.call('/devices/remove', { method: 'POST', body: { dev: t.dataset.v } }); await CF.devices(); }); },
  cfRecOk() { CF.recovery = null; render(); },
});
/* Mở link #pair-XXXXXXXX (từ QR) → tự ghép */
function handlePairHash() {
  const m = location.hash.match(/^#pair-([A-Za-z0-9]{8})$/); if (!m) return false;
  history.replaceState(null, '', location.pathname + '#plan');
  if (CF.load()) { toast('Máy này đã được ghép rồi'); return false; }
  cfRun(() => CF.claim(m[1]), 'Đã ghép máy này và gộp dữ liệu');
  return true;
}
