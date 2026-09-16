// 画面で使う選択肢の定義をまとめる。
// ADL段階・自立度・世帯構成などを追加するときもこのファイルに足す。

// 介護保険の帳票が男女の2区分で運用されているため、それに合わせる。
export const GENDERS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

// 保存されている値から表示用ラベルを引く。
export function findGenderLabel(value) {
  const gender = GENDERS.find((item) => item.value === value)
  return gender ? gender.label : '未設定'
}
