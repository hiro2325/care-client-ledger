import { useRef, useState } from 'react'
import { createEmptyClient, saveClient } from '../lib/storage.js'
import ExportProfileButton from '../components/ExportProfileButton.jsx'
import PrintableLedger from '../components/PrintableLedger.jsx'
import DownloadCard from '../components/DownloadCard.jsx'
import { buildClientBackup } from '../lib/backup.js'
import { downloadText, todayStamp } from '../lib/downloadFile.js'
import { buildExportText } from '../lib/exportProfile.js'
import { downloadElementAsPdf } from '../lib/exportPdf.js'
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
  // PDFの作成中はボタンを押せないようにする
  const [buildingPdf, setBuildingPdf] = useState(false)
  // 印刷用の中身を掴むための参照。PDF変換のときに使う。
  const printRef = useRef(null)

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

  // 印刷画面を経由せずにPDFを保存する。変換に数秒かかる。
  async function handlePdfDownload() {
    if (!printRef.current) {
      return
    }
    setBuildingPdf(true)
    setError('')
    try {
      await downloadElementAsPdf(printRef.current, form.id + '-台帳-' + todayStamp() + '.pdf')
    } catch {
      // 利用者データは出力しない
      setError('PDFを作成できませんでした。「印刷・PDF保存」をお試しください。')
    } finally {
      setBuildingPdf(false)
    }
  }

  const stamp = todayStamp()
  const textFileName = form.id + '-AI用-' + stamp + '.txt'
  const jsonFileName = form.id + '-' + stamp + '.json'

  // AI用テキストをそのままファイルにする。コピーと同じ中身。
  function handleTextDownload() {
    downloadText(textFileName, buildExportText(form), 'text/plain')
  }

  // この利用者1件分をJSONで保存する。
  // データ管理画面の読み込みでそのまま復元できる形にそろえている。
  function handleJsonDownload() {
    downloadText(jsonFileName, JSON.stringify(buildClientBackup(form), null, 2), 'application/json')
  }

  return (
    <>
      {/* 画面には出さず、印刷のときだけ現れる紙の台帳 */}
      {client && <PrintableLedger client={form} ref={printRef} />}

      <form className="card screen-only" onSubmit={handleSubmit}>
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

        {client && (
          <>
            <p className="dl-group-title">書き出し</p>
            <DownloadCard
              type="TXT"
              fileName={textFileName}
              description="AIに渡す用の要約。個人が特定できる項目は含みません"
              onDownload={handleTextDownload}
            />
            <DownloadCard
              type="JSON"
              fileName={jsonFileName}
              description="この利用者1件分のデータ。読み込みで復元できます"
              onDownload={handleJsonDownload}
            />
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="primary">
            保存する
          </button>
          {/* 保存済みの利用者だけ。印刷と書き出しの中身は編集中の値をそのまま出す */}
          {client && (
            <button type="button" className="secondary" onClick={() => window.print()}>
              印刷・PDF保存
            </button>
          )}
          {client && (
            <button
              type="button"
              className="secondary"
              disabled={buildingPdf}
              onClick={handlePdfDownload}
            >
              {buildingPdf ? '作成中…' : 'PDFでダウンロード'}
            </button>
          )}

          <button type="button" className="secondary" onClick={onCancel}>
            キャンセル
          </button>
        </div>

        {client && (
          <p className="note print-note">
            <strong>印刷・PDF保存</strong>…きれいなPDFができます。印刷画面が開きます。
            <br />
            <strong>PDFでダウンロード</strong>…すぐに保存されます。画質は印刷経由より粗くなります。
          </p>
        )}
      </form>
    </>
  )
}
