/* Tạo content-n3de.json từ file "FULL - 26 DE - 日本語能力試験N3.pdf" (26 đề luyện N3, chỉ có 文字・語彙・文法・読解, không có nghe).
   Chạy: node tools/n3de-build.js "F:/JLPT/FULL - 26 DE - 日本語能力試験N3.pdf"
   Mỗi đề: bài 1 (文字・語彙, 問題Ⅰ–Ⅴ) + bài 2 (文法・読解, 問題Ⅰ–Ⅶ) + bảng 解答.
   Ghép đáp án theo từng 問題; nhóm nào số câu ≠ số đáp án, số câu không liên tục, đáp án ngoài 1–4 hoặc trùng đề trước thì bỏ (không đoán).
   File JSON ghi vào thư mục N3_26_DE cạnh file PDF, không đưa lên GitHub. */
const fs = require('fs'), path = require('path');
const { pdfLines } = require('./pdf-lines');
const PDF = path.resolve(process.argv[2] || 'F:/JLPT/FULL - 26 DE - 日本語能力試験N3.pdf');
const OUT = path.join(path.dirname(PDF), 'N3_26_DE', 'content-n3de.json');   // thư mục nhỏ riêng → nhập nhanh
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const fw = s => s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const ROMAN = { 'Ⅰ': 1, 'Ⅱ': 2, 'Ⅲ': 3, 'Ⅳ': 4, 'Ⅴ': 5, 'Ⅵ': 6, 'Ⅶ': 7, I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
const secNo = s => ROMAN[s] || +s;
const NO = '(VII|VI|IV|V|III|II|I|[ⅠⅡⅢⅣⅤⅥⅦ]|[1-7])(?![A-Za-z\\d例])';   // số La Mã (cả chữ thường I, II…) hoặc số
const RX_SEC = new RegExp(`^問題\\s*${NO}\\s*(?:[（(]\\s*\\d+\\s*[）)])?\\s*[：:]?(.*)$`);
const RX_SUB = new RegExp(`^問題\\s*${NO}\\s*[（(]\\s*(\\d+)\\s*[）)]`);
const RX_KEYH = new RegExp(`^問題\\s*${NO}`);
const RX_Q = /^[［\[「｢]\s*(\d[\d\s]*?)\s*[］\]」｣]\s*(.*)$/;   // [14] ［14］ 「14」 ｢14｣ "[ 1 4 ]"
const RX_OPT = /^[①②③④]/;
const NOISE = /^(\d+|N\s*3\s*-\s*\d+.*|団体名.*|企業名.*|名前.*|・読解|言語知識（文字・語彙・文法）)$/;
// cấu trúc N3 (giống src/data.js): bài 1 問題1–5 → md 1–5; bài 2 問題1–3 → md 6–8, 問題4–7 → bài đọc
const KNAME = { 1: '漢字読み', 2: '表記', 3: '文脈規定', 4: '言い換え類義', 5: '用法', 6: '文法形式の判断', 7: '文の組み立て', 8: '文章の文法' };
const RTYPE = { 4: '短文', 5: '中文', 6: '長文', 7: '情報検索' };

// tách các lựa chọn trong một dòng "① a ② b ③ c ④ d"
const splitOpts = s => s.split(/[①②③④]/).slice(1).map(x => x.trim());

function parse(lines) {
  const tests = []; let T = null, G = null, P = null, key = null, kGroup = null;
  const newTest = () => { T = { body: [], key: [], kmap: { 1: {}, 2: {} } }; tests.push(T); key = null; G = null; };
  const newGroup = (paper, sec, head) => { G = { paper, sec, head, passages: [] }; T.body.push(G); P = null; };
  const newPass = () => { P = { text: [], items: [] }; G.passages.push(P); };
  let paper = 1;
  for (let i = 0; i < lines.length; i++) {
    const l = fw(lines[i]).trim();
    if (/文字・語彙）/.test(l) && /分/.test(l) && !/・文法）/.test(l)) { newTest(); paper = 1; continue; }
    if (/（文法）/.test(l) && /読解/.test(l) && (/分/.test(l) || (!key && T && T.body.some(g => g.paper === 1)))) { if (!T) newTest(); paper = 2; key = null; G = null; continue; }
    if (/^(日本語能力試験.*)?解答$/.test(l)) { if (T) { key = { paper: 1, labels: null }; kGroup = null; } continue; }
    if (!T) continue;
    if (key) {   // bảng đáp án: dòng số câu "[1] [2] …" rồi dòng đáp án "3 2 4 …" ngay dưới → ghép theo số câu
      if (/文法/.test(l) && /読解|文法）/.test(l)) { key.paper = 2; continue; }
      if (/文字・語彙/.test(l)) { key.paper = 1; continue; }
      const h = l.match(RX_KEYH);
      // tiêu đề 問題 có lời dẫn (không phải dòng điểm "8 x 2 (16 点)") → đã sang đề mới mà thiếu dòng tiêu đề
      if (h && !/点|x/.test(l) && /[：:]|読み方/.test(l)) { key = null; if (/読み方/.test(l)) { newTest(); paper = 1; } }
      else {
        if (/[\]］]/.test(l)) {
          const nums = [...l.matchAll(/(\d[\d ]*?)\s*[\]］]/g)].map(m => +m[1].replace(/\s/g, ''));
          if (nums[0] === 1 && T.kmap[key.paper][1]) key.paper = 2;     // số câu bắt đầu lại từ 1 → bài 2
          key.labels = nums; continue;
        }
        if (key.labels && /^[\d\s]+$/.test(l)) {
          const a = l.split(/\s+/).map(Number);
          if (a.length === key.labels.length) key.labels.forEach((n, k) => { T.kmap[key.paper][n] = a[k]; });
          else key.labels.forEach(n => { T.kmap[key.paper][n] = -1; });   // lệch số lượng → đánh dấu lỗi
          key.labels = null;
        }
        continue;
      }
    }
    if (NOISE.test(l)) continue;
    const sub = l.match(RX_SUB), sec = l.match(RX_SEC);
    if (sub && G && G.sec === secNo(sub[1])) { newPass(); const rest = l.replace(RX_SUB, '').replace(/^\s*[：:]?/, '').trim(); if (rest) P.text.push(rest); continue; }
    if (sec && secNo(sec[1]) === 1 && /読み方/.test(l) && T.body.length) { newTest(); paper = 1; }
    if (sec && secNo(sec[1]) === 1 && paper === 1 && T.body.some(g => g.paper === 1 && g.sec >= 4)) paper = 2;
    if (sec) { newGroup(paper, secNo(sec[1]), sec[2].trim()); if (sub) newPass(); continue; }
    if (!G) continue;
    const q = l.match(RX_Q);
    // dòng "[n] …" là câu hỏi nếu trong 4 dòng tới có dòng lựa chọn trước khi gặp câu khác (hoặc lựa chọn ngay trên dòng)
    const isQ = q && (/①.*②/.test(q[2]) || lines.slice(i + 1, i + 5).map(x => fw(x).trim()).findIndex(x => RX_OPT.test(x)) > -1 &&
      lines.slice(i + 1, i + 5).map(x => fw(x).trim()).findIndex(x => RX_OPT.test(x)) < (lines.slice(i + 1, i + 5).map(x => fw(x).trim()).findIndex(x => RX_Q.test(x)) + 1 || 99));
    if (isQ) {
      if (!P || (P.items.length && P.items[P.items.length - 1].opts.length >= 4 && P.after)) newPass();
      // lựa chọn ngay trên dòng câu hỏi chỉ khi có cả ① và ② ("①…とあるが" là ký hiệu chỗ gạch chân, không phải lựa chọn)
      const inl = /①.*②/.test(q[2]), pre = inl ? q[2].slice(0, q[2].indexOf('①')).trim() : q[2].trim();
      const it = { n: +q[1].replace(/\s/g, ''), q: pre ? [pre] : [], opts: inl ? splitOpts(q[2].slice(q[2].indexOf('①'))) : [] };
      P.items.push(it); P.cur = it; P.after = false; continue;
    }
    if (RX_OPT.test(l) && P && P.cur && P.cur.opts.length < 4) { P.cur.opts.push(...splitOpts(l)); continue; }
    if (P && P.cur && !P.cur.opts.length) { P.cur.q.push(l); continue; }          // câu hỏi dài nhiều dòng
    if (!P) newPass();
    if (P.items.length && G.paper === 2 && G.sec >= 4) P.after = true;          // chữ sau câu hỏi: đoạn mới (hoặc bảng của 情報検索)
    if (P.after && P.items.length) { newPass(); }
    P.text.push(l);
  }
  // bài đọc mà câu hỏi đứng trước đoạn văn: đoạn có câu nhưng chưa có chữ + đoạn sau chỉ có chữ → gộp
  tests.forEach(t => t.body.forEach(g => {
    g.passages = g.passages.filter((p, i, a) => {
      const nx = a[i + 1];
      if (p.items.length && !p.text.length && nx && !nx.items.length && nx.text.length) { p.text = nx.text; nx.gone = true; }
      return !p.gone && (p.items.length || p.text.length);
    });
  }));
  if (process.env.DBG) tests.forEach((t, i) => { if (String(i + 1) === process.env.DBG) console.log('  bảng:', JSON.stringify(t.kmap)); if (String(i + 1) !== process.env.DBG) return; t.body.forEach(g => console.log(`  bài${g.paper} 問題${g.sec}: ` + g.passages.map(p => `[${p.items.map(x => x.n + (x.opts.length === 4 ? '' : '(' + JSON.stringify(x.opts).slice(0, 160) + ')')).join(',')}]`).join(' '))); t.key.forEach(k => console.log(`  đáp án bài${k.paper} 問題${k.sec}: ${k.ans.join('')}`)); });
  return tests;
}

(async () => {
  const pages = await pdfLines(PDF);
  const tests = parse(pages.flat());
  const sets = [], report = [], seen = new Set();
  let total = { K: 0, R: 0 }, sid = 0;
  tests.forEach((t, ti) => {
    const no = ti + 1;
    const K = { id: 'n3de' + (++sid), kind: 'R', src: 'n3de-', unit: no, lv: 'N3', title: `26 đề N3 · Đề ${no} · Từ vựng–Ngữ pháp`, passages: [], items: [] };
    const R = { id: 'n3de' + (++sid), kind: 'R', src: 'n3de-', unit: 100 + no, lv: 'N3', title: `26 đề N3 · Đề ${no} · Đọc hiểu`, passages: [], items: [] };
    const okG = [], badG = [];
    t.body.forEach(g => {
      const its = g.passages.flatMap(p => p.items), kg = { ans: its.map(x => t.kmap[g.paper][x.n]) }, name = `${g.paper === 1 ? '文字語彙' : '文法読解'} 問題${g.sec}`;
      if (!its.length) return;
      const why = kg.ans.some(a => a === undefined) ? 'thiếu đáp án' : kg.ans.some(a => a === -1) ? 'bảng đáp án lệch số câu'
        : !its.every((x, k) => !k || x.n === its[k - 1].n + 1) ? 'số câu không liên tục'
        : !kg.ans.every(a => a >= 1 && a <= 4) ? 'đáp án ngoài 1–4' : !its.every(x => x.opts.length === 4) ? 'thiếu lựa chọn' : '';
      if (why) { badG.push(`${name} (${why})`); return; }
      const sig = its.map(x => x.q.join('') + x.opts.join('')).join('|');
      if (seen.has(sig)) { badG.push(`${name} (trùng đề trước)`); return; }
      seen.add(sig);
      const md = g.paper === 1 ? g.sec : g.sec <= 3 ? g.sec + 5 : 0;
      let ai = 0;
      if (md) {
        const pid = `${K.id}-p${K.passages.length + 1}`;
        K.passages.push({ pid, type: KNAME[md], md, text: [g.head, ...g.passages.flatMap(p => p.text)].filter(Boolean).join('\n') });
        its.forEach((x, k) => K.items.push({ id: `${pid}-${k + 1}`, pid, q: x.q.join('\n') || `（${x.n}）`, opts: [x.opts], ans: [kg.ans[ai++]], nopt: 4 }));
        total.K += its.length;
      } else {
        g.passages.forEach(p => {
          if (!p.items.length) return;
          if (p.text.join('').length < 40) { badG.push(`${name} (${p.items.length} câu mất đoạn văn)`); ai += p.items.length; total.R -= p.items.length; return; }
          const pid = `${R.id}-p${R.passages.length + 1}`;
          R.passages.push({ pid, type: RTYPE[g.sec], text: p.text.join('\n') });
          p.items.forEach((x, k) => R.items.push({ id: `${pid}-${k + 1}`, pid, q: x.q.join('\n'), opts: [x.opts], ans: [kg.ans[ai++]], nopt: 4 }));
        });
        total.R += its.length;
      }
      okG.push(name);
    });
    [K, R].forEach(s => { if (s.items.length) sets.push(s); });
    report.push(`Đề ${no}: lấy ${okG.length} nhóm (${K.items.length + R.items.length} câu)${badG.length ? ' · BỎ ' + badG.join(', ') : ''}`);
  });
  fs.writeFileSync(OUT, JSON.stringify({ v: 2, slot: 'n3de', name: '26 đề luyện N3', sets, exams: [] }));
  report.forEach(r => console.log(r));
  console.log(`\nTỔNG: ${tests.length} đề · từ vựng–ngữ pháp ${total.K} câu · đọc hiểu ${total.R} câu · ${sets.length} bộ · ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB → ${OUT}`);
})();
