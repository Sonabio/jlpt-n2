# Lộ trình JLPT N2

App học và ôn thi tiếng Nhật từ con số 0 đến JLPT N2, chạy như PWA trên điện thoại và máy tính.

**Mở app:** https://jlpt-n2.mylifegame-platform.workers.dev/ (Cloudflare, tự deploy mỗi lần push lên `main`)

## Tính năng
- **Dữ liệu N5–N1:** 2.211 kanji (có Hán-Việt), 8.034 từ vựng, ngữ pháp N5–N1 (~360 mẫu). Xem `ATTRIBUTION.md`.
- **Học (luồng chính):** Học mới → Nghe → Chọn đáp án → Gõ đáp án; tự chấm vào lịch ôn FSRS. Điện thoại ưu tiên từ vựng + kanji; laptop ưu tiên ngữ pháp.
- **Luyện gõ:** hướng dẫn bộ gõ tiếng Nhật (Windows, macOS, iPhone, Android), gõ từ ra kanji, nghe rồi gõ, gõ câu; đo độ chính xác và ký tự/phút. Tùy chọn tự đổi romaji → kana.
- **Ôn thẻ (FSRS-4.5):** có chế độ gõ đáp án trước khi lật.
- **Hôm nay:** kế hoạch 2 giờ theo thiết bị, phút học tự đếm, báo cáo tuần (mục tiêu 840 phút).
- **Kiểm tra trình độ, Luyện tập (10 dạng), Tra cứu, Thi thử, Kế hoạch** như trước.
- **Đồng bộ:** GitHub Gist (`jlpt-n2-progress.json` + `jlpt-n2-weekly.json` cho báo cáo tự động).

## Cài lên máy
- **iPhone (Safari):** mở link → nút Chia sẻ → *Thêm vào MH chính*.
- **Android (Chrome):** mở link → menu ⋮ → *Cài đặt ứng dụng*.
- **Máy tính (Chrome/Edge):** biểu tượng cài đặt ở thanh địa chỉ.

## Đồng bộ giữa các thiết bị (Cloudflare Worker + D1)
Tiến độ luôn lưu trong trình duyệt (dùng được offline) và gộp lên D1 qua `/api/sync`.
1. Máy đầu tiên: **Kế hoạch → Cài đặt và đồng bộ → Bật đồng bộ (máy đầu tiên)**. Lưu lại **mã khôi phục**.
2. Máy thứ hai: trên máy đầu bấm **Ghép thêm máy** → nhập mã 8 ký tự (hoặc quét QR) trên máy thứ hai.
3. Dữ liệu gộp theo từng thẻ (giữ lần ôn mới nhất), nhật ký học lưu riêng từng máy rồi cộng lại, nên học offline trên cả hai máy không mất.
4. **Đổi khóa** ngắt mọi máy khác; **mã khôi phục** lấy lại quyền khi mất hết máy.

Chỉ một người dùng: không gian đồng bộ đầu tiên là chủ, máy khác chỉ vào được bằng mã ghép. Khóa chỉ lưu dưới dạng SHA-256 trên D1.
`/api/report/<mã>` trả về thống kê tuần cho lịch báo cáo tự động (mã không nằm trong repo).

## Cấu trúc
```
src/data.js     nội dung (từ JLPT_N2_tong_hop.md)
src/app.js      logic, FSRS, quiz, thẻ của mình, đồng bộ
src/placement.js  bài kiểm tra trình độ
src/flow.js     luồng học, luyện gõ, thiết bị, báo cáo tuần
src/boot.js     khởi động
data/*.js       dữ liệu kanji, từ vựng (sinh bằng tools/build_data.py)
src/sync.js     gộp dữ liệu, đồng bộ Cloudflare, ghép máy
src/head.html   giao diện (CSS + khung trang)
build.sh        ghép thành public/index.html (PWA) và artifact.html (bản claude.ai)
worker/index.js Worker: phục vụ public/ + API đồng bộ trên D1
wrangler.jsonc  cấu hình Worker (tên jlpt-n2, binding DB)
public/         file tĩnh: index.html, sw.js, manifest, icons/, data/, vendor/qrcode.js
```
Sửa trong `src/`, chạy `./build.sh`, rồi commit cả `public/index.html`. Khi đổi nội dung, tăng `VERSION` trong `sw.js`.
