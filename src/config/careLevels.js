// 要介護度と区分支給限度基準額（1か月あたりの上限単位数）の対応表。
// 制度改正で金額・単位数が変わるため、変更時はこのファイルだけを直す。
// ※事業対象者には制度上の区分支給限度基準額はないが、
//   運用上は要支援1と同じ単位数を上限として扱うため同じ値を入れている。
export const CARE_LEVELS = [
  { value: 'jigyo_taisho', label: '事業対象者', limitUnits: 5032 },
  { value: 'shien_1', label: '要支援1', limitUnits: 5032 },
  { value: 'shien_2', label: '要支援2', limitUnits: 10531 },
  { value: 'kaigo_1', label: '要介護1', limitUnits: 16765 },
  { value: 'kaigo_2', label: '要介護2', limitUnits: 19705 },
  { value: 'kaigo_3', label: '要介護3', limitUnits: 27048 },
  { value: 'kaigo_4', label: '要介護4', limitUnits: 30938 },
  { value: 'kaigo_5', label: '要介護5', limitUnits: 36217 },
]

// 保存されている値（例: 'kaigo_1'）から、表示用の1件を探す。
// 見つからない場合は undefined を返すので、呼び出し側で備えること。
export function findCareLevel(value) {
  return CARE_LEVELS.find((level) => level.value === value)
}
