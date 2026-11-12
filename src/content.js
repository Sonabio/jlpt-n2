/* ===== NỘI DUNG BÀI TẬP (lưu riêng trên D1, chỉ máy đã ghép mới tải được) =====
   Hai kho: 'main' = tài liệu N2; 'n345' = đề chính thức + bài luyện N3–N5. Mỗi bộ/đề có lv; C là phần của cấp đang luyện. */
const SLOTS = ['main', 'n345'];
const CK = k => 'jlpt-n2-content' + (k === 'main' ? '' : '-' + k);
const CS = {};                // slot → { sets, exams, upd }
let C = null;                 // { sets, exams } của cấp đang luyện (null nếu cấp này chưa có gì)
const ITEM = {}, SET = {}, PASS = {};
const lvOf = x => x.lv || 'N2';
function allSets() { return SLOTS.flatMap(k => (CS[k] && CS[k].sets) || []); }
function allExams() { return SLOTS.flatMap(k => (CS[k] && CS[k].exams) || []); }
function buildC() {
  const lv = curLv(), sets = allSets().filter(s => lvOf(s) === lv), exams = allExams().filter(e => lvOf(e) === lv);
  C = sets.length || exams.length ? { sets, exams } : null;
  indexContent();
}
function indexContent() {
  for (const k in ITEM) delete ITEM[k]; for (const k in SET) delete SET[k]; for (const k in PASS) delete PASS[k];
  if (!C) return;
  C.sets.forEach(s => {
    SET[s.id] = s;
    (s.passages || []).forEach(p => { PASS[p.pid] = p; });
    s.items.forEach((it, i) => { ITEM[it.id] = { ...it, tts: it.tts || s.tts, set: s.id, kind: s.kind, i, type: s.kind === 'L' ? 'L' + s.md : 'R' + PASS[it.pid].type }; });
  });
}
function setTitle(s) { return s.title || (s.src === 'f-' ? `Nền tảng · Chương ${s.unit}` : `Chặng 2 · Bài ${s.unit}`); }
const PPS = p => p.sec === 'R' ? '読解' : LVD().papers.length > 2 ? (p.pp ? '文法' : '文字語彙') : '';
function typeName(t) { if (t[0] === 'L') return `聴解 問題${t[1]} ${MDL()[t[1]].ja}`; if (t[0] === 'K') { const p = PART(t.slice(1)); return `${PPS(p)} 問題${p.no} ${p.ja}`.trim(); } return `読解 ${t.slice(1)}`; }
function typeVi(t) { if (t[0] === 'L') return `Nghe ${t[1]} · ${MDL()[t[1]].vi}`; if (t[0] === 'K') { const p = PART(t.slice(1)); return `${p.pp || (LVD().papers.length < 3 && p.md >= 7) ? 'Ngữ pháp' : 'Từ vựng'} · ${p.vi}`; } return `Đọc · ${RTL()[t.slice(1)].vi}`; }
function loadContentLocal() { SLOTS.forEach(k => { try { const r = localStorage.getItem(CK(k)); if (r) CS[k] = JSON.parse(r); } catch (e) { } }); buildC(); }
async function fetchContent(force) {
  if (!CF.cfg) return false;
  let got = false;
  for (const k of SLOTS) {
    try {
      const q = [k === 'main' ? '' : 'slot=' + k, CS[k] && !force ? 'since=' + (CS[k].upd || 0) : ''].filter(Boolean).join('&');
      const r = await CF.call('/content' + (q ? '?' + q : ''));
      if (r && r.data) { CS[k] = JSON.parse(r.data); CS[k].upd = r.upd; try { localStorage.setItem(CK(k), JSON.stringify(CS[k])); } catch (e) { } got = true; }
    } catch (e) { }
  }
  if (got) buildC();
  return got;
}
loadContentLocal();

/* ----- Âm thanh: tải từ máy chủ (cần khóa), giữ trong Cache Storage để nghe lại offline ----- */
const AU = { el: null, url: null, id: null, plays: 0, loading: false, rate: 1, tts: null };
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
  audioStop(); if (ITEM[id] && ITEM[id].tts) { AU.id = id; AU.plays = 0; AU.err = null; AU.tts = { q: ttsLines(ITEM[id]), i: 0, on: false }; drawPlayer(); return; }
  AU.id = id; AU.loading = true; AU.err = null; AU.plays = 0; drawPlayer();
  try { const b = await audioBlob(id); if (AU.id !== id) return; AU.url = URL.createObjectURL(b); AU.el = new Audio(AU.url); AU.el.playbackRate = AU.rate; AU.el.preload = 'auto';
    ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata'].forEach(ev => AU.el.addEventListener(ev, () => { if (ev === 'play' && AU.el.currentTime < 0.5) AU.plays++; drawPlayer(); }));
  } catch (e) { AU.err = e.message; }
  AU.loading = false; drawPlayer();
}
function audioStop() { ttsStop(); AU.tts = null; if (AU.el) { try { AU.el.pause(); } catch (e) { } } if (AU.url) URL.revokeObjectURL(AU.url); AU.el = null; AU.url = null; AU.id = null; }
function playerHTML() { return `<div id="player" class="player" aria-live="polite"></div>`; }
function drawPlayer() {
  const el = $('#player'); if (!el) return;
  if (AU.loading) { el.innerHTML = '<span class="muted">Đang tải file nghe…</span>'; return; }
  if (AU.err) { el.innerHTML = `<span class="bad-t">${esc(AU.err)}</span>`; return; }
  if (AU.tts) { el.innerHTML = `<button class="btn pri play" data-a="auToggle" aria-label="${AU.tts.on ? 'Dừng' : 'Phát'}">${AU.tts.on ? '■' : '▶'}</button>
    <div class="ptrack"><i style="width:${AU.tts.q.length ? AU.tts.i / AU.tts.q.length * 100 : 0}%"></i></div>
    <select data-a="auRate" aria-label="Tốc độ">${[0.85, 1, 1.15].map(r => `<option value="${r}" ${AU.rate === r ? 'selected' : ''}>${r}×</option>`).join('')}</select>
    <span class="muted plays">nghe ${AU.plays} lần · giọng đọc máy</span>`; return; }
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
  auToggle() { if (AU.tts) { AU.tts.on ? ttsStop() : ttsPlay(); return; } if (!AU.el) return; if (AU.el.paused) AU.el.play().catch(() => toast('Bấm lại để phát')); else AU.el.pause(); },
  auBack() { if (AU.el) AU.el.currentTime = Math.max(0, AU.el.currentTime - 5); },
  auSeek(t, e) { if (!AU.el || !AU.el.duration) return; const r = t.getBoundingClientRect(); AU.el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * AU.el.duration; },
  auRate(t) { AU.rate = +t.value; if (AU.el) AU.el.playbackRate = AU.rate; },
});
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select')) return;
  if (e.code === 'Space' && AU.el && (route === 'listen' || route === 'drill')) { e.preventDefault(); ACT.auToggle(); }
});

/* ----- Bài tự soạn (N3–N5): đọc script bằng giọng máy của trình duyệt, đổi cao độ theo vai nam/nữ ----- */
function ttsLines(it) {
  const md = SET[it.set] ? SET[it.set].md : 0, def = MDL()[md] || {}, out = [];
  String(it.script || '').split('\n').map(l => l.trim()).filter(Boolean).forEach(l => { const m = l.match(/^(男|女|男の人|女の人|M|F)[：:]\s*(.+)$/); out.push(m ? { who: /男|M/.test(m[1]) ? 'm' : 'f', t: m[2] } : { who: '', t: l }); });
  const o = itemOpts(it, 0);
  if (def.opts === 'spoken' && o) { if (it.q && !String(it.script || '').includes(it.q)) out.push({ who: '', t: it.q, gap: 500 }); const w = (out[out.length - 1] || {}).who === 'm' ? 'f' : (out.filter(x => x.who).length ? 'm' : 'f'); o.forEach((x, j) => { out.push({ who: '', t: String(j + 1), gap: 450 }); out.push({ who: def.ja === '概要理解' ? '' : w, t: x }); }); }
  else if (it.q) out.push({ who: '', t: it.q, gap: 700 });
  return out;
}
function ttsVoice(who) {
  let vs = []; try { vs = speechSynthesis.getVoices().filter(v => /^ja/i.test(v.lang)); } catch (e) { }
  const male = vs.find(v => /Ichiro|Keita|Otoya|Daichi|Naoki|男/i.test(v.name)), fem = vs.find(v => /Haruka|Ayumi|Nanami|Kyoko|Sayaka|O-?ren|女/i.test(v.name)) || vs[0];
  if (who === 'm') return { v: male || fem, pitch: male ? 1 : 0.7 };
  if (who === 'f') return { v: fem, pitch: male ? 1 : 1.25 };
  return { v: vs.find(v => /Google/i.test(v.name)) || fem, pitch: 1 };
}
function ttsStop() { if (AU.tts) AU.tts.on = false; clearTimeout(ttsStop.h); try { speechSynthesis.cancel(); } catch (e) { } drawPlayer(); }
function ttsPlay() {
  const T = AU.tts; if (!T) return; if (!('speechSynthesis' in window)) { AU.err = 'Trình duyệt này không có giọng đọc tiếng Nhật.'; AU.tts = null; drawPlayer(); return; }
  try { speechSynthesis.cancel(); } catch (e) { } T.i = 0; T.on = true; AU.plays++; const id = AU.id;
  const step = () => {
    if (AU.tts !== T || !T.on || AU.id !== id) return;
    if (T.i >= T.q.length) { T.on = false; drawPlayer(); return; }
    const x = T.q[T.i], u = new SpeechSynthesisUtterance(x.t), vc = ttsVoice(x.who);
    u.lang = 'ja-JP'; if (vc.v) u.voice = vc.v; u.pitch = vc.pitch; u.rate = 0.95 * AU.rate;
    u.onend = u.onerror = () => { if (AU.tts !== T || !T.on) return; T.i++; drawPlayer(); ttsStop.h = setTimeout(step, (T.q[T.i] && T.q[T.i].gap) || 320); };
    speechSynthesis.speak(u); drawPlayer();
  };
  step();
}
try { speechSynthesis.getVoices(); } catch (e) { }

const exAsset = (id, k) => 'x' + id + '-' + k;
/* File của một đề: N2 là 1 PDF + 1 MP3; đề chính thức N3–N5 là nhiều PDF (theo bài thi) và MP3 theo từng 問題 */
function exFiles(e) {
  const out = [];
  if (Array.isArray(e.pdf)) e.pdf.forEach((rel, i) => out.push(['p' + i, rel, 'application/pdf'])); else out.push(['p', e.pdf, 'application/pdf']);
  if (e.script) out.push(['s', e.script, 'application/pdf']);
  if (Array.isArray(e.mp3)) e.mp3.forEach((rel, i) => out.push(['a' + (i + 1), rel, 'audio/mpeg'])); else out.push(['a', e.mp3, 'audio/mpeg']);
  return out;
}
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
    const jfs = files.filter(f => /^content-[a-z0-9]+\.json$/i.test(f.name));
    const contents = [];
    for (const jf of jfs) {
      const txt = await jf.text(), content = JSON.parse(txt);
      if (!content.sets) throw new Error('File ' + jf.name + ' không đúng định dạng');
      const slot = SLOTS.includes(content.slot) ? content.slot : 'main';
      IMP.msg = 'Đang tải nội dung bài tập lên…'; render();
      await CF.call('/content' + (slot === 'main' ? '' : '?slot=' + slot), { method: 'PUT', body: { data: txt } });
      contents.push(content);
    }
    if (jfs.length) await fetchContent(true);
    else if (allSets().length || allExams().length) contents.push({ sets: allSets(), exams: allExams() });
    if (!contents.length) throw new Error('Không thấy file content-*.json trong thư mục đã chọn.');
    const norm = s => s.normalize('NFC').replace(/\\/g, '/').toLowerCase();
    const byPath = files.map(f => [norm(f.webkitRelativePath || f.name), f]);
    const jobs = [];
    const find = rel => { if (!rel) return null; const want = norm(rel); const hit = byPath.find(([p]) => p.endsWith(want)); return hit && hit[1]; };
    contents.forEach(content => {
      content.sets.forEach(s => s.items.forEach(it => { if (!it.audio) return; const f = find(it.audio); if (f) jobs.push([it.id, f, 'audio/mpeg']); }));
      (content.exams || []).forEach(e => exFiles(e).forEach(([k, rel, type]) => { const f = find(rel); if (f) jobs.push([exAsset(e.id, k), f, type]); }));
    });
    await audioHave();
    const todo = jobs.filter(([id]) => !(IMP.have && IMP.have.has(id)));
    IMP.total = jobs.length; IMP.skip = jobs.length - todo.length;
    if (!jobs.length) IMP.msg = 'Không thấy file khớp. Hãy chọn đúng thư mục tài liệu (xem danh sách bên dưới).';
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
  const S0 = allSets(), E0 = allExams(), any = S0.length || E0.length;
  const nItems = S0.reduce((a, s) => a + s.items.length, 0), nAudio = S0.reduce((a, s) => a + s.items.filter(i => i.audio).length, 0);
  const nEx = E0.length, exHave = nEx && IMP.have ? E0.filter(e => exFiles(e).every(([k]) => IMP.have.has(exAsset(e.id, k)))).length : 0;
  const byLv = LVS.map(l => { const n = S0.filter(s => lvOf(s) === l).reduce((a, s) => a + s.items.length, 0), x = E0.filter(e => lvOf(e) === l).length; return n || x ? `${l}: ${n} câu luyện, ${x} đề` : ''; }).filter(Boolean).join(' · ');
  return `<div class="gist">
    <p><b>Tài liệu</b> ${any ? `<span class="tag on">${nItems} câu · ${nAudio} file nghe${nEx ? ` · ${nEx} đề thi` : ''}</span>` : '<span class="tag">chưa có</span>'}</p>
    ${byLv ? `<p class="hint">${byLv}</p>` : ''}
    <p class="hint">Nội dung và file nghe được lưu riêng trên máy chủ của bạn (D1/R2), chỉ máy đã ghép mới tải được; không nằm trên GitHub.</p>
    ${CF.cfg ? `<label class="btn ${any ? '' : 'pri'}" ${IMP.busy ? 'aria-disabled="true"' : ''}>Chọn thư mục tài liệu…<input type="file" id="impdir" webkitdirectory directory multiple hidden data-a="impPick" ${IMP.busy ? 'disabled' : ''}></label>
    <p class="hint">Trên laptop, chọn lần lượt từng thư mục: <b>2.DMR-TÀI LIỆU HỌC VIÊN</b>, <b>N2_ĐỀ CÁC NĂM</b> (N2) và <b>JLPT_CHINH_THUC_N3-N5</b> (N3–N5). Mỗi thư mục có sẵn file content-….json. File đã tải lên sẽ được bỏ qua.</p>` : '<p class="hint">Bật đồng bộ trước rồi mới nhập được.</p>'}
    ${IMP.have ? `<p class="hint">Trên máy chủ: ${[...IMP.have].filter(x => x[0] !== 'x').length}/${nAudio} file nghe bài tập${nEx ? ` · ${exHave}/${nEx} đề đủ file (đề + script + nghe)` : ''}.</p>` : ''}
    ${IMP.msg ? `<p id="impmsg" class="${IMP.msg.startsWith('Lỗi') ? 'bad-t' : ''}">${esc(IMP.msg)}</p>` : ''}
    ${any && CF.cfg ? '<div class="row"><button class="btn ghost sm" data-a="contentRefresh">Tải lại nội dung từ máy chủ</button><button class="btn ghost sm" data-a="audioClear">Xóa file nghe đã lưu tạm trên máy này</button></div>' : ''}
  </div>`;
}
Object.assign(ACT, {
  impPick(t) { if (t.files && t.files.length) importFolder(t.files); },
  async contentRefresh() { const ok = await fetchContent(true); toast(ok ? 'Đã tải lại nội dung' : 'Chưa có nội dung trên máy chủ'); render(); },
  async audioClear() { try { await caches.delete(ACACHE); toast('Đã xóa file nghe lưu tạm'); } catch (e) { } },
});
