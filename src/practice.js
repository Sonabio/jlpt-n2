/* ===== LÀM BÀI: ghi lần làm, trạng thái điểm yếu ===== */
const BOX_DAYS = [0, 1, 3, 7, 21];
function attempts(id) { return S.att[id] || []; }
function ist(id) {
  const a = attempts(id); if (!a.length) return { n: 0 };
  let streak = 0; for (let i = a.length - 1; i >= 0 && a[i][2]; i--) streak++;
  const wrongEver = a.some(x => !x[2]), last = a[a.length - 1], box = Math.min(streak, 4);
  const dueAt = last[0] + BOX_DAYS[box] * 864e5 - (box ? 3 * 3600e3 : 0);
  const weak = wrongEver && streak < 3;
  return { n: a.length, first: a[0][2], last: last[2], streak, wrongEver, weak, dueAt, due: weak && Date.now() >= dueAt, why: a.filter(x => !x[2] && x[5]).map(x => x[5]) };
}
function rec(id, picks, ok, secs, plays) {
  const a = S.att[id] || (S.att[id] = []);
  a.push([Date.now(), picks.join(','), ok ? 1 : 0, Math.round(secs), plays || 0, '']);
  if (a.length > 30) a.splice(0, a.length - 30);
  logAdd('n', 1); if (ok) logAdd('c', 1);
  save();
}
function setWhy(id, why) { const a = S.att[id]; if (!a || !a.length) return; const l = a[a.length - 1]; l[5] = l[5] === why ? '' : why; save(); }
function okPick(it, picks) { return it.ans.every((v, i) => +picks[i] === v); }
function itemOpts(it, k) { return (it.opts && (it.opts[k] || it.opts[0])) || null; }
function weakDue(kind) { return Object.keys(S.att).filter(id => ITEM[id] && (kind ? ITEM[id].kind === kind : ITEM[id].kind !== 'X') && ist(id).due).sort((a, b) => ist(a).dueAt - ist(b).dueAt); }

/* Chọn văn bản trong script/bài đọc để lưu thành cụm ôn trên điện thoại */
let LASTSEL = { t: '', src: '' };
document.addEventListener('selectionchange', () => {
  const s = getSelection(); if (!s || s.isCollapsed) return;
  const n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
  const box = n && n.closest && n.closest('[data-src]');
  const t = s.toString().replace(/\s+/g, ' ').trim();
  if (box && t && t.length <= 80) LASTSEL = { t, src: box.dataset.src, ctx: (n.closest('.sl') || n).textContent.trim().slice(0, 160) };
});
function phraseBox(src) {
  return `<div class="phrbox"><input id="phr-note" placeholder="Nghĩa / ghi chú (tùy chọn)" autocomplete="off"><button class="btn sm" data-a="phrSave" data-v="${esc(src)}">Lưu cụm đang bôi đen</button></div>
  <p class="hint">Bôi đen từ/cụm chưa biết trong script hoặc bài đọc rồi bấm Lưu: cụm đó thành thẻ ôn trên điện thoại.</p>`;
}
ACT.phrSave = t => {
  const sel = LASTSEL; if (!sel.t || sel.src !== t.dataset.v) { toast('Bôi đen một cụm trong script/bài đọc trước'); return; }
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  S.phr[id] = { t: sel.t, n: (($('#phr-note') || {}).value || '').trim(), src: sel.src, ctx: sel.ctx || '', at: Date.now(), s: null };
  save(); LASTSEL = { t: '', src: '' }; const i = $('#phr-note'); if (i) i.value = ''; toast('Đã lưu: ' + sel.t);
};
function whyChips(id) {
  const l = attempts(id).slice(-1)[0]; if (!l || l[2]) return '';
  return `<div class="whyrow"><span class="hint">Vì sao sai?</span><div class="chips">${WHY.map(([k, v]) => `<button class="chip${l[5] === k ? ' on' : ''}" data-a="why" data-id="${esc(id)}" data-v="${k}">${v}</button>`).join('')}</div></div>`;
}
ACT.why = t => { setWhy(t.dataset.id, t.dataset.v); t.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === t && attempts(t.dataset.id).slice(-1)[0][5] === t.dataset.v)); };

/* Hiển thị script: tách lời thoại, tô đậm câu chứa đáp án */
function scriptHTML(it, src) {
  const raw = String(it.script || '').split('\n').map(l => l.trim()).filter(Boolean), lines = [];
  raw.forEach((l, i) => { const prev = lines[lines.length - 1]; if (i > 1 && prev && !/[。？！?!」）)]$/.test(prev) && !/^[^\s：:「]{1,8}[：:]/.test(l)) lines[lines.length - 1] = prev + l; else lines.push(l); });
  const right = (itemOpts(it, 0) || [])[it.ans[0] - 1] || '';
  const key = right.replace(/[、。\s]/g, '');
  const score = l => { if (!key) return 0; let n = 0; for (const ch of new Set(key)) if (l.includes(ch)) n++; return n / new Set(key).size; };
  let best = -1, bs = 0.55; lines.forEach((l, i) => { if (i === 0) return; const s = score(l); if (s > bs) { bs = s; best = i; } });
  return `<div class="script" lang="ja" data-src="${esc(src)}">${lines.map((l, i) => `<p class="sl${i === 0 ? ' sq' : ''}${i === best ? ' key' : ''}">${esc(l)}</p>`).join('')}</div>`;
}

/* ===== LUYỆN NGHE ===== */
let LP = null;   // { ids, i, picks, t0, shown, done, res, showOpts }
let LPICK = { tab: 'c2', md: 0 };
function startListen(ids, label) {
  if (!ids.length) { toast('Không có câu nào'); return; }
  LP = { ids, i: 0, picks: [], t0: Date.now(), shown: false, done: false, res: [], label, showOpts: !!S.set.showOpts };
  if (route !== 'listen') go('listen'); else render();
}
function lpItem() { return ITEM[LP.ids[LP.i]]; }
function listenOptsVisible(it) { const md = SET[it.set].md; return LP.showOpts || md === 1 || md === 2 || LP.shown; }
VIEWS.listen = () => {
  if (!C) return noContent();
  if (LP && !LP.done) return lpView();
  if (LP && LP.done) return lpSummary();
  const sets = C.sets.filter(s => s.kind === 'L' && (LPICK.tab === 'all' || s.src === (LPICK.tab === 'c2' ? 'c2-' : 'f-')) && (!LPICK.md || s.md === LPICK.md));
  const wd = weakDue('L');
  return `<h1 class="pt">Luyện nghe <span lang="ja">聴解</span></h1>
  ${wd.length ? `<section class="panel ptnudge"><span><b>${wd.length} câu nghe sai</b> đến hạn làm lại.</span><button class="btn pri" data-a="lpWeak">Làm lại câu sai</button></section>` : ''}
  <section class="panel">
    <div class="ph"><div class="seg">${[['c2', 'Chặng 2 (luyện đề)'], ['f', 'Nền tảng'], ['all', 'Tất cả']].map(([k, v]) => `<button class="${LPICK.tab === k ? 'on' : ''}" data-a="lpTab" data-v="${k}">${v}</button>`).join('')}</div>
    <div class="chips">${[0, 1, 2, 3, 4, 5].map(m => `<button class="chip${LPICK.md === m ? ' on' : ''}" data-a="lpMd" data-v="${m}">${m ? '問題' + m : 'Mọi dạng'}</button>`).join('')}</div></div>
    <div class="sets">${sets.map(s => setCard(s)).join('') || '<p class="muted">Không có bộ nào.</p>'}</div>
  </section>
  <section class="panel"><div class="ph"><h2>Luyện theo dạng (trộn các bộ)</h2></div>
    <div class="mdgrid">${[1, 2, 3, 4, 5].map(m => { const ids = C.sets.filter(s => s.kind === 'L' && s.md === m).flatMap(s => s.items.map(i => i.id)); const st = typeStats('L' + m); return `<div class="mdc"><b lang="ja">問題${m} ${MD[m].ja}</b><span class="muted">${MD[m].vi} · ${ids.length} câu</span>${st.done ? `<span class="num">${st.lastPct}% đúng (gần nhất)</span>` : '<span class="muted">chưa làm</span>'}<button class="btn sm" data-a="lpType" data-v="${m}">10 câu</button></div>`; }).join('')}</div>
    <label class="check"><input type="checkbox" data-a="setShowOpts" ${S.set.showOpts ? 'checked' : ''}><span>Hiện chữ lựa chọn cho dạng 3, 4, 5 (đề thật chỉ đọc, không in)</span></label>
  </section>`;
};
function setCard(s) {
  const n = s.items.length, done = s.items.filter(i => attempts(i.id).length).length, ok = s.items.filter(i => { const a = attempts(i.id); return a.length && a[a.length - 1][2]; }).length;
  const st = s.kind === 'L' ? `問題${s.md} ${MD[s.md].ja}` : [...new Set(s.passages.map(p => p.type))].join(' · ');
  return `<div class="dk"><div class="dk-h"><b>${esc(setTitle(s))}</b><span class="tag" lang="ja">${esc(st)}</span></div>
    <div class="dk-bar"><i class="m" style="width:${pct(ok, n)}%"></i><i class="s" style="width:${pct(done - ok, n)}%"></i></div>
    <div class="dk-f"><span class="num">${done ? `${ok}/${n} đúng` : `${n} câu`}</span><button class="btn sm ${done ? '' : 'pri'}" data-a="${s.kind === 'L' ? 'lpSet' : 'rpSet'}" data-v="${s.id}">${done ? 'Làm lại' : 'Bắt đầu'}</button></div></div>`;
}
function lpView() {
  const it = lpItem(), s = SET[it.set], md = s.md, n = it.ans.length, nopt = it.nopt || 4;
  const vis = listenOptsVisible(it);
  const qs = Array.from({ length: n }, (_, k) => {
    const o = itemOpts(it, k);
    return `<div class="lq">${n > 1 ? `<p class="lbl">質問${k + 1}</p>` : ''}
      <div class="${o && vis ? 'opts' : 'nopts'}">${Array.from({ length: nopt }, (_, j) => {
        const v = j + 1, picked = +LP.picks[k] === v, cls = LP.shown ? (v === it.ans[k] ? ' right' : picked ? ' wrongp' : ' dim') : picked ? ' sel' : '';
        return `<button class="opt${cls}" data-a="lpPick" data-k="${k}" data-v="${v}" ${LP.shown ? 'disabled' : ''}><span class="ok-n">${v}</span>${o && vis ? `<span lang="ja">${esc(o[j] || '')}</span>` : ''}</button>`;
      }).join('')}</div></div>`;
  }).join('');
  const showQ = LP.shown || LP.showOpts;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="lpQuit">Thoát</button><span class="muted">${esc(setTitle(s))} · <span lang="ja">問題${md} ${MD[md].ja}</span></span><span class="num muted">${LP.i + 1}/${LP.ids.length}</span></div>
  <div class="rv-prog"><i style="width:${LP.i / LP.ids.length * 100}%"></i></div>
  <section class="panel lpanel">
    <div class="ph"><h2>Câu ${it.n}</h2><button class="btn ghost sm" data-a="lpTip">Mẹo dạng này</button></div>
    ${LP.tip ? `<p class="tipbox">${esc(MD[md].tip)}</p>` : ''}
    ${playerHTML()}
    ${showQ && it.q ? `<p class="lqtext" lang="ja">${esc(it.q)}</p>` : ''}
    ${it.img ? `<img class="optimg" src="${it.img}" alt="Lựa chọn dạng hình">` : ''}
    ${!itemOpts(it, 0) ? (it.img ? '<p class="hint">Lựa chọn dạng hình: nhìn hình rồi chọn số.</p>' : '<p class="hint">Lựa chọn chỉ được đọc trong bài nghe (giáo trình không in chữ). Nghe rồi chọn số.</p>') : !vis ? '<p class="hint">Dạng này lựa chọn được đọc trong bài nghe. Nghe rồi chọn số; muốn dễ hơn thì bật hiện chữ.</p>' : ''}
    ${qs}
    ${LP.shown ? lpReveal(it) : `<div class="row"><button class="btn ghost sm" data-a="lpShowOpts">${LP.showOpts ? 'Ẩn chữ' : 'Hiện chữ'}</button><button class="btn ghost sm" data-a="lpSkip">Bỏ qua câu này</button></div>`}
  </section>`;
}
function lpReveal(it) {
  const ok = okPick(it, LP.picks);
  return `<div class="expl ${ok ? 'good' : 'bad'}"><b>${ok ? 'Đúng' : 'Sai'}</b> · đáp án ${it.ans.map(a => CIRC[a - 1]).join(' / ')}${ok ? '' : ' · bạn chọn ' + LP.picks.map(a => CIRC[a - 1]).join(' / ')}</div>
    ${whyChips(it.id)}
    <details class="scriptd" open><summary><b>Script</b> <span class="hint">câu tô màu là chỗ chứa đáp án</span></summary>${scriptHTML(it, it.id)}</details>
    ${phraseBox(it.id)}
    <div class="row"><button class="btn" data-a="auReplay">Nghe lại từ đầu</button><button class="btn pri" data-a="lpNext">${LP.i + 1 < LP.ids.length ? 'Câu tiếp (Enter)' : 'Xem kết quả'}</button></div>`;
}
AFTER.listen = () => { if (LP && !LP.done) { const it = lpItem(); if (AU.id !== it.id) audioLoad(it.id).then(() => { if (AU.el && LP && lpItem().id === it.id && !LP.shown) AU.el.play().catch(() => { }); }); else drawPlayer(); } };
function lpCheck() {
  const it = lpItem(); if (LP.picks.filter(Boolean).length < it.ans.length) { render(); return; }
  const ok = okPick(it, LP.picks); rec(it.id, LP.picks, ok, (Date.now() - LP.t0) / 1000, AU.id === it.id ? AU.plays : 0);
  LP.res.push([it.id, ok]); LP.shown = true; render();
}
Object.assign(ACT, {
  lpTab(t) { LPICK.tab = t.dataset.v; render(); },
  lpMd(t) { LPICK.md = +t.dataset.v; render(); },
  lpSet(t) { startListen(SET[t.dataset.v].items.map(i => i.id), setTitle(SET[t.dataset.v])); },
  lpType(t) { const m = +t.dataset.v; const ids = C.sets.filter(s => s.kind === 'L' && s.md === m).flatMap(s => s.items.map(i => i.id)); const fresh = shuffle(ids.filter(id => !attempts(id).length)), old = shuffle(ids.filter(id => attempts(id).length)); startListen([...fresh, ...old].slice(0, 10), '問題' + m); },
  lpWeak() { startListen(weakDue('L').slice(0, 15), 'Câu sai cần làm lại'); },
  lpPick(t) { if (LP.shown) return; LP.picks[+t.dataset.k] = +t.dataset.v; lpCheck(); },
  lpShowOpts() { LP.showOpts = !LP.showOpts; render(); },
  lpTip() { LP.tip = !LP.tip; render(); },
  lpSkip() { lpAdvance(); },
  lpNext() { lpAdvance(); },
  lpQuit() { audioStop(); LP = LP.res.length ? { ...LP, done: true } : null; render(); },
  lpAgain() { const wrong = LP.res.filter(r => !r[1]).map(r => r[0]); startListen(wrong, 'Làm lại câu sai'); },
  lpClose() { LP = null; render(); },
  auReplay() { if (AU.el) { AU.el.currentTime = 0; AU.el.play().catch(() => { }); } },
  setShowOpts(t) { S.set.showOpts = t.checked; save(); },
});
function lpAdvance() { audioStop(); if (LP.i + 1 >= LP.ids.length) { LP.done = true; render(); return; } LP.i++; LP.picks = []; LP.shown = false; LP.t0 = Date.now(); LP.tip = false; render(); scrollTo(0, 0); }
function lpSummary() {
  const ok = LP.res.filter(r => r[1]).length, n = LP.res.length;
  return `<section class="panel center"><div class="stamp ${pct(ok, n) >= 70 ? '' : 'grey'}">${pct(ok, n)}%</div><h2>${esc(LP.label || 'Luyện nghe')}: ${ok}/${n} câu đúng</h2>
  <p class="muted">Câu sai được đưa vào Điểm yếu và lên lịch làm lại (1 → 3 → 7 → 21 ngày). Đánh dấu "vì sao sai" giúp phân tích chính xác hơn.</p>
  <div class="row center">${ok < n ? '<button class="btn pri" data-a="lpAgain">Làm lại câu sai ngay</button>' : ''}<button class="btn" data-a="lpClose">Về danh sách</button><a class="btn ghost" href="#weak">Xem điểm yếu</a></div></section>`;
}
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
  if (route === 'listen' && LP && !LP.done) {
    const it = lpItem();
    if (!LP.shown && /^[1-4]$/.test(e.key) && +e.key <= (it.nopt || 4)) { const k = LP.picks.filter(Boolean).length; LP.picks[Math.min(k, it.ans.length - 1)] = +e.key; lpCheck(); }
    else if (LP.shown && e.key === 'Enter') { e.preventDefault(); lpAdvance(); }
  }
  if (route === 'read' && RP && !RP.done && RP.shown && e.key === 'Enter') { e.preventDefault(); rpAdvance(); }
});

/* ===== LUYỆN ĐỌC ===== */
let RP = null;   // { pids, i, picks:{}, t0, shown, done, res, label }
let RPICK = { type: '' };
function startRead(pids, label) {
  if (!pids.length) { toast('Không có bài nào'); return; }
  RP = { pids, i: 0, picks: {}, t0: Date.now(), shown: false, done: false, res: [], label };
  if (route !== 'read') go('read'); else render();
}
function passItems(pid) { return Object.values(ITEM).filter(i => i.pid === pid).sort((a, b) => a.id < b.id ? -1 : 1); }
VIEWS.read = () => {
  if (!C) return noContent();
  if (RP && !RP.done) return rpView();
  if (RP && RP.done) return rpSummary();
  const sets = C.sets.filter(s => s.kind === 'R'), wd = weakDue('R');
  const types = Object.keys(RT);
  return `<h1 class="pt">Luyện đọc <span lang="ja">読解</span></h1>
  ${wd.length ? `<section class="panel ptnudge"><span><b>${wd.length} câu đọc sai</b> đến hạn làm lại.</span><button class="btn pri" data-a="rpWeak">Làm lại câu sai</button></section>` : ''}
  <section class="panel"><div class="ph"><h2>Theo dạng</h2></div>
    <div class="mdgrid">${types.map(t => { const ps = Object.values(PASS).filter(p => p.type === t), st = typeStats('R' + t); return ps.length ? `<div class="mdc"><b lang="ja">${t}</b><span class="muted">${RT[t].vi} · ${ps.length} bài · ~${RT[t].min}′/bài</span>${st.done ? `<span class="num">${st.lastPct}% đúng · ${st.avgPass ? Math.round(st.avgPass / 60 * 10) / 10 + '′/bài' : ''}</span>` : '<span class="muted">chưa làm</span>'}<button class="btn sm" data-a="rpType" data-v="${t}">3 bài</button></div>` : ''; }).join('')}</div></section>
  <section class="panel"><div class="ph"><h2>Theo bài</h2></div><div class="sets">${sets.map(setCard).join('')}</div></section>`;
};
function rpView() {
  const p = PASS[RP.pids[RP.i]], items = passItems(p.pid), el = (Date.now() - RP.t0) / 1000, tgt = RT[p.type].min * 60;
  const qh = items.map((it, k) => {
    const o = itemOpts(it, 0) || [];
    return `<div class="rq"><p class="rqq" lang="ja"><b>${items.length > 1 ? '問' + (k + 1) + ' ' : ''}</b>${esc(it.q)}</p><div class="opts one">${o.map((x, j) => {
      const v = j + 1, picked = RP.picks[it.id] === v, cls = RP.shown ? (v === it.ans[0] ? ' right' : picked ? ' wrongp' : ' dim') : picked ? ' sel' : '';
      return `<button class="opt${cls}" data-a="rpPick" data-id="${it.id}" data-v="${v}" ${RP.shown ? 'disabled' : ''}><span class="ok-n">${v}</span><span lang="ja">${esc(x)}</span></button>`;
    }).join('')}</div>${RP.shown ? whyChips(it.id) : ''}</div>`;
  }).join('');
  const all = items.every(it => RP.picks[it.id]);
  return `<div class="rv-top"><button class="btn ghost sm" data-a="rpQuit">Thoát</button><span class="muted">${esc(SET[items[0].set] ? setTitle(SET[items[0].set]) : '')} · <span lang="ja">${p.type}</span></span><span class="num muted">${RP.i + 1}/${RP.pids.length}</span></div>
  <div class="rv-prog"><i style="width:${RP.i / RP.pids.length * 100}%"></i></div>
  <div class="rgrid">
    <section class="panel"><div class="ph"><h2 lang="ja">${p.type}</h2><span id="rtimer" class="num ${el > tgt ? 'late' : ''}" data-tgt="${tgt}">${mmss(el)} / ${RT[p.type].min}:00</span></div>
      ${passageHTML(p)}
      ${RP.shown ? phraseBox(p.pid) : ''}</section>
    <section class="panel rqs">${qh}
      ${RP.shown ? `<div class="expl ${RP.lastOk === items.length ? 'good' : 'bad'}"><b>${RP.lastOk}/${items.length} đúng</b> · ${mmss(RP.lastSec)} (mục tiêu ${RT[p.type].min}′)</div><p class="hint">${esc(RT[p.type].tip)}</p><button class="btn pri" data-a="rpNext">${RP.i + 1 < RP.pids.length ? 'Bài tiếp (Enter)' : 'Xem kết quả'}</button>`
      : `<button class="btn pri" data-a="rpSubmit" ${all ? '' : 'disabled'}>Nộp bài</button>`}
    </section></div>`;
}
AFTER.read = () => {
  clearInterval(AFTER.read.t);
  if (RP && !RP.done && !RP.shown) AFTER.read.t = setInterval(() => { const el = $('#rtimer'); if (!el || !RP || RP.shown) return clearInterval(AFTER.read.t); const s = (Date.now() - RP.t0) / 1000, tgt = +el.dataset.tgt; el.textContent = `${mmss(s)} / ${mmss(tgt)}`; el.classList.toggle('late', s > tgt); }, 1000);
};
Object.assign(ACT, {
  rpSet(t) { startRead(SET[t.dataset.v].passages.map(p => p.pid), setTitle(SET[t.dataset.v])); },
  rpType(t) { const ps = Object.values(PASS).filter(p => p.type === t.dataset.v).map(p => p.pid); const fresh = shuffle(ps.filter(pid => !passItems(pid).some(i => attempts(i.id).length))), old = shuffle(ps.filter(pid => passItems(pid).some(i => attempts(i.id).length))); startRead([...fresh, ...old].slice(0, 3), t.dataset.v); },
  rpWeak() { const pids = [...new Set(weakDue('R').map(id => ITEM[id].pid))]; startRead(pids.slice(0, 6), 'Câu sai cần làm lại'); },
  rpPick(t) { if (RP.shown) return; RP.picks[t.dataset.id] = +t.dataset.v; render(); },
  rpSubmit() {
    const p = PASS[RP.pids[RP.i]], items = passItems(p.pid), secs = (Date.now() - RP.t0) / 1000;
    let ok = 0; items.forEach(it => { const g = RP.picks[it.id] === it.ans[0]; if (g) ok++; rec(it.id, [RP.picks[it.id]], g, secs / items.length, 0); RP.res.push([it.id, g]); });
    RP.lastOk = ok; RP.lastSec = secs; RP.shown = true; render();
  },
  rpNext() { rpAdvance(); },
  rpQuit() { RP = RP.res.length ? { ...RP, done: true } : null; render(); },
  rpAgain() { const pids = [...new Set(RP.res.filter(r => !r[1]).map(r => ITEM[r[0]].pid))]; startRead(pids, 'Làm lại bài sai'); },
  rpClose() { RP = null; render(); },
});
function rpAdvance() { if (RP.i + 1 >= RP.pids.length) { RP.done = true; render(); return; } RP.i++; RP.shown = false; RP.t0 = Date.now(); render(); scrollTo(0, 0); }
function rpSummary() {
  const ok = RP.res.filter(r => r[1]).length, n = RP.res.length;
  return `<section class="panel center"><div class="stamp ${pct(ok, n) >= 70 ? '' : 'grey'}">${pct(ok, n)}%</div><h2>${esc(RP.label || 'Luyện đọc')}: ${ok}/${n} câu đúng</h2>
  <div class="row center">${ok < n ? '<button class="btn pri" data-a="rpAgain">Làm lại bài có câu sai</button>' : ''}<button class="btn" data-a="rpClose">Về danh sách</button><a class="btn ghost" href="#weak">Xem điểm yếu</a></div></section>`;
}
function passageHTML(p, open) {
  const txt = `<div class="passage" lang="ja" data-src="${esc(p.pid)}">${esc(p.text).split('\n').map(l => `<p class="sl">${l || '&nbsp;'}</p>`).join('')}</div>`;
  if (!p.imgs) return txt;
  return `<div class="pimgs">${p.imgs.map((u, i) => `<img src="${u}" alt="Trang ${i + 1} của bài đọc" loading="lazy">`).join('')}</div><details${open ? ' open' : ''}><summary class="hint">Bản chữ (để bôi đen lưu cụm)</summary>${txt}</details>`;
}
function noContent() {
  const pc = devMode() === 'pc';
  return `<section class="panel"><h2>Chưa có tài liệu bài tập</h2>
    <p>${CF.cfg ? (pc ? 'Vào Cài đặt → Tài liệu khóa học → chọn thư mục khóa học để tải nội dung và file nghe lên (làm một lần).' : 'Nhập tài liệu trên laptop một lần (Cài đặt → Tài liệu khóa học); điện thoại sẽ tự tải về khi đồng bộ.') : 'Bật đồng bộ ở mục Cài đặt trước, rồi nhập tài liệu trên laptop.'}</p>
    <div class="row"><a class="btn pri" href="#plan">Mở Cài đặt</a>${CF.cfg ? '<button class="btn" data-a="contentRefresh">Kiểm tra lại</button>' : ''}</div></section>`;
}
