import { findCareLevel } from '../config/careLevels.js'
import { CLIENT_STATUSES, GENDERS, findCaregiverLabel, findLabel } from '../config/options.js'
import { formatAge } from '../lib/age.js'
import { formatDate } from '../lib/formatDate.js'
import { formatCertificationNote, getCertificationStatus } from '../lib/certification.js'

// 「男・88歳」のように性別と年齢を1列にまとめる。
// どちらも未入力なら '—'。
function formatGenderAndAge(client) {
  const gender = findLabel(GENDERS, client.gender)
  const age = formatAge(client.birthDate)
  if (gender === '—' && age === '—') {
    return '—'
  }
  return gender + '・' + age
}

// 登録済みの利用者を一覧表示する画面。
// 一覧は絞り込むための画面と位置づけ、詳しい内容は編集画面で見る。
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
      <p className="note">
        行をクリックすると編集画面へ移動します。認定期限が残り62日以内の行と、
        期限を過ぎている行は色を変えています（状態が「終了」の行は色分けしません）。
      </p>

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
            {clients.map((client) => {
              const careLevel = findCareLevel(client.careLevel)
              const certStatus = getCertificationStatus(client.certEndDate, client.status)
              const note = formatCertificationNote(certStatus)

              return (
                <tr
                  key={client.id}
                  className={'client-row row-' + certStatus.kind}
                  onClick={() => onEditClick(client.id)}
                  // キーボードでも開けるようにする
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onEditClick(client.id)
                    }
                  }}
                >
                  <td className="figure">{client.id}</td>
                  <td>{findLabel(CLIENT_STATUSES, client.status)}</td>
                  <td>{findCaregiverLabel(client.careManager)}</td>
                  <td className="figure">{formatGenderAndAge(client)}</td>
                  <td>{careLevel ? careLevel.label : '—'}</td>
                  <td className="figure">
                    {client.certEndDate || '—'}
                    {note && <span className="cert-note">{note}</span>}
                  </td>
                  <td className="figure">{formatDate(client.updatedAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary"
                      // 行のクリックと二重に動かないよう、ここで止める
                      onClick={(event) => {
                        event.stopPropagation()
                        onEditClick(client.id)
                      }}
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
