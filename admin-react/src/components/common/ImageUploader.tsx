import { useId, useRef, useState } from 'react'
import { Alert, ProgressBar } from 'react-bootstrap'
import { TbPhoto, TbPlus, TbX } from 'react-icons/tb'
import { uploadImage } from '@/api/uploadApi'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_EXT_LABEL = 'JPG, PNG, WEBP'

interface InFlight {
  id: string
  name: string
  previewUrl: string
  progress: number
  error?: string
}

interface BaseProps {
  maxSizeMB?: number
  disabled?: boolean
  label?: string
}

export interface SingleImageUploaderProps extends BaseProps {
  multiple?: false
  value?: string
  onChange: (url: string | null) => void
}

export interface MultipleImageUploaderProps extends BaseProps {
  multiple: true
  value?: string[]
  onChange: (urls: string[]) => void
}

export type ImageUploaderProps = SingleImageUploaderProps | MultipleImageUploaderProps

function validate(file: File, maxSizeMB: number): string | null {
  if (!ALLOWED_MIME.includes(file.type))
    return `Định dạng không hỗ trợ — chỉ chấp nhận ${ALLOWED_EXT_LABEL}`
  if (file.size > maxSizeMB * 1024 * 1024)
    return `Ảnh quá lớn — tối đa ${maxSizeMB}MB`
  return null
}

// ─── Single mode ──────────────────────────────────────────────────────────────

function SingleUploader({ value, onChange, maxSizeMB = 5, disabled = false, label }: SingleImageUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inFlight, setInFlight] = useState<InFlight | null>(null)

  const upload = async (file: File) => {
    const err = validate(file, maxSizeMB)
    const preview = URL.createObjectURL(file)
    const id = String(Date.now())

    if (err) {
      setInFlight({ id, name: file.name, previewUrl: preview, progress: 0, error: err })
      setTimeout(() => { URL.revokeObjectURL(preview); setInFlight(null) }, 4000)
      return
    }

    setInFlight({ id, name: file.name, previewUrl: preview, progress: 0 })
    try {
      const result = await uploadImage(file, (pct) =>
        setInFlight((f) => f ? { ...f, progress: pct } : f),
      )
      onChange(result.url)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload thất bại'
      setInFlight((f) => f ? { ...f, error: msg, progress: 0 } : f)
      setTimeout(() => setInFlight(null), 4000)
    } finally {
      URL.revokeObjectURL(preview)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void upload(file)
    e.target.value = ''
  }

  const zone = (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      className="rounded d-flex flex-column align-items-center justify-content-center gap-1 text-muted"
      style={{ width: 160, height: 120, cursor: disabled ? 'not-allowed' : 'pointer', border: '2px dashed #dee2e6' }}
    >
      <TbPhoto style={{ fontSize: 28 }} />
      <span style={{ fontSize: 12 }}>Chọn ảnh</span>
      <span style={{ fontSize: 11, opacity: 0.6 }}>{ALLOWED_EXT_LABEL} · {maxSizeMB}MB</span>
    </div>
  )

  return (
    <div>
      {label && <div className="form-label mb-1">{label}</div>}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="d-none"
        disabled={disabled}
        onChange={handleChange}
      />

      {inFlight ? (
        <div style={{ width: 160 }}>
          <div className="position-relative">
            <img
              src={inFlight.previewUrl}
              alt=""
              width={160}
              height={120}
              className="rounded border object-fit-cover"
              style={{ opacity: inFlight.error ? 0.4 : 0.7 }}
            />
          </div>
          {inFlight.error
            ? <Alert variant="danger" className="py-1 px-2 mt-1 mb-0" style={{ fontSize: 11 }}>{inFlight.error}</Alert>
            : <ProgressBar now={inFlight.progress} style={{ height: 5 }} className="mt-1" />
          }
        </div>
      ) : value ? (
        <div className="position-relative d-inline-block">
          <img
            src={value}
            alt="preview"
            width={160}
            height={120}
            className="rounded border object-fit-cover d-block"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="btn btn-danger btn-sm position-absolute d-flex align-items-center justify-content-center p-0"
            style={{ top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', fontSize: 13 }}
          ><TbX /></button>
          <div
            className="text-primary mt-1"
            style={{ fontSize: 12, cursor: 'pointer' }}
            onClick={() => !disabled && inputRef.current?.click()}
          >Đổi ảnh</div>
        </div>
      ) : zone}
    </div>
  )
}

// ─── Multiple mode ────────────────────────────────────────────────────────────

function MultipleUploader({ value = [], onChange, maxSizeMB = 5, disabled = false, label }: MultipleImageUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inFlights, setInFlights] = useState<InFlight[]>([])

  const uploadFile = async (file: File) => {
    const err = validate(file, maxSizeMB)
    const preview = URL.createObjectURL(file)
    const id = `${Date.now()}-${Math.random()}`

    if (err) {
      setInFlights((prev) => [...prev, { id, name: file.name, previewUrl: preview, progress: 0, error: err }])
      setTimeout(() => { URL.revokeObjectURL(preview); setInFlights((p) => p.filter((f) => f.id !== id)) }, 4000)
      return
    }

    setInFlights((prev) => [...prev, { id, name: file.name, previewUrl: preview, progress: 0 }])
    try {
      const result = await uploadImage(file, (pct) =>
        setInFlights((prev) => prev.map((f) => f.id === id ? { ...f, progress: pct } : f)),
      )
      // Capture current value inside the closure via the functional updater below
      onChange([...value, result.url])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload thất bại'
      setInFlights((prev) => prev.map((f) => f.id === id ? { ...f, error: msg, progress: 0 } : f))
      setTimeout(() => setInFlights((p) => p.filter((f) => f.id !== id)), 4000)
    } finally {
      URL.revokeObjectURL(preview)
      setInFlights((prev) => prev.filter((f) => f.id !== id || f.error))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach((f) => void uploadFile(f))
    e.target.value = ''
  }

  const THUMB = 80

  return (
    <div>
      {label && <div className="form-label mb-1">{label}</div>}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="d-none"
        disabled={disabled}
        onChange={handleChange}
      />

      <div className="d-flex flex-wrap gap-2 align-items-start">
        {/* Existing uploaded images */}
        {value.map((url, i) => (
          <div key={i} className="position-relative flex-shrink-0">
            <img
              src={url}
              alt=""
              width={THUMB}
              height={THUMB}
              className="rounded border object-fit-cover d-block"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3' }}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              disabled={disabled}
              className="btn btn-danger btn-sm position-absolute d-flex align-items-center justify-content-center p-0"
              style={{ top: -7, right: -7, width: 18, height: 18, borderRadius: '50%', fontSize: 11 }}
            ><TbX /></button>
          </div>
        ))}

        {/* In-flight thumbnails */}
        {inFlights.map((u) => (
          <div key={u.id} className="flex-shrink-0" style={{ width: THUMB, height: THUMB }}>
            {u.error ? (
              <div
                className="rounded border d-flex align-items-center justify-content-center bg-danger-subtle text-danger text-center"
                style={{ width: THUMB, height: THUMB, fontSize: 9, padding: 4, lineHeight: 1.2 }}
              >{u.error}</div>
            ) : (
              <div className="position-relative rounded overflow-hidden border" style={{ width: THUMB, height: THUMB }}>
                <img src={u.previewUrl} alt="" width={THUMB} height={THUMB} className="object-fit-cover" style={{ opacity: 0.5 }} />
                <div
                  className="position-absolute bottom-0 start-0 end-0 px-1 pb-1"
                  style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '0 0 4px 4px' }}
                >
                  <ProgressBar now={u.progress} style={{ height: 3 }} />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add button */}
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className="rounded d-flex flex-column align-items-center justify-content-center gap-1 text-muted flex-shrink-0"
          style={{ width: THUMB, height: THUMB, cursor: disabled ? 'not-allowed' : 'pointer', border: '2px dashed #dee2e6' }}
        >
          <TbPlus style={{ fontSize: 20 }} />
          <span style={{ fontSize: 10 }}>Thêm</span>
        </div>
      </div>

      <div className="text-muted mt-1" style={{ fontSize: 11 }}>{ALLOWED_EXT_LABEL} · Tối đa {maxSizeMB}MB/ảnh</div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function ImageUploader(props: ImageUploaderProps) {
  if (props.multiple) return <MultipleUploader {...props} />
  return <SingleUploader {...(props as SingleImageUploaderProps)} />
}
