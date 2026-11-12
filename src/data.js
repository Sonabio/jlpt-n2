/* ===== DỮ LIỆU CỐ ĐỊNH (không chứa nội dung tài liệu khóa học; nội dung đó nằm riêng trên D1, cần khóa đồng bộ) ===== */
const L = s => s.trim().split('\n').map(r => r.trim()).filter(Boolean).map(r => r.split('|').map(x => x.trim()));

/* Dạng bài nghe N2 (問題1–5) */
const MD = {
  1: { ja: '課題理解', vi: 'Hiểu nhiệm vụ', n: 5, tip: 'Đọc 4 lựa chọn trước khi nghe. Hỏi "まず/このあと" thì đáp án là việc làm ngay, không phải việc đã làm (Vた/Vてある). Nghe đến hết, hay bị "quay xe" sau でも/ただ/やっぱり.', opts: 'print' },
  2: { ja: 'ポイント理解', vi: 'Hiểu điểm chính', n: 6, tip: 'Nghe câu hỏi để biết cần tìm lý do/điểm nào, rồi đọc lựa chọn. Bẫy: lý do được nhắc rồi bị phủ định; đáp án thường sau 実は/何より/一番.', opts: 'print' },
  3: { ja: '概要理解', vi: 'Hiểu khái quát', n: 5, tip: 'Không có câu hỏi trước. Nghe ý chính và thái độ người nói (賛成/反対, tích cực/tiêu cực); câu kết luận thường ở cuối sau つまり/ですから.', opts: 'spoken' },
  4: { ja: '即時応答', vi: 'Phản xạ nhanh', n: 12, tip: 'Một câu nói + 3 lời đáp. Nắm văn nói rút gọn (〜ちゃう, 〜なきゃ), kính ngữ và ý ẩn (khen/từ chối/than phiền). Không nghĩ lâu, chọn ngay.', opts: 'spoken' },
  5: { ja: '統合理解', vi: 'Hiểu tổng hợp', n: 4, tip: 'Ghi chú dạng bảng: mỗi lựa chọn một dòng, ghi đặc điểm + ý kiến từng người. Câu 3 có 2 câu hỏi cho 2 người khác nhau.', opts: 'mixed' },
};
/* Dạng bài đọc + thời gian mục tiêu (phút) */
const RT = {
  '短文': { vi: 'Đoạn ngắn', min: 2, tip: 'Đọc câu hỏi trước. Ý chính thường ở câu cuối hoặc sau しかし/つまり/ のである.' },
  '中文': { vi: 'Đoạn trung bình', min: 5, tip: 'Mỗi câu hỏi ứng với một đoạn theo thứ tự. Gạch dưới từ chỉ quan điểm tác giả.' },
  '長文': { vi: 'Bài dài (主張理解)', min: 9, tip: 'Tìm chủ trương của tác giả; câu hỏi cuối thường hỏi toàn bài, đọc lại đoạn kết.' },
  '統合理解': { vi: 'So sánh A/B', min: 6, tip: 'Đọc câu hỏi trước, rồi đánh dấu điểm giống/khác của A và B về đúng vấn đề được hỏi.' },
  '情報検索': { vi: 'Tìm thông tin', min: 6, tip: 'Đọc câu hỏi và điều kiện trước; quét bảng tìm đúng điều kiện, chú ý ※ và ngoại lệ.' },
};
const WHY = [['nghe', 'Không nghe kịp/không nhận ra từ'], ['tu', 'Không biết từ/ngữ pháp'], ['bay', 'Bị bẫy (đổi ý, phủ định)'], ['cau', 'Hiểu sai câu hỏi'], ['gio', 'Thiếu thời gian'], ['doan', 'Đoán bừa']];

const EXAM_PARTS = L(`
1|漢字読み|Chọn cách đọc kanji|5
2|表記|Chọn kanji cho từ viết bằng kana|5
3|語形成|Tiền tố/hậu tố|3–5
4|文脈規定|Chọn từ hợp ngữ cảnh|7
5|言い換え類義|Từ/cụm đồng nghĩa|5
6|用法|Câu dùng từ đúng|5
7|文法形式の判断|Chọn mẫu ngữ pháp|12
8|文の組み立て|Sắp xếp 4 mảnh, chọn ★|5
9|文章の文法|Ngữ pháp trong đoạn văn|5
10|内容理解(短文)|Đọc ngắn ~200 chữ · 2 phút/bài|5
11|内容理解(中文)|Đọc trung bình ~500 chữ · 5–6 phút/bài|9
12|統合理解|So sánh 2 bài A/B · 6 phút|2
13|主張理解|Bài dài ~900 chữ · 10 phút|3
14|情報検索|Tìm thông tin trong bảng · 5 phút|2
`);
