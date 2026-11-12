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
  { n: 'Chữ', goal: 'Hiragana + katakana đọc/viết trôi chảy', time: 'đã xong', out: 'Đọc được mọi chữ kana', decks: ['hira', 'kata'] },
  { n: 'N5', goal: 'Củng cố N5: 79 kanji, ~720 từ, ngữ pháp N5', time: '11–12/2026', out: 'Giới thiệu bản thân, mua sắm, hỏi đường', decks: ['kj5', 'vb5', 'g5'] },
  { n: 'N4', goal: '166 kanji, ~670 từ, ngữ pháp N4 (khả năng, bị động, sai khiến)', time: '1–2/2027', out: 'Nói chuyện đơn giản ở lab, cửa hàng, bệnh viện', decks: ['kj4', 'vb4', 'g4', 'jita'] },
  { n: 'N3', goal: '367 kanji, ~2.140 từ, ngữ pháp N3, đọc NHK Easy', time: '3–9/2027', out: 'Nói chuyện 10 phút về nghiên cứu, đọc thông báo, email', decks: ['kj3', 'vb3', 'g3', 'keigo', 'kaiwa', 'fukugo', 'v-life', 'v-health', 'v-work'] },
  { n: 'N2', goal: '367 kanji, ~1.810 từ, ngữ pháp N2; 5–6/2028 luyện đề mỗi tuần', time: '10/2027–6/2028', out: 'Đọc báo, nghe bản tin, họp lab bằng tiếng Nhật', decks: ['kj2', 'vb2', 'g2', 'fukushi', 'gokei', 'nise', 'senmon', 'v-mt', 'v-study', 'v-econ'] },
  { n: 'N1', goal: '1.232 kanji, ~2.700 từ, ngữ pháp N1', time: 'sau khi đỗ N2', out: 'Đọc tài liệu chuyên ngành, làm việc chuyên môn', decks: ['kj1', 'vb1', 'g1'] },
];
const MILESTONES = [
  ['11/2026 → 2/2027', 'Cố định 14 giờ/tuần (2 giờ/ngày): chắc N5, xong N4'],
  ['3/2027 → 9/2027', 'N3: mỗi ngày khoảng 12 từ, 3 kanji, 2 mẫu ngữ pháp'],
  ['10/2027 → 4/2028', 'N2: từ vựng, kanji, ngữ pháp N2; đọc báo, nghe tin'],
  ['3/2028', 'Đăng ký MyJLPT cho kỳ tháng 7 (kiểm tra hạn trên jlpt.jp)'],
  ['5/2028 → 6/2028', 'Luyện đề: mỗi Chủ nhật 1 đề đủ giờ, sửa phần yếu'],
  ['2/7/2028', 'Thi N2 lần 1 (ngày dự kiến)'],
  ['8/2028 → 12/2028', 'Nếu chưa đỗ: ôn theo điểm phần yếu, thi lại 3/12/2028 (dự kiến); thi đến khi đỗ'],
  ['Sau khi đỗ N2', 'Chuyển sang N1 (dữ liệu đã có sẵn trong app)'],
];
const DAY_PLAN = {
  phone: [['Học mới từ + kanji', 20, 'learn'], ['Nghe', 10, 'learn'], ['Ôn: chọn + gõ', 10, 'learn'], ['Ôn thẻ đến hạn', 20, 'review']],
  laptop: [['Ngữ pháp mới', 20, 'learn'], ['Nghe / shadowing', 15, 'learn'], ['Ôn ngữ pháp: chọn + gõ', 15, 'learn'], ['Luyện gõ', 10, 'typing']],
};
const WEEK_MIN = 840, DAY_MIN = 120;
/* Lịch tuần: index 0 = Chủ nhật (JS getDay) */
const WEEK = [
  ['CN', 'Không học mới: ôn hết thẻ đến hạn, làm lại câu sai, xem báo cáo tuần; từ 5/2028 làm 1 đề thi thử'],
  ['T2', 'Điện thoại: từ + kanji · Laptop: ngữ pháp mới + gõ'],
  ['T3', 'Điện thoại: từ + kanji · Laptop: ngữ pháp + đọc 1 bài ngắn'],
  ['T4', 'Điện thoại: từ + kanji · Laptop: ngữ pháp + nghe/shadowing'],
  ['T5', 'Điện thoại: từ + kanji · Laptop: ngữ pháp mới + gõ'],
  ['T6', 'Điện thoại: từ + kanji · Laptop: ngữ pháp + đọc 1 bài ngắn'],
  ['T7', 'Điện thoại: từ + kanji · Laptop: luyện dạng đề (問題1/3/7/8) + gõ câu'],
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

/* ===== NỘI DUNG MỞ RỘNG (đợt 1): tự soạn, không chép giáo trình ===== */
/* Kanji N4 (ước tính phổ biến): char | HV | On | Kun | nghĩa | từ ví dụ */
const KANJI4 = L(`
悪|ác|アク|わる(い)|xấu|悪口 わるぐち
暗|ám|アン|くら(い)|tối|暗記 あんき
医|y|イ|—|y, chữa bệnh|医者 いしゃ
意|ý|イ|—|ý|意味 いみ
以|dĩ|イ|—|từ, lấy|以上 いじょう
引|dẫn|イン|ひ(く)|kéo|引っ越し ひっこし
院|viện|イン|—|viện|病院 びょういん
員|viên|イン|—|thành viên|会社員 かいしゃいん
運|vận|ウン|はこ(ぶ)|vận chuyển; vận|運動 うんどう
英|anh|エイ|—|nước Anh|英語 えいご
映|ánh|エイ|うつ(る)|chiếu|映画 えいが
遠|viễn|エン|とお(い)|xa|遠足 えんそく
屋|ốc|オク|や|mái; cửa hàng|部屋 へや
音|âm|オン|おと|âm thanh|音楽 おんがく
歌|ca|カ|うた|bài hát|歌手 かしゅ
夏|hạ|カ|なつ|mùa hè|夏休み なつやすみ
家|gia|カ・ケ|いえ・うち|nhà|家族 かぞく
画|họa|ガ・カク|—|tranh; nét|計画 けいかく
海|hải|カイ|うみ|biển|海外 かいがい
回|hồi|カイ|まわ(る)|lần; quay|今回 こんかい
開|khai|カイ|あ(く)・ひら(く)|mở|開発 かいはつ
界|giới|カイ|—|giới, cõi|世界 せかい
楽|lạc/nhạc|ガク・ラク|たの(しい)|vui; âm nhạc|楽しみ たのしみ
館|quán|カン|—|tòa nhà lớn|図書館 としょかん
漢|hán|カン|—|nhà Hán|漢字 かんじ
寒|hàn|カン|さむ(い)|lạnh|寒気 さむけ
顔|nhan|ガン|かお|khuôn mặt|笑顔 えがお
帰|quy|キ|かえ(る)|về|帰国 きこく
起|khởi|キ|お(きる)|dậy, xảy ra|起床 きしょう
究|cứu|キュウ|—|tìm tòi đến cùng|研究 けんきゅう
急|cấp|キュウ|いそ(ぐ)|gấp|急行 きゅうこう
牛|ngưu|ギュウ|うし|bò|牛肉 ぎゅうにく
去|khứ|キョ|さ(る)|qua, rời|去年 きょねん
強|cường|キョウ|つよ(い)|mạnh|勉強 べんきょう
教|giáo|キョウ|おし(える)|dạy|教室 きょうしつ
京|kinh|キョウ|—|kinh đô|東京 とうきょう
業|nghiệp|ギョウ|—|nghề, nghiệp|授業 じゅぎょう
近|cận|キン|ちか(い)|gần|最近 さいきん
銀|ngân|ギン|—|bạc|銀行 ぎんこう
区|khu|ク|—|khu, quận|区役所 くやくしょ
計|kế|ケイ|はか(る)|đo; kế|時計 とけい
兄|huynh|ケイ|あに|anh trai|兄弟 きょうだい
軽|khinh|ケイ|かる(い)|nhẹ|軽食 けいしょく
犬|khuyển|ケン|いぬ|chó|子犬 こいぬ
研|nghiên|ケン|と(ぐ)|mài; nghiên|研修 けんしゅう
県|huyện|ケン|—|tỉnh (của Nhật)|新潟県 にいがたけん
験|nghiệm|ケン|—|thử, kinh nghiệm|試験 しけん
元|nguyên|ゲン・ガン|もと|gốc|元気 げんき
広|quảng|コウ|ひろ(い)|rộng|広告 こうこく
工|công|コウ|—|công, thợ|工場 こうじょう
光|quang|コウ|ひかり|ánh sáng|観光 かんこう
考|khảo|コウ|かんが(える)|suy nghĩ|参考 さんこう
号|hiệu|ゴウ|—|số, hiệu|番号 ばんごう
黒|hắc|コク|くろ(い)|đen|黒板 こくばん
作|tác|サク・サ|つく(る)|làm, tạo|作文 さくぶん
産|sản|サン|う(む)|sinh ra, sản xuất|生産 せいさん
止|chỉ|シ|と(まる)|dừng|中止 ちゅうし
仕|sĩ|シ|つか(える)|làm việc, phục vụ|仕事 しごと
使|sử|シ|つか(う)|dùng|使用 しよう
始|thủy|シ|はじ(める)|bắt đầu|開始 かいし
姉|tỷ|シ|あね|chị gái|姉妹 しまい
思|tư|シ|おも(う)|nghĩ|思い出 おもいで
死|tử|シ|し(ぬ)|chết|死亡 しぼう
私|tư|シ|わたし|tôi; riêng tư|私立 しりつ
紙|chỉ|シ|かみ|giấy|手紙 てがみ
試|thí|シ|ため(す)|thử|試合 しあい
事|sự|ジ|こと|việc|事故 じこ
字|tự|ジ|—|chữ|文字 もじ
自|tự|ジ|みずか(ら)|tự mình|自分 じぶん
持|trì|ジ|も(つ)|cầm, có|気持ち きもち
室|thất|シツ|—|phòng|会議室 かいぎしつ
質|chất|シツ|—|chất|質問 しつもん
写|tả|シャ|うつ(す)|chụp, chép|写真 しゃしん
者|giả|シャ|もの|người|研究者 けんきゅうしゃ
借|tá|シャク|か(りる)|mượn|借金 しゃっきん
弱|nhược|ジャク|よわ(い)|yếu|弱点 じゃくてん
主|chủ|シュ|おも・ぬし|chủ, chính|主人 しゅじん
首|thủ|シュ|くび|cổ; đứng đầu|首都 しゅと
秋|thu|シュウ|あき|mùa thu|秋分 しゅうぶん
終|chung|シュウ|お(わる)|kết thúc|終電 しゅうでん
習|tập|シュウ|なら(う)|học, tập|練習 れんしゅう
集|tập|シュウ|あつ(める)|tập hợp|集中 しゅうちゅう
住|trú|ジュウ|す(む)|sống, cư trú|住所 じゅうしょ
重|trọng|ジュウ|おも(い)|nặng|重要 じゅうよう
春|xuân|シュン|はる|mùa xuân|青春 せいしゅん
所|sở|ショ|ところ|nơi chốn|場所 ばしょ
暑|thử|ショ|あつ(い)|nóng (thời tiết)|残暑 ざんしょ
場|trường|ジョウ|ば|nơi, bãi|会場 かいじょう
乗|thừa|ジョウ|の(る)|lên xe|乗車 じょうしゃ
色|sắc|ショク|いろ|màu|景色 けしき
心|tâm|シン|こころ|tim, lòng|安心 あんしん
真|chân|シン|ま|thật|真実 しんじつ
進|tiến|シン|すす(む)|tiến|進学 しんがく
図|đồ|ズ・ト|—|hình vẽ, bản đồ|地図 ちず
世|thế|セ・セイ|よ|đời, thế gian|世話 せわ
正|chính|セイ・ショウ|ただ(しい)|đúng|正月 しょうがつ
声|thanh|セイ|こえ|giọng|音声 おんせい
夕|tịch|セキ|ゆう|chiều tối|夕方 ゆうがた
切|thiết|セツ|き(る)|cắt|大切 たいせつ
説|thuyết|セツ|と(く)|giải thích|説明 せつめい
洗|tẩy|セン|あら(う)|rửa|洗濯 せんたく
早|tảo|ソウ|はや(い)|sớm|早朝 そうちょう
走|tẩu|ソウ|はし(る)|chạy|競走 きょうそう
送|tống|ソウ|おく(る)|gửi|放送 ほうそう
族|tộc|ゾク|—|dòng họ|家族 かぞく
村|thôn|ソン|むら|làng|農村 のうそん
体|thể|タイ|からだ|cơ thể|体育 たいいく
待|đãi|タイ|ま(つ)|đợi|招待 しょうたい
貸|thải|タイ|か(す)|cho mượn|賃貸 ちんたい
台|đài|ダイ・タイ|—|bệ; cái (máy)|台所 だいどころ
題|đề|ダイ|—|đề|問題 もんだい
代|đại|ダイ|か(わる)|thời đại; thay|時代 じだい
短|đoản|タン|みじか(い)|ngắn|短所 たんしょ
知|tri|チ|し(る)|biết|知識 ちしき
地|địa|チ・ジ|—|đất|地下鉄 ちかてつ
池|trì|チ|いけ|ao|電池 でんち
茶|trà|チャ・サ|—|trà|喫茶店 きっさてん
着|trước|チャク|き(る)・つ(く)|mặc; đến nơi|到着 とうちゃく
昼|trú|チュウ|ひる|buổi trưa|昼食 ちゅうしょく
注|chú|チュウ|そそ(ぐ)|rót; chú ý|注意 ちゅうい
町|đinh|チョウ|まち|thị trấn|町内 ちょうない
鳥|điểu|チョウ|とり|chim|白鳥 はくちょう
朝|triều|チョウ|あさ|buổi sáng|朝食 ちょうしょく
通|thông|ツウ|かよ(う)・とお(る)|đi qua, thông|交通 こうつう
弟|đệ|ダイ・テイ|おとうと|em trai|兄弟 きょうだい
低|đê|テイ|ひく(い)|thấp|最低 さいてい
転|chuyển|テン|ころ(ぶ)|lăn; chuyển|運転 うんてん
都|đô|ト・ツ|みやこ|thủ đô|都合 つごう
度|độ|ド|たび|lần; độ|今度 こんど
答|đáp|トウ|こた(える)|trả lời|回答 かいとう
冬|đông|トウ|ふゆ|mùa đông|冬休み ふゆやすみ
頭|đầu|トウ・ズ|あたま|đầu|頭痛 ずつう
同|đồng|ドウ|おな(じ)|giống|同時 どうじ
動|động|ドウ|うご(く)|chuyển động|自動 じどう
堂|đường|ドウ|—|sảnh, nhà lớn|食堂 しょくどう
働|động|ドウ|はたら(く)|làm việc|労働 ろうどう
特|đặc|トク|—|đặc biệt|特急 とっきゅう
肉|nhục|ニク|—|thịt|筋肉 きんにく
売|mại|バイ|う(る)|bán|売店 ばいてん
発|phát|ハツ|—|phát ra|出発 しゅっぱつ
飯|phạn|ハン|めし|cơm|ご飯 ごはん
病|bệnh|ビョウ|やまい|bệnh|病気 びょうき
品|phẩm|ヒン|しな|hàng hóa|製品 せいひん
不|bất|フ|—|không|不便 ふべん
風|phong|フウ|かぜ|gió|台風 たいふう
服|phục|フク|—|quần áo|洋服 ようふく
物|vật|ブツ|もの|vật|荷物 にもつ
文|văn|ブン|ふみ|văn|文化 ぶんか
別|biệt|ベツ|わか(れる)|khác; chia tay|特別 とくべつ
勉|miễn|ベン|—|cố gắng|勉強 べんきょう
便|tiện|ベン・ビン|たよ(り)|tiện; thư|便利 べんり
歩|bộ|ホ|ある(く)|đi bộ|散歩 さんぽ
方|phương|ホウ|かた|hướng; cách; vị|方法 ほうほう
妹|muội|マイ|いもうと|em gái|姉妹 しまい
味|vị|ミ|あじ|vị|趣味 しゅみ
明|minh|メイ|あか(るい)|sáng|明日 あした
門|môn|モン|かど|cổng|専門 せんもん
問|vấn|モン|と(う)|hỏi|問題 もんだい
夜|dạ|ヤ|よる|đêm|今夜 こんや
野|dã|ヤ|の|đồng ruộng|野菜 やさい
薬|dược|ヤク|くすり|thuốc|薬局 やっきょく
有|hữu|ユウ|あ(る)|có|有名 ゆうめい
用|dụng|ヨウ|もち(いる)|dùng|用事 ようじ
洋|dương|ヨウ|—|đại dương; phương Tây|洋食 ようしょく
理|lý|リ|—|lý lẽ|料理 りょうり
旅|lữ|リョ|たび|du lịch|旅行 りょこう
料|liệu|リョウ|—|phí; nguyên liệu|料金 りょうきん
林|lâm|リン|はやし|rừng|森林 しんりん
青|thanh|セイ|あお(い)|xanh|青年 せいねん
赤|xích|セキ|あか(い)|đỏ|赤ちゃん あかちゃん
少|thiểu|ショウ|すく(ない)・すこ(し)|ít|少年 しょうねん
多|đa|タ|おお(い)|nhiều|多分 たぶん
太|thái|タイ|ふと(い)|to, béo|太陽 たいよう
親|thân|シン|おや|bố mẹ; thân|両親 りょうしん
森|sâm|シン|もり|rừng rậm|森 もり
空|không|クウ|そら|bầu trời; trống|空港 くうこう
建|kiến|ケン|た(てる)|xây|建物 たてもの
和|hòa|ワ|—|hòa; Nhật Bản|和食 わしょく
`);

/* Từ vựng theo chủ đề: cấp | chủ đề | từ | đọc | Hán-Việt | nghĩa | ví dụ */
const VOCAB_TOPICS = { mt: 'Môi trường & xử lý nước', work: 'Công việc & phòng lab', life: 'Đời sống & thủ tục', health: 'Sức khỏe & bệnh viện', study: 'Học tập & nghiên cứu', econ: 'Kinh tế & xã hội' };
const VOCAB = L(`
N3|mt|温暖化|おんだんか|ôn noãn hóa|nóng lên (toàn cầu)|地球温暖化が進んでいる。
N3|mt|資源|しげん|tư nguyên|tài nguyên|資源を大切にする。
N3|mt|節約|せつやく|tiết ước|tiết kiệm|水を節約する。
N3|mt|排出|はいしゅつ|bài xuất|thải ra|二酸化炭素の排出を減らす。
N3|mt|再利用|さいりよう|tái lợi dụng|tái sử dụng|処理した水を再利用する。
N3|mt|発生|はっせい|phát sinh|phát sinh|悪臭が発生する。
N2|mt|浄化|じょうか|tịnh hóa|làm sạch|微生物で水を浄化する。
N2|mt|汚泥|おでい|ô nê|bùn thải|汚泥を処理する。
N2|mt|有機物|ゆうきぶつ|hữu cơ vật|chất hữu cơ|有機物を分解する。
N2|mt|分解|ぶんかい|phân giải|phân hủy|微生物が有機物を分解する。
N2|mt|循環|じゅんかん|tuần hoàn|tuần hoàn|資源を循環させる。
N2|mt|廃棄物|はいきぶつ|phế khí vật|chất thải|廃棄物を減らす。
N2|mt|生態系|せいたいけい|sinh thái hệ|hệ sinh thái|生態系に影響を与える。
N2|mt|規制|きせい|quy chế|quy định, hạn chế|排水の規制が厳しくなった。
N2|mt|基準|きじゅん|cơ chuẩn|tiêu chuẩn|水質基準を満たす。
N2|mt|測定|そくてい|trắc định|đo đạc|濃度を測定する。
N2|mt|除去|じょきょ|trừ khử|loại bỏ|窒素を除去する。
N2|mt|曝気|ばっき|bộc khí|sục khí|曝気槽に空気を送る。
N3|work|締め切り|しめきり|—|hạn chót|締め切りは金曜日だ。
N3|work|打ち合わせ|うちあわせ|—|họp bàn, trao đổi|明日、先生と打ち合わせがある。
N3|work|報告|ほうこく|báo cáo|báo cáo|結果を先生に報告する。
N3|work|連絡|れんらく|liên lạc|liên lạc|遅れる場合は連絡してください。
N3|work|相談|そうだん|tương đàm|bàn bạc, xin ý kiến|進路について先生に相談した。
N3|work|予定|よてい|dự định|kế hoạch, dự định|来週の予定を確認する。
N3|work|担当|たんとう|đảm đương|phụ trách|この装置の担当は私です。
N3|work|資料|しりょう|tư liệu|tài liệu|会議の資料を作る。
N2|work|提出|ていしゅつ|đề xuất|nộp|レポートを提出する。
N2|work|確認|かくにん|xác nhận|xác nhận, kiểm tra|データを確認する。
N2|work|修正|しゅうせい|tu chính|sửa|論文を修正する。
N2|work|承認|しょうにん|thừa nhận|phê duyệt|計画が承認された。
N2|work|検討|けんとう|kiểm thảo|xem xét|新しい方法を検討する。
N2|work|効率|こうりつ|hiệu suất|hiệu suất|作業の効率を上げる。
N2|work|依頼|いらい|ỷ lại|nhờ, yêu cầu|分析を依頼する。
N2|work|実施|じっし|thực thi|thực hiện, tiến hành|調査を実施する。
N3|life|引っ越し|ひっこし|—|chuyển nhà|来月引っ越しをする。
N3|life|家賃|やちん|gia nhẫm|tiền thuê nhà|家賃を払う。
N3|life|住民票|じゅうみんひょう|trú dân phiếu|giấy xác nhận cư trú|市役所で住民票をもらう。
N3|life|届け出|とどけで|—|việc khai báo, đơn trình báo|転居の届け出をする。
N3|life|保険|ほけん|bảo hiểm|bảo hiểm|健康保険に入る。
N3|life|窓口|まどぐち|song khẩu|quầy tiếp nhận|二番の窓口へどうぞ。
N3|life|記入|きにゅう|ký nhập|điền (vào giấy)|この用紙に記入してください。
N3|life|印鑑|いんかん|ấn giám|con dấu|印鑑を持ってきてください。
N3|life|振り込み|ふりこみ|—|chuyển khoản|家賃を振り込みで払う。
N3|life|支払い|しはらい|chi phất|thanh toán|支払いはカードでできますか。
N3|life|ごみ出し|ごみだし|—|đổ rác|ごみ出しのルールを守る。
N2|life|契約|けいやく|khế ước|hợp đồng|アパートの契約を結ぶ。
N2|life|更新|こうしん|canh tân|gia hạn, cập nhật|在留カードを更新する。
N2|life|手続き|てつづき|thủ tục|thủ tục|市役所で手続きをする。
N3|health|症状|しょうじょう|chứng trạng|triệu chứng|どんな症状がありますか。
N3|health|診察|しんさつ|chẩn sát|khám bệnh|医者に診察してもらう。
N3|health|予約|よやく|dự ước|đặt hẹn, đặt chỗ|病院の予約をする。
N3|health|処方|しょほう|xử phương|kê đơn|薬を処方してもらう。
N3|health|体調|たいちょう|thể điều|tình trạng sức khỏe|最近体調がいい。
N3|health|熱|ねつ|nhiệt|sốt; nhiệt|熱が下がらない。
N2|health|治療|ちりょう|trị liệu|điều trị|歯の治療を受ける。
N2|health|健康診断|けんこうしんだん|kiện khang chẩn đoán|khám sức khỏe định kỳ|毎年健康診断を受ける。
N3|study|論文|ろんぶん|luận văn|bài báo, luận văn|論文を書く。
N3|study|卒業|そつぎょう|tốt nghiệp|tốt nghiệp|来年3月に卒業する。
N3|study|奨学金|しょうがくきん|tưởng học kim|học bổng|奨学金をもらっている。
N3|study|単位|たんい|đơn vị|tín chỉ; đơn vị đo|単位を取る。
N2|study|指導|しどう|chỉ đạo|hướng dẫn|先生に指導を受ける。
N2|study|仮説|かせつ|giả thuyết|giả thuyết|仮説を立てる。
N2|study|考察|こうさつ|khảo sát|bàn luận (phần discussion)|結果について考察する。
N2|study|結論|けつろん|kết luận|kết luận|結論を出す。
N2|study|引用|いんよう|dẫn dụng|trích dẫn|先行研究を引用する。
N2|study|学会|がっかい|học hội|hội nghị khoa học|学会で発表する。
N2|study|誤差|ごさ|ngộ sai|sai số|測定の誤差が大きい。
N2|study|平均|へいきん|bình quân|trung bình|平均値を求める。
N2|study|比較|ひかく|tỷ giác|so sánh|二つの方法を比較する。
N2|study|課題|かだい|khóa đề|vấn đề cần giải quyết; bài tập|今後の課題を整理する。
N2|econ|景気|けいき|cảnh khí|tình hình kinh tế|景気が回復している。
N2|econ|物価|ぶっか|vật giá|giá cả hàng hóa|物価が上がり続けている。
N2|econ|需要|じゅよう|nhu yếu|nhu cầu|電力の需要が増える。
N2|econ|供給|きょうきゅう|cung cấp|cung cấp|水の供給が止まった。
N2|econ|少子化|しょうしか|thiểu tử hóa|tỷ lệ sinh giảm|少子化が問題になっている。
N2|econ|高齢化|こうれいか|cao linh hóa|già hóa dân số|高齢化が進む。
N2|econ|人手不足|ひとでぶそく|—|thiếu nhân lực|人手不足の会社が多い。
N2|econ|傾向|けいこう|khuynh hướng|xu hướng|若者の間にこの傾向が見られる。
N2|econ|影響|えいきょう|ảnh hưởng|ảnh hưởng|天候が作物に影響する。
N2|econ|対策|たいさく|đối sách|biện pháp đối phó|地震の対策を立てる。
N2|econ|増加|ぞうか|tăng gia|gia tăng|外国人の数が増加している。
N2|econ|減少|げんしょう|giảm thiểu|giảm|人口が減少している。
N2|econ|割合|わりあい|—|tỷ lệ|女性の割合が高い。
N2|econ|実態|じったい|thực thái|thực trạng|調査で実態が分かった。
`);

/* Ngữ pháp N1 (tự soạn, ~110 mẫu phổ biến; ví dụ tự viết) */
const G1 = L(`
～が早いか|vừa mới… thì ngay|ベルが鳴る[が早いか]、学生たちは教室を飛び出した。
～や否や|vừa… là lập tức|ドアが開く[や否や]、子どもが走り込んできた。
～なり|vừa… thì liền (bất ngờ)|彼は部屋に入る[なり]、泣き出した。
～そばから|vừa… thì lại (lặp lại)|覚えた[そばから]忘れてしまう。
～てからというもの|kể từ khi… (thay đổi hẳn)|留学して[からというもの]、彼は積極的になった。
～をもって|bằng, với; vào lúc (mốc kết thúc)|本日[をもって]受付を終了いたします。
～を限りに|lấy… làm mốc cuối|今日[を限りに]タバコをやめる。
～に至るまで|cho đến cả|服装から髪型[に至るまで]校則で決められている。
～に至って(は)|đến mức… (mới)|事故が起きる[に至って]、ようやく対策がとられた。
～に至っては|còn về… thì (cực đoan hơn)|兄は数学が苦手だが、弟[に至っては]計算もできない。
～を皮切りに|bắt đầu từ…|東京[を皮切りに]、全国でコンサートを行う。
～をよそに|bất chấp, mặc kệ|親の心配[をよそに]、彼は一人で旅に出た。
～をものともせず|không hề nao núng trước|嵐[をものともせず]、救助隊は出発した。
～をおいて|ngoài… ra thì không|この仕事を任せられるのは彼[をおいて]ほかにいない。
～をもってすれば|nếu dùng/với… thì|彼の実力[をもってすれば]、合格は間違いない。
～ならでは|chỉ… mới có|これは京都[ならでは]の味だ。
～にあって|ở trong (hoàn cảnh)|困難な状況[にあって]も、彼は冷静だった。
～にかかわる|liên quan đến (điều hệ trọng)|これは命[にかかわる]問題だ。
～に即して|theo đúng, dựa sát|事実[に即して]報告してください。
～に照らして|đối chiếu với|法律[に照らして]判断する。
～を踏まえて|dựa trên, xét đến|前回の結果[を踏まえて]、計画を修正した。
～を余儀なくされる|buộc phải (ngoài ý muốn)|台風のため、試合は中止[を余儀なくされた]。
～を禁じ得ない|không kìm được (cảm xúc)|被害者の話に涙[を禁じ得ない]。
～ずにはおかない|chắc chắn sẽ gây ra|彼の演説は聴衆を感動させ[ずにはおかない]。
～ずにはすまない|không thể không (làm cho xong)|迷惑をかけたのだから、謝ら[ずにはすまない]。
～ないではおかない|nhất định sẽ|この映画は見る人を考えさせ[ないではおかない]。
～までもない|không cần phải|そんなことは言う[までもない]。
～には及ばない|không cần đến|わざわざ来る[には及ばない]。
～に足る|đáng, đủ để|彼は信頼する[に足る]人物だ。
～に堪える|đáng để; chịu được|この作品は鑑賞[に堪える]。
～に堪えない|không chịu nổi (khi nhìn/nghe)|聞く[に堪えない]悪口だ。
～に値する|đáng (giá trị)|この本は一読[に値する]。
～てやまない|luôn mong mỏi, không ngừng|皆様の成功を願って[やまない]。
～極まる / 極まりない|cực kỳ|彼の態度は失礼[極まりない]。
～の至り|vô cùng (trang trọng)|このような賞をいただき、光栄[の至り]です。
～の極み|tột cùng|ぜいたく[の極み]を尽くした食事。
～とあって|vì là (dịp đặc biệt)|連休[とあって]、観光地は込んでいる。
～とあれば|nếu là (vì… thì sẵn sàng)|子どものため[とあれば]、何でもする。
～ともなると / ともなれば|khi đã đến mức/cấp|社長[ともなると]、責任が重い。
～たるもの|đã là… thì phải|教師[たるもの]、生徒の手本でなければならない。
～ともあろう|đường đường là… mà|大臣[ともあろう]人が、うそをつくとは。
～ではあるまいし|có phải là… đâu mà|子ども[ではあるまいし]、一人でできるでしょう。
～ならいざしらず|nếu là… thì không nói, chứ|子ども[ならいざしらず]、大人がそんなことをするとは。
～ものを|giá mà… (thế mà)|早く言えばいい[ものを]、なぜ黙っていたの。
～と思いきや|cứ tưởng là… ai ngờ|晴れる[と思いきや]、急に雨が降り出した。
～とはいえ|tuy nói là… nhưng|春[とはいえ]、まだ寒い。
～といえども|dù là… cũng|子ども[といえども]、ルールは守るべきだ。
～ところを|đang lúc… mà (xin lỗi/cảm ơn)|お忙しい[ところを]ありがとうございます。
～とも|dù… cũng (= ても, văn viết)|どんなに苦しく[とも]、最後までやる。
～であれ / であろうと|dù là… đi nữa|理由が何[であれ]、遅刻はいけない。
～であれ～であれ|dù là… hay…|大人[であれ]子どもであれ、ルールは同じだ。
～なりとも|dù chỉ là chút ít|少し[なりとも]お役に立てれば嬉しいです。
～ながらに|nguyên trạng, vẫn còn|彼は生まれ[ながらに]才能を持っていた。
～つ～つ|lúc… lúc… (qua lại)|行き[つ]戻りつ考えた。
～かたがた|nhân tiện, kết hợp|お礼[かたがた]、ご挨拶に伺いました。
～がてら|nhân tiện, tiện thể|散歩[がてら]、買い物に行った。
～かたわら|bên cạnh việc chính|彼は会社に勤める[かたわら]、小説を書いている。
～なり～なり|hoặc… hoặc|電話[なり]メールなりで連絡してください。
～といい～といい|cả… lẫn… (đều)|色[といい]形といい、申し分ない。
～といわず～といわず|không kể… hay…, khắp|手[といわず]足といわず、泥だらけだ。
～なくして(は)|nếu không có… thì không|努力[なくして]成功はない。
～なしに(は)|không có…|許可[なしに]入ってはいけない。
～ことなしに|mà không…|人の助けを借りる[ことなしに]生きることはできない。
～ずとも|dù không… cũng|言わ[ずとも]分かる。
～ないまでも|dù không đến mức… thì ít nhất|毎日とは言わ[ないまでも]、週に一度は運動したい。
～んがため(に)|nhằm mục đích (văn viết)|夢を実現せ[んがため]、努力を続けている。
～べく|để (văn viết)|試験に合格す[べく]、毎日勉強している。
～べからず|cấm, không được|芝生に入る[べからず]。
～べくもない|không thể nào|素人の私には、プロに勝つ[べくもない]。
～まじき|không được phép (đối với tư cách)|教師にある[まじき]行為だ。
～にたえない|vô cùng (cảm xúc)|感謝[にたえない]。
～かぎりだ|hết sức, vô cùng|一人で外国へ行くのは心細い[かぎりだ]。
～とばかりに|như muốn nói rằng|彼は「帰れ」[とばかりに]ドアを指さした。
～んばかりに|như sắp…|泣き出さ[んばかりの]顔をしていた。
～と言わんばかりに|cứ như muốn nói|もう話すことはない[と言わんばかりに]、彼は席を立った。
～ともなく / ともなしに|vô tình, không chủ ý|見る[ともなく]テレビを見ていた。
～に先駆けて|đi đầu, trước|他社[に先駆けて]新製品を発表した。
～を機に|nhân dịp|結婚[を機に]、仕事を辞めた。
～いかんによって|tùy vào|結果の[いかんによって]は、計画を中止する。
～いかんにかかわらず|bất kể… như thế nào|理由の[いかんにかかわらず]、返金はしない。
～いかんを問わず|không kể|国籍の[いかんを問わず]、応募できる。
～によらず|không tùy thuộc vào|年齢[によらず]、誰でも参加できる。
～はおろか|đừng nói đến… ngay cả|漢字[はおろか]、ひらがなも書けない。
～もさることながら|… thì đã đành, … còn|味[もさることながら]、見た目も美しい。
～はさておき|tạm gác… sang một bên|冗談[はさておき]、本題に入ろう。
～すら|ngay cả (nhấn mạnh)|忙しくて、食事をする時間[すら]ない。
～だに|ngay cả… cũng không|想像する[だに]恐ろしい。
～たりとも|dù chỉ một… cũng không|一円[たりとも]無駄にできない。
～にして|ở (mức)…; mãi đến… mới|40歳[にして]、初めて海外へ行った。
～までだ / までのことだ|chỉ việc… là xong|だめなら、もう一度やる[までだ]。
～てしかるべきだ|đáng lẽ phải|彼の努力は評価されて[しかるべきだ]。
～てはばからない|không ngại, thẳng thừng|彼は自分が天才だと言って[はばからない]。
～にもほどがある|… cũng phải có giới hạn|冗談[にもほどがある]。
～始末だ|rốt cuộc thì (kết cục tệ)|彼はお金を使い果たし、借金までする[始末だ]。
～っぱなし|để nguyên, cứ… mãi|窓を開け[っぱなし]にしないで。
～ずくめ|toàn là|今年はいいこと[ずくめ]だった。
～まみれ|dính đầy (bẩn)|汗[まみれ]になって働いた。
～めく|có vẻ, mang dáng dấp|春[めいて]きた。
～びる|trông như, ra vẻ|大人[びた]話し方をする。
～ごとき / ごとく|như là (văn viết)|前に述べた[ごとく]、計画を変更する。
～きらいがある|có khuynh hướng (xấu)|彼は物事を大げさに言う[きらいがある]。
～をおして|bất chấp (khó khăn)|病気[をおして]会議に出席した。
～が最後|một khi đã… thì (hết đường)|彼に話した[が最後]、みんなに知られてしまう。
～ようによっては|tùy cách…|考え[ようによっては]、失敗もいい経験だ。
～にひきかえ|trái ngược với|兄[にひきかえ]、弟はよく勉強する。
`);
GRAMMAR.push(...G1.map(r => ({ lv: 'N1', gr: '', p: r[0], m: r[1], x: r[2] })));
