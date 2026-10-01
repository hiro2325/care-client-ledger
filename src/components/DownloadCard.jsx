// ダウンロードできるファイルを1枚のカードで見せる部品。
// 左にファイル種別のアイコン、中央にファイル名と説明、右にボタンを置く。
// アイコンは画像を使わず、文字とCSSだけで作っている。

// type は 'CSV' / 'TXT' / 'JSON' のいずれか。色分けに使う。
export default function DownloadCard({ type, fileName, description, onDownload, disabled }) {
  return (
    <div className="dl-card">
      <span className={'dl-icon dl-icon-' + type.toLowerCase()} aria-hidden="true">
        {type}
      </span>

      <div className="dl-body">
        <p className="dl-name">{fileName}</p>
        <p className="dl-desc">{description}</p>
      </div>

      <button type="button" className="primary dl-button" onClick={onDownload} disabled={disabled}>
        ダウンロード
      </button>
    </div>
  )
}
