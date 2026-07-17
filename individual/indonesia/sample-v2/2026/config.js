/**
 * WSP Radar - 強み解放サーベイ v2 (Strengths Unlocking Survey)
 *
 * ── v2 仕様（2026/7 アップデート仕様提案に基づく）──
 * 第1層 強みプロファイル（Big Five系）25問            …v1から変更なし
 * 第2層 当たり前マップ（成長観・統制感・挑戦観・役割観）16問 …v1から変更なし
 * 第3層 動機・志向（達成・親和・影響）15問              …NEW
 * 成長要素（学習俊敏性・FB受容・経験からの学び）8問       …NEW
 * 現地化の当たり前 6問（社員モードのみ）                …v1から変更なし
 * 信頼性指標 8問（一貫性 C_1〜C_3、ライスケール V_1〜V_5）
 * 自由記述 3問（FT_3は社員／候補者で差し替え）
 *
 * 社員モード計 81問（約25〜30分）／候補者モード計 75問（約25分）
 *
 * ── 回答者モード ──
 * RESPONDENT_MODE: "employee"（社員） | "candidate"（採用候補者）
 *   candidate では employeeOnly:true の設問（現地化の当たり前・FT_3）が非表示になり、
 *   candidateOnly:true の設問（FT_3c）が表示される。
 *   ※ モードごとに PROJECT_ID を分け、記録先スプレッドシートを分離すること
 *     （例: STRENGTHS_UNLOCKING_v2_2026 / STRENGTHS_UNLOCKING_v2_2026_CAND）。
 *
 * ★印は逆転設問（高スコアが「天井になっている前提」を示す。集計時に反転処理）。
 *   ※回答画面には ★ は表示しない。反転はスプレッドシート/レポート側で処理する。
 * TOP_DESCRIPTION 内の {N} は表示時に実際の設問数へ自動置換される。
 */
const WSP_CONFIG = {
    PROJECT_ID: "STRENGTHS_UNLOCKING_v2_2026",
    COMPANY: "",
    SURVEY_KIND: "Individual",
    RESPONDENT_MODE: "employee",
    LAYERS: 3,
    TOP_HEADING: "あなたの強みと、それを左右する『当たり前』を可視化。",
    TOP_DESCRIPTION:
        "正解・不正解はありません。\n" +
        "日頃の実感に最も近いものを、5段階でお選びください。\n" +
        "あなたの強み、無自覚な前提（当たり前）、そしてあなたを動かす動機を見える化します。\n" +
        "全{N}問・所要時間 約25〜30分。",
    TOP_DESCRIPTION_CANDIDATE:
        "正解・不正解はありません。\n" +
        "日頃の実感に最も近いものを、5段階でお選びください。\n" +
        "あなたの強み・考え方・動機を多面的に見える化します。\n" +
        "全{N}問・所要時間 約25分。",
    INTRO_TEXT_CANDIDATE:
        "このサーベイに正解・不正解はありません。\n" +
        "「良く見せよう」とせず、ありのままの感覚でお答えいただくことが、あなたに合った仕事・環境の実現につながります。\n" +
        "結果は面接等と合わせて総合的に参考にされるものであり、この結果のみで合否が決まることはありません。",
    QUESTIONS: [
        // ===== 第1層 S1 探究・変化対応力 =====
        { id:"S1_1", type:"scale", category:"探究・変化対応力", question:"新しいやり方やアイデアを試すことに前向きだ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S1_2", type:"scale", category:"探究・変化対応力", question:"慣れた方法よりも、より良いやり方を探すことが多い", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S1_3", type:"scale", category:"探究・変化対応力", question:"変化や未経験の状況にも面白さを感じて取り組める", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S1_4", type:"scale", category:"探究・変化対応力", question:"異なる文化や考え方に触れることに興味がある", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S1_5", type:"scale", category:"探究・変化対応力", question:"物事の「なぜ」を当たり前で片づけず、自分で考えたい", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== S2 遂行・自律力 =====
        { id:"S2_1", type:"scale", category:"遂行・自律力", question:"一度決めたことは最後までやり切る", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S2_2", type:"scale", category:"遂行・自律力", question:"指示を待たず、自分で計画を立てて仕事を進められる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S2_3", type:"scale", category:"遂行・自律力", question:"細部まで丁寧に仕上げることを大切にしている", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S2_4", type:"scale", category:"遂行・自律力", question:"締め切りや約束を確実に守る責任感がある", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S2_5", type:"scale", category:"遂行・自律力", question:"優先順位をつけて、限られた時間を効率よく使える", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"C_1", type:"scale", category:"信頼性指標", question:"やると決めたことは、途中で投げ出さず最後までやり遂げる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== S3 発信・推進力 =====
        { id:"S3_1", type:"scale", category:"発信・推進力", question:"会議やチームで自分の意見を積極的に発信する", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S3_2", type:"scale", category:"発信・推進力", question:"人を巻き込んで物事を前に進めるのが得意だ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S3_3", type:"scale", category:"発信・推進力", question:"初対面の相手とも自然に関係を築ける", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S3_4", type:"scale", category:"発信・推進力", question:"場を引っ張る役割を任されることが多い", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S3_5", type:"scale", category:"発信・推進力", question:"自分の考えを相手に分かりやすく伝えられる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== S4 協働・関係構築力 =====
        { id:"S4_1", type:"scale", category:"協働・関係構築力", question:"同僚やチームメンバーを進んで支援する", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S4_2", type:"scale", category:"協働・関係構築力", question:"相手の立場や気持ちを汲んで行動できる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S4_3", type:"scale", category:"協働・関係構築力", question:"対立があっても、協力的な解決策を探せる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S4_4", type:"scale", category:"協働・関係構築力", question:"チームの調和や信頼関係づくりに貢献している", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S4_5", type:"scale", category:"協働・関係構築力", question:"異なる立場の人の間に立って橋渡しができる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== S5 安定・回復力 =====
        { id:"S5_1", type:"scale", category:"安定・回復力", question:"プレッシャーの中でも冷静さを保てる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S5_2", type:"scale", category:"安定・回復力", question:"失敗や挫折から立ち直るのが早い", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S5_3", type:"scale", category:"安定・回復力", question:"強いストレス下でも判断力を維持できる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S5_4", type:"scale", category:"安定・回復力", question:"不確実・あいまいな状況でも落ち着いて対応できる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"S5_5", type:"scale", category:"安定・回復力", question:"感情に流されず、状況を客観的に見られる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"V_1", type:"scale", category:"信頼性指標", question:"これまでの人生で、一度も嘘をついたことがない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== 第2層 B1 成長観 =====
        { id:"B1_1", type:"scale", category:"当たり前｜成長観", question:"努力と工夫しだいで、自分の能力は大きく伸ばせる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B1_2", type:"scale", category:"当たり前｜成長観", question:"今できないことも、学べばできるようになると思う", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B1_3r", type:"scale", category:"当たり前｜成長観", question:"人の基本的な能力は生まれつき決まっていて、大きくは変わらない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B1_4r", type:"scale", category:"当たり前｜成長観", question:"自分の得意・不得意はもう決まっていると感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== B2 統制感 =====
        { id:"B2_1", type:"scale", category:"当たり前｜統制感", question:"職場の状況は、自分の働きかけしだいで変えられる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B2_2", type:"scale", category:"当たり前｜統制感", question:"良い結果も悪い結果も、最終的には自分の取り組み方しだいだ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B2_3r", type:"scale", category:"当たり前｜統制感", question:"自分が何を言っても、組織の決まりごとは変わらない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B2_4r", type:"scale", category:"当たり前｜統制感", question:"自分の仕事の結果は、環境や周囲の都合で決まることが多い", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"V_2", type:"scale", category:"信頼性指標", question:"どんなに腹が立っても、人に不機嫌な態度をとったことは一度もない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== B3 挑戦観 =====
        { id:"B3_1", type:"scale", category:"当たり前｜挑戦観", question:"失敗は、成長のための貴重な学びだと思う", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B3_2", type:"scale", category:"当たり前｜挑戦観", question:"難しい課題こそ、自分を伸ばすチャンスだと感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B3_3r", type:"scale", category:"当たり前｜挑戦観", question:"失敗すると評価が下がるので、できるだけ避けたい", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B3_4r", type:"scale", category:"当たり前｜挑戦観", question:"確実にできることだけに取り組む方が安心だ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== B4 役割観 =====
        { id:"B4_1", type:"scale", category:"当たり前｜役割観", question:"与えられた役割の枠を超えて、仕事をより良く作り変えられる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B4_2", type:"scale", category:"当たり前｜役割観", question:"自分の仕事の意味や価値を、自分なりに捉え直すことができる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B4_3r", type:"scale", category:"当たり前｜役割観", question:"自分の仕事は、決められた範囲をこなすことだと思う", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"B4_4r", type:"scale", category:"当たり前｜役割観", question:"仕事のやり方は上司や本社が決めるもので、自分が変えるものではない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"C_2", type:"scale", category:"信頼性指標", question:"自分の役割は、与えられた範囲を確実にこなすことだと考えている", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"V_3", type:"scale", category:"信頼性指標", question:"他人の悪口や陰口を、これまで一度も言ったことがない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== 第3層 M1 動機｜達成（NEW v2）=====
        { id:"M1_1", type:"scale", category:"動機｜達成", question:"高い目標に向かって取り組んでいるときに、最もやりがいを感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M1_2", type:"scale", category:"動機｜達成", question:"自分の仕事の成果を、数字や結果ではっきり確認したい", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M1_3", type:"scale", category:"動機｜達成", question:"過去の自分を超えることに、強いこだわりがある", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M1_4", type:"scale", category:"動機｜達成", question:"簡単にできる仕事より、少し背伸びが必要な仕事を選びたい", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M1_5", type:"scale", category:"動機｜達成", question:"良い結果が出ると、さらに高い基準に挑みたくなる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== M2 動機｜親和（NEW v2）=====
        { id:"M2_1", type:"scale", category:"動機｜親和", question:"仲間と協力しながら進める仕事に、最もやりがいを感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M2_2", type:"scale", category:"動機｜親和", question:"職場の人間関係の良さは、仕事の内容と同じくらい重要だ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M2_3", type:"scale", category:"動機｜親和", question:"困っている同僚がいると、自分の仕事の手を止めてでも助けたくなる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M2_4", type:"scale", category:"動機｜親和", question:"チームの一員として認められていると感じるとき、力が湧いてくる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M2_5", type:"scale", category:"動機｜親和", question:"一人で完結する仕事より、人と関わる仕事の方が好きだ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== M3 動機｜影響（NEW v2）=====
        { id:"M3_1", type:"scale", category:"動機｜影響", question:"自分の提案で人や組織が動くことに、大きなやりがいを感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M3_2", type:"scale", category:"動機｜影響", question:"チームや組織の方向性を決める役割を担いたい", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M3_3", type:"scale", category:"動機｜影響", question:"人に教えたり、助言したりすることが好きだ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M3_4", type:"scale", category:"動機｜影響", question:"会議では、結論に影響を与える発言をしたいと思う", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"M3_5", type:"scale", category:"動機｜影響", question:"責任ある立場を任されると、力が湧いてくる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"C_3", type:"scale", category:"信頼性指標", question:"目標の達成に向けて努力している時間に、強い充実感を覚える", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== G 成長要素（NEW v2）=====
        { id:"G_1", type:"scale", category:"成長要素", question:"初めての状況でも、過去の経験から共通点を見つけて応用できる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_2", type:"scale", category:"成長要素", question:"新しい知識やスキルを、比較的早く吸収できる方だ", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_3", type:"scale", category:"成長要素", question:"厳しいフィードバックも、自分の成長材料として受け止められる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_4", type:"scale", category:"成長要素", question:"自分から進んで、周囲に意見やフィードバックを求めている", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_5", type:"scale", category:"成長要素", question:"仕事が一段落したら、うまくいった理由・いかなかった理由を振り返る", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_6", type:"scale", category:"成長要素", question:"失敗した経験を、次のやり方の改善に具体的につなげている", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_7", type:"scale", category:"成長要素", question:"より良い方法のためなら、慣れた自分のやり方を手放すことができる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"G_8", type:"scale", category:"成長要素", question:"経験したことのない役割でも、やりながら学べば対応できると思える", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"V_5", type:"scale", category:"信頼性指標", question:"人からの批判や指摘に、嫌な気持ちを抱いたことは一度もない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== 現地化の当たり前（社員モードのみ）=====
        { id:"A_1r", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"重要な判断は本社・駐在員がするもので、自分が関わることではない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"A_2r", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"現地スタッフが提案しても、最終的には日本側の意向で決まる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"A_3r", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"ローカル社員がマネジメント上位に就くのは難しいと感じる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"A_4", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"自分はこの会社で長期的なキャリアを描ける", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"A_5", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"言葉や文化の壁は、自分の工夫しだいで乗り越えられる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"A_6", type:"scale", category:"現地化の当たり前", employeeOnly:true, question:"経営層・上司に対して、自分の意見や懸念を率直に伝えられる", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        { id:"V_4", type:"scale", category:"信頼性指標", question:"約束や締め切りを破ったことは、これまで一度もない", minLabel:"全くそう思わない", maxLabel:"非常にそう思う", scaleMax:5 },
        // ===== 自由記述 =====
        { id:"FT_1", type:"text", category:"自由記述", question:"あなたが「自分には難しい／できない」と思い込んでいることの中で、本当はできるかもしれないと感じることは何ですか？", placeholder:"自由にご記入ください..." },
        { id:"FT_2", type:"text", category:"自由記述", question:"あなたの強みを今より発揮するために、職場で変えたい「当たり前」があれば教えてください。", placeholder:"自由にご記入ください..." },
        { id:"FT_3", type:"text", category:"自由記述", employeeOnly:true, question:"最近、自分の前提や思い込みが「実は違った」と気づいた経験があれば教えてください。（任意）", placeholder:"空欄のままスキップできます", optional:true },
        { id:"FT_3c", type:"text", category:"自由記述", candidateOnly:true, question:"これまでで最も挑戦的だった仕事・経験と、そこから学んだことを教えてください。また、今後挑戦してみたい仕事や環境があれば教えてください。", placeholder:"自由にご記入ください..." }
    ]
};
