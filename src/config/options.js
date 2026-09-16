// 画面で使う選択肢の定義をまとめる。
// 選択肢を増やしたり文言を直したりするときは、このファイルだけを触る。

// 状態（利用中／休止／終了）
export const CLIENT_STATUSES = [
  { value: 'active', label: '利用中' },
  { value: 'paused', label: '休止' },
  { value: 'closed', label: '終了' },
]

// 性別。介護保険の帳票が男女の2区分で運用されているため、それに合わせる。
export const GENDERS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

// 世帯構成
export const HOUSEHOLD_TYPES = [
  { value: 'alone', label: '独居' },
  { value: 'couple', label: '夫婦のみ' },
  { value: 'with_child', label: '子と同居' },
  { value: 'other', label: 'その他' },
]

// 障害高齢者の日常生活自立度（寝たきり度）
export const PHYSICAL_INDEPENDENCE_LEVELS = [
  { value: 'independent', label: '自立' },
  { value: 'J1', label: 'J1' },
  { value: 'J2', label: 'J2' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
]

// 認知症高齢者の日常生活自立度
export const COGNITIVE_INDEPENDENCE_LEVELS = [
  { value: 'independent', label: '自立' },
  { value: 'I', label: 'Ⅰ' },
  { value: 'IIa', label: 'Ⅱa' },
  { value: 'IIb', label: 'Ⅱb' },
  { value: 'IIIa', label: 'Ⅲa' },
  { value: 'IIIb', label: 'Ⅲb' },
  { value: 'IV', label: 'Ⅳ' },
  { value: 'M', label: 'M' },
]

// 介助段階。ADL・IADLのどちらの項目でも同じ4段階を使う。
export const ASSIST_LEVELS = [
  { value: 'independent', label: '自立' },
  { value: 'watch', label: '見守り' },
  { value: 'partial', label: '一部介助' },
  { value: 'full', label: '全介助' },
]

// ADL（日常生活動作）の6項目
export const ADL_ITEMS = [
  { key: 'move', label: '移動' },
  { key: 'transfer', label: '移乗' },
  { key: 'toilet', label: '排泄' },
  { key: 'bath', label: '入浴' },
  { key: 'meal', label: '食事' },
  { key: 'dress', label: '更衣' },
]

// IADL（手段的日常生活動作）の4項目
export const IADL_ITEMS = [
  { key: 'cooking', label: '調理' },
  { key: 'shopping', label: '買物' },
  { key: 'medication', label: '服薬' },
  { key: 'money', label: '金銭管理' },
]

// 保存されている値（例: 'male'）から表示用のラベル（例: '男'）を探す共通の関数。
// 見つからないときは未入力として扱う。
export function findLabel(options, value) {
  const found = options.find((item) => item.value === value)
  return found ? found.label : '—'
}
