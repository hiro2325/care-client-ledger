import { useEffect, useState } from 'react'
import ClientListPage from './pages/ClientListPage.jsx'
import ClientFormPage from './pages/ClientFormPage.jsx'
import { loadClients } from './lib/storage.js'

// 画面の切り替えは、今は2つだけなので state で持つ。
// 画面が増えたらルーティングの導入を検討する。
export default function App() {
  const [page, setPage] = useState('list')
  const [clients, setClients] = useState([])

  // 起動時に localStorage から読み込む
  useEffect(() => {
    setClients(loadClients())
  }, [])

  // 登録が終わったら一覧を新しくして、一覧画面へ戻る
  function handleSaved(nextClients) {
    setClients(nextClients)
    setPage('list')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>介護利用者台帳</h1>
        <nav>
          <button
            type="button"
            className={page === 'list' ? 'tab active' : 'tab'}
            onClick={() => setPage('list')}
          >
            一覧
          </button>
          <button
            type="button"
            className={page === 'form' ? 'tab active' : 'tab'}
            onClick={() => setPage('form')}
          >
            新規登録
          </button>
        </nav>
      </header>

      <main>
        {page === 'list' ? (
          <ClientListPage clients={clients} onAddClick={() => setPage('form')} />
        ) : (
          <ClientFormPage onSaved={handleSaved} />
        )}
      </main>

      <footer className="app-footer">
        データはこのブラウザの中だけに保存されます（外部へ送信しません）。
      </footer>
    </div>
  )
}
