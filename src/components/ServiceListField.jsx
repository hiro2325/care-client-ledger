import { createEmptyService } from '../lib/storage.js'

// 利用サービスは「種別・事業所名・頻度」の3つで1組。
// 1人に何件でも登録できるようにするため、行を足したり消したりできる。
export default function ServiceListField({ services, onChange }) {
  // 1行分の1項目を書き換える
  function updateService(index, key, value) {
    const next = services.map((service, i) =>
      i === index ? { ...service, [key]: value } : service,
    )
    onChange(next)
  }

  function addService() {
    onChange([...services, createEmptyService()])
  }

  function removeService(index) {
    onChange(services.filter((service, i) => i !== index))
  }

  return (
    <div className="service-list">
      {services.length === 0 && <p className="note">利用サービスはまだ登録されていません。</p>}

      {services.map((service, index) => (
        <div key={index} className="service-row">
          <label className="field">
            <span className="field-label">種別</span>
            <input
              type="text"
              value={service.serviceType}
              onChange={(event) => updateService(index, 'serviceType', event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">事業所名</span>
            <input
              type="text"
              value={service.officeName}
              onChange={(event) => updateService(index, 'officeName', event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">頻度</span>
            <input
              type="text"
              value={service.frequency}
              onChange={(event) => updateService(index, 'frequency', event.target.value)}
            />
          </label>
          <button type="button" className="secondary" onClick={() => removeService(index)}>
            この行を削除
          </button>
        </div>
      ))}

      <button type="button" className="secondary" onClick={addService}>
        ＋ サービスを追加
      </button>
    </div>
  )
}
