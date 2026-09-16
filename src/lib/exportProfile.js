// AIに渡すための要約テキストを組み立てる。
//
// この台帳は氏名を持たないが、それだけでは足りない。
// 生年月日・認定期間の日付・保険者・かかりつけ医・事業所名のように、
// 組み合わせると個人にたどり着きうる項目があるため、下の決まりで扱いを固定する。

import { findCareLevel } from '../config/careLevels.js'
import {
  ADL_ITEMS,
  ASSIST_LEVELS,
  COGNITIVE_INDEPENDENCE_LEVELS,
  GENDERS,
  HOUSEHOLD_TYPES,
  IADL_ITEMS,
  PHYSICAL_INDEPENDENCE_LEVELS,
  findLabel,
} from '../config/options.js'
import { calcAge } from './age.js'
import { countDaysUntil } from './certification.js'

// 出力しない項目と、その理由。項目を増やしたときはここか EXPORTED_FIELDS に必ず足す。
export const EXCLUDED_FIELDS = {
  careManager: '担当ケアマネの氏名。事業所が絞り込める',
  status: '書式に含めない（AIに渡す内容ではない）',
  certStartDate: '認定期間の日付は出さない。残り期間の概数に変換する',
  insurer: '保険者名。居住する自治体が特定できる',
  familyDoctor: 'かかりつけ医の氏名・医療機関名',
  monitoringDate: '書式に含めない',
  updatedAt: '書式に含めない',
  'services[].officeName': '事業所名。利用者の生活圏が特定できる',
}

// そのままではなく、変換してから出力する項目。
export const CONVERTED_FIELDS = {
  birthDate: '日付は出さず、年齢に変換して出力する',
  certEndDate: '日付は出さず、残り期間の概数に変換して出力する',
}

// 出力に使う項目。ここに無い項目は出力されない。
export const EXPORTED_FIELDS = [
  'id',
  'gender',
  'birthDate',
  'householdType',
  'careLevel',
  'certEndDate',
  'mainDiseases',
  'currentDiseases',
  'medicalHistory',
  'physicalIndependence',
  'cognitiveIndependence',
  'adl',
  'iadl',
  'services',
  'personWish',
  'familyWish',
  'remarks',
]

// 台帳に項目を増やしたのに、出力するとも出力しないとも決めていない項目を探す。
// 決めていない項目は出力されない（漏れるより出ないほうが安全）ので、
// 見つかったら開発中に気づけるよう名前だけを知らせる。
export function findUnclassifiedFields(client) {
  return Object.keys(client).filter(
    (key) => !EXPORTED_FIELDS.includes(key) && !(key in EXCLUDED_FIELDS) && !(key in CONVERTED_FIELDS),
  )
}

// 複数行の入力を1行にまとめる。空行は落とす。
function joinLines(text, separator) {
  if (!text) {
    return ''
  }
  return String(text)
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(separator)
}

// 空でないものだけを区切り文字でつなぐ。
function joinParts(parts, separator) {
  return parts.filter(Boolean).join(separator)
}

// 認定期間の残りを概数にする。日付そのものは出さない。
function formatRemaining(certEndDate) {
  const days = countDaysUntil(certEndDate)
  if (days === null) {
    return ''
  }
  if (days < 0) {
    return '認定期間 期限切れ'
  }
  if (days < 31) {
    return '認定期間 残り1か月未満'
  }
  // 1か月を約30.4日として概数にする
  return '認定期間 残り' + Math.round(days / 30.4) + 'か月'
}

// ADL・IADLのように「項目:段階」を並べる。未選択の項目は飛ばす。
function formatAssist(items, values) {
  const parts = items.map((item) => {
    const value = values ? values[item.key] : ''
    return value ? item.label + ':' + findLabel(ASSIST_LEVELS, value) : ''
  })
  return joinParts(parts, ' ')
}

// 利用サービスは種別と頻度だけ。事業所名は出力しない。
function formatServices(services) {
  const parts = services.map((service) => joinParts([service.serviceType, service.frequency], ' '))
  return joinParts(parts, ' ／ ')
}

// 性別・年齢・世帯構成をまとめる。生年月日そのものは出力しない。
function formatBasic(client) {
  const gender = GENDERS.find((item) => item.value === client.gender)
  const age = calcAge(client.birthDate)
  // findLabel は未入力に '—' を返すので、ここでは空文字にして行から落とす
  const household = client.householdType ? findLabel(HOUSEHOLD_TYPES, client.householdType) : ''
  return joinParts(
    [gender ? gender.exportLabel : '', age === null ? '' : age + '歳', household],
    '／',
  )
}

// 要介護度と認定期間の残りをまとめる。
function formatInsurance(client) {
  const careLevel = findCareLevel(client.careLevel)
  const remaining = formatRemaining(client.certEndDate)
  if (!careLevel) {
    return remaining
  }
  return remaining ? careLevel.label + '（' + remaining + '）' : careLevel.label
}

// 自立度2つをまとめる。
function formatIndependence(client) {
  const physical = client.physicalIndependence
    ? '障害高齢者 ' + findLabel(PHYSICAL_INDEPENDENCE_LEVELS, client.physicalIndependence)
    : ''
  const cognitive = client.cognitiveIndependence
    ? '認知症高齢者 ' + findLabel(COGNITIVE_INDEPENDENCE_LEVELS, client.cognitiveIndependence)
    : ''
  return joinParts([physical, cognitive], ' ／ ')
}

// AI連携用テキストを組み立てる。
// 中身が空の行は、その行ごと出力しない。
export function buildExportText(client) {
  const unclassified = findUnclassifiedFields(client)
  if (unclassified.length > 0) {
    // 値は出さず、項目名だけを知らせる
    console.error('AI連携の出力可否が未定の項目があります:', unclassified.join(', '))
  }

  const rows = [
    ['利用者ID', client.id],
    ['基本', formatBasic(client)],
    ['介護保険', formatInsurance(client)],
    ['主病名', joinLines(client.mainDiseases, '、')],
    ['現病', joinLines(client.currentDiseases, '、')],
    ['既往', joinLines(client.medicalHistory, '、')],
    ['自立度', formatIndependence(client)],
    ['ADL', formatAssist(ADL_ITEMS, client.adl)],
    ['IADL', formatAssist(IADL_ITEMS, client.iadl)],
    ['利用サービス', formatServices(client.services)],
    ['本人の意向', joinLines(client.personWish, ' ')],
    ['家族の意向', joinLines(client.familyWish, ' ')],
    ['特記', joinLines(client.remarks, ' ')],
  ]

  return rows
    .filter((row) => row[1])
    .map((row) => '【' + row[0] + '】' + row[1])
    .join('\n')
}
