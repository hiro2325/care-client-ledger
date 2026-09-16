import { CARE_LEVELS } from '../config/careLevels.js'
import { CAREGIVERS, CLIENT_STATUSES, findCaregiverLabel } from '../config/options.js'
import { SORT_OPTIONS } from '../lib/searchClients.js'

// 担当ケアマネの絞り込みに出す選択肢を作る。
// 選択肢から外れた担当者が保存済みデータに残っていても絞り込めるよう、
// 実際に使われている値を足しておく。
function buildCaregiverOptions(clients) {
  const values = CAREGIVERS.map((item) => item.value)
  for (const client of clients) {
    if (client.careManager && !values.includes(client.careManager)) {
      values.push(client.careManager)
    }
  }
  return values.map((value) => ({ value, label: findCaregiverLabel(value) }))
}

// 一覧の上に置く検索・絞り込みの操作欄。
export default function ClientFilters({ clients, filters, onChange, onReset }) {
  const caregiverOptions = buildCaregiverOptions(clients)

  // 1項目だけ書き換える
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="filters">
      <label className="field filter-keyword">
        <span className="field-label">キーワード検索</span>
        <input
          type="search"
          value={filters.keyword}
          placeholder="主病名・現病・既往歴・特記事項・利用サービスから探す"
          onChange={(event) => set('keyword', event.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">要介護度</span>
        <select value={filters.careLevel} onChange={(event) => set('careLevel', event.target.value)}>
          <option value="">すべて</option>
          {CARE_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">状態</span>
        <select value={filters.status} onChange={(event) => set('status', event.target.value)}>
          <option value="">すべて</option>
          {CLIENT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">担当ケアマネ</span>
        <select
          value={filters.careManager}
          onChange={(event) => set('careManager', event.target.value)}
        >
          <option value="">すべて</option>
          {caregiverOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">並べ替え</span>
        <select value={filters.sortBy} onChange={(event) => set('sortBy', event.target.value)}>
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="secondary" onClick={onReset}>
        条件をクリア
      </button>
    </div>
  )
}
