import { findCareLevel, formatLimitUnits } from '../config/careLevels.js'
import { CLIENT_STATUSES, GENDERS, HOUSEHOLD_TYPES, findLabel } from '../config/options.js'
import { formatAge } from '../lib/age.js'

// 登録済みの利用者を一覧表示する画面。
// 行の「編集」を押すと、その利用者の詳細編集画面へ移る。
export default function ClientListPage({ clients, onAddClick, onEditClick }) {
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
      <h2>利用者一覧（{clients.length}件）</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>利用者ID</th>
              <th>状態</th>
              <th>担当ケアマネ</th>
              <th>性別</th>
              <th>生年月日</th>
              <th>年齢</th>
              <th>世帯構成</th>
              <th>要介護度</th>
              <th>認定期間</th>
              <th>区分支給限度基準額</th>
              <th>サービス</th>
              <th>モニタリング</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const careLevel = findCareLevel(client.careLevel)
              return (
                <tr key={client.id}>
                  <td className="client-id">{client.id}</td>
                  <td>{findLabel(CLIENT_STATUSES, client.status)}</td>
                  <td>{client.careManager || '—'}</td>
                  <td>{findLabel(GENDERS, client.gender)}</td>
                  <td>{client.birthDate || '—'}</td>
                  <td>{formatAge(client.birthDate)}</td>
                  <td>{findLabel(HOUSEHOLD_TYPES, client.householdType)}</td>
                  <td>{careLevel ? careLevel.label : '—'}</td>
                  <td>
                    {client.certStartDate || '—'} 〜 {client.certEndDate || '—'}
                  </td>
                  <td className="number">{formatLimitUnits(client.careLevel)}</td>
                  <td className="number">{client.services.length}件</td>
                  <td>{client.monitoringDate || '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onEditClick(client.id)}
                    >
                      編集
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
