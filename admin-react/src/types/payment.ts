export type PaymentMethodType = 'Card' | 'E-Wallet' | 'Bank Transfer' | 'QR Code' | 'Balance'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export interface PaymentProvider {
  id: string
  name: string // VNPay, MoMo, PayPal, Stripe, PayOS
  displayName: string
  logoUrl: string
  apiKey: string
  secretKey: string
  isActive: boolean
  environment: 0 | 1 // 0: Sandbox, 1: Production
  createdAt: string
  updatedAt: string
}

export interface PaymentProviderSetting {
  id: string
  providerId: string
  key: string
  value: string
  environment: number
  createdAt: string
}

export interface PaymentMethod {
  id: string
  providerId: string
  name: string
  type: PaymentMethodType
  isActive: boolean
  feeRate?: number // e.g. 1.5%
  feeFixed?: number // e.g. 2000 VND
  createdAt: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  orderCode: string
  paymentProviderId: string
  paymentProviderName: string
  amount: number
  currency: string
  transactionCode: string
  paymentMethod: PaymentMethodType
  status: PaymentStatus
  responseMessage: string
  refundReason?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentCallbackLog {
  id: string
  providerId: string
  providerName: string
  payload: string
  signature: string
  status: 'success' | 'failed' | 'invalid_signature'
  receivedAt: string
}
