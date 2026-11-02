/* ===== DATA (from JLPT_N2_tong_hop.md) ===== */
const L = s => s.trim().split('\n').map(r => r.trim()).filter(Boolean).map(r => r.split('|').map(x => x.trim()));

const KANA_BASE = `あ a|い i|う u|え e|お o|か ka|き ki|く ku|け ke|こ ko|さ sa|し shi|す su|せ se|そ so|た ta|ち chi|つ tsu|て te|と to|な na|に ni|ぬ nu|ね ne|の no|は ha|ひ hi|ふ fu|へ he|ほ ho|ま ma|み mi|む mu|め me|も mo|や ya|ゆ yu|よ yo|ら ra|り ri|る ru|れ re|ろ ro|わ wa|を o|ん n`;
const KANA_DAKU = `が ga|ぎ gi|ぐ gu|げ ge|ご go|ざ za|じ ji|ず zu|ぜ ze|ぞ zo|だ da|ぢ ji|づ zu|で de|ど do|ば ba|び bi|ぶ bu|べ be|ぼ bo|ぱ pa|ぴ pi|ぷ pu|ぺ pe|ぽ po`;
const KANA_YOU = `きゃ kya|きゅ kyu|きょ kyo|しゃ sha|しゅ shu|しょ sho|ちゃ cha|ちゅ chu|ちょ cho|にゃ nya|にゅ nyu|にょ nyo|ひゃ hya|ひゅ hyu|ひょ hyo|みゃ mya|みゅ myu|みょ myo|りゃ rya|りゅ ryu|りょ ryo|ぎゃ gya|ぎゅ gyu|ぎょ gyo|じゃ ja|じゅ ju|じょ jo|びゃ bya|びゅ byu|びょ byo|ぴゃ pya|ぴゅ pyu|ぴょ pyo`;
const KANA = [KANA_BASE, KANA_DAKU, KANA_YOU].join('|').split('|').map(s => s.split(' '));
const toKata = s => [...s].map(c => { const n = c.charCodeAt(0); return n >= 0x3041 && n <= 0x3096 ? String.fromCharCode(n + 96) : c; }).join('');

/* char | Hán-Việt | On | Kun | nghĩa | từ ví dụ */
const KANJI5 = L(`
一|nhất|イチ|ひと(つ)|một|一つ ひとつ · 一日 ついたち
二|nhị|ニ|ふた(つ)|hai|二人 ふたり
三|tam|サン|みっ(つ)|ba|三月 さんがつ
四|tứ|シ|よ(ん)・よっ(つ)|bốn|四時 よじ
五|ngũ|ゴ|いつ(つ)|năm (số)|五分 ごふん
六|lục|ロク|むっ(つ)|sáu|六百 ろっぴゃく
七|thất|シチ|なな|bảy|七日 なのか
八|bát|ハチ|やっ(つ)|tám|八百屋 やおや
九|cửu|キュウ・ク|ここの(つ)|chín|九時 くじ
十|thập|ジュウ|とお|mười|十分 じゅっぷん
百|bách|ヒャク|—|trăm|三百 さんびゃく
千|thiên|セン|ち|nghìn|千円 せんえん
万|vạn|マン・バン|—|vạn (10.000)|一万円 いちまんえん
円|viên|エン|まる(い)|yên; tròn|百円 ひゃくえん
日|nhật|ニチ・ジツ|ひ・か|ngày, mặt trời|毎日 まいにち
月|nguyệt|ゲツ・ガツ|つき|tháng, trăng|月曜日 げつようび
火|hỏa|カ|ひ|lửa|火曜日 かようび
水|thủy|スイ|みず|nước|水曜日 すいようび
木|mộc|モク・ボク|き|cây|木曜日 もくようび
金|kim|キン|かね|vàng, tiền|お金 おかね
土|thổ|ド・ト|つち|đất|土曜日 どようび
曜|diệu|ヨウ|—|thứ (trong tuần)|日曜日 にちようび
年|niên|ネン|とし|năm|去年 きょねん
時|thời|ジ|とき|giờ, lúc|時間 じかん
分|phân|ブン・フン|わ(かる)|phút, phần; hiểu|分析 ぶんせき
半|bán|ハン|なか(ば)|nửa|半分 はんぶん
今|kim|コン|いま|bây giờ|今日 きょう
何|hà|カ|なに・なん|cái gì|何時 なんじ
毎|mỗi|マイ|—|mỗi|毎朝 まいあさ
週|chu|シュウ|—|tuần|今週 こんしゅう
午|ngọ|ゴ|—|buổi trưa|午後 ごご
前|tiền|ゼン|まえ|trước|午前 ごぜん
後|hậu|ゴ・コウ|あと・うし(ろ)|sau|後で あとで
先|tiên|セン|さき|trước, đầu|先生 せんせい
生|sinh|セイ・ショウ|い(きる)・う(まれる)|sống, sinh|学生 がくせい
学|học|ガク|まな(ぶ)|học|大学 だいがく
校|hiệu|コウ|—|trường|学校 がっこう
人|nhân|ジン・ニン|ひと|người|日本人 にほんじん
子|tử|シ|こ|con, trẻ|子ども こども
女|nữ|ジョ|おんな|nữ|女の人 おんなのひと
男|nam|ダン・ナン|おとこ|nam|男性 だんせい
友|hữu|ユウ|とも|bạn|友達 ともだち
父|phụ|フ|ちち|bố|お父さん おとうさん
母|mẫu|ボ|はは|mẹ|お母さん おかあさん
名|danh|メイ・ミョウ|な|tên|名前 なまえ
山|sơn|サン|やま|núi|富士山 ふじさん
川|xuyên|セン|かわ|sông|川沿い かわぞい
田|điền|デン|た|ruộng|田中 たなか
天|thiên|テン|あめ|trời|天気 てんき
気|khí|キ|—|khí, tinh thần|元気 げんき
雨|vũ|ウ|あめ|mưa|大雨 おおあめ
花|hoa|カ|はな|hoa|花見 はなみ
東|đông|トウ|ひがし|phía đông|東京 とうきょう
西|tây|セイ・サイ|にし|phía tây|関西 かんさい
南|nam|ナン|みなみ|phía nam|南口 みなみぐち
北|bắc|ホク|きた|phía bắc|北海道 ほっかいどう
上|thượng|ジョウ|うえ・あ(がる)|trên|上手 じょうず
下|hạ|カ・ゲ|した・さ(がる)|dưới|下水 げすい
中|trung|チュウ|なか|giữa, trong|中国 ちゅうごく
外|ngoại|ガイ|そと|ngoài|外国 がいこく
左|tả|サ|ひだり|trái|左手 ひだりて
右|hữu|ウ・ユウ|みぎ|phải|右側 みぎがわ
大|đại|ダイ・タイ|おお(きい)|to|大学 だいがく
小|tiểu|ショウ|ちい(さい)・こ|nhỏ|小学校 しょうがっこう
長|trường|チョウ|なが(い)|dài; trưởng|社長 しゃちょう
高|cao|コウ|たか(い)|cao, đắt|高校 こうこう
安|an|アン|やす(い)|rẻ, yên ổn|安心 あんしん
新|tân|シン|あたら(しい)|mới|新聞 しんぶん
古|cổ|コ|ふる(い)|cũ|中古 ちゅうこ
白|bạch|ハク|しろ(い)|trắng|白紙 はくし
国|quốc|コク|くに|nước, quốc gia|国際 こくさい
語|ngữ|ゴ|かた(る)|ngôn ngữ|日本語 にほんご
本|bản|ホン|もと|sách; gốc|日本 にほん
車|xa|シャ|くるま|xe|電車 でんしゃ
電|điện|デン|—|điện|電話 でんわ
駅|dịch|エキ|—|nhà ga|駅前 えきまえ
道|đạo|ドウ|みち|đường|水道 すいどう
店|điếm|テン|みせ|cửa hàng|店員 てんいん
社|xã|シャ|やしろ|công ty, đền|会社 かいしゃ
会|hội|カイ|あ(う)|gặp, hội|会議 かいぎ
食|thực|ショク|た(べる)|ăn|食事 しょくじ
飲|ẩm|イン|の(む)|uống|飲み物 のみもの
見|kiến|ケン|み(る)|nhìn|意見 いけん
聞|văn|ブン|き(く)|nghe, hỏi|新聞 しんぶん
読|độc|ドク|よ(む)|đọc|読書 どくしょ
書|thư|ショ|か(く)|viết|辞書 じしょ
話|thoại|ワ|はな(す)|nói, chuyện|会話 かいわ
行|hành|コウ・ギョウ|い(く)・おこな(う)|đi; tiến hành|旅行 りょこう
来|lai|ライ|く(る)|đến|来年 らいねん
出|xuất|シュツ|で(る)・だ(す)|ra|出口 でぐち
入|nhập|ニュウ|はい(る)・い(れる)|vào|入口 いりぐち
休|hưu|キュウ|やす(む)|nghỉ|休日 きゅうじつ
買|mãi|バイ|か(う)|mua|買い物 かいもの
言|ngôn|ゲン・ゴン|い(う)|nói|言葉 ことば
立|lập|リツ|た(つ)|đứng|国立 こくりつ
手|thủ|シュ|て|tay|手紙 てがみ
目|mục|モク|め|mắt|目的 もくてき
口|khẩu|コウ|くち|miệng|人口 じんこう
耳|nhĩ|ジ|みみ|tai|耳鼻科 じびか
足|túc|ソク|あし・た(りる)|chân; đủ|不足 ふそく
力|lực|リョク|ちから|sức|能力 のうりょく
`);

/* bộ | tên HV | nghĩa | ví dụ */
const RADICALS = L(`
亻 (人)|nhân|người|休 体 住 作
氵 (水)|thủy|nước|海 池 汚 洗 浄
扌 (手)|thủ|tay, động tác|持 打 指 投
木|mộc|cây, gỗ|林 森 板 材
口|khẩu|miệng|味 呼 吸
日|nhật|mặt trời, ngày|明 時 晴 暗
月 (肉)|nguyệt / nhục|trăng / cơ thể|期 / 腹 胃 脳
言 (訁)|ngôn|lời nói|話 語 読 説
糸|mịch|sợi, dây|紙 線 結 絵
金 (釒)|kim|kim loại|銀 鉄 銅 針
土|thổ|đất|地 場 坂
女|nữ|phụ nữ|姉 妹 好 始
心 (忄)|tâm|tim, tình cảm|思 忘 情 性
艹|thảo|cỏ, cây|花 茶 薬 草
辶|sước|đi, đường|道 近 遠 送
宀|miên|mái nhà|家 安 室 客
門|môn|cổng|間 開 閉
貝|bối|tiền, của|買 費 貸 資
食 (飠)|thực|ăn|飲 飯 館
車|xa|xe|転 軽 輸
火 (灬)|hỏa|lửa|焼 燃 熱 点
雨|vũ|mưa, thời tiết|雪 雲 電
目|mục|mắt|見 眠 眼
足 (⻊)|túc|chân|路 跳
禾|hòa|lúa|秋 科 税
竹 (⺮)|trúc|tre|答 箱 算
衣 (衤)|y|áo|製 複 補
示 (礻)|thị|thần, cúng|社 神 祝
刀 (刂)|đao|dao, cắt|分 切 別
力|lực|sức|動 助 努
攵|phộc|đánh, tác động|教 数 放
广|nghiễm|mái hiên|店 広 庭
疒|nạch|bệnh|病 痛 療
阝|phụ / ấp|đồi / làng|院 階 / 都 部
頁|hiệt|đầu|頭 顔 題
馬|mã|ngựa|駅 験
魚|ngư|cá|鮮
鳥|điểu|chim|鳴
山|sơn|núi|岩 島
石|thạch|đá|研 破 確
田|điền|ruộng|町 男 界
米|mễ|gạo|料 粉 精
走|tẩu|chạy|起 超
酉|dậu|rượu, lên men|酒 配 酸
彳|xích|bước đi|行 待 後
王 (玉)|vương / ngọc|vua, ngọc|理 現 球
犭|khuyển|thú vật|犯 猫
隹|chuy|chim đuôi ngắn|集 難 雑
尸|thi|thân, nhà|屋 届
戸|hộ|cửa|所 房
`);

/* GRAMMAR: level | group | pattern | meaning | example ([...] = chỗ trống khi làm quiz) */
const G5 = L(`
N は N です / じゃありません|là / không phải là|私[は]ベトナム人です。
N の N|của, thuộc|大学[の]先生
～か|câu hỏi|これは何です[か]。
も|cũng|田中さんは学生です。私[も]学生です。
Vます / ません / ました / ませんでした|thì lịch sự|昨日、勉強[しませんでした]。
を|tân ngữ|水[を]飲みます。
に (thời gian, đích, chỗ tồn tại)|lúc, đến, ở|7時[に]起きます。
で (nơi hành động, phương tiện)|ở, bằng|研究室[で]実験します。
へ|hướng đến|東京[へ]行きます。
と|và, cùng với|友達[と]話します。
から～まで|từ… đến…|9時から5時[まで]働きます。
N があります / います|có (đồ vật / người, con vật)|机の上に本が[あります]。
A-い / A-くない / A-かった|tính từ い|今日は寒[くない]です。
Na だ / じゃない / だった|tính từ な|この町は静か[です]。
N が好き / 嫌い / 上手 / 下手|thích / ghét / giỏi / kém|日本料理が[好き]です。
N が分かります|hiểu|日本語が少し[分かります]。
Vたい|muốn làm|富士山に登り[たい]です。
Vましょう / Vましょうか|cùng làm nhé / để tôi làm nhé|一緒に行き[ましょう]。
Vませんか|mời: làm… không?|お茶を飲み[ませんか]。
(Vます) に行く|đi để làm|買い物[に行きます]。
Vてください|hãy làm|ちょっと待って[ください]。
Vています|đang làm / trạng thái|雨が降って[います]。
Vてもいいです|được phép|写真を撮って[もいい]ですか。
Vてはいけません|không được|ここでタバコを吸って[はいけません]。
Vないでください|đừng làm|心配し[ないでください]。
Vなければなりません|phải làm|レポートを出さ[なければなりません]。
Vなくてもいいです|không cần làm|明日は来[なくてもいい]です。
Vたことがあります|đã từng|北海道に行った[ことがあります]。
Vたり Vたりする|lúc thì… lúc thì…, nào là…|週末は掃除し[たり]洗濯したりします。
Vる前に / Vた後で|trước khi / sau khi|寝る[前に]歯を磨きます。
～から (lý do)|vì|忙しい[から]、行きません。
～が (nối 2 vế)|nhưng|高いです[が]、おいしいです。
～とき|khi|子どもの[とき]、よく泳ぎました。
N より N のほうが～|so sánh hơn|バス[より]電車のほうが速いです。
N の中で N がいちばん～|nhất|一年で[いちばん]寒いのは2月です。
もう / まだ|đã rồi / vẫn chưa|[もう]食べました。
～ね / ～よ|nhỉ (đồng tình) / đấy (thông báo)|いい天気です[ね]。
`);
const G4 = L(`
Vて、Vて|nối hành động|朝起き[て]、シャワーを浴びて、出かけます。
Vてから|sau khi (rồi mới)|宿題をして[から]遊びます。
可能形 / Vることができる|có thể|日本語を話す[ことができます]。
Vるようになる|trở nên có thể|納豆が食べられる[ようになりました]。
Vるようにする|cố gắng (tạo thói quen)|毎日野菜を食べる[ようにしています]。
Vる/N のために|để, vì mục đích (chủ ý)|留学の[ために]お金をためています。
V(可能/ない)ように|để (không chủ ý)|忘れない[ように]メモします。
～と (điều kiện)|hễ… thì (tự nhiên)|このボタンを押す[と]、水が出ます。
～ば|nếu|安け[れば]買います。
～たら|nếu / khi… thì|駅に着い[たら]、電話してください。
～なら|nếu (là chuyện đó) thì|京都に行く[なら]、秋がいいですよ。
～ても|dù… cũng|雨が降っ[ても]行きます。
～のに|vậy mà (bất mãn)|約束した[のに]、来なかった。
～ので|vì (lịch sự, khách quan)|熱がある[ので]、休みます。
～し、～し|vừa… lại vừa (liệt kê lý do)|安い[し]、近いし、この店が好きです。
Vます/A/Na + そうだ|trông có vẻ|おいし[そう]ですね。
普通形 + そうだ|nghe nói|明日は雪だ[そうです]。
～ようだ / みたいだ|hình như (dựa vào quan sát)|誰もいない[ようです]。
～らしい|nghe nói / có vẻ (thông tin gián tiếp)|部長は来月転勤する[らしい]。
～はずだ|chắc chắn là (theo suy luận)|荷物は今日届く[はずです]。
～かもしれない|có lẽ|遅れる[かもしれません]。
～でしょう / だろう|chắc là|明日は晴れる[でしょう]。
～と思う / ～と言う|nghĩ rằng / nói rằng|先生はテストは簡単だ[と言いました]。
意向形 + と思う|định làm|来年、N3を受けよう[と思います]。
Vる/Vない つもりだ|định (không) làm|夏休みは国に帰る[つもりです]。
N/Vる 予定だ|dự định (theo lịch)|会議は3時からの[予定です]。
Vてみる|thử làm|この服を着て[みても]いいですか。
Vてしまう|lỡ… / làm xong hết|財布を忘れて[しまいました]。
Vておく|làm sẵn trước|会議の前に資料を読んで[おきます]。
(他動詞) Vてある|đã làm sẵn, trạng thái còn lại|窓が開けて[あります]。
Vていく / Vてくる|dần dần (tương lai / đến nay)|これから寒くなって[いきます]。
あげる / くれる / もらう|cho / cho tôi / nhận|友達が本を[くれました]。
Vてあげる / くれる / もらう|làm giúp|先輩に日本語を教えて[もらいました]。
受身形 (bị động)|bị, được|先生にほめ[られました]。
使役形 (sai khiến)|bắt, cho phép làm|母は弟に野菜を食べ[させた]。
使役受身形|bị bắt phải làm|部長にお酒を飲ま[されました]。
Vます + ながら|vừa… vừa|音楽を聞き[ながら]勉強します。
Vます/A/Na + すぎる|quá|食べ[すぎました]。
Vます + やすい / にくい|dễ / khó làm|この字は読み[にくい]。
Vます + 方|cách làm|切符の買い[方]を教えてください。
～かどうか / 疑問詞～か|có… hay không / câu hỏi lồng|彼が来る[かどうか]分かりません。
Vることにする|quyết định|毎朝走る[ことにしました]。
Vることになる|được quyết định (khách quan)|来月、大阪に転勤する[ことになりました]。
Vたばかり|vừa mới|日本に来た[ばかり]です。
Vる / Vている / Vた ところだ|sắp / đang / vừa mới|今から出かける[ところです]。
～までに|trước (hạn)|金曜日[までに]出してください。
～間 / ～間に|suốt trong / trong lúc|夏休みの[間に]、運転免許を取りたい。
Vなさい|hãy (bề trên nói)|早く寝[なさい]。
命令形 / Vるな|mệnh lệnh / cấm|触る[な]。
～とか～とか|nào là… nào là…|週末は映画[とか]買い物とかに行きます。
～ば～ほど|càng… càng|練習すればする[ほど]上手になる。
`);
const G3 = L(`
～わけだ|thảo nào, hóa ra là|毎日練習しているから、上手な[わけだ]。
～わけではない|không hẳn là|日本料理が嫌いな[わけではない]。
～わけがない|làm gì có chuyện|こんな難しい問題、子どもに分かる[わけがない]。
～わけにはいかない|không thể (vì đạo lý/hoàn cảnh)|明日は試験だから、休む[わけにはいかない]。
～はずがない|không thể nào|彼がうそをつく[はずがない]。
意向形 + とする|định làm, sắp làm thì|出かけよう[としたら]、雨が降ってきた。
Vることにしている|có quy tắc cho bản thân|夜11時以降は食べない[ことにしている]。
Vることになっている|theo quy định|実験室では白衣を着る[ことになっている]。
～ほど / ～くらい|đến mức|泣きたい[ほど]疲れた。
N によって / による|tùy theo / do, bởi|国[によって]習慣が違う。
N について|về|水質汚染[について]発表します。
N に対して|đối với, trái với|質問[に対して]答える。
N にとって|đối với (góc nhìn của ai)|留学生[にとって]、家賃は大きな問題だ。
N として|với tư cách là|研究生[として]来日した。
N のおかげで|nhờ (tích cực)|先輩の[おかげで]、論文が完成した。
N のせいで|tại, do (tiêu cực)|雪の[せいで]電車が遅れた。
～ため(に) (nguyên nhân)|vì (văn viết)|事故の[ため]、道路が閉鎖されています。
Vる/Vている 最中に|đang lúc|発表の[最中に]、電話が鳴った。
～うちに|trong khi còn… (tranh thủ)|若い[うちに]、いろいろ経験したい。
Vる/N の たびに|mỗi lần|この曲を聞く[たびに]、故郷を思い出す。
～ついでに|nhân tiện|郵便局に行く[ついでに]、手紙を出してきて。
～とおりに|đúng như|説明書の[とおりに]組み立てた。
Vずに (= Vないで)|mà không|朝ご飯を食べ[ずに]出かけた。
～まま|để nguyên|電気をつけた[まま]寝てしまった。
N だらけ|đầy (tiêu cực)|部屋がほこり[だらけ]だ。
～っぽい|có vẻ, hay…|最近忘れ[っぽい]。
Vます/N + がち|hay bị, có xu hướng (xấu)|冬は風邪をひき[がち]だ。
N らしい|đúng kiểu, ra dáng|今日は春[らしい]天気だ。
～ような / ～ように|như (ví dụ, so sánh)|夢の[ような]話だ。
Vることはない|không cần phải|心配する[ことはない]よ。
Vるしかない|chỉ còn cách|終電がないから、歩いて帰る[しかない]。
～ものだ|đương nhiên là / hồi đó hay…|人は変わる[ものだ]。
～ことだ|nên (lời khuyên)|上手になりたければ、毎日練習する[ことだ]。
～こそ|chính là|今年[こそ]N3に合格したい。
～さえ / ～さえ～ば|ngay cả / chỉ cần… là|時間[さえ]あれば行ける。
～ばかりか / ～だけでなく|không chỉ… mà còn|彼は英語[ばかりか]中国語も話せる。
N に比べて|so với|去年[に比べて]、雨が多い。
N に関して|liên quan đến|研究[に関して]質問があります。
N をはじめ|tiêu biểu là, trước hết là|東京[をはじめ]、大都市では家賃が高い。
N をもとに|dựa trên|実験データ[をもとに]論文を書いた。
N によると|theo (nguồn tin)|天気予報[によると]、明日は雨だ。
～に違いない|chắc chắn là|彼は犯人[に違いない]。
～かわりに|thay vì / bù lại|手伝ってもらう[かわりに]、ご飯をおごった。
Vます + かける / かけ|dở dang|読み[かけ]の本
Vます + きる|làm hết, trọn|マラソンを走り[きった]。
～ふりをする|giả vờ|寝ている[ふりをした]。
Vてほしい|muốn (người khác) làm|もっとゆっくり話して[ほしい]。
Vます + ようがない|không có cách nào|連絡先が分からないから、知らせ[ようがない]。
～ということだ|nghe nói / nghĩa là|会議は中止だ[ということだ]。
～って|(văn nói) nghe nói / cái gọi là|明日休みだ[って]。
Vる + べきだ|nên (nghĩa vụ)|約束は守る[べきだ]。
～てもかまわない|cũng không sao|鉛筆で書いて[もかまいません]。
～気がする|có cảm giác|誰かに見られている[気がする]。
～ようになっている|được thiết kế để|このドアは自動で閉まる[ようになっている]。
Vます + 出す|bắt đầu (bất chợt)|急に雨が降り[出した]。
～ば～のに|giá mà|もっと早く言えばよかった[のに]。
`);
const G2 = L(`
A|～ばかりに|chỉ vì (dẫn đến hậu quả xấu)|一言多かった[ばかりに]、彼女を怒らせてしまった。
A|～ものだから / もので|tại vì (thanh minh)|道が込んでいた[ものですから]、遅くなりました。
A|～ことから|từ việc… (nên)|富士山が見える[ことから]、この町は富士見町と呼ばれる。
A|～だけに|chính vì… nên càng|期待していた[だけに]、がっかりした。
A|～だけあって|quả không hổ là|プロ[だけあって]、さすがにうまい。
A|～からこそ|chính vì|君のことを思う[からこそ]、厳しく言うんだ。
A|～からには / 以上(は) / 上は|một khi đã… thì phải|引き受けた[からには]、最後までやる。
A|～せいか|không biết có phải do… mà|年の[せいか]、最近疲れやすい。
A|～ことだし|vì cũng… (nên làm gì đó đi)|雨もやんだ[ことだし]、出かけようか。
A|N につき|vì (thông báo trang trọng)|工事中[につき]、通行止め。
B|～としたら / とすれば|giả sử… thì|留学する[としたら]、どこがいい?
B|～ないことには|nếu không… thì không|実際に見[ないことには]、何とも言えない。
B|～てからでないと|nếu chưa… thì không thể|部長に確認して[からでないと]、返事できません。
B|～ものなら|nếu mà… (hậu quả lớn) / nếu có thể|行ける[ものなら]行きたい。
B|～次第で / 次第では|tùy vào|結果[次第では]、計画を変更する。
B|～かぎり|chừng nào còn|体が動く[かぎり]、働きたい。
B|～ないかぎり|chừng nào chưa|謝ら[ないかぎり]、許さない。
B|たとえ～ても|cho dù|[たとえ]反対されても、やめない。
C|～ものの|tuy… nhưng|買った[ものの]、一度も使っていない。
C|～ながら(も)|mặc dù|狭い[ながらも]、楽しい我が家。
C|～くせに|vậy mà (chê trách)|知っている[くせに]、教えてくれない。
C|～わりに(は)|so với… thì (khác dự đoán)|値段の[わりに]、おいしい。
C|～にもかかわらず|bất chấp, mặc dù|雨[にもかかわらず]、多くの人が集まった。
C|～反面|mặt khác|便利な[反面]、危険もある。
C|～一方(で)|mặt khác, trong khi đó|賛成する人がいる[一方で]、反対する人もいる。
C|～といっても|nói là… nhưng thực ra|料理ができる[といっても]、簡単なものだけだ。
C|～からといって|không phải cứ vì… mà|高い[からといって]、品質がいいとは限らない。
C|～とは限らない|không hẳn là|日本人だからといって、敬語が上手[とは限らない]。
C|～ことは～が|đúng là… nhưng|読んだ[ことは]読んだが、よく分からなかった。
D|～際(に)|khi (trang trọng)|お降りの[際は]、足元にご注意ください。
D|N に際して|nhân dịp, khi bắt đầu|入学[に際して]、説明会が行われた。
D|N に先立って|trước khi|開会[に先立って]、挨拶がありました。
D|Vます + 次第|ngay sau khi|結果が分かり[次第]、連絡します。
D|Vた + 末(に)|sau một hồi… cuối cùng|よく考えた[末に]、帰国することにした。
D|Vた + あげく|sau cùng thì (kết quả xấu)|迷った[あげく]、何も買わなかった。
D|Vて + 以来|kể từ khi|日本に来て[以来]、一度も帰国していない。
D|Vてはじめて|phải đến khi… mới|病気になって[はじめて]、健康のありがたさが分かった。
D|Vた + きり|từ lúc… rồi không|彼は出かけた[きり]、戻らない。
D|～につれて / にしたがって|cùng với, càng… càng|年をとる[につれて]、記憶力が落ちる。
D|N とともに|cùng với|経済の発展[とともに]、環境問題が増えた。
D|～一方だ|ngày càng (một chiều, thường xấu)|物価は上がる[一方だ]。
D|Vます + つつある|đang dần|地球の気温は上がり[つつある]。
D|Vます + つつ(も)|vừa… / dù biết|体に悪いと知り[つつ]、やめられない。
D|～ところに / へ / を|đúng lúc|出かけようとした[ところへ]、友達が来た。
D|～たところ|sau khi thử… thì|先生に相談した[ところ]、いいアドバイスをもらった。
D|N を契機に / をきっかけに|nhân cơ hội, nhờ việc|留学[をきっかけに]、環境問題に興味を持った。
E|N において / における|tại, trong (trang trọng)|会議は大ホール[において]行われる。
E|N にわたって|suốt, trải dài|3日間[にわたって]会議が行われた。
E|N を通じて / を通して|thông qua / suốt|一年[を通じて]暖かい。
E|N に応じて|tùy theo, đáp ứng|能力[に応じて]給料が決まる。
E|N に沿って|theo, dọc theo|計画[に沿って]進める。
E|N に基づいて|dựa trên (căn cứ)|調査結果[に基づいて]報告書を作成した。
E|N をめぐって|xoay quanh (tranh luận)|ダム建設[をめぐって]、意見が対立している。
E|N を中心に|lấy… làm trung tâm|若者[を中心に]人気がある。
E|N を問わず|bất kể|年齢[を問わず]、参加できます。
E|N にかかわらず|không liên quan đến|天候[にかかわらず]、試合は行われる。
E|N はともかく|khoan bàn đến|味[はともかく]、量は多い。
E|N はもちろん / はもとより|… thì đương nhiên|英語[はもちろん]、中国語も話せる。
E|N に限って|riêng… thì (lại)|急いでいる日[に限って]、電車が遅れる。
E|N / Vる に限る|… là nhất|疲れたときは寝る[に限る]。
E|N にかけては|về khoản… thì (giỏi nhất)|料理[にかけては]、彼にかなう人はいない。
E|N のもとで|dưới sự|田中先生の[もとで]研究している。
E|N 抜きで / 抜きに|không có, bỏ qua|冗談[抜きで]、本当に大変だった。
E|N のみならず|không chỉ|国内[のみならず]、海外でも有名だ。
E|N に加えて|thêm vào|雨[に加えて]、風も強くなった。
E|N にこたえて|đáp lại|ファンの声[にこたえて]、再演が決まった。
E|N に反して|trái với|予想[に反して]、彼が勝った。
E|N からいうと / からすると / からみると|xét từ góc độ|専門家の立場[からいうと]、この方法は危険だ。
E|N からして|ngay cả, ngay từ (ví dụ điển hình)|題名[からして]面白そうだ。
E|N 上 (じょう)|về mặt|健康[上]の理由で退職した。
E|N 向き / 向け|phù hợp với / dành cho|子ども[向け]の番組。
F|～にほかならない|chính là, không gì khác|成功は努力の結果[にほかならない]。
F|～というものだ|đúng là, chính là (nhận định)|自分のことしか考えないのは、わがまま[というものだ]。
F|～というものではない|không phải cứ… là|高ければいい[というものではない]。
F|～ことか|biết bao|どんなに会いたかった[ことか]。
F|～ことに|thật là… (cảm xúc)|残念な[ことに]、雨で中止になった。
F|～ものか|làm gì có chuyện, nhất quyết không|あんな店、二度と行く[ものか]。
F|～ずにはいられない|không thể không|その話を聞いて、泣か[ずにはいられなかった]。
F|Vて + しょうがない / たまらない / ならない|… không chịu được|試験の結果が気になって[しょうがない]。
F|～ざるを得ない|buộc phải|台風なので、中止せ[ざるを得ない]。
F|Vる + ほかない|chỉ còn cách|自分でやる[ほかない]。
F|～かねない|có thể (xấu) xảy ra|このままでは事故になり[かねない]。
F|Vます + かねる|khó mà (từ chối lịch sự)|その件はお答えし[かねます]。
F|Vます + がたい|khó mà (tâm lý)|信じ[がたい]話だ。
F|～おそれがある|có nguy cơ|台風が上陸する[おそれがある]。
F|Vます + 得る / 得ない|có thể / không thể|それは起こり[得る]ことだ。
F|～っこない|không đời nào (văn nói)|そんなこと、でき[っこない]。
F|～まい|sẽ không / chắc không|二度とうそはつく[まい]。
F|～ないことはない|không phải là không|行け[ないことはない]が、遠い。
F|～に違いない / に相違ない|chắc chắn|彼の話は事実[に相違ない]。
F|～べきではない|không nên|人の悪口を言う[べきではない]。
F|～かのようだ|cứ như thể|彼は何も知らない[かのように]振る舞った。
F|A/Na + げ|có vẻ (cảm xúc)|寂し[げ]な顔。
F|～気味|hơi, có chiều hướng|風邪[気味]なので、早く寝ます。
F|～ぶり / ～っぷり|dáng vẻ / sau (bao lâu)|3年[ぶり]に国に帰った。
G|～うえ(に)|hơn nữa|この部屋は狭い[うえに]、暗い。
G|～うえで|khi, trong việc / sau khi|確認した[上で]返事します。
G|～やら～やら|nào là… nào là|宿題[やら]バイトやらで、忙しい。
G|～も～ば～も|vừa… vừa|彼は英語もでき[れば]、フランス語もできる。
G|～など / なんか / なんて|như là (coi nhẹ)|私[なんか]、まだまだです。
G|～というと / といえば|nói đến… thì|日本[といえば]、富士山だ。
G|～というより|nói là… thì đúng hơn là|涼しい[というより]、寒い。
G|～として～ない|không một… nào|一人[として]反対する人はいなかった。
G|～もかまわず|bất chấp, không để ý|人目[もかまわず]、泣いた。
G|Vます + 抜く|làm đến cùng|最後まで走り[抜いた]。
G|～をこめて|gửi gắm (tình cảm)|感謝[をこめて]手紙を書いた。
G|～に越したことはない|… thì tốt nhất|安い[に越したことはない]。
`);
const G2_GROUPS = { A: 'Nguyên nhân, lý do', B: 'Điều kiện, giả định', C: 'Đối lập, nhượng bộ', D: 'Thời điểm, trình tự, thay đổi', E: 'Phạm vi, đối tượng, căn cứ', F: 'Thái độ, đánh giá, cảm xúc', G: 'Liệt kê, nhấn mạnh, khác' };

const GRAMMAR = [
  ...G5.map(r => ({ lv: 'N5', gr: '', p: r[0], m: r[1], x: r[2] })),
  ...G4.map(r => ({ lv: 'N4', gr: '', p: r[0], m: r[1], x: r[2] })),
  ...G3.map(r => ({ lv: 'N3', gr: '', p: r[0], m: r[1], x: r[2] })),
  ...G2.map(r => ({ lv: 'N2', gr: r[0], p: r[1], m: r[2], x: r[3] })),
];

const TIPS = [
  ['ため vs ように', '<b>ため</b>: mục đích chủ ý, cùng chủ ngữ. <b>ように</b>: mục đích không chủ ý, đi với thể khả năng hoặc phủ định.'],
  ['せいで / おかげで / ばかりに', '<b>せいで</b> đổ lỗi · <b>おかげで</b> biết ơn · <b>ばかりに</b> chỉ vì một chuyện nhỏ mà hậu quả lớn.'],
  ['わけがない / わけではない / わけにはいかない', '<b>わけがない</b> không thể nào (phủ định mạnh) · <b>わけではない</b> không hẳn · <b>わけにはいかない</b> không thể làm vì đạo lý.'],
  ['ものの / ながらも / にもかかわらず / くせに', 'Cùng nghĩa "mặc dù"; <b>くせに</b> có ý chê trách, chỉ dùng cho người.'],
  ['一方だ vs 一方で', '<b>一方だ</b>: xu hướng một chiều (ngày càng). <b>一方で</b>: mặt khác.'],
  ['かねない vs かねる', '<b>かねない</b>: có thể xảy ra điều xấu. <b>かねる</b>: khó mà làm (từ chối lịch sự). Nghĩa gần như ngược nhau.'],
  ['次第', 'Sau <b>Vます</b> = ngay khi. Sau <b>N</b> = tùy vào.'],
  ['Câu 8 (sắp xếp ★)', 'Ghép <b>mẫu ngữ pháp</b> trước (ví dụ ～に + 対して), rồi danh từ + trợ từ, cuối cùng mới đặt vị trí ★.'],
];

/* thường | 尊敬語 | 謙譲語 */
const KEIGO = L(`
行く / 来る|いらっしゃる / おいでになる|参る (まいる) / 伺う (うかがう)
いる|いらっしゃる|おる
言う|おっしゃる|申す / 申し上げる
食べる / 飲む|召し上がる|いただく
見る|ご覧になる|拝見する
する|なさる|いたす
知っている|ご存じだ|存じております
会う|お会いになる|お目にかかる
聞く (hỏi/nghe)|お聞きになる|伺う / 拝聴する
もらう|お受け取りになる|いただく / 頂戴する
あげる|—|差し上げる
くれる|くださる|—
寝る|お休みになる|—
着る|お召しになる|—
思う|お思いになる|存じる
分かる|お分かりになる|承知する / かしこまる
`);
const KEIGO_PHRASES = L(`
先生、少しお時間よろしいでしょうか。|Thầy ơi, em xin chút thời gian được không ạ?
資料をお送りいたしましたので、ご確認いただけますでしょうか。|Em đã gửi tài liệu, thầy xem giúp em được không ạ?
明日の打ち合わせに伺ってもよろしいでしょうか。|Ngày mai em đến buổi họp được không ạ?
お忙しいところ申し訳ございませんが、～。|Xin lỗi đã làm phiền lúc anh/chị đang bận, nhưng…
承知いたしました。/ かしこまりました。|Em đã hiểu ạ.
部長の田中は今、席を外しております。|(Nói với khách) Trưởng phòng Tanaka hiện không có ở chỗ ngồi.
`);

/* tự | tha | nghĩa */
const JITA = L(`
開く (あく)|開ける (あける)|mở
閉まる (しまる)|閉める (しめる)|đóng
始まる (はじまる)|始める (はじめる)|bắt đầu
終わる (おわる)|終える (おえる)|kết thúc
変わる (かわる)|変える (かえる)|thay đổi
決まる (きまる)|決める (きめる)|quyết định
上がる (あがる)|上げる (あげる)|tăng, lên
下がる (さがる)|下げる (さげる)|giảm, xuống
増える (ふえる)|増やす (ふやす)|tăng (số lượng)
減る (へる)|減らす (へらす)|giảm
集まる (あつまる)|集める (あつめる)|tập trung
止まる (とまる)|止める (とめる)|dừng
続く (つづく)|続ける (つづける)|tiếp tục
壊れる (こわれる)|壊す (こわす)|hỏng
汚れる (よごれる)|汚す (よごす)|bẩn
出る (でる)|出す (だす)|ra / đưa ra
入る (はいる)|入れる (いれる)|vào / cho vào
起きる (おきる)|起こす (おこす)|dậy, xảy ra / đánh thức, gây ra
落ちる (おちる)|落とす (おとす)|rơi / đánh rơi
直る (なおる)|直す (なおす)|được sửa / sửa
残る (のこる)|残す (のこす)|còn lại / để lại
消える (きえる)|消す (けす)|tắt, biến mất / tắt
溶ける (とける)|溶かす (とかす)|tan / làm tan
流れる (ながれる)|流す (ながす)|chảy / xả
育つ (そだつ)|育てる (そだてる)|lớn lên / nuôi
伝わる (つたわる)|伝える (つたえる)|được truyền / truyền đạt
見つかる (みつかる)|見つける (みつける)|được tìm thấy / tìm thấy
冷える (ひえる)|冷やす (ひやす)|lạnh đi / làm lạnh
沸く (わく)|沸かす (わかす)|sôi / đun sôi
`);

const FUKUGO = L(`
～込む|vào trong, sâu, mãi|書き込む, 飛び込む, 落ち込む (buồn), 思い込む (đinh ninh)
～出す|ra ngoài / bắt đầu bất chợt|取り出す, 言い出す, 泣き出す
～合う|lẫn nhau|話し合う, 助け合う, 知り合う
～切る|hết, trọn; cắt đứt|使い切る, 疲れ切る, 言い切る (khẳng định)
～直す|làm lại|書き直す, やり直す, 見直す
～返す|lại, đáp lại|読み返す, 言い返す, 繰り返す
～かける|dở dang / hướng tới|言いかける, 話しかける
～上げる|hoàn thành / lên|書き上げる, 持ち上げる
～続ける|tiếp tục|降り続ける
～過ぎる|quá|働き過ぎる
`);

const GOKEI = L(`
不〜|phủ định (bất)|不安, 不便, 不可能
無〜|phủ định (vô)|無料, 無関心, 無責任
非〜|phủ định (phi)|非常識, 非公式
未〜|chưa (vị)|未完成, 未経験, 未成年
超〜|siêu|超高速
再〜|lại (tái)|再利用, 再検査
全〜|toàn bộ|全世界
半〜|một nửa (bán)|半透明
最〜|nhất (tối)|最先端
前〜 / 元〜|cựu, nguyên|前社長, 元選手
〜化|hóa|温暖化, 自動化
〜性|tính|安全性, 可能性
〜的|mang tính|経済的, 効果的
〜感|cảm giác|責任感, 達成感
〜率|tỷ lệ|合格率, 効率
〜者|người|研究者, 参加者
〜家|nhà (chuyên môn)|専門家, 作家
〜力|năng lực|理解力
〜層|tầng lớp|若者層
〜状|thư, giấy|招待状
〜式|kiểu, theo lối|日本式
〜製|sản xuất bởi/tại|日本製
〜済み|đã xong|支払い済み
〜付き|kèm theo|朝食付き
〜沿い|dọc theo|川沿い
〜明け|vừa kết thúc|夏休み明け
〜づらい|khó (làm)|読みづらい
`);

const FUKUSHI = L(`
必ずしも～ない|không hẳn|高い物が必ずしもいいとは限らない。
いきなり|đột ngột|いきなり雨が降り出した。
せっかく|đã mất công|せっかく作ったのに、誰も食べなかった。
わざわざ|cất công|わざわざ来てくれてありがとう。
わざと|cố ý|わざと負けた。
ついに / とうとう|cuối cùng|ついに論文が完成した。
せめて|ít nhất thì|せめて一日休みたい。
むしろ|ngược lại, đúng hơn là|休むより、むしろ働きたい。
たちまち|ngay lập tức|噂はたちまち広がった。
いったん|tạm thời, một khi|いったん家に帰ります。
案外 / 意外に|không ngờ|試験は案外簡単だった。
さっそく|ngay|さっそく始めましょう。
相変わらず|vẫn như mọi khi|相変わらず忙しい。
次第に / だんだん|dần dần|次第に暗くなった。
一応|tạm thời, cho chắc|一応、確認しておきます。
少なくとも|ít nhất|少なくとも3時間はかかる。
とっくに|từ lâu rồi|締め切りはとっくに過ぎている。
まさか|không lẽ nào|まさか彼が犯人だとは。
どうせ|đằng nào cũng|どうせ間に合わない。
うっかり|lơ đãng|うっかり鍵を忘れた。
ぐっすり|(ngủ) say|ぐっすり眠った。
すっかり|hoàn toàn|すっかり忘れていた。
ぎりぎり|sát nút|ぎりぎり間に合った。
じっと|yên, chăm chú|じっと見つめる。
ほっと|nhẹ nhõm|合格してほっとした。
いらいら|bực bội|電車が来なくていらいらする。
うろうろ|đi lòng vòng|駅の前をうろうろする。
ぶつぶつ|lẩm bẩm, càu nhàu|ぶつぶつ文句を言う。
ぼんやり|lơ mơ, mờ|ぼんやり窓の外を見る。
はっきり|rõ ràng|はっきり言ってください。
しっかり|chắc chắn, kỹ|しっかり準備する。
のんびり|thong thả|週末はのんびり過ごした。
こっそり|lén lút|こっそり部屋を出た。
ずらりと|xếp hàng dài|店の前に人がずらりと並んでいる。
`);

const KAIWA = L(`
～ちゃう / ～じゃう|～てしまう / ～でしまう|忘れちゃった。
～とく|～ておく|買っとくね。
～てる|～ている|何してるの?
～なきゃ / ～なくちゃ|～なければ / ～なくては (いけない)|もう行かなきゃ。
～ちゃだめ|～てはだめ|触っちゃだめ。
～って|～と / ～という / ～は|田中さんって、誰?
～じゃん|～じゃないか|いいじゃん。
～っけ|(nhớ lại, hỏi lại)|会議、何時だっけ?
～んだ / ～の|～のだ (giải thích)|頭が痛いんだ。
～もん|～もの (lý do, nũng)|だって、知らなかったんだもん。
すいません / やっぱ / すげえ|すみません / やはり / すごい|やっぱ、やめとく。
`);

const NISE = L(`
勉強|べんきょう|miễn cưỡng|học tập
大丈夫|だいじょうぶ|đại trượng phu|không sao, ổn
手紙|てがみ|thủ chỉ|thư tay
新聞|しんぶん|tân văn|báo
留守|るす|lưu thủ|vắng nhà
迷惑|めいわく|mê hoặc|phiền hà
工夫|くふう|công phu|tìm tòi, nghĩ cách
結束|けっそく|kết thúc|đoàn kết
愛人|あいじん|ái nhân|người tình (không phải vợ/chồng)
汽車|きしゃ|khí xa|tàu hỏa hơi nước
皮肉|ひにく|bì nhục|mỉa mai
本気|ほんき|bản khí|nghiêm túc, thật lòng
`);

const SENMON = L(`
環境|かんきょう|hoàn cảnh|môi trường
汚染|おせん|ô nhiễm|ô nhiễm
処理|しょり|xử lý|xử lý
水質|すいしつ|thủy chất|chất lượng nước
排水|はいすい|bài thủy|nước thải
下水|げすい|hạ thủy|nước cống
微生物|びせいぶつ|vi sinh vật|vi sinh vật
研究|けんきゅう|nghiên cứu|nghiên cứu
実験|じっけん|thực nghiệm|thí nghiệm
分析|ぶんせき|phân tích|phân tích
濃度|のうど|nồng độ|nồng độ
沈殿|ちんでん|trầm điện|lắng
窒素|ちっそ|trất tố|nitơ
酸素|さんそ|toan tố|oxy
`);

/* Hán-Việt → On */
const HV_FINAL = L(`
-c, -ch|-ku / -ki|学 học → gaku · 国 quốc → koku · 楽 lạc → raku · 薬 dược → yaku · 歴 lịch → reki · 席 tịch → seki · 駅 dịch → eki
-t|-tsu / -chi|発 phát → hatsu · 説 thuyết → setsu · 物 vật → butsu · 決 quyết → ketsu · 一 nhất → ichi · 七 thất → shichi · 八 bát → hachi
-p|trường âm -ou / -uu / -you (đôi khi -tsu)|法 pháp → hou · 合 hợp → gou · 協 hiệp → kyou · 業 nghiệp → gyou · 入 nhập → nyuu · 十 thập → juu · 接 tiếp → setsu
-m, -n|-n|三 tam → san · 心 tâm → shin · 感 cảm → kan · 南 nam → nan · 金 kim → kin · 安 an → an · 年 niên → nen · 民 dân → min
-ng (-ông, -ung, -ương, -ang)|trường âm -ou / -uu / -you|東 đông → tou · 公 công → kou · 通 thông → tsuu · 中 trung → chuu · 場 trường → jou · 相 tương → sou · 方 phương → hou · 光 quang → kou
-nh (-anh, -inh)|-ei (đôi khi -you)|生 sinh → sei · 精 tinh → sei · 名 danh → mei · 明 minh → mei · 英 anh → ei · 平 bình → hei · 経 kinh → kei
-ao, -iêu, -iệu|-ou / -you|高 cao → kou · 道 đạo → dou · 報 báo → hou · 教 giáo → kyou · 校 hiệu → kou · 料 liệu → ryou · 少 thiểu → shou
-ưu, -u|-yuu / -uu|友 hữu → yuu · 有 hữu → yuu · 流 lưu → ryuu · 遊 du → yuu
-ai, -ội|-ai|大 đại → dai · 外 ngoại → gai · 会 hội → kai · 毎 mỗi → mai · 来 lai → rai
-i, -y|-i|気 khí → ki · 理 lý → ri · 期 kỳ → ki · 意 ý → i
`);
const HV_INITIAL = L(`
c, k, kh, qu, gi|k / g|家 gia → ka · 開 khai → kai · 国 quốc → koku · 教 giáo → kyou · 間 gian → kan
h|k / g|海 hải → kai · 会 hội → kai · 学 học → gaku · 漢 hán → kan · 後 hậu → go/kou
ng, nh|g / n / j|語 ngữ → go · 外 ngoại → gai · 銀 ngân → gin · 人 nhân → jin/nin · 日 nhật → nichi
t, th, tr, ch, s, x|s / sh / ch / t / j|三 tam → san · 時 thời → ji · 自 tự → ji · 中 trung → chuu · 正 chính → sei · 社 xã → sha · 山 sơn → san · 天 thiên → ten
đ|t / d|東 đông → tou · 電 điện → den · 道 đạo → dou · 読 độc → doku
b, ph, v|h / b / m|本 bản → hon · 部 bộ → bu · 方 phương → hou · 法 pháp → hou · 文 văn → bun · 物 vật → butsu · 万 vạn → man/ban
m|m / b|明 minh → mei · 目 mục → moku · 米 mễ → bei · 毎 mỗi → mai
l|r|理 lý → ri · 力 lực → ryoku · 流 lưu → ryuu · 料 liệu → ryou
d, gi (một số)|y|用 dụng → you · 夜 dạ → ya · 役 dịch → yaku · 遊 du → yuu
nguyên âm|giữ nguyên âm|安 an → an · 意 ý → i · 英 anh → ei · 音 âm → on · 印 ấn → in
`);

/* trợ từ quiz: câu (dùng ＿＿) | đáp án | lựa chọn khác (,) | giải thích */
const JOSHI_Q = L(`
部屋＿＿いる。|に|で,を,へ|に: nơi tồn tại (いる/ある).
部屋＿＿勉強する。|で|に,を,が|で: nơi xảy ra hành động.
公園＿＿散歩する。|を|で,に,へ|を: nơi đi qua (散歩する, 渡る, 通る).
家＿＿出る。|を|に,で,へ|を: nơi rời khỏi (出る, 降りる, 卒業する).
誰＿＿来ましたか。|が|は,を,も|Từ để hỏi (誰, 何) làm chủ ngữ luôn đi với が.
これは私＿＿作った料理です。|が|は,を,に|Trong mệnh đề phụ bổ nghĩa danh từ, chủ ngữ dùng が (không dùng は).
田中さんは学生です。私＿＿学生です。|も|は,が,を|も: cũng.
5時＿＿待つ。|まで|までに,と,を|まで: hành động kéo dài liên tục đến mốc đó.
金曜日＿＿レポートを出してください。|までに|まで,と,を|までに: hạn chót, làm một lần trước mốc đó.
先生＿＿ほめられた。|に|で,を,が|Câu bị động: người thực hiện hành động đi với に.
風邪＿＿休んだ。|で|に,を,が|で: nguyên nhân.
クラス＿＿一番背が高い。|で|に,を,と|で: phạm vi so sánh.
100円＿＿ない。|しか|だけ,も,まで|しか + phủ định: chỉ có (ít). だけ đi với khẳng định: 100円だけある.
机の上にペン＿＿ノートなどがある。|や|を,で,に|や: liệt kê tiêu biểu, thường đi với など.
駅＿＿着く。|に|で,を,が|に: đích đến (着く, 入る).
バス＿＿行きます。|で|に,を,と|で: phương tiện.
友達＿＿話します。|と|を,で,が|と: cùng với.
7時＿＿起きます。|に|で,を,へ|に: thời điểm có số cụ thể.
日本料理＿＿好きです。|が|を,に,で|好き / 嫌い / 上手 / 下手 đi với が.
日本語＿＿少し分かります。|が|を,に,で|分かる đi với が.
北＿＿向かう。|へ|を,で,が|へ: hướng di chuyển (に cũng được, に nhấn đích).
9時＿＿5時まで働きます。|から|まで,に,で|から～まで: từ… đến…
熱がある＿＿、休みます。|ので|のに,けど,ても|ので: lý do khách quan, lịch sự.
約束した＿＿、来なかった。|のに|ので,から,ために|のに: vậy mà (bất mãn).
雨が降って＿＿行きます。|も|は,が,を|Vても: dù… cũng.
`);

/* Verbs for conjugation drill: dict | group (1,2,3) | meaning | reading (for する/来る compounds) */
const VERBS = L(`
書く|1|viết
行く|1|đi
泳ぐ|1|bơi
話す|1|nói
待つ|1|đợi
死ぬ|1|chết
遊ぶ|1|chơi
読む|1|đọc
帰る|1|về
買う|1|mua
会う|1|gặp
飲む|1|uống
作る|1|làm, chế tạo
持つ|1|cầm, có
入る|1|vào
走る|1|chạy
知る|1|biết
切る|1|cắt
使う|1|dùng
歩く|1|đi bộ
急ぐ|1|vội
呼ぶ|1|gọi
休む|1|nghỉ
送る|1|gửi
洗う|1|rửa
食べる|2|ăn
見る|2|nhìn
起きる|2|dậy
寝る|2|ngủ
教える|2|dạy
開ける|2|mở
着る|2|mặc
借りる|2|mượn
出る|2|ra
調べる|2|tìm hiểu
忘れる|2|quên
浴びる|2|tắm (vòi sen)
する|3|làm
来る|3|đến
勉強する|3|học
研究する|3|nghiên cứu
実験する|3|thí nghiệm
`);

const FORMS = [
  ['masu', 'ます', 'lịch sự'], ['nai', 'ない', 'phủ định'], ['te', 'て', 'thể て'], ['ta', 'た', 'quá khứ'],
  ['pot', '可能', 'khả năng'], ['vol', '意向', 'ý chí'], ['ba', '条件 ば', 'điều kiện'], ['imp', '命令', 'mệnh lệnh'],
  ['pass', '受身', 'bị động'], ['caus', '使役', 'sai khiến'], ['cp', '使役受身', 'bị bắt phải'],
];

/* Lộ trình */
const STAGES = [
  { n: 'Chữ', goal: 'Hiragana + katakana đọc/viết trôi chảy', time: '2–3 tuần', out: 'Đọc được mọi chữ kana', decks: ['hira', 'kata'] },
  { n: 'N5', goal: '~100 kanji, ~800 từ, ngữ pháp 7.1, chia ます/て/ない/た', time: '3 tháng', out: 'Giới thiệu bản thân, mua sắm, hỏi đường', decks: ['kanji5', 'radical', 'g5'] },
  { n: 'N4', goal: '~300 kanji, ~1.500 từ, ngữ pháp 7.2, khả năng/bị động/sai khiến', time: '3–4 tháng', out: 'Nói chuyện đơn giản ở lab, cửa hàng, bệnh viện', decks: ['g4', 'jita'] },
  { n: 'N3', goal: '~650 kanji, ~3.700 từ, ngữ pháp 7.3, đọc NHK Easy', time: '5–6 tháng', out: 'Đọc thông báo, email đơn giản, nghe hội thoại', decks: ['g3', 'fukugo', 'kaiwa', 'keigo'] },
  { n: 'N2', goal: '~1.000 kanji, ~6.000 từ, ngữ pháp 7.4, đọc báo', time: '6–8 tháng (1,5–2 h/ngày)', out: 'Đọc báo, nghe bản tin, làm việc ở công ty Nhật', decks: ['g2', 'fukushi', 'gokei', 'nise', 'senmon'] },
];
const MILESTONES = [
  ['11/2026 → 7/2027', 'Nhẹ 45–60 phút/ngày song song IELTS: N5 → N4, kanji, nghe đời sống'],
  ['8/2027 →', 'Tăng lên 1,5–2 giờ/ngày'],
  ['12/2027', 'Thi N4 (làm quen đề)'],
  ['7/2028', 'Thi N3 (hoặc thẳng N2 nếu tiến nhanh)'],
  ['12/2028', 'Thi N2'],
];
const SESSION = [
  ['Anki', 15, 'Ôn thẻ đến hạn trong app (kanji + từ vựng)'],
  ['Ngữ pháp mới', 15, '2–3 mẫu, mỗi mẫu tự đặt 2 câu về lab, xử lý nước, nhà trọ'],
  ['Đọc', 15, 'Giáo trình → NHK News Web Easy → báo thật'],
  ['Nghe + shadowing', 15, 'Bài nghe, podcast, rồi nhại theo 5 phút'],
];
/* Lịch tuần: index 0 = Chủ nhật (JS getDay) */
const WEEK = [
  ['CN', 'Nghỉ hoặc "học ngoài đời": nói chuyện, xem phim tiếng Nhật'],
  ['T2', 'Ngữ pháp: 3 mẫu mới + đặt câu'],
  ['T3', 'Từ vựng + kanji theo bài'],
  ['T4', 'Nghe + shadowing'],
  ['T5', 'Ngữ pháp: 3 mẫu mới + đặt câu'],
  ['T6', 'Đọc 1 bài + tra từ'],
  ['T7', 'Ôn tuần: quiz, sửa lỗi'],
];
const CHECKLIST = [
  'Đã đăng ký trên MyJLPT, in phiếu dự thi (受験票), dán ảnh đúng quy cách',
  'Mang bút chì HB/B, tẩy, đồng hồ đeo tay, thẻ cư trú',
  'Làm ít nhất 3 đề thi thử bấm giờ đủ; có chiến lược 105 phút',
  'Ôn lại bảng mẹo phân biệt, kính ngữ, văn nói',
  'Tối trước ngày thi: ngủ đủ, không học mẫu mới',
  'Trong phòng thi: tô đáp án ngay; nghe hiểu không quay lại câu đã qua',
];
const MATERIALS = L(`
Chữ|Ứng dụng học kana (Tofugu, Duolingo)|Viết tay 2 lượt
N5–N4|Minna no Nihongo I–II (bản tiếng Việt) hoặc Genki I–II|Từ điển Mazii (có Hán-Việt), app này
N3|Shin Kanzen Master N3 hoặc Soumatome N3|NHK News Web Easy, Bunpro
N2|Shin Kanzen Master N2 · Mimikara Oboeru N2 · Soumatome N2|Đề mẫu chính thức trên jlpt.jp, 公式問題集
`);

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
const LISTEN_PARTS = L(`
1|課題理解|Đọc 4 lựa chọn trước; chú ý あ、でも / やっぱり / それより; "まず" = việc đầu tiên|5
2|ポイント理解|Tìm lý do/điểm chính; bẫy: lý do được nhắc rồi bị phủ định|6
3|概要理解|Không có câu hỏi in sẵn; nghe ý chính và thái độ|5
4|即時応答|Phản xạ một câu; nắm văn nói + kính ngữ; không nghĩ lâu|11–12
5|統合理解|Ghi chú dạng bảng các lựa chọn + ý kiến từng người|4
`);

const PROMPTS = [
  { t: 'Giải thích một nhóm mẫu', f: [['mau', 'Các mẫu', '～わけだ / ～わけではない / ～わけがない']], p: 'Giải thích {mau}, mỗi mẫu 3 câu ví dụ, rồi cho mình 6 câu chọn đáp án.' },
  { t: 'Quiz ngữ pháp kiểu 問題7', f: [['so', 'Số câu', '15'], ['cap', 'Cấp', 'N4']], p: 'Quiz mình {so} câu ngữ pháp {cap} dạng 問題7 (4 lựa chọn), chấm và giải thích sau khi mình trả lời.' },
  { t: 'Tạo thẻ Anki CSV', f: [['so', 'Số thẻ', '20'], ['cap', 'Cấp', 'N3'], ['cd', 'Chủ đề', 'môi trường']], p: 'Tạo {so} thẻ Anki dạng CSV (front;back) cho từ vựng {cap} chủ đề {cd}, có Hán-Việt và câu ví dụ.' },
  { t: 'Sửa đoạn văn của mình', f: [['doan', 'Đoạn văn', '私の研究室では…'], ['cap', 'Mức', 'N3']], p: 'Đây là đoạn mình viết về lab của mình: {doan}\nSửa lỗi và viết lại tự nhiên hơn ở mức {cap}.' },
  { t: 'Bài đọc kiểu 問題11', f: [['cd', 'Chủ đề', 'xử lý nước thải']], p: 'Cho mình 1 bài đọc 400 chữ trình độ N2 về {cd}, kèm 3 câu hỏi kiểu 問題11.' },
  { t: 'Đóng vai luyện kính ngữ', f: [['vai', 'Tình huống', 'nhân viên tòa thị chính, mình đi làm thủ tục chuyển nhà']], p: 'Đóng vai {vai}; nói từng câu một, sửa lỗi kính ngữ cho mình.' },
  { t: 'Lập kế hoạch tuần', f: [['tuan', 'Số tuần đến kỳ thi', '5'], ['muc', 'Đã học đến', 'mục 7.3']], p: 'Lập kế hoạch học tuần này: mình còn {tuan} tuần đến kỳ thi tháng 12, đã học đến {muc}.' },
];
