/* ===== ĐỀ THẬT CÁC NĂM: thi thử full, luyện từng phần, chấm và đưa câu sai vào phân tích =====
   Đề và script hiển thị bằng PDF gốc (pdf.js), đáp án lấy từ bảng đáp án; mọi file nằm trên máy chủ riêng. */
const RMAP = { 10: '短文', 11: '中文', 12: '統合理解', 13: '長文', 14: '情報検索' };
const EXDEF = () => (C && C.exams) || [];
const EXAM = id => EXDEF().find(e => e.id === id);
function exType(lis, md) { return lis ? 'L' + md : md <= 9 ? 'K' + md : 'R' + RMAP[md]; }
function exItems(e) {
  const out = [];
  Object.entries(e.lang).map(([q, [md, a]]) => [+q, md, a]).sort((x, y) => x[0] - y[0]).forEach(([q, md, a]) => out.push({ key: 'k' + q, lis: false, md, n: q, ans: a, label: String(q) }));
  Object.keys(e.lis).map(Number).sort((a, b) => a - b).forEach(md => Object.keys(e.lis[md]).map(Number).sort((a, b) => a - b).forEach(n => {
    const arr = e.lis[md][n]; arr.forEach((a, j) => out.push({ key: `l${md}-${n}` + (arr.length > 1 ? '.' + (j + 1) : ''), lis: true, md, n, ans: a, label: n + (arr.length > 1 ? '-' + (j + 1) : '') }));
  }));
  return out;
}
const exItemId = (eid, key) => 'x' + eid + '-' + key;
/* Đăng ký từng câu của đề vào ITEM để phần phân tích điểm yếu tính chung */
const _indexContent = indexContent;
indexContent = function () {
  _indexContent();
  EXDEF().forEach(e => exItems(e).forEach(x => { const id = exItemId(e.id, x.key); ITEM[id] = { id, kind: 'X', exam: e.id, key: x.key, md: x.md, lis: x.lis, n: x.n, label: x.label, ans: [x.ans], type: exType(x.lis, x.md) }; }));
};
indexContent();
function itemLabel(it) { return it.kind === 'X' ? `Đề ${EXAM(it.exam) ? EXAM(it.exam).title : it.exam} · ${it.lis ? '聴解 問題' + it.md + ' 番' + it.label : 'câu ' + it.label}` : `${setTitle(SET[it.set])} · ${it.kind === 'L' ? 'câu ' + it.n : 'đọc'}`; }

/* ----- pdf.js (tải khi cần) ----- */
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
let pdfLib = null; const PDFDOC = {};
function loadPdfJs() {
  if (pdfLib) return Promise.resolve(pdfLib);
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js'; s.onload = () => { pdfLib = window.pdfjsLib; pdfLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; res(pdfLib); }; s.onerror = () => rej(new Error('Không tải được trình xem PDF (cần mạng)')); document.head.appendChild(s); });
}
async function pdfDoc(asset) {
  if (PDFDOC[asset]) return PDFDOC[asset];
  const lib = await loadPdfJs(), url = await mediaUrl(asset);
  PDFDOC[asset] = lib.getDocument({ url, rangeChunkSize: 262144 }).promise.catch(e => { delete PDFDOC[asset]; throw e; });
  return PDFDOC[asset];
}
let PV = { asset: null, page: 1, n: 0, zoom: 1, busy: false, err: '' };
async function drawPdf() {
  const box = $('#pdfbox'); if (!box || !PV.asset) return;
  const asset = PV.asset, page = PV.page;
  try {
    const doc = await pdfDoc(asset); PV.n = doc.numPages; PV.page = Math.min(Math.max(1, PV.page), PV.n);
    const pg = await doc.getPage(PV.page);
    if (PV.asset !== asset || PV.page !== page && page <= PV.n) return;
    const w = Math.max(320, box.clientWidth - 4) * PV.zoom, vp0 = pg.getViewport({ scale: 1 }), scale = w / vp0.width, dpr = Math.min(2, window.devicePixelRatio || 1);
    const vp = pg.getViewport({ scale: scale * dpr });
    const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height; cv.style.width = (vp.width / dpr) + 'px';
    await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    if (PV.asset !== asset) return;
    box.innerHTML = ''; box.appendChild(cv); PV.err = '';
    const pn = $('#pvn'); if (pn) pn.textContent = `${PV.page} / ${PV.n}`;
  } catch (e) { box.innerHTML = `<p class="bad-t">${esc(e.message || 'Không mở được PDF')}. ${String(e.message || '').includes('404') || e.status === 404 ? 'File chưa được tải lên: Cài đặt → Tài liệu khóa học → chọn thư mục N2_ĐỀ CÁC NĂM.' : ''}</p>`; }
}
function pdfViewerHTML(tabs) {
  return `<div class="pv"><div class="pvbar">${tabs || ''}<button class="btn sm" data-a="pvPrev" aria-label="Trang trước">‹</button><span id="pvn" class="num muted">${PV.page} / ${PV.n || '…'}</span><button class="btn sm" data-a="pvNext" aria-label="Trang sau">›</button><button class="btn ghost sm" data-a="pvZoom">${PV.zoom > 1 ? 'Thu nhỏ' : 'Phóng to'}</button></div><div id="pdfbox" class="pdfbox"><p class="muted">Đang mở đề…</p></div></div>`;
}
Object.assign(ACT, {
  pvPrev() { if (PV.page > 1) { PV.page--; drawPdf(); } },
  pvNext() { if (!PV.n || PV.page < PV.n) { PV.page++; drawPdf(); } },
  pvZoom() { PV.zoom = PV.zoom > 1 ? 1 : 1.5; render(); },
  pvGo(t) { PV.page = +t.dataset.v; drawPdf(); },
});
addEventListener('keydown', e => { if (route !== 'exam' || !EXM || e.target.closest('input,textarea,select')) return; if (e.key === 'PageDown' || (e.key === 'ArrowRight' && e.altKey)) { e.preventDefault(); ACT.pvNext(); } if (e.key === 'PageUp' || (e.key === 'ArrowLeft' && e.altKey)) { e.preventDefault(); ACT.pvPrev(); } });

/* ----- Phiên làm đề ----- */
let EXM = null;   // { id, mode:'full'|'part', part, sec:{lis,md}, keys, ans, t0, acc, run, graded, view }
const PART_MIN = [105, 50];
function exKeys(e, mode, part, sec) {
  return exItems(e).filter(x => mode === 'full' ? x.lis === (part === 1) : x.lis === sec.lis && x.md === sec.md).map(x => x.key);
}
function exStartPage(e, lis, md) { const m = lis ? e.lpg : e.pg; let best = lis ? (e.lpg[1] || 1) : 1; Object.entries(m).forEach(([k, v]) => { if (+k <= md) best = v; }); return best; }
function startExam(id, mode, part, sec) {
  const e = EXAM(id); if (!e) return;
  EXM = { id, mode, part: part || 0, sec: sec || null, keys: [], ans: {}, t0: Date.now(), acc: 0, run: true, graded: false, view: 'p' };
  EXM.keys = exKeys(e, mode, EXM.part, sec);
  PV = { asset: exAsset(id, 'p'), page: mode === 'full' ? (EXM.part ? exStartPage(e, true, 1) : 1) : exStartPage(e, sec.lis, sec.md), n: 0, zoom: PV.zoom || 1 };
  if (route !== 'exam') go('exam'); else render();
}
function exElapsed() { return EXM.acc + (EXM.run ? (Date.now() - EXM.t0) / 1000 : 0); }
function exTimerText() {
  const e = exElapsed();
  if (EXM.mode === 'full' && !EXM.graded) { const rem = Math.max(0, PART_MIN[EXM.part] * 60 - e); return { t: mmss(rem), late: rem < 300 }; }
  return { t: mmss(e), late: false };
}
setInterval(() => { if (route === 'exam' && EXM && EXM.run && !EXM.graded) { const el = $('#exclock'); if (el) { const x = exTimerText(); el.textContent = x.t; el.classList.toggle('late', x.late); } if (EXM.mode === 'full' && exElapsed() >= PART_MIN[EXM.part] * 60 && !EXM.beeped) { EXM.beeped = true; exBeep(); toast('Hết giờ phần này'); } } }, 1000);
function exBeep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.value = 0.08; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.4); } catch (e) { } }
function exSheet(e) {
  const items = exItems(e).filter(x => EXM.keys.includes(x.key));
  const groups = []; items.forEach(x => { const g = groups[groups.length - 1]; const gk = (x.lis ? 'L' : 'K') + x.md; if (!g || g.k !== gk) groups.push({ k: gk, lis: x.lis, md: x.md, xs: [x] }); else g.xs.push(x); });
  return groups.map(g => `<div class="exg"><button class="lnkb exgh" data-a="pvGo" data-v="${exStartPage(e, g.lis, g.md)}"><b lang="ja">${g.lis ? '聴解 ' : ''}問題${g.md}</b> <span class="muted">${esc(typeVi(exType(g.lis, g.md)))}</span> <span class="hint">→ trang ${exStartPage(e, g.lis, g.md)}</span></button>
    ${g.xs.map(x => { const v = EXM.ans[x.key], ok = EXM.graded ? v === x.ans : null, iid = exItemId(e.id, x.key);
      return `<div class="exrow${ok === false ? ' ng' : ''}"><span class="exn num">${esc(x.label)}</span>${[1, 2, 3, 4].slice(0, x.lis && x.md === 4 ? 3 : 4).map(o => `<button class="bub${v === o ? ' on' : ''}${EXM.graded && o === x.ans ? ' ok' : ''}" data-a="exPick" data-k="${x.key}" data-v="${o}" ${EXM.graded ? 'disabled' : ''}>${o}</button>`).join('')}
      ${ok === false ? `<select class="exwhy" data-a="exWhy" data-id="${iid}" aria-label="Lý do sai"><option value="">lý do?</option>${WHY.map(([k, l]) => `<option value="${k}" ${(attempts(iid).slice(-1)[0] || [])[5] === k ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}</div>`; }).join('')}</div>`).join('');
}
function exView() {
  const e = EXAM(EXM.id), done = EXM.keys.filter(k => EXM.ans[k]).length, x = exTimerText();
  const title = EXM.mode === 'redo' ? 'Làm lại câu sai' : EXM.mode === 'full' ? (EXM.part ? 'Nghe hiểu · 50′' : 'Kiến thức ngôn ngữ + Đọc hiểu · 105′') : `${EXM.sec.lis ? '聴解 ' : ''}問題${EXM.sec.md} · ${typeVi(exType(EXM.sec.lis, EXM.sec.md))}`;
  const lisOn = EXM.mode === 'full' ? EXM.part === 1 : EXM.sec.lis;
  const res = EXM.graded ? exResult(e) : null;
  const tabs = EXM.graded ? `<div class="seg sm"><button class="${EXM.view === 'p' ? 'on' : ''}" data-a="exViewP">Đề</button><button class="${EXM.view === 's' ? 'on' : ''}" data-a="exViewS">Script nghe</button></div>` : '';
  return `<div class="rv-top"><button class="btn ghost sm" data-a="exQuit">Thoát</button><span class="muted">Đề ${esc(e.title)} · ${esc(title)}</span><span id="exclock" class="num clockm ${x.late ? 'late' : ''}">${x.t}</span></div>
  <div class="exgrid"><section class="panel expdf">${pdfViewerHTML(tabs)}</section>
  <aside class="panel exside">
    ${lisOn ? `<div class="exaudio"><b>File nghe</b><audio id="exaudio" controls preload="metadata"></audio><p class="hint">Đề thật chỉ nghe 1 lần, không dừng. Luyện từng phần thì tua đến đúng 問題.</p></div>` : ''}
    ${res ? res : `<div class="ph sm"><h3>Phiếu trả lời</h3><span class="num muted">${done}/${EXM.keys.length}</span></div>`}
    <div class="sheet">${exSheet(e)}</div>
    ${EXM.graded ? `<div class="row"><button class="btn" data-a="exRedo">Làm lại câu sai</button>${EXM.mode === 'full' && EXM.part === 0 ? '<button class="btn pri" data-a="exNextPart">Sang phần Nghe (50′)</button>' : ''}<button class="btn ghost" data-a="exClose">Về danh sách đề</button></div>`
      : `<div class="row">${EXM.run ? '<button class="btn sm" data-a="exPause">Tạm dừng</button>' : '<button class="btn sm" data-a="exResume">Tiếp tục</button>'}<button class="btn pri" data-a="exSubmit">Nộp và chấm</button></div>`}
  </aside></div>`;
}
AFTER.exam = () => {
  if (EXM) {
    PV.asset = EXM.graded && EXM.view === 's' ? exAsset(EXM.id, 's') : exAsset(EXM.id, 'p'); drawPdf();
    const au = $('#exaudio'); if (au && !au.src) mediaUrl(exAsset(EXM.id, 'a')).then(u => { au.src = u; }).catch(e => toast(e.message));
    return;
  }
  const f = $('#scoreform'); if (f) f.onsubmit = ev => { ev.preventDefault(); const s = [0, 1, 2].map(i => Math.max(0, Math.min(60, +$('#sf-' + i).value || 0))); S.exams.push({ id: Date.now().toString(36), d: $('#sf-d').value, lv: 'N2', s }); save(); const j = judge('N2', s); toast(`Tổng ${j.total}/180 · ${j.ok ? 'Đỗ' : 'Chưa đỗ'}`); render(); };
  if (CF.cfg && EXDEF().length && !IMP.have && !EXL.asked) { EXL.asked = true; audioHave().then(h => { if (h && route === 'exam' && !EXM) render(); }); }
};
/* Điểm ước tính: % đúng mỗi phần × 60 (JLPT thật chấm theo thang chuẩn hóa nên chỉ để tham khảo) */
function exSecs(e, ans) {
  const it = exItems(e), sec = x => x.lis ? 2 : x.md <= 9 ? 0 : 1;
  return [0, 1, 2].map(i => { const xs = it.filter(x => sec(x) === i), ok = xs.filter(x => ans[x.key] === x.ans).length, an = xs.filter(x => ans[x.key]).length; return { n: xs.length, ok, an, est: xs.length ? Math.round(ok / xs.length * 60) : 0 }; });
}
function exResult(e) {
  const its = exItems(e).filter(x => EXM.keys.includes(x.key)), ok = its.filter(x => EXM.ans[x.key] === x.ans).length;
  const byMd = {}; its.forEach(x => { const k = (x.lis ? 'L' : 'K') + x.md, b = byMd[k] || (byMd[k] = { lis: x.lis, md: x.md, n: 0, ok: 0 }); b.n++; if (EXM.ans[x.key] === x.ans) b.ok++; });
  return `<div class="expl ${pct(ok, its.length) >= 60 ? 'good' : 'bad'}"><b>${ok}/${its.length} câu đúng (${pct(ok, its.length)}%)</b> · ${mmss(EXM.acc)}</div>
    <div class="mdres">${Object.values(byMd).map(b => `<span class="tag ${pct(b.ok, b.n) < 60 ? 'badtag' : ''}" lang="ja">${b.lis ? '聴' : ''}問題${b.md}: ${b.ok}/${b.n}</span>`).join('')}</div>
    <p class="hint">Câu sai (đỏ) đã vào Điểm yếu. Chọn lý do sai cho từng câu; xem Script nghe ở thanh trên.</p>`;
}
Object.assign(ACT, {
  exPick(t) { if (!EXM || EXM.graded) return; const k = t.dataset.k, v = +t.dataset.v; EXM.ans[k] = EXM.ans[k] === v ? undefined : v; t.parentElement.querySelectorAll('.bub').forEach(b => b.classList.toggle('on', +b.dataset.v === EXM.ans[k])); const h = $('.exside .ph .num'); if (h) h.textContent = `${EXM.keys.filter(x => EXM.ans[x]).length}/${EXM.keys.length}`; },
  exPause() { EXM.acc = exElapsed(); EXM.run = false; render(); },
  exResume() { EXM.t0 = Date.now(); EXM.run = true; render(); },
  exSubmit(t) {
    const left = EXM.keys.filter(k => !EXM.ans[k]).length;
    if (left && !t.dataset.sure) { t.dataset.sure = '1'; t.textContent = `Còn ${left} câu trống, bấm lần nữa để nộp`; return; }
    const e = EXAM(EXM.id); EXM.acc = exElapsed(); EXM.run = false; EXM.graded = true;
    const its = exItems(e).filter(x => EXM.keys.includes(x.key)), per = EXM.acc / Math.max(1, its.length);
    its.forEach(x => rec(exItemId(e.id, x.key), [EXM.ans[x.key] || 0], EXM.ans[x.key] === x.ans, per, 0));
    if (EXM.mode === 'full') {
      EXFULL[EXM.id] = { ...(EXFULL[EXM.id] || {}), ...EXM.ans };
      if (EXM.part === 1) { const s = exSecs(e, EXFULL[EXM.id]); S.exams.push({ id: Date.now().toString(36), d: dayKey(), lv: 'N2', s: s.map(x => x.est), src: e.id, est: 1 }); save(); const j = judge('N2', s.map(x => x.est)); toast(`Ước tính ${j.total}/180 · ${j.ok ? 'Đỗ' : 'Chưa đỗ'}`); delete EXFULL[EXM.id]; }
    }
    render(); scrollTo(0, 0);
  },
  exNextPart() { startExam(EXM.id, 'full', 1); },
  exRedo() { const e = EXAM(EXM.id), wrong = EXM.keys.filter(k => EXM.ans[k] !== exItems(e).find(x => x.key === k).ans); if (!wrong.length) { toast('Không có câu sai'); return; } EXM = { ...EXM, mode: 'redo', keys: wrong, ans: {}, graded: false, run: true, t0: Date.now(), acc: 0, sec: EXM.sec || { lis: EXM.part === 1, md: 0 } }; render(); },
  exViewP() { EXM.view = 'p'; PV.page = 1; render(); },
  exViewS() { EXM.view = 's'; PV.page = 1; render(); },
  exWhy(t) { const a = S.att[t.dataset.id]; if (a && a.length) { a[a.length - 1][5] = t.value; save(); } },
  exQuit() { if (!EXM.graded && EXM.keys.some(k => EXM.ans[k]) && !EXL.quit) { EXL.quit = true; toast('Bấm Thoát lần nữa để bỏ bài (chưa chấm)'); return; } EXL.quit = false; EXM = null; render(); },
  exClose() { EXM = null; render(); },
  exFull(t) { startExam(t.dataset.v, 'full', 0); },
  exPart(t) { const [lis, md] = t.dataset.s.split(':'); startExam(t.dataset.v, 'part', 0, { lis: lis === '1', md: +md }); },
  exTypePick(t) { const [lis, md] = t.dataset.v.split(':').map(Number); const ex = EXDEF().filter(e => exAvail(e)); const fresh = ex.filter(e => !exItems(e).some(x => x.lis === !!lis && x.md === md && attempts(exItemId(e.id, x.key)).length)); const e = (fresh.length ? fresh : ex)[0]; if (!e) { toast('Chưa có đề nào đủ file trên máy chủ'); return; } startExam(e.id, 'part', 0, { lis: !!lis, md }); },
  exToggle(t) { EXL.open = EXL.open === t.dataset.v ? null : t.dataset.v; render(); },
});
const EXFULL = {};   // đáp án phần 1 của bài thi full, chờ phần nghe để tính tổng
let EXL = { open: null, asked: false, quit: false };
function exAvail(e) { return !IMP.have || ['p', 'a'].every(k => IMP.have.has(exAsset(e.id, k))); }
function exStat(e) {
  const its = exItems(e), done = its.filter(x => attempts(exItemId(e.id, x.key)).length), ok = done.filter(x => ist(exItemId(e.id, x.key)).first);
  const full = S.exams.filter(x => x.src === e.id).slice(-1)[0];
  return { n: its.length, done: done.length, firstPct: pct(ok.length, done.length), full };
}
VIEWS.exam = () => {
  if (EXM) return exView();
  const ex = EXDEF(), hist = S.exams.slice().sort((a, b) => a.d < b.d ? -1 : 1), R = LEVEL_RULES.N2;
  const secBtns = e => `<div class="chips">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => `<button class="chip" data-a="exPart" data-v="${e.id}" data-s="0:${m}" lang="ja">問題${m}</button>`).join('')}</div><div class="chips">${[10, 11, 12, 13, 14].map(m => `<button class="chip" data-a="exPart" data-v="${e.id}" data-s="0:${m}" lang="ja">読解 問題${m}</button>`).join('')}</div><div class="chips">${[1, 2, 3, 4, 5].map(m => `<button class="chip" data-a="exPart" data-v="${e.id}" data-s="1:${m}" lang="ja">聴解 問題${m}</button>`).join('')}</div>`;
  return `<h1 class="pt">Thi thử <span lang="ja">模試</span></h1>
  ${ex.length ? `<section class="panel"><div class="ph"><h2>Đề thật các năm</h2><span class="muted">${ex.length} đề · 2010–2026</span></div>
    <p class="hint">Thi full: 105′ kiến thức + đọc, rồi 50′ nghe; chấm theo bảng đáp án, điểm từng phần ước tính = % đúng × 60. Hoặc làm từng 問題 để luyện dạng mình yếu.</p>
    <div class="exlist">${ex.map(e => { const st = exStat(e), av = exAvail(e), j = st.full ? judge('N2', st.full.s) : null; return `<div class="exi"><div class="exh"><b>${esc(e.title)}</b>${!av ? '<span class="tag">chưa tải file</span>' : ''}<span class="muted num">${st.done ? `đã làm ${st.done}/${st.n} câu · đúng lần đầu ${st.firstPct}%` : `${st.n} câu`}</span>${j ? `<span class="pill ${j.ok ? 'good' : 'bad'}">${j.total}/180</span>` : ''}
      <span class="exb"><button class="btn sm pri" data-a="exFull" data-v="${e.id}" ${av ? '' : 'disabled'}>Thi full</button><button class="btn sm" data-a="exToggle" data-v="${e.id}" ${av ? '' : 'disabled'}>Từng phần</button></span></div>${EXL.open === e.id ? secBtns(e) : ''}</div>`; }).join('')}</div>
  </section>` : `<section class="panel"><h2>Đề thật các năm</h2><p class="muted">Chưa có. Trên laptop: Cài đặt → Tài liệu khóa học → chọn thư mục <b>N2_ĐỀ CÁC NĂM</b>.</p></section>`}
  <section class="grid2"><div class="panel"><div class="ph"><h2>Nhập điểm đề ngoài</h2></div>
      <form id="scoreform" class="sform"><label>Ngày <input id="sf-d" type="date" value="${dayKey()}" required></label>${R.secs.map((s, i) => `<label>${s[0]} <small>(0–${s[1]})</small><input id="sf-${i}" type="number" inputmode="numeric" min="0" max="${s[1]}" required></label>`).join('')}<button class="btn pri" type="submit">Lưu</button></form>
      <p class="hint">N2 đỗ khi tổng ≥ 90/180 và mỗi phần ≥ 19.</p></div>
    <div class="panel"><div class="ph"><h2>Lịch sử điểm</h2><span class="muted num">${hist.length}</span></div>
    ${hist.length ? `<div class="tbl"><table><thead><tr><th>Ngày</th><th>Đề</th><th>Từng phần</th><th>Tổng</th><th></th></tr></thead><tbody>${hist.map(h => { const j = judge('N2', h.s); return `<tr><td class="num">${h.d}</td><td>${h.src ? esc(EXAM(h.src) ? EXAM(h.src).title : h.src) + (h.est ? ' <small class="muted">ước tính</small>' : '') : '—'}</td><td class="num">${h.s.join(' / ')}</td><td class="num"><b>${j.total}</b> ${j.ok ? '<span class="pill good">Đỗ</span>' : '<span class="pill bad">Trượt</span>'}</td><td><button class="btn ghost sm" data-a="exDel" data-v="${h.id}">Xóa</button></td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted">Chưa có.</p>'}</div></section>
  <section class="grid2"><details class="panel"><summary><h2>Cấu trúc đề N2 (105′)</h2></summary><div class="tbl"><table><thead><tr><th>問題</th><th>Dạng</th><th>Làm gì</th><th>Câu</th></tr></thead><tbody>${EXAM_PARTS.map(r => `<tr><td>${r[0]}</td><td lang="ja">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div></details>
    <details class="panel"><summary><h2>Nghe hiểu (50′)</h2></summary><div class="tbl"><table><thead><tr><th>問題</th><th>Dạng</th><th>Mẹo</th></tr></thead><tbody>${[1, 2, 3, 4, 5].map(m => `<tr><td>${m}</td><td lang="ja">${MD[m].ja}</td><td>${esc(MD[m].tip)}</td></tr>`).join('')}</tbody></table></div></details></section>`;
};
ACT.exDel = t => { S.exams = S.exams.filter(x => x.id !== t.dataset.v); S.exdel = [...new Set([...(S.exdel || []), t.dataset.v])]; save(); render(); };
