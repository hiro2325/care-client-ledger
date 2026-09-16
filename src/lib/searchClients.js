// 一覧の検索・絞り込み・並べ替えの計算をまとめる。
// 画面の部品からは分けてあるので、動きを確かめやすい。

import { countDaysUntil } from './certification.js'

// 並べ替えの選択肢
export const SORT_OPTIONS = [
  { value: 'id', label: '利用者ID順' },
  { value: 'certEnd', label: '認定期限が近い順' },
]

// 1人分の「検索の対象になる文字」をひとつなぎにする。
//
// 件数が増えても速くするため、この文字列は検索のたびに作り直さず、
// 利用者一覧が変わったときだけ作り直して使い回す（ClientListPage の useMemo）。
export function buildSearchText(client) {
  const parts = [
    client.mainDiseases,
    client.currentDiseases,
    client.medicalHistory,
    client.remarks,
  ]

  // 利用サービスは種別・事業所名・頻度のどれでも引っかかるようにする
  for (const service of client.services) {
    parts.push(service.serviceType, service.officeName, service.frequency)
  }

  return parts.filter(Boolean).join('\n').toLowerCase()
}

// 利用者一覧に検索用の文字列を添えた形にする。
export function buildSearchIndex(clients) {
  return clients.map((client) => ({ client, searchText: buildSearchText(client) }))
}

// 絞り込みの初期値。すべて空＝絞り込みなし。
export function createEmptyFilters() {
  return { keyword: '', careLevel: '', status: '', careManager: '', sortBy: 'id' }
}

// 絞り込みを順に適用する。要介護度・状態・担当ケアマネは同時に指定できる。
function matches(entry, filters, keyword) {
  const client = entry.client

  if (filters.careLevel && client.careLevel !== filters.careLevel) {
    return false
  }
  if (filters.status && client.status !== filters.status) {
    return false
  }
  if (filters.careManager && client.careManager !== filters.careManager) {
    return false
  }
  if (keyword && !entry.searchText.includes(keyword)) {
    return false
  }
  return true
}

// 認定期限が近い順に並べるための数値を返す。
// 期限が未入力の人は末尾に回したいので、とても大きい数を返す。
function certEndOrder(client) {
  const days = countDaysUntil(client.certEndDate)
  return days === null ? Number.MAX_SAFE_INTEGER : days
}

// 認定期限が近い順に並べる。
//
// 比較の中で日付を計算すると、並べ替え1回につき何千回も日付を作ることになる。
// 先に1人1回だけ数値を出しておき、その数値だけで比べる。
function sortByCertEnd(clients) {
  const withOrder = clients.map((client) => ({ client, order: certEndOrder(client) }))
  withOrder.sort((a, b) => a.order - b.order)
  return withOrder.map((item) => item.client)
}

// 絞り込みと並べ替えをまとめて行い、表示する利用者の配列を返す。
export function filterAndSortClients(searchIndex, filters) {
  const keyword = filters.keyword.trim().toLowerCase()

  const found = []
  for (const entry of searchIndex) {
    if (matches(entry, filters, keyword)) {
      found.push(entry.client)
    }
  }

  if (filters.sortBy === 'certEnd') {
    // 期限切れが先、次に期限が近い人。未入力は末尾。
    return sortByCertEnd(found)
  }

  // 利用者IDは桁数がそろっているので、文字として比べれば採番順になる
  found.sort((a, b) => a.id.localeCompare(b.id))
  return found
}
