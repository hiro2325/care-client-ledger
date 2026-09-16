// 要介護認定の有効期間にまつわる計算。一覧の強調表示で使う。

// 更新申請は有効期間満了日の2か月前から可能で、それが最大62日前にあたる。
// 60日にすると申請できる期間の頭を取りこぼすため、62日で見る。
export const RENEWAL_ALERT_DAYS = 62

// 今日から期限日までの残り日数を返す。過ぎていれば負の数。未入力なら null。
// 時刻の差で1日ずれないよう、どちらも午前0時に揃えてから引く。
export function countDaysUntil(dateString) {
  if (!dateString) {
    return null
  }
  const target = new Date(dateString)
  if (Number.isNaN(target.getTime())) {
    return null
  }
  target.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((target.getTime() - today.getTime()) / oneDay)
}

// 一覧の行をどう色分けするかを決める。
// 戻り値の kind は 'none'（色分けしない）／'normal'／'soon'（期限が近い）／'expired'（期限切れ）。
//
// 状態が「終了」の利用者は支援が終わっているため、色分けの対象から外す。
export function getCertificationStatus(certEndDate, status) {
  const days = countDaysUntil(certEndDate)

  if (status === 'closed' || days === null) {
    return { kind: 'none', days }
  }
  if (days < 0) {
    return { kind: 'expired', days }
  }
  if (days <= RENEWAL_ALERT_DAYS) {
    return { kind: 'soon', days }
  }
  return { kind: 'normal', days }
}

// 期限のとなりに出す注意書き。色分けしない行では空文字を返す。
export function formatCertificationNote(certStatus) {
  if (certStatus.kind === 'soon') {
    return '残り' + certStatus.days + '日'
  }
  if (certStatus.kind === 'expired') {
    return '期限切れ（' + Math.abs(certStatus.days) + '日経過）'
  }
  return ''
}
