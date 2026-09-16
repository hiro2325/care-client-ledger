// 書き出し・読み込みのうち、localStorage に触れない部分をまとめる。
// 保存そのものは storage.js が行う（localStorage を触るのはあの1ファイルだけ）。

import { createEmptyClient, createNextClientId } from './storage.js'

// 書き出すファイルの形。あとで形を変えたときに見分けられるよう版を持たせる。
export const BACKUP_VERSION = 1

// 書き出すファイル名。いつの控えか分かるよう日付を入れる。
export function buildBackupFileName(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return 'care-client-ledger-' + year + '-' + month + '-' + day + '.json'
}

// 読み込んだ中身から利用者の配列を取り出す。
// 書き出したファイル（{ version, clients }）と、配列だけのファイルの両方を受け付ける。
function pickClients(parsed) {
  if (Array.isArray(parsed)) {
    return parsed
  }
  if (parsed && Array.isArray(parsed.clients)) {
    return parsed.clients
  }
  return null
}

// JSONの文字列を、保存できる形の利用者一覧に直す。
// 成功なら { ok: true, clients }、失敗なら { ok: false, error } を返す。
// 利用者データそのものはエラー文言に載せない。
export function parseBackup(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSONとして読み取れませんでした。ファイルを確認してください。' }
  }

  const rawClients = pickClients(parsed)
  if (!rawClients) {
    return { ok: false, error: 'このファイルには利用者のデータが見当たりません。' }
  }

  // 項目の不足は初期値で埋める。利用者IDが無いものはここで採番し直す。
  const clients = []
  for (const raw of rawClients) {
    if (!raw || typeof raw !== 'object') {
      continue
    }
    const client = { ...createEmptyClient(), ...raw }
    if (!client.id) {
      client.id = createNextClientId(clients)
    }
    clients.push(client)
  }

  return { ok: true, clients }
}
