// フォームで繰り返し使う入力部品をまとめたファイル。
// どれも「ラベル＋入力欄」を1組にしただけの素直な作りにしている。

// 文字入力（担当ケアマネ・保険者・かかりつけ医など）
export function TextField({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

// 複数行の入力（主病名・既往歴・意向・特記事項など）
export function TextAreaField({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

// 日付入力（生年月日・認定期間・モニタリング実施日）
export function DateField({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

// プルダウン。options は { value, label } の配列を渡す。
export function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">選択してください</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// 入力できない表示専用の欄（利用者ID・区分支給限度基準額・最終更新など）
export function ReadOnlyField({ label, value }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <p className="readonly-value">{value}</p>
    </div>
  )
}
