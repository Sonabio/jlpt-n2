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

## Đồng bộ giữa các thiết bị
Tiến độ luôn lưu trong trình duyệt (dùng được offline). Để đồng bộ điện thoại ↔ máy tính:
1. Tạo token GitHub chỉ có quyền `gist`: https://github.com/settings/tokens/new?scopes=gist&description=JLPT%20N2%20app
2. Trong app: **Kế hoạch → Cài đặt và đồng bộ** → dán token → *Kết nối*. Làm trên từng thiết bị.
3. App tự lưu vào một gist riêng tư tên `jlpt-n2-progress.json`, tự tải bản mới khi mở app.

Token chỉ nằm trong trình duyệt của thiết bị đó, không có trong repo.

## Cấu trúc
```
src/data.js     nội dung (từ JLPT_N2_tong_hop.md)
src/app.js      logic, FSRS, quiz, thẻ của mình, đồng bộ
src/placement.js  bài kiểm tra trình độ
src/flow.js     luồng học, luyện gõ, thiết bị, báo cáo tuần
src/boot.js     khởi động
data/*.js       dữ liệu kanji, từ vựng (sinh bằng tools/build_data.py)
src/head.html   giao diện (CSS + khung trang)
build.sh        ghép thành index.html (PWA) và artifact.html (bản claude.ai)
index.html      file GitHub Pages phục vụ
sw.js           service worker (offline)
manifest.webmanifest, icons/
```
Sửa trong `src/`, chạy `./build.sh`, rồi commit cả `index.html`. Khi đổi nội dung, tăng `VERSION` trong `sw.js`.
