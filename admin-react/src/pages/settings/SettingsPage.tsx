import { useEffect, useState } from 'react'
import { Alert, Button, Container, Spinner, Tab, Tabs } from 'react-bootstrap'
import { TbAlertCircle, TbBuildingStore, TbCreditCard, TbDeviceFloppy, TbSearch, TbShare } from 'react-icons/tb'
import Swal from 'sweetalert2'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { settingApi } from '@/api/settingApi'
import type {
  AppSettings, PaymentSettings, SeoSettings, SocialSettings, StoreSettings,
} from '@/types/setting'
import StoreSection from '@/pages/settings/sections/StoreSection'
import SeoSection from '@/pages/settings/sections/SeoSection'
import SocialSection from '@/pages/settings/sections/SocialSection'
import PaymentSection from '@/pages/settings/sections/PaymentSection'

const toast = (icon: 'success' | 'error', title: string) =>
  Swal.fire({ toast: true, position: 'top-end', icon, title, timer: 2500, showConfirmButton: false, timerProgressBar: true })

const URL_REGEX = /^https?:\/\/.+/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ValidationResult {
  store: Partial<Record<keyof StoreSettings, string>>
  seo:   Partial<Record<keyof SeoSettings, string>>
  social: Partial<Record<keyof SocialSettings, string>>
  hasError: boolean
}

function validate(s: AppSettings): ValidationResult {
  const result: ValidationResult = { store: {}, seo: {}, social: {}, hasError: false }

  if (!s.store.name.trim())     result.store.name     = 'Tên cửa hàng không được để trống'
  if (!s.store.hotline.trim())  result.store.hotline  = 'Hotline không được để trống'
  if (!s.store.supportEmail.trim()) {
    result.store.supportEmail = 'Email hỗ trợ không được để trống'
  } else if (!EMAIL_REGEX.test(s.store.supportEmail)) {
    result.store.supportEmail = 'Email không hợp lệ'
  }

  if (!s.seo.title.trim())       result.seo.title       = 'Tiêu đề SEO không được để trống'
  if (!s.seo.description.trim()) result.seo.description = 'Mô tả meta không được để trống'

  ;(['facebook', 'zalo', 'instagram', 'youtube', 'tiktok'] as const).forEach((k) => {
    const v = (s.social[k] ?? '').trim()
    if (v && !URL_REGEX.test(v)) result.social[k] = 'Phải là URL bắt đầu bằng http:// hoặc https://'
  })

  result.hasError =
    Object.keys(result.store).length > 0 ||
    Object.keys(result.seo).length > 0 ||
    Object.keys(result.social).length > 0
  return result
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<ValidationResult>({ store: {}, seo: {}, social: {}, hasError: false })
  const [activeTab, setActiveTab] = useState<'store' | 'seo' | 'social' | 'payment'>('store')

  useEffect(() => {
    setLoading(true)
    settingApi.getAll()
      .then(setSettings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Container fluid>
        <PageBreadcrumb title="Cài đặt website" subtitle="Hệ thống" />
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    )
  }

  if (error || !settings) {
    return (
      <Container fluid>
        <PageBreadcrumb title="Cài đặt website" subtitle="Hệ thống" />
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <TbAlertCircle className="fs-20" /> {error ?? 'Không thể tải cài đặt'}
        </Alert>
      </Container>
    )
  }

  const handlePatch = <K extends keyof AppSettings>(section: K, patch: Partial<AppSettings[K]>) => {
    setSettings((prev) => prev ? { ...prev, [section]: { ...prev[section], ...patch } } : prev)
  }

  const handleSave = async () => {
    if (!settings) return
    const v = validate(settings)
    setErrors(v)
    if (v.hasError) {
      // Switch to first tab that has errors so the user can see
      if (Object.keys(v.store).length)  setActiveTab('store')
      else if (Object.keys(v.seo).length)    setActiveTab('seo')
      else if (Object.keys(v.social).length) setActiveTab('social')
      await toast('error', 'Vui lòng kiểm tra lại các trường còn lỗi')
      return
    }

    setSaving(true)
    try {
      const saved = await settingApi.update(settings)
      setSettings(saved)
      await toast('success', 'Đã lưu cài đặt')
    } catch (err) {
      await toast('error', err instanceof Error ? err.message : 'Lưu cài đặt thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Cài đặt website" subtitle="Hệ thống" />

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0 fw-bold">Cài đặt website</h5>
        <Button variant="primary" disabled={saving} onClick={() => void handleSave()} className="d-flex align-items-center gap-2">
          {saving ? <Spinner animation="border" size="sm" /> : <TbDeviceFloppy />}
          Lưu thay đổi
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k as typeof activeTab)}
        className="mb-3"
      >
        <Tab eventKey="store" title={<span className="d-inline-flex align-items-center gap-1"><TbBuildingStore /> Cửa hàng</span>}>
          <StoreSection
            value={settings.store}
            onChange={(patch) => handlePatch('store', patch as Partial<StoreSettings>)}
            errors={errors.store}
          />
        </Tab>

        <Tab eventKey="seo" title={<span className="d-inline-flex align-items-center gap-1"><TbSearch /> SEO</span>}>
          <SeoSection
            value={settings.seo}
            onChange={(patch) => handlePatch('seo', patch as Partial<SeoSettings>)}
            errors={errors.seo}
          />
        </Tab>

        <Tab eventKey="social" title={<span className="d-inline-flex align-items-center gap-1"><TbShare /> Mạng xã hội</span>}>
          <SocialSection
            value={settings.social}
            onChange={(patch) => handlePatch('social', patch as Partial<SocialSettings>)}
            errors={errors.social}
          />
        </Tab>

        <Tab eventKey="payment" title={<span className="d-inline-flex align-items-center gap-1"><TbCreditCard /> Thanh toán</span>}>
          <PaymentSection
            value={settings.payment}
            onChange={(patch) => handlePatch('payment', patch as Partial<PaymentSettings>)}
          />
        </Tab>
      </Tabs>
    </Container>
  )
}

export default SettingsPage
