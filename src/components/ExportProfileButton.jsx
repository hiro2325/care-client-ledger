import { useState } from 'react'
import { buildExportText } from '../lib/exportProfile.js'
import { downloadText, todayStamp } from '../lib/downloadFile.js'

// AI連携用テキストを組み立ててクリップボードにコピーするボタン。
// 何を渡すことになるのか目で確かめられるよう、本文も開いて見られるようにしている。
export default function ExportProfileButton({ client }) {
  const [message, setMessage] = useState('')

  const text = buildExportText(client)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('コピーしました。')
    } catch {
      // ブラウザの設定でコピーが許可されていない場合など。利用者データは出力しない。
      setMessage('コピーできませんでした。下の本文を選んでコピーしてください。')
    }
  }

  // コピーと同じ中身をテキストファイルとして保存する
  function handleDownload() {
    downloadText(client.id + '-AI用-' + todayStamp() + '.txt', text, 'text/plain')
    setMessage('テキストファイルを保存しました。')
  }

  return (
    <div className="export-box">
      <div className="export-actions">
        <button type="button" className="secondary" onClick={handleCopy}>
          AI用テキストをコピー
        </button>
        <button type="button" className="secondary" onClick={handleDownload}>
          テキストで保存
        </button>
        {message && <span className="export-message">{message}</span>}
      </div>

      <p className="note">
        氏名・生年月日・認定期間の日付・保険者・かかりつけ医・事業所名は含めません。
        年齢と認定期間の残りは概数に変換しています。
      </p>

      <details>
        <summary>コピーされる本文を確認する</summary>
        <pre className="export-preview">{text}</pre>
      </details>
    </div>
  )
}
