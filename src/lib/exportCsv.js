// 一覧をCSVにする。列は一覧画面と同じ並びにそろえている。

import { findCareLevel } from '../config/careLevels.js'
import { CLIENT_STATUSES, GENDERS, findCaregiverLabel, findLabel } from '../config/options.js'
import { calcAge } from './age.js'
import { formatDate } from './formatDate.js'

const HEADERS = [
  '利用者ID',
  '状態',
  '担当ケアマネ',
  '性別',
  '年齢',
  '要介護度',
  '認定期限',
  '最終更新',
]

// CSVの1マス分に直す。
// 区切りや改行、引用符が入っていると表が崩れるので、その場合は " で囲む。
function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value)
  if (/[",\r\n]/.test(text)) {
    // 中の " は "" と2つ重ねる決まり
    return '"' + text.replace(/"/g, '""') + '"'
  }
  return text
}

// 選択肢の値をラベルにする。未入力は空欄にする（'—' は表計算で邪魔になる）。
function labelOf(options, value) {
  return value ? findLabel(options, value) : ''
}

// 利用者1人分の1行を作る。
function buildRow(client) {
  const careLevel = findCareLevel(client.careLevel)
  const age = calcAge(client.birthDate)
  return [
    client.id,
    labelOf(CLIENT_STATUSES, client.status),
    client.careManager ? findCaregiverLabel(client.careManager) : '',
    labelOf(GENDERS, client.gender),
    // 年齢は「88歳」ではなく数値にする。表計算で並べ替えや集計ができるため。
    age === null ? '' : age,
    careLevel ? careLevel.label : '',
    client.certEndDate,
    client.updatedAt ? formatDate(client.updatedAt) : '',
  ]
}

// 利用者の配列からCSVの文字列を作る。
// 改行は CRLF。Excelがそのまま読める形にそろえる。
export function buildClientsCsv(clients) {
  const lines = [HEADERS, ...clients.map(buildRow)]
  return lines.map((row) => row.map(escapeCell).join(',')).join('\r\n')
}
