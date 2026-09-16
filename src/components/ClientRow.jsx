import { findCareLevel } from '../config/careLevels.js'
import { CLIENT_STATUSES, GENDERS, findCaregiverLabel, findLabel } from '../config/options.js'
import { formatAge } from '../lib/age.js'
import { formatDate } from '../lib/formatDate.js'
import { formatCertificationNote, getCertificationStatus } from '../lib/certification.js'

// 「男・88歳」のように性別と年齢を1列にまとめる。どちらも未入力なら '—'。
function formatGenderAndAge(client) {
  const gender = findLabel(GENDERS, client.gender)
  const age = formatAge(client.birthDate)
  if (gender === '—' && age === '—') {
    return '—'
  }
  return gender + '・' + age
}

// 一覧の1行。行全体を押すと編集画面へ移る。
export default function ClientRow({ client, onEditClick }) {
  const careLevel = findCareLevel(client.careLevel)
  const certStatus = getCertificationStatus(client.certEndDate, client.status)
  const note = formatCertificationNote(certStatus)

  return (
    <tr
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
}
