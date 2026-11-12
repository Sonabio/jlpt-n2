/* Tạo content-n4de.json từ thư mục "N4_ĐỀ CÁC NĂM" (12 đề N4 thật 2010 → 7/2026 + Luyện đề N4-01) — chỉ dùng trên laptop của Sơn.
   Chạy: node tools/n4de-build.js "F:/JLPT/N4_ĐỀ CÁC NĂM-…/N4_ĐỀ CÁC NĂM"
   - Đáp án: file "ĐÁP ÁN JLPT N4 (…).pdf" (mỗi trang 1 đề, theo thứ tự thư mục 1 → 12) và "LĐ N4-01/ĐÁP ÁN LĐ N4 - 01.pdf".
     Đọc theo vị trí chữ: hàng số câu + hàng đáp án ngay dưới, nhãn 問題 nằm giữa → câu nào thuộc 問題 nào.
   - Đáp án nghe được so với "正解" trong script (script nào có chữ); lệch thì in ra, không ghi đề đó.
   - Trang của từng 問題 trong PDF đề: tìm chữ "問題 N" (chỉ để mở đúng trang).
   File JSON tạo ra nằm trong thư mục tài liệu, không đưa lên GitHub. */
const fs = require('fs'), path = require('path');
const V = path.join(__dirname, '..', 'public', 'vendor', 'pdfjs');
const pdfjs = require(path.join(V, 'pdf.min.js'));
pdfjs.GlobalWorkerOptions.workerSrc = path.join(V, 'pdf.worker.min.js');

const ROOT = path.resolve(process.argv[2] || '.');
const BASE = path.basename(ROOT);                       // "N4_ĐỀ CÁC NĂM" — đường dẫn trong JSON bắt đầu bằng tên này
const OUT = path.join(ROOT, 'content-n4de.json');
const rel = f => BASE + '/' + path.relative(ROOT, f).replace(/\\/g, '/');
const hw = s => s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));   // số toàn góc → thường

async function openPdf(f) { return pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(f)), cMapUrl: V + '/cmaps/', cMapPacked: true, verbosity: 0 }).promise; }
// các dòng của 1 trang: [{ y, t: [{ s, x }] }] từ trên xuống
async function pageLines(doc, n) {
  const tc = await (await doc.getPage(n)).getTextContent();
  const it = tc.items.filter(i => i.str.trim()).map(i => ({ s: hw(i.str.trim()), x: i.transform[4], y: i.transform[5] })).sort((a, b) => b.y - a.y || a.x - b.x);
  const L = []; it.forEach(i => { const l = L[L.length - 1]; if (l && Math.abs(l.y - i.y) <= 3) l.t.push(i); else L.push({ y: i.y, t: [i] }); });
  L.forEach(l => l.t.sort((a, b) => a.x - b.x));
  return L;
}
async function pageTexts(doc) { const out = []; for (let i = 1; i <= doc.numPages; i++) out.push(hw((await (await doc.getPage(i)).getTextContent()).items.map(x => x.str).join(''))); return out; }

/* ----- Bảng đáp án 1 trang → { K: {md: {n: a}}, L: {md: {n: a}} } -----
   Phần: 文字・語彙 → md 1–5; 文法 問題1–3 → md 6–8; 読解 問題4–6 → md 9–11; 聴解 → lis */
const SEC = [['文字', 'V'], ['文法', 'G'], ['読解', 'G'], ['聴解', 'L']];
function parseKey(L) {
  const res = { K: {}, L: {} }, bad = [];
  let sec = null, nums = null, labels = [], lastNo = 0;
  for (const l of L) {
    const head = l.t.map(t => t.s).join('');
    const sc = SEC.find(([w]) => head.startsWith(w) && l.t[0].x < 60);
    if (sc) { sec = sc[1]; nums = null; labels = []; lastNo = 0; continue; }
    if (!sec) continue;
    /* Tách dòng thành nhãn 問題 và các số. Nhãn: "問題１" hoặc "問題" + số đứng sát sau (< 35pt);
       nhãn không kèm số (số bị in lệch dòng) → lấy 問題 trước + 1 */
    const lab = [], d = [], used = new Set();
    l.t.forEach((t, k) => {
      if (used.has(k)) return;
      const m = t.s.match(/^問題\s*(\d+)?$/);
      if (m) {
        let no = m[1] ? +m[1] : null; const nx = l.t[k + 1];
        if (!no && nx && /^\d+$/.test(nx.s) && nx.x - t.x < 35) { no = +nx.s; used.add(k + 1); }
        lab.push({ x: t.x, no });
      } else if (/^\d+(\s+\d+)*$/.test(t.s)) t.s.split(/\s+/).forEach((s, j) => d.push({ v: +s, x: t.x + j * 8 }));
    });
    lab.forEach(z => { if (!z.no) z.no = lastNo + 1; lastNo = z.no; });
    if (!d.length) { if (lab.length) labels = nums ? labels.concat(lab) : lab; continue; }
    if (!nums) { nums = d; labels = lab.length ? lab : labels; continue; }
    labels = labels.concat(lab);
    // hàng đáp án: ghép từng số câu với đáp án gần nhất theo chiều ngang
    nums.forEach(n => {
      const a = d.reduce((b, c) => Math.abs(c.x - n.x) < Math.abs(b.x - n.x) ? c : b);
      const lb = labels.filter(z => z.x <= n.x + 10).sort((p, q) => q.x - p.x)[0];
      if (!lb || Math.abs(a.x - n.x) > 20 || a.v < 1 || a.v > 4) { bad.push(`${sec} câu ${n.v}`); return; }
      const md = sec === 'V' ? lb.no : sec === 'G' ? lb.no + 5 : lb.no;
      const tgt = sec === 'L' ? res.L : res.K;
      (tgt[md] = tgt[md] || {})[n.v] = a.v;
    });
    nums = null; labels = [];
  }
  return { ...res, bad };
}

/* ----- Script nghe: 問題 → 番 → 正解 ----- */
function scriptAns(texts) {
  const t = texts.join('\n'), out = {}; let md = 0, n = 0;
  const re = /問題\s*(\d)|(\d+)\s*番|正\s*解\s*[:：]\s*(\d)/g; let m;
  while ((m = re.exec(t))) {
    if (m[1]) md = +m[1]; else if (m[2]) n = +m[2]; else if (md && n) (out[md] = out[md] || {})[n] = +m[3];
  }
  return out;
}

/* ----- Trang của từng 問題 trong PDF đề ----- */
function pagesOf(texts) {
  const pg = {}, lpg = {}; let paper = null;
  texts.forEach((t, i) => {
    const p = i + 1;
    if (/言語知識\s*[（(]\s*文字/.test(t)) paper = 'V';
    else if (/言語知識\s*[（(]\s*文法\s*[）)]\s*・?\s*読解/.test(t)) paper = 'G';
    else if (/^\s*\d*\s*(JLPT[^聴]{0,30})?聴\s*解/.test(t) || (paper === 'G' && /聴\s*解/.test(t.slice(0, 80)))) paper = 'L';
    if (!paper) return;
    for (const m of t.matchAll(/問題\s*(\d)(?!\d)/g)) {
      const no = +m[1];
      if (paper === 'L') { if (!lpg[no]) lpg[no] = p; }
      else { const md = paper === 'V' ? no : no + 5; if (md <= 11 && !pg[md]) pg[md] = p; }
    }
  });
  return { pg, lpg };
}

/* ----- Sách luyện đọc SpeedMaster N4 (thư mục VIP15, tham số thứ 2): 54 câu 短文/中文/情報検索, bảng 解答 ở trang cuối.
   Câu có lựa chọn bằng tranh (không có chữ) → bỏ. Dòng chú thích từ vựng tiếng Việt (➢ …) → bỏ. ----- */
async function speedMaster(file) {
  const { pdfLines } = require('./pdf-lines');
  const pages = await pdfLines(file);
  let L = pages.flat().map(hw).filter(l => !/^(SpeedMaster N4|\d{1,2})$/.test(l.trim()));
  const ai = L.findIndex(l => l.trim() === '解答'), key = {};
  L.slice(ai + 1).join('\n').split('\n').reduce((nums, l) => {
    const qn = [...l.matchAll(/問\s*(\d+)/g)].map(m => +m[1]); if (qn.length) return qn;
    const a = l.trim().split(/\s+/).map(Number); if (nums.length && a.length === nums.length && a.every(x => x >= 1 && x <= 4)) nums.forEach((n, k) => { key[n] = a[k]; });
    return [];
  }, []);
  L = L.slice(0, ai);
  const skipped = []; let type = '短文', pass = null, inGloss = false;
  const T = { '短文': '短文', '中文': '中文', '情報検索': '情報検索' };
  const sets_ = {}; const setOf = t => sets_[t] || (sets_[t] = { id: 'n4sm-' + Object.keys(sets_).length, kind: 'R', src: 'n4sm-', unit: 200 + Object.keys(sets_).length, lv: 'N4', title: `SpeedMaster N4 · ${t}`, passages: [], items: [] });
  for (let i = 0; i < L.length; i++) {
    const l = L[i].trim(), raw = l.replace(/[【】]/g, '');
    const sec = raw.match(/^(短文|中文|情報検索)$/); if (sec) { type = T[sec[1]]; continue; }
    if (/^問題\s*\d+/.test(raw)) { const rest = raw.replace(/^問題\s*\d+\s*/, ''); const s = setOf(type); pass = { pid: `${s.id}-p${s.passages.length + 1}`, type, text: rest ? [rest] : [] }; s.passages.push(pass); inGloss = false; continue; }
    if (!pass) continue;
    if (/^➢/.test(raw)) { inGloss = true; continue; }
    const q = raw.match(/^問\s*(\d+)\s*(.*)$/);
    if (q) {
      inGloss = false;
      const n = +q[1], opts = []; let j = i + 1, qt = [q[2]];
      // lựa chọn: 4 dòng bắt đầu bằng 1,2,3,4 (có thể dính chữ: "2国民…")
      while (j < L.length && opts.length < 4) {
        const t = L[j].trim().replace(/[【】]/g, ''), m = t.match(/^([1-4])\s*(\S.*)$/);
        if (m && +m[1] === opts.length + 1) { opts.push(m[2].trim()); j++; continue; }
        if (!opts.length && !/^(問|問題)\s*\d/.test(t)) { qt.push(t); j++; if (qt.length > 3) break; continue; }
        if (opts.length && !/^([1-4])\s*\S/.test(t) && !/^(問|問題|➢)/.test(t) && opts[opts.length - 1].length > 25) { opts[opts.length - 1] += t; j++; continue; }   // lựa chọn dài xuống dòng
        break;
      }
      if (opts.length !== 4 || !key[n]) { skipped.push(n); i = j - 1; continue; }
      const s = setOf(pass.type);
      s.items.push({ id: `${pass.pid}-${s.items.filter(x => x.pid === pass.pid).length + 1}`, pid: pass.pid, q: qt.join('').trim(), opts: [opts], ans: [key[n]], nopt: 4, n });
      i = j - 1; continue;
    }
    if (inGloss) continue;
    pass.text.push(l);
  }
  // nối dòng bị PDF ngắt giữa câu (bài 短文/中文); 情報検索 giữ nguyên dòng vì là bảng, danh sách
  const join = (lines, t) => t === '情報検索' ? lines.join('\n') : lines.reduce((a, l) => a.length && !/[。」』！？!?)）:：]$/.test(a[a.length - 1]) && !/^[・●※]/.test(l) ? (a[a.length - 1] += l, a) : (a.push(l), a), []).join('\n');
  const out = Object.values(sets_).map(s => { s.passages = s.passages.filter(p => s.items.some(it => it.pid === p.pid)).map(p => ({ ...p, text: join(p.text, p.type) })); return s; }).filter(s => s.items.length);
  return { sets: out, skipped, nKey: Object.keys(key).length };
}

const files = d => fs.readdirSync(d).map(f => path.join(d, f)).filter(f => fs.statSync(f).isFile());
function examFiles(dir) {
  const fs_ = files(dir), pdf = fs_.filter(f => /\.pdf$/i.test(f));
  const isAns = f => /ĐÁP ÁN|DAP AN/i.test(path.basename(f).normalize('NFC'));
  const script = pdf.find(f => /script/i.test(path.basename(f)) && !isAns(f));
  const exam = pdf.find(f => f !== script && !isAns(f));
  const au = fs_.filter(f => /\.(mp3|m4a)$/i.test(f) && !/mondai\s*4\.2/i.test(path.basename(f)));
  const audio = au.find(f => /\.mp3$/i.test(f)) || au[0];
  return { exam, script, audio };
}

(async () => {
  const dirs = fs.readdirSync(ROOT).filter(d => fs.statSync(path.join(ROOT, d)).isDirectory());
  const numbered = dirs.filter(d => /^\d+\./.test(d)).sort((a, b) => parseInt(a) - parseInt(b));
  const keyPdf = files(ROOT).find(f => /ĐÁP ÁN.*\.pdf$/i.test(path.basename(f).normalize('NFC')));
  const keyDoc = await openPdf(keyPdf);
  if (keyDoc.numPages !== numbered.length) console.log(`CHÚ Ý: file đáp án có ${keyDoc.numPages} trang, có ${numbered.length} thư mục đề`);
  const jobs = numbered.map((d, i) => ({ dir: d, key: [keyDoc, i + 1] }));
  const ld = dirs.find(d => /^LĐ/i.test(d.normalize('NFC')));
  if (ld) { const k = files(path.join(ROOT, ld)).find(f => /ĐÁP ÁN.*\.pdf$/i.test(path.basename(f).normalize('NFC'))); if (k) jobs.push({ dir: ld, key: [await openPdf(k), 1], ld: true }); }

  const exams = [], report = [];
  for (const j of jobs) {
    const dir = path.join(ROOT, j.dir), F = examFiles(dir);
    const key = parseKey(await pageLines(j.key[0], j.key[1]));   // LĐ: trang 1 là bảng đáp án, các trang sau là giải thích
    const nK = Object.values(key.K).reduce((a, o) => a + Object.keys(o).length, 0), nL = Object.values(key.L).reduce((a, o) => a + Object.keys(o).length, 0);
    const cnt = o => Object.entries(o).map(([md, x]) => md + ':' + Object.keys(x).length).join(' ');
    const msg = [`${j.dir}: ${nK} câu chữ/ngữ pháp/đọc, ${nL} câu nghe  [問題 ${cnt(key.K)} | 聴解 ${cnt(key.L)}]`];
    if (key.bad.length) msg.push(`  không ghép được: ${key.bad.join(', ')}`);
    // kiểm tra số câu liên tục trong từng phần
    const mdOk = Object.entries(key.K).every(([md, o]) => { const ns = Object.keys(o).map(Number).sort((a, b) => a - b); return ns.every((n, k) => !k || n === ns[k - 1] + 1); });
    if (!mdOk) msg.push('  CẢNH BÁO: số câu trong 1 問題 không liên tục');
    // so đáp án nghe với script
    if (F.script) {
      const sa = scriptAns(await pageTexts(await openPdf(F.script)));
      const ns = Object.values(sa).reduce((a, o) => a + Object.keys(o).length, 0);
      if (!ns) msg.push('  script không có chữ (bản scan) → không so được');
      else {
        // câu lệch giữa bảng đáp án và script: bỏ riêng câu đó (không đoán bên nào đúng)
        const diff = []; Object.entries(key.L).forEach(([md, o]) => Object.entries(o).forEach(([n, a]) => { const s = (sa[md] || {})[n]; if (s !== undefined && s !== a) { diff.push(`問題${md}-${n}: bảng ${a}, script ${s}`); delete o[n]; } }));
        msg.push(`  script: so ${ns} câu, lệch ${diff.length}${diff.length ? ' (bỏ câu đó) → ' + diff.join('; ') : ''}`);
      }
    }
    const { pg, lpg } = pagesOf(await pageTexts(await openPdf(F.exam)));
    const q = []; Object.keys(key.K).map(Number).sort((a, b) => a - b).forEach(md => Object.entries(key.K[md]).map(([n, a]) => [+n, a]).sort((a, b) => a[0] - b[0]).forEach(([n, a]) => q.push([md, n, a])));
    const lis = {}; if (F.audio) Object.entries(key.L).forEach(([md, o]) => { lis[md] = {}; Object.entries(o).forEach(([n, a]) => { lis[md][n] = [a]; }); });
    if (!F.audio) msg.push('  không có file nghe → bỏ phần nghe');
    msg.push(`  trang: ${JSON.stringify(pg)} nghe ${JSON.stringify(lpg)}`);
    report.push(msg.join('\n'));
    if (!q.length) continue;
    const name = j.dir.normalize('NFC');
    const ym = j.ld ? null : name.match(/N4\s+(?:(\d{1,2})-)?(\d{4})/);
    const title = j.ld ? 'N4 Luyện đề 01' : `N4 ${ym[1] ? ym[1] + '/' : ''}${ym[2]}`;
    const id = j.ld ? 'n4ld-01' : `n4de-${ym[2]}${ym[1] ? '-' + ym[1].padStart(2, '0') : ''}`;
    const e = { id, lv: 'N4', title, pdf: rel(F.exam), q, lis, pg, lpg };
    if (F.script) e.script = rel(F.script);
    if (F.audio && Object.keys(lis).length) e.mp3 = rel(F.audio);
    exams.push(e);
  }
  // sách đọc SpeedMaster (không cần file nào ngoài JSON → để chung kho này, Sơn chỉ chọn 1 thư mục)
  let sets = [];
  if (process.argv[3]) {
    const sm = await speedMaster(path.resolve(process.argv[3]));
    sets = sm.sets;
    report.push(`SpeedMaster N4: đáp án ${sm.nKey} câu, lấy ${sets.reduce((a, s) => a + s.items.length, 0)} câu (${sets.map(s => s.title.split('· ')[1] + ' ' + s.items.length).join(', ')}); bỏ ${sm.skipped.length} câu (lựa chọn là tranh / không tách được): ${sm.skipped.join(',')}`);
  }
  fs.writeFileSync(OUT, JSON.stringify({ v: 2, slot: 'n4de', name: 'Đề N4 các năm + SpeedMaster đọc N4', sets, exams }));
  report.forEach(r => console.log(r));
  console.log(`\nTỔNG: ${exams.length} đề, ${sets.reduce((a, s) => a + s.items.length, 0)} câu đọc → ${OUT}`);
})();
