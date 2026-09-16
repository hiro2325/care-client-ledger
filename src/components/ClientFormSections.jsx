import { CARE_LEVELS, formatLimitUnits } from '../config/careLevels.js'
import {
  ADL_ITEMS,
  CLIENT_STATUSES,
  COGNITIVE_INDEPENDENCE_LEVELS,
  GENDERS,
  HOUSEHOLD_TYPES,
  IADL_ITEMS,
  PHYSICAL_INDEPENDENCE_LEVELS,
} from '../config/options.js'
import { formatAge } from '../lib/age.js'
import { DateField, ReadOnlyField, SelectField, TextAreaField, TextField } from './FormFields.jsx'
import AssistLevelFields from './AssistLevelFields.jsx'
import ServiceListField from './ServiceListField.jsx'

// 登録・編集フォームの中身を、帳票の並びに合わせて区分ごとに分けたもの。
// どの区分も form（入力中の値）と set（1項目を書き換える関数）を受け取る。

export function IdentitySection({ form, set }) {
  return (
    <fieldset>
      <legend>識別</legend>
      <ReadOnlyField label="利用者ID" value={form.id || '保存時に自動で採番されます'} />
      <TextField
        label="担当ケアマネ"
        value={form.careManager}
        onChange={(value) => set('careManager', value)}
      />
      <SelectField
        label="状態"
        value={form.status}
        options={CLIENT_STATUSES}
        onChange={(value) => set('status', value)}
      />
    </fieldset>
  )
}

export function BasicSection({ form, set }) {
  return (
    <fieldset>
      <legend>基本</legend>
      <SelectField
        label="性別"
        value={form.gender}
        options={GENDERS}
        onChange={(value) => set('gender', value)}
      />
      <DateField
        label="生年月日"
        value={form.birthDate}
        onChange={(value) => set('birthDate', value)}
      />
      <ReadOnlyField label="年齢（自動計算）" value={formatAge(form.birthDate)} />
      <SelectField
        label="世帯構成"
        value={form.householdType}
        options={HOUSEHOLD_TYPES}
        onChange={(value) => set('householdType', value)}
      />
    </fieldset>
  )
}

export function InsuranceSection({ form, set }) {
  return (
    <fieldset>
      <legend>介護保険</legend>
      <SelectField
        label="要介護度"
        value={form.careLevel}
        options={CARE_LEVELS}
        onChange={(value) => set('careLevel', value)}
      />
      <DateField
        label="認定期間 開始"
        value={form.certStartDate}
        onChange={(value) => set('certStartDate', value)}
      />
      <DateField
        label="認定期間 終了"
        value={form.certEndDate}
        onChange={(value) => set('certEndDate', value)}
      />
      <TextField label="保険者" value={form.insurer} onChange={(value) => set('insurer', value)} />
      <ReadOnlyField
        label="区分支給限度基準額（要介護度から自動表示）"
        value={formatLimitUnits(form.careLevel)}
      />
    </fieldset>
  )
}

export function MedicalSection({ form, set }) {
  return (
    <fieldset>
      <legend>医療</legend>
      <TextAreaField
        label="主病名"
        value={form.mainDiseases}
        onChange={(value) => set('mainDiseases', value)}
      />
      <TextAreaField
        label="既往歴"
        value={form.medicalHistory}
        onChange={(value) => set('medicalHistory', value)}
      />
      <TextField
        label="かかりつけ医"
        value={form.familyDoctor}
        onChange={(value) => set('familyDoctor', value)}
      />
    </fieldset>
  )
}

export function FunctionSection({ form, set, setAssist }) {
  return (
    <fieldset>
      <legend>生活機能</legend>
      <SelectField
        label="障害高齢者の日常生活自立度"
        value={form.physicalIndependence}
        options={PHYSICAL_INDEPENDENCE_LEVELS}
        onChange={(value) => set('physicalIndependence', value)}
      />
      <SelectField
        label="認知症高齢者の日常生活自立度"
        value={form.cognitiveIndependence}
        options={COGNITIVE_INDEPENDENCE_LEVELS}
        onChange={(value) => set('cognitiveIndependence', value)}
      />
      <AssistLevelFields
        title="ADL（日常生活動作）"
        items={ADL_ITEMS}
        values={form.adl}
        onChange={(itemKey, value) => setAssist('adl', itemKey, value)}
      />
      <AssistLevelFields
        title="IADL（手段的日常生活動作）"
        items={IADL_ITEMS}
        values={form.iadl}
        onChange={(itemKey, value) => setAssist('iadl', itemKey, value)}
      />
    </fieldset>
  )
}

export function SupportSection({ form, set }) {
  return (
    <fieldset>
      <legend>支援</legend>
      <span className="field-label">利用サービス</span>
      <ServiceListField services={form.services} onChange={(value) => set('services', value)} />
      <TextAreaField
        label="本人の意向"
        value={form.personWish}
        onChange={(value) => set('personWish', value)}
      />
      <TextAreaField
        label="家族の意向"
        value={form.familyWish}
        onChange={(value) => set('familyWish', value)}
      />
      <TextAreaField
        label="特記事項"
        value={form.remarks}
        onChange={(value) => set('remarks', value)}
      />
    </fieldset>
  )
}

export function AdminSection({ form, set }) {
  return (
    <fieldset>
      <legend>管理</legend>
      <DateField
        label="モニタリング実施日"
        value={form.monitoringDate}
        onChange={(value) => set('monitoringDate', value)}
      />
      <ReadOnlyField
        label="最終更新（保存時に自動記録）"
        value={form.updatedAt ? new Date(form.updatedAt).toLocaleString('ja-JP') : '未保存'}
      />
    </fieldset>
  )
}
