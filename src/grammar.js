/* ===== NGỮ PHÁP: tra cứu + bài tập (dữ liệu tự soạn ở grammar-data.js) =====
   Mỗi mẫu có 2 câu luyện, id cố định:  gc:N5:12 = chọn mẫu đúng (文法形式の判断),  go:N5:12 = sắp xếp câu ★ (文の組み立て).
   Lần làm ghi vào S.att như câu nghe/đọc → câu sai vào Điểm yếu, lặp 1→3→7→21 ngày.
   Đánh dấu ★ = tạo thẻ trong S.phr (có gk) → ôn bằng FSRS ở Ôn nhanh. */

/* ----- đọc dữ liệu ----- */
function grList(lv) {
  const c = grList.c || (grList.c = {});
  if (!c[lv]) c[lv] = (GRAM[lv] || []).map(r => ({ key: lv + ':' + r[0], lv, id: +r[0], g: r[1], p: r[2], c: r[3], m: r[4], x: r[5], v: r[6], d: r[7].split(';'), n: r[8] || '' }));
  return c[lv];
}
function grByKey(key) { const lv = key.split(':')[0]; return grList(lv).find(g => g.key === key); }
function grPlain(x) { return x.replace(/[{}\[\]\/]/g, ''); }
function grAnsText(x) { return x.match(/\[([^\]]*)\]/)[1]; }
/* Ví dụ: chỗ trống được tô màu */
function grExHTML(x) { return esc(x.replace(/[{}\/]/g, '')).replace(/\[([^\]]*)\]/, '<b class="blank">$1</b>'); }
/* Trộn cố định theo khóa (mỗi câu luôn ra cùng thứ tự đáp án, để làm lại/đồng bộ khớp nhau) */
function grSeed(s) { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
function grShuffle(a, key) { const r = grSeed(key); a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* Câu "chọn mẫu đúng": câu có （　　）, 4 lựa chọn */
function grChoose(g) {
  const ans = grAnsText(g.x), opts = grShuffle([ans, ...g.d], 'c' + g.key);
  return { q: g.x.replace(/[{}\/]/g, '').replace(/\[[^\]]*\]/, '（　　）'), opts, ans: opts.indexOf(ans) + 1 };
}
/* Câu "sắp xếp ★": phần trước + 4 ô (★ ở 1 ô) + phần sau; 4 mảnh xáo trộn */
function grOrder(g) {
  const m = g.x.match(/^([^{]*)\{([^}]*)\}(.*)$/), clean = s => s.replace(/[\[\]]/g, '');
  const chunks = m[2].split('/').map(clean);
  let opts = grShuffle(chunks, 'o' + g.key);
  if (opts.every((c, i) => c === chunks[i])) opts = [opts[1], opts[0], opts[3], opts[2]];
  const star = grSeed('s' + g.key)() * 4 | 0;
  return { pre: clean(m[1]), post: clean(m[3]), chunks, opts, star, ans: opts.indexOf(chunks[star]) + 1 };
}

/* Cấp luyện ngữ pháp: cấp đang chọn ở Tra cứu (vd N1 — cấp chưa có ở thanh cấp chung), không thì cấp đang học */
function grPLv() { return GL && GL.lv && GRAM[GL.lv] ? GL.lv : curLv(); }   // GL chưa có khi content.js gọi grIndex lúc khởi động
/* Đưa câu luyện của cấp đang học (+ cấp luyện ngữ pháp) vào ITEM (để Điểm yếu, Ôn nhanh dùng chung) — gọi từ indexContent */
function grIndex() {
  for (const k in ITEM) if (ITEM[k].kind === 'G') delete ITEM[k];
  [...new Set([curLv(), grPLv()])].flatMap(grList).forEach(g => {
    ITEM['gc:' + g.key] = { id: 'gc:' + g.key, kind: 'G', type: 'GC', gk: g.key, ans: [grChoose(g).ans], nopt: 4 };
    ITEM['go:' + g.key] = { id: 'go:' + g.key, kind: 'G', type: 'GO', gk: g.key, ans: [grOrder(g).ans], nopt: 4 };
  });
}
function grLabel(it) { const g = grByKey(it.gk); return `Ngữ pháp ${g ? g.lv + ' · ' + g.p : it.gk} · ${it.type === 'GC' ? 'chọn mẫu' : 'sắp xếp'}`; }
function grStarred(key) { return Object.keys(S.phr).find(id => S.phr[id].gk === key); }

/* ----- một câu hỏi (dùng chung cho trang Ngữ pháp và Ôn nhanh) -----
   q = { id, pick (câu chọn), seq: [số lựa chọn theo thứ tự ô] (câu sắp xếp), shown } */
function grQHTML(q) {
  const it = ITEM[q.id], g = grByKey(it.gk); if (!g) return '<p class="muted">Không tìm thấy mẫu này.</p>';
  let body;
  if (it.type === 'GC') {
    const c = grChoose(g);
    body = `<p class="glbl">Chọn từ thích hợp điền vào （　　）</p><p class="qs" lang="ja">${esc(c.q)}</p>
      <div class="opts">${c.opts.map((o, j) => { const v = j + 1, cls = q.shown ? (v === c.ans ? ' right' : q.pick === v ? ' wrongp' : ' dim') : ''; return `<button class="opt${cls}" data-a="gqPick" data-v="${v}" ${q.shown ? 'disabled' : ''}><span class="ok-n">${v}</span><span lang="ja">${esc(o)}</span></button>`; }).join('')}</div>`;
  } else {
    const o = grOrder(g), seq = q.seq || [];
    const slot = i => { const v = seq[i]; const cls = i === o.star ? ' star' : ''; return `<span class="gslot${cls}${v ? ' fill' : ''}">${v ? esc(o.opts[v - 1]) : i === o.star ? '★' : ''}</span>`; };
    body = `<p class="glbl">Sắp xếp 4 mảnh cho đúng câu. Mảnh nào nằm ở ô ★?</p>
      <p class="qs gord" lang="ja">${esc(o.pre)}${[0, 1, 2, 3].map(slot).join('')}${esc(o.post)}</p>
      <div class="opts">${o.opts.map((t, j) => { const v = j + 1, used = seq.includes(v), cls = q.shown ? (v === o.ans ? ' right' : seq[o.star] === v ? ' wrongp' : ' dim') : used ? ' dim' : ''; return `<button class="opt${cls}" data-a="gqTap" data-v="${v}" ${q.shown || used ? 'disabled' : ''}><span class="ok-n">${v}</span><span lang="ja">${esc(t)}</span></button>`; }).join('')}</div>
      ${q.shown ? '' : `<div class="row"><button class="btn ghost sm" data-a="gqUndo" ${seq.length ? '' : 'disabled'}>Xóa mảnh cuối</button><button class="btn pri" data-a="gqCheck" ${seq.length === 4 ? '' : 'disabled'}>Kiểm tra</button></div>`}`;
  }
  if (!q.shown) return body;
  const ok = grQOk(q, it);
  return body + `<div class="expl ${ok ? 'good' : 'bad'}"><b>${ok ? 'Đúng' : 'Sai'}</b> · đáp án ${CIRC[it.ans[0] - 1]}${it.type === 'GO' && ok && !grFullOk(q, g) ? ' (★ đúng, nhưng thứ tự các ô khác chưa đúng)' : ''}</div>
    <div class="gcard"><p class="gp" lang="ja"><b>${esc(g.p)}</b> <span class="muted">${esc(g.c)}</span></p><p>${esc(g.m)}</p>
    <p lang="ja">${grExHTML(g.x)} <button class="btn ghost sm" data-a="grSpeak" data-v="${esc(g.key)}" aria-label="Nghe câu ví dụ">🔊</button></p><p class="muted">${esc(g.v)}</p>${g.n ? `<p class="exnote">${esc(g.n)}</p>` : ''}
    <div class="row">${grStarBtn(g.key)}</div></div>${whyChips(it.id)}`;
}
function grQOk(q, it) { return it.type === 'GC' ? q.pick === it.ans[0] : (q.seq || [])[grOrder(grByKey(it.gk)).star] === it.ans[0]; }
function grFullOk(q, g) { const o = grOrder(g); return (q.seq || []).every((v, i) => o.opts[v - 1] === o.chunks[i]); }
function grStarBtn(key) { const on = grStarred(key); return `<button class="btn sm ${on ? 'pri' : ''}" data-a="grStar" data-v="${esc(key)}">${on ? '★ Đang ôn (bấm để bỏ)' : '☆ Đánh dấu cần ôn'}</button>`; }
/* Câu hỏi hiện tại: ở trang Ôn nhanh thì nằm trong DR, ở trang Ngữ pháp thì trong GP */
function gqCur() { return route === 'drill' && DR && DR.gq ? DR.gq : GP && GP.q; }
function gqDone(q) {
  const it = ITEM[q.id], ok = grQOk(q, it);
  rec(q.id, it.type === 'GC' ? [q.pick] : q.seq, ok, (Date.now() - q.t0) / 1000, 0);
  q.shown = true;
  if (route === 'drill' && DR && DR.gq === q) DR.res.push(ok); else if (GP) GP.res.push([q.id, ok]);
  render();
}

/* ----- phiên luyện trên trang Ngữ pháp ----- */
let GP = null;   // { ids, i, q, res, label, done }
var GL = { lv: null, q: '', gr: 'all', open: null };   // var: grIndex có thể chạy trước dòng này lúc khởi động
/* Thống kê 1 dạng (GC/GO) chỉ trong 1 cấp */
function grStats(t, lv) {
  const its = typeItems(t).filter(i => i.gk.startsWith(lv + ':')), done = its.filter(i => attempts(i.id).length);
  return { total: its.length, done: done.length, lastPct: pct(done.filter(i => ist(i.id).last).length, done.length) };
}
function grStart(ids, label) {
  if (!ids.length) { toast('Không có câu nào'); return; }
  GP = { ids, i: 0, res: [], label, done: false, q: { id: ids[0], t0: Date.now() } };
  if (route !== 'grammar') go('grammar'); else { render(); scrollTo(0, 0); }
}
/* Chọn n câu: ưu tiên câu chưa làm, rồi câu làm lâu nhất */
function grPick(kind, n, keys) {
  const lv = grPLv(), gs = keys ? keys.map(grByKey).filter(Boolean) : grList(lv);
  const ids = gs.flatMap(g => kind === 'mix' ? ['gc:' + g.key, 'go:' + g.key] : [(kind === 'GC' ? 'gc:' : 'go:') + g.key]);
  const fresh = shuffle(ids.filter(id => !attempts(id).length)), old = ids.filter(id => attempts(id).length).sort((a, b) => attempts(a).slice(-1)[0][0] - attempts(b).slice(-1)[0][0]);
  return [...fresh, ...old].slice(0, n);
}
function grWeakDue() { return weakDue().filter(id => ITEM[id].kind === 'G'); }

VIEWS.grammar = () => {
  if (GP && !GP.done) return gpView();
  if (GP && GP.done) return gpSummary();
  const lv = grPLv(), list = grList(lv), wd = grWeakDue();
  const sc = grStats('GC', lv), so = grStats('GO', lv);
  const starKeys = list.filter(g => grStarred(g.key)).map(g => g.key);
  const kparts = C ? PARTS().filter(p => p.sec === 'K' && typeVi('K' + p.md).startsWith('Ngữ pháp')).map(p => ({ p, n: typeItems('K' + p.md).filter(i => i.kind === 'R').length })).filter(x => x.n) : [];
  // cấp tra cứu: mặc định theo cấp đang học (nếu cấp đó chưa có dữ liệu thì xem tất cả)
  const practice = list.length ? `<section class="panel"><div class="ph"><h2>Luyện tập ${lv}</h2><span class="muted num">${list.length} mẫu</span></div>
      ${lv !== curLv() ? `<p class="hint">Đang luyện ngữ pháp ${lv} (chọn ở phần Tra cứu bên dưới). Bấm lại nút ${lv} để về ${curLv()}.</p>` : ''}
      ${wd.length ? `<div class="adv"><div><b>${wd.length} câu ngữ pháp sai</b> đến hạn làm lại</div><button class="btn pri sm" data-a="grRun" data-v="weak">Làm lại câu sai</button></div>` : ''}
      <div class="mdgrid">
        <div class="mdc"><b lang="ja">文法形式の判断</b><span class="muted">Chọn mẫu đúng điền vào chỗ trống</span>${sc.done ? `<span class="num">${sc.lastPct}% đúng · ${sc.done}/${sc.total} câu</span>` : `<span class="muted">${sc.total} câu · chưa làm</span>`}<button class="btn sm" data-a="grRun" data-v="GC">10 câu</button></div>
        <div class="mdc"><b lang="ja">文の組み立て ★</b><span class="muted">Sắp xếp câu, tìm mảnh ở ô ★</span>${so.done ? `<span class="num">${so.lastPct}% đúng · ${so.done}/${so.total} câu</span>` : `<span class="muted">${so.total} câu · chưa làm</span>`}<button class="btn sm" data-a="grRun" data-v="GO">10 câu</button></div>
        <div class="mdc"><b>Trộn 2 dạng</b><span class="muted">Giống phần ngữ pháp trong đề</span><span class="muted">&nbsp;</span><button class="btn sm" data-a="grRun" data-v="mix">15 câu</button></div>
        ${starKeys.length ? `<div class="mdc"><b>Mẫu đã đánh dấu ★</b><span class="muted">${starKeys.length} mẫu</span><span class="muted">&nbsp;</span><button class="btn sm" data-a="grRun" data-v="star">Luyện</button></div>` : ''}
      </div>
      <p class="hint">Câu sai vào Điểm yếu và được lặp lại 1 → 3 → 7 → 21 ngày. Mẫu đánh dấu ★ hiện trong Ôn nhanh (thẻ lật, trên điện thoại).</p></section>`
    : `<section class="panel"><h2>Ngữ pháp ${lv}: đang soạn</h2><p class="muted">Hiện đã có N5, N4, N3, N2 và N1. Vẫn tra cứu được các cấp khác ở dưới.</p></section>`;
  const kpanel = kparts.length ? `<section class="panel"><div class="ph"><h2>Bài ngữ pháp trong tài liệu</h2></div><p class="hint">Bài lấy từ tài liệu đã nhập (Dũng Mori, đề luyện…), làm ở màn hình Luyện đọc.</p>
      <div class="mdgrid">${kparts.map(({ p, n }) => { const st = typeStats('K' + p.md); return `<div class="mdc"><b lang="ja">${esc(typeName('K' + p.md))}</b><span class="muted">${esc(p.vi)} · ${n} câu</span>${st.done ? `<span class="num">${st.lastPct}% đúng</span>` : '<span class="muted">chưa làm</span>'}<button class="btn sm" data-a="rpK" data-v="${p.md}">3 bài</button></div>`; }).join('')}</div></section>` : '';
  return `<h1 class="pt">Ngữ pháp <span lang="ja">文法</span></h1>${lvSwitchHTML()}
  ${practice}${kpanel}
  <section class="panel"><div class="ph"><h2>Tra cứu</h2></div>
    <div class="row"><input type="search" id="grq" placeholder="Gõ tiếng Nhật hoặc tiếng Việt: ために, phải, nếu…" value="${esc(GL.q)}" aria-label="Tìm mẫu ngữ pháp" style="flex:1;min-width:200px"></div>
    <div class="seg lvsw" role="group" aria-label="Cấp tra cứu">${[...Object.keys(GRAM), 'all'].map(l => `<button class="${grLvNow() === l ? 'on' : ''}" data-a="grLv" data-v="${l}">${l === 'all' ? 'Tất cả' : l}</button>`).join('')}</div>
    <div class="chips" style="margin-top:8px"><button class="chip${GL.gr === 'all' ? ' on' : ''}" data-a="grGr" data-v="all">Tất cả nhóm</button>${Object.entries(GRAM_GROUPS).map(([k, v]) => `<button class="chip${GL.gr === k ? ' on' : ''}" data-a="grGr" data-v="${k}">${esc(v)}</button>`).join('')}</div>
    <div id="grlist" class="glist">${grListHTML()}</div></section>`;
};
/* Danh sách tra cứu (vẽ lại riêng khi gõ tìm, để ô tìm kiếm không mất con trỏ) */
function grNorm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ''); }   // bỏ dấu cách: gõ "をよそに" vẫn ra "を よそに"
function grListHTML() {
  const glv = grLvNow(), lvs = glv === 'all' ? Object.keys(GRAM) : [glv], q = grNorm(GL.q.trim());
  const rows = lvs.flatMap(grList).filter(g => (GL.gr === 'all' || g.g === GL.gr) && (!q || grNorm([g.p, g.c, g.m, grPlain(g.x), g.v, g.n].join(' ')).includes(q)));
  if (!rows.length) return '<p class="muted">Không tìm thấy mẫu nào.</p>';
  return `<p class="hint">${rows.length} mẫu</p>` + rows.slice(0, 300).map(g => {
    const h = [...attempts('gc:' + g.key), ...attempts('go:' + g.key)].sort((a, b) => a[0] - b[0]).slice(-6);
    return `<details class="grow" ${GL.open === g.key ? 'open' : ''} data-k="${esc(g.key)}"><summary><span class="glv">${g.lv}</span><b lang="ja">${esc(g.p)}</b><span class="gm">${esc(g.m)}</span>${grStarred(g.key) ? '<span class="gstar" title="Đang ôn">★</span>' : ''}${h.length ? `<span class="num ghist">${h.map(a => a[2] ? '<span class="okc">○</span>' : '<span class="ngc">✕</span>').join('')}</span>` : ''}</summary>
      <div class="gcard"><p><span class="muted">Cách nối:</span> <span lang="ja">${esc(g.c)}</span></p><p class="muted">Nhóm: ${esc(GRAM_GROUPS[g.g] || '')}</p>
      <p lang="ja" class="gex">${grExHTML(g.x)} <button class="btn ghost sm" data-a="grSpeak" data-v="${esc(g.key)}" aria-label="Nghe câu ví dụ">🔊</button></p><p class="muted">${esc(g.v)}</p>
      ${g.n ? `<p class="exnote">${esc(g.n)}</p>` : ''}
      <div class="row">${grStarBtn(g.key)}<button class="btn sm" data-a="grOne" data-v="${esc(g.key)}">Luyện mẫu này (2 câu)</button></div></div></details>`;
  }).join('');
}
AFTER.grammar = () => {
  const i = $('#grq'); if (!i) return;
  i.oninput = () => { GL.q = i.value; GL.open = null; $('#grlist').innerHTML = grListHTML(); };
  $('#grlist').addEventListener('toggle', e => { const d = e.target; if (d.open) GL.open = d.dataset.k; else if (GL.open === d.dataset.k) GL.open = null; }, true);
};
function gpView() {
  const q = GP.q;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="gpQuit">Thoát</button><span class="muted">${esc(GP.label)}</span><span class="num muted">${GP.i + 1}/${GP.ids.length}</span></div>
  <div class="rv-prog"><i style="width:${GP.i / GP.ids.length * 100}%"></i></div>
  <section class="panel">${grQHTML(q)}${q.shown ? `<button class="btn pri wide" data-a="gpNext">${GP.i + 1 < GP.ids.length ? 'Câu tiếp (Enter)' : 'Xem kết quả'}</button>` : ''}</section>`;
}
function gpSummary() {
  const ok = GP.res.filter(r => r[1]).length, n = GP.res.length, wrong = GP.res.filter(r => !r[1]).map(r => ITEM[r[0]] && grByKey(ITEM[r[0]].gk)).filter(Boolean);
  return `<section class="panel center"><div class="stamp ${pct(ok, n) >= 70 ? '' : 'grey'}">${pct(ok, n)}%</div><h2>${esc(GP.label)}: ${ok}/${n} câu đúng</h2>
    ${wrong.length ? `<div class="glist" style="text-align:left">${[...new Set(wrong)].map(g => `<div class="adv"><div><b lang="ja">${esc(g.p)}</b> <span class="muted">${esc(g.m)}</span></div>${grStarBtn(g.key)}</div>`).join('')}</div>` : ''}
    <div class="row center">${ok < n ? '<button class="btn pri" data-a="gpAgain">Làm lại câu sai</button>' : ''}<button class="btn" data-a="gpClose">Về Ngữ pháp</button><a class="btn ghost" href="#weak">Xem điểm yếu</a></div></section>`;
}
function gpNext() { if (GP.i + 1 >= GP.ids.length) { GP.done = true; render(); return; } GP.i++; GP.q = { id: GP.ids[GP.i], t0: Date.now() }; render(); scrollTo(0, 0); }
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || route !== 'grammar' || !GP || GP.done || !GP.q.shown) return;
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return; e.preventDefault(); gpNext();
});
Object.assign(ACT, {
  grRun(t) {
    const v = t.dataset.v;
    if (v === 'weak') return grStart(grWeakDue().slice(0, 15), 'Câu ngữ pháp sai');
    if (v === 'star') return grStart(shuffle(grPick('mix', 99, grList(grPLv()).filter(g => grStarred(g.key)).map(g => g.key))).slice(0, 15), 'Mẫu đã đánh dấu ★');
    grStart(grPick(v, v === 'mix' ? 15 : 10), v === 'GC' ? '文法形式の判断' : v === 'GO' ? '文の組み立て ★' : 'Ngữ pháp trộn');
  },
  grOne(t) {
    const k = t.dataset.v, g = grByKey(k); GL.open = k;
    if (!ITEM['gc:' + k]) { GL.lv = g.lv === curLv() ? null : g.lv; grIndex(); }   // mẫu ở cấp khác → chuyển cấp luyện sang cấp đó
    grStart(['gc:' + k, 'go:' + k], 'Luyện: ' + g.p);
  },
  grLv(t) { GL.lv = t.dataset.v === curLv() || t.dataset.v === GL.lv ? null : t.dataset.v; GL.open = null; grIndex(); render(); },
  grGr(t) { GL.gr = t.dataset.v; GL.open = null; render(); },
  grSpeak(t) { const g = grByKey(t.dataset.v); if (g) speak(grPlain(g.x)); },
  grStar(t) {
    const k = t.dataset.v, g = grByKey(k), on = grStarred(k);
    if (on) { delete S.phr[on]; S.pdel = [...new Set([...(S.pdel || []), on])]; toast('Đã bỏ khỏi Ôn nhanh'); }
    else { const id = 'g' + Date.now().toString(36); S.phr[id] = { t: g.p, n: `${g.m} · ${g.c}`, src: '', ctx: grPlain(g.x), at: Date.now(), s: null, gk: k }; toast('Đã thêm vào Ôn nhanh: ' + g.p); }
    save(); GL.open = k; render();
  },
  gqPick(t) { const q = gqCur(); if (!q || q.shown) return; q.pick = +t.dataset.v; gqDone(q); },
  gqTap(t) { const q = gqCur(); if (!q || q.shown) return; q.seq = [...(q.seq || []), +t.dataset.v].slice(0, 4); render(); },
  gqUndo() { const q = gqCur(); if (!q || q.shown) return; q.seq = (q.seq || []).slice(0, -1); render(); },
  gqCheck() { const q = gqCur(); if (!q || q.shown || (q.seq || []).length < 4) return; gqDone(q); },
  gpNext() { gpNext(); },
  gpQuit() { GP = GP.res.length ? { ...GP, done: true } : null; render(); },
  gpAgain() { grStart([...new Set(GP.res.filter(r => !r[1]).map(r => r[0]))], 'Làm lại câu sai'); },
  gpClose() { GP = null; render(); },
});
function grLvNow() { return GL.lv || (GRAM[curLv()] ? curLv() : 'all'); }
