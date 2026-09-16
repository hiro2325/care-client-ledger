import { useState } from 'react'
import { CARE_LEVELS } from '../config/careLevels.js'
import { GENDERS } from '../config/options.js'
import { addClient } from '../lib/storage.js'

// 利用者を新規登録する画面。
// 利用者IDは保存するときに自動で決まるので、この画面では入力しない。
export default function ClientFormPage({ onSaved }) {
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [careLevel, setCareLevel] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    // ページ全体が再読み込みされるのを止める
    event.preventDefault()

    if (!gender || !birthDate || !careLevel) {
      setError('性別・生年月日・要介護度をすべて入力してください。')
      return
    }

    const nextClients = addClient({ gender, birthDate, careLevel })

    // 入力欄を空に戻して、続けて登録できるようにする
    setGender('')
    setBirthDate('')
    setCareLevel('')
    setError('')

    // 保存後の一覧を親に渡して、一覧画面へ移ってもらう
    onSaved(nextClients)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>新規登録</h2>
      <p className="note">
        この台帳は氏名を持ちません。氏名と利用者IDの対応は台帳の外で管理してください。
      </p>

      <label className="field">
        <span className="field-label">性別</span>
        <select value={gender} onChange={(event) => setGender(event.target.value)}>
          <option value="">選択してください</option>
          {GENDERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">生年月日</span>
        <input
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">要介護度</span>
        <select value={careLevel} onChange={(event) => setCareLevel(event.target.value)}>
          <option value="">選択してください</option>
          {CARE_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="primary">
        登録する
      </button>
    </form>
  )
}
