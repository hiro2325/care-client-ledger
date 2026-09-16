import { findCareLevel } from '../config/careLevels.js'
import { findGenderLabel } from '../config/options.js'

// 生年月日（'1940-05-03' 形式）から今日時点の年齢を計算する。
// 誕生日が来ていない年は1つ引く。
function calcAge(birthDate) {
  if (!birthDate) {
    return null
  }
  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const isBeforeBirthday =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
  if (isBeforeBirthday) {
    age = age - 1
  }
  return age
}

// 登録済みの利用者を一覧表示する画面。
export default function ClientListPage({ clients, onAddClick }) {
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
              <th>性別</th>
              <th>生年月日</th>
              <th>年齢</th>
              <th>要介護度</th>
              <th>区分支給限度基準額</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const careLevel = findCareLevel(client.careLevel)
              const age = calcAge(client.birthDate)
              return (
                <tr key={client.id}>
                  <td className="client-id">{client.id}</td>
                  <td>{findGenderLabel(client.gender)}</td>
                  <td>{client.birthDate}</td>
                  <td>{age === null ? '—' : age + '歳'}</td>
                  <td>{careLevel ? careLevel.label : '未設定'}</td>
                  <td className="number">
                    {careLevel ? careLevel.limitUnits.toLocaleString() + '単位' : '—'}
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
