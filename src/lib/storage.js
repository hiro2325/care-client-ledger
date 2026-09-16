// localStorage の読み書きはこのファイルに閉じ込める。
// 他のファイルから localStorage を直接触らないこと。

const STORAGE_KEY = 'care-client-ledger:clients'

// 保存されている利用者の一覧を取り出す。
// 未保存のときや、中身が壊れているときは空配列を返す。
export function loadClients() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    // 配列以外が入っていた場合は信用せず空にする
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // 壊れたデータやプライベートモードでの失敗。利用者データは出力しない。
    console.error('台帳データの読み込みに失敗しました')
    return []
  }
}

// 利用者の一覧をまるごと保存する。成功したら true を返す。
export function saveClients(clients) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
    return true
  } catch {
    console.error('台帳データの保存に失敗しました')
    return false
  }
}

// 次の利用者IDを U0001 形式で作る。
// 既存のIDのうち一番大きい番号に1を足すので、削除しても番号は使い回さない。
export function createNextClientId(clients) {
  let maxNumber = 0
  for (const client of clients) {
    // 'U0007' の数字部分だけを取り出す
    const number = Number(String(client.id).replace('U', ''))
    if (Number.isInteger(number) && number > maxNumber) {
      maxNumber = number
    }
  }
  const nextNumber = maxNumber + 1
  return 'U' + String(nextNumber).padStart(4, '0')
}

// 利用者を1件追加して、保存後の一覧を返す。
// id と createdAt はここで付けるので、呼び出し側は入力値だけ渡せばよい。
export function addClient(input) {
  const clients = loadClients()
  const newClient = {
    id: createNextClientId(clients),
    gender: input.gender,
    birthDate: input.birthDate,
    careLevel: input.careLevel,
    createdAt: new Date().toISOString(),
  }
  const nextClients = [...clients, newClient]
  saveClients(nextClients)
  return nextClients
}
