export interface WholesalerProvider {
  id: string
  name: string // GigSky, Keepgo, Telna, JoyTel
  displayName: string
  logoUrl: string
  apiBaseUrl: string
  apiKey: string
  balance: number // in USD
  pingTimeMs: number
  isActive: boolean
  status: 'connected' | 'disconnected' | 'error'
  createdAt: string
  updatedAt: string
}

export type ProviderActionType = 'purchase_esim' | 'activate_esim' | 'topup_plan' | 'query_balance'

export interface ProviderLog {
  id: string
  providerId: string
  providerName: string
  categoryId?: string
  variantId: string
  variantName: string
  type: ProviderActionType
  content: string
  status: boolean // true = success, false = fail
  createdAt: string
  updatedAt: string
}

export interface ProviderLogStatus {
  id: string
  providerId: string
  providerName: string
  requestId: string
  responseBody: string
  statusCode: number
  createdAt: string
}
