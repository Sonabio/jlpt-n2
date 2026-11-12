/* Đọc PDF thành các dòng chữ dựa trên vị trí (dùng pdf.js có sẵn trong app, chạy bằng node):
   - bỏ furigana (chữ nhỏ hơn hẳn cỡ chữ chính của trang)
   - chữ có gạch chân (hình chữ nhật mảnh ngay dưới chữ) → bọc 【】
   Dùng: const { pdfLines } = require('./pdf-lines'); const pages = await pdfLines(file) → [[dòng, …], …] */
const fs = require('fs'), path = require('path');
const V = path.join(__dirname, '..', 'public', 'vendor', 'pdfjs');
const pdfjs = require(path.join(V, 'pdf.min.js'));
pdfjs.GlobalWorkerOptions.workerSrc = path.join(V, 'pdf.worker.min.js');

// các nét gạch chân của trang: hình chữ nhật cao < 1.5, rộng > 4 (tọa độ cùng hệ với chữ)
async function underlines(page) {
  const ol = await page.getOperatorList(), O = pdfjs.OPS, out = [];
  ol.fnArray.forEach((f, i) => {
    if (f !== O.constructPath) return;
    const [ops, args] = ol.argsArray[i];
    let a = 0;
    ops.forEach(op => {
      if (op === O.rectangle) { const [x, y, w, h] = args.slice(a, a + 4); if (Math.abs(h) < 1.5 && Math.abs(w) > 4) out.push({ x0: Math.min(x, x + w), x1: Math.max(x, x + w), y: Math.min(y, y + h) }); a += 4; }
      else if (op === O.moveTo || op === O.lineTo) a += 2;
      else if (op === O.curveTo) a += 6; else if (op === O.curveTo2 || op === O.curveTo3) a += 4;
    });
  });
  return out;
}

async function pdfLines(file, { from = 1, to = Infinity } = {}) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), cMapUrl: V + '/cmaps/', cMapPacked: true, isEvalSupported: false, verbosity: 0 }).promise;
  const pages = [];
  for (let p = from; p <= Math.min(to, doc.numPages); p++) {
    const page = await doc.getPage(p), tc = await page.getTextContent(), uls = await underlines(page);
    let items = tc.items.filter(t => t.str !== '').map(t => ({ s: t.str, x: t.transform[4], y: t.transform[5], size: Math.abs(t.transform[0]) || Math.abs(t.transform[3]), w: t.width }));
    // cỡ chữ chính = cỡ phổ biến nhất (tính theo số ký tự); furigana nhỏ hơn 70% → bỏ
    const cnt = {}; items.forEach(t => { if (t.s.trim()) { const k = Math.round(t.size); cnt[k] = (cnt[k] || 0) + t.s.length; } });
    const main = +Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || 12;
    items = items.filter(t => t.size >= main * 0.7);
    // đánh dấu gạch chân theo từng ký tự (ước lượng vị trí ký tự theo bề rộng)
    items.forEach(t => {
      const hit = uls.filter(u => u.y <= t.y + 1 && u.y >= t.y - t.size * 0.5 && u.x1 > t.x && u.x0 < t.x + t.w);
      if (!hit.length || !t.s.trim()) return;
      const n = [...t.s].length, cw = t.w / n;
      t.s = [...t.s].map((ch, i) => { const cx = t.x + cw * (i + 0.5); return hit.some(u => cx >= u.x0 && cx <= u.x1) && ch.trim() ? '\u0001' + ch + '\u0002' : ch; }).join('');
    });
    // trang in 2 cột: không có chữ nào vắt qua giữa trang → đọc hết cột trái rồi cột phải
    const mid = page.view[2] / 2, cross = items.filter(t => t.s.trim() && t.x < mid - 5 && t.x + t.w > mid + 5).length;
    const cols = cross <= 1 ? [items.filter(t => t.x < mid), items.filter(t => t.x >= mid)] : [items];
    const out = [];
    cols.forEach(col => {
      // gom thành dòng theo y (sai số 3 điểm), trong dòng xếp theo x
      col.sort((a, b) => b.y - a.y || a.x - b.x);
      const lines = [];
      col.forEach(t => { const L = lines.find(l => Math.abs(l.y - t.y) < 3); if (L) L.it.push(t); else lines.push({ y: t.y, it: [t] }); });
      lines.sort((a, b) => b.y - a.y).forEach(l => out.push(l.it.sort((a, b) => a.x - b.x).map(t => t.s).join('')
        .replace(/\u0002(\s*)\u0001/g, '$1').replace(/\u0001/g, '【').replace(/\u0002/g, '】').replace(/\s+/g, ' ').trim()));
    });
    pages.push(out.filter(Boolean));
  }
  return pages;
}
module.exports = { pdfLines };
if (require.main === module) {
  const [, , file, from = 1, to = 3] = process.argv;
  pdfLines(file, { from: +from, to: +to }).then(ps => ps.forEach((l, i) => console.log(`### trang ${+from + i}\n` + l.join('\n'))));
}
