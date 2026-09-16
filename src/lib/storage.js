// localStorage の読み書きはこのファイルに閉じ込める。
// 他のファイルから localStorage を直接触らないこと。

import { ADL_ITEMS, IADL_ITEMS } from '../config/options.js'

const STORAGE_KEY = 'care-client-ledger:clients'

// 新規登録フォームの初期値。台帳が持つ項目の一覧でもある。
// 氏名は持たない（IDと氏名の対応は台帳の外で管理する）。
export function createEmptyClient() {
  // ADL・IADLは項目が多いので、定義から空の入れ物を組み立てる
  const adl = {}
  for (const item of ADL_ITEMS) {
    adl[item.key] = ''
  }
  const iadl = {}
  for (const item of IADL_ITEMS) {
    iadl[item.key] = ''
  }

  return {
    id: '',
    // 識別
    careManager: '',
    status: 'active',
    // 基本
    gender: '',
    birthDate: '',
    householdType: '',
    // 介護保険
    careLevel: '',
    certStartDate: '',
    certEndDate: '',
    insurer: '',
    // 医療
    mainDiseases: '',
    currentDiseases: '',
    medicalHistory: '',
    familyDoctor: '',
    // 生活機能
    physicalIndependence: '',
    cognitiveIndependence: '',
    adl,
    iadl,
    // 支援
    services: [],
    personWish: '',
    familyWish: '',
    remarks: '',
    // 管理
    monitoringDate: '',
    updatedAt: '',
  }
}

// 利用サービス1件分の空の入れ物。
export function createEmptyService() {
  return { serviceType: '', officeName: '', frequency: '' }
}

// 保存されている利用者の一覧を取り出す。
// 未保存のときや、中身が壊れているときは空配列を返す。
export function loadClients() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    // 項目を増やす前に保存したデータでも画面が壊れないよう、初期値で埋める
    return parsed.map((client) => ({ ...createEmptyClient(), ...client }))
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

// 利用者を1件保存して、保存後の一覧を返す。
// id が空なら新規登録として採番し、入っていれば上書き更新する。
export function saveClient(input) {
  const clients = loadClients()
  const saved = {
    ...input,
    updatedAt: new Date().toISOString(),
  }

  let nextClients
  if (!saved.id) {
    saved.id = createNextClientId(clients)
    nextClients = [...clients, saved]
  } else {
    nextClients = clients.map((client) => (client.id === saved.id ? saved : client))
  }

  saveClients(nextClients)
  return nextClients
}
