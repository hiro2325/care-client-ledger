import { useEffect, useState } from 'react'
import ClientListPage from './pages/ClientListPage.jsx'
import ClientFormPage from './pages/ClientFormPage.jsx'
import { loadClients } from './lib/storage.js'

// 画面の切り替えは、今は2つだけなので state で持つ。
// 画面が増えたらルーティングの導入を検討する。
export default function App() {
  const [page, setPage] = useState('list')
  const [clients, setClients] = useState([])
  // 編集中の利用者ID。空文字なら新規登録。
  const [editingId, setEditingId] = useState('')

  // 起動時に localStorage から読み込む
  useEffect(() => {
    setClients(loadClients())
  }, [])

  // 保存が終わったら一覧を新しくして、一覧画面へ戻る
  function handleSaved(nextClients) {
    setClients(nextClients)
    setEditingId('')
    setPage('list')
  }

  function openNewForm() {
    setEditingId('')
    setPage('form')
  }

  function openEditForm(id) {
    setEditingId(id)
    setPage('form')
  }

  // 編集中の利用者を一覧から探す。新規登録のときは null になる。
  const editingClient = clients.find((client) => client.id === editingId) || null

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
            onClick={openNewForm}
          >
            新規登録
          </button>
        </nav>
      </header>

      <main>
        {page === 'list' ? (
          <ClientListPage
            clients={clients}
            onAddClick={openNewForm}
            onEditClick={openEditForm}
          />
        ) : (
          <ClientFormPage
            // 編集対象が変わったらフォームを作り直す
            key={editingId || 'new'}
            client={editingClient}
            onSaved={handleSaved}
            onCancel={() => setPage('list')}
          />
        )}
      </main>

      <footer className="app-footer">
        データはこのブラウザの中だけに保存されます（外部へ送信しません）。
      </footer>
    </div>
  )
}
