import { useAuthStore } from '@/stores/authStore'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'

export interface UploadResult {
  url: string
}

export function uploadImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  // Dev mock: simulate upload with progress, return a placeholder URL
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      let pct = 0
      const tick = setInterval(() => {
        pct = Math.min(pct + 25, 90)
        onProgress?.(pct)
        if (pct >= 90) clearInterval(tick)
      }, 120)
      setTimeout(() => {
        clearInterval(tick)
        onProgress?.(100)
        const name = encodeURIComponent(file.name.replace(/\.[^.]+$/, ''))
        resolve({ url: `https://placehold.co/400x300/e2e8f0/64748b?text=${name}` })
      }, 700)
    })
  }

  const token = useAuthStore.getState().token
  const formData = new FormData()
  formData.append('file', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}/api/admin/uploads`)
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadResult)
        } catch {
          reject(new Error('Phản hồi không hợp lệ'))
        }
      } else {
        try {
          const body = JSON.parse(xhr.responseText) as { message?: string }
          reject(new Error(body.message ?? xhr.statusText))
        } catch {
          reject(new Error(xhr.statusText))
        }
      }
    }

    xhr.onerror = () => reject(new Error('Lỗi kết nối'))
    xhr.send(formData)
  })
}
