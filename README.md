# Luyện đề JLPT N2

Web luyện đề **nghe** và **đọc** JLPT N2. Máy tính để luyện chính; điện thoại chỉ ôn lại phần yếu đã được phân tích.

**Mở app:** https://jlpt-n2.mylifegame-platform.workers.dev/ (Cloudflare, tự deploy mỗi lần push lên `main`)

## Tính năng
- **Luyện nghe** theo bộ (Chặng nền tảng C1–9, Chặng 2 bài 1–10) hoặc theo dạng 問題1–5. Trình phát có lùi 5s, tốc độ 0.85–1.15×, đếm số lần nghe. Dạng 3/4/5 mặc định chỉ hiện số như đề thật.
- **Luyện đọc** theo bài hoặc theo dạng (短文, 中文, 長文, 統合理解, 情報検索), bấm giờ theo mục tiêu từng dạng.
- Sau mỗi câu: đáp án, script (tô câu chứa đáp án), chọn **lý do sai**, bôi đen cụm chưa biết để **lưu thành thẻ**.
- **Điểm yếu**: % đúng theo dạng (lần đầu / lần gần nhất), thời gian, lý do sai hay gặp, gợi ý việc nên làm; câu sai được lặp lại 1 → 3 → 7 → 21 ngày.
- **Ôn nhanh** (điện thoại): thẻ cụm từ (FSRS) + câu sai đến hạn (câu nghe có thể đọc script thay vì nghe).
- **Thi thử đề thật 2010–2026** (32 đề): xem đề PDF gốc + phiếu trả lời, thi full 105′ + 50′ hoặc từng 問題, chấm theo bảng đáp án, điểm ước tính, câu sai vào Điểm yếu; xem script sau khi chấm.

## Chạy offline (dữ liệu nằm trên máy)
- **Nhập tài liệu**: Cài đặt → Tài liệu khóa học → chọn thư mục có `content-*.json` + MP3/PDF. Nội dung và file được lưu thẳng vào trình duyệt (IndexedDB), **không cần mạng, không cần bật đồng bộ**.
- Trình xem PDF (pdf.js 3.11.174, cmaps) nằm sẵn trong `public/vendor/pdfjs/`, service worker lưu sẵn → mở đề khi mất mạng.
- **Sao lưu**: Cài đặt → Sao lưu → Xuất file (chỉ tiến độ). Nhập = gộp, không ghi đè.
- Repo **không** chứa tài liệu khóa học. Khi bật đồng bộ, nội dung (JSON) cũng gửi lên D1 để điện thoại tải về; file nghe/đề chỉ gửi lên R2 khi tick "Cũng tải file lên cloud".

## Đồng bộ (Cloudflare Worker + D1)
1. Máy đầu: **Cài đặt → Đồng bộ → Bật đồng bộ (máy đầu tiên)**, lưu mã khôi phục.
2. Máy khác: **Ghép thêm máy** → nhập mã 8 ký tự hoặc quét QR.
3. Lần làm bài gộp theo thời điểm, thẻ cụm từ theo id, nhật ký thời gian theo từng máy.

API: `/api/sync`, `/api/content`, `/api/audio[/<id>]` (cần khóa), `/api/report/<mã>` (thống kê tuần cho lịch báo cáo; mã không nằm trong repo).

## Cấu trúc
```
src/data.js      dạng bài, mẹo, cấu trúc đề (không có nội dung khóa học)
src/core.js      tiện ích, trạng thái, điều hướng, FSRS, đếm giờ học
src/sync.js      gộp dữ liệu, đồng bộ Cloudflare, ghép máy
src/store.js     lưu trên máy (IndexedDB): nội dung + file nghe/đề
src/content.js   tải nội dung + file nghe, trình phát, nhập tài liệu
src/backup.js    xuất/nhập file sao lưu tiến độ
src/practice.js  luyện nghe, luyện đọc, ghi lần làm, lưu cụm
src/views.js     điểm yếu, ôn nhanh, hôm nay, cài đặt, báo cáo tuần
src/exam.js      đề thật các năm: trình xem PDF (pdf.js), phiếu trả lời, chấm
src/head.html    giao diện
build.sh         ghép thành public/index.html
worker/index.js  Worker: file tĩnh + API (D1, R2 tùy chọn)
```
Sửa trong `src/`, chạy `./build.sh`, commit cả `public/index.html`. Khi đổi giao diện, tăng `VERSION` trong `public/sw.js`.
