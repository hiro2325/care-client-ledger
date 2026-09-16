import { useState } from 'react'

// 生年月日を「年・月・日」の3つのプルダウンで入力する部品。
// 利用者は80代・90代が多く、カレンダーで何十年も遡るのが大変なため分けている。
// 親には今までどおり 'YYYY-MM-DD' の文字列で渡す。

const YEARS_BACK = 120

// 今年から120年前までを、新しい年が上に来る降順で並べる
function buildYears() {
  const thisYear = new Date().getFullYear()
  const years = []
  for (let year = thisYear; year >= thisYear - YEARS_BACK; year--) {
    years.push(year)
  }
  return years
}

// その年月が何日まであるかを返す。
// 年が未選択のときは、2月29日を選べるようにうるう年（2000年）で数える。
function countDaysInMonth(year, month) {
  if (!month) {
    return 31
  }
  const baseYear = year ? Number(year) : 2000
  // 「次の月の0日目」は、その月の最終日を指す
  return new Date(baseYear, Number(month), 0).getDate()
}

// 'YYYY-MM-DD' を3つの部品に分ける。登録済みの利用者を編集で開くときに使う。
function splitDate(value) {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!matched) {
    return { year: '', month: '', day: '' }
  }
  // プルダウンの値は '05' ではなく '5' で持つので、数値に直してから文字列に戻す
  return {
    year: matched[1],
    month: String(Number(matched[2])),
    day: String(Number(matched[3])),
  }
}

// 3つが揃ったときだけ 'YYYY-MM-DD' を作る。欠けていれば空文字。
function joinDate({ year, month, day }) {
  if (!year || !month || !day) {
    return ''
  }
  return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0')
}

export default function BirthDateField({ label, value, onChange }) {
  const [parts, setParts] = useState(() => splitDate(value))

  const years = buildYears()
  const dayCount = countDaysInMonth(parts.year, parts.month)

  // 1つ選び直すたびに、日数をはみ出していないか確かめてから親へ渡す
  function updatePart(key, partValue) {
    const next = { ...parts, [key]: partValue }

    // 3月31日から2月へ変えたときなど、選べない日になったらその月の末日に寄せる
    const limit = countDaysInMonth(next.year, next.month)
    if (next.day && Number(next.day) > limit) {
      next.day = String(limit)
    }

    setParts(next)
    onChange(joinDate(next))
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="date-parts">
        <select
          aria-label={label + ' 年'}
          value={parts.year}
          onChange={(event) => updatePart('year', event.target.value)}
        >
          <option value="">年</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          aria-label={label + ' 月'}
          value={parts.month}
          onChange={(event) => updatePart('month', event.target.value)}
        >
          <option value="">月</option>
          {Array.from({ length: 12 }, (item, index) => index + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          aria-label={label + ' 日'}
          value={parts.day}
          onChange={(event) => updatePart('day', event.target.value)}
        >
          <option value="">日</option>
          {Array.from({ length: dayCount }, (item, index) => index + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
