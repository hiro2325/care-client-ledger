// 印刷画面を経由せずにPDFを作る。
//
// ブラウザだけでは「印刷ダイアログを出さずにPDFを保存する」ことができないため、
// html2canvas で画面を画像にし、jsPDF でその画像をA4に貼ってPDFにしている。
// 画像にしてから貼る方式なので、日本語のフォントをPDFへ埋め込む必要がない
// （文字ではなく絵として入るため、文字化けが起きない）。
// そのぶん印刷経由のPDFより粗くなる。

// A4縦のミリ寸法。余白は印刷用スタイルと同じ10mm。
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 10
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2

// element の見た目をそのままPDFにして保存する。
// 変換に数秒かかるので、呼ぶ側はボタンを押せない状態にしておくこと。
export async function downloadElementAsPdf(element, fileName) {
  // 2つとも大きいライブラリなので、ボタンが押されたときだけ読み込む
  const [html2canvasModule, jsPdfModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])
  const html2canvas = html2canvasModule.default
  const JsPdf = jsPdfModule.jsPDF

  // 普段は隠してある印刷用の中身を、画面の外で組み立てて写し取る
  element.classList.add('is-capturing')
  try {
    const canvas = await html2canvas(element, {
      // 2倍で描くと文字の粗さが目立ちにくい
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    // compress を付けないとPDFが数MBになる
    const pdf = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
    const imageData = canvas.toDataURL('image/png')

    // 横幅をA4の本文幅に合わせたときの、画像の高さ（mm）
    const imageHeight = (canvas.height * CONTENT_WIDTH) / canvas.width

    // 1ページに収まらない分は、画像を上にずらしながらページを足していく
    let printed = 0
    while (printed < imageHeight) {
      if (printed > 0) {
        pdf.addPage()
      }
      pdf.addImage(imageData, 'PNG', MARGIN, MARGIN - printed, CONTENT_WIDTH, imageHeight)
      printed += CONTENT_HEIGHT
    }

    pdf.save(fileName)
    return { ok: true, pages: pdf.getNumberOfPages() }
  } finally {
    // 失敗しても画面の外に出しっぱなしにしない
    element.classList.remove('is-capturing')
  }
}
