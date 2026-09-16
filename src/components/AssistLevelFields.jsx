import { ASSIST_LEVELS } from '../config/options.js'

// ADL・IADLのように「項目ごとに介助段階を選ぶ」まとまりを表示する。
// items には { key, label } の配列、values には { 項目key: 選択値 } を渡す。
export default function AssistLevelFields({ title, items, values, onChange }) {
  return (
    <div className="assist-group">
      <h4 className="assist-title">{title}</h4>
      <div className="assist-grid">
        {items.map((item) => (
          <label key={item.key} className="field">
            <span className="field-label">{item.label}</span>
            <select
              value={values[item.key] || ''}
              onChange={(event) => onChange(item.key, event.target.value)}
            >
              <option value="">選択してください</option>
              {ASSIST_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  )
}
