/* ===== THIẾT BỊ & THỜI GIAN HỌC ===== */
function devMode() {
  const d = (S.set && S.set.dev) || 'auto'; if (d !== 'auto') return d;
  try { return matchMedia('(max-width: 860px)').matches || matchMedia('(hover: none) and (pointer: coarse)').matches ? 'phone' : 'laptop'; } catch (e) { return 'laptop'; }
}
const STUDY_ROUTES = ['learn', 'review', 'typing', 'practice', 'exam'];
let _lastAct = 0, _dirtyTime = false;
function trackActivity() {
  if (!STUDY_ROUTES.includes(route) || document.visibilityState === 'hidden') { _lastAct = 0; return; }
  const now = Date.now();
  if (_lastAct) { const d = Math.min(90, (now - _lastAct) / 1000); if (d >= 1) { logAdd(devMode() === 'phone' ? 'sp' : 'sl', Math.round(d)); _dirtyTime = true; } }
  _lastAct = now;
}
['click', 'keydown', 'touchstart', 'input'].forEach(ev => document.addEventListener(ev, trackActivity, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { _lastAct = 0; if (_dirtyTime) { _dirtyTime = false; save(); } });
setInterval(() => { if (_dirtyTime) { _dirtyTime = false; save(); } }, 180000);
const dayMin = k => { const l = S.log[k]; return l ? Math.round(((l.sp || 0) + (l.sl || 0)) / 60) : 0; };

/* ===== THỐNG KÊ TUẦN (cũng ghi vào gist để báo cáo tự động) ===== */
function weekDays(off = 0) { const d = new Date(); const wd = (d.getDay() + 6) % 7; const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - wd - 7 * off); return [...Array(7)].map((_, i) => new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i)); }
function weekStats(off = 0) {
  const days = weekDays(off);
  const t = { from: dayKey(days[0]), to: dayKey(days[6]), min: 0, minPhone: 0, minLaptop: 0, activeDays: 0, newWords: 0, newKanji: 0, newGrammar: 0, reviews: 0, quizQ: 0, quizOk: 0, typed: 0, typedOk: 0, perDay: [] };
  days.forEach(d => {
    const l = S.log[dayKey(d)] || {}; const p = (l.sp || 0) / 60, q = (l.sl || 0) / 60;
    t.minPhone += p; t.minLaptop += q; t.min += p + q; t.perDay.push(Math.round(p + q));
    if (p + q >= 10 || (l.r || 0) + (l.q || 0) > 0) t.activeDays++;
    t.newWords += l.nw || 0; t.newKanji += l.nk || 0; t.newGrammar += l.ng || 0; t.reviews += l.r || 0; t.quizQ += l.q || 0; t.quizOk += l.c || 0; t.typed += l.tn || 0; t.typedOk += l.tc || 0;
  });
  ['min', 'minPhone', 'minLaptop'].forEach(k => t[k] = Math.round(t[k]));
  return t;
}
function weeklySummary() {
  return {
    generated: new Date().toISOString(), app: 'jlpt-n2',
    plan: { weekMinutes: WEEK_MIN, dayMinutes: DAY_MIN, daily: S.set.daily, examTarget: S.set.target, stage: STAGES[currentStage()].n, decks: S.set.decks },
    weeks: [0, 1, 2, 3, 4, 5, 6, 7].map(weekStats),
    decks: DECKS.map(d => ({ id: d.id, name: d.name, ...deckStats(d) })).filter(d => d.seen > 0),
    due: dueCount(), learned: Object.keys(S.srs).length,
    placement: (S.place || []).slice(-3).map(p => ({ d: p.d, top: p.top, lv: p.lv.map(b => [b.lv, Math.round(b.p * 100)]), sk: p.sk })),
    exams: (S.exams || []).slice(-6), typing: (S.typing || []).slice(-20), practice: S.qs,
  };
}

/* ===== SO SÁNH ĐÁP ÁN GÕ ===== */
const toHira = s => String(s || '').replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 96));
const normJa = s => toHira(String(s || '').normalize('NFKC')).replace(/[\s。、，,.!！?？・〜～「」『』（）()\[\]\-ー‐]/g, '').trim();
const normKeep = s => String(s || '').normalize('NFKC').replace(/\s/g, '');
function isRight(input, answers) { const n = normJa(input); return !!n && answers.some(a => a && normJa(a) === n); }
function lev(a, b) { a = [...a]; b = [...b]; const d = Array(b.length + 1).fill(0).map((_, i) => i); for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } } return d[b.length]; }

/* Đổi romaji → kana (khi thiết bị chưa có bàn phím Nhật) */
const RK = (() => {
  const m = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お', '-': 'ー', nn: 'ん', "n'": 'ん', xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ', xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ', xtu: 'っ', ltu: 'っ', xtsu: 'っ', ltsu: 'っ', wo: 'を', shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', zi: 'じ', di: 'ぢ', du: 'づ', ',': '、', '.': '。', '?': '？', '!': '！', '~': '〜' };
  const rows = { k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ', m: 'まみむめも', r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ', f: 'ふぁふぃふふぇふぉ', v: 'ゔぁゔぃゔゔぇゔぉ' };
  Object.entries(rows).forEach(([c, k]) => { if (c === 'f' || c === 'v') return; 'aiueo'.split('').forEach((v, i) => m[c + v] = k[i]); });
  m.fa = 'ふぁ'; m.fi = 'ふぃ'; m.fe = 'ふぇ'; m.fo = 'ふぉ';
  m.ya = 'や'; m.yu = 'ゆ'; m.yo = 'よ'; m.ye = 'いぇ'; m.wa = 'わ'; m.wi = 'うぃ'; m.we = 'うぇ';
  const yo = { ky: 'き', gy: 'ぎ', sh: 'し', sy: 'し', j: 'じ', jy: 'じ', zy: 'じ', ch: 'ち', ty: 'ち', cy: 'ち', dy: 'ぢ', ny: 'に', hy: 'ひ', by: 'び', py: 'ぴ', my: 'み', ry: 'り' };
  Object.entries(yo).forEach(([c, k]) => { m[c + 'a'] = k + 'ゃ'; m[c + 'u'] = k + 'ゅ'; m[c + 'o'] = k + 'ょ'; });
  m.she = 'しぇ'; m.che = 'ちぇ'; m.je = 'じぇ'; m.ti = 'てぃ'; m.tu = 'つ'; m.si = 'し'; m.hu = 'ふ'; m.ca = 'か'; m.cu = 'く'; m.co = 'こ';
  return m;
})();
function romajiToKana(str, final = false) {
  let out = '', s = str.toLowerCase(), i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === 'n' && s[i + 1] === 'n') { out += 'ん'; i += s[i + 2] && 'aiueoy'.includes(s[i + 2]) ? 1 : 2; continue; }
    if (c === 'n' && s[i + 1] && !'aiueoy\''.includes(s[i + 1])) { out += 'ん'; i++; continue; }
    if (/[bcdfghjkmpqrstvwxyz]/.test(c) && s[i + 1] === c && c !== 'n') { out += 'っ'; i++; continue; }
    let hit = false;
    for (let L = 4; L >= 1; L--) { const seg = s.substr(i, L); if (RK[seg]) { out += RK[seg]; i += L; hit = true; break; } }
    if (!hit) { if (/[a-z']/.test(c)) { if (final && c === 'n') out += 'ん'; else out += str[i]; } else out += str[i]; i++; }
  }
  return out;
}

/* ===== LUỒNG HỌC: Học mới → Nghe → Chọn → Gõ ===== */
let FL = null;
const FL_PHASES = [['learn', 'Học mới'], ['listen', 'Nghe'], ['choose', 'Chọn'], ['type', 'Gõ']];
function pickNew(kinds, n) { const out = []; if (n <= 0) return out; for (const id of S.set.decks) { const d = DECK[id]; if (!d || !kinds.includes(d.kind)) continue; for (const c of d.cards) { if (out.length >= n) return out; if (!S.srs[c.k] && !out.includes(c)) out.push(c); } } return out; }
function learnedToday() { const l = S.log[dayKey()] || {}; return { w: l.nw || 0, k: l.nk || 0, g: l.ng || 0 }; }
function todayTargets() { const D = S.set.daily || { w: 12, k: 3, g: 2 }, L = learnedToday(); return { w: Math.max(0, D.w - L.w), k: Math.max(0, D.k - L.k), g: Math.max(0, D.g - L.g), D, L }; }
const kindOf = c => (DECK[c.d] ? DECK[c.d].kind : 'vocab');
const bracket = x => { const m = String(x || '').match(/\[(.+?)\]/); return m ? m[1] : ''; };
function poolFor(c, field) { const d = DECK[c.d]; let pool = d.cards.map(x => x[field]).filter(Boolean); if (pool.length < 8) pool = DECKS.filter(x => x.kind === d.kind).flatMap(x => x.cards.map(y => y[field])).filter(Boolean); return pool; }
function buildSpec(c) {
  const kind = kindOf(c), sp = { kind };
  if (kind === 'grammar') {
    const ans = bracket(c.xb), cloze = String(c.xb || '').replace(/\[.+?\]/, '（　　）');
    const sameLv = DECK[c.d].cards.filter(x => x !== c);
    sp.listen = { audio: c.x, q: 'Câu vừa nghe dùng mẫu nào?', ...mkOpts(c.f, sameLv.map(x => x.f)), jp: true, reveal: c.xb };
    sp.choose = { q: `<p class="qs" lang="ja">${esc(cloze)}</p><p class="qsub">Chọn phần điền vào chỗ trống</p>`, ...mkOpts(ans, sameLv.map(x => bracket(x.xb)).filter(x => x && x !== ans && !(['へ', 'に'].includes(ans) && ['へ', 'に'].includes(x)))), jp: true };
    sp.type = ans ? { q: `<p class="qs" lang="ja">${esc(cloze)}</p><p class="qsub">Gõ phần còn thiếu · gợi ý nghĩa: ${esc(c.m)}</p>`, answers: [ans], show: ans } : null;
  } else if (kind === 'kanji') {
    const others = DECK[c.d].cards.filter(x => x !== c);
    if (c.ew && c.er) sp.listen = { audio: c.er, q: 'Từ vừa nghe viết thế nào?', ...mkOpts(c.ew, others.map(x => x.ew).filter(Boolean)), jp: true, reveal: c.ew + ' ' + c.er };
    else sp.listen = { audio: (c.on || c.kun || c.f).split('・')[0], q: 'Âm vừa nghe là của chữ nào?', ...mkOpts(c.f, others.map(x => x.f)), jp: true, reveal: c.f };
    sp.choose = { q: `<p class="qs big">${esc(c.m)}</p><p class="qsub">Hán-Việt: <b>${esc(c.hv || '—')}</b> · chọn chữ Hán</p>`, ...mkOpts(c.f, others.map(x => x.f)), jp: true, big: true };
    if (c.ew && c.er) sp.type = { q: `<p class="qs huge" lang="ja">${esc(c.ew)}</p><p class="qsub">Gõ cách đọc (kana)</p>`, answers: [c.er], show: c.er };
    else sp.type = { q: `<p class="qs huge" lang="ja">${esc(c.f)}</p><p class="qsub">Gõ một cách đọc On hoặc Kun (kana)</p>`, answers: [...String(c.on || '').split('・'), ...String(c.kun || '').split('・')].filter(Boolean), show: [c.on, c.kun].filter(Boolean).join(' / ') };
  } else {
    sp.listen = { audio: c.say || c.r || c.f, q: 'Từ vừa nghe nghĩa là gì?', ...mkOpts(c.m, poolFor(c, 'm')), reveal: c.f + (c.r ? ' ' + c.r : '') };
    sp.choose = { q: `<p class="qs big">${esc(c.m)}</p>${c.hv ? `<p class="qsub">Hán-Việt: <b>${esc(c.hv)}</b></p>` : ''}<p class="qsub">Chọn từ tiếng Nhật</p>`, ...mkOpts(c.f, poolFor(c, 'f')), jp: true };
    sp.type = kind === 'pair' ? null : { q: `<p class="qs big">${esc(c.m)}</p>${c.hv ? `<p class="qsub">Hán-Việt: <b>${esc(c.hv)}</b></p>` : ''}<p class="qsub">Gõ từ tiếng Nhật (kanji hoặc kana)</p>`, answers: [c.f, c.r].filter(Boolean), show: c.f + (c.r ? ' (' + c.r + ')' : '') };
  }
  return sp;
}
function startFlow(mode, extra = 0) {
  const T = todayTargets(); let items;
  if (mode === 'vk') items = [...pickNew(['vocab', 'pair'], T.w + extra), ...pickNew(['kanji'], T.k + (extra ? 2 : 0))];
  else items = pickNew(['grammar'], T.g + extra);
  if (!items.length) { toast(extra ? 'Các bộ thẻ đang chọn đã học hết. Thêm bộ ở Kế hoạch.' : 'Đã đủ mục tiêu hôm nay. Bấm "Học thêm" nếu muốn.'); return; }
  FL = { mode, items, ph: 0, i: 0, order: items.slice(), err: {}, known: {}, pick: null, typed: null, spoken: '', spec: {} };
  items.forEach(c => FL.spec[c.k] = buildSpec(c));
  if (route !== 'learn') go('learn'); else render();
  window.scrollTo(0, 0);
}
function flowList() { const ph = FL_PHASES[FL.ph][0]; if (ph === 'learn') return FL.items; return FL.order.filter(c => !FL.known[c.k] && FL.spec[c.k][ph]); }
function flowNextPhase() {
  FL.ph++; FL.i = 0; FL.pick = null; FL.typed = null;
  while (FL.ph < FL_PHASES.length && !flowList().length) FL.ph++;
  if (FL.ph < FL_PHASES.length) FL.order = shuffle(FL.items);
  if (FL.ph >= FL_PHASES.length) flowFinish();
}
function flowAdvance() { FL.i++; FL.pick = null; FL.typed = null; if (FL.i >= flowList().length) flowNextPhase(); render(); window.scrollTo(0, 0); }
function flowFinish() {
  const res = { 3: 0, 2: 0, 1: 0, 4: 0 };
  FL.items.forEach(c => {
    const e = FL.err[c.k] || 0, g = FL.known[c.k] ? 4 : e === 0 ? 3 : e <= 1 ? 2 : 1;
    const wasNew = !S.srs[c.k]; S.srs[c.k] = sched(S.srs[c.k], g).st; res[g]++;
    if (wasNew) { const kd = kindOf(c); logAdd(kd === 'kanji' ? 'nk' : kd === 'grammar' ? 'ng' : 'nw'); }
  });
  FL.done = res; save();
}
function vLearn() {
  if (!FL) return learnHome();
  if (FL.done) {
    const r = FL.done, n = FL.items.length, T = todayTargets();
    return `<h1 class="pt">Xong phiên học <span lang="ja">お疲れさま</span></h1>
    <div class="panel center"><div class="stamp" lang="ja">${r[1] ? '復' : '良'}</div>
      <h2>${n} mục mới đã vào lịch ôn</h2>
      <div class="ptlv"><div class="pass"><b>Dễ</b><span class="num">${r[4]}</span><small>đã biết</small></div><div class="pass"><b>Được</b><span class="num">${r[3]}</span><small>không sai</small></div><div><b>Khó</b><span class="num">${r[2]}</span><small>sai 1 lần</small></div><div class="fail"><b>Lại</b><span class="num">${r[1]}</span><small>ôn lại hôm nay</small></div></div>
      <p class="muted">Hôm nay đã học ${T.L.w} từ, ${T.L.k} kanji, ${T.L.g} mẫu ngữ pháp (mục tiêu ${T.D.w} / ${T.D.k} / ${T.D.g}).</p>
      <div class="row center">${dueCount() ? `<button class="btn pri" data-a="startReview">Ôn ${dueCount()} thẻ đến hạn</button>` : ''}<button class="btn" data-a="flMore" data-v="${FL.mode}">Học thêm 5</button><button class="btn ghost" data-a="flClose">Về trang Học</button></div></div>`;
  }
  const list = flowList(), c = list[FL.i], ph = FL_PHASES[FL.ph][0], sp = FL.spec[c.k];
  const steps = `<div class="ptsteps">${FL_PHASES.map(([id, n], i) => `<span class="${i < FL.ph ? 'pass' : i === FL.ph ? 'cur' : ''}">${n}</span>`).join('')}</div>`;
  const top = `<div class="rv-top"><button class="btn ghost sm" data-a="flClose">Thoát</button><span class="muted">${esc(DECK[c.d].name)}</span><span class="num muted">${FL.i + 1}/${list.length}</span></div>${steps}<div class="rv-prog"><i style="width:${Math.round(FL.i / list.length * 100)}%"></i></div>`;
  if (ph === 'learn') {
    const kd = kindOf(c);
    return `${top}<div class="flash flipped learncard">
      <div class="cf${DECK[c.d].small ? ' small' : ''}" lang="ja">${esc(c.f)}</div>
      <div class="cb">${kd === 'grammar' ? `<div class="cb-m">${esc(c.m)}</div>${c.n ? `<div class="cb-n">${esc(c.n)}</div>` : ''}<div class="cb-x" lang="ja">${brHi(c.xb || c.x)}</div>` : cardBackFull(c)}</div>
    </div>
    <div class="row center"><button class="btn" data-a="flSay">Nghe lại</button><button class="btn" data-a="flSlow">Nghe chậm</button><button class="btn ghost" data-a="flKnown">Mình biết rồi</button><button class="btn pri" data-a="flNext" id="flnext">Tiếp</button></div>
    <p class="hint center">Enter: tiếp · "Mình biết rồi": bỏ qua các bước sau, xếp lịch ôn xa hơn.</p>`;
  }
  if (ph === 'listen' || ph === 'choose') {
    const q = sp[ph], done = FL.pick != null;
    return `${top}<div class="qcard">
      ${ph === 'listen' ? `<div class="row center"><button class="btn pri" data-a="flSay">▶ Nghe</button><button class="btn" data-a="flSlow">Nghe chậm</button></div><p class="qsub">${esc(q.q)}</p>${done ? `<p class="qs" lang="ja">${brHi(q.reveal)}</p>` : ''}` : q.q}
    </div>
    <div class="opts">${q.opts.map((o, i) => `<button class="opt${q.big ? ' big' : ''}${done ? (i === q.ans ? ' right' : i === FL.pick ? ' wrongp' : ' dim') : ''}" data-a="flAns" data-i="${i}" ${done ? 'disabled' : ''} ${q.jp ? 'lang="ja"' : ''}><span class="ok-n">${i + 1}</span>${esc(o)}</button>`).join('')}</div>
    ${done ? `<div class="row"><button class="btn pri" data-a="flNext" id="flnext">Tiếp</button>${ph === 'choose' ? '<button class="btn ghost" data-a="flSay">Nghe</button>' : ''}</div>` : '<p class="hint">Phím 1–4 để chọn.</p>'}`;
  }
  const q = sp.type, t = FL.typed;
  return `${top}<div class="qcard">${q.q}</div>
  <div class="typebox">
    <input id="fl-in" class="jpin" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" ${t ? 'disabled' : ''} value="${t ? esc(t.v) : ''}" placeholder="${S.set.romaji ? 'gõ romaji, tự đổi sang kana' : 'bật bàn phím tiếng Nhật rồi gõ'}">
    ${t ? `<div class="expl ${t.ok ? 'good' : 'bad'}"><b>${t.ok ? 'Đúng.' : 'Chưa đúng.'}</b> Đáp án: <span lang="ja">${esc(q.show)}</span>${t.hint ? ' · đã dùng gợi ý' : ''}</div>
      <div class="row"><button class="btn pri" data-a="flNext" id="flnext">Tiếp</button><button class="btn ghost" data-a="flSay">Nghe</button></div>`
    : `<div class="row"><button class="btn pri" data-a="flCheck">Kiểm tra</button><button class="btn" data-a="flHint">Gợi ý</button><button class="btn ghost" data-a="flSkip">Không biết</button></div>
      <p class="hint">Enter để kiểm tra (khi đã chốt chữ trong bộ gõ). ${imeShort()}</p>`}
  </div>`;
}
function cardBackFull(c) {
  const rows = [];
  if (c.r) rows.push(`<div class="cb-r" lang="ja">${esc(c.r)}</div>`);
  if (c.hv) rows.push(`<div class="cb-hv"><span class="lbl">Hán-Việt</span> ${esc(c.hv)}</div>`);
  rows.push(`<div class="cb-m">${esc(c.m)}</div>`);
  if (c.en) rows.push(`<div class="cb-n">${esc(c.en)}</div>`);
  if (c.n) rows.push(`<div class="cb-n">${esc(c.n)}</div>`);
  if (c.x) rows.push(`<div class="cb-x" lang="ja">${esc(c.x)}</div>`);
  return rows.join('');
}
function flowAudio(slow) { const c = flowList()[FL.i]; if (!c) return; const ph = FL_PHASES[FL.ph][0]; const sp = FL.spec[c.k]; const t = ph === 'listen' ? sp.listen.audio : ph === 'learn' ? (kindOf(c) === 'grammar' ? c.x : (c.say || c.r || c.f)) : (kindOf(c) === 'grammar' ? c.x : (c.say || c.r || c.f)); speak(t, slow ? 0.65 : 0.9); }
function flowAfterRender() {
  if (!FL || FL.done) return;
  const c = flowList()[FL.i]; if (!c) return; const ph = FL_PHASES[FL.ph][0]; const key = ph + c.k;
  if ((ph === 'learn' || ph === 'listen') && FL.spoken !== key && FL.pick == null) { FL.spoken = key; setTimeout(() => flowAudio(false), 150); }
  const inp = $('#fl-in'); if (inp && !inp.disabled) setTimeout(() => inp.focus(), 30);
  const nx = $('#flnext'); if (nx && ph !== 'type') nx.focus({ preventScroll: true });
}
function learnHome() {
  const T = todayTargets(), ph = devMode() === 'phone', due = dueCount();
  const vk = `<div class="panel lcard${ph ? ' primary' : ''}"><div class="ph"><div class="mh"><span class="mj" lang="ja">単語</span><h2>Từ vựng & kanji</h2></div><span class="tag">${ph ? 'dành cho điện thoại' : 'thường học trên điện thoại'}</span></div>
    <div class="kpis"><div><b class="num">${T.L.w}/${T.D.w}</b><span>từ mới hôm nay</span></div><div><b class="num">${T.L.k}/${T.D.k}</b><span>kanji mới</span></div><div><b class="num">${due}</b><span>thẻ đến hạn</span></div></div>
    <p class="muted">Học mới → nghe → chọn đáp án → gõ đáp án. Kết quả tự chấm vào lịch ôn FSRS.</p>
    <div class="row">${T.w + T.k ? `<button class="btn pri" data-a="flStart" data-v="vk">Học ${T.w} từ + ${T.k} kanji</button>` : '<span class="done-msg">Đủ mục tiêu hôm nay</span>'}<button class="btn" data-a="flMore" data-v="vk">Học thêm 5</button>${due ? `<button class="btn" data-a="startReview">Ôn ${due} thẻ</button>` : ''}</div></div>`;
  const gr = `<div class="panel lcard${!ph ? ' primary' : ''}"><div class="ph"><div class="mh"><span class="mj" lang="ja">文法</span><h2>Ngữ pháp</h2></div><span class="tag">${!ph ? 'dành cho laptop' : 'thường học trên laptop'}</span></div>
    <div class="kpis"><div><b class="num">${T.L.g}/${T.D.g}</b><span>mẫu mới hôm nay</span></div><div><b class="num">${S.set.decks.filter(id => DECK[id] && DECK[id].kind === 'grammar').map(id => deckStats(DECK[id]).seen).reduce((a, b) => a + b, 0)}</b><span>mẫu đã học</span></div><div><b class="num">${(S.typing || []).filter(x => x.d === dayKey()).length}</b><span>lượt gõ hôm nay</span></div></div>
    <p class="muted">Đọc mẫu + câu ví dụ → nghe câu → chọn mẫu đúng → gõ phần còn thiếu.</p>
    <div class="row">${T.g ? `<button class="btn pri" data-a="flStart" data-v="gr">Học ${T.g} mẫu</button>` : '<span class="done-msg">Đủ mục tiêu hôm nay</span>'}<button class="btn" data-a="flMore" data-v="gr">Học thêm 2</button><a class="btn" href="#typing">Luyện gõ</a></div></div>`;
  return `<h1 class="pt">Học <span lang="ja">学習</span></h1>${ph ? vk + gr : gr + vk}
  <p class="hint">Thẻ mới lấy từ các bộ đang chọn ở Kế hoạch → Cài đặt (theo giai đoạn ${esc(STAGES[currentStage()].n)}). Đổi số mục mới mỗi ngày cũng ở đó.</p>`;
}

/* ===== LUYỆN GÕ ===== */
let TY = null;
let TYP = { mode: 'word', lv: 'N5', os: null };
function guessOS() { const u = navigator.userAgent; return /iPhone|iPad/.test(u) ? 'ios' : /Android/.test(u) ? 'android' : /Mac/.test(u) ? 'mac' : 'win'; }
function imeShort() { const os = guessOS(); return os === 'mac' ? 'Mac: Ctrl+Space hoặc phím かな để bật, Space đổi kanji, Enter chốt.' : os === 'win' ? 'Windows: Alt+` hoặc 半角/全角 để bật, Space đổi kanji, Enter chốt, F7 ra katakana.' : 'Điện thoại: chuyển sang bàn phím 日本語 (ローマ字 hoặc かな).'; }
const IME_GUIDE = {
  win: ['Windows', ['Cài: Settings → Time & Language → Language → Add 日本語 (Microsoft IME).', 'Bật/tắt: Alt+` hoặc phím 半角/全角; Win+Space đổi ngôn ngữ.', 'Gõ romaji → ra hiragana; Space đổi sang kanji, Space tiếp để xem các lựa chọn, Enter chốt.', 'F6 hiragana · F7 katakana · F8 katakana nửa độ rộng · F10 romaji.', 'Shift+←/→ đổi độ dài cụm khi đổi kanji sai chỗ.']],
  mac: ['macOS', ['Cài: System Settings → Keyboard → Input Sources → + → Japanese – Romaji.', 'Bật/tắt: Ctrl+Space, hoặc phím かな / 英数 (bàn phím JIS).', 'Space đổi kanji, Enter chốt; Ctrl+K katakana, Ctrl+J hiragana.', 'Shift+←/→ đổi độ dài cụm.']],
  ios: ['iPhone', ['Cài: Cài đặt → Cài đặt chung → Bàn phím → Thêm bàn phím → 日本語 → ローマ字 (giống gõ máy tính) hoặc かな (vuốt 10 phím).', 'Nhấn giữ biểu tượng quả cầu để đổi bàn phím.', 'Gõ xong chạm từ gợi ý phía trên để ra kanji.']],
  android: ['Android', ['Cài Gboard → Ngôn ngữ → Thêm 日本語 → chọn QWERTY (romaji) hoặc 12 phím.', 'Nhấn giữ phím cách / quả cầu để đổi ngôn ngữ.', 'Chạm từ gợi ý để ra kanji.']],
};
const ROMAJI_RULES = [['ん', 'nn hoặc n\''], ['っ (nhỏ)', 'gấp đôi phụ âm: kitte → きって'], ['ゃゅょ', 'kya, sha, cho…; đứng riêng: xya / lya'], ['ー', 'phím -'], ['を', 'wo'], ['ぢ / づ', 'di / du'], ['ふ', 'fu hoặc hu'], ['じ', 'ji hoặc zi'], ['ぁぃぅぇぉ nhỏ', 'xa xi xu… hoặc la li lu…'], ['、。', 'phím , và .']];
function typingItems(mode, lv) {
  const n = +lv.slice(1);
  if (mode === 'sentence') return shuffle(GRAMMAR.filter(g => g.lv === lv)).slice(0, 8).map(g => ({ t: unbr(g.x), show: unbr(g.x), sub: g.p + ' · ' + g.m, say: unbr(g.x) }));
  const pool = HAS_BULK ? VB.filter(v => v[4] === n && v[1] && /[一-鿿]/.test(v[0])) : SENMON.map(v => [v[0], v[1], v[3]]);
  return shuffle(pool).slice(0, 12).map(v => ({ t: v[0], r: v[1], show: v[0], sub: v[1] + ' · ' + (VI_WORD[v[0]] ? VI_WORD[v[0]].m : v[2]), say: v[1] }));
}
function startTyping() { TY = { mode: TYP.mode, lv: TYP.lv, items: typingItems(TYP.mode, TYP.lv), i: 0, res: [], t0: 0, cur: null }; render(); }
function vTyping() {
  const os = TYP.os || guessOS(), g = IME_GUIDE[os];
  const guide = `<details class="panel" ${S.typing && S.typing.length > 3 ? '' : 'open'}><summary><h2>Cách gõ tiếng Nhật</h2></summary>
    <div class="seg">${Object.entries(IME_GUIDE).map(([k, v]) => `<button class="${k === os ? 'on' : ''}" data-a="tyOS" data-v="${k}">${v[0]}</button>`).join('')}</div>
    <ul class="plain">${g[1].map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    ${table(['Muốn gõ', 'Gõ romaji'], ROMAJI_RULES, [0])}
    <label class="check"><input type="checkbox" id="set-romaji" data-a="setRomaji" ${S.set.romaji ? 'checked' : ''}><span>Tự đổi romaji → kana trong app (dùng tạm khi máy chưa cài bàn phím Nhật; nên tắt để luyện bộ gõ thật)</span></label>
  </details>`;
  if (!TY) {
    const hist = (S.typing || []).slice(-8).reverse();
    return `<h1 class="pt">Luyện gõ <span lang="ja">入力練習</span></h1>${guide}
    <div class="panel"><div class="ph"><h2>Bài luyện</h2></div>
      <div class="seg">${[['word', 'Gõ từ (đổi ra kanji)'], ['dict', 'Nghe rồi gõ'], ['sentence', 'Gõ câu']].map(([k, n]) => `<button class="${TYP.mode === k ? 'on' : ''}" data-a="tyMode" data-v="${k}">${n}</button>`).join('')}</div>
      <div class="seg">${['N5', 'N4', 'N3', 'N2', 'N1'].map(l => `<button class="${TYP.lv === l ? 'on' : ''}" data-a="tyLv" data-v="${l}">${l}</button>`).join('')}</div>
      <p class="muted">${TYP.mode === 'word' ? 'Nhìn từ + cách đọc, gõ romaji rồi đổi sang đúng chữ Hán.' : TYP.mode === 'dict' ? 'Chỉ nghe, tự gõ ra từ (kanji hoặc kana đều được).' : 'Gõ lại nguyên câu ví dụ ngữ pháp, có chữ Hán.'} Đo độ chính xác và tốc độ (ký tự/phút).</p>
      <button class="btn pri" data-a="tyStart">Bắt đầu</button></div>
    ${hist.length ? `<div class="panel"><div class="ph"><h2>Lịch sử gần đây</h2></div>${table(['Ngày', 'Bài', 'Cấp', 'Chính xác', 'Ký tự/phút'], hist.map(h => [h.d, h.mode === 'word' ? 'Gõ từ' : h.mode === 'dict' ? 'Nghe rồi gõ' : 'Gõ câu', h.lv, h.acc + '%', String(h.cpm)]))}</div>` : ''}`;
  }
  if (TY.i >= TY.items.length) {
    const acc = Math.round(TY.res.reduce((a, r) => a + r.acc, 0) / TY.res.length), chars = TY.res.reduce((a, r) => a + r.len, 0), sec = TY.res.reduce((a, r) => a + r.sec, 0), cpm = sec ? Math.round(chars / sec * 60) : 0;
    return `<h1 class="pt">Kết quả luyện gõ</h1><div class="panel center"><div class="stamp" lang="ja">${acc >= 90 ? '速' : '練'}</div>
      <div class="ptlv"><div class="${acc >= 90 ? 'pass' : ''}"><b>${acc}%</b><small>chính xác</small></div><div><b class="num">${cpm}</b><small>ký tự/phút</small></div><div><b class="num">${TY.res.filter(r => r.ok).length}/${TY.res.length}</b><small>đúng hoàn toàn</small></div></div>
      ${TY.res.filter(r => !r.ok).length ? `<div class="wrong">${TY.res.filter(r => !r.ok).map(r => `<div class="wi"><p lang="ja">Bạn gõ: ${esc(r.v || '—')}</p><p class="ok" lang="ja">→ ${esc(r.t)}</p></div>`).join('')}</div>` : ''}
      <div class="row center"><button class="btn pri" data-a="tyStart">Lượt mới</button><button class="btn ghost" data-a="tyClose">Xong</button></div></div>`;
  }
  const it = TY.items[TY.i], c = TY.cur;
  return `<div class="rv-top"><button class="btn ghost sm" data-a="tyClose">Thoát</button><span class="muted">Luyện gõ · ${TY.lv}</span><span class="num muted">${TY.i + 1}/${TY.items.length}</span></div>
  <div class="rv-prog"><i style="width:${Math.round(TY.i / TY.items.length * 100)}%"></i></div>
  <div class="qcard">
    ${TY.mode === 'dict' ? `<div class="row center"><button class="btn pri" data-a="tySay">▶ Nghe</button><button class="btn" data-a="tySlow">Nghe chậm</button></div>${c ? `<p class="qs" lang="ja">${esc(it.show)}</p><p class="qsub" lang="ja">${esc(it.sub)}</p>` : ''}`
    : `<p class="qs ${TY.mode === 'word' ? 'huge' : ''}" lang="ja">${esc(it.show)}</p><p class="qsub" lang="ja">${esc(it.sub)}</p>`}
  </div>
  <div class="typebox">
    <input id="ty-in" class="jpin" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" ${c ? 'disabled' : ''} value="${c ? esc(c.v) : ''}" placeholder="${S.set.romaji ? 'gõ romaji' : 'gõ bằng bộ gõ tiếng Nhật'}">
    ${c ? `<div class="expl ${c.ok ? 'good' : 'bad'}"><b>${c.ok ? 'Chính xác.' : c.kanaOnly ? 'Đúng âm nhưng chưa đổi sang kanji.' : `Chính xác ${c.acc}%.`}</b> ${c.ok ? '' : `Đúng là: <span lang="ja">${esc(it.t)}</span>`} · ${c.sec.toFixed(1)} giây</div><div class="row"><button class="btn pri" data-a="tyNext" id="tynext">Tiếp</button></div>`
    : `<div class="row"><button class="btn pri" data-a="tyCheck">Xong</button></div><p class="hint">${imeShort()}</p>`}
  </div>`;
}
function typingAfterRender() { if (TY && !TY.cur && TY.shownI !== TY.i) { TY.shownI = TY.i; TY.shown = Date.now(); } const i = $('#ty-in'); if (i && !i.disabled) { setTimeout(() => i.focus(), 30); if (TY && TY.mode === 'dict' && TY.spoken !== TY.i) { TY.spoken = TY.i; setTimeout(() => speak(TY.items[TY.i].say), 150); } } else { const n = $('#tynext'); if (n) n.focus({ preventScroll: true }); } }
function tyCheck() {
  const it = TY.items[TY.i], inp = $('#ty-in'); if (!inp) return;
  let v = inp.value; if (S.set.romaji) v = romajiToKana(v, true);
  const sec = Math.max(1, (Date.now() - (TY.t0 || TY.shown || Date.now())) / 1000);
  const a = normKeep(v), b = normKeep(it.t);
  const acc = b.length ? Math.max(0, Math.round((1 - lev(a, b) / Math.max(a.length, b.length, 1)) * 100)) : 0;
  const kanaOnly = !!it.r && normJa(v) === normJa(it.r) && a !== b;
  const ok = a === b || (TY.mode === 'dict' && (normJa(v) === normJa(it.t) || normJa(v) === normJa(it.r)));
  TY.cur = { v, ok, acc: ok ? 100 : kanaOnly ? 70 : acc, sec, kanaOnly, len: [...b].length };
  TY.res.push({ ...TY.cur, t: it.t });
  logAdd('tn'); if (ok) logAdd('tc'); render();
}

/* ===== HÔM NAY (theo thiết bị) ===== */
function vToday() {
  const now = new Date(), te = targetExam(); const days = te ? dayNum(te.d) - dayNum(now) : 0;
  const ph = devMode() === 'phone', T = todayTargets(), due = dueCount(), wd = now.getDay();
  const mToday = dayMin(dayKey()), W = weekStats(0), cs = currentStage();
  const bars = []; for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); bars.push({ d, n: dayMin(dayKey(d)) }); }
  const mx = Math.max(DAY_MIN, ...bars.map(b => b.n));
  const plan = DAY_PLAN[ph ? 'phone' : 'laptop'];
  const vkLeft = T.w + T.k, gLeft = T.g;
  const main = ph
    ? `<div class="panel primary"><div class="ph"><h2>Học từ & kanji</h2><span class="tag">điện thoại · 60′</span></div>
        <div class="kpis"><div><b class="num">${T.L.w}/${T.D.w}</b><span>từ mới</span></div><div><b class="num">${T.L.k}/${T.D.k}</b><span>kanji mới</span></div><div><b class="num">${due}</b><span>thẻ đến hạn</span></div></div>
        <div class="row">${vkLeft ? `<button class="btn pri" data-a="flStart" data-v="vk">Học ${T.w} từ + ${T.k} kanji</button>` : '<span class="done-msg">Đủ từ & kanji hôm nay</span>'}${due ? `<button class="btn${vkLeft ? '' : ' pri'}" data-a="startReview">Ôn ${due} thẻ</button>` : ''}</div></div>`
    : `<div class="panel primary"><div class="ph"><h2>Ngữ pháp hôm nay</h2><span class="tag">laptop · 60′</span></div>
        <div class="kpis"><div><b class="num">${T.L.g}/${T.D.g}</b><span>mẫu mới</span></div><div><b class="num">${due}</b><span>thẻ đến hạn</span></div><div><b class="num">${(S.typing || []).filter(x => x.d === dayKey()).length}</b><span>lượt gõ</span></div></div>
        <div class="row">${gLeft ? `<button class="btn pri" data-a="flStart" data-v="gr">Học ${T.g} mẫu ngữ pháp</button>` : '<span class="done-msg">Đủ ngữ pháp hôm nay</span>'}<a class="btn" href="#typing">Luyện gõ</a>${due ? `<button class="btn" data-a="startReview">Ôn ${due} thẻ</button>` : ''}</div>
        <p class="hint">Từ & kanji: ${T.L.w}/${T.D.w} từ, ${T.L.k}/${T.D.k} kanji ${vkLeft ? '· <button class="lnkb lnk" data-a="flStart" data-v="vk">học ngay trên máy này</button>' : '· xong'}</p></div>`;
  return `
  <header class="hero">
    <div class="hero-l">
      <p class="eyebrow">${WD[wd]}, ${fmtDate(now)} · ${ph ? 'điện thoại' : 'laptop'}</p>
      <h1>Chào Son. <span lang="ja">今日も一歩ずつ。</span></h1>
      <p class="muted">Giai đoạn <b>${STAGES[cs].n}</b> (${esc(STAGES[cs].time)}) · ${esc(WEEK[wd][1])}</p>
    </div>
    ${te ? `<div class="count" title="Kỳ thi mục tiêu"><span class="count-l" lang="ja">あと</span><span class="count-n">${days}</span><span class="count-l" lang="ja">日</span><span class="count-d">thi N2 ${fmtDate(te.d)}${te.official ? '' : ' (dự kiến)'}</span></div>` : ''}
  </header>
  <section class="grid2">
    ${main}
    <div class="panel"><div class="ph"><h2>2 giờ hôm nay</h2><span class="num"><b>${mToday}</b>/${DAY_MIN} phút</span></div>
      <div class="sbar big"><i style="width:${Math.min(100, mToday / DAY_MIN * 100)}%"></i></div>
      <ol class="blocks">${plan.map(b => `<li><b>${b[1]}′</b> <a href="#${b[2]}" class="lnk">${esc(b[0])}</a></li>`).join('')}</ol>
      <p class="hint">${ph ? 'Laptop' : 'Điện thoại'}: ${DAY_PLAN[ph ? 'laptop' : 'phone'].map(b => b[0]).join(' → ')}. Thời gian tính tự động khi bạn học trong app (mỗi máy riêng, cộng lại).</p></div>
  </section>
  <section class="grid2">
    <div class="panel"><div class="ph"><h2>Tuần này</h2><span class="num"><b>${W.min}</b>/${WEEK_MIN} phút</span></div>
      <div class="kpis four"><div><b class="num">${W.newWords}</b><span>từ mới</span></div><div><b class="num">${W.newKanji}</b><span>kanji</span></div><div><b class="num">${W.newGrammar}</b><span>ngữ pháp</span></div><div><b class="num">${W.typed ? Math.round(W.typedOk / W.typed * 100) + '%' : '—'}</b><span>gõ đúng</span></div></div>
      <div class="bars" role="img" aria-label="Số phút học 14 ngày qua">${bars.map((b, i) => `<div class="bar${i === 13 ? ' now' : ''}${b.n >= DAY_MIN ? ' full' : ''}" title="${fmtDate(b.d)}: ${b.n} phút"><i style="height:${Math.round(b.n / mx * 100)}%"></i><span>${b.d.getDate()}</span></div>`).join('')}</div>
      <p class="hint">Cột: phút học mỗi ngày (mục tiêu ${DAY_MIN}). Chuỗi: ${streak()} ngày.</p></div>
    <div class="panel"><div class="ph"><h2>Lộ trình</h2><a class="lnk" href="#plan">Chi tiết</a></div>
      <ol class="stages">${STAGES.map((s, i) => { const p = stageProg(i); return `<li class="${i === cs ? 'cur' : p >= 0.8 ? 'done' : ''}"><span class="sn">${s.n}</span><span class="sbar"><i style="width:${Math.round(p * 100)}%"></i></span><span class="sp num">${Math.round(p * 100)}%</span></li>`; }).join('')}</ol>
      <p class="hint">% = số mục đã học trong các bộ của giai đoạn. Kiểm tra trình độ lại mỗi 6–8 tuần ở Luyện tập.</p></div>
  </section>
  ${ph ? `<div class="row"><a class="btn" href="#practice">Luyện tập & kiểm tra trình độ</a><a class="btn" href="#exam">Thi thử</a><a class="btn" href="#typing">Luyện gõ</a></div>` : ''}`;
}

/* ===== BÁO CÁO TUẦN + CÀI ĐẶT HỌC ===== */
function weeklyPanel() {
  const rows = [0, 1, 2, 3].map(weekStats);
  return `<section class="panel" id="weekly"><div class="ph"><h2>Báo cáo tuần</h2><span class="tag">mục tiêu ${WEEK_MIN} phút/tuần</span></div>
    ${table(['Tuần', 'Phút', 'Ngày học', 'Từ mới', 'Kanji', 'Ngữ pháp', 'Lượt ôn', 'Gõ đúng'], rows.map(w => [w.from.slice(5) + ' → ' + w.to.slice(5), `${w.min} (${Math.round(w.min / WEEK_MIN * 100)}%)`, w.activeDays + '/7', String(w.newWords), String(w.newKanji), String(w.newGrammar), String(w.reviews), w.typed ? Math.round(w.typedOk / w.typed * 100) + '%' : '—']))}
    <p class="hint">Số liệu này cũng được ghi vào gist (file jlpt-n2-weekly.json) để báo cáo tự động hằng tuần.</p></section>`;
}
function studySettings() {
  const D = S.set.daily || { w: 12, k: 3, g: 2 };
  const sel = (id, key, opts) => `<select id="${id}" data-a="setDaily" data-k="${key}">${opts.map(n => `<option ${D[key] === n ? 'selected' : ''}>${n}</option>`).join('')}</select>`;
  return `<div class="cuform">
    <label class="fld" for="dl-w">Từ mới mỗi ngày${sel('dl-w', 'w', [5, 8, 10, 12, 15, 20, 25])}</label>
    <label class="fld" for="dl-k">Kanji mới mỗi ngày${sel('dl-k', 'k', [0, 2, 3, 4, 5, 8])}</label>
    <label class="fld" for="dl-g">Mẫu ngữ pháp mới mỗi ngày${sel('dl-g', 'g', [0, 1, 2, 3, 4])}</label>
    <label class="fld" for="set-dev">Giao diện<select id="set-dev" data-a="setDev">${[['auto', 'Tự nhận (điện thoại / laptop)'], ['phone', 'Luôn kiểu điện thoại'], ['laptop', 'Luôn kiểu laptop']].map(([v, t]) => `<option value="${v}" ${(S.set.dev || 'auto') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
  </div>
  <p class="hint">Với 14 giờ/tuần: 12 từ + 3 kanji + 2 mẫu/ngày đủ để xong N3 trước 10/2027 và N2 trước 5/2028. Ngày Chủ nhật nên để 0 mới, chỉ ôn.</p>
  <label class="check"><input type="checkbox" id="set-typerev" data-a="setTypeRev" ${S.set.typeRev ? 'checked' : ''}><span>Khi ôn thẻ từ vựng và kanji: gõ đáp án trước khi lật thẻ</span></label>`;
}

/* ===== HÀNH ĐỘNG ===== */
Object.assign(ACT, {
  flStart(t) { startFlow(t.dataset.v); },
  flMore(t) { const m = t.dataset.v; FL = null; startFlow(m, m === 'gr' ? 2 : 5); },
  flClose() { FL = null; render(); },
  flSay() { flowAudio(false); },
  flSlow() { flowAudio(true); },
  flKnown() { const c = flowList()[FL.i]; FL.known[c.k] = true; flowAdvance(); },
  flNext() { flowAdvance(); },
  flAns(t) {
    if (FL.pick != null) return; const c = flowList()[FL.i], ph = FL_PHASES[FL.ph][0], q = FL.spec[c.k][ph];
    FL.pick = +t.dataset.i; const ok = FL.pick === q.ans; if (!ok) FL.err[c.k] = (FL.err[c.k] || 0) + 1;
    logAdd('q'); if (ok) logAdd('c'); render();
  },
  flHint() { const c = flowList()[FL.i], q = FL.spec[c.k].type, inp = $('#fl-in'); FL.hintUsed = c.k; const a = q.answers[0]; if (inp) { inp.value = [...a].slice(0, Math.max(1, Math.floor([...a].length / 3))).join(''); inp.focus(); } toast('Gợi ý: phần đầu đáp án'); },
  flSkip() { const c = flowList()[FL.i]; FL.typed = { v: '', ok: false }; FL.err[c.k] = (FL.err[c.k] || 0) + 1; logAdd('tn'); render(); },
  flCheck() {
    const c = flowList()[FL.i], q = FL.spec[c.k].type, inp = $('#fl-in'); if (!inp || FL.typed) return;
    let v = inp.value; if (S.set.romaji) v = romajiToKana(v, true);
    if (!v.trim()) { toast('Hãy gõ đáp án, hoặc bấm Không biết'); return; }
    const ok = isRight(v, q.answers), hint = FL.hintUsed === c.k;
    FL.typed = { v, ok, hint }; if (!ok) FL.err[c.k] = (FL.err[c.k] || 0) + 1; else if (hint) FL.err[c.k] = (FL.err[c.k] || 0) + 1;
    logAdd('tn'); if (ok) logAdd('tc'); render();
  },
  tyMode(t) { TYP.mode = t.dataset.v; render(); },
  tyLv(t) { TYP.lv = t.dataset.v; render(); },
  tyOS(t) { TYP.os = t.dataset.v; render(); },
  tyStart() { startTyping(); },
  tyClose() { if (TY && TY.res.length) { const acc = Math.round(TY.res.reduce((a, r) => a + r.acc, 0) / TY.res.length), chars = TY.res.reduce((a, r) => a + r.len, 0), sec = TY.res.reduce((a, r) => a + r.sec, 0); if (!TY.saved) { S.typing = S.typing || []; S.typing.push({ d: dayKey(), mode: TY.mode, lv: TY.lv, n: TY.res.length, acc, cpm: sec ? Math.round(chars / sec * 60) : 0 }); S.typing = S.typing.slice(-200); save(); } } TY = null; render(); },
  tySay() { speak(TY.items[TY.i].say); },
  tySlow() { speak(TY.items[TY.i].say, 0.65); },
  tyCheck() { tyCheck(); },
  tyNext() { TY.i++; TY.cur = null; TY.t0 = 0; if (TY.i >= TY.items.length && !TY.saved) { const acc = Math.round(TY.res.reduce((a, r) => a + r.acc, 0) / TY.res.length), chars = TY.res.reduce((a, r) => a + r.len, 0), sec = TY.res.reduce((a, r) => a + r.sec, 0); S.typing = S.typing || []; S.typing.push({ d: dayKey(), mode: TY.mode, lv: TY.lv, n: TY.res.length, acc, cpm: sec ? Math.round(chars / sec * 60) : 0 }); S.typing = S.typing.slice(-200); TY.saved = true; save(); } render(); },
  setRomaji(t) { S.set.romaji = t.checked; save(); },
  setDaily(t) { S.set.daily = { ...(S.set.daily || {}), [t.dataset.k]: +t.value }; save(); },
  setDev(t) { S.set.dev = t.value; save(); render(); },
  setTypeRev(t) { S.set.typeRev = t.checked; save(); },
  rvCheck() {
    const c = RV.q[RV.i], inp = $('#rv-in'); if (!inp) return; let v = inp.value; if (S.set.romaji) v = romajiToKana(v, true);
    const sp = revTypeSpec(c); const ok = isRight(v, sp.answers);
    RV.typed = { v, ok }; RV.flip = true; logAdd('tn'); if (ok) logAdd('tc'); render();
  },
});
function revTypeSpec(c) {
  const kd = kindOf(c);
  if (kd === 'kanji') return c.ew && c.er ? { q: `Gõ cách đọc của <b lang="ja">${esc(c.ew)}</b>`, answers: [c.er] } : { q: 'Gõ một cách đọc On/Kun', answers: [...String(c.on || '').split('・'), ...String(c.kun || '').split('・')].filter(Boolean) };
  if (kd === 'vocab' && c.r) return { q: 'Gõ cách đọc', answers: [c.r, c.f] };
  return null;
}

/* gõ: Enter chỉ nộp khi đã chốt chữ trong bộ gõ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
  const id = e.target && e.target.id;
  if (id === 'fl-in') { e.preventDefault(); ACT.flCheck(); }
  else if (id === 'ty-in') { e.preventDefault(); tyCheck(); }
  else if (id === 'rv-in') { e.preventDefault(); ACT.rvCheck(); }
});
document.addEventListener('input', e => {
  const t = e.target; if (!t || !['fl-in', 'ty-in', 'rv-in'].includes(t.id)) return;
  if (t.id === 'ty-in' && TY && !TY.t0) TY.t0 = Date.now();
  if (S.set.romaji && !e.isComposing) { const v = romajiToKana(t.value); if (v !== t.value) t.value = v; }
});
document.addEventListener('keydown', e => {
  if (route !== 'learn' || !FL || FL.done || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const ph = FL_PHASES[FL.ph][0];
  if ((ph === 'listen' || ph === 'choose') && FL.pick == null && '1234'.includes(e.key)) { e.preventDefault(); ACT.flAns({ dataset: { i: +e.key - 1 } }); }
  else if (e.key === 'Enter' && (ph === 'learn' || FL.pick != null || FL.typed)) { e.preventDefault(); flowAdvance(); }
});
