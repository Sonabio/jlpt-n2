# Nguồn dữ liệu

- **KANJIDIC2** — Electronic Dictionary Research and Development Group (EDRDG), giấy phép CC BY-SA 4.0. Dùng cho âm Hán-Việt (qua gói npm `kanjidic2-json`). https://www.edrdg.org/wiki/index.php/KANJIDIC_Project
- **kanji-data** — David Gouveia, MIT. Cấp JLPT mới, âm On/Kun, nghĩa tiếng Anh của kanji (dữ liệu gốc từ KANJIDIC và danh sách JLPT của Jonathan Waller). https://github.com/davidluzgouveia/kanji-data
- **open-anki-jlpt-decks** — Jamie Sinclair, MIT. Danh sách từ vựng N5–N1 (gốc từ tanos.co.uk của Jonathan Waller, CC BY). https://github.com/jamsinclair/open-anki-jlpt-decks
- Ngữ pháp N5–N1, nghĩa tiếng Việt, câu ví dụ, bài kiểm tra trình độ: tự soạn.

Danh sách JLPT là ước tính phổ biến; JLPT không công bố danh sách chính thức. Âm Hán-Việt của từ ghép được ghép tự động từng chữ nên có thể lệch với từ ít gặp. File `data/kanji.js` và `data/vocab.js` sinh bằng `tools/build_data.py` và được phân phối theo CC BY-SA 4.0.
