// 生年月日から年齢を計算する。一覧でも詳細でも使うので独立させている。

// '1940-05-03' のような文字列から、今日時点の年齢を返す。
// 誕生日がまだ来ていない年は1つ引く。未入力なら null を返す。
export function calcAge(birthDate) {
  if (!birthDate) {
    return null
  }
  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const isBeforeBirthday =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
  if (isBeforeBirthday) {
    age = age - 1
  }
  return age
}

// 画面に出すための文字列にする。未入力なら '—'。
export function formatAge(birthDate) {
  const age = calcAge(birthDate)
  return age === null ? '—' : age + '歳'
}
