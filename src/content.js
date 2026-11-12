/* ===== NỘI DUNG BÀI TẬP (tài liệu khóa học, lưu riêng trên D1, chỉ máy đã ghép mới tải được) ===== */
const CK = 'jlpt-n2-content';
let C = null;                 // { v, name, sets: [...] }
const ITEM = {}, SET = {}, PASS = {};
function indexContent() {
  for (const k in ITEM) delete ITEM[k]; for (const k in SET) delete SET[k]; for (const k in PASS) delete PASS[k];
  if (!C) return;
  C.sets.forEach(s => {
    SET[s.id] = s;
    (s.passages || []).forEach(p => { PASS[p.pid] = p; });
    s.items.forEach((it, i) => { ITEM[it.id] = { ...it, set: s.id, kind: s.kind, i, type: s.kind === 'L' ? 'L' + s.md : 'R' + PASS[it.pid].type }; });
  });
}
function setTitle(s) { return s.kind === 'L' ? (s.src === 'f-' ? `Nền tảng · Chương ${s.unit}` : `Chặng 2 · Bài ${s.unit}`) : `Chặng 2 · Bài ${s.unit}`; }
function typeName(t) { return t[0] === 'L' ? `問題${t[1]} ${MD[t[1]].ja}` : t[0] === 'K' ? `問題${t[1]} ${EXAM_PARTS[t[1] - 1][1]}` : `${t.slice(1)}`; }
function typeVi(t) { return t[0] === 'L' ? `Nghe ${t[1]} · ${MD[t[1]].vi}` : t[0] === 'K' ? `${+t[1] <= 6 ? 'Từ vựng' : 'Ngữ pháp'} · ${EXAM_PARTS[t[1] - 1][2]}` : `Đọc · ${RT[t.slice(1)].vi}`; }
function loadContentLocal() { try { const r = localStorage.getItem(CK); if (r) { C = JSON.parse(r); indexContent(); } } catch (e) { C = null; } }
async function fetchContent(force) {
  if (!CF.cfg) return false;
  try {
    const r = await CF.call('/content' + (C && !force ? '?since=' + (C.upd || 0) : ''));
    if (r && r.data) { C = JSON.parse(r.data); C.upd = r.upd; try { localStorage.setItem(CK, JSON.stringify(C)); } catch (e) { } indexContent(); return true; }
  } catch (e) { }
  return false;
}
loadContentLocal();

/* ----- Âm thanh: tải từ máy chủ (cần khóa), giữ trong Cache Storage để nghe lại offline ----- */
const AU = { el: null, url: null, id: null, plays: 0, loading: false, rate: 1 };
const ACACHE = 'jlpt-audio-v1';
async function audioBlob(id) {
  const key = location.origin + '/__audio/' + encodeURIComponent(id);
  try { const c = await caches.open(ACACHE); const hit = await c.match(key); if (hit) return await hit.blob(); } catch (e) { }
  if (!CF.cfg) throw new Error('Máy này chưa ghép đồng bộ nên chưa tải được file nghe.');
  const r = await fetch('/api/audio/' + encodeURIComponent(id), { headers: { authorization: 'Bearer ' + CF.cfg.key, 'x-device': DEV } });
  if (r.status === 404) throw new Error('Chưa có file nghe cho câu này. Vào Cài đặt → Nhập tài liệu.');
  if (!r.ok) throw new Error('Không tải được file nghe (HTTP ' + r.status + ')');
  const b = await r.blob();
  try { const c = await caches.open(ACACHE); await c.put(key, new Response(b, { headers: { 'content-type': 'audio/mpeg' } })); } catch (e) { }
  return b;
}
async function audioLoad(id) {
  if (AU.id === id && AU.url) return;
  audioStop(); AU.id = id; AU.loading = true; AU.err = null; AU.plays = 0; drawPlayer();
  try { const b = await audioBlob(id); if (AU.id !== id) return; AU.url = URL.createObjectURL(b); AU.el = new Audio(AU.url); AU.el.playbackRate = AU.rate; AU.el.preload = 'auto';
    ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata'].forEach(ev => AU.el.addEventListener(ev, () => { if (ev === 'play' && AU.el.currentTime < 0.5) AU.plays++; drawPlayer(); }));
  } catch (e) { AU.err = e.message; }
  AU.loading = false; drawPlayer();
}
function audioStop() { if (AU.el) { try { AU.el.pause(); } catch (e) { } } if (AU.url) URL.revokeObjectURL(AU.url); AU.el = null; AU.url = null; AU.id = null; }
function playerHTML() { return `<div id="player" class="player" aria-live="polite"></div>`; }
function drawPlayer() {
  const el = $('#player'); if (!el) return;
  if (AU.loading) { el.innerHTML = '<span class="muted">Đang tải file nghe…</span>'; return; }
  if (AU.err) { el.innerHTML = `<span class="bad-t">${esc(AU.err)}</span>`; return; }
  if (!AU.el) { el.innerHTML = ''; return; }
  const a = AU.el, d = a.duration || 0, t = a.currentTime || 0;
  el.innerHTML = `<button class="btn pri play" data-a="auToggle" aria-label="${a.paused ? 'Phát' : 'Tạm dừng'}">${a.paused ? '▶' : '❚❚'}</button>
    <button class="btn sm" data-a="auBack" aria-label="Lùi 5 giây">−5s</button>
    <div class="ptrack" data-a="auSeek"><i style="width:${d ? t / d * 100 : 0}%"></i></div>
    <span class="num muted">${mmss(t)} / ${mmss(d)}</span>
    <select data-a="auRate" aria-label="Tốc độ">${[0.85, 1, 1.15].map(r => `<option value="${r}" ${AU.rate === r ? 'selected' : ''}>${r}×</option>`).join('')}</select>
    <span class="muted plays">nghe ${AU.plays} lần</span>`;
}
Object.assign(ACT, {
  auToggle() { if (!AU.el) return; if (AU.el.paused) AU.el.play().catch(() => toast('Bấm lại để phát')); else AU.el.pause(); },
  auBack() { if (AU.el) AU.el.currentTime = Math.max(0, AU.el.currentTime - 5); },
  auSeek(t, e) { if (!AU.el || !AU.el.duration) return; const r = t.getBoundingClientRect(); AU.el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * AU.el.duration; },
  auRate(t) { AU.rate = +t.value; if (AU.el) AU.el.playbackRate = AU.rate; },
});
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select')) return;
  if (e.code === 'Space' && AU.el && (route === 'listen' || route === 'drill')) { e.preventDefault(); ACT.auToggle(); }
});

const exAsset = (id, k) => 'x' + id + '-' + k;
let MTOK = null;
async function mediaUrl(id) {
  if (!MTOK || MTOK.exp - Date.now() < 600000) MTOK = await CF.call('/media-token', { method: 'POST' });
  return '/api/audio/' + encodeURIComponent(id) + '?t=' + encodeURIComponent(MTOK.t);
}
/* ----- Nhập tài liệu: chọn thư mục khóa học (có content-n2.json + file MP3) ----- */
let IMP = { busy: false, msg: '', done: 0, total: 0, skip: 0, fail: [], have: null };
async function audioHave() { try { const r = await CF.call('/audio'); IMP.have = new Set(r.ids || []); } catch (e) { IMP.have = null; } return IMP.have; }
async function importFolder(files) {
  if (!CF.cfg) { toast('Bật đồng bộ trước (mục Đồng bộ bên dưới)'); return; }
  files = [...files]; IMP = { busy: true, msg: 'Đang đọc thư mục…', done: 0, total: 0, skip: 0, fail: [], have: IMP.have }; render();
  try {
    const jf = files.find(f => /content-n2\.json$/i.test(f.name));
    let content = C;
    if (jf) {
      const txt = await jf.text(); content = JSON.parse(txt);
      if (!content.sets) throw new Error('File content-n2.json không đúng định dạng');
      IMP.msg = 'Đang tải nội dung bài tập lên…'; render();
      await CF.call('/content', { method: 'PUT', body: { data: txt } });
      await fetchContent(true);
    }
    if (!content) throw new Error('Không thấy file content-n2.json trong thư mục đã chọn.');
    const norm = s => s.normalize('NFC').replace(/\\/g, '/').toLowerCase();
    const byPath = files.map(f => [norm(f.webkitRelativePath || f.name), f]);
    const jobs = [];
    const find = rel => { const want = norm(rel); const hit = byPath.find(([p]) => p.endsWith(want)); return hit && hit[1]; };
    content.sets.forEach(s => s.items.forEach(it => { if (!it.audio) return; const f = find(it.audio); if (f) jobs.push([it.id, f, 'audio/mpeg']); }));
    (content.exams || []).forEach(e => [['p', e.pdf, 'application/pdf'], ['s', e.script, 'application/pdf'], ['a', e.mp3, 'audio/mpeg']].forEach(([k, rel, type]) => { const f = find(rel); if (f) jobs.push([exAsset(e.id, k), f, type]); }));
    await audioHave();
    const todo = jobs.filter(([id]) => !(IMP.have && IMP.have.has(id)));
    IMP.total = jobs.length; IMP.skip = jobs.length - todo.length;
    if (!jobs.length) IMP.msg = 'Không thấy file khớp. Hãy chọn thư mục "2.DMR-TÀI LIỆU HỌC VIÊN" hoặc "N2_ĐỀ CÁC NĂM".';
    let i = 0;
    const worker = async () => { // 2 luồng song song
      while (i < todo.length) {
        const [id, f, type] = todo[i++];
        try {
          const r = await fetch('/api/audio/' + encodeURIComponent(id), { method: 'PUT', body: f.size > 20e6 ? f : await f.arrayBuffer(), headers: { 'content-type': type, authorization: 'Bearer ' + CF.cfg.key, 'x-device': DEV } });
          if (!r.ok) { let m = 'HTTP ' + r.status; try { m = (await r.json()).message || m; } catch (e) { } throw new Error(m); }
        } catch (e) { IMP.fail.push(id); IMP.err = e.message || String(e); }
        IMP.done++; IMP.msg = `Đang tải file ${IMP.done}/${todo.length}… (đề + file nghe lớn có thể mất vài phút)`; const p = $('#impmsg'); if (p) p.textContent = IMP.msg;
      }
    };
    await Promise.all([worker(), worker()]);
    await audioHave();
    IMP.msg = jobs.length ? `Xong: ${todo.length - IMP.fail.length} file mới, ${IMP.skip} file đã có${IMP.fail.length ? `, ${IMP.fail.length} lỗi: ${IMP.err} (bấm chọn lại thư mục để thử tiếp)` : ''}.` : IMP.msg;
  } catch (e) { IMP.msg = 'Lỗi: ' + (e.message || e); }
  IMP.busy = false; render();
}
function importUI() {
  const nItems = C ? C.sets.reduce((a, s) => a + s.items.length, 0) : 0, nAudio = C ? C.sets.reduce((a, s) => a + s.items.filter(i => i.audio).length, 0) : 0;
  const nEx = C && C.exams ? C.exams.length : 0, exHave = nEx && IMP.have ? C.exams.filter(e => ['p', 's', 'a'].every(k => IMP.have.has(exAsset(e.id, k)))).length : 0;
  return `<div class="gist">
    <p><b>Tài liệu khóa học</b> ${C ? `<span class="tag on">${nItems} câu · ${nAudio} file nghe${nEx ? ` · ${nEx} đề thi` : ''}</span>` : '<span class="tag">chưa có</span>'}</p>
    <p class="hint">Nội dung và file nghe được lưu riêng trên máy chủ của bạn (D1/R2), chỉ máy đã ghép mới tải được; không nằm trên GitHub.</p>
    ${CF.cfg ? `<label class="btn ${C ? '' : 'pri'}" ${IMP.busy ? 'aria-disabled="true"' : ''}>Chọn thư mục khóa học…<input type="file" id="impdir" webkitdirectory directory multiple hidden data-a="impPick" ${IMP.busy ? 'disabled' : ''}></label>
    <p class="hint">Trên laptop, chọn lần lượt thư mục <b>2.DMR-TÀI LIỆU HỌC VIÊN</b> và <b>N2_ĐỀ CÁC NĂM</b> (mỗi thư mục đều có file content-n2.json). File đã tải lên sẽ được bỏ qua.</p>` : '<p class="hint">Bật đồng bộ trước rồi mới nhập được.</p>'}
    ${IMP.have ? `<p class="hint">Trên máy chủ: ${[...IMP.have].filter(x => x[0] !== 'x').length}/${nAudio} file nghe bài tập${nEx ? ` · ${exHave}/${nEx} đề đủ file (đề + script + nghe)` : ''}.</p>` : ''}
    ${IMP.msg ? `<p id="impmsg" class="${IMP.msg.startsWith('Lỗi') ? 'bad-t' : ''}">${esc(IMP.msg)}</p>` : ''}
    ${C && CF.cfg ? '<div class="row"><button class="btn ghost sm" data-a="contentRefresh">Tải lại nội dung từ máy chủ</button><button class="btn ghost sm" data-a="audioClear">Xóa file nghe đã lưu tạm trên máy này</button></div>' : ''}
  </div>`;
}
Object.assign(ACT, {
  impPick(t) { if (t.files && t.files.length) importFolder(t.files); },
  async contentRefresh() { const ok = await fetchContent(true); toast(ok ? 'Đã tải lại nội dung' : 'Chưa có nội dung trên máy chủ'); render(); },
  async audioClear() { try { await caches.delete(ACACHE); toast('Đã xóa file nghe lưu tạm'); } catch (e) { } },
});
