import { useState } from 'react'
import { createEmptyClient, saveClient } from '../lib/storage.js'
import ExportProfileButton from '../components/ExportProfileButton.jsx'
import {
  AdminSection,
  BasicSection,
  FunctionSection,
  IdentitySection,
  InsuranceSection,
  MedicalSection,
  SupportSection,
} from '../components/ClientFormSections.jsx'

// 利用者の登録・編集画面。
// client に既存の利用者を渡すと編集、null を渡すと新規登録になる。
// 入力欄の中身は区分ごとに components/ClientFormSections.jsx に分けている。
export default function ClientFormPage({ client, onSaved, onCancel }) {
  const [form, setForm] = useState(client || createEmptyClient())
  const [error, setError] = useState('')

  // 項目を1つ書き換える。フォーム全体で使う共通の関数。
  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  // ADL・IADLは入れ子になっているので専用の書き換えを用意する
  function setAssist(groupKey, itemKey, value) {
    setForm((current) => ({
      ...current,
      [groupKey]: { ...current[groupKey], [itemKey]: value },
    }))
  }

  function handleSubmit(event) {
    // ページ全体が再読み込みされるのを止める
    event.preventDefault()

    if (!form.gender || !form.birthDate || !form.careLevel) {
      setError('性別・生年月日・要介護度は必ず入力してください。')
      return
    }
    if (form.certStartDate && form.certEndDate && form.certStartDate > form.certEndDate) {
      setError('認定期間の終了日は、開始日より後の日付にしてください。')
      return
    }

    setError('')
    // 保存後の一覧を親に渡して、一覧画面へ移ってもらう
    onSaved(saveClient(form))
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{client ? '利用者情報の編集（' + client.id + '）' : '新規登録'}</h2>
      <p className="note">
        この台帳は氏名を持ちません。氏名と利用者IDの対応は台帳の外で管理してください。
      </p>

      <IdentitySection form={form} set={set} />
      <BasicSection form={form} set={set} />
      <InsuranceSection form={form} set={set} />
      <MedicalSection form={form} set={set} />
      <FunctionSection form={form} set={set} setAssist={setAssist} />
      <SupportSection form={form} set={set} />
      <AdminSection form={form} set={set} />

      {/* 保存済みの利用者だけ。新規登録中はまだ出力する中身がそろっていない */}
      {client && <ExportProfileButton client={form} />}

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary">
          保存する
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  )
}
