/* Tạo content-dm.json từ tài liệu khóa Dũng Mori (N3, N2) — chỉ dùng trên laptop của Sơn.
   Chạy: node tools/dm-build.js "F:/JLPT/Dung mori"
   Đọc chữ trong file Word (.docx), tách 問題 / đoạn văn / câu hỏi / 4 lựa chọn, ghép với bảng đáp án "回答" ở cuối file.
   File nào số đáp án không khớp số câu thì bỏ qua và in ra để kiểm tra (không đoán đáp án).
   Không chứa nội dung khóa học: chỉ có đường dẫn + cách đọc. File JSON tạo ra nằm trong thư mục tài liệu, không đưa lên GitHub. */
const fs = require('fs'), path = require('path'), zlib = require('zlib');

const ROOT = path.resolve(process.argv[2] || 'F:/JLPT/Dung mori');
const OUT = path.join(ROOT, 'content-dm.json');

/* ----- Đọc file zip/docx không cần thư viện ----- */
function unzip(buf) {
  const out = {}; let e = buf.length - 22; while (e > 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  let p = buf.readUInt32LE(e + 16); const n = buf.readUInt16LE(e + 10);
  for (let i = 0; i < n; i++) {
    const m = buf.readUInt16LE(p + 10), cs = buf.readUInt32LE(p + 20), fl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + fl).toString();
    out[name] = () => { const lf = buf.readUInt16LE(off + 26), lx = buf.readUInt16LE(off + 28), d = buf.slice(off + 30 + lf + lx, off + 30 + lf + lx + cs); return m === 8 ? zlib.inflateRawSync(d) : d; };
    p += 46 + fl + xl + cl;
  }
  return out;
}
// Chữ trong docx: bỏ furigana (w:rt), mỗi đoạn (w:p) một dòng
function docxLines(file) {
  let x = unzip(fs.readFileSync(file))['word/document.xml']().toString('utf8');
  x = x.replace(/<w:rt>[\s\S]*?<\/w:rt>/g, '')
    // chữ gạch chân hoặc tô màu (từ được hỏi trong đề, thường màu đỏ) → bọc 【】 để không mất khi bỏ định dạng
    .replace(/<w:r>|<w:r [^>]*>/g, '\u0003').replace(/\u0003([\s\S]*?)<\/w:r>/g, (all, r) => /<w:u w:val="(?!none)[^"]*"|<w:color w:val="(?!000000|auto)[^"]*"/i.test(r) ? r.replace(/(<w:t[^>]*>)([^<]*)(<\/w:t>)/g, '$1\u0001$2\u0002$3') : r)
    .replace(/\u0003/g, '').replace(/<\/w:p>/g, '\n').replace(/<w:tab\/>/g, ' ').replace(/<w:br[^>]*\/>/g, '\n');
  const t = x.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  const u = t.replace(/\u0002(\s*)\u0001/g, '$1').replace(/\u0001(\s*)\u0002/g, '$1').replace(/\u0001/g, '【').replace(/\u0002/g, '】').replace(/【(\s*)】/g, '$1');
  return u.normalize('NFC').split('\n').map(l => l.replace(/\s+$/, '')).filter(l => l.trim());
}

/* ----- Tìm file theo "đường dẫn logic" (bỏ thư mục phần tải N? Dũng Mori 2024-2026…-00X) ----- */
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(x => x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]);
const FILES = {};          // logic → đường dẫn thật (bản đầu tiên nếu trùng)
for (const f of walk(ROOT)) {
  const parts = path.relative(ROOT, f).normalize('NFC').split(path.sep);
  if (parts.length < 3) continue;
  const logic = parts.slice(1).join('/');
  if (!FILES[logic]) FILES[logic] = f;
}
const find = re => Object.keys(FILES).filter(k => re.test(k)).sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));

/* ----- Nhận dạng dòng ----- */
// fw: dạng để nhận cấu trúc (số/chữ toàn góc → thường, bỏ dấu 【】 của chữ tô màu)
const fw = s => s.replace(/[【】]/g, '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[ａ-ｚＡ-Ｚ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
// cân lại 【】 sau khi cắt chuỗi (bỏ dấu mồ côi); bọc cả dòng thì bỏ luôn
function balance(s) {
  let d = 0, out = '';
  for (const ch of s) { if (ch === '【') { d++; out += ch; } else if (ch === '】') { if (d) { d--; out += ch; } } else out += ch; }
  while (d-- > 0) out = out.replace(/【(?![\s\S]*【)/, '');
  return out.replace(/【\s*】/g, '').replace(/^【([^【】]*)】$/, '$1');
}
// phần chữ của dòng câu hỏi (bỏ "55." "1番:"), giữ 【】
const qText = l => balance(l.replace(/^[\s【】]*[0-9０-９]{1,3}[\s】]*(?:番|\.|．|、|　)?[\s】]*[:：.]?\s*/, ''));
const RX_HEAD = /^\s*問題\s*(\d+)\s*[:：]?\s*(.*)$/;
const RX_NUM = /^\s*(\d{1,3})\s*(?:番|\.|．|、|　)\s*[:：.]?\s*(.*)$/;   // "55." "1番:" "61　①…"
const RX_ANS = /^\s*(回答|解答|答え|đáp án|Đáp án)\s*[:：]?\s*$/i;
const isHead = l => RX_HEAD.test(fw(l));
const isNum = l => RX_NUM.test(fw(l));
const optClean = l => l.replace(/[【】]/g, '').replace(/^\s*(?:[①②③④]|[a-dA-D][\.．\)）:]|[1-4][\)）])\s*/, '').trim();

/* Tên dạng 問題 từ lời dẫn (theo cấu trúc đề của cấp) */
function kindOf(head, lv, no, seenParen) {
  const h = head;
  if (/問いに対する答え|後の問い|問いに答え/.test(h) && !/入る|入れる/.test(h)) return { R: true };
  if (/読み方|ひらがなで/.test(h)) return { K: '漢字読み' };
  if (/漢字で書く|どう書きますか|書くとき/.test(h)) return { K: '表記' };
  if (/意味が.*近い|同じ意味/.test(h)) return { K: '言い換え類義' };
  if (/使い方/.test(h)) return { K: '用法' };
  if (/★/.test(h)) return { K: '文の組み立て' };
  if (/文章全体|の中に入る|から.*の中に/.test(h)) return { K: '文章の文法' };
  if (/[（(]/.test(h)) {
    if (lv === 'N2') return { K: no === 3 ? '語形成' : no === 4 ? '文脈規定' : '文法形式の判断' };
    return { K: seenParen ? '文法形式の判断' : '文脈規定' };
  }
  return null;
}

/* ----- Tách một file thành nhóm 問題 → đoạn văn → câu hỏi ----- */
function parseDoc(lines, opt) {
  let ai = -1; lines.forEach((l, i) => { if (RX_ANS.test(fw(l).trim())) ai = i; });
  const body = ai >= 0 ? lines.slice(0, ai) : lines, ansLines = ai >= 0 ? lines.slice(ai + 1) : [];
  // đáp án: dòng chỉ có a/b/c/d (hoặc "5番 c"), chia theo tiêu đề "問題N" trong phần 回答 (nếu có)
  const answers = [], ansBy = {}; let cur = 'all';
  ansLines.forEach(l => {
    const s = fw(l).trim(), h = s.match(/^問題\s*(\d+)/); if (h) { cur = +h[1]; return; }
    const m = s.match(/^([a-dA-D])$/) || s.match(/^\d+\s*(?:番|\.)\s*([a-dA-D])$/);
    if (m) { const v = 'abcd'.indexOf(m[1].toLowerCase()) + 1; answers.push(v); (ansBy[cur] = ansBy[cur] || []).push(v); }
  });
  const groups = []; let g = null, pass = null, seenParen = false;
  const newGroup = (no, head) => {
    const k = opt.force || kindOf(head, opt.lv, no, seenParen) || { R: true };
    if (k.K && /[（(]/.test(head) && !/★|文章全体/.test(head)) seenParen = true;
    g = { no, head: head.trim(), K: k.K || null, type: k.type || opt.type || null, passages: [] }; groups.push(g); pass = null;
  };
  const newPass = () => { pass = { text: [], items: [] }; g.passages.push(pass); };
  /* Một dòng số là câu hỏi nếu sau nó (có thể thêm 1–3 dòng nối tiếp của câu hỏi, vd "B: …（ ）")
     có đúng 4 dòng lựa chọn rồi đến ranh giới. Trả về số dòng nối tiếp, hoặc -1 nếu không phải câu hỏi. */
  const bound = l => l === undefined || isHead(l) || isNum(l);
  const isQuestion = i => {
    for (let c = 0; c <= 3; c++) {
      let ok = true;
      for (let k = 1; k <= 4 + c; k++) { if (bound(body[i + k])) { ok = false; break; } }
      if (!ok) return -1;
      const nx = body[i + 5 + c];
      if (bound(nx) || (g && !g.K && c === 0)) return c;   // bài đọc: câu hỏi có thể đứng trước đoạn văn (情報検索)
    }
    return -1;
  };
  for (let i = 0; i < body.length; i++) {
    const l = body[i], L = fw(l), h = L.match(RX_HEAD);
    if (h) { if (opt.force && g && opt.passHead) { newPass(); pass.text.push(...(h[2].trim() ? [h[2].trim()] : [])); continue; } newGroup(+h[1], h[2]); continue; }
    if (!g) newGroup(0, opt.defHead || '');
    const m = L.match(RX_NUM), c = m && (g.K || m[2].trim()) ? isQuestion(i) : -1;   // bài đọc: "2." trơn = đánh dấu đoạn mới
    if (c >= 0) {
      if (!pass) newPass();
      const q = [qText(l), ...body.slice(i + 1, i + 1 + c).map(balance)].map(x => x.trim()).filter(Boolean).join('\n');
      const raw = [1, 2, 3, 4].map(k => body[i + c + k]);
      // lựa chọn nào tô màu (file đã đánh dấu đáp án) → dùng để kiểm tra chéo với bảng 回答
      const col = raw.filter(o => /【/.test(o)).length === 1 ? raw.findIndex(o => /【/.test(o)) + 1 : 0;
      pass.items.push({ n: +m[1], q, opts: raw.map(optClean), col });
      i += 4 + c; continue;
    }
    if (m && !m[2].trim() && !g.K) { newPass(); continue; }           // "1." = đánh dấu đoạn văn mới
    if (!pass || (pass.items.length && !g.K)) newPass();
    pass.text.push(balance(l.trim()));
  }
  // bài đọc mà câu hỏi đứng trước: đoạn có câu nhưng chưa có chữ + đoạn sau chỉ có chữ → gộp
  groups.forEach(x => {
    if (x.K) return;
    x.passages = x.passages.filter((p, i, a) => {
      const nx = a[i + 1];
      if (p.items.length && !p.text.length && nx && !nx.items.length && nx.text.length) { p.text = nx.text; nx.text = []; nx.gone = true; }
      return !p.gone;
    }).filter(p => !p.gone);
  });
  const items = groups.flatMap(x => x.passages.flatMap(p => p.items));
  if (process.env.DBG && opt.file && opt.file.includes(process.env.DBG)) {   // gỡ lỗi: in số câu tìm được theo nhóm
    groups.forEach(x => console.log(`  問題${x.no} ${x.K || 'R'}: ` + x.passages.map(p => `[${p.items.map(i => i.n).join(',')}]`).join(' ')));
    console.log('  đáp án:', JSON.stringify(ansBy));
  }
  return { groups, items, answers, ansBy };
}

/* ----- Gom kết quả thành bộ (set) cho app ----- */
// kiểm tra chéo: lựa chọn tô màu trong file (nếu có) phải trùng đáp án ở bảng 回答
const COL = { n: 0, bad: [] };
function chk(it, a, file) { if (it.col) { COL.n++; if (it.col !== a) COL.bad.push(`${file} câu ${it.n}: tô màu ${it.col}, bảng ${a}`); } return a; }
const RTYPE_N2 = { 10: '短文', 11: '中文', 12: '統合理解', 13: '長文', 14: '情報検索' };
const sets = [], report = [];
let sid = 0;
function addDoc(set, logic, opt) {
  const lines = docxLines(FILES[logic]);
  const { groups, items, answers, ansBy } = parseDoc(lines, { ...opt, file: logic });
  const short = logic.replace(/^N\d Dũng Mori 2024\//, '');
  /* Ghép đáp án: phần 回答 có chia "問題N" và đề có nhiều nhóm → so từng nhóm; nếu không → ghép theo thứ tự cả file.
     Kiểm tra: số câu = số đáp án, số thứ tự câu trong nhóm liên tục (bắt lỗi câu bị dán lặp / thiếu) */
  const byGroup = groups.length > 1 && !ansBy.all;
  const seqOk = its => its.every((it, k) => !k || it.n === its[k - 1].n + 1);
  const gItems = gr => gr.passages.flatMap(p => p.items);
  if (!byGroup && (!items.length || items.length !== answers.length || !groups.every(gr => seqOk(gItems(gr))))) { report.push(`BỎ  ${short}: ${items.length} câu, ${answers.length} đáp án`); return 0; }
  let ai = 0, n = 0, A = answers;
  groups.forEach(gr => {
    if (byGroup) {
      const its = gItems(gr), a = ansBy[gr.no] || [];
      if (!its.length) return;
      if (its.length !== a.length || !seqOk(its)) { report.push(`BỎ nhóm 問題${gr.no} trong ${short}: ${its.length} câu, ${a.length} đáp án${seqOk(its) ? '' : ', số câu không liên tục'}`); return; }
      A = a; ai = 0;
    }
    if (opt.only && !opt.only(gr)) { gr.passages.forEach(p => { ai += p.items.length; }); return; }
    if (gr.K) {   // từ vựng/ngữ pháp: cả nhóm 問題 là một "bài", lời dẫn + đoạn văn (nếu có) làm phần đọc
      const its = gr.passages.flatMap(p => p.items), text = [gr.head, ...gr.passages.flatMap(p => p.text)].filter(Boolean).join('\n');
      if (!its.length) return;
      if (!mdOf(set.lv, gr.K)) { report.push(`BỎ nhóm 問題${gr.no} (${gr.K}) trong ${short}: cấp ${set.lv} không có dạng này`); ai += its.length; return; }
      // bộ trộn nhiều dạng (300 câu khó): tách câu ★ và câu đồng nghĩa (có 【】, không có ngoặc trống) ra bài riêng
      const sub = it => !opt.mixed ? gr.K : /★/.test(it.q) ? '文の組み立て' : /【/.test(it.q) && !/[（(]\s*[）)]/.test(it.q) ? '言い換え類義' : gr.K;
      const HEAD = { '文の組み立て': '次の文の ★ に入る最もよいものを一つ選びなさい。', '言い換え類義': '【】の言葉に意味が最も近いものを一つ選びなさい。' };
      const runs = []; its.forEach(it => { const k = sub(it), r = runs[runs.length - 1]; if (r && r.k === k) r.its.push(it); else runs.push({ k, its: [it] }); });
      runs.forEach(r => {
        const pid = `${set.id}-p${set.passages.length + 1}`;
        set.passages.push({ pid, type: r.k, md: mdOf(set.lv, r.k), text: r.k === gr.K ? text : HEAD[r.k] });
        r.its.forEach((it, k) => { set.items.push({ id: `${pid}-${k + 1}`, pid, q: it.q || `（${it.n}）`, opts: [it.opts], ans: [chk(it, A[ai++], short)], nopt: 4 }); n++; });
      });
    } else {
      gr.passages.forEach(p => {
        if (!p.items.length) return;
        const type = opt.type || RTYPE_N2[gr.no] || '中文';
        const pid = `${set.id}-p${set.passages.length + 1}`;
        set.passages.push({ pid, type, text: p.text.join('\n') });
        p.items.forEach((it, k) => { set.items.push({ id: `${pid}-${k + 1}`, pid, q: it.q, opts: [it.opts], ans: [chk(it, A[ai++], short)], nopt: 4 }); n++; });
      });
    }
  });
  report.push(`OK  ${short}: ${n} câu`);
  return n;
}
// md của dạng trong cấu trúc đề (giống src/data.js)
const MD = {
  N3: { '漢字読み': 1, '表記': 2, '文脈規定': 3, '言い換え類義': 4, '用法': 5, '文法形式の判断': 6, '文の組み立て': 7, '文章の文法': 8 },
  N2: { '漢字読み': 1, '表記': 2, '語形成': 3, '文脈規定': 4, '言い換え類義': 5, '用法': 6, '文法形式の判断': 7, '文の組み立て': 8, '文章の文法': 9 },
  N4: { '漢字読み': 1, '表記': 2, '文脈規定': 3, '言い換え類義': 4, '用法': 5, '文法形式の判断': 6, '文の組み立て': 7, '文章の文法': 8 },
  N5: { '漢字読み': 1, '表記': 2, '文脈規定': 3, '言い換え類義': 4, '文法形式の判断': 5, '文の組み立て': 6, '文章の文法': 7 },
};
const mdOf = (lv, name) => (MD[lv] || {})[name];
function newSet(lv, title, unit) { const s = { id: 'dm' + (++sid), kind: 'R', src: 'dm-', unit, lv, title, passages: [], items: [] }; sets.push(s); return s; }
const done = s => { if (!s.items.length) sets.splice(sets.indexOf(s), 1); };

/* ===== N2: 3 đề thi thử (Chặng 3) — phần đọc (問題10–14) và từ vựng/ngữ pháp (問題1–9) ===== */
[1, 2, 3].forEach(k => {
  const docs = find(new RegExp(`^N2 Dũng Mori 2024/Chặng 3/Thi thử JLPT${k}/.*\\.docx$`));
  const head1 = d => fw(docxLines(FILES[d])[0] || '');
  const R = docs.find(d => /問題\s*10/.test(head1(d)) || /問題\s*10/.test(fw(docxLines(FILES[d]).slice(0, 3).join(' '))));
  const K = docs.find(d => /問題\s*1\s*[:：]?\s*_*.*読み方/.test(head1(d)));
  if (R) { const s = newSet('N2', `Dũng Mori · Thi thử ${k} · Đọc hiểu`, 10 + k); addDoc(s, R, { lv: 'N2' }); done(s); }
  if (K) { const s = newSet('N2', `Dũng Mori · Thi thử ${k} · Từ vựng–Ngữ pháp`, 20 + k); addDoc(s, K, { lv: 'N2' }); done(s); }
});

/* ===== N3 ===== */
// Đọc hiểu: 4 file theo dạng
{
  const s = newSet('N3', 'Dũng Mori · Đề thi JLPT đọc hiểu', 1);
  find(/^N3 Dũng Mori 2024\/Chặng 3\/1\. Luyện đề\/Đề thi JLPT đọc hiểu\/.*\.docx$/).forEach(d => {
    const type = ['短文', '中文', '長文', '情報検索'].find(t => d.includes(t));
    addDoc(s, d, { lv: 'N3', type, force: { R: true }, passHead: true });
  });
  done(s);
}
// Từ vựng/ngữ pháp theo dạng: mỗi thư mục một bộ, mỗi đề một bài
const N3K = [['Đọc chữ hán', '漢字読み'], ['Tìm chữ hán đúng', '表記'], ['Điền vào chỗ trônga', '文脈規定'], ['Tìm từ đồng nghĩa', '言い換え類義'], ['Đặt câu với từ cho sẵn', '用法'],
  ['Ngữ pháp điền vào chỗ trống', '文法形式の判断'], ['Ngữ pháp ghép câu', '文の組み立て'], ['Ngữ pháp đục lỗ', '文章の文法']];
N3K.forEach(([dir, name], k) => {
  const s = newSet('N3', `Dũng Mori · Luyện đề · ${name}`, 10 + k);
  find(new RegExp(`^N3 Dũng Mori 2024/Chặng 3/1\\. Luyện đề/${dir}/.*\\.docx$`)).forEach(d => addDoc(s, d, { lv: 'N3', force: { K: name } }));
  done(s);
});
{
  const s = newSet('N3', 'Dũng Mori · 300 câu ngữ pháp khó', 30);
  find(/^N3 Dũng Mori 2024\/Chặng 3\/300 câu khó\/.*\.docx$/).forEach(d => addDoc(s, d, { lv: 'N3', force: { K: '文法形式の判断' }, mixed: true }));
  done(s);
}
find(/^N3 Dũng Mori 2024\/Chặng 3\/Bài thi đánh giá\/.*\.docx$/).forEach((d, k) => {
  const s = newSet('N3', `Dũng Mori · Đề tổng khóa ${k + 1} · Từ vựng–Ngữ pháp`, 40 + k); addDoc(s, d, { lv: 'N3' }); done(s);
});

/* Nghe N3: chỉ những đề có đáp án dạng chữ "đáp án 2-3-1-…"; mỗi câu một file MP3 */
function listenSet(lv, md, title, unit, dirRe, mp3Re) {
  const docs = find(new RegExp(dirRe.source + '.*\\.docx$'));
  docs.forEach(d => {
    const txt = docxLines(FILES[d]).join('\n'), m = txt.match(/đáp án\s*[:：]?\s*([1-4](?:\s*-\s*[1-4])+)/i);
    const dir = d.slice(0, d.lastIndexOf('/'));
    if (!m) { report.push(`BỎ  ${dir}: không có đáp án dạng chữ`); return; }
    const ans = m[1].split('-').map(x => +x.trim());
    const mp3 = find(new RegExp('^' + dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/.*\\.mp3$', 'i'))
      .map(f => ({ f, n: +((f.match(mp3Re) || [])[1] || 0) })).sort((a, b) => a.n - b.n);
    if (mp3.length !== ans.length) { report.push(`BỎ  ${dir}: ${mp3.length} file nghe, ${ans.length} đáp án`); return; }
    const s = { id: 'dm' + (++sid), kind: 'L', src: 'dm-', unit, lv, md, title: `${title} (${mp3[0].n}–${mp3[mp3.length - 1].n})`, items: [] };
    mp3.forEach((x, i) => s.items.push({ id: `${s.id}-${i + 1}`, n: x.n, q: '', ans: [ans[i]], nopt: 3, audio: x.f }));
    sets.push(s); report.push(`OK  ${dir}: ${s.items.length} câu nghe`);
  });
}
listenSet('N3', 4, 'Dũng Mori · Nghe 発話表現', 50, /^N3 Dũng Mori 2024\/Chặng 2\/Nghe Hiểu\/Mondai 4\//, /md4-(\d+)\.mp3$/i);
listenSet('N3', 5, 'Dũng Mori · Nghe 即時応答', 51, /^N3 Dũng Mori 2024\/Chặng 2\/Nghe Hiểu\/Mondai 5\//, /(\d+)\)?\.mp3$/i);

/* ===== N4: "Test tổng hợp" Bài 26–50 (file Word). Đáp án ghi "(Đúng)" cạnh lựa chọn đúng.
   問題1 Chữ Hán → 漢字読み; 問題2 Ngữ pháp → 文法形式の判断. Chỗ trống trong đề đã điền sẵn đáp án bằng chữ xanh lá → đổi thành （　）.
   (Bộ mới thêm SAU các bộ cũ để id bộ cũ không đổi — tiến độ đã làm vẫn khớp.) ===== */
function testLines(file) {      // như docxLines nhưng chỉ đánh dấu chữ xanh lá (3c763d = đáp án điền sẵn)
  let x = unzip(fs.readFileSync(file))['word/document.xml']().toString('utf8');
  x = x.replace(/<w:rt>[\s\S]*?<\/w:rt>/g, '')
    .replace(/<w:r>|<w:r [^>]*>/g, '\u0003').replace(/\u0003([\s\S]*?)<\/w:r>/g, (all, r) => /<w:color w:val="3c763d"/i.test(r) ? r.replace(/(<w:t[^>]*>)([^<]*)(<\/w:t>)/g, '$1\u0001$2\u0002$3') : r)
    .replace(/\u0003/g, '').replace(/<\/w:p>/g, '\n').replace(/<w:tab\/>/g, ' ').replace(/<w:br[^>]*\/>/g, '\n');
  const t = x.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  return t.replace(/\u0002(\s*)\u0001/g, '$1').normalize('NFC').split('\n').map(l => l.replace(/\s+$/, '')).filter(l => l.trim());
}
const OPT = /^\s*([1-4])\s*[\.．]\s*(.*)$/;
function parseTest(lines) {
  const parts = { 1: [], 2: [] }; let part = 0, buf = [], skip = { noAns: 0, leak: 0 };
  for (let i = 0; i < lines.length; i++) {
    const l = fw(lines[i]);
    const h = l.match(/問題\s*([12])\s*[:：]?\s*(Test|Ngữ|Chữ)/i);
    if (h) { part = +h[1]; buf = []; continue; }
    if (!part) continue;
    const win = [0, 1, 2, 3].map(k => (fw(lines[i + k] || '').match(OPT) || [])[1]);
    if (win.join('') !== '1234') { buf.push(lines[i]); continue; }
    // 4 dòng lựa chọn bắt đầu ở i; câu hỏi = các dòng gom được từ sau câu trước
    const raw = [0, 1, 2, 3].map(k => lines[i + k].replace(/^\s*[1-4１-４]\s*[\.．]\s*/, ''));
    i += 3;
    const q0 = buf.join('\n'); buf = [];
    const ok = raw.map((o, k) => /\(\s*Đúng\s*\)/i.test(o) ? k + 1 : 0).filter(Boolean);
    const opts = raw.map(o => o.replace(/\(\s*(Đúng|Sai)\s*\)/gi, '').replace(/[\u0001\u0002]/g, '').trim());
    const m = fw(q0).match(/^\s*(\d{1,2})\s*[\.．、　 ]/);
    if (ok.length !== 1 || !m) { skip.noAns++; continue; }
    let q = q0.replace(/^\s*[0-9０-９]{1,2}\s*[\.．、]?\s*/, '').replace(/^[\s　]+/, '');
    if (part === 2) {
      if (/\u0001/.test(q)) q = q.replace(/\u0001[^\u0002]*\u0002/g, '（　）');
      else if (q.includes(opts[ok[0] - 1].replace(/。$/, ''))) { skip.leak++; continue; }   // đáp án nằm sẵn trong câu, không có dấu để xóa → bỏ
    } else q = q.replace(/\u0001([^\u0002]*)\u0002/g, '【$1】');
    q = q.replace(/[\u0001\u0002]/g, '').replace(/[ 　]{3,}/g, '　').trim();
    parts[part].push({ n: +m[1], q, opts, ans: ok[0] });
  }
  return { parts, skip };
}
{
  const HEAD = { 1: '＿＿のことばの読み方として最もよいものを、1・2・3・4から一つえらびなさい。', 2: '（　）に何を入れますか。1・2・3・4から いちばん いいものを 一つ えらんでください。' };
  const KIND = { 1: '漢字読み', 2: '文法形式の判断' };
  const sK = newSet('N4', 'Dũng Mori · Test tổng hợp · Chữ Hán', 60), sG = newSet('N4', 'Dũng Mori · Test tổng hợp · Ngữ pháp', 61);
  find(/^N4 Dũng Mori 2024\/01\. Bài giảng\/Bài \d+\/Test tổng hợp\.docx$/i).forEach(d => {
    const bai = d.match(/Bài (\d+)/)[1], { parts, skip } = parseTest(testLines(FILES[d]));
    [[1, sK], [2, sG]].forEach(([p, s]) => {
      const its = parts[p]; if (!its.length) return;
      const pid = `${s.id}-p${s.passages.length + 1}`;
      s.passages.push({ pid, type: KIND[p], md: mdOf('N4', KIND[p]), text: `Bài ${bai}\n${HEAD[p]}` });
      its.forEach((it, k) => s.items.push({ id: `${pid}-${k + 1}`, pid, q: it.q, opts: [it.opts], ans: [it.ans], nopt: 4 }));
    });
    report.push(`${skip.noAns || skip.leak ? 'OK*' : 'OK '} N4 Test tổng hợp Bài ${bai}: chữ Hán ${parts[1].length}, ngữ pháp ${parts[2].length}${skip.noAns ? `, bỏ ${skip.noAns} câu không rõ đáp án` : ''}${skip.leak ? `, bỏ ${skip.leak} câu lộ đáp án` : ''}`);
  });
  done(sK); done(sG);
}

/* ===== N5: đề Thi thử có bản "Đáp án" (PDF in từ web, lựa chọn đúng ghi "(Đúng)").
   Chỉ lấy câu chữ Hán / từ vựng / ngữ pháp (có đủ 4 lựa chọn); phần đọc hiểu có tranh, bảng → bỏ. ===== */
function n5Kind(head, sec) {
  if (/ひらがなで/.test(head)) return '漢字読み';
  if (/どう\s*かきますか|どう\s*書きますか/.test(head)) return '表記';
  if (/おなじ\s*いみ|同じ\s*意味/.test(head)) return '言い換え類義';
  if (/★/.test(head)) return '文の組み立て';
  if (/「\s*\d+\s*」\s*から/.test(head)) return null;            // 文章の文法 (cần cả đoạn văn) → bỏ
  if (/[（(]\s*[）)]/.test(head)) return sec === 'V' ? '文脈規定' : '文法形式の判断';
  if (/読んで|よんで/.test(head)) return null;                    // đọc hiểu → bỏ
  return undefined;                                                  // không rõ → đoán theo câu hỏi
}
function parseN5(lines) {
  const L = lines.filter(l => !/^(https?:|\d+\/\d+\/20\d\d|\d+\/\d+$|\(?\s*もじ|げんごちしき|[（(]もじ)/.test(l.trim()));
  const qs = []; let kind, sec = 'V', lastHead = 0;
  const qStart = l => fw(l).match(/^\s*(\d{1,2})\s*[\.．]?\s*(\S.*)$/);
  const isKana = s => /^[぀-ゟ\s]{1,10}$/.test(s.replace(/[【】]/g, ''));   // dòng furigana rơi ra ngoài
  const qLike = s => /[（(]\s*[）)]|＿|★|[:：]/.test(s);
  for (let i = 0; i < L.length; i++) {
    const h = fw(L[i]).match(/^\s*(?:もんだい|問題)\s*(\d)\s*(.*)$/);
    if (h) {
      if (+h[1] <= lastHead && sec === 'V') sec = 'G';               // もんだい１ lần 2 → sang phần ngữ pháp
      lastHead = +h[1]; kind = n5Kind(h[2] + ' ' + (L[i + 1] || ''), sec); continue;
    }
    const m = qStart(L[i]); if (!m || /^\d{1,2}\s*[\.．]\s*$/.test(fw(L[i]))) continue;
    // khối của câu: đến câu/tiêu đề kế tiếp
    let j = i + 1; while (j < L.length && !qStart(L[j]) && !/^\s*(もんだい|問題)/.test(L[j])) j++;
    const blk = L.slice(i, j), d = blk.map((l, k) => /\(\s*Đúng\s*\)/.test(l) ? k : -1).filter(k => k >= 0);
    const k0 = d.length === 1 ? [d[0] - 3, d[0] - 2, d[0] - 1, d[0]].find(s => s >= 1 && s + 3 < blk.length &&
      blk.slice(s, s + 4).every(o => !qLike(o) && o.length <= 40) && (s === 1 || qLike(blk[s - 1]) || /、$/.test(blk[s - 2] || '')) &&
      !(s === 1 && /、\s*$/.test(blk[0]))) : undefined;   // câu hỏi kết thúc bằng "、" → dòng sau là phần còn lại của câu, chưa phải lựa chọn
    const qText = [m[2], ...(k0 !== undefined ? blk.slice(1, k0) : [])].filter(s => !isKana(s)).join('\n').trim();
    const kd = kind !== undefined ? kind : /★/.test(qText) ? '文の組み立て' : /[（(]\s*[）)]/.test(qText) ? '文法形式の判断' : null;
    i = j - 1;
    if (!kd) continue;
    if (k0 === undefined) { qs.push({ bad: true }); continue; }
    const opts = blk.slice(k0, k0 + 4).map(o => o.replace(/\(\s*Đúng\s*\)/, '').replace(/[【】]/g, '').trim());
    qs.push({ n: +m[1], kind: kd, q: qText, opts, ans: d[0] - k0 + 1 });
  }
  return qs;
}
async function addN5() {
  const { pdfLines } = require('./pdf-lines');
  const SRC = [[1, /Thi thử JLPT 1\/.*Đọc Hiểu - Đáp án\.pdf$/i, 'Ngữ pháp'], [2, /Thi thử JLPT 2\/.*Chữ hán - Đáp án\.pdf$/i, 'Từ vựng–Ngữ pháp']];
  const HEAD = { '漢字読み': '＿＿の ことばは ひらがなで どう かきますか。', '表記': '＿＿の ことばは どう かきますか。', '文脈規定': '（　）に なにを いれますか。',
    '言い換え類義': '＿＿の ぶんと だいたい おなじ いみの ぶんは どれですか。', '文法形式の判断': '（　）に 何を 入れますか。', '文の組み立て': '★ に 入る ものは どれですか。' };
  for (const [k, re, name] of SRC) {
    const f = find(new RegExp('^N5 Dũng Mori 2024/Đề thi/' + re.source, 'i'))[0];
    if (!f) { report.push(`BỎ  N5 Thi thử ${k}: không thấy file đáp án`); continue; }
    const qs = parseN5((await pdfLines(FILES[f])).flat()), bad = qs.filter(q => q.bad).length, good = qs.filter(q => !q.bad);
    const s = newSet('N5', `Dũng Mori · Thi thử ${k} · ${name}`, 70 + k);
    good.forEach(q => {
      let p = s.passages[s.passages.length - 1];
      if (!p || p.type !== q.kind) { p = { pid: `${s.id}-p${s.passages.length + 1}`, type: q.kind, md: mdOf('N5', q.kind), text: HEAD[q.kind] }; s.passages.push(p); }
      s.items.push({ id: `${p.pid}-${s.items.filter(x => x.pid === p.pid).length + 1}`, pid: p.pid, q: q.q, opts: [q.opts], ans: [q.ans], nopt: 4 });
    });
    report.push(`OK  N5 Thi thử ${k} (${name}): ${good.length} câu${bad ? `, bỏ ${bad} câu không tách được lựa chọn` : ''}`);
    done(s);
  }
}

/* ----- Ghi file ----- */
(async () => {
await addN5();
const content = { v: 2, slot: 'dm', name: 'Dũng Mori (N5–N2)', sets, exams: [] };
fs.writeFileSync(OUT, JSON.stringify(content));
report.forEach(r => console.log(r));
console.log(`
Kiểm tra chéo lựa chọn tô màu: ${COL.n} câu, lệch ${COL.bad.length}`); COL.bad.slice(0, 15).forEach(b => console.log('  LỆCH', b));
const by = {}; sets.forEach(s => { const k = s.lv + ' ' + (s.kind === 'L' ? 'nghe' : s.passages.some(p => p.md) ? 'từ vựng–ngữ pháp' : 'đọc'); by[k] = (by[k] || 0) + s.items.length; });
console.log('\nTỔNG:', Object.entries(by).map(([k, v]) => `${k}: ${v} câu`).join(' · '), `· ${sets.length} bộ · ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB → ${OUT}`);
})();
