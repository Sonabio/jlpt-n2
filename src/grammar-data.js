/* ===== NGỮ PHÁP N5 → N1 (tự soạn) =====
   Mỗi dòng: id | nhóm | mẫu | cách nối | nghĩa | ví dụ | dịch | 3 đáp án nhiễu (cách nhau ;) | ghi chú
   Ví dụ: [..] = chỗ trống cho bài "Chọn mẫu đúng"; {a/b/c/d} = 4 mảnh đúng thứ tự cho bài "Sắp xếp câu ★".
   id cố định (lịch sử làm bài gắn theo id) → thêm mẫu mới thì dùng id mới, không đánh lại số. */
const GRAM_GROUPS = {
  tro: 'Trợ từ, câu cơ bản', dt: 'Thể động từ, trạng thái', yc: 'Nhờ, mời, cho phép, cấm, bắt buộc', mm: 'Mong muốn, ý định',
  tg: 'Thời gian, trình tự', ss: 'So sánh, mức độ', nn: 'Lý do, nguyên nhân', dk: 'Điều kiện, giả định', kn: 'Khả năng, kinh nghiệm, thay đổi',
  cn: 'Cho – nhận', pd: 'Phỏng đoán, nghe nói, dáng vẻ', bd: 'Bị động, sai khiến', kg: 'Kính ngữ', kh: 'Khác'
};
const GRAM = {};
GRAM.N5 = L(`
1|tro|～は～です|N1 は N2 です|N1 là N2 (câu khẳng định lịch sự)|{わたし/[は]/ベトナム人/です}。|Tôi là người Việt Nam.|を;へ;で|は đánh dấu chủ đề câu, đọc là "wa". です cuối câu làm câu lịch sự.
2|tro|～じゃありません|N じゃ（では）ありません|không phải là N|{あの人/は/先生/[じゃありません]}。|Người kia không phải là giáo viên.|ではです;くないです;ありません|Phủ định của です. Viết trang trọng: ではありません.
3|tro|～か（câu hỏi）|câu + か|câu hỏi có/không|A：{これは/あなたの/かさ/です[か]}。B：はい、そうです。|A: Đây có phải ô của bạn không? B: Vâng, đúng vậy.|を;へ;で|Thêm か cuối câu là thành câu hỏi, không cần đảo trật tự từ.
4|tro|～も|N も|cũng|{ミンさんは/学生です。/わたし[も]/学生}です。|Minh là sinh viên. Tôi cũng là sinh viên.|を;へ;に|も thay cho は/が/を; không đi cùng は/が/を (×はも).
5|tro|～の（sở hữu）|N1 の N2|N2 của N1; N2 thuộc loại N1|{これは/わたし[の]/日本語の/本}です。|Đây là sách tiếng Nhật của tôi.|を;が;に|Nối 2 danh từ: 私の本 (sách của tôi), 日本語の本 (sách tiếng Nhật).
6|tro|この／その／あの＋N|この/その/あの + N|N này / N đó / N kia|{[この]/かばんは/いくら/です}か。|Cái cặp này bao nhiêu tiền?|これ;ここ;こちら|これ/それ/あれ đứng một mình; この/その/あの phải có danh từ đi sau.
7|tro|～が あります／います|N が あります（vật）/ います（người, vật sống）|có (tồn tại)|{きょうしつに/学生[が]/三人/います}。|Trong lớp có 3 học sinh.|を;で;へ|あります cho đồ vật, cây cối; います cho người, động vật.
8|tro|～に ～が あります|nơi に N が あります/います|ở (nơi) có N|{つくえの上[に]/本が/二さつ/あります}。|Trên bàn có 2 quyển sách.|で;を;へ|Nơi tồn tại dùng に, không dùng で.
9|tro|～は ～に あります|N は nơi に あります/います|N ở (nơi)|{トイレ/は/あそこ[に]/あります}。|Nhà vệ sinh ở đằng kia.|で;を;が|Khi nói vật đã biết ở đâu: N は ～に あります.
10|tro|～を（tân ngữ）|N を V|làm (gì đó với N)|{毎朝/コーヒー[を]/のんで/から}出かけます。|Mỗi sáng uống cà phê rồi mới ra ngoài.|に;で;へ|を đánh dấu đối tượng của hành động, đọc là "o".
11|tro|～に（thời điểm）|thời gian cụ thể + に|vào lúc|{わたしは/毎朝/6時[に]/おきます}。|Mỗi sáng tôi dậy lúc 6 giờ.|で;を;へ|Giờ, ngày, tháng, năm cụ thể dùng に. Không dùng に với きょう, あした, 毎日….
12|tro|～へ／～に（hướng đi）|nơi へ/に 行きます・来ます・帰ります|đi / đến / về (đâu)|{あした/友だちと/京都[へ]/行きます}。|Ngày mai tôi đi Kyoto với bạn.|で;を;が|へ đọc là "e", nhấn hướng đi; に nhấn điểm đến. Cả hai đều đúng với 行く/来る/帰る.
13|tro|～で（nơi hành động）|nơi で V|làm gì ở (nơi)|{きのう/デパート[で]/くつを/買いました}。|Hôm qua tôi mua giày ở cửa hàng bách hóa.|に;を;へ|Nơi diễn ra hành động dùng で; nơi tồn tại dùng に.
14|tro|～で（phương tiện, cách）|N で V|bằng (phương tiện, công cụ, ngôn ngữ)|{わたしは/毎日/じてんしゃ[で]/学校へ}行きます。|Hằng ngày tôi đi học bằng xe đạp.|を;に;が|Đi bộ thì nói 歩いて, không nói ×足で.
15|tro|～と（cùng ai）|người と V|cùng với (ai)|{日曜日に/かぞく[と]/こうえんへ/行きました}。|Chủ nhật tôi đã đi công viên cùng gia đình.|を;に;が|Một mình: ひとりで (không dùng と).
16|tro|～と（liệt kê đủ）|N1 と N2|N1 và N2 (kể hết)|{れいぞうこに/たまご[と]/ぎゅうにゅうが/あります}。|Trong tủ lạnh có trứng và sữa.|も;を;で|と kể đủ hết; や kể một vài ví dụ.
17|tro|～や～（など）|N1 や N2（など）|N1, N2… (kể vài ví dụ)|{かばんの中に/本[や]/ノートなどが/あります}。|Trong cặp có sách, vở, v.v.|を;で;へ|や ngụ ý còn thứ khác; thường đi với など.
18|tro|～から～まで|N1 から N2 まで|từ N1 đến N2|{ぎんこうは/9時[から]/3時まで/です}。|Ngân hàng mở từ 9 giờ đến 3 giờ.|まで;に;で|Dùng cho cả thời gian và địa điểm.
19|cn|～に あげます|người nhận に N を あげます|cho, tặng (ai)|{わたしは/ははに/花[を]/あげました}。|Tôi đã tặng hoa cho mẹ.|に;で;が|Người cho là chủ ngữ. Không dùng あげる khi người khác cho mình (dùng くれる).
20|cn|～に／から もらいます|người cho に/から N を もらいます|nhận (từ ai)|{わたしは/友だち[に]/プレゼントを/もらいました}。|Tôi đã nhận quà từ bạn.|を;で;へ|Người nhận là chủ ngữ. に và から đều được.
21|tro|～が すきです／きらいです|N が すきです/きらいです|thích / ghét N|{わたしは/りんご[が]/とても/すきです}。|Tôi rất thích táo.|を;で;に|Đối tượng của すき, きらい, じょうず, わかる… dùng が, không dùng を.
22|tro|～が じょうずです／へたです|N が じょうず/へた です|giỏi / kém N|{ランさんは/りょうり[が]/じょうず/です}。|Lan nấu ăn giỏi.|を;で;に|Không dùng じょうず cho bản thân (khiêm tốn: とくいです).
23|tro|～が わかります|N が わかります|hiểu, biết N|{わたしは/かんじ[が]/すこし/わかります}。|Tôi hiểu một chút chữ Hán.|を;で;に|わかる dùng が cho đối tượng.
24|nn|～から（lý do）|câu1 から、câu2|vì câu1 nên câu2|{じかんが/ない[から]/タクシーで/行きます}。|Vì không có thời gian nên tôi đi taxi.|まで;のに;ても|から nối sau thể lịch sự hoặc thể thường đều được.
25|nn|どうして～か|どうして ～か。―～からです|tại sao? – vì…|A：{どうして/きのう/休みました/[か]}。B：ねつが ありましたから。|A: Sao hôm qua bạn nghỉ? B: Vì tôi bị sốt.|ね;よ;を|Trả lời: ～からです.
26|tro|～が、～（nhưng）|câu1 が、câu2|câu1 nhưng câu2|{この店の/りょうりは/おいしいです[が]/高いです}。|Đồ ăn quán này ngon nhưng đắt.|を;に;へ|が nối 2 ý trái ngược; cũng dùng mở đầu câu: すみませんが….
27|yc|～ませんか（mời）|V ませんか|… không? (mời rủ)|こんど{いっしょに/えいがを/見に/[行きませんか]}。|Lần tới cùng đi xem phim không?|行きましたか;行きたかった;行っていますか|Mời rủ lịch sự; trả lời: いいですね / ちょっと….
28|yc|～ましょう|V ましょう|cùng … nào|{ちょっと/つかれましたね。/すこし/[休みましょう]}。|Hơi mệt rồi nhỉ. Nghỉ một chút nào.|休むましょう;休みしょう;休んでましょう|Rủ cùng làm, hoặc đáp lời mời: ええ、行きましょう.
29|yc|～ましょうか（đề nghị giúp）|V ましょうか|để tôi … nhé?|にもつが おもそうですね。{その/にもつ/わたしが/[もちましょうか]}。|Hành lý có vẻ nặng nhỉ. Để tôi xách giúp nhé?|もちませんか;もってください;もちたいですか|Người nói tự đề nghị làm giúp. Khác ～ませんか (mời người khác cùng làm).
30|mm|～が ほしいです|N が ほしいです|muốn có N|{わたしは/あたらしい/パソコン[が]/ほしいです}。|Tôi muốn có máy tính mới.|を;で;に|Chỉ nói mong muốn của mình (hoặc hỏi người nghe). Người thứ ba: ほしがっています.
31|mm|Vたいです|V(bỏ ます) + たいです|muốn làm V|{なつやすみに/日本へ/[行きたい]/です}。|Kỳ nghỉ hè tôi muốn đi Nhật.|行きます;行って;行った|Đối tượng có thể dùng を hoặc が: 水が/を飲みたい.
32|mm|Vに 行きます（mục đích）|V(bỏ ます)/N する + に 行きます・来ます|đi để làm V|{デパートへ/くつを/[買いに]/行きます}。|Tôi đi bách hóa để mua giày.|買いで;買う;買った|Mục đích + に + động từ di chuyển. Danh từ する: 買い物に行きます.
33|yc|Vて ください|V て + ください|hãy làm V (nhờ, yêu cầu nhẹ)|{すみません、/もう一度/ゆっくり/[言ってください]}。|Xin lỗi, hãy nói lại một lần nữa thật chậm.|言いください;言ったください;言うください|Nhờ hoặc chỉ dẫn. Lịch sự hơn: ～てくださいませんか.
34|dt|Vて います（đang làm）|V て + います|đang làm V|{ミラーさんは/いま/でんわを/[かけています]}。|Bây giờ anh Miller đang gọi điện thoại.|かけてです;かけいます;かけるています|Hành động đang diễn ra.
35|dt|Vて います（trạng thái, thói quen）|V て + います|đang ở trạng thái; làm thường xuyên|{あには/大阪に/[住んでいます]/から、}よく あそびに 行きます。|Anh trai tôi sống ở Osaka nên tôi hay đến chơi.|住みましょう;住むています;住んであります|住む, 結婚する, 知る, 持つ… dùng ている chỉ trạng thái. "Không biết" là 知りません (không phải ×知っていません).
36|yc|Vても いいです|V て + も いいです|được phép làm V|{ここで/しゃしんを/[とっても]/いいですか}。|Ở đây chụp ảnh có được không?|とっては;とるも;とりて|Hỏi xin phép: ～てもいいですか. Trả lời không: すみません、ちょっと….
37|yc|Vては いけません|V て + は いけません|không được làm V (cấm)|{びじゅつかんの中で/たべものを/[たべては]/いけません}。|Không được ăn đồ ăn trong bảo tàng mỹ thuật.|たべても;たべなくても;たべるは|Cấm đoán mạnh, thường dùng cho quy định.
38|yc|Vないで ください|V ない + で ください|xin đừng làm V|{ここに/車を/[止めないで]/ください}。|Xin đừng đỗ xe ở đây.|止めなくて;止めずで;止めない|Nhờ người khác không làm. Nhẹ hơn ～てはいけません.
39|yc|Vなければ なりません|V ない → なければ なりません|phải làm V|{あしたまでに/レポートを/[出さなければ]/なりません}。|Phải nộp báo cáo trước ngày mai.|出さないで;出しても;出したら|Văn nói: ～なきゃ / ～ないと.
40|yc|Vなくても いいです|V ない → なくても いいです|không cần làm V cũng được|{あしたは/休みですから、/早く/[おきなくても]}いいです。|Ngày mai là ngày nghỉ nên không cần dậy sớm cũng được.|おきないも;おきるても;おきては|Trái nghĩa với ～なければなりません.
41|tg|Vて、Vて（trình tự）|V1 て、V2 て、V3|làm V1, rồi V2, rồi V3|{あさ おきて、/シャワーを/[あびて]/朝ごはんを}食べます。|Sáng dậy, tắm rồi ăn sáng.|あびます;あびたり;あびるて|Nối nhiều hành động theo thứ tự; thì của câu do động từ cuối quyết định.
42|tg|Vてから|V1 て + から、V2|sau khi V1 xong thì V2|{しゅくだいを/[してから]/テレビを/見ます}。|Làm bài tập xong rồi mới xem TV.|するてから;したまえに;してまえに|Nhấn mạnh V1 xong rồi mới V2.
43|tg|Vた あとで|V た / N の + あとで|sau khi V|{しごとが/[おわった]/あとで、/のみに}行きましょう。|Sau khi xong việc, đi uống nhé.|おわる;おわって;おわります|Danh từ: しょくじのあとで.
44|tg|Vる まえに|V る / N の + まえに|trước khi V|{ねる/[まえに]、/はを/みがきます}。|Trước khi ngủ tôi đánh răng.|あとで;まえで;ながら|Động từ trước まえに luôn ở thể る (từ điển), kể cả khi nói chuyện quá khứ.
45|tg|Vながら|V(bỏ ます) + ながら|vừa V1 vừa V2|{おんがくを/[ききながら]/べんきょう/します}。|Tôi vừa nghe nhạc vừa học.|きく;ききたり;きいてながら|Hành động chính đặt ở cuối câu.
46|tg|Vたり Vたり します|V1 たり V2 たり します|làm nào là V1, nào là V2 (kể vài việc)|{日曜日は/そうじを/[したり]/せんたくを}したりします。|Chủ nhật tôi lúc thì dọn dẹp, lúc thì giặt giũ.|しり;するたり;したら|Kể vài hành động tiêu biểu, không theo thứ tự.
47|kn|Vた ことが あります|V た + ことが あります|đã từng V (kinh nghiệm)|{わたしは/ふじさんに/[のぼった]/ことが}あります。|Tôi đã từng leo núi Phú Sĩ.|のぼりた;のぼって;のぼり|Kinh nghiệm trong quá khứ. Chưa từng: ～たことがありません.
48|kn|Vる ことが できます|V る / N + ことが できます|có thể làm V|{ミンさんは/ピアノを/[ひく]/ことが}できます。|Minh có thể chơi piano.|ひいた;ひいて;ひき|Danh từ: 日本語ができます.
49|kn|～く／に なります|Aい → く, Aな/N → に + なります|trở nên, trở thành|{4月に/なると、/[あたたかく]/なります}。|Sang tháng 4 trời trở nên ấm áp.|あたたかい;あたたかに;あたたかで|Tính từ い: さむい → さむくなる; tính từ な/danh từ: きれいになる, 先生になる.
50|tro|～くて／～で（nối tính từ）|Aい → くて; Aな/N → で|vừa…, lại… (nối tính từ)|{このへやは/[ひろくて]/あかるい/です}。|Căn phòng này rộng và sáng sủa.|ひろいで;ひろかって;ひろいと|いい → よくて; しずか → しずかで.
51|ss|～より ～の ほうが|N1 より N2 の ほうが ～|N2 … hơn N1|{バス/より/でんしゃの/[ほうが]}はやいです。|Tàu điện nhanh hơn xe buýt.|より;ほど;ぐらい|Câu hỏi: N1 と N2 と どちらが ～ですか.
52|ss|～と ～と どちらが|N1 と N2 と どちらが ～ですか|N1 và N2, cái nào … hơn?|{サッカーと/やきゅうと/[どちらが]/すき}ですか。|Bóng đá và bóng chày, bạn thích môn nào hơn?|どれが;だれが;なにが|So sánh 2 thứ dùng どちら; từ 3 thứ trở lên dùng どれ/なに/だれ.
53|ss|～の 中で ～が いちばん|N(nhóm) の 中で ～が いちばん ～|trong nhóm, … nhất|{くだものの/[中で]/何が/いちばん}すきですか。|Trong các loại trái cây, bạn thích loại nào nhất?|ほうが;より;ほど|Câu trả lời: ～が いちばん すきです.
54|ss|あまり～ません|あまり + phủ định|không … lắm|{このえいがは/[あまり]/おもしろく/ありません}。|Bộ phim này không hay lắm.|とても;ぜんぶ;たくさん|あまり luôn đi với thể phủ định.
55|ss|ぜんぜん～ません|ぜんぜん + phủ định|hoàn toàn không|{わたしは/おさけを/[ぜんぜん]/のみません}。|Tôi hoàn toàn không uống rượu.|とても;よく;たくさん|Mức độ phủ định mạnh hơn あまり.
56|tg|もう～ました|もう + V ました|đã … rồi|A：{もう/ひるごはんを/[食べました]/か}。B：はい、もう食べました。|A: Bạn ăn trưa chưa? B: Rồi, tôi ăn rồi.|食べるました;食べましょう;食べたい|Trả lời chưa: いいえ、まだです.
57|tg|まだ～ていません|まだ + V て いません|vẫn chưa làm V|{レポートは/まだ/[書いて]/いません}。|Báo cáo tôi vẫn chưa viết.|書き;書く;書いた|Không nói ×まだ書きませんでした.
58|pd|～でしょう|thể thường (bỏ だ) + でしょう|có lẽ (phỏng đoán)|{あしたは/雨が/[ふる]/でしょう}。|Ngày mai có lẽ trời mưa.|ふります;ふって;ふり|Dự báo, phỏng đoán. Lên giọng cuối = hỏi xác nhận: ～でしょう？
59|tg|～とき|V る/た, Aい, Aな+な, N+の + とき|khi …|{ひまな/[とき]、/よく/本を}読みます。|Những lúc rảnh tôi hay đọc sách.|まで;のに;から|Aな + な + とき; N + の + とき (子どもの とき).
60|tro|～は ～が（đặc điểm）|N1 は N2 が A|N1 thì N2 … (miêu tả đặc điểm)|{ぞう/は/はな[が]/ながいです}。|Voi thì vòi dài.|を;で;に|Chủ đề là N1, đặc điểm là N2 が A: 東京は人が多い.
61|tro|～だけ|N / số lượng + だけ|chỉ|{きょうは/五百円[だけ]/もって/います}。|Hôm nay tôi chỉ mang 500 yên.|しか;より;まで|だけ đi với khẳng định; しか đi với phủ định (N4).
62|tro|～ぐらい／～ごろ|số lượng + ぐらい; giờ + ごろ|khoảng (lượng) / khoảng (thời điểm)|{いえから/えきまで/10分[ぐらい]/かかります}。|Từ nhà đến ga mất khoảng 10 phút.|ごろ;まで;に|ぐらい/くらい cho lượng, thời lượng; ごろ cho thời điểm (7時ごろ).
63|tro|～に ～回（tần suất）|khoảng thời gian に + số lần|… lần trong (thời gian)|{わたしは/1週間[に]/3回/プールへ}行きます。|Tôi đi bể bơi 3 lần một tuần.|へ;を;が|1日に3回 (3 lần một ngày).
64|tro|Tính từ + danh từ|Aい + N; Aな + な + N|N (có tính chất) …|{これは/とても/[ゆうめいな]/おてら}です。|Đây là ngôi chùa rất nổi tiếng.|ゆうめい;ゆうめいの;ゆうめいだ|Tính từ な phải có な khi đứng trước danh từ.
65|tro|～ね|câu + ね|… nhỉ (mong đồng tình)|A：{きょうは/ほんとうに/あつい/です[ね]}。B：そうですね。|A: Hôm nay nóng nhỉ. B: Đúng vậy nhỉ.|を;へ;で|Tìm sự đồng tình; よ là cho người nghe biết thông tin mới.
66|tro|～よ|câu + よ|… đấy (báo thông tin mới)|{あのレストランは/安くて/おいしい/です[よ]}。|Nhà hàng kia rẻ mà ngon đấy.|を;へ;に|Thông báo điều người nghe chưa biết, nhấn mạnh ý kiến.
67|tro|Mệnh đề + N (định ngữ)|V/A thể thường + N|N mà …|{これは/きのう/[買った]/本}です。|Đây là quyển sách tôi mua hôm qua.|買いました;買って;買い|Chủ ngữ trong mệnh đề định ngữ dùng が (không dùng は): 母が作ったりょうり.
68|yc|～を ください|N を ください|cho tôi N (gọi món, mua hàng)|{すみません、/コーヒー[を]/ふたつ/ください}。|Xin lỗi, cho tôi 2 cà phê.|に;が;で|Có số lượng: N を + số + ください.
69|tro|～を（rời khỏi, đi qua）|nơi を 出ます/おります; nơi を さんぽします・わたります|rời khỏi; đi qua, dọc theo|{毎朝/7時に/うち[を]/出ます}。|Mỗi sáng tôi ra khỏi nhà lúc 7 giờ.|に;で;へ|Rời khỏi: 家を出る, 電車を降りる. Đi qua: 公園を散歩する, 道を渡る.
70|tro|～に のります|xe に のります|lên (xe, tàu…)|{えきで/でんしゃ[に]/のって、/会社へ}行きます。|Lên tàu ở ga rồi đi đến công ty.|を;で;へ|Lên xe: に のる. Xuống xe: を おりる.
71|mm|～に します（chọn）|N に します|chọn N, quyết định N|A：何に しますか。B：{わたしは/あたたかい/コーヒー[に]/します}。|A: Bạn dùng gì? B: Tôi chọn cà phê.|を;で;が|Hay dùng khi gọi món, chọn đồ.
72|tro|～かったです／～でした（quá khứ tính từ）|Aい → かったです; Aな/N → でした|đã (quá khứ của tính từ)|{きのうの/パーティーは/とても/[たのしかった]}です。|Bữa tiệc hôm qua rất vui.|たのしいでした;たのしくて;たのしかって|Không nói ×たのしいでした. いい → よかったです.
73|dt|～ませんでした|V ませんでした|đã không làm V|{きのうは/あたまが いたくて、/なにも/[食べませんでした]}。|Hôm qua đau đầu nên tôi không ăn gì cả.|食べません;食べないでした;食べましょう|Quá khứ phủ định lịch sự.
74|tro|～く／～に + V（trạng từ）|Aい → く; Aな → に + V|(làm) một cách …|{じを/もっと/[きれいに]/書いて}ください。|Hãy viết chữ đẹp hơn nữa.|きれいな;きれいで;きれいく|はやい → はやく起きる; しずか → しずかに話す.
75|tro|～か～（hoặc）|N1 か N2|N1 hoặc N2|{のみものは/コーヒー[か]/こうちゃが/いいです}。|Đồ uống thì cà phê hoặc hồng trà là được.|も;を;で|Chọn 1 trong 2.
76|tro|何も～ません|từ để hỏi + も + phủ định|không … gì cả|{けさは/[なにも]/食べません/でした}。|Sáng nay tôi không ăn gì cả.|なにか;なにが;なにを|だれも (không ai), どこも/どこへも (không đâu).
77|tro|なにか／だれか／どこか|từ để hỏi + か|cái gì đó, ai đó, đâu đó|のどが かわきましたね。{あそこで/[なにか]/つめたい ものを/のみ}ませんか。|Khát nước nhỉ. Uống gì đó mát mát ở đằng kia không?|なにも;なにを;なにが|Câu hỏi có か: なにか買いましたか (có mua gì không?).
`);

GRAM.N4 = L(`
1|kn|Thể khả năng（～える／～られる）|nhóm 1: う→える; nhóm 2: る→られる; する→できる, 来る→来られる|có thể làm|{わたしは/かんじを/200ぐらい/[読めます]}。|Tôi đọc được khoảng 200 chữ Hán.|読められます;読まれます;読ませます|Đối tượng thường đổi を → が: 日本語が話せます.
2|kn|～が 見えます／聞こえます|N が 見えます / 聞こえます|nhìn thấy / nghe thấy (tự nhiên)|{へやの まどから/ふじさん[が]/よく/見えます}。|Từ cửa sổ phòng nhìn thấy rõ núi Phú Sĩ.|を;で;に|見える/聞こえる: tự nhiên lọt vào mắt/tai. 見られる/聞ける: có điều kiện để xem/nghe.
3|kn|～ように なりました|V る(khả năng) + ように なる; Vない + ように なる|đã trở nên (có thể / không còn)|{日本へ 来て、/なっとうが/[食べられる]/ように}なりました。|Sang Nhật rồi tôi đã ăn được natto.|食べられた;食べて;食べられて|Diễn tả thay đổi dần về khả năng, thói quen.
4|yc|～ように します|V る / V ない + ように します|cố gắng (tập thói quen)|{けんこうの ために、/毎日/[歩く]/ように}しています。|Vì sức khỏe, tôi cố gắng đi bộ hằng ngày.|歩いた;歩いて;歩き|Nhờ người khác: ～ように してください.
5|mm|～ように（mục đích）|V khả năng / V không chủ ý / V ない + ように|để (đạt trạng thái)|{うしろの 人にも/[聞こえる]/ように/大きい声で}話してください。|Hãy nói to để người phía sau cũng nghe thấy.|聞こえて;聞いた;聞こえた|Trước ように là động từ không chủ ý (可能形, わかる, 見える…) hoặc thể ない.
6|mm|～ために（mục đích）|V る(chủ ý) / N の + ために|để, vì (mục đích có chủ ý)|{家を/[買う]/ために/お金を}ためています。|Tôi đang để dành tiền để mua nhà.|買える;買った;買って|Trước ために là động từ chủ ý. So sánh: ～ように đi với động từ không chủ ý.
7|kh|～のに（dùng để）|V る + のに / N に + 使う・いい・必要だ|dùng để, cho việc|{このはさみは/花を/[切る]/のに}使います。|Cái kéo này dùng để cắt hoa.|切った;切って;切り|Thường đi với 使います, いいです, 便利です, 必要です, かかります.
8|dt|Vて しまいます（xong hết）|V て + しまいます|làm xong hết|{この本は/きのう/ぜんぶ/[読んでしまいました]}。|Quyển sách này hôm qua tôi đã đọc hết rồi.|読んでしまいます;読みでしまいました;読むでしまいました|Nhấn mạnh hoàn tất. Văn nói: ～ちゃう/～じゃう.
9|dt|Vて しまいました（lỡ, tiếc）|V て + しまいました|lỡ làm, trót (tiếc nuối)|{でんしゃに/かさを/[わすれて]/しまいました}。|Tôi lỡ để quên ô trên tàu.|わすれ;わすれる;わすれた|Diễn tả sự tiếc nuối, rắc rối.
10|dt|Vて おきます|V て + おきます|làm sẵn, làm trước (để chuẩn bị)|{りょこうの まえに/ホテルを/[よやくして]/おきます}。|Trước chuyến đi tôi đặt khách sạn trước.|よやくし;よやくする;よやくした|Còn nghĩa "để nguyên": そのままに しておいてください.
11|dt|Vて あります|V(tha động từ) て + あります|(ai đó) đã làm sẵn, vẫn còn trạng thái|{かべに/カレンダーが/[はって]/あります}。|Trên tường có dán lịch.|はり;はる;はった|Dùng với tha động từ, nhấn kết quả có chủ ý. Tự động từ: ドアが開いています.
12|dt|Vて みます|V て + みます|thử làm V|{この くつを/ちょっと/[はいて]/みても}いいですか。|Tôi đi thử đôi giày này có được không?|はき;はく;はいた|Thử làm để biết kết quả.
13|tg|Vて いきます／きます|V て + いく / くる|đi (rồi), đến (rồi); dần dần|{ちょっと/コンビニで/パンを/[買ってきます]}。|Tôi đi mua bánh mì ở cửa hàng tiện lợi rồi về.|買いてきます;買ってくります;買うてきます|Còn chỉ thay đổi: これから寒くなっていく (sẽ lạnh dần), 寒くなってきた (đã lạnh dần lên).
14|tg|Vる ところです|V る + ところです|sắp sửa làm V|{いまから/ばんごはんを/[食べる]/ところです}。|Bây giờ tôi sắp ăn tối.|食べた;食べて;食べている|ところ = thời điểm. Vる: ngay trước; Vている: đang; Vた: vừa xong.
15|tg|Vて いる ところです|V て いる + ところです|đang đúng lúc làm V|{いま/そのことを/[しらべている]/ところです}。|Bây giờ tôi đang đúng lúc tìm hiểu việc đó.|しらべる;しらべた;しらべ|Nhấn đang ở giữa hành động.
16|tg|Vた ところです|V た + ところです|vừa mới làm V (xong)|{いま/えきに/[着いた]/ところです}。|Bây giờ tôi vừa đến ga.|着く;着いて;着き|Ngay sau khi xong. Khác ～たばかり (cảm giác chưa lâu, có thể vài ngày).
17|tg|Vた ばかりです|V た + ばかりです|vừa mới (theo cảm nhận)|{日本に/来た/[ばかり]/なので、}まだ日本語が分かりません。|Vì mới sang Nhật nên tôi chưa hiểu tiếng Nhật.|ほど;だけ;まで|Có thể dùng cho khoảng thời gian dài theo cảm giác người nói (先月結婚したばかり).
18|pd|～そうです（trông có vẻ）|V(bỏ ます) / Aい(bỏ い) / Aな + そうです|trông có vẻ, sắp|{このケーキは/とても/[おいしそう]/ですね}。|Cái bánh này trông có vẻ ngon quá nhỉ.|おいしいそう;おいしかったそう;おいしくそう|Nói từ những gì nhìn thấy. いい → よさそう, ない → なさそう. Động từ: 雨が降りそうです (sắp mưa).
19|pd|～そうです（nghe nói）|thể thường + そうです|nghe nói là|{天気よほうに よると/あしたは/雨が/[ふるそうです]}。|Theo dự báo thời tiết, nghe nói ngày mai trời mưa.|ふりそうです;ふろうそうです;ふったそうです|Truyền đạt thông tin nghe được. Nguồn tin: ～によると. Khác "そうです" dáng vẻ ở cách nối.
20|pd|～ようです|thể thường (Aな+な, N+の) + ようです|có vẻ như (suy đoán từ quan sát)|{となりの へやに/だれも/[いない]/ようです}。|Phòng bên cạnh có vẻ như không có ai.|いないの;いなかったの;いなさ|Suy luận dựa trên cảm nhận của người nói.
21|pd|～らしいです|thể thường (Aな, N không cần だ) + らしい|hình như, nghe đâu|{うわさでは/あの二人は/[けっこんする]/らしいです}。|Nghe đồn hai người đó hình như sẽ kết hôn.|けっこんしそう;けっこんしよう;けっこんして|Dựa vào thông tin nghe được, ít chắc chắn. Còn nghĩa "đúng chất": 男らしい.
22|pd|～みたいです|thể thường (Aな, N không cần だ) + みたい|hình như; giống như (văn nói)|{かぜを/ひいた/[みたい]/です}。|Hình như tôi bị cảm rồi.|ため;ほど;ので|Văn nói của ～ようです.
23|pd|～かもしれません|thể thường (Aな, N không cần だ) + かもしれません|có lẽ, không chừng|{あの人は/ミンさんの/おねえさん/[かもしれません]}。|Người kia không chừng là chị của Minh.|そうです;ようにします;ことがあります|Khả năng khoảng 50%; thấp hơn でしょう.
24|pd|～はずです|thể thường (Aな+な, N+の) + はずです|chắc chắn là (theo lý)|{かれは/もう/うちに/[着いた]}はずです。|Chắc chắn anh ấy đã về đến nhà rồi.|着いて;着き;着こう|Có căn cứ, suy luận logic.
25|pd|～はずが ありません|thể thường + はずが ありません|không thể nào|{あんなに/れんしゅうしたから、/[まける]/はずが}ありません。|Đã luyện tập đến thế thì không thể nào thua.|まけて;まけた;まけよう|Phủ định mạnh khả năng.
26|pd|～と 思います|thể thường + と 思います|tôi nghĩ là|{あしたの しあいは/日本が/[かつ]/と}思います。|Tôi nghĩ trận đấu ngày mai Nhật sẽ thắng.|かちます;かって;かち|Danh từ/tính từ な + だ + と思います.
27|pd|～と 言いました|câu trích dẫn + と 言いました|đã nói rằng|{田中さんは/あした/[休む]/と}言っていました。|Anh Tanaka đã nói là mai nghỉ.|休みに;休んで;休もうに|Truyền lời: ～と言っていました. Trích nguyên văn: 「…」と言いました.
28|mm|意向形 + と 思って います|V ý chí (～おう/～よう) + と思っています|định làm|{来年/日本の 大学に/[入ろう]/と}思っています。|Năm sau tôi định vào đại học ở Nhật.|入る;入って;入り|Ý định đã nghĩ từ trước. 意向形: 行く→行こう, 食べる→食べよう, する→しよう.
29|mm|～つもりです|V る / V ない + つもりです|định, dự định|{なつやすみは/くにへ/[帰らない]/つもりです}。|Kỳ nghỉ hè tôi định không về nước.|帰らなく;帰りません;帰らないで|Quyết tâm rõ hơn ～ようと思う.
30|mm|～予定です|V る / N の + 予定です|dự kiến|{かいぎは/3時に/[おわる]/予定です}。|Cuộc họp dự kiến kết thúc lúc 3 giờ.|おわって;おわり;おわった|Kế hoạch đã định (không phụ thuộc ý muốn cá nhân).
31|dk|～と（điều kiện tất yếu）|V る / V ない + と|hễ … thì (luôn)|{この ボタンを/[おす]/と、/きっぷが}出ます。|Hễ ấn nút này là vé ra.|おした;おすて;おしと|Kết quả tự nhiên, tất yếu. Vế sau không dùng ý chí, nhờ vả.
32|dk|～ば|V: う→えば; Aい→ければ; Aな/N→なら(ば)|nếu|{ちずを/[見れば]/すぐ/わかります}。|Nếu xem bản đồ thì hiểu ngay.|見るば;見ればと;見たれば|Nhấn điều kiện cần. いい → よければ, ない → なければ.
33|dk|～たら（giả định）|V た / A かった / N だった + ら|nếu, khi … thì|{お金が/[あったら]/世界中を/旅行}したいです。|Nếu có tiền tôi muốn đi du lịch khắp thế giới.|あるたら;あったれば;あっては|Dùng rộng nhất; vế sau dùng được ý chí, nhờ vả.
34|tg|～たら（sau khi, phát hiện）|V た + ら|sau khi; khi (đã làm) thì thấy|{駅に/[着いたら]/電話して/ください}。|Khi đến ga thì gọi điện cho tôi nhé.|着くと;着きたら;着いて|Chắc chắn xảy ra. 窓を開けたら、雪が降っていた (mở cửa thì thấy tuyết).
35|dk|～なら|thể thường (N, Aな không cần だ) + なら|nếu (là) … thì|A：きょうとへ 行きたいんです。B：{きょうと/[なら]/秋が/いい}ですよ。|A: Tôi muốn đi Kyoto. B: Nếu là Kyoto thì mùa thu đẹp đấy.|たら;と;ば|Tiếp nhận chủ đề người kia nói rồi khuyên.
36|dk|～ても／～でも|V て / Aい → くて / Aな, N + で + も|dù … cũng|{雨が/[ふっても]/しあいは/あります}。|Dù trời mưa trận đấu vẫn diễn ra.|ふりても;ふれば;ふると|Nghịch tiếp, giả định. いい → よくても.
37|dk|từ để hỏi + ～ても|何/どこ/いくら + ても|dù … (gì / đâu / bao nhiêu) đi nữa|{いくら/[考えても]/答えが/わかりません}。|Dù có nghĩ bao nhiêu cũng không tìm ra đáp án.|考えれば;考えたら;考えると|何回読んでもわからない.
38|nn|～のに（mặc dù）|thể thường (Aな, N + な) + のに|mặc dù … vậy mà (bất mãn, ngạc nhiên)|{やくそくしたのに、/かれは/[来ません]/でした}。|Đã hẹn rồi vậy mà anh ta không đến.|来ます;来ましょう;来たい|Mang cảm xúc tiếc, bực. Vế sau không dùng ý chí, nhờ vả.
39|nn|～ので|thể thường (Aな, N + な) + ので|vì … nên (khách quan)|{ねつが/ある[ので]/きょうは/休ませて}ください。|Vì bị sốt nên cho tôi nghỉ hôm nay.|のに;けど;ても|Lịch sự, mềm hơn から; hay dùng khi xin phép, giải thích.
40|nn|～て／～くて（nguyên nhân）|V て, Aい → くて, Aな/N → で|vì … nên (cảm xúc, kết quả)|{ニュースを/[聞いて]/びっくり/しました}。|Nghe tin mà giật mình.|聞くから;聞けて;聞きに|Vế sau thường là cảm xúc, trạng thái (không có ý chí).
41|nn|～し、～し|thể thường + し|vừa … lại vừa (liệt kê lý do)|{この アパートは/駅に 近い[し]/やちんも/安いし}、いいですね。|Căn hộ này vừa gần ga lại vừa rẻ, tốt nhỉ.|のに;まで;ても|Liệt kê nhiều lý do; có thể chỉ nêu 1 lý do để ngầm còn lý do khác.
42|ss|～ば～ほど|V ば V る ほど; Aければ Aい ほど|càng … càng|{日本語は/[べんきょうすれば]/するほど/おもしろく}なります。|Tiếng Nhật càng học càng thấy thú vị.|べんきょうすると;べんきょうしても;べんきょうして|Lặp lại cùng động từ/tính từ.
43|ss|～すぎます|V(bỏ ます) / Aい(bỏ い) / Aな + すぎます|quá …|{ゆうべ/おさけを/[のみすぎて]、/あたまが}いたいです。|Tối qua uống rượu quá nhiều nên đau đầu.|のみたくて;のみやすくて;のみかたで|Mức độ vượt quá (thường tiêu cực). ない → なさすぎる.
44|ss|～やすい／～にくい|V(bỏ ます) + やすい/にくい|dễ / khó làm|{この ペンは/かるくて/[書きやすい]/です}。|Cây bút này nhẹ, dễ viết.|書いてやすい;書くやすい;書きにやすい|Chia như tính từ い: 書きやすくなる.
45|kh|～方（cách làm）|V(bỏ ます) + 方|cách làm V|{この かんじの/[読み方]/を/教えて}ください。|Hãy chỉ tôi cách đọc chữ Hán này.|読む方;読んで方;読み様|Tân ngữ đổi を → の: 漢字の書き方.
46|yc|～なさい|V(bỏ ます) + なさい|hãy (mệnh lệnh nhẹ: cha mẹ, thầy cô)|あしたも 学校でしょう。{もう/おそい/から/早く}[ねなさい]。|Mai còn đi học đấy. Muộn rồi, đi ngủ sớm đi!|ねろう;ねなさる;ねてなさい|Người trên nói với người dưới, hay dùng trong đề thi: 正しいものを選びなさい.
47|yc|Thể mệnh lệnh / cấm chỉ|mệnh lệnh: 行け, 食べろ, しろ; cấm: V る + な|làm đi! / không được làm!|{ここは/あぶないから/[入るな]/と書いて}あります。|Chỗ này nguy hiểm nên có ghi "Cấm vào".|入って;入ろう;入れば|Dùng trong biển báo, thể thao, nam giới nói mạnh.
48|kh|～ないで（không làm mà）|V ない + で|không làm A mà làm B; không làm A rồi B|{きょうは/かさを/[持たないで]/出かけました}。|Hôm nay tôi ra ngoài mà không mang ô.|持たなくて;持たずで;持たないに|Khác ～なくて (nguyên nhân): 雨が降らなくて困る.
49|kh|～ずに|V ない(bỏ ない) + ずに; する → せずに|không làm mà (văn viết)|{朝ごはんを/[食べずに]/会社へ/行きました}。|Tôi đi làm mà không ăn sáng.|食べないに;食べずで;食べなずに|Nghĩa như ～ないで nhưng trang trọng hơn.
50|kh|～まま|V た / V ない / N の / A + まま|để nguyên, giữ nguyên trạng thái|{くつを/[はいた]/まま/へやに}入らないでください。|Đừng đi nguyên giày vào phòng.|はく;はいて;はき|Trạng thái không đổi trong khi việc khác xảy ra.
51|tg|～あいだ／～あいだに|V る/ている, N の + あいだ（に）|trong suốt / trong khoảng|{母が/買い物を している/[あいだに]/へやを}そうじしました。|Trong lúc mẹ đi chợ, tôi đã dọn phòng.|うちを;までを;ころに|あいだ: suốt khoảng đó; あいだに: một lúc nào đó trong khoảng đó.
52|tg|～うちに|V る/ている/ない, Aい, Aな+な, N+の + うちに|trong lúc còn …, nhân lúc|{わかい/[うちに]/いろいろな 国へ/行ってみたい}です。|Tôi muốn đi nhiều nước khi còn trẻ.|まえに;あとに;までに|Làm trước khi trạng thái thay đổi.
53|tg|～までに|N / V る + までに|trước (hạn chót)|{この しゅくだいは/金曜日[までに]/出して/ください}。|Bài tập này hãy nộp trước thứ Sáu.|まで;までで;ほど|まで: liên tục đến lúc đó; までに: hạn chót.
54|kh|～かどうか|thể thường (N, Aな không cần だ) + かどうか|có … hay không|{パーティーに/[行けるかどうか]/まだ/わかりません}。|Tôi chưa biết có đi dự tiệc được hay không.|行けるのに;行けるそうか;行けるように|Lồng câu hỏi có/không vào câu.
55|kh|từ để hỏi + ～か|từ để hỏi + thể thường + か|(lồng câu hỏi)|{かいぎが/[何時に]/始まるか/知っていますか}。|Bạn có biết cuộc họp bắt đầu mấy giờ không?|何時かに;何時まで;何時もに|Câu hỏi có từ để hỏi lồng vào câu lớn.
56|kh|～のは／～のが／～のを|V thể thường + の は/が/を|việc (danh từ hóa)|{わたしは/絵を/[かくのが]/すき}です。|Tôi thích vẽ tranh.|かくが;かくことに;かいたのに|～のを忘れる, ～のが好き, ～のは～だ (việc … là …).
57|mm|～ことに します|V る / V ない + ことに します|quyết định (bản thân)|{からだの ために、/たばこを/[やめる]/ことに}しました。|Vì sức khỏe tôi đã quyết định bỏ thuốc lá.|やめた;やめて;やめよう|Tự mình quyết định. ～ことにしている: quy tắc cá nhân.
58|mm|～ことに なりました|V る / V ない + ことに なりました|được quyết định (không phải do mình)|{来月から/大阪の 支店で/[働く]/ことに}なりました。|Từ tháng sau tôi sẽ làm việc ở chi nhánh Osaka.|働いた;働いて;働こう|Quyết định của tổ chức, hoàn cảnh. ～ことになっている: quy định.
59|kh|～ことが あります（thỉnh thoảng）|V る / V ない + ことが あります|thỉnh thoảng có khi|{わたしは/あさごはんを/[食べない]/ことが}あります。|Thỉnh thoảng tôi không ăn sáng.|食べなかった;食べなくて;食べず|Khác Vた ことがある (kinh nghiệm).
60|yc|～ように 言います／頼みます|V る / V ない + ように 言う・頼む・注意する|bảo / nhờ (ai) làm|{先生は/学生に/[ちこくしない]/ように}注意しました。|Thầy giáo nhắc học sinh không được đến muộn.|ちこくしないで;ちこくしなく;ちこくしないと|Truyền đạt gián tiếp lời nhờ, lệnh.
61|mm|～て ほしい|N に V て + ほしい|muốn (ai đó) làm|{母に/もっと/長く/[生きてほしい]}です。|Tôi muốn mẹ sống lâu hơn nữa.|生きたい;生きてもらう;生きがほしい|Mong muốn người khác làm. Không làm: ～ないでほしい.
62|yc|～て もらえませんか|V て + もらえませんか / いただけませんか|có thể … giúp tôi được không?|{すみません、/この 書類を/[コピーして]/いただけませんか}。|Xin lỗi, có thể photo giúp tôi giấy tờ này không?|コピーし;コピーする;コピーした|Lịch sự hơn ～てください; いただけませんか là lịch sự nhất.
63|cn|～て くれませんか|V て + くれませんか|làm giúp tôi … được không? (thân)|{ちょっと/この にもつを/[もって]/くれませんか}。|Cầm giúp tôi cái hành lý này một chút được không?|もち;もつ;もった|Dùng với người thân, ngang hàng.
64|cn|～て あげます|V て + あげます|làm cho (ai)|{わたしは/おとうとに/しゅくだいを/[教えてあげました]}。|Tôi đã giảng bài tập cho em trai.|教えてくれました;教えであげました;教えてあげりました|Không nói trực tiếp với người trên (nghe như ban ơn): ～ましょうか.
65|cn|～て くれます|(người khác) が V て + くれます|(ai đó) làm cho mình|{友だちが/車で/えきまで/[おくってくれました]}。|Bạn đã chở tôi ra ga bằng ô tô.|おくってくれりました;おくりてくれました;おくってくれるました|Người làm là chủ ngữ, người nhận là mình (hoặc người phe mình).
66|cn|～て もらいます|(mình) は người に V て + もらいます|được (ai đó) làm cho|{わたしは/田中さん[に]/日本語を/教えてもらいました}。|Tôi được anh Tanaka dạy tiếng Nhật.|が;を;で|Người nhận là chủ ngữ; người làm đi với に.
67|cn|くださる／いただく／さしあげる|kính ngữ của くれる / もらう / あげる|cho / nhận / tặng (với người trên)|{先生が/わたしに/本を/[くださいました]}。|Thầy giáo đã cho tôi quyển sách.|さしあげました;いただきました;あげました|Người trên cho mình: くださる; mình nhận từ người trên: いただく; mình tặng người trên: さしあげる.
68|bd|Thể bị động（～れる／～られる）|nhóm 1: う→あれる; nhóm 2: る→られる; する→される, 来る→来られる|bị, được (làm)|{わたしは/先生[に]/ほめられ/ました}。|Tôi được thầy giáo khen.|を;で;が|Người làm đi với に. Vật làm chủ ngữ: この寺は 300年前に 建てられました.
69|bd|Bị động gây phiền（迷惑の受身）|N に + V bị động|bị (làm phiền bởi)|{きのう/かえりに/雨[に]/ふられました}。|Hôm qua trên đường về tôi bị mắc mưa.|を;で;が|Người nói chịu ảnh hưởng xấu: 子どもに泣かれる, 隣の人に騒がれる.
70|bd|Thể sai khiến（～せる／～させる）|nhóm 1: う→あせる; nhóm 2: る→させる; する→させる, 来る→来させる|bắt, cho phép (ai làm)|{母は/子どもに/やさいを/[食べさせました]}。|Mẹ bắt con ăn rau.|食べさせりました;食べささせました;食べたがりました|Tự động từ: 子どもを 遊ばせる (để con chơi); tha động từ: 子どもに 野菜を食べさせる.
71|yc|～させて ください|V sai khiến て + ください / いただけませんか|xin cho phép tôi làm|{気分が わるいので、/きょうは/早く/[帰らせて]}ください。|Vì thấy không khỏe nên xin cho tôi về sớm hôm nay.|帰られて;帰らせりて;帰りたくて|Xin phép làm việc của mình.
72|bd|Sai khiến bị động（～させられる）|nhóm 1: う→あされる(あせられる); nhóm 2: る→させられる|bị bắt làm|{子どもの ころ、/母に/毎日/ピアノを}[れんしゅうさせられました]。|Hồi nhỏ ngày nào tôi cũng bị mẹ bắt tập piano.|れんしゅうさせました;れんしゅうされました;れんしゅうさせれました|Bị ép làm việc mình không muốn. 飲む → 飲まされる.
73|kg|お～に なります|お + V(bỏ ます) + に なります|(tôn kính) người trên làm|{社長は/もう/[お帰りに]/なりました}。|Giám đốc đã về rồi ạ.|お帰りし;お帰って;お帰りして|Tôn kính hành động của người trên. Không dùng cho 見る, 寝る… (có từ riêng).
74|kg|～れる／～られる（tôn kính）|giống thể bị động|(tôn kính, mức nhẹ)|{先生は/毎朝/何時に/[起きられます]}か。|Thầy thường dậy lúc mấy giờ ạ?|起きさせます;起きております;お起きします|Mức kính nhẹ, hay dùng trong công việc, tin tức.
75|kg|Tôn kính ngữ đặc biệt|いらっしゃる, めしあがる, おっしゃる, ごらんになる, なさる|(tôn kính) ở/đi/đến, ăn, nói, xem, làm|{どうぞ、/たくさん/[めしあがって]/ください}。|Xin mời dùng nhiều vào ạ.|いただいて;まいって;もうして|いる/行く/来る → いらっしゃる; 食べる/飲む → めしあがる; 言う → おっしゃる.
76|kg|お～します（khiêm nhường）|お + V(bỏ ます) + します / ご + N + します|(khiêm nhường) tôi làm (cho người trên)|{先生、/その/おにもつを/[お持ちしましょう]}か。|Thưa thầy, để em xách hành lý giúp ạ.|お持ちになりましょう;お持ちられ;お持ちくださいましょう|Hạ mình khi làm việc liên quan tới người trên. Danh từ Hán: ご案内します.
77|kg|Khiêm nhường ngữ đặc biệt|まいる, もうす, いたす, いただく, はいけんする, うかがう|(khiêm nhường) đi/đến, nói, làm, nhận/ăn, xem, hỏi/thăm|{はじめまして。/ベトナムから/来ました/ソンと[もうします]}。|Xin chào. Tôi tên là Sơn, đến từ Việt Nam.|おっしゃいます;いらっしゃいます;なさいます|言う → もうす; 行く/来る → まいる; する → いたす; いる → おる.
78|kg|～で ございます／～て おります|です → でございます; ている → ております|(lịch sự) là / đang|{お手洗いは/エレベーターの/右がわ/[でございます]}。|Nhà vệ sinh ở bên phải thang máy ạ.|でいらっしゃいます;でおります;でまいります|Hay dùng trong cửa hàng, khách sạn, thông báo.
79|nn|～んです|thể thường (Aな, N + な) + んです|là vì…, (giải thích, hỏi lý do)|A：どうしたんですか。B：{あたまが/[いたい]/ん/です}。|A: Bạn sao vậy? B: Tôi bị đau đầu.|いたいな;いたかって;いたく|Giải thích lý do, hỏi thêm thông tin. Văn viết: ～のです.
80|yc|～んですが、～|～んですが + nhờ vả/hỏi|… (mở đầu để nhờ/hỏi)|{日本語で/手紙を/[書いたんですが]/、ちょっと 見て}いただけませんか。|Tôi đã viết thư bằng tiếng Nhật, anh xem giúp tôi một chút được không?|書いたのに;書いたんでして;書いたんだから|Mở đầu tự nhiên trước khi nhờ.
81|kh|～という N|N1 という N2|N2 tên là N1|{これは/「さくら」/[という]/花}です。|Đây là loài hoa tên là "sakura".|といった;とする;のような|Giới thiệu tên gọi người nghe có thể chưa biết.
82|kh|～って（văn nói）|N って = という / は; câu って = と言っていた|(văn nói) gọi là; nghe nói|{田中さん、/あしたは/来られない/[って]}。|Nghe nói ngày mai anh Tanaka không đến được.|を;に;へ|Văn nói rất thông dụng.
83|tro|～しか～ない|N / số lượng + しか + phủ định|chỉ (ít, không đủ)|{さいふに/千円[しか]/あり/ません}。|Trong ví chỉ có 1000 yên.|だけ;ばかり;まで|しか luôn đi với phủ định, mang ý "ít quá".
84|tro|～ばかり（toàn là）|N ばかり / V て ばかり いる|toàn là, chỉ toàn|{弟は/まんが[ばかり]/読んで/います}。|Em trai tôi chỉ toàn đọc truyện tranh.|しか;ほど;だけで|Mang ý chê. Vて ばかり いる: suốt ngày chỉ làm.
85|tro|～だけで なく|thể thường (N) + だけでなく|không chỉ … mà còn|{この 店は/安い/[だけでなく]/サービスも}いいです。|Quán này không chỉ rẻ mà phục vụ cũng tốt.|しかなく;ばかりなく;までなく|Vế sau thường có も.
86|tro|～でも（ví dụ mời）|N + でも|… chẳng hạn (đề nghị nhẹ)|{つかれましたね。/コーヒー[でも]/のみ/ませんか}。|Mệt rồi nhỉ. Uống cà phê hay gì đó không?|しか;ほど;ばかり|Đưa ra ví dụ nhẹ nhàng khi mời, đề nghị.
87|tro|～とか～とか|N / thể thường + とか|nào là … nào là (văn nói)|{休みの 日は/えいが[とか]/かいものとかに/行きます}。|Ngày nghỉ tôi đi xem phim, mua sắm…|しか;ばかり;まで|Văn nói của ～や～など / ～たり～たり.
88|tro|～に ついて|N + について|về (chủ đề)|{日本の 文化[について]/レポートを/書いて/います}。|Tôi đang viết báo cáo về văn hóa Nhật Bản.|によって;として;にとって|Đi trước danh từ: N1 についての N2.
89|tro|～に よって（khác nhau tùy）|N + によって + ちがう/さまざま|tùy theo|{国[によって]/習慣が/ちがい/ます}。|Phong tục khác nhau tùy theo đất nước.|について;として;にとって|Còn nghĩa "bởi" trong bị động: この本は村上春樹によって書かれた.
90|pd|～に よると|N + によると、～そうです|theo (nguồn tin)|{テレビの ニュース[によると]/こんどの 台風は/大きい/そうです}。|Theo tin trên TV, cơn bão lần này lớn lắm.|について;によって;にとって|Thường đi với ～そうです/～らしいです ở cuối câu.
91|ss|～ほど～ない|N + ほど + Aく ない|không … bằng N|{ことしの なつは/きょねん[ほど]/あつく/ありません}。|Mùa hè năm nay không nóng bằng năm ngoái.|まで;のほうが;ぐらいが|So sánh phủ định.
92|dk|～ば よかった|V ば + よかった|giá mà đã … (hối tiếc)|{もっと/まじめに/[べんきょうすれば]/よかった}。|Giá mà mình học hành nghiêm túc hơn.|べんきょうするば;べんきょうすると;べんきょうして|Hối tiếc việc đã không làm. ～なければよかった: giá đừng làm.
93|yc|～ほうが いいです|V た / V ない + ほうが いいです|nên (khuyên)|{かぜの ときは/はやく/[ねた]/ほうが}いいですよ。|Khi bị cảm thì nên ngủ sớm đấy.|ねって;ねて;ねれば|Khẳng định thường dùng V た; phủ định dùng V ない.
94|yc|～たら どうですか|V た + ら どうですか|thử … xem sao (gợi ý)|{そんなに つかれているなら、/少し/[休んだら]/どうですか}。|Nếu mệt thế thì nghỉ một chút thì sao?|休むと;休めば;休んで|Gợi ý nhẹ; không dùng với người trên.
95|kh|～ば いいですか|V ば / V たら + いいですか|nên làm thế nào thì được?|{この 漢字は/どう/[書けば]/いいですか}。|Chữ Hán này nên viết thế nào?|書きば;書いて;書けて|Xin lời khuyên, chỉ dẫn.
96|kh|～ような N／～みたいな N|N の + ような; N + みたいな|N như là, giống như (ví dụ)|{わたしも/田中さん[のような]/やさしい/人に}なりたいです。|Tôi cũng muốn trở thành người hiền như anh Tanaka.|のように;そうな;らしく|Đứng trước danh từ. Trước động từ, tính từ: ～のように.
97|kh|～とおりに|V る/た, N の + とおりに|theo đúng như|{せつめいしょに 書いてある/[とおりに]/組み立てて/ください}。|Hãy lắp ráp đúng theo hướng dẫn ghi trong sách.|ように;ばかりに;までに|N + どおりに: 予定どおりに.
98|mm|～がる|Aい(bỏ い) / Aな + がる; V たがる|(người thứ ba) muốn, tỏ ra|{むすこは/新しい ゲームを/[ほしがって]/います}。|Con trai tôi đang muốn có trò chơi mới.|ほしいて;ほしくて;ほしそうて|Diễn tả cảm xúc của người khác qua biểu hiện.
99|kh|～く／～に します|Aい → く; Aな/N → に + します|làm cho (trở nên)|{すみません、/音を/少し/[小さく]}してください。|Xin lỗi, vặn nhỏ âm thanh một chút giúp tôi.|小さい;小さな;小さに|Chủ động thay đổi. Khác ～くなる (tự thay đổi).
100|kh|～さ（danh từ hóa tính từ）|Aい(bỏ い) / Aな + さ|độ, sự (của tính từ)|{この はしの/[長さ]/は/どのぐらい}ですか。|Cây cầu này dài bao nhiêu?|長い;長く;長いの|大きさ, 重さ, 便利さ. いい → よさ.
101|kh|～てくる（bắt đầu thay đổi）|V て + くる|bắt đầu, dần dần (đến hiện tại)|日本へ 来て 半年、{だんだん/日本の/生活に/[なれてきました]}。|Sang Nhật được nửa năm, tôi dần dần quen với cuộc sống ở Nhật rồi.|なれてくりました;なれておきました;なれてみました|Thay đổi đến hiện tại; ～ていく: thay đổi từ giờ về sau.
102|kh|～出す|V(bỏ ます) + 出す|bỗng bắt đầu|{えきを/出たら、/きゅうに/雨が}[ふり出しました]。|Vừa ra khỏi ga thì trời bỗng đổ mưa.|ふって出しました;ふる出しました;ふり出させました|Bất ngờ bắt đầu; không dùng cho hành động có ý chí như ×食べ出す (dùng 食べ始める).
103|kh|～始める／～終わる／～続ける|V(bỏ ます) + 始める / 終わる / 続ける|bắt đầu / xong / tiếp tục|{この 本は/おもしろくて、/一日で/[読み終わりました]}。|Sách này hay nên tôi đọc xong trong một ngày.|読み出しました;読みつづけました;読みはじめました|雨が三日間降り続けた.
104|yc|～ても かまいません|V て + も かまいません|… cũng không sao|{ペンで/[書いても]/かまいません/か}。|Viết bằng bút bi cũng không sao chứ?|書いては;書くても;書けば|Lịch sự hơn ～てもいいです.
105|yc|～なくては いけない／～ないと|V ない → なくては いけない / ないと|phải|もう 11時だ。{あしたは/早いから/そろそろ/[ねないと]}。|11 giờ rồi. Mai phải dậy sớm nên phải đi ngủ thôi.|ねなくても;ねなくと;ねると|Văn nói: ～なくちゃ, ～なきゃ.
106|dk|～場合は|V る/た/ない, N の + 場合は|trong trường hợp|{火事の/[場合は]/エレベーターを/使わないで}ください。|Trường hợp hỏa hoạn, đừng dùng thang máy.|ときに;ために;ほどは|Hay dùng trong hướng dẫn, quy định.
107|kh|～ずつ|số lượng + ずつ|mỗi …, từng …|{この くすりは/1日に 3回、/2じょう[ずつ]/飲んでください}。|Thuốc này uống mỗi ngày 3 lần, mỗi lần 2 viên.|に;が;まで|Chia đều: 少しずつ (từng chút một).
108|dt|～ちゃう／～じゃう|= ～て しまう (văn nói)|(lỡ / xong hết) văn nói|{あっ、/ケーキ/ぜんぶ/[食べちゃった]}。|Á, lỡ ăn hết bánh mất rồi.|食べとく;食べてる;食べたって|～ておく → ～とく; ～ている → ～てる.
109|kh|～て すみません|V て + すみません / ありがとうございます|xin lỗi vì / cảm ơn vì|{きのうは/[手伝ってくれて]/ありがとう/ございました}。|Cảm ơn vì hôm qua đã giúp tôi.|手伝ってあげて;手伝わせて;手伝ってもらうて|Nêu lý do xin lỗi, cảm ơn: おそくなってすみません.
110|nn|～ために（nguyên nhân）|thể thường (N の, Aな な) + ために|vì, do (văn viết)|{大雪の/[ために]/でんしゃが/止まりました}。|Vì tuyết lớn nên tàu dừng chạy.|ように;のに;なら|Văn viết, thông báo. Cùng hình thức với ために (mục đích) – phân biệt theo nghĩa.
111|kh|～こと（mệnh lệnh văn viết）|V る / V ない + こと|phải / không được (quy định)|{じゅぎょう中は/けいたいを/[使わない]/こと}。|Trong giờ học không được dùng điện thoại.|使わなく;使わず;使わないで|Hay gặp trong nội quy, đề thi.
112|kh|～ように（như là）|N の / V + ように|như, giống như|{つぎの/[ように]/書いて/ください}。|Hãy viết như sau.|ような;そうに;らしく|まるで 夢の ように (như mơ).
113|kh|～と いう こと|câu + という こと|việc (là) …|{かれが/会社を やめた/[ということ]/を知って}いますか。|Bạn có biết chuyện anh ấy nghỉ việc không?|ということに;というもの;といったの|Gói một thông tin thành danh từ.
114|pd|～のでは ないでしょうか|thể thường + のでは ないでしょうか|chẳng phải là … sao (ý kiến mềm)|{この 計画は/少し/[むずかしい]/のでは}ないでしょうか。|Kế hoạch này chẳng phải hơi khó sao?|むずかしく;むずかしさ;むずかしくて|Nêu ý kiến một cách nhẹ nhàng, khiêm tốn.
`);
