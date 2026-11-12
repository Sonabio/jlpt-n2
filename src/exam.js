/* ===== ĐỀ THẬT CÁC NĂM: thi thử full, luyện từng phần, chấm và đưa câu sai vào phân tích =====
   Đề và script hiển thị bằng PDF gốc (pdf.js), đáp án lấy từ bảng đáp án; mọi file nằm trên máy chủ riêng. */
const EXDEF = () => (C && C.exams) || [];
const EXAM = id => EXDEF().find(e => e.id === id);
function exType(lis, md, lv) { if (lis) return 'L' + md; const p = PART(md, lv); return p.sec === 'K' ? 'K' + md : 'R' + p.rt; }
/* Câu của một đề. N2 (cũ): lang = { số câu: [問題, đáp án] }. N3–N5: q = [[md, số câu in trên đề, đáp án], ...] vì số câu đếm lại theo từng bài thi */
function exItems(e) {
  const out = [];
  if (e.q) e.q.forEach(([md, n, a]) => out.push({ key: `k${md}_${n}`, lis: false, md, n, ans: a, label: String(n) }));
  else Object.entries(e.lang).map(([q, [md, a]]) => [+q, md, a]).sort((x, y) => x[0] - y[0]).forEach(([q, md, a]) => out.push({ key: 'k' + q, lis: false, md, n: q, ans: a, label: String(q) }));
  Object.keys(e.lis).map(Number).sort((a, b) => a - b).forEach(md => Object.keys(e.lis[md]).map(Number).sort((a, b) => a - b).forEach(n => {
    const arr = e.lis[md][n]; arr.forEach((a, j) => out.push({ key: `l${md}-${n}` + (arr.length > 1 ? '.' + (j + 1) : ''), lis: true, md, n, ans: a, label: n + (arr.length > 1 ? '-' + (j + 1) : '') }));
  }));
  return out;
}
const exLv = e => (e && e.lv) || 'N2';
const exPapers = e => LVD(exLv(e)).papers;
const exPaperOf = (e, x) => x.lis ? exPapers(e).length - 1 : PART(x.md, exLv(e)).pp;
function exLisOn() { if (!EXM) return false; const e = EXAM(EXM.id); return EXM.mode === 'full' ? !!(e && exPapers(e)[EXM.part] || {}).lis : !!(EXM.sec && EXM.sec.lis); }
const exItemId = (eid, key) => 'x' + eid + '-' + key;
/* Đăng ký từng câu của đề vào ITEM để phần phân tích điểm yếu tính chung */
const _indexContent = indexContent;
indexContent = function () {
  _indexContent();
  EXDEF().forEach(e => exItems(e).forEach(x => { const id = exItemId(e.id, x.key); ITEM[id] = { id, kind: 'X', exam: e.id, key: x.key, md: x.md, lis: x.lis, n: x.n, label: x.label, ans: [x.ans], type: exType(x.lis, x.md, exLv(e)) }; }));
};
indexContent();
function exQName(e, md) { const p = PART(md, exLv(e)); return p ? `${PPS(p)} 問題${p.no}`.trim() : '問題' + md; }
function itemLabel(it) { return it.kind === 'X' ? `Đề ${EXAM(it.exam) ? EXAM(it.exam).title : it.exam} · ${it.lis ? '聴解 問題' + it.md + ' 番' + it.label : exQName(EXAM(it.exam), it.md) + ' câu ' + it.label}` : `${setTitle(SET[it.set])} · ${it.kind === 'L' ? 'câu ' + it.n : 'đọc'}`; }

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
  } catch (e) { box.innerHTML = `<p class="bad-t">${esc(e.message || 'Không mở được PDF')}. ${String(e.message || '').includes('404') || e.status === 404 ? 'File chưa được tải lên: Cài đặt → Tài liệu → chọn thư mục chứa đề của cấp này.' : ''}</p>`; }
}
function pdfViewerHTML(tabs) {
  return `<div class="pv"><div class="pvbar">${tabs || ''}<button class="btn sm" data-a="pvPrev" aria-label="Trang trước">‹</button><span id="pvn" class="num muted">${PV.page} / ${PV.n || '…'}</span><button class="btn sm" data-a="pvNext" aria-label="Trang sau">›</button><button class="btn ghost sm" data-a="pvZoom">${PV.zoom > 1 ? 'Thu nhỏ' : 'Phóng to'}</button></div><div id="pdfbox" class="pdfbox"><p class="muted">Đang mở đề…</p></div></div>`;
}
Object.assign(ACT, {
  pvPrev() { if (PV.page > 1) { PV.page--; drawPdf(); } },
  pvNext() { if (!PV.n || PV.page < PV.n) { PV.page++; drawPdf(); } },
  pvZoom() { PV.zoom = PV.zoom > 1 ? 1 : 1.5; render(); },
  pvGo(t) { const [lis, md] = t.dataset.s.split(':').map(Number), loc = exLoc(EXAM(EXM.id), !!lis, md); EXM.view = 'p'; EXM.passet = loc.asset; PV.asset = loc.asset; PV.page = loc.page; if (lis && EXM.amd !== md && Array.isArray(EXAM(EXM.id).mp3) && EXM.mode !== 'full') EXM.amd = md; render(); },
});
addEventListener('keydown', e => { if (route !== 'exam' || !EXM || e.target.closest('input,textarea,select')) return; if (e.key === 'PageDown' || (e.key === 'ArrowRight' && e.altKey)) { e.preventDefault(); ACT.pvNext(); } if (e.key === 'PageUp' || (e.key === 'ArrowLeft' && e.altKey)) { e.preventDefault(); ACT.pvPrev(); } });

/* ----- Phiên làm đề ----- */
let EXM = null;   // { id, mode:'full'|'part', part, sec:{lis,md}, keys, ans, t0, acc, run, graded, view }
function exKeys(e, mode, part, sec) {
  return exItems(e).filter(x => mode === 'full' ? exPaperOf(e, x) === part : x.lis === sec.lis && x.md === sec.md).map(x => x.key);
}
/* Vị trí của một 問題: { asset PDF, trang }. Đề N2: 1 file; đề N3–N5: pg[md] = [file, trang] */
function exLoc(e, lis, md) {
  const m = lis ? e.lpg : e.pg; let best = null; Object.entries(m).forEach(([k, v]) => { if (+k <= md && (!best || +k > best[0])) best = [+k, v]; });
  if (!best) { const f = Object.entries(m).sort((a, b) => a[0] - b[0])[0]; best = f ? [+f[0], f[1]] : [0, 1]; }
  const v = best[1];
  return Array.isArray(v) ? { asset: exAsset(e.id, 'p' + v[0]), page: v[1] } : { asset: exAsset(e.id, 'p'), page: v };
}
function exFirstMd(e, part) { const xs = exItems(e).filter(x => exPaperOf(e, x) === part); return xs.length ? xs[0] : { lis: !!exPapers(e)[part].lis, md: 1 }; }
function startExam(id, mode, part, sec) {
  const e = EXAM(id); if (!e) return;
  EXM = { id, mode, part: part || 0, sec: sec || null, keys: [], ans: {}, t0: Date.now(), acc: 0, run: true, graded: false, view: 'p', amd: 0 };
  EXM.keys = exKeys(e, mode, EXM.part, sec);
  const f = mode === 'full' ? exFirstMd(e, EXM.part) : sec, loc = exLoc(e, f.lis, f.md);
  EXM.amd = f.lis ? f.md : 0; EXM.passet = loc.asset;
  PV = { asset: loc.asset, page: loc.page, n: 0, zoom: PV.zoom || 1 };
  if (route !== 'exam') go('exam'); else render();
}
const exPartMin = () => exPapers(EXAM(EXM.id))[EXM.part].min;
function exElapsed() { return EXM.acc + (EXM.run ? (Date.now() - EXM.t0) / 1000 : 0); }
function exTimerText() {
  const e = exElapsed();
  if (EXM.mode === 'full' && !EXM.graded) { const rem = Math.max(0, exPartMin() * 60 - e); return { t: mmss(rem), late: rem < 300 }; }
  return { t: mmss(e), late: false };
}
setInterval(() => { if (route === 'exam' && EXM && EXM.run && !EXM.graded) { const el = $('#exclock'); if (el) { const x = exTimerText(); el.textContent = x.t; el.classList.toggle('late', x.late); } if (EXM.mode === 'full' && exElapsed() >= exPartMin() * 60 && !EXM.beeped) { EXM.beeped = true; exBeep(); toast('Hết giờ phần này'); } } }, 1000);
function exBeep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.value = 0.08; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.4); } catch (e) { } }
function exSheet(e) {
  const items = exItems(e).filter(x => EXM.keys.includes(x.key));
  const groups = []; items.forEach(x => { const g = groups[groups.length - 1]; const gk = (x.lis ? 'L' : 'K') + x.md; if (!g || g.k !== gk) groups.push({ k: gk, lis: x.lis, md: x.md, xs: [x] }); else g.xs.push(x); });
  return groups.map(g => `<div class="exg"><button class="lnkb exgh" data-a="pvGo" data-s="${g.lis ? 1 : 0}:${g.md}"><b lang="ja">${g.lis ? '聴解 問題' + g.md : exQName(e, g.md)}</b> <span class="muted">${esc(typeVi(exType(g.lis, g.md, exLv(e))))}</span> <span class="hint">→ trang ${exLoc(e, g.lis, g.md).page}</span></button>
    ${g.xs.map(x => { const v = EXM.ans[x.key], ok = EXM.graded ? v === x.ans : null, iid = exItemId(e.id, x.key);
      return `<div class="exrow${ok === false ? ' ng' : ''}"><span class="exn num">${esc(x.label)}</span>${[1, 2, 3, 4].slice(0, x.lis ? (LVD(exLv(e)).lis[x.md] || {}).nopt || 4 : 4).map(o => `<button class="bub${v === o ? ' on' : ''}${EXM.graded && o === x.ans ? ' ok' : ''}" data-a="exPick" data-k="${x.key}" data-v="${o}" ${EXM.graded ? 'disabled' : ''}>${o}</button>`).join('')}
      ${ok === false ? `<select class="exwhy" data-a="exWhy" data-id="${iid}" aria-label="Lý do sai"><option value="">lý do?</option>${WHY.map(([k, l]) => `<option value="${k}" ${(attempts(iid).slice(-1)[0] || [])[5] === k ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}</div>`; }).join('')}</div>`).join('');
}
function exView() {
  const e = EXAM(EXM.id), done = EXM.keys.filter(k => EXM.ans[k]).length, x = exTimerText(), pp = exPapers(e), lv = exLv(e);
  const title = EXM.mode === 'redo' ? 'Làm lại câu sai' : EXM.mode === 'full' ? `${pp[EXM.part].vi} · ${pp[EXM.part].min}′` : `${EXM.sec.lis ? '聴解 問題' + EXM.sec.md : exQName(e, EXM.sec.md)} · ${typeVi(exType(EXM.sec.lis, EXM.sec.md, lv))}`;
  const lisOn = exLisOn(), multiA = Array.isArray(e.mp3), multiP = Array.isArray(e.pdf);
  const res = EXM.graded ? exResult(e) : null;
  const files = multiP ? [...new Set(exItems(e).filter(i => EXM.keys.includes(i.key)).map(i => exLoc(e, i.lis, i.md).asset))] : [];
  const ftabs = files.length > 1 ? files.map(a => `<button class="${EXM.view === 'p' && EXM.passet === a ? 'on' : ''}" data-a="exFile" data-v="${a}">${['文字語彙', '文法', '読解', '聴解'][+a.slice(-1)] || 'Đề'}</button>`).join('') : '';
  const tabs = EXM.graded || ftabs ? `<div class="seg sm">${ftabs || `<button class="${EXM.view === 'p' ? 'on' : ''}" data-a="exViewP">Đề</button>`}${EXM.graded && e.script ? `<button class="${EXM.view === 's' ? 'on' : ''}" data-a="exViewS">Script nghe</button>` : ''}</div>` : '';
  const amds = multiA ? [...new Set(exItems(e).filter(i => i.lis && EXM.keys.includes(i.key)).map(i => i.md))] : [];
  const next = EXM.mode === 'full' && EXM.part + 1 < pp.length ? pp[EXM.part + 1] : null;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="exQuit">Thoát</button><span class="muted">Đề ${esc(e.title)} · ${esc(title)}</span><span id="exclock" class="num clockm ${x.late ? 'late' : ''}">${x.t}</span></div>
  <div class="exgrid"><section class="panel expdf">${pdfViewerHTML(tabs)}</section>
  <aside class="panel exside">
    ${lisOn ? `<div class="exaudio"><b>File nghe</b>${amds.length > 1 ? `<div class="chips">${amds.map(m => `<button class="chip${EXM.amd === m ? ' on' : ''}" data-a="exAmd" data-v="${m}" lang="ja">問題${m}</button>`).join('')}</div>` : ''}<audio id="exaudio" controls preload="metadata"></audio><p class="hint">${multiA ? 'Mỗi 問題 một file, hết file tự chuyển sang 問題 kế tiếp. ' : ''}Đề thật chỉ nghe 1 lần, không dừng.${multiA ? '' : ' Luyện từng phần thì tua đến đúng 問題.'}</p></div>` : ''}
    ${res ? res : `<div class="ph sm"><h3>Phiếu trả lời</h3><span class="num muted">${done}/${EXM.keys.length}</span></div>`}
    <div class="sheet">${exSheet(e)}</div>
    ${EXM.graded ? `<div class="row"><button class="btn" data-a="exRedo">Làm lại câu sai</button>${next ? `<button class="btn pri" data-a="exNextPart">Sang phần ${esc(next.vi)} (${next.min}′)</button>` : ''}<button class="btn ghost" data-a="exClose">Về danh sách đề</button></div>`
      : `<div class="row">${EXM.run ? '<button class="btn sm" data-a="exPause">Tạm dừng</button>' : '<button class="btn sm" data-a="exResume">Tiếp tục</button>'}<button class="btn pri" data-a="exSubmit">Nộp và chấm</button></div>`}
  </aside></div>`;
}
AFTER.exam = () => {
  if (EXM) {
    const e = EXAM(EXM.id);
    PV.asset = EXM.graded && EXM.view === 's' ? exAsset(EXM.id, 's') : (EXM.passet || exAsset(EXM.id, 'p')); drawPdf();
    const au = $('#exaudio');
    if (au) {
      const multi = Array.isArray(e.mp3), k = multi ? 'a' + (EXM.amd || 1) : 'a';
      if (au.dataset.k !== k) { au.dataset.k = k; const auto = multi && EXM.autoNext; EXM.autoNext = false; mediaUrl(exAsset(EXM.id, k)).then(u => { au.src = u; if (auto) au.play().catch(() => { }); }).catch(err => toast(err.message)); }
      if (multi) au.onended = () => { const mds = [...new Set(exItems(e).filter(i => i.lis && EXM.keys.includes(i.key)).map(i => i.md))], nx = mds[mds.indexOf(EXM.amd) + 1]; if (nx && !EXM.graded) { EXM.amd = nx; EXM.autoNext = true; const loc = exLoc(e, true, nx); EXM.passet = loc.asset; PV.page = loc.page; render(); } };
    }
    return;
  }
  const f = $('#scoreform'); if (f) f.onsubmit = ev => { ev.preventDefault(); const lv = curLv(), R = LVD(lv).rule; const s = R.secs.map((x, i) => Math.max(0, Math.min(x[1], +$('#sf-' + i).value || 0))); S.exams.push({ id: Date.now().toString(36), d: $('#sf-d').value, lv, s }); save(); const j = judge(lv, s); toast(`Tổng ${j.total}/180 · ${j.ok ? 'Đỗ' : 'Chưa đỗ'}`); render(); };
  if (CF.cfg && EXDEF().length && !IMP.have && !EXL.asked) { EXL.asked = true; audioHave().then(h => { if (h && route === 'exam' && !EXM) render(); }); }
};
/* Điểm ước tính: % đúng mỗi phần × 60 (JLPT thật chấm theo thang chuẩn hóa nên chỉ để tham khảo) */
function exSecs(e, ans) {
  const it = exItems(e), lv = exLv(e), R = LVD(lv).rule, three = R.secs.length === 3;
  const sec = x => x.lis ? R.secs.length - 1 : three ? (PART(x.md, lv).sec === 'K' ? 0 : 1) : 0;
  return R.secs.map((r, i) => { const xs = it.filter(x => sec(x) === i), ok = xs.filter(x => ans[x.key] === x.ans).length, an = xs.filter(x => ans[x.key]).length; return { n: xs.length, ok, an, est: xs.length ? Math.round(ok / xs.length * r[1]) : 0 }; });
}
function exResult(e) {
  const its = exItems(e).filter(x => EXM.keys.includes(x.key)), ok = its.filter(x => EXM.ans[x.key] === x.ans).length;
  const byMd = {}; its.forEach(x => { const k = (x.lis ? 'L' : 'K') + x.md, b = byMd[k] || (byMd[k] = { lis: x.lis, md: x.md, n: 0, ok: 0 }); b.n++; if (EXM.ans[x.key] === x.ans) b.ok++; });
  return `<div class="expl ${pct(ok, its.length) >= 60 ? 'good' : 'bad'}"><b>${ok}/${its.length} câu đúng (${pct(ok, its.length)}%)</b> · ${mmss(EXM.acc)}</div>
    <div class="mdres">${Object.values(byMd).map(b => `<span class="tag ${pct(b.ok, b.n) < 60 ? 'badtag' : ''}" lang="ja">${b.lis ? '聴解 問題' + b.md : exQName(e, b.md)}: ${b.ok}/${b.n}</span>`).join('')}</div>
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
      if (EXM.part === exPapers(e).length - 1) { const s = exSecs(e, EXFULL[EXM.id]), lv = exLv(e); S.exams.push({ id: Date.now().toString(36), d: dayKey(), lv, s: s.map(x => x.est), src: e.id, est: 1 }); save(); const j = judge(lv, s.map(x => x.est)); toast(`Ước tính ${j.total}/180 · ${j.ok ? 'Đỗ' : 'Chưa đỗ'}`); delete EXFULL[EXM.id]; }
    }
    render(); scrollTo(0, 0);
  },
  exNextPart() { startExam(EXM.id, 'full', EXM.part + 1); },
  exFile(t) { EXM.view = 'p'; EXM.passet = t.dataset.v; PV.page = 1; render(); },
  exAmd(t) { EXM.amd = +t.dataset.v; const loc = exLoc(EXAM(EXM.id), true, EXM.amd); EXM.view = 'p'; EXM.passet = loc.asset; PV.page = loc.page; render(); },
  exRedo() { const e = EXAM(EXM.id), wrong = EXM.keys.filter(k => EXM.ans[k] !== exItems(e).find(x => x.key === k).ans); if (!wrong.length) { toast('Không có câu sai'); return; } EXM = { ...EXM, mode: 'redo', keys: wrong, ans: {}, graded: false, run: true, t0: Date.now(), acc: 0, sec: EXM.sec || { lis: exLisOn(), md: 0 } }; render(); },
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
function exAvail(e) { return !IMP.have || exFiles(e).filter(f => f[0] !== 's').every(([k]) => IMP.have.has(exAsset(e.id, k))); }
function exStat(e) {
  const its = exItems(e), done = its.filter(x => attempts(exItemId(e.id, x.key)).length), ok = done.filter(x => ist(exItemId(e.id, x.key)).first);
  const full = S.exams.filter(x => x.src === e.id).slice(-1)[0];
  return { n: its.length, done: done.length, firstPct: pct(ok.length, done.length), full };
}
VIEWS.exam = () => {
  if (EXM) return exView();
  const lv = curLv(), D = LVD(lv), R = D.rule, ex = EXDEF(), hist = S.exams.filter(h => (h.lv || 'N2') === lv).sort((a, b) => a.d < b.d ? -1 : 1), max = R.secs.reduce((a, x) => a + x[1], 0);
  const kp = D.parts.filter(p => p.sec === 'K'), rp = D.parts.filter(p => p.sec === 'R');
  const chip = (e, lis, md, label) => `<button class="chip" data-a="exPart" data-v="${e.id}" data-s="${lis}:${md}" lang="ja">${label}</button>`;
  const secBtns = e => `<div class="chips">${kp.map(p => chip(e, 0, p.md, `${PPS(p)} 問題${p.no}`.trim())).join('')}</div><div class="chips">${rp.map(p => chip(e, 0, p.md, `読解 問題${p.no}`)).join('')}</div><div class="chips">${Object.keys(D.lis).map(m => chip(e, 1, m, `聴解 問題${m}`)).join('')}</div>`;
  const flow = D.papers.map(p => `${p.min}′ ${p.vi.toLowerCase()}`).join(', rồi ');
  return `<h1 class="pt">Thi thử ${lv} <span lang="ja">模試</span></h1>
  <section class="panel lvbar"><span><b>Cấp đang luyện</b></span>${lvSwitchHTML()}</section>
  ${ex.length ? `<section class="panel"><div class="ph"><h2>${lv === 'N2' ? 'Đề thật các năm' : 'Đề chính thức (公式問題集)'}</h2><span class="muted">${ex.length} đề</span></div>
    <p class="hint">Thi full: ${flow}; chấm theo bảng đáp án, điểm từng phần ước tính = % đúng × điểm tối đa của phần. Hoặc làm từng 問題 để luyện dạng mình yếu.</p>
    <div class="exlist">${ex.map(e => { const st = exStat(e), av = exAvail(e), j = st.full ? judge(lv, st.full.s) : null; return `<div class="exi"><div class="exh"><b>${esc(e.title)}</b>${!av ? '<span class="tag">chưa tải file</span>' : ''}<span class="muted num">${st.done ? `đã làm ${st.done}/${st.n} câu · đúng lần đầu ${st.firstPct}%` : `${st.n} câu`}</span>${j ? `<span class="pill ${j.ok ? 'good' : 'bad'}">${j.total}/${max}</span>` : ''}
      <span class="exb"><button class="btn sm pri" data-a="exFull" data-v="${e.id}" ${av ? '' : 'disabled'}>Thi full</button><button class="btn sm" data-a="exToggle" data-v="${e.id}" ${av ? '' : 'disabled'}>Từng phần</button></span></div>${EXL.open === e.id ? secBtns(e) : ''}</div>`; }).join('')}</div>
  </section>` : `<section class="panel"><h2>Đề thi ${lv}</h2><p class="muted">Chưa có. Trên laptop: Cài đặt → Tài liệu → chọn thư mục <b>${lv === 'N2' ? 'N2_ĐỀ CÁC NĂM' : 'JLPT-CHINH-THUC-N3-N5'}</b>.</p></section>`}
  <section class="grid2"><div class="panel"><div class="ph"><h2>Nhập điểm đề ngoài (${lv})</h2></div>
      <form id="scoreform" class="sform"><label>Ngày <input id="sf-d" type="date" value="${dayKey()}" required></label>${R.secs.map((s, i) => `<label>${s[0]} <small>(0–${s[1]})</small><input id="sf-${i}" type="number" inputmode="numeric" min="0" max="${s[1]}" required></label>`).join('')}<button class="btn pri" type="submit">Lưu</button></form>
      <p class="hint">${lv} đỗ khi tổng ≥ ${R.pass}/${max} và ${R.secs.map(s => `${s[0]} ≥ ${s[2]}`).join(', ')}.</p></div>
    <div class="panel"><div class="ph"><h2>Lịch sử điểm ${lv}</h2><span class="muted num">${hist.length}</span></div>
    ${hist.length ? `<div class="tbl"><table><thead><tr><th>Ngày</th><th>Đề</th><th>Từng phần</th><th>Tổng</th><th></th></tr></thead><tbody>${hist.map(h => { const j = judge(lv, h.s); return `<tr><td class="num">${h.d}</td><td>${h.src ? esc(EXAM(h.src) ? EXAM(h.src).title : h.src) + (h.est ? ' <small class="muted">ước tính</small>' : '') : '—'}</td><td class="num">${h.s.join(' / ')}</td><td class="num"><b>${j.total}</b> ${j.ok ? '<span class="pill good">Đỗ</span>' : '<span class="pill bad">Trượt</span>'}</td><td><button class="btn ghost sm" data-a="exDel" data-v="${h.id}">Xóa</button></td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted">Chưa có.</p>'}</div></section>
  <section class="grid2"><details class="panel"><summary><h2>Cấu trúc đề ${lv}</h2></summary><div class="tbl"><table><thead><tr><th>Bài thi</th><th>問題</th><th>Dạng</th><th>Làm gì</th><th>Câu</th></tr></thead><tbody>${D.parts.map(r => `<tr><td lang="ja">${D.papers[r.pp].ja} ${D.papers[r.pp].min}′</td><td>${r.no}</td><td lang="ja">${r.ja}</td><td>${r.vi}</td><td>${r.n}</td></tr>`).join('')}</tbody></table></div></details>
    <details class="panel"><summary><h2>Nghe hiểu (${D.papers[D.papers.length - 1].min}′)</h2></summary><div class="tbl"><table><thead><tr><th>問題</th><th>Dạng</th><th>Câu</th><th>Mẹo</th></tr></thead><tbody>${Object.keys(D.lis).map(m => `<tr><td>${m}</td><td lang="ja">${D.lis[m].ja}</td><td>${D.lis[m].n}</td><td>${esc(D.lis[m].tip)}</td></tr>`).join('')}</tbody></table></div></details></section>`;
};
ACT.exDel = t => { S.exams = S.exams.filter(x => x.id !== t.dataset.v); S.exdel = [...new Set([...(S.exdel || []), t.dataset.v])]; save(); render(); };
