# Lộ trình JLPT N2

App học và ôn thi tiếng Nhật từ con số 0 đến JLPT N2, chạy như PWA trên điện thoại và máy tính.

**Mở app:** https://sonabio.github.io/jlpt-n2/

## Tính năng
- **Hôm nay:** đếm ngược kỳ thi, thẻ đến hạn, lịch hôm nay, buổi học 60′ có hẹn giờ, chuỗi ngày học, tiến độ lộ trình.
- **Ôn thẻ:** 16 bộ thẻ (kana, kanji N5, bộ thủ, ngữ pháp N5–N2, kính ngữ, phó từ, tự/tha động từ, bạn giả Hán-Việt, từ ngành môi trường), lịch ôn SM-2 rút gọn.
- **Luyện tập:** 7 dạng quiz (問題7, nghĩa ngữ pháp, chia động từ, trợ từ, kính ngữ, tự/tha, theo bộ thẻ).
- **Tra cứu:** ngữ pháp có lọc, Hán-Việt → âm On (có công cụ đoán), kanji, chia động từ, kính ngữ, trợ từ, văn nói, mẹo phân biệt.
- **Thi thử:** đồng hồ 105′ + 50′, chấm đỗ/trượt (N2–N5), lịch sử điểm.
- **Kế hoạch:** kỳ thi mục tiêu, giai đoạn, lịch tuần, checklist, mẫu câu hỏi Claude, cài đặt.

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
src/app.js      logic, SRS, quiz, đồng bộ
src/head.html   giao diện (CSS + khung trang)
build.sh        ghép thành index.html (PWA) và artifact.html (bản claude.ai)
index.html      file GitHub Pages phục vụ
sw.js           service worker (offline)
manifest.webmanifest, icons/
```
Sửa trong `src/`, chạy `./build.sh`, rồi commit cả `index.html`. Khi đổi nội dung, tăng `VERSION` trong `sw.js`.
