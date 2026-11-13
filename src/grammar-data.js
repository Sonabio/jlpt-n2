/* ===== NGỮ PHÁP N5 → N1 (tự soạn) =====
   Mỗi dòng: id | nhóm | mẫu | cách nối | nghĩa | ví dụ | dịch | 3 đáp án nhiễu (cách nhau ;) | ghi chú
   Ví dụ: [..] = chỗ trống cho bài "Chọn mẫu đúng"; {a/b/c/d} = 4 mảnh đúng thứ tự cho bài "Sắp xếp câu ★".
   id cố định (lịch sử làm bài gắn theo id) → thêm mẫu mới thì dùng id mới, không đánh lại số. */
const GRAM_GROUPS = {
  tro: 'Trợ từ, câu cơ bản', dt: 'Thể động từ, trạng thái', yc: 'Nhờ, mời, cho phép, cấm, bắt buộc', mm: 'Mong muốn, ý định',
  tg: 'Thời gian, trình tự', ss: 'So sánh, mức độ', nn: 'Lý do, nguyên nhân', dk: 'Điều kiện, giả định', kn: 'Khả năng, kinh nghiệm, thay đổi',
  cn: 'Cho – nhận', pd: 'Phỏng đoán, nghe nói, dáng vẻ', bd: 'Bị động, sai khiến', kg: 'Kính ngữ',
  dl: 'Đối lập, nhượng bộ', qd: 'Quan điểm, đối tượng, phạm vi', tc: 'Tính chất, khuynh hướng', nm: 'Nhấn mạnh, cảm xúc', vn: 'Văn nói', kl: 'Đánh giá, khẳng định', kh: 'Khác'
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
GRAM.N3 = L(`
1|tg|～たとたん（に）|V た + とたん（に）|vừa … thì (ngay lập tức, bất ngờ)|{部屋に/[入った]/とたん/電話が}鳴った。|Vừa vào phòng thì điện thoại reo.|入る;入って;入っている|Vế sau là việc bất ngờ xảy ra ngoài ý muốn, không dùng cho hành động có chủ ý của người nói.
2|tg|～最中（に）|V ている / N の + 最中（に）|đúng lúc đang …|{試験の/[最中に]/おなかが/痛くなった}。|Đúng lúc đang thi thì bị đau bụng.|とたんに;うちで;ばかりに|Việc đang diễn ra ở cao trào thì bị xen ngang.
3|tg|～たびに|V る / N の + たびに|mỗi lần … (là lại)|{この 写真を/[見る]/たびに/子どものころを}思い出す。|Mỗi lần xem bức ảnh này tôi lại nhớ hồi bé.|見た;見て;見ない|Vế sau là việc lặp lại mỗi lần, thường là cảm xúc.
4|tg|～て からでないと|V て + からでないと / からでなければ|nếu chưa … thì không (thể)|{よく/[考えてから]/でないと/返事は}できません。|Chưa suy nghĩ kỹ thì không thể trả lời được.|考えるから;考えたから;考えながら|Vế sau mang nghĩa phủ định: không thể, không được.
5|tg|～ところへ／～ところに|V ている / V た / V ようとしている + ところへ|đúng lúc … thì (có người, việc đến)|{ちょうど/出かけようと している/[ところへ]/友だちが}来た。|Đúng lúc tôi định ra ngoài thì bạn đến.|ところを;ところで;ところが|Vế sau thường là 来る, 電話が かかる… làm thay đổi tình hình.
6|tg|～て 以来|V て + 以来; N + 以来|kể từ khi … (đến nay)|{日本に/[来て]/以来/一度も}国に 帰って いない。|Kể từ khi sang Nhật, tôi chưa về nước lần nào.|来た;来る;来ても|Trạng thái kéo dài từ một mốc trong quá khứ đến nay.
7|tg|～次第（ngay khi）|V ます (bỏ ます) + 次第|ngay sau khi … (sẽ làm)|{結果が/[わかり]/次第/ご連絡}します。|Ngay khi biết kết quả tôi sẽ liên lạc.|わかる;わかって;わかった|Lịch sự, dùng trong công việc. Vế sau là hành động có chủ ý, không dùng thì quá khứ.
8|tg|～と ともに|V る / N + と ともに|cùng với; đồng thời|{年を/[とる]/と ともに/体力が}落ちて きた。|Cùng với tuổi tác, thể lực giảm dần.|とった;とって;とり|Văn viết. Còn nghĩa "cùng với ai": 家族と ともに 暮らす.
9|tg|～に つれて|V る / N + に つれて|càng … thì càng (thay đổi theo)|{時間が/[たつ]/に つれて/悲しみも}うすれて いった。|Thời gian càng trôi, nỗi buồn càng phai.|たった;たって;たち|Hai vế đều là sự thay đổi dần dần. Gần nghĩa ～に したがって.
10|tg|～に したがって|V る / N + に したがって|càng … càng; làm theo|{上に/[のぼる]/に したがって/気温が}下がる。|Càng lên cao nhiệt độ càng giảm.|のぼった;のぼって;のぼれ|Nghĩa 2 "làm theo": 説明に したがって 操作する.
11|tc|～一方だ|V る + 一方だ|ngày càng … (một chiều, thường xấu)|{最近、/物価は/[上がる]/一方だ}。|Gần đây vật giá cứ tăng mãi.|上がった;上がって;上がり|Thay đổi chỉ theo một hướng, thường là chiều xấu.
12|tc|～つつ ある|V ます (bỏ ます) + つつ ある|đang dần dần …|{この 町の/人口は/[減り]/つつ ある}。|Dân số thị trấn này đang giảm dần.|減る;減って;減った|Văn viết. Thay đổi đang diễn ra từng chút.
13|kh|～ことに なって いる|V る / V ない + ことに なって いる|theo quy định là …|{この 寮では/夜10時に/[ドアを しめる]/ことに}なって いる。|Ký túc xá này quy định đóng cửa lúc 10 giờ tối.|ドアを しめた;ドアを しめて;ドアを しめよう|Quy định, lệ thường (không do mình quyết). Khác ～ことに して いる (thói quen tự đặt).
14|kh|～ことに して いる|V る / V ない + ことに して いる|có thói quen (tự đặt ra) …|{寝る 前には/スマホを/[見ない]/ことに}して いる。|Tôi tập thói quen không xem điện thoại trước khi ngủ.|見なく;見ず;見なくて|Tự quyết định và duy trì thành thói quen.
15|nn|～おかげで|thể thường (N の, Aな な) + おかげで|nhờ … mà (kết quả tốt)|{先生の/[おかげで]/試験に/合格}できました。|Nhờ thầy mà tôi đã đỗ kỳ thi.|せいで;くせに;ばかりに|Kết quả tốt. Kết quả xấu dùng ～せいで.
16|nn|～せいで／～せいか|thể thường (N の, Aな な) + せいで / せいか|tại vì … (kết quả xấu) / có lẽ tại …|{寝不足の/[せいで]/仕事で/ミスを}して しまった。|Tại thiếu ngủ mà tôi mắc lỗi trong công việc.|おかげで;くせに;わりに|せいか = "có lẽ tại" (không chắc chắn).
17|nn|～に よる（nguyên nhân）|N + に よる N / に よって|do, bởi (văn viết)|{大雨に/[よる]/事故が/増えて}いる。|Tai nạn do mưa lớn đang tăng.|よれば;ついて;とって|Văn viết, tin tức. Bổ nghĩa danh từ: ～に よる N.
18|nn|～ものだから／～もので|thể thường (N な, Aな な) + ものだから|vì (giải thích, biện minh)|{道が/こんで いた/[ものだから]/遅れて}しまいました。|Vì đường đông nên tôi đã đến muộn.|ものなら;ものの;ものか|Dùng khi giải thích, biện hộ lý do. Văn nói: もんだから.
19|nn|～からには|thể thường + からには|một khi đã … thì phải|{試合に/[出る]/からには/絶対に}勝ちたい。|Một khi đã ra thi đấu thì nhất định muốn thắng.|出よう;出て;出ろ|Vế sau: quyết tâm, nghĩa vụ (～たい, ～べきだ, ～つもりだ).
20|nn|～以上（は）|thể thường + 以上（は）|vì đã … nên (đương nhiên)|{約束を/した/[以上]/守らなければ}ならない。|Đã hứa rồi thì phải giữ lời.|以下;以外;以内|Gần nghĩa ～からには. Vế sau: nghĩa vụ, quyết tâm.
21|nn|～ばかりに|thể thường (Aな な / N である) + ばかりに|chỉ vì … mà (kết quả xấu)|{ちょっと/うそを ついた/[ばかりに]/友だちを}なくした。|Chỉ vì nói dối một chút mà mất bạn.|おかげで;たびに;うちに|Nguyên nhân nhỏ gây hậu quả lớn, tiếc nuối.
22|nn|～ことだから|N の + ことだから|vì là (người đó) nên chắc …|{まじめな/田中さんの/[ことだから]/約束は}守るだろう。|Anh Tanaka nghiêm túc nên chắc sẽ giữ lời hứa.|ものだから;ことなら;ことには|Dựa vào tính cách quen thuộc của người đó để phán đoán.
23|dk|～と したら／～と すれば|thể thường + と したら / と すれば|nếu giả sử …|{もし/宝くじが/[当たった]/と したら}何を 買いますか。|Giả sử trúng xổ số thì bạn mua gì?|当たって;当たり;当たれ|Giả định (có thể không có thật).
24|dk|～さえ～ば|N さえ + V ば; V ます さえ + すれば|chỉ cần … là (đủ)|{この 薬を/飲み[さえ]/すれば/すぐ}治ります。|Chỉ cần uống thuốc này là khỏi ngay.|まで;しか;ずつ|Điều kiện duy nhất cần có. N さえ あれば: chỉ cần có N.
25|dk|～ないことには|V ない / Aい くない + ことには|nếu không … thì (không thể)|{実際に/[やって みない]/ことには/わからない}。|Nếu không thử làm thực tế thì không biết được.|やって みる;やって みた;やって みよう|Vế sau mang nghĩa phủ định.
26|dl|～と しても|thể thường + と しても|cho dù (giả sử) … thì cũng|{たとえ/反対された/[と しても]/私は}留学します。|Cho dù bị phản đối, tôi vẫn đi du học.|と したら;と すれば;とおりに|Hay đi với たとえ. Vế sau: ý chí không đổi.
27|dl|～に しても／～に しろ|thể thường / N + に しても|cho dù … đi nữa|{いくら/忙しい/[に しても]/電話ぐらい}できるでしょう。|Dù bận đến đâu thì cũng gọi điện được chứ.|に しては;に とって;に 対して|にしろ, にせよ: văn viết hơn.
28|dk|～かぎり（は）|V る / V ている / N である + かぎり|chừng nào còn … (thì)|{私が/[生きて いる]/かぎり/この 店は}続けます。|Chừng nào tôi còn sống, cửa hàng này vẫn tiếp tục.|生きた;生きて;生きよう|Hai vế cùng duy trì.
29|dk|～ないかぎり|V ない + かぎり|chừng nào chưa / không … thì (không)|{本人が/[来ない]/かぎり/書類は}渡せません。|Chừng nào đương sự không đến thì không thể giao giấy tờ.|来なく;来ず;来ないで|Vế sau thường phủ định hoặc là kết quả xấu.
30|kh|～と 思ったら|V た + と 思ったら|vừa mới … thì đã (ngay)|{雨が/やんだ/[と 思ったら]/また}降り出した。|Vừa tưởng mưa tạnh thì lại mưa tiếp.|と 言ったら;と したら;と すれば|Hai việc liên tiếp, bất ngờ. Không dùng cho hành động của bản thân.
31|tg|～て はじめて|V て + はじめて|phải đến khi … mới|{病気に/[なって]/はじめて/健康の}大切さが 分かった。|Phải đến khi bị bệnh mới hiểu sức khỏe quan trọng.|なる;なった;なり|Nhận ra, hiểu ra sau một trải nghiệm.
32|kh|～ついでに|V る / V た / N の + ついでに|nhân tiện …|{駅へ/[行く]/ついでに/手紙を}出して きます。|Nhân tiện ra ga tôi đi gửi thư luôn.|行って;行き;行こう|Việc chính ở vế trước, việc làm thêm ở vế sau.
33|dl|～ながら（mặc dù）|V ます / Aい / Aな / N + ながら（も）|tuy … nhưng|{悪いと/[知り]/ながら/うそを}ついて しまった。|Biết là xấu mà vẫn nói dối.|知る;知って;知った|Hai vế trái ngược. Hay gặp: 残念ながら, 狭いながらも.
34|dl|～くせに|thể thường (N の, Aな な) + くせに|vậy mà, thế mà (chê trách)|{知って いる/[くせに]/何も/教えて}くれない。|Biết rõ vậy mà chẳng chỉ cho tôi gì.|おかげで;ものだから;からには|Chỉ trích, khó chịu. Chủ ngữ hai vế giống nhau. Mạnh hơn ～のに.
35|dl|～ものの|thể thường (Aな な / N である) + ものの|tuy … nhưng (thực tế không như mong)|{免許は/[取った]/ものの/ほとんど}運転して いない。|Tuy đã lấy bằng lái nhưng hầu như không lái xe.|取る;取って;取ろう|Văn viết. Thừa nhận vế trước nhưng vế sau không như mong đợi.
36|dl|～にも かかわらず|thể thường / N + にも かかわらず|mặc dù … (vậy mà)|{雨/[にも かかわらず]/たくさんの 人が/集まった}。|Mặc dù mưa nhưng rất nhiều người đã tập trung.|に 関わって;に 対して;に とって|Văn viết. Vế sau là kết quả trái với dự đoán.
37|dl|～わりに（は）|thể thường (N の, Aな な) + わりに|so với … thì (khác mong đợi)|{この 店は/値段の/[わりに]/おいしい}。|Quán này ngon so với giá tiền.|かわりに;ために;くせに|Kết quả khác với mức thông thường suy ra từ vế trước.
38|dl|～と いっても|thể thường + と いっても|tuy nói là … nhưng (thực ra không nhiều)|{料理が/できる/[と いっても]/簡単な ものだけ}です。|Nói là biết nấu ăn nhưng chỉ món đơn giản thôi.|と いえば;と いうと;と いうより|Giải thích thêm: mức độ thực tế thấp hơn người nghe nghĩ.
39|ss|～に しては|thể thường / N + に しては|so với (là …) thì (bất ngờ)|{初めて/作った/[に しては]/よく}できて いる。|So với lần đầu làm thì khá tốt.|に しても;に よっては;に 比べて|Đánh giá khác với tiêu chuẩn thường thấy của vế trước.
40|ss|～ほど（mức độ）|V る / Aい / N + ほど|đến mức …|{泣きたく/なる/[ほど]/悲しい 映画}だった。|Bộ phim buồn đến mức muốn khóc.|ばかり;ずつ;しか|Gần nghĩa ～くらい.
41|ss|～くらい／～ぐらい（mức độ）|V / Aい / N + くらい|ít nhất là …; đến mức …|{自分の 部屋/[くらい]/自分で/そうじ}しなさい。|Ít nhất phòng mình thì tự dọn đi.|ほど;ずつ;だけで|Nghĩa "ít nhất, tối thiểu" (coi là việc nhỏ) và "đến mức" (= ほど).
42|ss|～ほど～は ない|N ほど + Aい N は ない|không có gì … bằng|{家族ほど/[大切な]/もの/は}ない。|Không có gì quan trọng bằng gia đình.|大切だ;大切で;大切に|Diễn tả "nhất". = ～が 一番 ～.
43|ss|～くらいなら|V る + くらいなら|nếu phải … thì thà|{あの 人に/[頼む]/くらいなら/自分で}やる。|Nếu phải nhờ người đó thì thà tôi tự làm.|頼んだ;頼んで;頼め|Vế sau: thà làm cách khác (～ほうが いい, ～ほうが ましだ).
44|ss|～に 比べて|N + に 比べて / と 比べて|so với …|{去年に/[比べて]/今年は/雪が}多い。|So với năm ngoái thì năm nay tuyết nhiều.|よって;とって;ついて|Bổ nghĩa câu, thường nói về mức độ nhiều/ít, cao/thấp.
45|qd|～に 対して|N + に 対して|đối với (hướng tới); trái lại|{お客様に/[対して]/失礼な ことを/言っては}いけない。|Không được nói điều thất lễ với khách hàng.|とって;ついて;比べて|Nghĩa "trái lại": 兄は 背が 高いのに 対して、弟は 低い.
46|qd|～に とって|N + に とって|đối với (ai, xét từ góc độ)|{私に/[とって]/家族は/一番}大切です。|Đối với tôi, gia đình là quan trọng nhất.|対して;ついて;よって|Đánh giá từ lập trường của N: 大切だ, 難しい… Không đi với động từ hành động.
47|qd|～と して|N + と して|với tư cách là …|{留学生/[と して]/日本に/来ました}。|Tôi đến Nhật với tư cách du học sinh.|に とって;に ついて;に よって|～と しては = về mặt …, theo lập trường của ….
48|qd|～に 関して|N + に 関して / に 関する N|liên quan đến, về …|{この 問題に/[関して]/ご意見を/お聞かせ}ください。|Xin hãy cho biết ý kiến về vấn đề này.|よって;とって;比べて|Trang trọng hơn ～に ついて. Bổ nghĩa danh từ: ～に 関する N.
49|qd|～を はじめ（として）|N + を はじめ（として）|tiêu biểu là, trước tiên là …|{東京を/[はじめ]/大阪や 京都でも/コンサートを}行う。|Tổ chức hòa nhạc ở Tokyo, rồi cả Osaka và Kyoto.|こめて;問わず;もとに|Nêu ví dụ tiêu biểu nhất, sau đó đến những cái khác.
50|qd|～を 中心に|N + を 中心に（して／として）|lấy … làm trung tâm|{この 町は/駅を/[中心に]/発展して}きた。|Thị trấn này phát triển lấy nhà ga làm trung tâm.|こめて;はじめ;通して|Cũng dùng cho người, chủ đề: 若者を 中心に 人気が ある.
51|kh|～を こめて|N + を こめて|gửi gắm, dồn (tình cảm)|{母の ために/心を/[こめて]/セーターを}編んだ。|Tôi dồn hết tâm huyết đan áo len cho mẹ.|もとに;通して;はじめ|Đi với 心, 愛, 感謝, 願い….
52|qd|～を 通じて／～を 通して|N + を 通じて / を 通して|thông qua …; suốt (thời gian)|{友人を/[通じて]/彼女と/知り合った}。|Tôi quen cô ấy thông qua bạn.|こめて;もとに;中心に|Nghĩa 2 "suốt cả": 一年を 通じて 暖かい.
53|qd|～に おいて|N + に おいて / に おける N|tại, trong (văn viết, = で)|{入学式は/大ホールに/[おいて]/行われます}。|Lễ nhập học được tổ chức tại hội trường lớn.|対して;とって;ついて|Văn viết, trang trọng. Bổ nghĩa danh từ: ～に おける N.
54|qd|～から～に かけて|N から N に かけて|từ … đến … (khoảng, không rõ ranh giới)|{今夜から/明日の 朝に/[かけて]/大雨が}降るでしょう。|Từ tối nay đến sáng mai có lẽ sẽ mưa to.|ついて;とって;よって|Khác ～から～まで: chỉ khoảng ước chừng, thời gian hoặc nơi chốn.
55|qd|～に わたって|N (thời gian, phạm vi) + に わたって|suốt, trải dài khắp|{会議は/5時間に/[わたって]/続いた}。|Cuộc họp kéo dài suốt 5 tiếng.|かけて;ついて;対して|Nhấn mạnh phạm vi lớn: 全国に わたって.
56|qd|～に 沿って|N + に 沿って|dọc theo; theo (kế hoạch)|{川に/[沿って]/桜の 木が/並んで}いる。|Dọc theo sông có hàng cây anh đào.|対して;とって;よって|Nghĩa 2 "theo": 計画に 沿って 進める.
57|qd|～に 基づいて|N + に 基づいて / に 基づく N|dựa trên (căn cứ)|{この 映画は/事実に/[基づいて]/作られた}。|Bộ phim này được làm dựa trên sự thật.|対して;とって;関わって|Căn cứ chặt chẽ (luật, dữ liệu, sự thật). Khác ～を もとに (chất liệu).
58|qd|～を もとに（して）|N + を もとに|lấy … làm nền tảng, chất liệu|{自分の 経験を/[もとに]/小説を/書いた}。|Tôi viết tiểu thuyết dựa trên trải nghiệm của mình.|こめて;はじめ;めぐって|Lấy N làm chất liệu, gợi ý để tạo ra cái mới.
59|qd|～に 応じて|N + に 応じて / に 応じた N|tùy theo, đáp ứng theo|{レベルに/[応じて]/クラスを/選べます}。|Có thể chọn lớp tùy theo trình độ.|対して;とって;かけて|Thay đổi tương ứng với N (trình độ, nhu cầu, tuổi…).
60|qd|～に 代わって|N + に 代わって / N に 代わり|thay cho …|{社長に/[代わって]/私が/ごあいさつ}いたします。|Tôi xin thay mặt giám đốc gửi lời chào.|とって;沿って;関して|Làm thay ai; hoặc cái mới thay cái cũ: 手紙に 代わって メールが 使われる.
61|qd|～に 加えて|N + に 加えて|thêm vào, ngoài … ra còn|{雨に/[加えて]/風も/強く}なって きた。|Ngoài mưa ra, gió cũng mạnh dần lên.|対して;とって;沿って|Văn viết. Gần nghĩa ～だけで なく.
62|qd|～の もとで|N + の もとで|dưới (sự chỉ đạo, điều kiện)|{田中先生の/[もとで]/研究を/続けたい}。|Tôi muốn tiếp tục nghiên cứu dưới sự hướng dẫn của thầy Tanaka.|うえで;うちで;かわりに|Dưới sự bảo hộ, chỉ đạo, ảnh hưởng của ai/cái gì.
63|tc|～だらけ|N + だらけ|đầy, toàn là (không tốt)|{雨の 中で/遊んだので/服が/[どろだらけ]}に なった。|Chơi trong mưa nên quần áo dính đầy bùn.|どろがち;どろ気味;どろっぽい|Thường là thứ không tốt: まちがいだらけ, ほこりだらけ.
64|tc|～っぽい|N / V ます / Aい (bỏ い) + っぽい|có vẻ, hơi giống; hay …|{あの 人は/[忘れっぽい]/から/メモを}渡して おこう。|Người đó hay quên nên đưa giấy ghi chú cho chắc.|忘れがちな;忘れ気味;忘れだらけ|Hay … (tính cách): 怒りっぽい; giống: 子どもっぽい; màu: 白っぽい.
65|tc|～気味|N / V ます + 気味|hơi có vẻ, hơi bị …|{最近/少し/[かぜ気味]/なので}早く 寝ます。|Dạo này hơi cảm nên tôi ngủ sớm.|かぜっぽい;かぜがち;かぜだらけ|Dấu hiệu nhẹ, thường không tốt: 疲れ気味, 太り気味.
66|tc|～がち|V ます / N + がち|hay, dễ … (xu hướng xấu)|{冬は/[かぜを ひき]/がちだから/気を}つけて ください。|Mùa đông hay bị cảm nên hãy cẩn thận.|かぜを ひく;かぜを ひいた;かぜを ひいて|Xu hướng dễ xảy ra việc không tốt: 遅れがち, 病気がち.
67|tc|～らしい（đúng chất）|N + らしい|đúng kiểu, ra dáng …|{今日は/[春らしい]/暖かい/日です}。|Hôm nay là một ngày ấm áp đúng kiểu mùa xuân.|春そうな;春がちな;春だらけの|Khác らしい (nghe nói). Phủ định: 学生らしくない.
68|mm|～ようと する|V (thể ý chí) + と する|định, sắp sửa (thì …)|{家を/[出ようと]/した とき/雨が}降り出した。|Đúng lúc định ra khỏi nhà thì trời bắt đầu mưa.|出ると;出たいと;出るように|Định làm nhưng có việc chen vào; hoặc cố gắng làm.
69|mm|～ようと しない|V (thể ý chí) + と しない|không chịu …|{息子は/いくら 言っても/[勉強しようと]/しない}。|Con trai tôi nói mãi cũng không chịu học.|勉強すると;勉強したいと;勉強して|Dùng cho người khác (không dùng cho bản thân).
70|pd|～わけだ|thể thường (Aな な / N な・である) + わけだ|thảo nào; nghĩa là (kết luận hợp lý)|{10年も/住んで いたのだから、/日本語が/上手な[わけだ]}。|Sống 10 năm rồi nên thảo nào tiếng Nhật giỏi.|ばかりだ;ところだ;ものか|Kết luận hợp lý từ sự thật đã biết. = ～はずだ (thảo nào).
71|pd|～わけでは ない|thể thường + わけでは ない|không hẳn là …|{料理が/嫌いな/[わけでは ない]/が、}あまり 作らない。|Không phải tôi ghét nấu ăn, nhưng ít khi nấu.|わけが ない;わけに いかない;はずが ない|Phủ định một phần. = ～と いう わけでは ない.
72|pd|～わけが ない|thể thường (Aな な / N の) + わけが ない|không thể nào …|{あんなに/練習したんだから、/[負ける]/わけが ない}。|Đã luyện tập nhiều như thế thì không thể nào thua.|負けて;負け;負けよう|= ～はずが ない. Nói mạnh, chủ quan.
73|yc|～わけには いかない|V る + わけには いかない|không thể (vì đạo lý, hoàn cảnh)|{大事な 会議が/あるので、/休む/[わけには いかない]}。|Có cuộc họp quan trọng nên không thể nghỉ.|わけでは ない;わけが ない;ほか ない|Không phải không có khả năng, mà do trách nhiệm, đạo lý.
74|yc|～ない わけには いかない|V ない + わけには いかない|không thể không …|{先輩に/誘われたら、/[行かない]/わけには いかない}。|Được đàn anh rủ thì không thể không đi.|行く;行かず;行かなく|Phải làm vì hoàn cảnh, đạo lý.
75|kh|～ものだ（lẽ thường）|V る / Aい + ものだ|vốn dĩ là …; nên …|{人の 話は/最後まで/[聞く]/ものだ}。|Nghe người khác nói thì nên nghe đến hết.|聞いた;聞いて;聞こう|Lẽ thường, lời khuyên chung. Phủ định: ～ものでは ない.
76|kh|～たものだ（hồi tưởng）|V た + ものだ|hồi trước thường hay …|{子どものころは/よく この 川で/[泳いだ]/ものだ}。|Hồi bé tôi thường hay bơi ở con sông này.|泳ぐ;泳いで;泳ごう|Hồi tưởng thói quen trong quá khứ, có cảm xúc.
77|yc|～ことだ（lời khuyên）|V る / V ない + ことだ|nên …, tốt nhất là|{上手に なりたいなら、/毎日 日本語を/[話す]/ことだ}。|Muốn giỏi thì tốt nhất là nói tiếng Nhật mỗi ngày.|話した;話して;話そう|Lời khuyên trực tiếp, người trên nói với người dưới.
78|yc|～ことは ない|V る + ことは ない|không cần phải …|{簡単な テストだから/そんなに/[心配する]/ことは ない}よ。|Bài kiểm tra dễ nên không cần lo đến thế đâu.|心配した;心配して;心配しない|= ～必要は ない. Dùng để động viên.
79|nm|～ことに（cảm xúc）|V た / Aい / Aな な + ことに|thật là … (là)|{うれしい/[ことに]/友だちが/合格した}。|Thật vui là bạn tôi đã đỗ.|ものに;ことで;わけに|Văn viết. Nêu cảm xúc trước: 残念な ことに, 驚いた ことに.
80|yc|～べきだ／～べきでは ない|V る + べきだ (する → すべき)|nên / không nên (đạo lý)|{約束は/必ず/[守る]/べきだ}。|Lời hứa thì nhất định phải giữ.|守った;守って;守ら|Ý kiến mạnh về đạo lý. Không dùng cho luật lệ (dùng ～なければ ならない).
81|yc|～しか ない|V る + しか ない|chỉ còn cách …|{終電が ないので、/タクシーで/帰る/[しか ない]}。|Không còn chuyến tàu cuối nên chỉ còn cách về bằng taxi.|ほか ならない;わけが ない;ことは ない|Không có lựa chọn khác. = ～ほか ない.
82|yc|～ほか ない|V る + ほか（は）ない|đành phải, chỉ còn cách|{手伝う 人が/いないから、/自分で やる/[ほか ない]}。|Không có ai giúp nên đành tự làm.|わけが ない;ことは ない;べきでは ない|Văn viết hơn ～しか ない.
83|yc|～ざるを 得ない|V ない (bỏ ない) + ざるを 得ない|buộc phải, đành phải|{大雨なので/試合は/[中止せ]/ざるを 得ない}。|Mưa lớn nên buộc phải hủy trận đấu.|中止し;中止する;中止さ|Văn viết. Bị hoàn cảnh ép buộc. する → せざるを 得ない.
84|pd|～に 違いない|thể thường (N, Aな bỏ だ) + に 違いない|chắc chắn là …|{電気が ついて いるから、/彼は/家に いる/[に 違いない]}。|Đèn đang sáng nên chắc chắn anh ấy ở nhà.|に すぎない;に 限る;に 決まらない|Phán đoán có căn cứ, chắc chắn. Văn viết.
85|pd|～に 決まって いる|thể thường + に 決まって いる|chắc chắn, đương nhiên là|{毎日 練習して いる/チームが/[勝つ]/に 決まって いる}。|Đội luyện tập mỗi ngày thì chắc chắn sẽ thắng.|勝ち;勝って;勝とう|Văn nói, chủ quan hơn ～に 違いない.
86|pd|～おそれが ある|V る / N の + おそれが ある|có nguy cơ, e là (xấu)|{台風の 影響で/電車が/[止まる]/おそれが ある}。|Do ảnh hưởng bão, tàu có nguy cơ ngừng chạy.|止まった;止まって;止まり|Văn viết, tin tức. Chỉ dùng cho việc xấu.
87|pd|～とは 限らない|thể thường + とは 限らない|không hẳn, chưa chắc là|{値段が/高い ものが/いい/[とは 限らない]}。|Đồ đắt chưa chắc đã tốt.|ことは 限らない;とか 限らない;とは 限って|Hay đi với 必ずしも, いつも.
88|pd|～に すぎない|N / thể thường + に すぎない|chỉ là … mà thôi|{これは/私の/個人的な 意見/[に すぎない]}。|Đây chỉ là ý kiến cá nhân của tôi mà thôi.|に すぎる;に すまない;を すぎない|Nhấn mạnh "không hơn": 冗談に すぎない.
89|vn|～っけ|thể thường (thường quá khứ) + っけ|… nhỉ? (hỏi lại điều quên)|{あの 人の/名前、/[何だった]/っけ}。|Tên người đó là gì nhỉ?|何;何で;何だろう|Văn nói, tự hỏi hoặc hỏi lại điều mình đã quên.
90|pd|～とか（nghe nói）|thể thường + とか|nghe nói là … (không chắc)|{来月、/駅の 前に/新しい 店が/[できるとか]}。|Nghe nói tháng sau trước ga sẽ có cửa hàng mới.|できるとは;できるとも;できるとて|Văn nói, không chắc chắn như ～そうだ.
91|pd|～と いう ことだ（nghe nói）|thể thường + と いう ことだ|nghe nói là …|{天気予報に よると/明日は/雪が 降る/[と いう ことだ]}。|Theo dự báo thời tiết, nghe nói mai có tuyết.|と いう ものだ;と いう ばかりだ;と いう ほどだ|= ～そうだ, văn viết hơn. Còn nghĩa "tức là" (tóm lại).
92|vn|～んだって|thể thường (N な, Aな な) + んだって|nghe nói (văn nói)|{田中さん、/来月/結婚する/[んだって]}。|Nghe nói anh Tanaka tháng sau cưới đấy.|んでって;んだけ;だって|Văn nói thân mật. Lịch sự: ～そうです.
93|kh|～ことに なる（kết quả）|V る / V ない + ことに なる|rốt cuộc sẽ … (là)|{今 勉強しないと、/あとで/困る/[ことに なる]}よ。|Bây giờ không học thì sau này sẽ khổ đấy.|ことに する;ことに いる;ことで ある|Kết quả tất yếu. Khác N4 ～ことに なりました (được quyết định).
94|kh|～と いうより|N / thể thường + と いうより|nói là … thì đúng hơn là …|{今日は/暖かい/[と いうより]/暑い}くらいだ。|Hôm nay nói là ấm thì đúng hơn là nóng.|と いっても;と いえば;と いうと|A と いうより B = B đúng hơn A.
95|kh|～と いえば／～と いうと|N + と いえば / と いうと|nói đến … thì (liên tưởng)|{日本の 冬/[と いえば]/やっぱり/温泉}ですね。|Nói đến mùa đông Nhật Bản thì vẫn là suối nước nóng nhỉ.|と いっても;と いうより;と しても|Gợi ra điều liên tưởng đầu tiên.
96|kh|～とは（định nghĩa）|N + とは|… nghĩa là (định nghĩa)|{「チン」/[とは]/電子レンジで/温める}ことです。|"Chin" nghĩa là hâm nóng bằng lò vi sóng.|とか;とも;とに|Văn viết, dùng để định nghĩa. Văn nói: ～って.
97|kh|～と いうのは|N / câu + と いうのは|… nghĩa là, … là|{「JLPT」/[と いうのは]/日本語能力試験の/ことです}。|"JLPT" là Kỳ thi năng lực tiếng Nhật.|と いうなら;と いうから;と いうには|Cuối câu thường là ～ことだ / ～と いう 意味だ / ～からだ.
98|nm|～て たまらない|V て / Aい くて / Aな で + たまらない|… không chịu nổi, rất …|{歯が/[痛くて]/たまらない/ので}歯医者に 行った。|Đau răng không chịu nổi nên tôi đi nha sĩ.|痛い;痛く;痛かった|Cảm giác, cảm xúc rất mạnh của người nói.
99|nm|～て しょうがない／～て しかたが ない|V て / Aい くて / Aな で + しょうがない|… quá, không chịu được|{昨日 寝なかったので/朝から/[眠くて]/しょうがない}。|Hôm qua không ngủ nên từ sáng đã buồn ngủ không chịu được.|眠い;眠く;眠かった|Gần nghĩa ～て たまらない, văn nói hơn.
100|nm|～て ならない|V て / Aい くて / Aな で + ならない|… vô cùng (tự nhiên trào lên)|{一人で 住む/母の ことが/[心配で]/ならない}。|Tôi lo lắng vô cùng cho mẹ sống một mình.|心配な;心配だ;心配に|Cảm xúc tự trào lên không kìm được. Văn viết hơn たまらない.
101|nm|～ずには いられない|V ない (bỏ ない) + ずには いられない|không thể không …|{あの 映画を 見たら/だれでも/[泣か]/ずには いられない}。|Xem phim đó thì ai cũng không thể không khóc.|泣き;泣く;泣いて|する → せずには. Văn nói: ～ないでは いられない.
102|nm|～ばかりか|thể thường (N, Aな な) + ばかりか|không những … mà còn|{彼は/英語/[ばかりか]/中国語も}話せる。|Anh ấy không những nói được tiếng Anh mà cả tiếng Trung.|ばかりに;ばかりで;だけに|Vế sau thường có も, まで, さえ. = ～ばかりで なく.
103|nm|～は もちろん|N + は もちろん|… thì đương nhiên rồi, (cả) …|{この 店は/味/[は もちろん]/サービスも}いい。|Quán này vị thì khỏi nói, dịch vụ cũng tốt.|は べつに;は もちろ;を もちろん|Vế sau có も. Gần nghĩa ～は もとより (N2).
104|nm|～さえ（ngay cả）|N (+ trợ từ) + さえ|ngay cả …|{忙しくて/昼ご飯を/食べる 時間/[さえ]}ない。|Bận đến mức ngay cả thời gian ăn trưa cũng không có.|ずつ;ほど;ばかりか|Nêu ví dụ cực đoan. Văn viết: ～すら.
105|nm|～まで（ngay cả）|N + まで|đến cả, ngay cả|{親友に/[まで]/うそを/つかれた}。|Đến cả bạn thân cũng nói dối tôi.|しか;ずつ;ほど|Vượt quá mức bình thường, bất ngờ.
106|nm|～こそ|N + こそ|chính … (nhấn mạnh)|{今度/[こそ]/試験に/合格する}ぞ。|Lần này nhất định sẽ đỗ!|さえ;まで;しか|～から こそ = chính vì. こちらこそ = chính tôi mới phải.
107|nm|～なんか／～など／～なんて|N + なんか / など / なんて|… như là (coi nhẹ)|{ゲーム/[なんか]/やめて/早く}寝なさい。|Bỏ cái trò game đi, mau đi ngủ.|ずつ;ほど;ばかりか|Coi thường hoặc khiêm tốn: 私なんか まだまだ. なんて: ngạc nhiên.
108|cn|～て もらいたい／～て いただきたい|V て + もらいたい / いただきたい|muốn (ai) làm cho|{この 書類を/明日までに/[見て]/いただきたい}のですが。|Tôi muốn anh xem giúp tài liệu này trước ngày mai.|見る;見た;見よう|Lịch sự hơn ～て ほしい.
109|kg|～させて いただく|V (sai khiến) て + いただく|xin phép được …|{体調が 悪いので、/今日は/[休ませて]/いただきます}。|Vì không khỏe, hôm nay tôi xin phép được nghỉ.|休んで;休まれて;休めて|Khiêm nhường: làm việc của mình với sự cho phép của đối phương.
110|kg|～て いただけないでしょうか|V て + いただけないでしょうか|có thể … giúp tôi được không ạ|{すみません、/もう 少し/[ゆっくり 話して]/いただけないでしょうか}。|Xin lỗi, anh có thể nói chậm hơn một chút được không ạ?|ゆっくり 話す;ゆっくり 話した;ゆっくり 話そう|Nhờ vả rất lịch sự. Kém hơn: ～て もらえませんか.
111|tg|～おきに|số lượng + おきに|cứ cách … (một lần)|{この バスは/15分/[おきに]/出て}います。|Xe buýt này cứ 15 phút có một chuyến.|ずつ;ごとで;ぶりに|1日おきに = cách 1 ngày (ngày có ngày không). Khác ～ごとに.
112|tg|～ごとに|N / V る + ごとに|mỗi …|{オリンピックは/4年/[ごとに]/開かれる}。|Thế vận hội được tổ chức 4 năm một lần.|ぶりに;ずつに;ばかりに|会う ごとに = mỗi lần gặp (= たびに).
113|tc|～たて|V ます (bỏ ます) + たて|vừa mới … xong (còn mới)|{焼き[たて]の/パンは/とても/おいしい}。|Bánh mì vừa nướng xong rất ngon.|ぶり;がち;だらけ|生まれたて, ペンキ塗りたて.
114|tc|～かけ（の）|V ます (bỏ ます) + かけの N / かける|đang … dở|{テーブルの 上に/[読みかけ]の/本が/置いて}ある。|Trên bàn có quyển sách đang đọc dở.|読みたて;読みっぽい;読みがち|Làm dở, chưa xong: 食べかけ, 言いかける.
115|kn|～きる／～きれない|V ます + きる / きれない|làm hết, trọn vẹn / không thể hết|{料理が/多すぎて/一人では/[食べきれない]}。|Món ăn nhiều quá, một mình ăn không hết.|食べかけない;食べたてない;食べつつない|使いきる (dùng hết), 走りきる (chạy đến cùng).
116|kn|～直す|V ます + 直す|làm lại|{答えが/まちがって いたので/もう一度/[計算し直した]}。|Đáp án sai nên tôi đã tính lại một lần nữa.|計算しきった;計算しかけた;計算したてた|書き直す, やり直す, 考え直す.
117|kn|～合う|V ます + 合う|làm cùng nhau, lẫn nhau|{困った ときは/みんなで/[助け合い]/ましょう}。|Khi khó khăn hãy cùng giúp đỡ lẫn nhau.|助けかけ;助け直し;助けたて|話し合う, 愛し合う, 見つめ合う.
118|kn|～込む|V ます + 込む|vào trong; (làm) kỹ, sâu|{発車 直前の/電車に/[かけ込む]/のは}危ないです。|Lao vào tàu ngay trước khi tàu chạy thì nguy hiểm.|かけ合う;かけ直す;かけきる|Còn nghĩa "làm kỹ": 煮込む, 話し込む.
119|kn|～ようが ない|V ます (bỏ ます) + ようが ない|không có cách nào …|{こんなに/こわれて いたら、/もう/[直しようが ない]}。|Hỏng đến thế này thì không còn cách nào sửa.|直しかけない;直しきれる;直しがちない|= ～方法が ない.
120|kn|～得る／～得ない|V ます + 得る (うる/える) / 得ない|có thể / không thể (xảy ra)|{そんな ことは/[あり得ない]/と/思う}。|Tôi nghĩ chuyện như vậy không thể có.|ありきれない;ありがちない;ありかけない|Văn viết. Hay gặp: あり得る (có thể xảy ra), あり得ない.
121|tc|～っぱなし|V ます + っぱなし|để nguyên (bỏ mặc); liên tục|{電気を/[つけっぱなし]/で/寝て}しまった。|Tôi lỡ ngủ mà để đèn sáng nguyên.|つけたて;つけかけ;つけぎみ|Nghĩa 2 "liên tục": 立ちっぱなし (đứng suốt).
122|mm|～ますように|V ます + ように|mong sao, cầu mong|{明日は/どうか/[晴れます]/ように}。|Cầu mong ngày mai trời nắng.|晴れて;晴れた;晴れよう|Lời cầu nguyện, chúc: 合格できますように.
123|nn|～ことから|thể thường (Aな な/である, N である) + ことから|từ việc … (căn cứ, nguồn gốc)|{富士山が/見える/[ことから]/この 町は}富士見町と 呼ばれる。|Vì nhìn thấy núi Phú Sĩ nên thị trấn này được gọi là Fujimi.|ことだから;ことには;ことなく|Văn viết. Nêu căn cứ, nguồn gốc tên gọi.
124|dl|～からと いって|thể thường + からと いって|không phải cứ vì … mà|{お金が/ある/[からと いって]/幸せだ}とは 限らない。|Không phải cứ có tiền là hạnh phúc.|からには;からこそ;からして|Vế sau là phủ định: ～とは 限らない, ～わけでは ない.
125|qd|～から すると／～から 見ると|N + から すると / から 見ると|nhìn từ góc độ …|{親/[から すると]/子どもは/いつまでも}子どもだ。|Từ góc độ cha mẹ, con cái mãi là con nít.|から ついて;で すると;に みると|Đánh giá từ lập trường của N.
126|qd|～向け|N + 向け（の N / に）|dành cho (đối tượng)|{これは/[子ども向け]/の/番組}です。|Đây là chương trình dành cho trẻ em.|子どもらしい;子どもだらけ;子どもがち|Làm ra nhằm cho N. Khác ～向き (phù hợp với).
127|qd|～向き|N + 向き（の N / だ）|phù hợp với …|{この 料理は/辛くないので/[子ども向き]/です}。|Món này không cay nên hợp với trẻ em.|子どもだらけ;子どもがち;子ども気味|Vốn phù hợp với N (dù không làm riêng cho N).
128|dl|～反面|thể thường (Aな な/である, N である) + 反面|mặt khác, ngược lại|{都会の 生活は/便利な/[反面]/ストレスも}多い。|Cuộc sống đô thị tiện lợi, mặt khác cũng nhiều căng thẳng.|くせに;おかげで;ことに|Một sự việc có hai mặt trái ngược.
129|dl|～一方（で）|thể thường + 一方（で）|mặt khác; trong khi đó|{兄は/スポーツが 得意な/[一方で]/弟は}本が 好きだ。|Anh trai giỏi thể thao, trong khi đó em trai thích sách.|くせに;わりに;うちに|So sánh hai sự việc đối lập.
130|dl|～かわりに|V / N の + かわりに|thay vì; đổi lại|{肉の/[かわりに]/豆腐を/使った}。|Tôi dùng đậu phụ thay cho thịt.|わりに;うえに;くせに|Nghĩa "đổi lại": 手伝う かわりに ご飯を おごって.
131|dl|～に 反して|N + に 反して / に 反する N|trái với …|{予想に/[反して]/試合は/負けて}しまった。|Trái với dự đoán, trận đấu đã thua.|沿って;応じて;基づいて|Đi với 予想, 期待, 意志, 規則….
132|dl|～どころか|thể thường (N, Aな) + どころか|chẳng những không … mà ngược lại|{彼は/謝る/[どころか]/怒り}出した。|Anh ta chẳng những không xin lỗi mà còn nổi giận.|ところが;どころで;ことか|Thực tế ngược hẳn với điều được nghĩ.
133|dl|～どころでは ない|V る / N + どころでは ない|không phải lúc để …|{仕事が/忙しくて、/旅行/[どころでは ない]}。|Công việc bận đến mức không phải lúc đi du lịch.|どころか ない;ところでは ない;ことでは ない|Hoàn cảnh không cho phép làm việc đó.
134|tg|～た つもり|V た + つもり|cứ ngỡ là đã …|{かぎを/[かけた]/つもりだったが、/かかって}いなかった。|Tôi cứ ngỡ là đã khóa cửa nhưng hóa ra chưa.|かけて;かけよう;かけろ|Khác ～つもりだ (dự định). Còn nghĩa "coi như": 旅行した つもりで 貯金する.
135|kh|～ずに すむ／～ないで すむ|V ない (bỏ ない) + ずに すむ|không phải … cũng xong|{友だちが 送って くれたので、/駅まで/[歩かずに]/すんだ}。|Bạn đưa đi nên tôi không phải đi bộ ra ga.|歩かず;歩くに;歩かなく|～て すむ = chỉ cần … là xong.
136|tg|～きり|V た + きり|từ khi … rồi (không …)|{朝/出かけた/[きり]/まだ 帰って}こない。|Sáng ra ngoài rồi đến giờ vẫn chưa về.|ばかり;ずつ;ほど|Nghĩa 2 "chỉ": 二人きり.
137|kh|～だけ（hết mức）|V る / V たい + だけ|… hết mức (tùy thích)|{好きな/[だけ]/食べて/ください}。|Hãy ăn bao nhiêu tùy thích.|ばかり;ずつ;しか|できる だけ = hết sức có thể.
138|bd|～れる／～られる（tự phát）|V (thể bị động)|tự nhiên cảm thấy …|{この 写真を 見ると、/昔の ことが/[思い出され]/ます}。|Nhìn bức ảnh này, chuyện ngày xưa tự nhiên hiện về.|思い出させ;思い出して;思い出し|Tự phát: 感じられる, 思われる, 案じられる.
139|kh|～て みせる|V て + みせる|nhất định sẽ … (cho xem)|{次の 試験では/必ず/[合格して]/みせる}。|Kỳ thi sau tôi nhất định sẽ đỗ cho xem.|合格する;合格した;合格しよう|Thể hiện quyết tâm mạnh. Nghĩa 2: làm mẫu cho xem.
140|kh|～ふりを する|V / Aい / Aな な / N の + ふりを する|giả vờ …|{弟は/呼ばれても/聞こえない/[ふりを]}して いる。|Em trai bị gọi cũng giả vờ không nghe thấy.|ようを;そうを;らしいを|知らない ふり, 寝た ふり.
141|vn|～ちゃ／～じゃ（～ては）|V ては → ちゃ / では → じゃ|(văn nói của ～ては)|{ここで/たばこを/[吸っちゃ]/だめ}だよ。|Không được hút thuốc ở đây đâu.|吸っちゃう;吸っとく;吸ってる|～ては いけない → ～ちゃ いけない / ～ちゃ だめ.
142|vn|～なきゃ／～なくちゃ|V ない (bỏ い) + きゃ / くちゃ|phải … (văn nói)|{もう 9時だ。/早く/会社に/[行かなきゃ]}。|9 giờ rồi. Phải đi làm nhanh thôi.|行かなきゃう;行きなきゃ;行かないきゃ|= ～なければ / ～なくては (ならない).
143|vn|～もん／～もの（lý do）|thể thường + もん / もの|vì … mà (biện bạch, văn nói)|{だって/まだ/子どもなんだ/[もん]}。|Thì tại vì tôi còn là trẻ con mà.|こと;わけ;ばかり|Hay đi với だって. Văn nói thân mật.
144|vn|～じゃない（xác nhận）|thể thường + じゃない|chẳng phải … sao, … còn gì|{ほら、/やっぱり/雨が/[降って きたじゃない]}。|Đó, thấy chưa, mưa rồi còn gì.|降って きてじゃない;降って くるじゃないで;降って きたじゃなく|Lên giọng khi xác nhận; xuống giọng khi trách.
145|vn|～かな／～かしら|thể thường (N, Aな) + かな / かしら|… không nhỉ (tự hỏi)|{田中さん、/今日の パーティーに/来る/[かな]}。|Anh Tanaka có đến bữa tiệc hôm nay không nhỉ?|わけ;ばかり;ずつ|かしら: nữ giới hay dùng.
146|tg|～と 同時に|V る / N + と 同時に|cùng lúc với …|{ドアが/開く/[と 同時に]/子どもたちが}走り出した。|Cửa vừa mở thì cùng lúc bọn trẻ chạy ùa ra.|と 一緒で;と 同じに;と 以来|Còn nghĩa "đồng thời là": 歌手で ある と 同時に 俳優でも ある.
147|tg|～た 上で|V た / N の + 上で|sau khi … (rồi mới)|{家族と/[相談した]/上で/お返事}します。|Sau khi bàn với gia đình tôi sẽ trả lời.|相談して;相談しよう;相談し|Làm A trước, dựa vào kết quả đó mới làm B.
148|qd|～に 限って|N + に 限って|riêng … thì (lại)|{急いで いる 日/[に 限って]/電車が/遅れる}。|Đúng những hôm đang vội thì tàu lại trễ.|に 限らず;に 比べて;に とって|Còn nghĩa "riêng N thì không thể": うちの 子に 限って….
149|qd|～に 限らず|N + に 限らず|không chỉ … (mà cả)|{この 歌は/若者/[に 限らず]/お年寄りにも}人気が ある。|Bài hát này không chỉ giới trẻ mà cả người già cũng thích.|に 限って;に とって;に 対して|Vế sau thường có も.
150|kh|～を きっかけに|N + を きっかけに（して）|nhân dịp, nhờ … mà bắt đầu|{留学を/[きっかけに]/日本の/文化に}興味を 持った。|Nhân dịp du học tôi bắt đầu quan tâm văn hóa Nhật.|こめて;中心に;もとに|Sự kiện làm khởi đầu cho thay đổi.
151|tg|～ぶり|thời gian + ぶり（に／の）|sau (khoảng thời gian) mới lại|{5年/[ぶりに]/国へ/帰った}。|Sau 5 năm tôi mới lại về nước.|ずつに;ばかりに;ほどに|Nghĩa 2 "cách, dáng": 仕事ぶり.
152|kh|～ように（nhắc nhở）|V る / V ない + ように|hãy … (thông báo, nhắc nhở)|{明日は/8時までに/[集まる]/ように}。|Ngày mai hãy tập trung trước 8 giờ.|集まった;集まって;集まろう|Dùng trong thông báo, lược bỏ してください.
153|kg|～で いらっしゃる|N + で いらっしゃる|là (tôn kính của ～です)|{失礼ですが、/田中様/[でいらっしゃいます]/か}。|Xin lỗi, có phải ngài Tanaka không ạ?|でございます;でおります;でまいります|Tôn kính, dùng cho người. ～で ございます dùng cho vật hoặc bản thân.
154|kg|お／ご～ください|お V ます / ご N + ください|xin hãy … (tôn kính)|{こちらで/少々/[お待ち]/ください}。|Xin vui lòng đợi một chút ở đây.|お待って;お待ちて;待ちし|ご注意ください, ご覧ください.
155|kg|お／ご～願う|お V ます / ご N + 願います|xin (quý khách) vui lòng …|{会場内では/たばこは/[ご遠慮]/願います}。|Xin vui lòng không hút thuốc trong hội trường.|ご遠慮して;お遠慮;遠慮し|Dùng trong thông báo, biển báo.
156|kg|ご～いたす|お V ます / ご N + いたす|tôi xin (làm) (khiêm nhường)|{会場まで/私が/[ご案内]/いたします}。|Tôi xin dẫn đường đến hội trường.|ご案内に;案内して;お案内|Khiêm nhường hơn お～します.
157|kh|～ないことは ない|V ない / Aい くない + ことは ない|không phải là không …|{辛い 料理も/[食べられない]/ことは ない/けど、}あまり 好きでは ない。|Món cay thì không phải là không ăn được, nhưng tôi không thích lắm.|食べられなく;食べられず;食べられないで|Khẳng định yếu, có phần miễn cưỡng.
158|kh|～ことは～が|V る ことは V る が|… thì có … nhưng|{行く/[ことは]/行くが/すぐ}帰るよ。|Đi thì có đi, nhưng sẽ về ngay.|ものは;わけは;ほどは|Thừa nhận nhưng có hạn chế.
159|kh|～ば～のに（tiếc）|V ば + よかったのに|giá mà … thì đã|{もっと 早く/[言って くれれば]/よかった/のに}。|Giá mà nói sớm hơn thì tốt rồi.|言って くれて;言って くれる;言って くれよう|Tiếc nuối, trách nhẹ người khác.
160|pd|～かのように|thể thường + かのように / かのようだ|cứ như thể là … (thực ra không phải)|{彼は/何も なかった/[かのように]/笑って}いた。|Anh ấy cười như thể chẳng có chuyện gì xảy ra.|そうに;らしいに;かように|Ví von điều không có thật.
161|tc|～げ|Aい (bỏ い) / Aな + げ|có vẻ … (dáng vẻ)|{子どもたちは/[楽しげに]/歌を/歌って}いる。|Bọn trẻ đang hát có vẻ vui.|楽しっぽく;楽しがちに;楽しだらけに|Văn viết. 悲しげ, 寂しげ, 不安げ.
162|kh|～ばかりで|V る + ばかりで|chỉ toàn … (mà không làm gì)|{彼は/文句を/[言う]/ばかりで}何も しない。|Anh ta chỉ toàn phàn nàn mà chẳng làm gì.|言って;言おう;言え|Chê trách: chỉ làm một việc, không làm việc cần làm.
163|ss|～ほど（càng … càng）|V る / Aい / N + ほど|càng … càng|{日本語は/勉強する/[ほど]/おもしろく}なる。|Tiếng Nhật càng học càng thấy hay.|ばかり;ずつ;まで|Lược bỏ ～ば của ～ば～ほど.
164|nm|～ものか|thể thường + ものか|… đời nào! (phủ định mạnh)|{あんな 店、/二度と/[行く]/ものか}。|Quán như thế, đời nào tôi đến lần nữa!|行った;行って;行こう|Văn nói: もんか.
165|qd|～に 当たって|V る / N + に 当たって|khi, nhân dịp (sự kiện quan trọng)|{新しい 生活を/[始める]/に 当たって/準備を}しっかり した。|Khi bắt đầu cuộc sống mới, tôi đã chuẩn bị kỹ.|始めた;始めて;始めよう|Trang trọng, trước sự kiện quan trọng.
166|qd|～を 問わず|N + を 問わず|bất kể, không phân biệt|{この 仕事は/年齢/[を 問わず]/だれでも}応募できます。|Công việc này ai cũng ứng tuyển được, không kể tuổi tác.|を こめて;を もとに;を 中心に|Hay đi với cặp từ: 男女を 問わず, 昼夜を 問わず.
167|nn|～から こそ|thể thường + から こそ|chính vì … nên|{あなたの ことを/心配して いる/[から こそ]/言うんです}。|Chính vì lo cho bạn nên tôi mới nói.|からには;からと いって;からして|Nhấn mạnh lý do.
168|tc|～ばかりだ（ngày càng xấu）|V る + ばかりだ|ngày càng (xấu đi)|{病気は/悪く/[なる]/ばかりだ}。|Bệnh ngày càng xấu đi.|なって;なれ;なろう|= ～一方だ, chỉ dùng chiều xấu.
169|tg|～ところだった|V る + ところだった|suýt nữa thì …|{もう 少しで/車に/[ひかれる]/ところだった}。|Suýt chút nữa thì bị xe tông.|ひかれた;ひかれて;ひかれよう|Hay đi với もう 少しで, 危うく.
170|kh|～気が する|thể thường + 気が する|có cảm giác là …|{この 人に/どこかで/[会った]/気が する}。|Tôi có cảm giác đã gặp người này ở đâu đó.|会って;会おう;会え|Cảm giác không chắc chắn.
171|kh|～ば いいのに|V ば + いいのに|giá mà … thì tốt (khuyên người khác)|{そんなに 疲れて いるなら、/早く/[帰れば]/いいのに}。|Mệt thế thì về sớm có phải hơn không.|帰って;帰ろう;帰れ|Khuyên, tiếc thay cho người khác.
172|qd|～上（じょう）／～の 上では|N + 上 / の 上では|về mặt …|{カレンダーの/[上では]/もう 春だが、/まだ}寒い。|Theo lịch thì đã sang xuân nhưng vẫn còn lạnh.|うちでは;ままでは;ほどでは|法律上, 健康上, 表面上 (về mặt pháp luật, sức khỏe, bề ngoài).
173|kh|～は 別として|N + は 別として|… thì khoan bàn, ngoài … ra|{値段/[は 別として]/デザインは/とても}いい。|Giá cả khoan bàn, thiết kế rất đẹp.|に 別として;で 別として;が 別として|= ～は ともかく (N2).
174|tc|～風（ふう）|N + 風|kiểu, phong cách …|{この 店は/[和風]の/料理が/人気}です。|Quán này nổi tiếng với món ăn kiểu Nhật.|和っぽい;和がち;和らしい|洋風 (kiểu Tây), 中華風. こういう 風に = như thế này.
175|pd|～ように 見える|V / Aい / Aな な / N の + ように 見える|trông có vẻ …|{彼は/年より/[若い]/ように 見える}。|Anh ấy trông trẻ hơn tuổi.|若く;若くて;若さ|Nhận xét theo vẻ bề ngoài.
176|kh|～だけで|V る + だけで|chỉ cần … thôi là|{あの 曲を/[聞く]/だけで/元気に}なる。|Chỉ cần nghe bài đó thôi là tôi khỏe ra.|聞いて;聞こう;聞け|Chỉ một việc nhỏ cũng đủ tạo kết quả.
177|kh|～に つき|N + に つき|vì … (thông báo); mỗi|{本日は/定休日/[に つき]/休業}いたします。|Hôm nay là ngày nghỉ định kỳ nên cửa hàng đóng cửa.|に ついて;に とって;に 対して|Văn thông báo, biển báo. Nghĩa 2 "mỗi": 1人に つき 1枚.
178|kh|～て ばかり いる|V て + ばかり いる|chỉ toàn … (chê)|{弟は/毎日/ゲームを/[して ばかり]}いる。|Em trai ngày nào cũng chỉ toàn chơi game.|して ほど;して ずつ;して しか|Lặp lại một việc, người nói không hài lòng.
179|nm|～も～ば～も|N も V ば N も|vừa … vừa …|{この 部屋は/駅にも/近ければ/[家賃も]}安い。|Căn phòng này vừa gần ga, giá thuê vừa rẻ.|家賃しか;家賃ほど;家賃ずつ|Liệt kê hai điểm cùng chiều (tốt cùng tốt, xấu cùng xấu).
180|qd|～に したら／～に すれば|N (người) + に したら|đối với (đứng ở vị trí) …|{子ども/[に したら]/大人の 話は/つまらない}だろう。|Đứng ở vị trí trẻ con thì chuyện người lớn chắc chán lắm.|に しては;で したら;を したら|Đoán cảm nghĩ của người khác.
`);
GRAM.N2 = L(`
1|tg|～際（に）|V る / V た / N の + 際（に）|khi, lúc (trang trọng)|{お降りの/[際は]/足元に/ご注意}ください。|Khi xuống xe xin chú ý dưới chân.|うちは;たびは;次第は|Dùng trong thông báo, văn bản lịch sự. Nghĩa như 時 nhưng trang trọng hơn.
2|tg|～に 際して|V る / N + に 際して|nhân dịp, khi (bắt đầu việc quan trọng)|{留学に/[際して]/両親に/相談した}。|Khi đi du học tôi đã bàn với bố mẹ.|対して;関して;よって|Văn viết, dùng cho sự kiện đặc biệt: 開会, 卒業, 契約…
3|tg|～に 先立って|V る / N + に 先立って|trước khi (làm việc gì, chuẩn bị)|{試合に/[先立って]/開会式が/行われた}。|Trước trận đấu, lễ khai mạc đã được tổ chức.|対して;沿って;応じて|Việc chuẩn bị, thủ tục làm trước sự kiện. N に 先立つ N: 試合に 先立つ 練習.
4|tg|～を 機に|N / V る の + を 機に|nhân dịp, lấy … làm bước ngoặt|{就職を/[機に]/一人暮らしを/始めた}。|Nhân dịp đi làm, tôi bắt đầu sống một mình.|もとに;中心に;こめて|Gần nghĩa ～を きっかけに nhưng trang trọng hơn.
5|tg|～末（に）|V た / N の + 末（に）|sau khi … (lâu, vất vả) cuối cùng|{いろいろ/[考えた]/末に/会社を}やめる ことに した。|Sau khi suy nghĩ đủ đường, cuối cùng tôi quyết định nghỉ việc.|考える;考えて;考えよう|Kết quả sau một quá trình dài. Hay đi với いろいろ, さんざん, 長い 議論の 末.
6|tg|～あげく（に）|V た / N の + あげく|rốt cuộc (sau nhiều …, kết quả không tốt)|{さんざん/[迷った]/あげく/何も}買わなかった。|Phân vân mãi, rốt cuộc chẳng mua gì.|迷う;迷って;迷おう|Gần ～末に nhưng kết quả thường xấu, đáng tiếc.
7|tg|～かと 思うと／～かと 思ったら|V た + かと 思うと|vừa mới … thì đã ngay|{赤ちゃんは/[泣いた]/かと 思うと/もう}笑って いる。|Em bé vừa khóc xong đã cười rồi.|泣く;泣いて;泣こう|Hai việc (thường trái ngược) xảy ra liên tiếp. Không dùng cho hành động của chính mình.
8|tg|～か～ないかの うちに|V る / V た + か + V ない + かの うちに|vừa mới … (gần như cùng lúc)|{ベルが/[鳴るか 鳴らないか]/の うちに/学生たちは}教室を 出た。|Chuông vừa reo, sinh viên đã ra khỏi lớp.|鳴っても 鳴らなくても;鳴るなら 鳴らないなら;鳴ったり 鳴らなかったり|Hành động xảy ra gần như cùng lúc, rất nhanh.
9|tg|～て から と いう もの|V て + から と いう もの|kể từ khi … (thay đổi hẳn)|{子どもが/[生まれて]/から と いう もの/生活が}すっかり 変わった。|Kể từ khi con chào đời, cuộc sống thay đổi hẳn.|生まれる;生まれた;生まれ|Văn viết. Vế sau là sự thay đổi kéo dài đến nay.
10|tg|～ない うちに|V ない + うちに|trước khi … (kẻo)|{雨が/[降らない]/うちに/早く}帰ろう。|Về nhanh thôi kẻo trời mưa.|降った;降って;降らなく|Làm trước khi tình huống xấu xảy ra. Gần ～前に nhưng nhấn ý "kẻo".
11|tg|～折（に）|V る / V た / N の + 折（に）|nhân dịp, khi (lịch sự)|{近くに/[お越しの]/折には/ぜひ}お立ち寄りください。|Khi nào có dịp ghé gần đây, xin mời ghé chơi.|お越して;お越しに;お越しで|Dùng trong thư từ, lời mời lịch sự.
12|tg|～た ところ|V た + ところ|khi thử … thì (biết được)|{先生に/[相談した]/ところ/親切に}教えて くれた。|Khi tôi hỏi ý thầy thì thầy chỉ bảo tận tình.|相談する;相談して;相談しよう|Làm một việc rồi phát hiện kết quả. Vế sau là việc đã xảy ra.
13|tg|～ところを|V る / V ている / A + ところを|đang lúc … (mà làm phiền / bị bắt gặp)|{お忙しい/[ところを]/ありがとう/ございました}。|Cảm ơn anh đã dành thời gian lúc đang bận.|ところへ;ところで;ところに|Hay dùng: お忙しい ところを すみません. Còn nghĩa bị bắt gặp: 寝て いる ところを 見られた.
14|tg|～に 伴って|V る / N + に 伴って|cùng với, kéo theo|{人口の/増加に/[伴って]/住宅が}不足して いる。|Cùng với sự gia tăng dân số, nhà ở đang thiếu.|とって;対して;関して|Văn viết. Một thay đổi kéo theo thay đổi khác. Gần ～に つれて.
15|tg|～に つけ（て）|V る + に つけ|mỗi khi … (lại cảm thấy)|{この 歌を/[聞く]/に つけ/故郷を}思い出す。|Mỗi khi nghe bài hát này tôi lại nhớ quê.|聞いた;聞いて;聞き|Vế sau là cảm xúc, suy nghĩ. Cố định: 何かに つけ (mỗi khi có chuyện gì).
16|tg|～ずじまい|V ない (bỏ ない) + ずじまい|rốt cuộc đã không …|{忙しくて/あの 映画は/[見ず]/じまいだった}。|Bận quá nên rốt cuộc không xem được bộ phim đó.|見ない;見なく;見なかった|Tiếc nuối vì định làm mà cuối cùng không làm. する → せずじまい.
17|tg|～拍子に|V た + 拍子に|đúng lúc … (thì vô tình)|{転んだ/[拍子に]/めがねが/割れた}。|Đúng lúc bị ngã thì kính vỡ.|ついでに;くせに;たびに|Việc xảy ra bất ngờ ngay khoảnh khắc làm việc kia.
18|tg|～を 前に（して）|N + を 前に|trước (sự kiện sắp tới)|{[試験を 前に]/して/学生たちは/緊張して}いる。|Trước kỳ thi, sinh viên đang căng thẳng.|試験を こめて;試験を もとに;試験を はじめ|Sự kiện quan trọng sắp đến. Cũng dùng cho không gian: 海を 前に した 家.
19|tg|～を 控えて|N + を 控えて|sắp đến (gần kề)|{結婚式を/[一週間後に]/控えて/準備に}忙しい。|Còn một tuần nữa là đến lễ cưới, đang bận chuẩn bị.|一週間後を;一週間後で;一週間後が|N を (thời gian) に 控えて: còn (thời gian) nữa là đến N.
20|tg|～を 皮切りに|N + を 皮切りに（して）|bắt đầu từ … (rồi lan rộng)|{コンサートは/[東京を]/皮切りに/全国10都市で}行われる。|Buổi hòa nhạc bắt đầu từ Tokyo rồi diễn ra ở 10 thành phố trên cả nước.|東京に;東京で;東京が|Khởi đầu của một chuỗi sự kiện.
21|nn|～だけに|thể thường (N / Aな な) + だけに|chính vì … nên (càng)|{期待して/いた/[だけに]/がっかりした}。|Chính vì đã kỳ vọng nên càng thất vọng.|だけで;わりに;ほどに|Vế sau là cảm xúc mạnh hơn bình thường, tương xứng với nguyên nhân.
22|nn|～だけ あって|thể thường (N / Aな な) + だけ あって|quả đúng là … nên|{プロの/選手[だけ あって]/動きが/違う}。|Quả đúng là tuyển thủ chuyên nghiệp, động tác khác hẳn.|くせに;ばかりに;わりに|Đánh giá tích cực: kết quả xứng với danh tiếng, nỗ lực.
23|nn|～あまり（に）|V る / V た / N の + あまり|vì quá … (nên)|{心配の/[あまり]/夜も/眠れなかった}。|Vì quá lo lắng nên đêm cũng không ngủ được.|ばかり;だけ;ほど|Mức độ quá mức dẫn đến kết quả không bình thường.
24|nn|～ことだし|thể thường + ことだし|vì … (nên thôi thì)|{雨も/やんだ/[ことだし]/散歩に}出かけよう。|Mưa cũng tạnh rồi, đi dạo thôi.|ものだし;ことから;ことには|Nêu một lý do nhẹ, vế sau là đề nghị, quyết định.
25|nn|～ゆえ（に）|N（の） / thể thường + ゆえ（に）|vì, do (văn viết)|{若さ/[ゆえに]/失敗も/多い}。|Vì còn trẻ nên cũng nhiều thất bại.|ものの;くせに;ほどに|Văn viết, trang trọng.
26|nn|～手前|thể thường / N の + 手前|vì đã … (ngại mất mặt nên)|{みんなの/前で/約束した/[手前]}、やめる わけには いかない。|Vì đã hứa trước mặt mọi người nên không thể bỏ được.|以来;最中;一方|Vì giữ thể diện với người khác nên phải làm / không thể làm.
27|nn|～上は|V る / V た + 上は|một khi đã … thì (văn viết)|{引き受けた/[上は]/最後まで/責任を}持つ。|Một khi đã nhận thì phải chịu trách nhiệm đến cùng.|うちに;ところへ;最中は|Gần ～以上は, ～からには. Vế sau: quyết tâm, nghĩa vụ.
28|nn|～ところから|thể thường + ところから|từ chỗ … (nên)|{形が/扇に/[似て いる]/ところから}この 名が ついた。|Vì hình dáng giống cái quạt nên mới có tên này.|似て;似よう;似ろ|Hay dùng để giải thích nguồn gốc tên gọi, căn cứ phán đoán.
29|nn|～と あって|N / thể thường + と あって|vì là (dịp đặc biệt) nên|{連休/[と あって]/観光地は/どこも}混んで いる。|Vì là kỳ nghỉ dài nên khu du lịch đâu cũng đông.|と いえば;と しても;と いうより|Văn viết, tin tức. Nguyên nhân là tình huống đặc biệt.
30|dk|～ものなら（nếu được）|V (thể khả năng) + ものなら|nếu mà … được thì (khó xảy ra)|{できる/[ものなら]/もう 一度/若いころに}戻りたい。|Nếu được thì tôi muốn quay lại thời trẻ thêm lần nữa.|ものだから;ものの;もので|Điều khó thực hiện. Vế sau: mong muốn, mệnh lệnh.
31|dk|～ようものなら|V よう + ものなら|nếu lỡ … thì (hậu quả nghiêm trọng)|{父に/口ごたえ/[しようものなら]/ひどく}しかられる。|Nếu lỡ cãi lại bố thì sẽ bị mắng nặng.|するものだから;したものの;しようとして|Vế sau là kết quả xấu, nghiêm trọng.
32|dk|～に よっては|N + に よっては|tùy … mà có khi|{国に/[よっては]/チップが/必要な}ところも ある。|Tùy nước mà có nơi cần tiền boa.|とっては;ついては;対しては|Nhấn mạnh một số trường hợp đặc biệt. Gần ～次第では.
33|dk|～を 抜きに しては|N + を 抜きに しては|nếu không có … thì không thể|{彼の/協力を/[抜きに しては]/この 計画は}成功しなかった。|Nếu không có sự hợp tác của anh ấy thì kế hoạch này đã không thành công.|中心に して;もとに して;通じて|Vế sau mang nghĩa phủ định / không thể.
34|dk|～ようでは|V る / V ない + ようでは|nếu cứ … thế này thì (không được)|{こんな 問題も/[できない]/ようでは/合格は}むずかしい。|Nếu bài thế này cũng không làm được thì khó mà đỗ.|できなく;できず;できなくて|Phê phán, cảnh báo. Vế sau: đánh giá tiêu cực.
35|dk|～と（も）なると|N / V る + と（も）なると|hễ đã đến mức / trở thành … thì|{大学生/[とも なると]/自分で/生活費を}かせぐ 人も 多い。|Đã là sinh viên đại học thì nhiều người tự kiếm tiền sinh hoạt.|に とって;に 対して;に 関して|Đạt đến vị trí, thời điểm cao hơn thì đương nhiên có tình huống tương xứng.
36|dk|～と なると|thể thường / N + と なると|nếu (thực sự) … thì|{いざ/[留学する]/と なると/準備が}大変だ。|Thực sự định đi du học thì việc chuẩn bị vất vả lắm.|留学して;留学しよう;留学し|Khi tình huống trở thành thực tế thì nhận ra điều gì đó.
37|dk|～ば～で|V ば + V た + で|nếu … thì cũng (lại có vấn đề khác)|{お金は/あれば/[あったで]/心配も}増える。|Tiền ấy mà, có thì lại thêm nỗi lo.|あるで;あって;あったら|Có hay không đều có cái khó riêng. Aい: 高ければ 高いで.
38|dl|～つつ（も）|V ます (bỏ ます) + つつ（も）|tuy … nhưng (vẫn)|{体に/悪いと/[知りつつ]/たばこを}やめられない。|Tuy biết có hại cho sức khỏe nhưng vẫn không bỏ được thuốc lá.|知るつつ;知ってつつ;知ったつつ|Văn viết. Hay đi với 知る, 思う, 言う.
39|dl|～た ところで|V た + ところで|dù có … thì cũng (vô ích)|{今から/[急いだ]/ところで/間に合わない}だろう。|Dù bây giờ có vội thì chắc cũng không kịp.|急ぐ;急いで;急ごう|Vế sau: kết quả vô ích, không như mong đợi.
40|dl|～とは いえ|thể thường + とは いえ|tuy nói là … nhưng|{春/[とは いえ]/まだ/寒い}日が 続く。|Tuy nói là mùa xuân nhưng vẫn còn những ngày lạnh.|として;とすれば;とともに|Thừa nhận vế trước nhưng thực tế không như mong đợi.
41|dl|～ものを|thể thường + ものを|giá mà … vậy mà (trách, tiếc)|{早く/言えば/よかった/[ものを]}、どうして 黙って いたの。|Giá mà nói sớm thì tốt rồi, sao lại im lặng?|ものの;もので;ものか|Bất mãn, tiếc nuối về việc đã không làm.
42|dl|～ようが／～ようと|V よう + が / と|dù có … (cũng không liên quan)|{人に/何と/[言われようと]/私は}気に しない。|Dù bị người khác nói gì, tôi cũng không bận tâm.|言われると;言われたら;言われれば|Hay đi với 何と, どんなに. ～ようが ～まいが: dù có hay không.
43|dl|～ない までも|V ない + までも|tuy không đến mức … nhưng ít ra|{毎日とは/[言わない]/までも/週に 一度は}運動しなさい。|Không đến mức mỗi ngày, nhưng ít nhất mỗi tuần hãy vận động một lần.|言う;言って;言った|Vế sau là mức thấp hơn: ít ra, tối thiểu.
44|dl|～く とも|Aい (bỏ い) + く とも|dù … thì (tối thiểu)|{遅く/[とも]/9時には/来て}ください。|Muộn nhất thì hãy đến trước 9 giờ.|ては;こそ;さえ|Cố định: 少なくとも, 遅くとも, 多くとも. Văn viết của ～くても.
45|dl|～かと いって|câu + かと いって|nhưng không vì thế mà|{仕事は/大変だ。/[かと いって]/やめる わけにも}いかない。|Công việc vất vả. Nhưng không vì thế mà bỏ được.|それで;だから;そのうえ|Vế sau thường phủ định: ～わけには いかない, ～とは 限らない.
46|dl|～は ともかく（と して）|N + は ともかく|chưa bàn đến …, (tạm không nói)|{味/[は ともかく]/この 店は/安い}。|Chưa bàn đến vị, quán này rẻ.|に とって;に 対して;に ついて|Vế trước tạm gác lại, nhấn mạnh vế sau.
47|dl|～も かまわず|N + も かまわず|chẳng màng đến, bất chấp|{彼女は/人目[も かまわず]/大声で/泣いた}。|Cô ấy chẳng màng ánh mắt người khác, khóc to.|に とって;に 沿って;を 込めて|Hay gặp: 人目も かまわず, 服が 汚れるのも かまわず.
48|dl|～に ひきかえ|N + に ひきかえ|trái ngược hẳn với|{まじめな/兄[に ひきかえ]/弟は/なまけ者だ}。|Trái hẳn với người anh nghiêm túc, cậu em lười biếng.|に とって;に ついて;に かけて|So sánh hai thứ trái ngược, thường kèm đánh giá chủ quan.
49|ss|～にも まして|N + にも まして|hơn cả …|{今年は/[去年にも]/まして/暑い}。|Năm nay còn nóng hơn cả năm ngoái.|去年にとって;去年にしては;去年について|Cố định: 何にも まして (hơn hết thảy).
50|ss|～も 同然だ|N / V た + も 同然だ|coi như là, chẳng khác gì|{この 車は/ほとんど/[新品も]/同然だ}。|Chiếc xe này gần như mới tinh.|新品さえ;新品まで;新品こそ|Thực tế không phải nhưng gần như vậy.
51|ss|～に 等しい|N / V る + に 等しい|gần như, chẳng khác gì|{彼の/説明は/[言い訳に]/等しい}。|Lời giải thích của anh ấy chẳng khác gì lời bào chữa.|言い訳を;言い訳が;言い訳で|Văn viết. ないに 等しい: gần như không có.
52|ss|～ほどの ことでは ない|V る + ほどの ことでは ない|không đến mức phải …|{病院に/[行く]/ほどの ことでは/ない}。|Không đến mức phải đi bệnh viện.|行った;行って;行こう|Việc không nghiêm trọng như vậy.
53|ss|～より むしろ|N / V る + より むしろ|thà … hơn là; đúng hơn là|{電車で/行く/[より むしろ]/歩いた}ほうが 早い。|Thà đi bộ còn nhanh hơn đi tàu.|ほど ずっと;だけ もっと;くらい かなり|So sánh, chọn vế sau là phù hợp hơn.
54|kl|～だけ ましだ|thể thường + だけ ましだ|còn may là, còn đỡ là|{けがを/しなかった/[だけ]/ましだ}。|Không bị thương là còn may rồi.|ほど;こそ;さえ|Tình huống xấu nhưng vẫn có điểm còn đỡ.
55|kl|～ものが ある|V る / Aい / Aな な + ものが ある|có điều gì đó (thật) …|{彼の/演奏には/人を/[感動させる ものが]}ある。|Màn trình diễn của anh ấy có sức lay động lòng người.|感動させた ものが;感動させて ものが;感動させる ものを|Cảm nhận, đánh giá của người nói về một đặc điểm.
56|kl|～と いう ものだ|thể thường + と いう ものだ|đó chính là … (lẽ đương nhiên)|{困った ときに/助け合うのが/[友情と いう]/ものだ}。|Giúp đỡ nhau lúc khó khăn, đó mới là tình bạn.|友情の;友情が;友情を|Người nói đưa ra nhận định về bản chất sự việc.
57|kl|～と いう ものでは ない|thể thường + と いう ものでは ない|không phải cứ … là (được)|{お金が/あれば/幸せ/[と いう ものでは ない]}。|Không phải cứ có tiền là hạnh phúc.|と いう ことに なる;と いう わけだ;と いう ものだ|Phủ định một quan niệm chung chung. Cũng nói: ～と いう ものでも ない.
58|kl|～に ほかならない|N + に ほかならない|chính là, không gì khác ngoài|{成功したのは/みなさんの/協力の/[おかげに]}ほかならない。|Thành công chính là nhờ sự hợp tác của mọi người.|おかげを;おかげで;おかげが|Văn viết, khẳng định mạnh. Hay dùng: ～から に ほかならない.
59|kl|～に 越した ことは ない|V る / Aい / N + に 越した ことは ない|tốt nhất là …, không gì bằng|{安全の ためには/用心する/[に 越した]/ことは ない}。|Để an toàn thì cẩn thận vẫn là tốt nhất.|に 比べた;に 限った;に 対した|Lời khuyên: đương nhiên … là tốt nhất.
60|kl|～に 限る|N / V る / V ない + に 限る|… là nhất|{疲れた ときは/[寝る]/に 限る/よ}。|Lúc mệt thì đi ngủ là nhất.|寝た;寝て;寝よう|Ý kiến chủ quan của người nói. Khác ～に 限って (riêng … thì).
61|kl|～までも ない|V る + までも ない|không cần phải …|{言う/[までも ない]/ことだが/健康が}一番だ。|Không cần phải nói, sức khỏe là trên hết.|までに ない;だけも ない;さえも ない|Cố định: 言うまでも ない (khỏi phải nói).
62|kl|～だけの ことは ある|thể thường + だけの ことは ある|quả xứng đáng là, không uổng|{この 料理は/本当に おいしい。/高い/[だけの ことは ある]}。|Món này ngon thật. Đắt quả là xứng đáng.|だけの わけは ある;だけの ものは ある;だけの はずは ある|Đánh giá: kết quả xứng với giá tiền, nỗ lực, danh tiếng.
63|kl|～では ないか|thể thường + では ないか|chẳng phải là … sao (ngạc nhiên, trách)|{約束の 時間に/遅れて きた/のは/[君では]}ないか。|Người đến trễ giờ hẹn chẳng phải là cậu sao.|君にも;君をも;君しか|Văn nói: ～じゃ ないか.
64|kl|～に 値する|V る / N + に 値する|đáng để, xứng đáng|{この 本は/一度/[読む]/に 値する}。|Cuốn sách này đáng đọc một lần.|読んだ;読んで;読もう|Văn viết. Hay gặp: 注目に 値する, 尊敬に 値する.
65|kl|～かいが ある|V た / N の + かい（甲斐）が ある|bõ công, đáng công|{一生懸命/[勉強した]/かいが/あって}合格できた。|Không uổng công học chăm chỉ, tôi đã đỗ.|勉強する;勉強して;勉強しよう|Phủ định: かいが ない (uổng công).
66|kl|～のも もっともだ|thể thường + のも もっともだ|… cũng là đương nhiên|{あんなに/練習したのだから、/[優勝したのも]/もっともだ}。|Đã luyện tập đến thế thì vô địch cũng là đương nhiên.|優勝したのに;優勝したので;優勝したのを|Thừa nhận là hợp lý. Gần: ～のも 無理は ない.
67|pd|～かねない|V ます (bỏ ます) + かねない|có thể (dẫn đến điều xấu)|{そんなに/スピードを 出したら/事故を/[起こしかねない]}よ。|Chạy nhanh thế thì có thể gây tai nạn đấy.|起こしかねる;起こしがたい;起こしえない|Chỉ dùng cho khả năng xấu. Khác ～かねる (khó mà làm).
68|pd|～に 相違ない|thể thường (N / Aな bỏ だ) + に 相違ない|chắc chắn là (văn viết)|{これは/彼が/書いた/[手紙に]}相違ない。|Đây chắc chắn là thư anh ấy viết.|手紙を;手紙が;手紙で|Văn viết của ～に 違いない.
69|pd|～と みえる|thể thường + と みえる|hình như, có vẻ (suy từ dấu hiệu)|{彼は/よほど/[疲れて いる]/と みえて}ぐっすり 眠って いる。|Có vẻ anh ấy mệt lắm nên ngủ say sưa.|疲れよう;疲れろ;疲れ|Suy đoán từ quan sát. と みえて: dạng nối câu.
70|pd|～もの と 思われる|thể thường + もの と 思われる|được cho là (văn viết, tin tức)|{事故の/原因は/[居眠り運転だった]/もの と}思われる。|Nguyên nhân tai nạn được cho là do ngủ gật khi lái xe.|居眠り運転で;居眠り運転を;居眠り運転に|Phong cách báo chí, đưa ra phán đoán khách quan.
71|pd|～との ことだ|thể thường + との ことだ|nghe nói là (truyền lại)|{部長は/今日は/[休む]/との ことです}。|Nghe nói hôm nay trưởng phòng nghỉ.|休まれ;休んで;休めば|Truyền lại lời người khác. Hay dùng trong công việc.
72|pd|～ないとも 限らない|V ない + とも 限らない|không phải là không có khả năng …|{地震が/[来ない]/とも/限らない}から、準備して おこう。|Không phải không có khả năng động đất xảy ra, nên chuẩn bị sẵn thôi.|来る;来て;来た|Khả năng thấp nhưng vẫn nên đề phòng.
73|pd|～ことだろう|thể thường + ことだろう|hẳn là … (biết bao)|{合格の 知らせを/聞いて/両親は/[喜んだ ことだろう]}。|Nghe tin đỗ, bố mẹ hẳn đã vui lắm.|喜んで ことだろう;喜ぶ ことだった;喜び ことだろう|Suy đoán kèm cảm xúc. Hay đi với どんなに, さぞ.
74|pd|～まい（chắc không）|V る + まい|chắc là không …|{この 雨は/[やむ]/まい/と 思って}かさを 持って きた。|Tôi nghĩ mưa này chắc không tạnh nên mang ô theo.|やんだ;やんで;やもう|Văn viết của ～ないだろう. する → するまい / すまい.
75|mm|～まい（quyết không）|V る + まい|quyết không …|{もう/二度と/[うそは つく]/まい}と 心に 決めた。|Tôi quyết trong lòng sẽ không bao giờ nói dối nữa.|うそは ついた;うそは ついて;うそは つこう|Văn viết của ～ない つもりだ.
76|mm|～べく|V る + べく|để mà, nhằm (văn viết)|{夢を/[実現する]/べく/毎日}努力して いる。|Để thực hiện ước mơ, tôi nỗ lực mỗi ngày.|実現した;実現して;実現しよう|Văn viết của ～ために. する → すべく.
77|mm|～て でも|V て + でも|dù phải … cũng (quyết)|{借金を/[して]/でも/家を}買いたい。|Dù phải vay nợ tôi cũng muốn mua nhà.|する;した;しよう|Quyết tâm mạnh, chấp nhận cả cách cực đoan.
78|mm|～ない ものか|V ない + ものか / ものだろうか|không có cách nào … sao (mong mỏi)|{何とか/彼を/[助けられない]/ものか}。|Không có cách nào cứu được anh ấy sao?|助けられる;助けられて;助けられず|Mong muốn mạnh mà khó thực hiện.
79|mm|～たい ものだ|V たい + ものだ|thật muốn … (mong ước)|{一度/富士山に/[登りたい]/ものだ}。|Thật muốn leo núi Phú Sĩ một lần.|登れ;登って;登り|Mong ước tha thiết, cảm thán.
80|mm|～まで だ／～までの ことだ|V る + までだ|(nếu không được) thì chỉ việc … thôi|{電車が/なければ/[歩いて 帰る]/までだ}。|Nếu không có tàu thì chỉ việc đi bộ về thôi.|歩いて 帰れ;歩いて 帰って;歩いて 帰ろう|Thái độ dứt khoát. V た + までだ: chỉ là đã làm (việc đó) thôi.
81|mm|～ようか～まいか|V よう + か + V る + まいか|có nên … hay không (phân vân)|{旅行に/[行こうか 行くまいか]/まだ/迷って}いる。|Tôi vẫn đang phân vân có nên đi du lịch hay không.|行ったか 行くまいか;行こうか 行ったか;行けか 行くまいか|Do dự giữa làm và không làm.
82|kn|～かねる|V ます (bỏ ます) + かねる|khó mà, không thể (lịch sự)|{申し訳 ございませんが、/その 質問には/[お答えし]/かねます}。|Rất xin lỗi, tôi khó có thể trả lời câu hỏi đó.|お答えする;お答えして;お答えした|Từ chối lịch sự trong công việc. Khác ～かねない.
83|kn|～がたい|V ます (bỏ ます) + がたい|khó mà (về mặt tâm lý)|{彼が/犯人だ/とは/[信じがたい]}。|Khó mà tin được anh ấy là thủ phạm.|信じかねない;信じっぽい;信じぎみ|Dùng với 信じる, 理解する, 許す, 忘れる…
84|kn|～づらい|V ます (bỏ ます) + づらい|khó (vì gây khó chịu)|{この 靴は/[歩き]/づらい/ので}もう はかない。|Đôi giày này khó đi nên tôi không đi nữa.|歩く;歩いて;歩け|Khó vì khó chịu về thể chất, tâm lý. Gần ～にくい.
85|kn|～っこ ない|V ます (bỏ ます) + っこ ない|chẳng thể nào (văn nói)|{こんな 難しい 問題、/私に/[でき]/っこ ない}よ。|Bài khó thế này, tôi làm sao làm được.|できる;できて;できた|Văn nói, phủ định mạnh khả năng.
86|kn|～ように も ～ない|V よう + にも + V (khả năng) ない|muốn … cũng không thể|{熱が/あって/[起きようにも]/起きられない}。|Bị sốt nên muốn dậy cũng không dậy nổi.|起きるにも;起きたにも;起きてにも|Có ý muốn nhưng vì hoàn cảnh nên không làm được.
87|kn|～て は いられない|V て + は いられない|không thể cứ … mãi được|{試験が/近いから/[遊んで]/は いられない}。|Gần thi rồi nên không thể cứ chơi mãi được.|遊ぶ;遊んだ;遊び|Tình hình gấp, phải hành động.
88|qd|～に かけては|N + に かけては|về mặt … thì (giỏi nhất)|{[料理に かけては]/彼の/右に/出る 者は}いない。|Về khoản nấu ăn thì không ai hơn anh ấy.|料理に 対しては;料理に とっては;料理に よっては|Đi với năng lực, sở trường. Vế sau: đánh giá tích cực.
89|qd|～から いうと／～から いえば|N + から いうと|xét về mặt …|{味[から いうと]/A店の/ほうが/上だ}。|Xét về vị thì quán A ngon hơn.|に いうと;を いうと;で いうと|Đứng trên một góc độ để nhận xét. Gần ～から 見ると.
90|qd|～から して|N + から して|ngay từ … (đã); xét từ|{あの 人は/[話し方から して]/偉そうで/好きに}なれない。|Người đó ngay từ cách nói chuyện đã có vẻ kiêu căng, tôi không ưa nổi.|話し方に よって;話し方に 対して;話し方に つき|Lấy một chi tiết nhỏ làm ví dụ, ngụ ý những thứ khác càng như thế.
91|qd|～を めぐって|N + を めぐって|xoay quanh (tranh luận, đối lập)|{新しい 空港の/[建設を めぐって]/住民の/意見が}分かれて いる。|Ý kiến người dân chia rẽ xoay quanh việc xây sân bay mới.|建設を こめて;建設を もとに;建設を はじめ|Vế sau: tranh luận, đối lập, vấn đề. N を めぐる N.
92|qd|～に 向けて|N + に 向けて|hướng tới (mục tiêu)|{オリンピック/[に 向けて]/毎日/練習して}いる。|Tôi luyện tập mỗi ngày hướng tới Olympic.|に 比べて;に 加えて;に 代わって|N に 向けた N. Khác 向け (dành cho).
93|qd|～を 対象に（して）|N + を 対象に|lấy … làm đối tượng|{この 調査は/[大学生を]/対象に/行われた}。|Cuộc khảo sát này được tiến hành với đối tượng là sinh viên.|大学生に;大学生が;大学生で|N を 対象と した N: dành cho đối tượng N.
94|qd|～に 至るまで|N + に 至るまで|cho đến cả (phạm vi rộng)|{その 歌は/子どもから/[お年寄りに]/至るまで}人気が ある。|Bài hát đó được yêu thích từ trẻ em cho đến cả người già.|お年寄りを;お年寄りが;お年寄りで|Hay đi với から: ～から ～に 至るまで.
95|qd|～は もとより|N + は もとより|… là đương nhiên, (cả) …|{この 店は/[味は もとより]/サービスも/いい}。|Quán này vị ngon là đương nhiên, phục vụ cũng tốt.|味に 限って;味を 問わず;味に とって|Văn viết của ～は もちろん.
96|qd|～を 除いて|N + を 除いて|ngoại trừ|{この 店は/[日曜日を]/除いて/毎日}開いて いる。|Quán này mở cửa hằng ngày trừ chủ nhật.|日曜日に;日曜日で;日曜日が|Văn viết của ～以外.
97|qd|～のみならず|N / thể thường + のみならず|không chỉ … mà còn (văn viết)|{この 問題は/[日本のみならず]/世界全体の/問題}である。|Vấn đề này không chỉ của Nhật mà của cả thế giới.|日本ばかりに;日本だけに;日本のみで|Văn viết của ～だけで なく. Vế sau hay có も.
98|qd|～と しては|N + と しては|với tư cách / về phía …|{[私と しては]/この 案に/賛成/できません}。|Về phía tôi, tôi không thể tán thành phương án này.|私に しては;私に よっては;私に つき|Nêu lập trường của người nói hoặc tổ chức.
99|qd|～なりに|N + なりに / なりの|theo cách riêng của (tuy có hạn)|{子どもは/[子どもなりに]/いろいろ/考えて}いる。|Trẻ con cũng có suy nghĩ theo kiểu trẻ con.|子どもほどに;子どもまでに;子どもさえに|Thừa nhận giới hạn nhưng vẫn cố gắng hết khả năng mình.
100|qd|～に 関わる|N + に 関わる|liên quan đến (nghiêm trọng)|{これは/[命に]/関わる/問題だ}。|Đây là vấn đề liên quan đến tính mạng.|命を;命が;命で|Hay gặp: 命に 関わる, 名誉に 関わる.
101|qd|～を 踏まえて|N + を 踏まえて|dựa trên (kết quả, ý kiến)|{アンケートの/[結果を]/踏まえて/計画を}見直した。|Dựa trên kết quả khảo sát, chúng tôi đã xem lại kế hoạch.|結果に;結果で;結果が|Văn viết, công việc.
102|qd|～を 経て|N + を 経て|trải qua, thông qua|{三年の/[研究を]/経て/新しい 薬が}完成した。|Trải qua ba năm nghiên cứu, thuốc mới đã hoàn thành.|研究に;研究で;研究が|Qua một quá trình hoặc địa điểm: 香港を 経て 東京へ.
103|qd|～は さておき|N + は さておき|tạm gác … sang một bên|{冗談は/[さておき]/本題に/入りましょう}。|Đùa thế thôi, giờ vào vấn đề chính nào.|もとより;もちろん;ともに|Chuyển sang chuyện chính.
104|qd|～に かかわらず|N / V る V ない + に かかわらず|bất kể, không phân biệt|{試合は/[天気に]/かかわらず/行われます}。|Trận đấu sẽ diễn ra bất kể thời tiết.|天気を;天気で;天気が|Đi với danh từ có hai mặt: 天気, 年齢, 経験の 有無, 行く 行かない. Gần ～を 問わず.
105|qd|～かぎりでは|V る / V た / V ている + かぎりでは|theo phạm vi (mình biết) thì|{私が/[知って いる]/かぎりでは/彼は}独身です。|Theo tôi biết thì anh ấy độc thân.|知って;知ろう;知れ|Đi với 知る, 見る, 聞く, 調べる. Giới hạn thông tin.
106|qd|～を もって|N + を もって|bằng; vào lúc (rất trang trọng)|{本日を/[もって]/営業を/終了}いたします。|Chúng tôi xin kết thúc kinh doanh kể từ hôm nay.|もとに;こめて;めぐって|以上を もって (đến đây là hết), 書面を もって (bằng văn bản).
107|qd|～次第だ／～次第で（tùy）|N + 次第だ / 次第で|tùy vào, phụ thuộc vào|{成功するか/どうかは/[あなた]/次第だ}。|Thành công hay không là tùy vào bạn.|あなたの;あなたに;あなたを|次第では: tùy … mà có khi. Khác 次第 (ngay khi) ở N3.
108|qd|～に 応えて|N + に 応えて|đáp ứng, đáp lại|{ファンの/[声に]/応えて/もう 一曲}歌った。|Đáp lại tiếng gọi của người hâm mộ, anh ấy hát thêm một bài.|声を;声で;声が|Hay gặp: 期待に 応えて, 要望に 応えて.
109|qd|～に よらず|N + に よらず|bất kể, không phụ thuộc vào|{彼は/[見かけに]/よらず/力が}強い。|Anh ấy khỏe hơn vẻ bề ngoài.|見かけを;見かけが;見かけで|Hay gặp: 見かけに よらず, 何事に よらず.
110|tc|～まみれ|N + まみれ|dính đầy, lấm lem|{子どもたちは/[泥まみれ]/に なって/遊んで}いる。|Bọn trẻ chơi đến lấm lem bùn đất.|泥ぎみ;泥がち;泥めく|Dính khắp người chất bẩn, chất lỏng: 汗, 泥, 血, ほこり. Khác だらけ (nhiều, khắp nơi).
111|tc|～めく|N + めく|có vẻ, mang dáng dấp|{日差しが/[春めいて]/きた/ね}。|Nắng đã có vẻ xuân rồi nhỉ.|春らしくて;春がちで;春ぎみで|Hay gặp: 春めく, 謎めいた, 皮肉めいた.
112|tc|～ては（lặp lại）|V て + は + V|hễ … là lại (lặp đi lặp lại)|{彼は/[食べては]/寝て/ばかり}いる。|Anh ấy cứ ăn xong là ngủ.|食べても;食べろ;食べに|Hai hành động lặp đi lặp lại. ～ては ～、～ては ～.
113|tc|～ずくめ|N + ずくめ|toàn là, toàn …|{今年は/[いいこと]/ずくめの/一年だった}。|Năm nay là một năm toàn chuyện tốt.|いいことの;いいことが;いいことを|Hay gặp: 黒ずくめ, いいことずくめ, 規則ずくめ.
114|tc|～始末だ|V る / この + 始末だ|rốt cuộc đến mức (tệ hại)|{弟は/遊んで ばかりで、/とうとう/[学校を やめる 始末だ]}。|Em trai chỉ toàn chơi, rốt cuộc đến mức bỏ học.|学校を やめて 始末だ;学校を やめよう 始末だ;学校を やめず 始末だ|Kết quả xấu sau một quá trình. Hay đi với とうとう, ついに.
115|nm|～て こそ|V て + こそ|phải … thì mới (thật sự)|{自分で/[やって]/こそ/本当の}力が つく。|Phải tự làm thì mới có năng lực thật sự.|やる;やった;やろう|Nhấn mạnh điều kiện cần.
116|nm|～すら|N (+ trợ từ) + すら|ngay cả (văn viết)|{忙しくて/食事を/する/[時間すら]}ない。|Bận đến nỗi ngay cả thời gian ăn cũng không có.|時間ずつ;時間ごと;時間ぶり|Văn viết của さえ. Hay đi với phủ định.
117|nm|～ことか|từ để hỏi + thể thường + ことか|biết bao, đến nhường nào|{あなたからの/手紙を/どんなに/[待って いた ことか]}。|Tôi đã đợi thư của bạn biết bao.|待って いた ものか;待って いた わけか;待って いた はずか|Hay đi với どんなに, 何度, どれほど.
118|nm|～限りだ|Aい / Aな な + 限りだ|vô cùng, hết sức (cảm xúc)|{一人で/外国に/行くなんて/[心細い 限りだ]}。|Một mình ra nước ngoài thì thật vô cùng lo lắng.|心細さ 限りだ;心細く 限りだ;心細くて 限りだ|Cảm xúc của chính người nói: うれしい 限りだ, 残念な 限りだ.
119|nm|～と いったら ない|N / Aい + と いったら ない|… không tả nổi|{試験に/落ちた ときの/[悔しさと]/いったら ない}。|Nỗi uất ức khi trượt thi thì không sao tả nổi.|悔しさを;悔しさが;悔しさに|Cảm xúc, mức độ cực đại. Văn nói: ～ったら ない.
120|nm|～とは（bất ngờ）|thể thường + とは|không ngờ là …|{あの 人が/社長に/なる/[とは]}思わなかった。|Không ngờ người đó lại thành giám đốc.|でも;こそ;ほど|Ngạc nhiên. Có khi bỏ vế sau: まさか 彼が 犯人とは。
121|nm|～やら～やら|N / V る + やら|nào là … nào là (lộn xộn)|{引っ越しの/準備で、/[掃除やら]/荷造りやら}大変だ。|Chuẩn bị chuyển nhà, nào là dọn dẹp, nào là đóng đồ, thật vất vả.|掃除さえ;掃除ほど;掃除まで|Liệt kê nhiều việc, ý vất vả, lộn xộn.
122|nm|～だの～だの|N / thể thường + だの|nào là … nào là (phàn nàn)|{彼は/[高いだの]/まずいだの/文句ばかり}言う。|Anh ta toàn phàn nàn, nào là đắt, nào là dở.|高いのに;高いので;高いから|Liệt kê kèm ý chê bai, khó chịu.
123|nm|～と いい～と いい|N + と いい|cả … lẫn … (đều)|{この 服は/[色と いい]/形と いい/申し分}ない。|Bộ đồ này cả màu lẫn kiểu đều không chê vào đâu được.|色を いい;色で いい;色に いい|Đánh giá (tốt hoặc xấu) dựa trên nhiều mặt.
124|nm|～なり～なり|N / V る + なり|hoặc … hoặc (gợi ý)|{わからない ときは/[辞書を 引くなり]/人に 聞くなり/すれば}いい。|Khi không hiểu thì tra từ điển hoặc hỏi người khác là được.|辞書を 引くなら;辞書を 引くので;辞書を 引くのに|Gợi ý vài lựa chọn ví dụ.
125|nm|～て まで／～まで して|V て + まで; N + まで して|đến mức phải …|{借金を/[して まで]/ブランド品を/買う}必要は ない。|Không cần phải đến mức vay nợ để mua hàng hiệu.|する まで;した まで;しよう まで|Phê phán việc làm quá mức. N まで して: 徹夜まで して.
126|vn|～ったら|N + ったら|(cái) … thật là (trách, ngạc nhiên)|{うちの/[母ったら]/いつも/心配ばかり}して いる。|Mẹ tôi ấy à, lúc nào cũng lo lắng.|母ほど;母しか;母ずつ|Nêu chủ đề kèm cảm xúc bực, ngạc nhiên. Văn nói.
127|vn|～ってば|câu + ってば|đã bảo là … mà!|{何度も/言ってる/でしょ、/[行かないってば]}。|Đã bảo bao nhiêu lần rồi, không đi mà!|行かないっけ;行かないかしら;行かないっぽい|Thúc giục, khó chịu khi người kia không nghe.
128|vn|～って いう|N + って いう + N|gọi là (văn nói của という)|{田中さん/[って いう]/人から/電話}が ありました。|Có cuộc gọi từ người tên là Tanaka.|っぽい;ってば;ったら|Văn nói của と いう.
129|vn|～だって（ngay cả）|N + だって|ngay cả … cũng|{そんな こと、/[子どもだって]/知って/いる}よ。|Chuyện đó ngay cả trẻ con cũng biết.|子どもしか;子どもほど;子どもずつ|Văn nói của でも / さえ.
130|vn|～たって／～だって（dù）|V た + って; Aい くたって|dù có … (văn nói)|{いくら/[頼まれたって]/無理な ものは/無理だ}。|Dù có được nhờ bao nhiêu thì không được vẫn là không được.|頼まれたら;頼まれると;頼まれれば|Văn nói của ～ても.
131|vn|～に したって|N / thể thường + に したって|dù … đi nữa (văn nói)|{遅れる/[に したって]/連絡ぐらい/しなさい}よ。|Dù có đến muộn thì ít nhất cũng phải báo một tiếng chứ.|に とって;に ついて;に よって|Văn nói của ～に しても.
132|yc|～もの では ない|V る + もの では ない|không nên (lẽ thường)|{人の/悪口を/[言う]/もの では ない}。|Không nên nói xấu người khác.|言った;言って;言おう|Lời khuyên theo lẽ thường, đạo đức.
133|yc|～ない では すまない|V ない + では すまない; V ない (bỏ ない) + ずには すまない|không thể không (phải làm, theo lẽ)|{人の 物を/壊したら/[弁償しない]/では すまない}。|Nếu làm hỏng đồ của người khác thì không thể không bồi thường.|弁償する;弁償して;弁償した|Theo lẽ thường, nghĩa vụ xã hội buộc phải làm.
134|yc|～よう では ないか|V よう + では ないか|chúng ta hãy cùng … (kêu gọi)|{みんなで/力を/[合わせよう]/では ないか}。|Mọi người hãy cùng hợp sức nào.|合わせる;合わせた;合わせて|Kêu gọi trang trọng, diễn văn.
135|yc|～べからず|V る + べからず|cấm (biển báo)|{この 先、/関係者 以外/[立ち入る]/べからず}。|Từ đây trở đi, cấm người không phận sự vào.|立ち入った;立ち入って;立ち入ろう|Biển báo, nội quy. する → するべからず / すべからず.
136|yc|～ねば ならない|V ない (bỏ ない) + ねば ならない|phải (văn viết)|{約束は/[守らね]/ば/ならない}。|Lời hứa thì phải giữ.|守らない;守らなく;守らず|Văn viết của ～なければ ならない. する → せねば.
137|yc|～には 及ばない|V る / N + には 及ばない|không cần phải …|{わざわざ/[来る]/には/及びません}。|Không cần phải mất công đến đâu.|来た;来て;来よう|Lịch sự, trang trọng. Cố định: それには 及ばない.
138|yc|～ても 差し支えない|V て + も 差し支えない|… cũng không sao (trang trọng)|{ここに/車を/[止めて]/も 差し支えありません}。|Đỗ xe ở đây cũng không sao.|止める;止めた;止めよう|Lịch sự của ～ても いい.
139|kg|お／ご～申し上げる|お V ます / ご N + 申し上げる|(khiêm nhường, rất trang trọng)|{皆様の/ご来店を/心より/[お待ち申し上げて]}おります。|Chúng tôi chân thành chờ đón quý khách ghé cửa hàng.|お待ちになって;お待ちくださって;お待ちされて|Khiêm nhường hơn お～する. Dùng trong thư, thông báo.
140|kg|～て まいる|V て + まいる|(khiêm nhường của ～て いく / ～て くる)|{これからも/[努力して]/まいります/ので}よろしく お願いします。|Từ nay chúng tôi cũng sẽ tiếp tục nỗ lực, mong được giúp đỡ.|努力する;努力した;努力しよう|まいる = 行く / 来る khiêm nhường. Hay dùng khi phát biểu.
141|kh|～上（に）|thể thường (N の / Aな な) + 上に|hơn nữa, thêm vào đó|{この 部屋は/[広い]/上に/駅にも}近い。|Căn phòng này rộng, hơn nữa lại gần ga.|広く;広くて;広さ|Thêm một điểm cùng chiều (cùng tốt hoặc cùng xấu).
142|kh|～こと なく|V る + こと なく|mà không … (văn viết)|{彼は/一日も/[休む]/こと なく}働いた。|Anh ấy làm việc không nghỉ một ngày nào.|休んだ;休んで;休み|Văn viết của ～ないで.
143|kh|～なしに／～なしで|N + なしに|không có …; mà không …|{許可/[なしに]/この 部屋に/入らないで}ください。|Xin đừng vào phòng này khi chưa được phép.|だけに;ほどに;ごとに|Văn viết. ～なしには: nếu không có … thì không.
144|kh|～抜きで／～抜きに|N + 抜きで|bỏ qua, không có|{今日は/[仕事の 話は]/抜きで/楽しみましょう}。|Hôm nay gác chuyện công việc sang một bên, cùng vui thôi.|仕事の 話に;仕事の 話で;仕事の 話へ|Gần ～なしで. ～を 抜きに して: không kể đến.
145|kh|～つつ（vừa … vừa）|V ます (bỏ ます) + つつ|vừa … vừa (văn viết)|{景色を/[楽しみ]/つつ/ゆっくり}歩いた。|Vừa ngắm cảnh vừa thong thả đi bộ.|楽しむ;楽しんで;楽しんだ|Văn viết của ～ながら. Chủ ngữ hai vế là một.
146|kh|～ぬく|V ます (bỏ ます) + ぬく|làm đến cùng (vượt khó)|{彼は/42キロを/最後まで/[走りぬいた]}。|Anh ấy đã chạy hết 42 km đến tận cùng.|走りかけた;走りがちだった;走りっこない|Vượt khó để hoàn thành. Gần ～きる nhưng nhấn sự kiên trì.
147|kh|～通す|V ます (bỏ ます) + 通す|làm suốt, giữ đến cùng|{彼は/最後まで/自分の 意見を/[言い通した]}。|Anh ấy đã giữ ý kiến của mình đến cùng.|言いかけた;言いがちだった;言いっこない|Duy trì một hành động, trạng thái: 歩き通す, 守り通す.
148|kh|～と いった|N + と いった + N|như là (liệt kê ví dụ)|{この 店では/すしや/[てんぷらと いった]/日本料理が}食べられる。|Ở quán này có thể ăn các món Nhật như sushi, tempura.|てんぷらと いって;てんぷらと いえば;てんぷらと いうと|Liệt kê ví dụ tiêu biểu.
149|kh|～を～と して|N1 を N2 と して|lấy N1 làm N2|{彼は/[音楽を]/趣味と して/楽しんで}いる。|Anh ấy chơi nhạc như một sở thích.|音楽に;音楽が;音楽で|Hay gặp: ～を 目的と して, ～を 中心と して.
150|kh|～か 何か|N + か 何か|hay cái gì đó (tương tự)|{[ペンか 何か]/書く ものを/貸して/もらえますか}。|Cho tôi mượn bút hay cái gì để viết được không?|ペンや 何か;ペンも 何か;ペンと 何か|Đưa ví dụ một cách mơ hồ.
151|kh|～がてら|V ます / N + がてら|nhân tiện (làm hai việc một lúc)|{散歩/[がてら]/コンビニに/寄った}。|Nhân tiện đi dạo, tôi ghé cửa hàng tiện lợi.|ついで;ながら;つつ|Vế sau thường là động từ di chuyển.
152|kh|～か 否か|thể thường + か 否か|có … hay không (văn viết)|{参加する/[か 否か]/今週中に/お知らせ}ください。|Xin hãy báo trong tuần này là có tham gia hay không.|か 何か;か ばかり;か さえ|Văn viết của ～か どうか.
`);
