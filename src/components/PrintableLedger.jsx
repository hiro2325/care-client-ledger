import { findCareLevel, formatLimitUnits } from '../config/careLevels.js'
import {
  ADL_ITEMS,
  ASSIST_LEVELS,
  CLIENT_STATUSES,
  COGNITIVE_INDEPENDENCE_LEVELS,
  GENDERS,
  HOUSEHOLD_TYPES,
  IADL_ITEMS,
  PHYSICAL_INDEPENDENCE_LEVELS,
  findCaregiverLabel,
  findLabel,
} from '../config/options.js'
import { formatAge } from '../lib/age.js'
import { formatDate } from '../lib/formatDate.js'

// 紙に印刷する利用者台帳。画面には出さず、印刷のときだけ現れる。
//
// AI連携エクスポートとは別物で、保険者・かかりつけ医・事業所名も印刷する。
// 渡す相手がAIではなく事業所内の職員だからである。
// 氏名はデータとして持たないため、手書きで書き込む欄を見出しに置いている。

// 値が空のときは枠だけ残す。手書きで書き足せるようにするため。
function Row({ label, value, wide }) {
  return (
    <div className={wide ? 'p-row p-row-wide' : 'p-row'}>
      <span className="p-label">{label}</span>
      <span className="p-value">{value || ''}</span>
    </div>
  )
}

// 選択肢の値を表示用のラベルにする。未入力なら空文字（'—' は紙では邪魔になる）。
function labelOf(options, value) {
  return value ? findLabel(options, value) : ''
}

// 複数行の入力はそのままの改行で見せる。
function MultiRow({ label, value, lines }) {
  return (
    <div className="p-row p-row-wide">
      <span className="p-label">{label}</span>
      <span className="p-value p-multi" style={{ minHeight: lines + 'em' }}>
        {value || ''}
      </span>
    </div>
  )
}

// ADL・IADLは横に並べて場所を節約する。
function AssistTable({ title, items, values }) {
  return (
    <table className="p-assist">
      <thead>
        <tr>
          <th>{title}</th>
          {items.map((item) => (
            <th key={item.key}>{item.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-assist-head">介助段階</td>
          {items.map((item) => (
            <td key={item.key}>{labelOf(ASSIST_LEVELS, values ? values[item.key] : '')}</td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

// 利用サービス。登録が少ないときも手書き用の空行を足す。
function ServiceTable({ services }) {
  const blankCount = Math.max(0, 3 - services.length)
  const blanks = Array.from({ length: blankCount }, (item, index) => index)

  return (
    <table className="p-services">
      <thead>
        <tr>
          <th>種別</th>
          <th>事業所名</th>
          <th>頻度</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service, index) => (
          <tr key={'s' + index}>
            <td>{service.serviceType}</td>
            <td>{service.officeName}</td>
            <td>{service.frequency}</td>
          </tr>
        ))}
        {blanks.map((index) => (
          <tr key={'b' + index}>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function PrintableLedger({ client }) {
  const careLevel = findCareLevel(client.careLevel)
  const printedOn = formatDate(new Date().toISOString())

  return (
    <div className="print-sheet">
      <header className="p-head">
        <div className="p-head-left">
          <div className="p-head-title">介護利用者台帳</div>
          <div className="p-head-id">{client.id}</div>
        </div>
        {/* 氏名はデータとして持たないため、手元の対応表を見ながら手で書き込む */}
        <div className="p-head-name">
          氏名（<span className="p-name-blank"></span>）
        </div>
        <div className="p-head-date">印刷日 {printedOn}</div>
      </header>

      <section className="p-section">
        <h2>識別</h2>
        <div className="p-grid">
          <Row label="利用者ID" value={client.id} />
          <Row label="担当ケアマネ" value={client.careManager ? findCaregiverLabel(client.careManager) : ''} />
          <Row label="状態" value={labelOf(CLIENT_STATUSES, client.status)} wide />
        </div>
      </section>

      <section className="p-section">
        <h2>基本</h2>
        <div className="p-grid">
          <Row label="性別" value={labelOf(GENDERS, client.gender)} />
          <Row label="生年月日" value={client.birthDate} />
          <Row label="年齢" value={client.birthDate ? formatAge(client.birthDate) : ''} />
          <Row label="世帯構成" value={labelOf(HOUSEHOLD_TYPES, client.householdType)} />
        </div>
      </section>

      <section className="p-section">
        <h2>介護保険</h2>
        <div className="p-grid">
          <Row label="要介護度" value={careLevel ? careLevel.label : ''} />
          <Row label="保険者" value={client.insurer} />
          <Row
            label="認定期間"
            value={
              client.certStartDate || client.certEndDate
                ? (client.certStartDate || '') + ' 〜 ' + (client.certEndDate || '')
                : ''
            }
          />
          <Row
            label="区分支給限度"
            value={client.careLevel ? formatLimitUnits(client.careLevel) : ''}
          />
        </div>
      </section>

      <section className="p-section">
        <h2>医療</h2>
        <MultiRow label="主病名" value={client.mainDiseases} lines={2} />
        <MultiRow label="現病" value={client.currentDiseases} lines={2} />
        <MultiRow label="既往歴" value={client.medicalHistory} lines={2} />
        <Row label="かかりつけ医" value={client.familyDoctor} wide />
      </section>

      <section className="p-section">
        <h2>生活機能</h2>
        <div className="p-grid">
          <Row
            label="障害高齢者自立度"
            value={labelOf(PHYSICAL_INDEPENDENCE_LEVELS, client.physicalIndependence)}
          />
          <Row
            label="認知症高齢者自立度"
            value={labelOf(COGNITIVE_INDEPENDENCE_LEVELS, client.cognitiveIndependence)}
          />
        </div>
        <AssistTable title="ADL" items={ADL_ITEMS} values={client.adl} />
        <AssistTable title="IADL" items={IADL_ITEMS} values={client.iadl} />
      </section>

      <section className="p-section">
        <h2>支援</h2>
        <ServiceTable services={client.services} />
        <MultiRow label="本人の意向" value={client.personWish} lines={2} />
        <MultiRow label="家族の意向" value={client.familyWish} lines={2} />
        <MultiRow label="特記事項" value={client.remarks} lines={3} />
      </section>

      <section className="p-section">
        <h2>管理</h2>
        <div className="p-grid">
          <Row label="モニタリング実施日" value={client.monitoringDate} />
          <Row label="最終更新" value={client.updatedAt ? formatDate(client.updatedAt) : ''} />
        </div>
      </section>
    </div>
  )
}
