export interface StoreSettings {
  name: string
  hotline: string
  supportEmail: string
  address: string
  workingHours: string
  logo?: string
  favicon?: string
}

export interface SeoSettings {
  title: string
  description: string
  keywords: string
  ogImage?: string
}

export interface SocialSettings {
  facebook?: string
  zalo?: string
  instagram?: string
  youtube?: string
  tiktok?: string
}

export type PaymentProviderKey = 'vnpay' | 'momo' | 'zalopay' | 'vietqr' | 'cod'

export interface PaymentProviderConfig {
  key: PaymentProviderKey
  label: string
  enabled: boolean
}

export interface PaymentSettings {
  providers: PaymentProviderConfig[]
}

export interface AppSettings {
  store: StoreSettings
  seo: SeoSettings
  social: SocialSettings
  payment: PaymentSettings
}
