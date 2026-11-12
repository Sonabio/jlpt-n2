/* ===== PHÂN TÍCH ĐIỂM YẾU ===== */
function typeItems(t) { return Object.values(ITEM).filter(i => i.type === t); }
function typeStats(t) {
  const its = typeItems(t), done = its.filter(i => attempts(i.id).length);
  const lastOk = done.filter(i => ist(i.id).last).length, firstOk = done.filter(i => ist(i.id).first).length;
  const secs = done.flatMap(i => attempts(i.id).map(a => a[3])).filter(x => x > 0);
  const avg = secs.length ? secs.reduce((a, b) => a + b, 0) / secs.length : 0;
  const why = {}; done.forEach(i => ist(i.id).why.forEach(w => { why[w] = (why[w] || 0) + 1; }));
  const topWhy = Object.entries(why).sort((a, b) => b[1] - a[1])[0];
  const nPass = t[0] === 'R' ? new Set(its.map(i => i.pid)).size : 0;
  return { t, total: its.length, done: done.length, lastPct: pct(lastOk, done.length), firstPct: pct(firstOk, done.length), avg, avgPass: nPass ? avg * its.length / nPass : 0, weak: done.filter(i => ist(i.id).weak).length, topWhy: topWhy ? topWhy[0] : null, why };
}
const ALL_TYPES = () => [...PARTS().filter(p => p.sec === 'K').map(p => 'K' + p.md), ...Object.keys(RTL()).map(t => 'R' + t), ...Object.keys(MDL()).map(m => 'L' + m)].filter(t => typeItems(t).length);
const lvlCls = p => p >= 75 ? 'good' : p >= 60 ? 'warn' : 'bad';
function typeAct(t) {
  if (t[0] === 'K') return typeItems(t).some(i => i.kind === 'R') ? { a: 'rpK', v: t.slice(1) } : { a: 'exTypePick', v: '0:' + t.slice(1) };
  if (t[0] === 'L') return typeItems(t).some(i => i.kind === 'L') ? { a: 'lpType', v: t[1] } : { a: 'exTypePick', v: '1:' + t[1] };
  if (!typeItems(t).some(i => i.kind === 'R')) { const p = PARTS().find(x => x.rt === t.slice(1)); if (p) return { a: 'exTypePick', v: '0:' + p.md }; }
  return { a: 'rpType', v: t.slice(1) };
}
function advice() {
  const st = ALL_TYPES().map(typeStats).filter(s => s.done >= 3).sort((a, b) => a.lastPct - b.lastPct);
  const out = [], wd = weakDue();
  if (wd.length) out.push({ h: `Làm lại ${wd.length} câu sai đến hạn`, p: 'Câu sai được lặp lại 1 → 3 → 7 → 21 ngày; đúng 3 lần liền thì ra khỏi danh sách yếu.', a: 'weakGo', l: 'Làm lại' });
  if (st[0] && st[0].lastPct < 75) { const w = st[0]; out.push({ h: `Dạng yếu nhất: ${typeVi(w.t)} (${w.lastPct}%)`, p: (w.t[0] === 'L' ? MDL()[w.t[1]].tip : w.t[0] === 'K' ? 'Luyện thêm 問題 này từ đề các năm; sai từ/ngữ pháp nào thì ôn lại bằng app/sách.' : RTL()[w.t.slice(1)].tip), ...typeAct(w.t), l: 'Luyện dạng này' }); }
  const why = {}; ALL_TYPES().forEach(t => Object.entries(typeStats(t).why).forEach(([k, n]) => { why[k] = (why[k] || 0) + n; }));
  const top = Object.entries(why).sort((a, b) => b[1] - a[1])[0];
  const TIP = { nghe: 'Nghe lại câu sai ở 0.85×, nhìn script, rồi nghe lại không script (shadowing 2–3 lần).', tu: 'Bôi đen từ chưa biết trong script/bài đọc và lưu thành thẻ; ôn trên điện thoại mỗi ngày.', bay: 'Khi nghe, chú ý câu sau でも/ただ/やっぱり/実は; ghi ○✕ cho từng lựa chọn đến cuối bài.', cau: 'Đọc/nghe kỹ câu hỏi: hỏi ai, hỏi lý do hay việc làm, "まず" hay "このあと".', gio: 'Đọc câu hỏi trước bài đọc; bấm giờ theo mục tiêu từng dạng, không quay lại câu khó quá 1 lần.', doan: 'Câu đoán bừa = chưa nắm; làm lại sau 1 ngày và đọc script.' };
  if (top && top[1] >= 2) out.push({ h: `Lý do sai hay gặp: ${WHY.find(w => w[0] === top[0])[1]} (${top[1]} lần)`, p: TIP[top[0]] });
  const st2 = ALL_TYPES().map(typeStats).filter(s => s.t[0] === 'R' && s.done >= 2 && s.avgPass > RTL()[s.t.slice(1)].min * 60 * 1.2);
  if (st2[0]) out.push({ h: `Đọc ${st2[0].t.slice(1)} chậm: ~${Math.round(st2[0].avgPass / 60 * 10) / 10}′/bài (mục tiêu ${RTL()[st2[0].t.slice(1)].min}′)`, p: RTL()[st2[0].t.slice(1)].tip });
  const untouched = ALL_TYPES().map(typeStats).filter(s => !s.done);
  if (out.length < 3 && untouched[0]) out.push({ h: `Chưa làm: ${typeVi(untouched[0].t)}`, p: 'Làm ít nhất 5 câu để có dữ liệu phân tích.', ...typeAct(untouched[0].t), l: 'Bắt đầu' });
  return out.slice(0, 4);
}
VIEWS.weak = () => {
  if (!C) return `<h1 class="pt">Điểm yếu <span lang="ja">弱点</span></h1>` + noContent();
  const types = ALL_TYPES().map(typeStats), doneN = Object.keys(S.att).filter(id => ITEM[id]).length;
  const okN = Object.keys(S.att).filter(id => ITEM[id] && ist(id).last).length;
  const weak = Object.keys(S.att).filter(id => ITEM[id] && ist(id).weak).sort((a, b) => ist(a).dueAt - ist(b).dueAt);
  const ph = devMode() === 'phone';
  return `<h1 class="pt">Điểm yếu <span lang="ja">弱点</span></h1>
  <section class="kpis four panel"><div><b class="num">${doneN}</b><span>câu đã làm</span></div><div><b class="num">${pct(okN, doneN)}%</b><span>đúng (lần gần nhất)</span></div><div><b class="num">${weak.length}</b><span>câu đang yếu</span></div><div><b class="num">${Object.keys(S.phr).length}</b><span>cụm đã lưu</span></div></section>
  <section class="panel"><div class="ph"><h2>Nên làm tiếp</h2></div>
    ${advice().map(a => `<div class="adv"><div><b>${esc(a.h)}</b><p class="muted">${esc(a.p || '')}</p></div>${a.a ? `<button class="btn sm" data-a="${a.a}" ${a.v ? `data-v="${esc(a.v)}"` : ''}>${a.l}</button>` : ''}</div>`).join('') || '<p class="muted">Làm vài bộ nghe/đọc để có dữ liệu phân tích.</p>'}
  </section>
  <section class="panel"><div class="ph"><h2>Theo dạng bài</h2><span class="hint">% đúng lần gần nhất · lần đầu</span></div>
    <div class="trows">${types.map(s => `<div class="trow"><span class="tn"><span lang="ja">${esc(typeName(s.t))}</span><small class="muted">${esc(typeVi(s.t))}</small></span>
      <span class="sbar big"><i class="${s.done ? lvlCls(s.lastPct) : ''}" style="width:${s.done ? s.lastPct : 0}%"></i></span>
      <span class="num tv">${s.done ? `<b>${s.lastPct}%</b> · ${s.firstPct}%` : '—'}</span>
      <span class="muted num td">${s.done}/${s.total} câu${s.avg ? ` · ${Math.round(s.t[0] === 'R' ? s.avgPass : s.avg)}s${s.t[0] === 'R' ? '/bài' : '/câu'}` : ''}${s.topWhy ? ` · hay: ${esc(WHY.find(w => w[0] === s.topWhy)[1].toLowerCase())}` : ''}</span></div>`).join('')}</div>
  </section>
  <section class="panel"><div class="ph"><h2>Câu đang yếu</h2>${weak.length ? `<button class="btn sm ${ph ? 'pri' : ''}" data-a="weakGo">Ôn trên ${ph ? 'điện thoại' : 'máy này'}</button>` : ''}</div>
    ${weak.length ? `<div class="tbl"><table><thead><tr><th>Câu</th><th>Dạng</th><th>Lịch sử</th><th>Làm lại</th><th></th></tr></thead><tbody>${weak.slice(0, 60).map(id => { const it = ITEM[id], s = ist(id); return `<tr><td>${esc(itemLabel(it))}</td><td lang="ja">${esc(typeName(it.type))}</td><td class="num">${attempts(id).map(a => a[2] ? '<span class="okc">○</span>' : '<span class="ngc">✕</span>').join('')}</td><td class="num">${s.due ? '<b class="due">hôm nay</b>' : new Date(s.dueAt).toLocaleDateString('vi-VN')}</td><td><button class="btn ghost sm" data-a="redo" data-v="${esc(id)}">Làm</button></td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted">Chưa có câu yếu. Câu làm sai sẽ hiện ở đây.</p>'}
  </section>`;
};
Object.assign(ACT, {
  weakGo() { startDrill(true); },
  redo(t) { const it = ITEM[t.dataset.v]; if (it.kind === 'X') { startExam(it.exam, 'part', 0, { lis: it.lis, md: it.md }); return; } if (devMode() === 'phone') { DR = { q: [{ k: 'i', id: it.id }], i: 0, res: [], picks: [], t0: Date.now() }; go('drill'); render(); return; } if (it.kind === 'L') startListen([it.id], 'Làm lại 1 câu'); else startRead([it.pid], 'Làm lại 1 bài'); },
});

/* ===== ÔN NHANH (điện thoại): cụm đã lưu (FSRS) + câu sai đến hạn ===== */
let DR = null;   // { q:[{k:'p'|'i', id}], i, shown, picks, t0, done, res }
function duePhrases() { const dn = dayNum(); return Object.keys(S.phr).filter(id => !S.phr[id].s || S.phr[id].s[0] <= dn); }
function drillCount() { return (C ? weakDue().length : 0) + duePhrases().length; }
function startDrill(onlyItems) {
  const items = C ? weakDue().slice(0, 15).map(id => ({ k: 'i', id })) : [];
  const ph = onlyItems ? [] : shuffle(duePhrases()).slice(0, 30).map(id => ({ k: 'p', id }));
  const q = [...ph, ...items]; if (!q.length) { toast('Không có gì đến hạn. Làm bài trên laptop để có thêm.'); return; }
  DR = { q, i: 0, res: [], picks: [], t0: Date.now() }; if (route !== 'drill') go('drill'); else render();
}
VIEWS.drill = () => {
  if (DR && !DR.done) return drView();
  if (DR && DR.done) { const ok = DR.res.filter(Boolean).length; return `<section class="panel center"><div class="stamp">${pct(ok, DR.res.length)}%</div><h2>Xong ${DR.res.length} thẻ/câu</h2><div class="row center"><button class="btn" data-a="drClose">Về Ôn nhanh</button><a class="btn ghost" href="#weak">Xem điểm yếu</a></div></section>`; }
  const dp = duePhrases().length, wi = C ? weakDue().length : 0, all = Object.keys(S.phr).length;
  return `<h1 class="pt">Ôn nhanh <span lang="ja">復習</span></h1>
  <section class="panel primary"><div class="kpis"><div><b class="num">${dp}</b><span>cụm từ đến hạn</span></div><div><b class="num">${wi}</b><span>câu sai làm lại</span></div><div><b class="num">${all}</b><span>cụm đã lưu</span></div></div>
    <button class="btn pri wide" data-a="drStart" ${dp + wi ? '' : 'disabled'}>Bắt đầu ôn (${dp + wi})</button>
    <p class="hint">Dành cho điện thoại: thẻ cụm từ bạn bôi đen từ script/bài đọc, và các câu làm sai (câu nghe có thể đọc script thay vì nghe).</p></section>
  ${all ? `<section class="panel"><div class="ph"><h2>Cụm đã lưu</h2><span class="muted num">${all}</span></div><div class="plist">${Object.entries(S.phr).sort((a, b) => b[1].at - a[1].at).slice(0, 80).map(([id, p]) => `<div class="pli"><span lang="ja"><b>${esc(p.t)}</b></span><span class="muted">${esc(p.n || '')}</span>${DR_DEL === id ? `<button class="btn sm danger" data-a="phrDelYes" data-v="${id}">Xóa?</button>` : `<button class="btn ghost sm" data-a="phrDel" data-v="${id}" aria-label="Xóa">✕</button>`}</div>`).join('')}</div></section>` : ''}`;
};
let DR_DEL = null;
function drView() {
  const c = DR.q[DR.i], left = DR.q.length - DR.i;
  const top = `<div class="rv-top"><button class="btn ghost sm" data-a="drQuit">Thoát</button><span class="muted">${c.k === 'p' ? 'Cụm từ' : 'Làm lại câu sai'}</span><span class="num muted">còn ${left}</span></div><div class="rv-prog"><i style="width:${DR.i / DR.q.length * 100}%"></i></div>`;
  if (c.k === 'p') {
    const p = S.phr[c.id]; if (!p) return top + '<section class="panel"><p class="muted">Thẻ này đã bị xóa.</p><button class="btn" data-a="drNext">Tiếp</button></section>';
    const ctx = esc(p.ctx || '').replace(esc(p.t), `<mark>${esc(p.t)}</mark>`);
    return top + `<section class="flash ${DR.shown ? 'flipped' : ''}" data-a="${DR.shown ? '' : 'drFlip'}">
      <div class="cf small" lang="ja">${esc(p.t)}</div>
      ${DR.shown ? `<div class="cb">${p.n ? `<div class="cb-m">${esc(p.n)}</div>` : '<div class="muted">(chưa có ghi chú nghĩa)</div>'}${ctx ? `<div class="cb-x" lang="ja">${ctx}</div>` : ''}<div class="row center"><button class="btn sm" data-a="drSpeak">Nghe (giọng máy)</button>${p.src && ITEM[p.src] ? `<span class="hint">từ ${esc(setTitle(SET[ITEM[p.src].set]))}</span>` : ''}</div></div>` : '<span class="tap">Nhớ nghĩa chưa? Chạm để xem</span>'}
    </section>${DR.shown ? `<div class="grades">${[[1, 'Quên'], [2, 'Khó'], [3, 'Nhớ'], [4, 'Dễ']].map(([g, l]) => `<button class="g g${g}" data-a="drGrade" data-v="${g}"><b>${l}</b></button>`).join('')}</div>` : ''}`;
  }
  const it = ITEM[c.id]; if (!it) return top + '<section class="panel"><p class="muted">Câu này không còn trong tài liệu.</p><button class="btn" data-a="drNext">Tiếp</button></section>';
  const n = it.ans.length;
  const body = it.kind === 'R' ? `<details class="panel" ${DR.shown ? '' : 'open'}><summary><b lang="ja">${esc(PASS[it.pid].type)}</b></summary>${passageHTML(PASS[it.pid])}</details><p class="lqtext" lang="ja">${esc(it.q)}</p>`
    : `<div class="row"><button class="btn" data-a="drAudio">${AU.id === it.id ? 'Đã tải bài nghe' : 'Nghe bài'}</button><button class="btn ghost" data-a="drScript">${DR.script ? 'Ẩn script' : 'Đọc script thay vì nghe'}</button></div>${AU.id === it.id ? playerHTML() : ''}
      ${DR.script && !DR.shown ? scriptHTML({ ...it, ans: [0] }, it.id) : ''}${it.q ? `<p class="lqtext" lang="ja">${esc(it.q)}</p>` : ''}`;
  const qs = Array.from({ length: n }, (_, k) => { const o = itemOpts(it, k); return `${n > 1 ? `<p class="lbl">質問${k + 1}</p>` : ''}<div class="opts one">${Array.from({ length: it.nopt || 4 }, (_, j) => { const v = j + 1, picked = +DR.picks[k] === v, cls = DR.shown ? (v === it.ans[k] ? ' right' : picked ? ' wrongp' : ' dim') : picked ? ' sel' : ''; return `<button class="opt${cls}" data-a="drPick" data-k="${k}" data-v="${v}" ${DR.shown ? 'disabled' : ''}><span class="ok-n">${v}</span>${o ? `<span lang="ja">${esc(o[j] || '')}</span>` : ''}</button>`; }).join('')}</div>`; }).join('');
  return top + `<section class="panel"><p class="muted">${esc(setTitle(SET[it.set]))} · <span lang="ja">${esc(typeName(it.type))}</span> · lịch sử ${attempts(it.id).map(a => a[2] ? '○' : '✕').join('')}</p>${body}${qs}
    ${DR.shown ? `<div class="expl ${okPick(it, DR.picks) ? 'good' : 'bad'}"><b>${okPick(it, DR.picks) ? 'Đúng' : 'Sai'}</b> · đáp án ${it.ans.map(a => CIRC[a - 1]).join(' / ')}</div>${it.ex ? `<p class="exnote">${esc(it.ex)}</p>` : ''}${whyChips(it.id)}${it.kind === 'L' ? `<details class="scriptd"><summary><b>Script</b></summary>${scriptHTML(it, it.id)}</details>` : ''}${phraseBox(it.kind === 'L' ? it.id : it.pid)}<button class="btn pri wide" data-a="drNext">Tiếp</button>` : ''}</section>`;
}
AFTER.drill = () => { if (DR && !DR.done && DR.q[DR.i] && DR.q[DR.i].k === 'i') drawPlayer(); };
function drNext() { DR.i++; DR.shown = false; DR.picks = []; DR.script = false; DR.t0 = Date.now(); audioStop(); if (DR.i >= DR.q.length) DR.done = true; render(); scrollTo(0, 0); }
Object.assign(ACT, {
  drStart() { startDrill(false); },
  drFlip() { DR.shown = true; render(); },
  drSpeak() { const p = S.phr[DR.q[DR.i].id]; speak(p.t); },
  drGrade(t) { const c = DR.q[DR.i], p = S.phr[c.id], g = +t.dataset.v; p.s = sched(p.s, g); DR.res.push(g > 1); save(); if (g === 1 && DR.q.filter(x => x.id === c.id).length < 3) DR.q.push(c); drNext(); },
  drPick(t) { if (DR.shown) return; DR.picks = DR.picks || []; DR.picks[+t.dataset.k] = +t.dataset.v; const it = ITEM[DR.q[DR.i].id]; if (DR.picks.filter(Boolean).length < it.ans.length) { render(); return; } const ok = okPick(it, DR.picks); rec(it.id, DR.picks, ok, (Date.now() - DR.t0) / 1000, AU.id === it.id ? AU.plays : 0); DR.res.push(ok); DR.shown = true; render(); },
  drNext() { drNext(); },
  drAudio() { const it = ITEM[DR.q[DR.i].id]; render(); audioLoad(it.id).then(() => { render(); if (AU.tts) ttsPlay(); else if (AU.el) AU.el.play().catch(() => { }); }); },
  drScript() { DR.script = !DR.script; render(); },
  drQuit() { audioStop(); DR = DR.res.length ? { ...DR, done: true } : null; render(); },
  drClose() { DR = null; render(); },
  phrDel(t) { DR_DEL = t.dataset.v; render(); },
  phrDelYes(t) { const id = t.dataset.v; delete S.phr[id]; S.pdel = [...new Set([...(S.pdel || []), id])]; DR_DEL = null; save(); render(); },
});

/* ===== HÔM NAY ===== */
function nextSet(kind) {
  const order = C.sets.filter(s => s.kind === kind && !isKSet(s)).sort((a, b) => (a.src === b.src ? a.unit - b.unit : a.src === 'f-' ? -1 : 1));
  return order.find(s => s.items.some(i => !attempts(i.id).length));
}
function dayMin(k) { const l = S.log[k] || {}; return Math.round(((l.l || 0) + (l.r || 0) + (l.d || 0)) / 60); }
VIEWS.today = () => {
  const ex = targetExam(), days = dayNum(ex.d) - dayNum(), k = dayKey(), l = S.log[k] || {}, m = dayMin(k), pc = devMode() === 'pc';
  const dc = drillCount();
  let plan = '';
  if (!C) plan = noContent();
  else {
    const ls = nextSet('L'), rs = nextSet('R'), wl = weakDue().length;
    plan = `<section class="panel primary"><div class="ph"><h2>${pc ? 'Buổi luyện hôm nay (laptop)' : 'Hôm nay trên điện thoại'}</h2><span class="num muted">${m}/120 phút</span></div>
      <div class="sbar big"><i style="width:${Math.min(100, m / 120 * 100)}%"></i></div>
      ${pc ? `<div class="todo">
        ${ls ? `<div class="adv"><div><b>Nghe: ${esc(setTitle(ls))}</b><p class="muted" lang="ja">問題${ls.md} ${MDL()[ls.md].ja} · ${ls.items.length} câu</p></div><button class="btn pri sm" data-a="lpSet" data-v="${ls.id}">Bắt đầu</button></div>` : '<p class="muted">Đã làm hết các bộ nghe. Làm lại câu sai hoặc luyện theo dạng.</p>'}
        ${rs ? `<div class="adv"><div><b>Đọc: ${esc(setTitle(rs))}</b><p class="muted" lang="ja">${[...new Set(rs.passages.map(p => p.type))].join(' · ')}</p></div><button class="btn pri sm" data-a="rpSet" data-v="${rs.id}">Bắt đầu</button></div>` : ''}
        ${wl ? `<div class="adv"><div><b>Làm lại ${wl} câu sai đến hạn</b></div><button class="btn sm" data-a="weakGo">Làm lại</button></div>` : ''}
      </div>` : `<button class="btn pri wide" data-a="drStart" ${dc ? '' : 'disabled'}>Ôn nhanh (${dc})</button><p class="hint">Điện thoại chỉ ôn phần yếu đã được phân tích từ bài làm trên laptop: cụm từ đã lưu và câu sai đến hạn.</p>`}
    </section>`;
  }
  const bars = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return [d, dayMin(dayKey(d))]; });
  const mx = Math.max(120, ...bars.map(b => b[1]));
  return `${backupNudge()}<div class="hero"><div class="hero-l"><span class="eyebrow">Luyện đề nghe · đọc · đang luyện ${curLv()}</span><h1>${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}</h1></div>
    <div class="count"><span class="count-n">${days}</span><span class="count-l">ngày</span><span></span><span class="count-d">đến JLPT N2 ${fmtDate(ex.d)}</span></div></div>
  <section class="panel lvbar"><span><b>Cấp đang luyện</b> <span class="hint">đổi cấp thì bài luyện, đề thi và điểm yếu đổi theo</span></span>${lvSwitchHTML()}</section>
  ${plan}
  <section class="grid2">
    <div class="panel"><div class="ph"><h2>Hôm nay</h2></div><div class="kpis"><div><b class="num">${Math.round((l.l || 0) / 60)}′</b><span>nghe</span></div><div><b class="num">${Math.round((l.r || 0) / 60)}′</b><span>đọc</span></div><div><b class="num">${l.n ? pct(l.c || 0, l.n) + '%' : '—'}</b><span>${l.n || 0} câu đúng</span></div></div></div>
    <div class="panel"><div class="ph"><h2>14 ngày</h2><span class="hint">phút</span></div><div class="bars">${bars.map(([d, v], i) => `<div class="bar ${i === 13 ? 'now' : ''} ${v >= 120 ? 'full' : ''}" title="${dayKey(d)}: ${v} phút"><i style="height:${v / mx * 100}%"></i><span>${d.getDate()}</span></div>`).join('')}</div></div>
  </section>`;
};

/* ===== CÀI ĐẶT ===== */
function weekStats(back) {
  const d0 = new Date(); d0.setDate(d0.getDate() - ((d0.getDay() + 6) % 7) - back * 7);
  const o = { w: isoWeek(d0), l: 0, r: 0, d: 0, n: 0, c: 0, days: 0 };
  for (let i = 0; i < 7; i++) { const d = new Date(d0); d.setDate(d0.getDate() + i); const l = S.log[dayKey(d)] || {}; ['l', 'r', 'd', 'n', 'c'].forEach(f => o[f] += l[f] || 0); if ((l.l || 0) + (l.r || 0) + (l.d || 0) > 0) o.days++; }
  o.min = Math.round((o.l + o.r + o.d) / 60); return o;
}
function weeklySummary() {
  return {
    generated: new Date().toISOString(), app: 'jlpt-n2', mode: 'luyen-de-nghe-doc', level: curLv(), examTarget: S.set.target,
    weeks: [0, 1, 2, 3].map(weekStats).map(w => ({ week: w.w, minutes: w.min, listenMin: Math.round(w.l / 60), readMin: Math.round(w.r / 60), drillMin: Math.round(w.d / 60), answered: w.n, correct: w.c, activeDays: w.days })),
    types: C ? ALL_TYPES().map(typeStats).map(s => ({ type: typeName(s.t), vi: typeVi(s.t), done: s.done, total: s.total, lastPct: s.lastPct, firstPct: s.firstPct, avgSec: Math.round(s.avg), topWhy: s.topWhy })) : [],
    weak: C ? Object.keys(S.att).filter(id => ITEM[id] && ist(id).weak).length : 0, weakDue: C ? weakDue().length : 0,
    phrases: Object.keys(S.phr).length, phrasesDue: duePhrases().length, exams: (S.exams || []).slice(-8),
  };
}
let PL = { reset: false };
VIEWS.plan = () => {
  const ws = [0, 1, 2, 3].map(weekStats);
  return `<h1 class="pt">Cài đặt <span lang="ja">設定</span></h1>
  <section class="panel"><div class="ph"><h2>Kỳ thi mục tiêu</h2></div>
    <div class="pfields"><label class="fld">Ngày thi N2<select data-a="setTarget">${examDates().map(x => `<option value="${x.k}" ${x.k === targetExam().k ? 'selected' : ''}>${fmtDate(x.d)}</option>`).join('')}</select></label>
    <label class="fld">Cấp đang luyện<select data-a="setLv">${LVS.map(l => `<option value="${l}" ${l === curLv() ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="fld">Thiết bị này<select data-a="setDev">${[['auto', 'Tự nhận'], ['pc', 'Máy tính: luyện chính'], ['phone', 'Điện thoại: ôn phần yếu']].map(([k, v]) => `<option value="${k}" ${S.set.dev === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div></section>
  <section class="panel"><div class="ph"><h2>Đồng bộ</h2><span class="syncline"><span class="dot syncdot"></span><span class="synctext"></span></span></div>${syncUI()}</section>
  <section class="panel"><div class="ph"><h2>Tài liệu khóa học</h2></div>${importUI()}</section>
  <section class="panel"><div class="ph"><h2>Sao lưu</h2></div>${backupUI()}</section>
  <section class="panel"><div class="ph"><h2>4 tuần gần đây</h2><span class="hint">mục tiêu 840 phút/tuần</span></div>
    <div class="tbl"><table><thead><tr><th>Tuần</th><th>Phút</th><th>Nghe</th><th>Đọc</th><th>Ôn</th><th>Câu</th><th>Đúng</th><th>Ngày học</th></tr></thead><tbody>${ws.map(w => `<tr><td>${w.w}</td><td class="num"><b>${w.min}</b></td><td class="num">${Math.round(w.l / 60)}</td><td class="num">${Math.round(w.r / 60)}</td><td class="num">${Math.round(w.d / 60)}</td><td class="num">${w.n}</td><td class="num">${w.n ? pct(w.c, w.n) + '%' : '—'}</td><td class="num">${w.days}/7</td></tr>`).join('')}</tbody></table></div>
    <p class="hint">Lịch báo cáo tự động mỗi tối Chủ nhật đọc số liệu này từ máy chủ.</p></section>
  <section class="panel"><div class="ph"><h2>Dữ liệu trên máy này</h2></div>
    <div class="row">${PL.reset ? '<button class="btn danger" data-a="resetYes">Xóa hết lịch sử làm bài trên mọi máy</button><button class="btn ghost" data-a="resetNo">Hủy</button>' : '<button class="btn ghost" data-a="reset">Xóa lịch sử làm bài…</button>'}</div></section>
  <p class="foot muted">Nội dung bài tập thuộc tài liệu khóa học của bạn, chỉ lưu trên máy này và máy chủ riêng. Mã QR: qrcode-generator (MIT).</p>`;
};
AFTER.plan = () => { if (CF.pair) loadQR().then(drawQR); if (!IMP.est && !IMP.busy) storageInfo().then(e => { IMP.est = e; if (route === 'plan' && e.used) render(); }); if (CF.cfg && (allSets().length || allExams().length) && !IMP.have && !IMP.busy && devMode() === 'pc') audioHave().then(h => { if (h && route === 'plan') render(); }); };
Object.assign(ACT, {
  setTarget(t) { S.set.target = t.value; save(); },
  setDev(t) { S.set.dev = t.value; save(); render(); },
  reset() { PL.reset = true; render(); },
  resetNo() { PL.reset = false; render(); },
  resetYes() { const keep = { set: S.set, exams: S.exams }; S = { ...DEF(), ...keep, resetAt: Date.now() }; PL.reset = false; save(); render(); toast('Đã xóa lịch sử làm bài'); },
});
