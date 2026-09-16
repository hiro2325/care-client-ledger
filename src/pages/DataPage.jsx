import { useRef, useState } from 'react'
import { buildBackupFileName } from '../lib/backup.js'
import { buildBackup, clearAllClients, restoreFromBackup } from '../lib/storage.js'

// 書き出し・読み込み・消去をまとめた画面。
// localStorage には触らず、storage.js の関数だけを呼ぶ。
export default function DataPage({ clients, onReplaced }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  // 消去は2段階。1回目の押下で確認を出し、2回目で実行する。
  const [askingClear, setAskingClear] = useState(false)
  const fileInputRef = useRef(null)

  // JSONファイルとして書き出す
  function handleExport() {
    const backup = buildBackup()
    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json' })

    // 一時的なリンクを作って押させる。押し終わったら片づける。
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = buildBackupFileName()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setError('')
    setMessage(backup.clients.length + '件を ' + link.download + ' に書き出しました。')
  }

  // 選ばれたJSONファイルを読み込んで復元する
  async function handleImport(event) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    const text = await file.text()
    const result = restoreFromBackup(text)

    // 同じファイルを続けて選べるように入力欄を空に戻す
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (!result.ok) {
      setMessage('')
      setError(result.error)
      return
    }
    setError('')
    setMessage(result.clients.length + '件を読み込みました。今までのデータは置き換わりました。')
    onReplaced(result.clients)
  }

  function handleClear() {
    const emptied = clearAllClients()
    setAskingClear(false)
    setError('')
    setMessage('すべてのデータを消去しました。')
    onReplaced(emptied)
  }

  return (
    <div className="card">
      <h2>データ管理</h2>

      <p className="warning-box">
        データはこのブラウザにのみ保存されます。ブラウザの設定を変えたり、別のパソコンで開いたりすると
        見られなくなります。<strong>定期的にJSONを書き出して保管してください。</strong>
      </p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <fieldset>
        <legend>書き出し</legend>
        <p className="note">
          現在の{clients.length}件をJSONファイルとして保存します。ファイル名には日付が入ります。
        </p>
        <button type="button" className="primary" onClick={handleExport}>
          JSONファイルに書き出す
        </button>
      </fieldset>

      <fieldset>
        <legend>読み込み</legend>
        <p className="note">
          書き出したJSONファイルから復元します。
          <strong>今の{clients.length}件はすべて置き換わります。</strong>
          読み込む前に、念のため書き出しておくことをおすすめします。
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
        />
      </fieldset>

      <fieldset>
        <legend>消去</legend>
        <p className="note">
          このブラウザに保存されている台帳データをすべて消します。元に戻せません。
        </p>

        {askingClear ? (
          <div className="confirm-box">
            <p className="error">
              本当に{clients.length}件すべてを消去しますか？ この操作は元に戻せません。
            </p>
            <div className="form-actions">
              <button type="button" className="danger" onClick={handleClear}>
                消去する
              </button>
              <button type="button" className="secondary" onClick={() => setAskingClear(false)}>
                やめる
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="secondary"
            disabled={clients.length === 0}
            onClick={() => setAskingClear(true)}
          >
            全データを消去する
          </button>
        )}
      </fieldset>
    </div>
  )
}
