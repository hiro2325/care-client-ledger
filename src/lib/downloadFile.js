// ファイルを1つダウンロードさせる共通の処理。
// 外部ライブラリは使わず、一時的なリンクを作って押させる。

// text の中身を filename で保存する。
// mimeType は 'text/csv' のように中身に合わせて渡す。
export function downloadText(filename, text, mimeType) {
  // Excelが日本語を正しく読めるよう、CSVの先頭にはBOMを付ける
  const needsBom = mimeType.startsWith('text/csv')
  const parts = needsBom ? ['\uFEFF', text] : [text]
  const blob = new Blob(parts, { type: mimeType + ';charset=utf-8' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ファイル名に入れる日付。'2026-10-01' の形。
export function todayStamp(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return date.getFullYear() + '-' + month + '-' + day
}
