// 動作確認用のダミーデータ。実在の人物・事業所・医療機関・自治体ではない。
//
// 氏名は持たない（この台帳の設計どおり）。
// 保険者は「神奈川市」「東京市」のように、実在しない自治体名にしている。
// 認定期限は投入した日を基準に計算するので、いつ入れても
// 「62日以内に迫っている人が3名」「期限切れが1名」という並びになる。

// 今日から n 日後（負なら n 日前）を 'YYYY-MM-DD' で返す
function daysFromToday(n) {
  const date = new Date()
  date.setDate(date.getDate() + n)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return date.getFullYear() + '-' + month + '-' + day
}

// 介助段階をまとめて書くための短縮。左から 移動・移乗・排泄・入浴・食事・更衣
function adl(move, transfer, toilet, bath, meal, dress) {
  return { move, transfer, toilet, bath, meal, dress }
}

// 左から 調理・買物・服薬・金銭管理
function iadl(cooking, shopping, medication, money) {
  return { cooking, shopping, medication, money }
}

// ダミーデータを作って返す。呼ぶたびに認定期限は今日を基準に計算し直す。
export function buildSampleClients() {
  return [
    {
      careManager: 'sasaki', status: 'active', gender: 'female', birthDate: '1938-04-12',
      householdType: 'alone', careLevel: 'kaigo_2',
      certStartDate: daysFromToday(-335), certEndDate: daysFromToday(30), insurer: '神奈川市',
      mainDiseases: '変形性膝関節症', currentDiseases: '高血圧症\n脂質異常症',
      medicalHistory: '大腿骨頸部骨折（2023年・右）', familyDoctor: 'みどり野内科クリニック',
      physicalIndependence: 'A1', cognitiveIndependence: 'I',
      adl: adl('watch', 'independent', 'independent', 'partial', 'independent', 'independent'),
      iadl: iadl('partial', 'full', 'watch', 'independent'),
      services: [
        { serviceType: '通所介護', officeName: 'みどり野デイサービス', frequency: '週2回' },
        { serviceType: '福祉用具貸与（歩行器・手すり）', officeName: 'ひばり福祉用具', frequency: '' },
      ],
      personWish: '住み慣れた自宅で暮らし続けたい',
      familyWish: '長女：週末のみ支援可能。平日の見守りをお願いしたい',
      remarks: '屋外歩行は歩行器を使用。\n雨天時の通所は送迎を玄関先まで。',
      monitoringDate: daysFromToday(-12),
    },
    {
      careManager: 'miura', status: 'active', gender: 'male', birthDate: '1934-11-03',
      householdType: 'couple', careLevel: 'kaigo_4',
      certStartDate: daysFromToday(-310), certEndDate: daysFromToday(55), insurer: '東京市',
      mainDiseases: '脳梗塞後遺症（左片麻痺）', currentDiseases: '心房細動\n糖尿病',
      medicalHistory: '脳梗塞（2021年）\n白内障手術（2019年）',
      familyDoctor: 'ひばり脳神経クリニック',
      physicalIndependence: 'B1', cognitiveIndependence: 'IIa',
      adl: adl('partial', 'partial', 'partial', 'full', 'watch', 'full'),
      iadl: iadl('full', 'full', 'full', 'partial'),
      services: [
        { serviceType: '訪問介護', officeName: 'ひばり訪問介護ステーション', frequency: '週4回' },
        { serviceType: '訪問看護', officeName: 'ひばり訪問看護ステーション', frequency: '週1回' },
      ],
      personWish: 'トイレは自分で行けるようになりたい',
      familyWish: '妻：介護負担が大きく、入浴の支援を増やしてほしい',
      remarks: '妻も高齢のため、移乗は2人介助が望ましい。',
      monitoringDate: daysFromToday(-20),
    },
    {
      careManager: 'takahashi', status: 'active', gender: 'female', birthDate: '1941-07-21',
      householdType: 'with_child', careLevel: 'shien_1',
      certStartDate: daysFromToday(-385), certEndDate: daysFromToday(-20), insurer: '若葉台市',
      mainDiseases: '腰部脊柱管狭窄症', currentDiseases: '骨粗鬆症',
      medicalHistory: '子宮筋腫手術（2005年）', familyDoctor: '若葉台整形外科',
      physicalIndependence: 'J2', cognitiveIndependence: 'independent',
      adl: adl('independent', 'independent', 'independent', 'independent', 'independent', 'independent'),
      iadl: iadl('independent', 'watch', 'independent', 'independent'),
      services: [
        { serviceType: '通所型サービス', officeName: '若葉台いきいきセンター', frequency: '週1回' },
      ],
      personWish: '買い物に一人で行けるうちは続けたい',
      familyWish: '次男：同居しているが日中は不在のため、日中の見守りを希望',
      remarks: '認定期限を過ぎている。更新申請の状況を確認すること。',
      monitoringDate: daysFromToday(-45),
    },
    {
      careManager: 'sasaki', status: 'active', gender: 'male', birthDate: '1943-02-14',
      householdType: 'alone', careLevel: 'kaigo_5',
      certStartDate: daysFromToday(-320), certEndDate: daysFromToday(45), insurer: '神奈川市',
      mainDiseases: 'パーキンソン病', currentDiseases: '嚥下機能低下のため経過観察中',
      medicalHistory: '誤嚥性肺炎（2025年・入院）', familyDoctor: 'みどり野内科クリニック',
      physicalIndependence: 'C1', cognitiveIndependence: 'IIIa',
      adl: adl('full', 'full', 'full', 'full', 'partial', 'full'),
      iadl: iadl('full', 'full', 'full', 'full'),
      services: [
        { serviceType: '訪問介護', officeName: 'みどり野ヘルパーセンター', frequency: '毎日2回' },
        { serviceType: '訪問看護', officeName: 'ひばり訪問看護ステーション', frequency: '週2回' },
        { serviceType: '福祉用具貸与（特殊寝台・車椅子）', officeName: 'ひばり福祉用具', frequency: '' },
      ],
      personWish: '最期まで自宅で過ごしたい',
      familyWish: '姪：遠方のため月1回の訪問が限度。緊急時の連絡体制を整えたい',
      remarks: '食事はとろみ付き。むせ込みが増えた場合はすぐ連絡。\n独居のため緊急通報装置を設置済み。',
      monitoringDate: daysFromToday(-8),
    },
    {
      careManager: 'miura', status: 'active', gender: 'female', birthDate: '1936-09-30',
      householdType: 'alone', careLevel: 'kaigo_1',
      certStartDate: daysFromToday(-165), certEndDate: daysFromToday(200), insurer: '東京市',
      mainDiseases: 'アルツハイマー型認知症', currentDiseases: '高血圧症',
      medicalHistory: '胆石症手術（2010年）', familyDoctor: '東京市もの忘れクリニック',
      physicalIndependence: 'A2', cognitiveIndependence: 'IIb',
      adl: adl('independent', 'independent', 'watch', 'partial', 'independent', 'watch'),
      iadl: iadl('full', 'full', 'full', 'full'),
      services: [
        { serviceType: '通所介護', officeName: 'みどり野デイサービス', frequency: '週3回' },
        { serviceType: '訪問介護', officeName: 'ひばり訪問介護ステーション', frequency: '週2回' },
      ],
      personWish: '娘に迷惑をかけたくない',
      familyWish: '長女：服薬管理が心配。訪問回数を増やすことを検討したい',
      remarks: '服薬カレンダーを使用。飲み忘れが週に数回あり。',
      monitoringDate: daysFromToday(-25),
    },
    {
      careManager: 'takahashi', status: 'active', gender: 'male', birthDate: '1939-05-08',
      householdType: 'couple', careLevel: 'shien_2',
      certStartDate: daysFromToday(-65), certEndDate: daysFromToday(300), insurer: 'ひばり市',
      mainDiseases: '慢性心不全', currentDiseases: '慢性腎臓病（保存期）',
      medicalHistory: '心筋梗塞（2018年・ステント留置）', familyDoctor: 'ひばり循環器内科',
      physicalIndependence: 'J2', cognitiveIndependence: 'independent',
      adl: adl('independent', 'independent', 'independent', 'watch', 'independent', 'independent'),
      iadl: iadl('watch', 'partial', 'independent', 'independent'),
      services: [
        { serviceType: '通所型サービス', officeName: 'ひばり健康増進センター', frequency: '週2回' },
      ],
      personWish: '体力を落とさないように運動を続けたい',
      familyWish: '妻：塩分管理を一緒に指導してほしい',
      remarks: '入浴前後の血圧測定を実施。息切れの増悪に注意。',
      monitoringDate: daysFromToday(-15),
    },
    {
      careManager: 'sasaki', status: 'active', gender: 'female', birthDate: '1932-12-25',
      householdType: 'with_child', careLevel: 'kaigo_3',
      certStartDate: daysFromToday(-245), certEndDate: daysFromToday(120), insurer: '若葉台市',
      mainDiseases: '関節リウマチ', currentDiseases: '腰椎圧迫骨折後の疼痛で経過観察中',
      medicalHistory: '腰椎圧迫骨折（2024年）\n白内障手術（2015年）',
      familyDoctor: '若葉台整形外科',
      physicalIndependence: 'B2', cognitiveIndependence: 'IIa',
      adl: adl('partial', 'partial', 'partial', 'full', 'watch', 'partial'),
      iadl: iadl('full', 'full', 'partial', 'full'),
      services: [
        { serviceType: '通所介護', officeName: '若葉台デイサービス', frequency: '週3回' },
        { serviceType: '短期入所生活介護', officeName: '若葉台ショートステイ', frequency: '月1回・3日間' },
      ],
      personWish: '家族と一緒に食事をする時間を大切にしたい',
      familyWish: '長男の妻：介護疲れがあり、ショートステイを増やしたい',
      remarks: '関節痛は朝に強い。午前の予定は無理をさせない。',
      monitoringDate: daysFromToday(-30),
    },
    {
      careManager: 'miura', status: 'paused', gender: 'male', birthDate: '1945-03-17',
      householdType: 'other', careLevel: 'kaigo_2',
      certStartDate: daysFromToday(-115), certEndDate: daysFromToday(250), insurer: '神奈川市',
      mainDiseases: '脊髄小脳変性症', currentDiseases: '嚥下機能低下のため経過観察中',
      medicalHistory: '虫垂炎手術（1978年）', familyDoctor: 'みどり野神経内科',
      physicalIndependence: 'B1', cognitiveIndependence: 'I',
      adl: adl('partial', 'watch', 'watch', 'partial', 'watch', 'partial'),
      iadl: iadl('full', 'full', 'watch', 'watch'),
      services: [
        { serviceType: '訪問リハビリテーション', officeName: 'みどり野リハビリ支援', frequency: '週2回' },
      ],
      personWish: '歩行訓練を続けて外出できるようになりたい',
      familyWish: '弟：入院中のため、退院後に再開したい',
      remarks: '入院中のためサービス休止中。退院見込みは未定。',
      monitoringDate: daysFromToday(-60),
    },
    {
      careManager: 'takahashi', status: 'closed', gender: 'female', birthDate: '1930-08-02',
      householdType: 'alone', careLevel: 'kaigo_1',
      certStartDate: daysFromToday(-275), certEndDate: daysFromToday(90), insurer: '東京市',
      mainDiseases: '変形性腰椎症', currentDiseases: '',
      medicalHistory: '胃潰瘍（1995年）', familyDoctor: '東京市中央内科',
      physicalIndependence: 'J1', cognitiveIndependence: 'independent',
      adl: adl('independent', 'independent', 'independent', 'watch', 'independent', 'independent'),
      iadl: iadl('watch', 'watch', 'independent', 'independent'),
      services: [],
      personWish: '娘の家の近くに移りたい',
      familyWish: '長女：転居先で新たにケアマネジャーを探す',
      remarks: '他市へ転居のため支援終了。転居先の地域包括支援センターへ引き継ぎ済み。',
      monitoringDate: daysFromToday(-40),
    },
    {
      careManager: 'sasaki', status: 'active', gender: 'male', birthDate: '1947-06-11',
      householdType: 'couple', careLevel: 'jigyo_taisho',
      certStartDate: daysFromToday(-35), certEndDate: daysFromToday(400), insurer: 'ひばり市',
      mainDiseases: '', currentDiseases: '下肢筋力低下のため経過観察中',
      medicalHistory: '特記なし', familyDoctor: 'ひばり家庭医療クリニック',
      physicalIndependence: 'independent', cognitiveIndependence: 'independent',
      adl: adl('independent', 'independent', 'independent', 'independent', 'independent', 'independent'),
      iadl: iadl('independent', 'independent', 'independent', 'independent'),
      services: [
        {
          serviceType: '通所型サービス（短期集中予防）',
          officeName: 'ひばり健康増進センター',
          frequency: '週1回',
        },
      ],
      personWish: '転ばないように足腰を鍛えたい',
      familyWish: '妻：本人のやる気を大事にしてほしい',
      remarks: '基本チェックリストにより事業対象者と判定。',
      monitoringDate: daysFromToday(-5),
    },
  ]
}
