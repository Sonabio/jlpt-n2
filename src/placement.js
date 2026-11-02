/* ===== PLACEMENT TEST (kiểm tra trình độ) =====
   Thích ứng theo khối: Chữ → N5 → N4 → N3 → N2. Đạt ≥ 65% một khối thì sang khối tiếp, dưới thì dừng.
   Mỗi khối N: 3 đọc kanji · 3 từ vựng · 3 ngữ pháp · 1 đọc hiểu · 2 nghe. Câu hỏi tự soạn, không phải đề JLPT thật. */
const PT_SKILLS = { kana: 'Chữ (kana)', kanji: 'Đọc kanji', vocab: 'Từ vựng', grammar: 'Ngữ pháp', reading: 'Đọc hiểu', listening: 'Nghe hiểu' };
const PT_PASS = 0.65;
/* skill | câu hỏi (ja) | đáp án | sai1,sai2,sai3 | ghi chú (passage / gợi ý VN) */
const PT_BANK = {
  'Chữ': L(`
kana|さくら|sakura|sakuro,sekura,sakure|
kana|きって|kitte|kite,kiite,kitto|
kana|しゅくだい|shukudai|shikudai,sukudai,shukuda|
kana|ひこうき|hikouki|hikoki,hikouke,hekouki|
kana|コーヒー|koohii|kohii,kouhi,kooho|
kana|パソコン|pasokon|basokon,pasokan,hasokon|
`),
  N5: L(`
kanji|毎日|まいにち|まいび,めいにち,ごとにち|
kanji|先生|せんせい|せんせ,さきせい,せんしょう|
kanji|電車|でんしゃ|でんじゃ,てんしゃ,でんくるま|
vocab|のどが かわいたので、みずを（　）。|のみました|たべました,ききました,かいました|
vocab|この へやは（　）です。まどが ありませんから。|くらい|あかるい,みじかい,わかい|
vocab|えきまで（　）で いきます。|バス|テレビ,シャツ,ノート|
reading|きのう、わたしは どうやって だいがくへ いきましたか。|あるいて|バスで,でんしゃで,じてんしゃで|わたしは まいあさ 7じに おきます。あさごはんを たべてから、バスで だいがくへ いきます。きのうは バスが こなかったので、あるいて いきました。
listening|すみません、えきは どこですか。|Hỏi đường đến nhà ga|Mua vé tàu,Hỏi mấy giờ rồi,Xin lỗi vì đến muộn|Người nói muốn làm gì?
listening|あしたは あめが ふるでしょう。|Ngày mai có lẽ trời mưa|Hôm nay trời đang mưa,Ngày mai trời nắng,Hôm qua trời mưa|Câu này nói gì?
`),
  N4: L(`
kanji|地図|ちず|じず,ちと,ちづ|
kanji|特別|とくべつ|どくべつ,とくへつ,とくべち|
kanji|説明|せつめい|せつみょう,ぜつめい,せめい|
vocab|会議の 前に 資料を（　）おいて ください。|じゅんびして|えんりょして,しっぱいして,けっせきして|
vocab|かぜを ひいたので、きょうは 学校を（　）。|やすみます|おくります,はじめます,かよいます|
vocab|この 道は 夜 とても（　）ので、気をつけて ください。|あぶない|ていねいな,にぎやかな,うれしい|
reading|明日の 実験について、正しいものは どれですか。|時間が 変わった|場所が 変わった,資料は 当日 もらう,実験は 中止に なった|田中さんへ　明日の 実験は、機械の 点検の ため、午後2時から 4時に 変更に なりました。実験室の 場所は 変わりません。資料は 前の日までに メールで 送ります。　山本
listening|すみません、この 書類、今日中に 出さなければ なりませんか。|Hỏi có phải nộp giấy tờ trong hôm nay không|Hỏi nộp giấy tờ ở đâu,Hỏi ai viết giấy tờ,Xin mượn giấy tờ|Người nói hỏi gì?
listening|電車が 遅れたので、会議に 間に合いませんでした。|Không kịp họp vì tàu trễ|Đến họp sớm vì đi tàu,Cuộc họp bị hoãn,Tàu đến đúng giờ|Chuyện gì đã xảy ra?
`),
  N3: L(`
kanji|環境|かんきょう|かんけい,がんきょう,かんきょ|
kanji|経験|けいけん|きょうけん,けいげん,けけん|
kanji|混雑|こんざつ|こんさつ,こんぞう,ごんざつ|
vocab|最近 寝不足で、仕事に（　）できない。|しゅうちゅう|せいこう,ちゅうもく,かんしん|
vocab|雨で 試合が 来週に（　）された。|えんき|ほぞん,はっけん,せいり|
vocab|彼は 約束を 必ず 守る、（　）できる 人だ。|しんらい|しんぱい,しんせつ,しんぽ|
reading|この 文章の 内容と 合って いるものは どれか。|来年から プラスチックの 容器は 別の 日に 出す|プラスチックは 燃えるごみと 一緒に 出せば よい,ごみの 量は すでに 2割 減った,水曜日は ごみを 出せなく なる|ある市では、来年4月から 家庭ごみの 出し方が 変わる。これまで 燃えるごみと 一緒に 出して いた プラスチック製の 容器は、毎週水曜日に 別の 袋に 入れて 出す ことに なる。市に よると、分けて 集める ことで、ごみの 量を 約2割 減らせる 見込みだと いう。
listening|レポートの締め切りって、金曜日じゃなくて、来週の月曜日に延びたらしいよ。|Hạn nộp báo cáo lùi sang thứ Hai tuần sau|Hạn nộp là thứ Sáu này,Báo cáo bị hủy,Hạn nộp đã qua|Người nói báo tin gì?
listening|先生に相談したところ、もう一度データを取り直したほうがいいと言われました。|Thầy khuyên lấy lại dữ liệu|Thầy khen dữ liệu tốt,Thầy chưa trả lời,Thầy bảo bỏ dữ liệu|Thầy giáo đã nói gì?
`),
  N2: L(`
kanji|削減|さくげん|しょうげん,さくけん,さっげん|
kanji|依頼|いらい|えらい,いれい,いだい|
kanji|把握|はあく|はおく,ばあく,はやく|
vocab|新しい 制度の 導入には、多くの 課題が（　）して いる。|さんせき|はっき,ていじ,かくほ|
vocab|予算が 限られて いるため、優先順位を（　）必要が ある。|つける|かける,あげる,はらう|
vocab|彼の 説明は（　）で、何が 言いたいのか 分からなかった。|あいまい|てきかく,めいかく,せいかく|
reading|筆者の 考えに 最も 近い ものは どれか。|新しい 技術より 先に、人材の 育成に 力を 入れる べきだ|新しい 技術を 早く 導入すれば 効率は 必ず 上がる,排水処理の 技術開発は もう 必要ない,現場の 人材は 十分に 育って いる|排水処理の 分野では、効率を 高める 新しい 技術が 次々と 開発されて いる。しかし、技術 そのものが 優れて いても、現場で 使いこなせる 人材が いなければ、その 効果は 十分に 発揮されない。むしろ 今 求められて いるのは、技術を 導入する 前に、運転管理を 担う 人の 育成に 投資する ことでは ないだろうか。
listening|せっかく来ていただいたのに申し訳ないんですが、部長は急な会議で席を外しておりまして。|Trưởng phòng vắng mặt vì có cuộc họp đột xuất|Trưởng phòng đã về nhà,Người nói mời khách vào phòng họp,Trưởng phòng đang chờ khách|Người nói thông báo gì?
listening|この資料、目を通しておいていただけますか。|はい、拝見しておきます。|はい、目を閉じておきます。,いいえ、通りません。,はい、お通りください。|Chọn câu đáp phù hợp nhất.
`),
};
const PT_LEVELS = ['Chữ', 'N5', 'N4', 'N3', 'N2'];
let PT = null;
let jaVoice = null;
function hasJaVoice() { try { const v = speechSynthesis.getVoices(); jaVoice = v.find(x => /^ja/i.test(x.lang)) || null; return !!jaVoice || v.length === 0; } catch (e) { return false; } }
try { speechSynthesis.onvoiceschanged = () => hasJaVoice(); } catch (e) { }

function ptBuildBlock(lv) {
  const rows = PT_BANK[lv].map(([sk, q, a, wrong, note]) => ({ sk, q, a, wrong: wrong.split(','), note }));
  let items = rows.filter(r => r.sk !== 'reading' && r.sk !== 'listening');
  if (lv !== 'Chữ') {
    const gl = GRAMMAR.filter(g => g.lv === lv && /\[.+\]/.test(g.x));
    const picks = shuffle(gl).slice(0, 3);
    const grams = picks.map(g => {
      const ans = g.x.match(/\[(.+?)\]/)[1];
      const pool = gl.filter(o => o !== g).map(o => o.x.match(/\[(.+?)\]/)[1]).filter(x => x !== ans && !(['へ', 'に'].includes(ans) && ['へ', 'に'].includes(x)));
      return { sk: 'grammar', q: g.x.replace(/\[.+?\]/, '（　）'), a: ans, wrong: shuffle([...new Set(pool)]).slice(0, 3), note: g.p };
    });
    items = [...items.filter(r => r.sk === 'kanji'), ...items.filter(r => r.sk === 'vocab'), ...grams, ...rows.filter(r => r.sk === 'reading'), ...rows.filter(r => r.sk === 'listening')];
  } else items = shuffle(items);
  return { lv, items: items.map(it => { const o = shuffle([it.a, ...it.wrong]); return { ...it, opts: o, ans: o.indexOf(it.a) }; }), ok: 0 };
}
function ptStart() { PT = { blocks: [ptBuildBlock('Chữ')], bi: 0, qi: 0, pick: null, t0: Date.now(), done: false, log: [], voice: hasJaVoice() }; }
function ptCur() { const b = PT.blocks[PT.bi]; return b && b.items[PT.qi]; }
function ptAnswer(i) {
  const q = ptCur(); if (!q || PT.pick != null) return;
  PT.pick = i; const ok = i === q.ans; if (ok) PT.blocks[PT.bi].ok++;
  PT.log.push({ lv: PT.blocks[PT.bi].lv, sk: q.sk, ok });
}
function ptNext() {
  const b = PT.blocks[PT.bi]; PT.pick = null; PT.qi++;
  if (PT.qi < b.items.length) return;
  const score = b.ok / b.items.length; const nextLv = PT_LEVELS[PT_LEVELS.indexOf(b.lv) + 1];
  if (score >= PT_PASS && nextLv) { PT.blocks.push(ptBuildBlock(nextLv)); PT.bi++; PT.qi = 0; }
  else ptFinish();
}
function ptFinish() {
  PT.done = true;
  const lvScores = PT.blocks.map(b => ({ lv: b.lv, ok: b.ok, n: b.items.length, p: b.ok / b.items.length }));
  const passed = lvScores.filter(s => s.p >= PT_PASS);
  const top = passed.length ? passed[passed.length - 1].lv : null;
  const last = lvScores[lvScores.length - 1];
  const sk = {}, sk2 = {};
  PT.log.forEach(l => { const s = sk[l.sk] || (sk[l.sk] = { ok: 0, n: 0 }); s.n++; if (l.ok) s.ok++; const b = sk2[l.lv] || (sk2[l.lv] = {}); const t = b[l.sk] || (b[l.sk] = { ok: 0, n: 0 }); t.n++; if (l.ok) t.ok++; });
  const res = { d: dayKey(), min: Math.round((Date.now() - PT.t0) / 60000), top, next: last.p < PT_PASS ? last : null, lv: lvScores, sk, sk2, voice: PT.voice };
  PT.res = res;
  S.place = S.place || []; S.place.push(res); logAdd('q', PT.log.length); logAdd('c', PT.log.filter(l => l.ok).length); save();
}
function ptLabel(r) {
  if (!r.top) return { big: 'Chữ', sub: 'Chưa chắc kana', stage: 0 };
  if (r.top === 'Chữ') return { big: 'Mới bắt đầu', sub: r.next && r.next.p >= 0.4 ? 'Đã có một phần N5' : 'Đã đọc được kana', stage: 1 };
  const i = PT_LEVELS.indexOf(r.top);
  if (r.top === 'N2') return { big: 'N2', sub: 'Đạt cả khối N2 của bài này', stage: 4 };
  const nx = PT_LEVELS[i + 1];
  return { big: r.top, sub: r.next && r.next.p >= 0.4 ? `Đang tiến tới ${nx}` : `Vững ${r.top}`, stage: Math.min(4, i + 1) };
}
/* Gợi ý bộ thẻ: giai đoạn kế tiếp + giữ cấp vừa đạt nếu chưa vững (khối < 85% hoặc kỹ năng < 50%) */
const SOLID = 0.85;
const LV_SKILL_DECKS = { 'Chữ': { kana: ['hira', 'kata'] }, N5: { kanji: ['kanji5'], vocab: ['kanji5'], grammar: ['g5'] }, N4: { kanji: ['kanji4'], vocab: ['jita'], grammar: ['g4'] }, N3: { kanji: ['v-work', 'v-life'], vocab: ['v-life', 'v-health'], grammar: ['g3'] }, N2: { kanji: ['v-study', 'v-mt'], vocab: ['v-econ', 'fukushi'], grammar: ['g2'] } };
function ptPlan(r) {
  const lab = ptLabel(r), next = STAGES[lab.stage].decks.slice(), keep = [], why = [];
  const topBlock = r.lv.find(b => b.lv === r.top);
  if (topBlock && lab.stage > 0 && r.top !== 'N2') {
    const prevDecks = STAGES[lab.stage - 1].decks;
    if (topBlock.p < SOLID) { keep.push(...prevDecks); why.push(`khối ${r.top} mới ${Math.round(topBlock.p * 100)}% (< 85%)`); }
    else if (r.sk2 && r.sk2[r.top]) {
      Object.entries(r.sk2[r.top]).forEach(([k, v]) => { if (v.n && v.ok / v.n < 0.5 && LV_SKILL_DECKS[r.top] && LV_SKILL_DECKS[r.top][k]) { keep.push(...LV_SKILL_DECKS[r.top][k]); why.push(`${PT_SKILLS[k]} ${r.top} ${v.ok}/${v.n}`); } });
    }
  }
  const decks = [...new Set([...(S.set.decks.includes('mine') ? ['mine'] : []), ...keep, ...next])].filter(id => DECK[id]);
  const newPer = keep.length ? Math.max(S.set.newPer, 15) : S.set.newPer;
  return { decks, keep: [...new Set(keep)], next, why, newPer, stage: lab.stage };
}
function vPlacement() {
  if (PT.done) return vPlacementResult(PT.res);
  const b = PT.blocks[PT.bi], q = ptCur(), done = PT.pick != null;
  const total = PT.blocks.reduce((a, x) => a + x.items.length, 0) - b.items.length + PT.qi + 1;
  const isListen = q.sk === 'listening';
  const showText = isListen && (done || !PT.voice);
  return `<div class="rv-top"><button class="btn ghost sm" data-a="ptClose">Thoát</button><span class="muted">Kiểm tra trình độ · khối <b>${b.lv}</b> · ${PT_SKILLS[q.sk]}</span><span class="num muted">câu ${total}</span></div>
  <div class="ptsteps">${PT_LEVELS.map(l => { const bb = PT.blocks.find(x => x.lv === l); return `<span class="${bb ? (bb === b ? 'cur' : 'pass') : ''}">${l}</span>`; }).join('')}</div>
  <div class="rv-prog"><i style="width:${Math.round(PT.qi / b.items.length * 100)}%"></i></div>
  <div class="qcard">
    ${q.sk === 'reading' ? `<p class="passage" lang="ja">${esc(q.note)}</p><p class="qs" lang="ja">${esc(q.q)}</p>` : ''}
    ${q.sk === 'kana' ? `<p class="qsub">Chữ này đọc là gì?</p><p class="qs huge" lang="ja">${esc(q.q)}</p>` : ''}
    ${q.sk === 'kanji' ? `<p class="qsub">Cách đọc của từ gạch chân</p><p class="qs huge" lang="ja"><u>${esc(q.q)}</u></p>` : ''}
    ${q.sk === 'vocab' || q.sk === 'grammar' ? `<p class="qsub">Chọn từ phù hợp nhất cho chỗ trống</p><p class="qs" lang="ja">${esc(q.q)}</p>` : ''}
    ${isListen ? `<p class="qsub">${esc(q.note)}</p>${PT.voice ? `<button class="btn pri" data-a="ptPlay">Nghe câu</button><p class="hint">Nghe được nhiều lần. Không có chữ cho đến khi trả lời.</p>` : '<p class="hint">Thiết bị chưa có giọng đọc tiếng Nhật nên câu nghe được hiện bằng chữ.</p>'}${showText ? `<p class="qs" lang="ja">${esc(q.q)}</p>` : ''}` : ''}
  </div>
  <div class="opts">${q.opts.map((o, i) => `<button class="opt${done ? (i === q.ans ? ' right' : i === PT.pick ? ' wrongp' : ' dim') : ''}" data-a="ptAns" data-i="${i}" ${done ? 'disabled' : ''} ${/[぀-ヿ一-鿿]/.test(o) ? 'lang="ja"' : ''}><span class="ok-n">${i + 1}</span>${esc(o)}</button>`).join('')}</div>
  ${done ? `<div class="row"><button class="btn pri" data-a="ptNext" id="ptnext">Câu tiếp</button>${q.sk === 'grammar' ? `<span class="hint">Mẫu: <span lang="ja">${esc(q.note)}</span></span>` : ''}</div>` : '<p class="hint">Không chắc thì cứ chọn: bài tự dừng ở khối vượt quá trình độ, nên đoán bừa không giúp lên cấp.</p>'}`;
}
function vPlacementResult(r) {
  const lab = ptLabel(r);
  const skRows = Object.entries(PT_SKILLS).filter(([k]) => r.sk[k]).map(([k, n]) => { const s = r.sk[k]; const p = s.ok / s.n; return `<div class="skr"><span>${n}</span><span class="sbar"><i style="width:${Math.round(p * 100)}%;${p < 0.5 ? 'background:var(--shu)' : ''}"></i></span><span class="num">${s.ok}/${s.n}</span></div>`; }).join('');
  const weak = Object.entries(r.sk).filter(([, s]) => s.n >= 2 && s.ok / s.n < 0.5).map(([k]) => PT_SKILLS[k]);
  const st = STAGES[lab.stage]; const plan = ptPlan(r);
  const cell = v => v ? `<td class="num ${v.ok / v.n < 0.5 ? 'weak' : v.ok === v.n ? 'full' : ''}">${v.ok}/${v.n}</td>` : '<td class="muted">—</td>';
  const grid = r.sk2 ? `<div class="tbl"><table class="skgrid"><thead><tr><th>Khối</th>${Object.values(PT_SKILLS).map(n => `<th>${n}</th>`).join('')}</tr></thead><tbody>${r.lv.map(b => `<tr><td><b>${b.lv}</b></td>${Object.keys(PT_SKILLS).map(k => cell(r.sk2[b.lv] && r.sk2[b.lv][k])).join('')}</tr>`).join('')}</tbody></table></div><p class="hint">Ô đỏ: dưới 50%. Ô xanh: đúng hết.</p>` : '<p class="hint">Bài làm trước bản cập nhật này chưa lưu điểm kỹ năng theo từng cấp; làm lại để xem chi tiết.</p>';
  return `<h1 class="pt">Kết quả kiểm tra <span lang="ja">実力診断</span></h1>
  <div class="panel">
    <div class="ptres">
      <div class="stamp" lang="ja">${lab.big === 'Mới bắt đầu' ? '初' : lab.big === 'Chữ' ? '字' : lab.big}</div>
      <div><p class="eyebrow">Trình độ ước tính · ${fmtDate(new Date())} · ${r.min} phút</p><h2 class="ptbig">${lab.big}</h2><p class="muted">${lab.sub}</p></div>
    </div>
    <div class="ptlv">${r.lv.map(s => `<div class="${s.p >= PT_PASS ? 'pass' : 'fail'}"><b>${s.lv}</b><span class="num">${s.ok}/${s.n}</span><small>${Math.round(s.p * 100)}%</small></div>`).join('')}</div>
    <p class="hint">Đạt một khối cần ≥ 65%. Bài dừng ở khối đầu tiên chưa đạt.</p>
  </div>
  <section class="grid2">
    <div class="panel"><div class="ph"><h2>Theo kỹ năng</h2></div>${skRows}${grid}
      ${weak.length ? `<p>Cần ưu tiên: <b>${weak.join(', ')}</b>.</p>` : ''}${r.voice ? '' : '<p class="hint">Phần nghe được hiện bằng chữ vì thiết bị chưa có giọng đọc tiếng Nhật, nên điểm nghe có thể cao hơn thực tế.</p>'}</div>
    <div class="panel"><div class="ph"><h2>Nên học tiếp</h2><span class="tag">giai đoạn ${st.n}</span></div>
      <p>${esc(st.goal)}</p><p class="muted">${st.time} · ${esc(st.out)}</p>
      <div class="plan"><p><b>Học mới:</b> ${plan.next.filter(id => DECK[id]).map(id => DECK[id].name).join(', ')}</p>
      ${plan.keep.length ? `<p><b>Giữ ôn thêm:</b> ${plan.keep.filter(id => DECK[id]).map(id => DECK[id].name).join(', ')} <span class="muted">(vì ${plan.why.join('; ')})</span></p>` : ''}
      <p><b>Thẻ mới mỗi ngày:</b> ${plan.newPer}${plan.newPer !== S.set.newPer ? ` <span class="muted">(hiện ${S.set.newPer})</span>` : ''}</p></div>
      <p class="hint">Áp dụng sẽ thay danh sách bộ thẻ lấy thẻ mới; thẻ đã học và lịch ôn giữ nguyên.</p>
      <div class="row"><button class="btn pri" data-a="ptApply">Áp dụng gợi ý</button><button class="btn" data-a="ptClose">Xong</button></div></div>
  </section>
  <p class="hint">Đây là bài tự soạn để định hướng (~${r.lv.reduce((a, s) => a + s.n, 0)} câu), không phải điểm JLPT chính thức. Làm lại sau mỗi 1–2 tháng để xem tiến bộ; kết quả được lưu ở mục Thi thử.</p>`;
}
function ptHistoryHTML() {
  const h = (S.place || []).slice(-6).reverse(); if (!h.length) return '';
  return `<div class="tbl"><table><thead><tr><th>Ngày</th><th>Ước tính</th><th>Theo khối</th></tr></thead><tbody>${h.map(r => { const l = ptLabel(r); return `<tr><td class="num">${r.d}</td><td><b>${l.big}</b> <small class="muted">${l.sub}</small></td><td class="num">${r.lv.map(s => s.lv + ' ' + Math.round(s.p * 100) + '%').join(' · ')}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function placementCard() {
  const last = (S.place || []).slice(-1)[0], l = last && ptLabel(last);
  return `<div class="panel ptcard">
    <div class="ph"><div class="mh"><span class="mj" lang="ja">診断</span><h2>Kiểm tra trình độ</h2></div>${l ? `<span class="tag on">Lần gần nhất: ${l.big} · ${last.d}</span>` : ''}</div>
    <p class="muted">Bài thích ứng 6–60 câu (10–20 phút): đi lần lượt Chữ → N5 → N4 → N3 → N2, đủ 6 kỹ năng gồm cả nghe. Tự dừng ở khối vượt trình độ và gợi ý giai đoạn nên học.</p>
    <div class="row"><button class="btn pri" data-a="ptStart">${l ? 'Làm lại' : 'Bắt đầu kiểm tra'}</button>${l ? '<button class="btn" data-a="ptView">Xem kết quả gần nhất</button>' : ''}</div>
  </div>`;
}
Object.assign(ACT, {
  ptStart() { ptStart(); if (route !== 'practice') go('practice'); else render(); window.scrollTo(0, 0); },
  ptAns(t) { ptAnswer(+t.dataset.i); render(); const n = $('#ptnext'); if (n) n.focus(); },
  ptNext() { ptNext(); render(); window.scrollTo(0, 0); },
  ptPlay() { const q = ptCur(); if (q) speak(q.q); },
  ptClose() { PT = null; render(); },
  ptApply() { const r = PT.res; const plan = ptPlan(r); S.set.decks = plan.decks; S.set.newPer = plan.newPer; save(); toast(`Đã áp dụng: ${plan.decks.length} bộ thẻ, ${plan.newPer} thẻ mới/ngày`); PT = null; go('review'); },
  ptView() { const last = (S.place || []).slice(-1)[0]; if (!last) return; PT = { done: true, res: last }; if (route !== 'practice') go('practice'); else render(); window.scrollTo(0, 0); },
});
document.addEventListener('keydown', e => {
  if (!PT || PT.done || route !== 'practice' || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (PT.pick == null && '1234'.includes(e.key)) { e.preventDefault(); ACT.ptAns({ dataset: { i: +e.key - 1 } }); }
  else if (PT.pick != null && e.key === 'Enter') { e.preventDefault(); ACT.ptNext(); }
});
