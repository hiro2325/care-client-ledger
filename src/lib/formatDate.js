// 日時の表示を整えるための小さな関数。

// 保存されている日時（ISO形式）を 'YYYY-MM-DD' にする。
// 桁をそろえて並べたいので、地域ごとの書式ではなく固定の形にしている。
export function formatDate(isoString) {
  if (!isoString) {
    return '—'
  }
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}
