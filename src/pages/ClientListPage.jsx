import { useEffect, useMemo, useState } from 'react'
import ClientFilters from '../components/ClientFilters.jsx'
import ClientRow from '../components/ClientRow.jsx'
import {
  buildSearchIndex,
  createEmptyFilters,
  filterAndSortClients,
} from '../lib/searchClients.js'

// 一度に表示する行数。1000件を一気に描くと重くなるため区切って出す。
const ROWS_PER_PAGE = 100

// 登録済みの利用者を一覧表示する画面。
// 一覧は絞り込むための画面と位置づけ、詳しい内容は編集画面で見る。
export default function ClientListPage({ clients, onAddClick, onEditClick }) {
  const [filters, setFilters] = useState(createEmptyFilters)
  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE)

  // キーワードは打つたびに絞り込むと重くなるので、入力が止まってから反映する
  const [appliedKeyword, setAppliedKeyword] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setAppliedKeyword(filters.keyword), 200)
    return () => clearTimeout(timer)
  }, [filters.keyword])

  const { careLevel, status, careManager, sortBy } = filters

  // 検索用の文字列は利用者一覧が変わったときだけ作り直し、絞り込みのたびには作らない
  const searchIndex = useMemo(() => buildSearchIndex(clients), [clients])

  // 条件が変わったときだけ絞り込みと並べ替えをやり直す
  const foundClients = useMemo(
    () =>
      filterAndSortClients(searchIndex, {
        keyword: appliedKeyword,
        careLevel,
        status,
        careManager,
        sortBy,
      }),
    [searchIndex, appliedKeyword, careLevel, status, careManager, sortBy],
  )

  // 条件を変えたら先頭から見直す
  useEffect(() => {
    setVisibleCount(ROWS_PER_PAGE)
  }, [appliedKeyword, careLevel, status, careManager, sortBy])

  const shownClients = foundClients.slice(0, visibleCount)

  if (clients.length === 0) {
    return (
      <div className="card">
        <h2>利用者一覧</h2>
        <p className="note">まだ登録がありません。</p>
        <button type="button" className="primary" onClick={onAddClick}>
          最初の利用者を登録する
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>利用者一覧</h2>

      <ClientFilters
        clients={clients}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(createEmptyFilters())}
      />

      <p className="result-count">
        全{clients.length}件中 <strong>{foundClients.length}件</strong> が該当
        {foundClients.length > shownClients.length && (
          <span>（先頭{shownClients.length}件を表示）</span>
        )}
      </p>

      {foundClients.length === 0 ? (
        <p className="note">条件に合う利用者がいません。条件を変えるか、クリアしてください。</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>利用者ID</th>
                <th>状態</th>
                <th>担当ケアマネ</th>
                <th>性別・年齢</th>
                <th>要介護度</th>
                <th>認定期限</th>
                <th>最終更新</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {shownClients.map((client) => (
                <ClientRow key={client.id} client={client} onEditClick={onEditClick} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {foundClients.length > shownClients.length && (
        <button
          type="button"
          className="secondary"
          onClick={() => setVisibleCount(visibleCount + ROWS_PER_PAGE)}
        >
          さらに{ROWS_PER_PAGE}件を表示
        </button>
      )}
    </div>
  )
}
