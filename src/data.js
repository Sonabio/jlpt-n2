/* ===== DỮ LIỆU CỐ ĐỊNH (không chứa nội dung tài liệu khóa học; nội dung đó nằm riêng trên D1, cần khóa đồng bộ) ===== */
const L = s => s.trim().split('\n').map(r => r.trim()).filter(Boolean).map(r => r.split('|').map(x => x.trim()));

/* ===== ĐỊNH NGHĨA THEO CẤP (N5 → N2): dạng bài nghe, dạng đọc, cấu trúc đề, cách tính điểm ===== */
const LIS = {
  kadai: { ja: '課題理解', vi: 'Hiểu nhiệm vụ', opts: 'print', tip: 'Đọc 4 lựa chọn trước khi nghe. Hỏi "まず/このあと" thì đáp án là việc làm ngay, không phải việc đã làm (Vた/Vてある). Nghe đến hết, hay bị "quay xe" sau でも/ただ/やっぱり.' },
  point: { ja: 'ポイント理解', vi: 'Hiểu điểm chính', opts: 'print', tip: 'Nghe câu hỏi để biết cần tìm lý do/điểm nào, rồi đọc lựa chọn. Bẫy: lý do được nhắc rồi bị phủ định; đáp án thường sau 実は/何より/一番.' },
  gaiyo: { ja: '概要理解', vi: 'Hiểu khái quát', opts: 'spoken', tip: 'Không có câu hỏi trước. Nghe ý chính và thái độ người nói (賛成/反対, tích cực/tiêu cực); câu kết luận thường ở cuối sau つまり/ですから.' },
  hatsuwa: { ja: '発話表現', vi: 'Nói gì trong tình huống', opts: 'spoken', nopt: 3, tip: 'Nghe tình huống: ai nói với ai, muốn nhờ/mời/xin phép/xin lỗi? Phân biệt người làm hành động: 〜てもいいですか (mình làm) với 〜てくれませんか (nhờ người kia làm).' },
  sokuji: { ja: '即時応答', vi: 'Phản xạ nhanh', opts: 'spoken', nopt: 3, tip: 'Một câu nói + 3 lời đáp. Nắm văn nói rút gọn (〜ちゃう, 〜なきゃ), kính ngữ và ý ẩn (khen/từ chối/than phiền). Không nghĩ lâu, chọn ngay.' },
  togo: { ja: '統合理解', vi: 'Hiểu tổng hợp', opts: 'mixed', tip: 'Ghi chú dạng bảng: mỗi lựa chọn một dòng, ghi đặc điểm + ý kiến từng người. Câu 3 có 2 câu hỏi cho 2 người khác nhau.' },
};
const mkLis = (...a) => { const o = {}; a.forEach(([k, n], i) => { o[i + 1] = { ...LIS[k], n }; }); return o; };
const RTD = {
  '短文': { vi: 'Đoạn ngắn', tip: 'Đọc câu hỏi trước. Ý chính thường ở câu cuối hoặc sau しかし/つまり/ のである.' },
  '中文': { vi: 'Đoạn trung bình', tip: 'Mỗi câu hỏi ứng với một đoạn theo thứ tự. Gạch dưới từ chỉ quan điểm, lý do (から/ので/ため).' },
  '長文': { vi: 'Bài dài', tip: 'Tìm chủ trương của tác giả; câu hỏi cuối thường hỏi toàn bài, đọc lại đoạn kết.' },
  '統合理解': { vi: 'So sánh A/B', tip: 'Đọc câu hỏi trước, rồi đánh dấu điểm giống/khác của A và B về đúng vấn đề được hỏi.' },
  '情報検索': { vi: 'Tìm thông tin', tip: 'Đọc câu hỏi và điều kiện trước; quét bảng tìm đúng điều kiện, chú ý ※ và ngoại lệ.' },
};
const mkRt = o => { const r = {}; Object.entries(o).forEach(([k, min]) => { r[k] = { ...RTD[k], min }; }); return r; };
/* parts: md|bài thi (pp)|file PDF (f)|số 問題 in trên đề|tên|làm gì|số câu|K hay R|dạng đọc */
const mkParts = s => L(s).map(r => ({ md: +r[0], pp: +r[1], f: +r[2], no: +r[3], ja: r[4], vi: r[5], n: r[6], sec: r[7], rt: r[8] || null }));
const SEC3 = pass => ({ pass, secs: [['Kiến thức ngôn ngữ', 60, 19], ['Đọc hiểu', 60, 19], ['Nghe hiểu', 60, 19]] });
const SEC2 = pass => ({ pass, secs: [['Kiến thức ngôn ngữ + Đọc', 120, 38], ['Nghe hiểu', 60, 19]] });
const LVS = ['N5', 'N4', 'N3', 'N2'];
const LVDEF = {
  N5: {
    lis: mkLis(['kadai', 7], ['point', 6], ['hatsuwa', 5], ['sokuji', 6]), rt: mkRt({ '短文': 3, '中文': 6, '情報検索': 4 }), rule: SEC2(80),
    papers: [{ ja: '文字・語彙', vi: 'Chữ + từ vựng', min: 20 }, { ja: '文法・読解', vi: 'Ngữ pháp + Đọc', min: 40 }, { ja: '聴解', vi: 'Nghe hiểu', min: 30, lis: true }],
    parts: mkParts(`
1|0|0|1|漢字読み|Chọn cách đọc kanji|7|K
2|0|0|2|表記|Chọn chữ viết đúng|5|K
3|0|0|3|文脈規定|Chọn từ hợp ngữ cảnh|6|K
4|0|0|4|言い換え類義|Câu đồng nghĩa|3|K
5|1|1|1|文法形式の判断|Chọn trợ từ/mẫu ngữ pháp|9|K
6|1|1|2|文の組み立て|Sắp xếp 4 mảnh, chọn ★|4|K
7|1|1|3|文章の文法|Ngữ pháp trong đoạn văn|4|K
8|1|2|4|内容理解(短文)|Đọc ngắn ~80 chữ|2|R|短文
9|1|2|5|内容理解(中文)|Đọc trung bình ~250 chữ|2|R|中文
10|1|2|6|情報検索|Tìm thông tin trong thông báo|1|R|情報検索`),
  },
  N4: {
    lis: mkLis(['kadai', 8], ['point', 7], ['hatsuwa', 5], ['sokuji', 8]), rt: mkRt({ '短文': 3, '中文': 7, '情報検索': 5 }), rule: SEC2(90),
    papers: [{ ja: '文字・語彙', vi: 'Chữ + từ vựng', min: 25 }, { ja: '文法・読解', vi: 'Ngữ pháp + Đọc', min: 55 }, { ja: '聴解', vi: 'Nghe hiểu', min: 35, lis: true }],
    parts: mkParts(`
1|0|0|1|漢字読み|Chọn cách đọc kanji|7|K
2|0|0|2|表記|Chọn kanji cho từ viết bằng kana|5|K
3|0|0|3|文脈規定|Chọn từ hợp ngữ cảnh|8|K
4|0|0|4|言い換え類義|Câu đồng nghĩa|4|K
5|0|0|5|用法|Câu dùng từ đúng|4|K
6|1|1|1|文法形式の判断|Chọn mẫu ngữ pháp|13|K
7|1|1|2|文の組み立て|Sắp xếp 4 mảnh, chọn ★|4|K
8|1|1|3|文章の文法|Ngữ pháp trong đoạn văn|4|K
9|1|2|4|内容理解(短文)|Đọc ngắn 100–200 chữ|3|R|短文
10|1|2|5|内容理解(中文)|Đọc trung bình ~450 chữ|3|R|中文
11|1|2|6|情報検索|Tìm thông tin trong thông báo|2|R|情報検索`),
  },
  N3: {
    lis: mkLis(['kadai', 6], ['point', 6], ['gaiyo', 3], ['hatsuwa', 4], ['sokuji', 9]), rt: mkRt({ '短文': 3, '中文': 7, '長文': 10, '情報検索': 6 }), rule: SEC3(95),
    papers: [{ ja: '文字・語彙', vi: 'Chữ + từ vựng', min: 30 }, { ja: '文法・読解', vi: 'Ngữ pháp + Đọc', min: 70 }, { ja: '聴解', vi: 'Nghe hiểu', min: 40, lis: true }],
    parts: mkParts(`
1|0|0|1|漢字読み|Chọn cách đọc kanji|8|K
2|0|0|2|表記|Chọn kanji cho từ viết bằng kana|6|K
3|0|0|3|文脈規定|Chọn từ hợp ngữ cảnh|11|K
4|0|0|4|言い換え類義|Từ/cụm đồng nghĩa|5|K
5|0|0|5|用法|Câu dùng từ đúng|5|K
6|1|1|1|文法形式の判断|Chọn mẫu ngữ pháp|13|K
7|1|1|2|文の組み立て|Sắp xếp 4 mảnh, chọn ★|5|K
8|1|1|3|文章の文法|Ngữ pháp trong đoạn văn|5|K
9|1|2|4|内容理解(短文)|Đọc ngắn 150–200 chữ|4|R|短文
10|1|2|5|内容理解(中文)|Đọc trung bình ~350 chữ|6|R|中文
11|1|2|6|内容理解(長文)|Bài dài ~550 chữ|4|R|長文
12|1|2|7|情報検索|Tìm thông tin ~600 chữ|2|R|情報検索`),
  },
  N2: {
    lis: mkLis(['kadai', 5], ['point', 6], ['gaiyo', 5], ['sokuji', 12], ['togo', 4]), rt: mkRt({ '短文': 2, '中文': 5, '長文': 9, '統合理解': 6, '情報検索': 6 }), rule: SEC3(90),
    papers: [{ ja: '言語知識・読解', vi: 'Kiến thức ngôn ngữ + Đọc hiểu', min: 105 }, { ja: '聴解', vi: 'Nghe hiểu', min: 50, lis: true }],
    parts: mkParts(`
1|0|0|1|漢字読み|Chọn cách đọc kanji|5|K
2|0|0|2|表記|Chọn kanji cho từ viết bằng kana|5|K
3|0|0|3|語形成|Tiền tố/hậu tố|3–5|K
4|0|0|4|文脈規定|Chọn từ hợp ngữ cảnh|7|K
5|0|0|5|言い換え類義|Từ/cụm đồng nghĩa|5|K
6|0|0|6|用法|Câu dùng từ đúng|5|K
7|0|0|7|文法形式の判断|Chọn mẫu ngữ pháp|12|K
8|0|0|8|文の組み立て|Sắp xếp 4 mảnh, chọn ★|5|K
9|0|0|9|文章の文法|Ngữ pháp trong đoạn văn|5|K
10|0|0|10|内容理解(短文)|Đọc ngắn ~200 chữ · 2 phút/bài|5|R|短文
11|0|0|11|内容理解(中文)|Đọc trung bình ~500 chữ · 5–6 phút/bài|9|R|中文
12|0|0|12|統合理解|So sánh 2 bài A/B · 6 phút|2|R|統合理解
13|0|0|13|主張理解|Bài dài ~900 chữ · 10 phút|3|R|長文
14|0|0|14|情報検索|Tìm thông tin trong bảng · 5 phút|2|R|情報検索`),
  },
};
LVDEF.N2.lis[4].nopt = 3;
const curLv = () => (typeof S !== 'undefined' && S.set && LVDEF[S.set.lv]) ? S.set.lv : 'N2';
const LVD = lv => LVDEF[lv] || LVDEF[curLv()];
const MDL = () => LVD().lis, RTL = () => LVD().rt, PARTS = lv => LVD(lv).parts;
const PART = (md, lv) => PARTS(lv).find(p => p.md === +md);
const WHY = [['nghe', 'Không nghe kịp/không nhận ra từ'], ['tu', 'Không biết từ/ngữ pháp'], ['bay', 'Bị bẫy (đổi ý, phủ định)'], ['cau', 'Hiểu sai câu hỏi'], ['gio', 'Thiếu thời gian'], ['doan', 'Đoán bừa']];
