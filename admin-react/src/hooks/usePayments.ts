import { useState, useEffect, useCallback } from 'react'
import {
  type PaymentProvider,
  type PaymentMethod,
  type PaymentTransaction,
  type PaymentCallbackLog,
  type PaymentMethodType,
  type PaymentStatus
} from '../types/payment'

const PROVIDERS_STORAGE_KEY = 'ezsim_payment_providers'
const METHODS_STORAGE_KEY = 'ezsim_payment_methods'
const TRANSACTIONS_STORAGE_KEY = 'ezsim_payment_transactions'
const CALLBACKS_STORAGE_KEY = 'ezsim_payment_callbacks'
const ORDERS_STORAGE_KEY = 'ezsim_orders'

const initialProviders: PaymentProvider[] = [
  {
    id: 'PROV-VNPAY',
    name: 'VNPay',
    displayName: 'Cổng thanh toán VNPay',
    logoUrl: 'https://img.vietqr.io/image/vnpay.png',
    apiKey: 'VNPAY_API_KEY_MOCK_123',
    secretKey: 'VNPAY_SECRET_KEY_MOCK_XYZ',
    isActive: true,
    environment: 0, // Sandbox
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'PROV-MOMO',
    name: 'MoMo',
    displayName: 'Ví điện tử MoMo',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    apiKey: 'MOMO_PARTNER_CODE_MOCK_456',
    secretKey: 'MOMO_ACCESS_KEY_SECRET_MOCK_ABC',
    isActive: true,
    environment: 0, // Sandbox
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'PROV-PAYPAL',
    name: 'PayPal',
    displayName: 'PayPal Gateway',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    apiKey: 'PAYPAL_CLIENT_ID_MOCK_789',
    secretKey: 'PAYPAL_CLIENT_SECRET_MOCK_DEF',
    isActive: false,
    environment: 0, // Sandbox
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'PROV-STRIPE',
    name: 'Stripe',
    displayName: 'Stripe International',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    apiKey: 'pk_test_stripe_mock_key_51O',
    secretKey: 'sk_test_stripe_mock_secret_51O',
    isActive: true,
    environment: 0, // Sandbox
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'PROV-PAYOS',
    name: 'PayOS',
    displayName: 'PayOS Kênh thanh toán tiện lợi',
    logoUrl: 'https://payos.vn/assets/img/logo.svg',
    apiKey: 'PAYOS_CLIENT_ID_MOCK_882',
    secretKey: 'PAYOS_API_KEY_SECRET_MOCK_QWE',
    isActive: false,
    environment: 0, // Sandbox
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  }
]

const initialMethods: PaymentMethod[] = [
  {
    id: 'METH-VNPAY-QR',
    providerId: 'PROV-VNPAY',
    name: 'Cổng quét mã VNPay-QR',
    type: 'QR Code',
    isActive: true,
    feeRate: 0.8, // 0.8%
    feeFixed: 0,
    createdAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'METH-VNPAY-ATM',
    providerId: 'PROV-VNPAY',
    name: 'Thẻ ATM nội địa (VNPay)',
    type: 'Bank Transfer',
    isActive: true,
    feeRate: 1.1, // 1.1%
    feeFixed: 1650,
    createdAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'METH-MOMO-WALLET',
    providerId: 'PROV-MOMO',
    name: 'Thanh toán trực tiếp qua ví MoMo',
    type: 'E-Wallet',
    isActive: true,
    feeRate: 1.5, // 1.5%
    feeFixed: 0,
    createdAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'METH-STRIPE-CC',
    providerId: 'PROV-STRIPE',
    name: 'Thẻ tín dụng Quốc tế (Visa/Mastercard)',
    type: 'Card',
    isActive: true,
    feeRate: 2.9, // 2.9%
    feeFixed: 7500, // 7500 VND
    createdAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'METH-PAYPAL-BAL',
    providerId: 'PROV-PAYPAL',
    name: 'Số dư ví PayPal',
    type: 'Balance',
    isActive: true,
    feeRate: 3.4,
    feeFixed: 11000,
    createdAt: '2026-05-01T00:00:00Z'
  }
]

const initialTransactions: PaymentTransaction[] = [
  {
    id: 'PMT-001',
    orderId: 'ORD-882910',
    orderCode: 'ORD-882910',
    paymentProviderId: 'PROV-VNPAY',
    paymentProviderName: 'VNPay',
    amount: 120000000,
    currency: 'VND',
    transactionCode: 'VNPAY-992103821',
    paymentMethod: 'QR Code',
    status: 'paid',
    responseMessage: '00 - Giao dịch thành công qua VNPay-QR',
    createdAt: '2026-05-18T14:32:10Z',
    updatedAt: '2026-05-18T14:32:10Z'
  },
  {
    id: 'PMT-002',
    orderId: 'ORD-882911',
    orderCode: 'ORD-882911',
    paymentProviderId: 'PROV-MOMO',
    paymentProviderName: 'MoMo',
    amount: 25960000,
    currency: 'VND',
    transactionCode: 'MOMO-102938472',
    paymentMethod: 'E-Wallet',
    status: 'paid',
    responseMessage: '0 - Giao dịch thành công qua ví MoMo',
    createdAt: '2026-05-18T11:16:00Z',
    updatedAt: '2026-05-18T11:16:00Z'
  },
  {
    id: 'PMT-003',
    orderId: 'ORD-882912',
    orderCode: 'ORD-882912',
    paymentProviderId: 'PROV-PAYOS',
    paymentProviderName: 'PayOS',
    amount: 1230000,
    currency: 'VND',
    transactionCode: 'PAYOS-PENDING-99',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
    responseMessage: '99 - Giao dịch đang chờ thanh toán qua cổng PayOS',
    createdAt: '2026-05-17T16:45:00Z',
    updatedAt: '2026-05-17T16:45:00Z'
  },
  {
    id: 'PMT-004',
    orderId: 'ORD-882914',
    orderCode: 'ORD-882914',
    paymentProviderId: 'PROV-STRIPE',
    paymentProviderName: 'Stripe',
    amount: 85000000,
    currency: 'VND',
    transactionCode: 'ch_stripe_mock_99182390',
    paymentMethod: 'Card',
    status: 'paid',
    responseMessage: 'Stripe charge successful: captured',
    createdAt: '2026-05-16T18:12:30Z',
    updatedAt: '2026-05-16T18:12:30Z'
  },
  {
    id: 'PMT-005',
    orderId: 'ORD-882915',
    orderCode: 'ORD-882915',
    paymentProviderId: 'PROV-VNPAY',
    paymentProviderName: 'VNPay',
    amount: 1450000,
    currency: 'VND',
    transactionCode: 'VNPAY-ERR503',
    paymentMethod: 'Bank Transfer',
    status: 'failed',
    responseMessage: '97 - Chữ ký không hợp lệ hoặc giao dịch bị từ chối bởi Ngân hàng',
    createdAt: '2026-05-15T10:05:00Z',
    updatedAt: '2026-05-15T10:05:00Z'
  }
]

const initialCallbacks: PaymentCallbackLog[] = [
  {
    id: 'CB-001',
    providerId: 'PROV-VNPAY',
    providerName: 'VNPay',
    payload: '{"vnp_Amount":"12000000000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNPAY-992103821","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang ORD-882910","vnp_ResponseCode":"00","vnp_SecureHash":"abcde12345"}',
    signature: 'abcde12345',
    status: 'success',
    receivedAt: '2026-05-18T14:32:10Z'
  },
  {
    id: 'CB-002',
    providerId: 'PROV-MOMO',
    providerName: 'MoMo',
    payload: '{"partnerCode":"MOMO","orderId":"ORD-882911","amount":25960000,"transId":102938472,"resultCode":0,"message":"Success","signature":"xyz789"}',
    signature: 'xyz789',
    status: 'success',
    receivedAt: '2026-05-18T11:16:00Z'
  }
]

export const usePayments = () => {
  const [providers, setProviders] = useState<PaymentProvider[]>(() => {
    try {
      const stored = localStorage.getItem(PROVIDERS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse payment providers', e)
    }
    localStorage.setItem(PROVIDERS_STORAGE_KEY, JSON.stringify(initialProviders))
    return initialProviders
  })

  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    try {
      const stored = localStorage.getItem(METHODS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse payment methods', e)
    }
    localStorage.setItem(METHODS_STORAGE_KEY, JSON.stringify(initialMethods))
    return initialMethods
  })

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse transactions', e)
    }
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialTransactions))
    return initialTransactions
  })

  const [callbacks, setCallbacks] = useState<PaymentCallbackLog[]>(() => {
    try {
      const stored = localStorage.getItem(CALLBACKS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse callbacks', e)
    }
    localStorage.setItem(CALLBACKS_STORAGE_KEY, JSON.stringify(initialCallbacks))
    return initialCallbacks
  })

  // Sync with global changes (across tabs or re-renders)
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedProviders = localStorage.getItem(PROVIDERS_STORAGE_KEY)
        const storedMethods = localStorage.getItem(METHODS_STORAGE_KEY)
        const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
        const storedCallbacks = localStorage.getItem(CALLBACKS_STORAGE_KEY)

        if (storedProviders) setProviders(JSON.parse(storedProviders))
        if (storedMethods) setMethods(JSON.parse(storedMethods))
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions))
        if (storedCallbacks) setCallbacks(JSON.parse(storedCallbacks))
      } catch (e) {
        console.error('Failed to sync payments storage', e)
      }
    }
    window.addEventListener('payments_update', handleSync)
    return () => window.removeEventListener('payments_update', handleSync)
  }, [])

  const triggerUpdate = () => {
    window.dispatchEvent(new Event('payments_update'))
  }

  // --- Provider actions ---
  const toggleProviderStatus = useCallback((id: string) => {
    const updated = providers.map(p => p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p)
    localStorage.setItem(PROVIDERS_STORAGE_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
  }, [providers])

  const updateProviderSettings = useCallback((id: string, updates: { apiKey: string; secretKey: string; environment: 0 | 1 }) => {
    const updated = providers.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    localStorage.setItem(PROVIDERS_STORAGE_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
  }, [providers])

  // --- Method actions ---
  const toggleMethodStatus = useCallback((id: string) => {
    const updated = methods.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m)
    localStorage.setItem(METHODS_STORAGE_KEY, JSON.stringify(updated))
    setMethods(updated)
    triggerUpdate()
  }, [methods])

  const updateMethodFees = useCallback((id: string, feeRate: number, feeFixed: number) => {
    const updated = methods.map(m => m.id === id ? { ...m, feeRate, feeFixed } : m)
    localStorage.setItem(METHODS_STORAGE_KEY, JSON.stringify(updated))
    setMethods(updated)
    triggerUpdate()
  }, [methods])

  // --- Webhook Callback simulator & Transaction creator ---
  const simulateWebhookCallback = useCallback((
    providerId: string,
    orderCode: string,
    simulatedStatus: 'success' | 'failed' | 'invalid_signature',
    payloadObj: any
  ) => {
    const now = new Date().toISOString()
    const provider = providers.find(p => p.id === providerId)
    const providerName = provider ? provider.name : 'Unknown'

    // Create unique callback record
    const callbackLogId = `CB-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    const mockSignature = `mock_secure_hash_${Math.random().toString(36).substr(2, 6)}`
    
    const newCallbackLog: PaymentCallbackLog = {
      id: callbackLogId,
      providerId,
      providerName,
      payload: JSON.stringify(payloadObj),
      signature: simulatedStatus === 'invalid_signature' ? 'bad_signature_value' : mockSignature,
      status: simulatedStatus,
      receivedAt: now
    }

    const updatedCallbacks = [newCallbackLog, ...callbacks]
    localStorage.setItem(CALLBACKS_STORAGE_KEY, JSON.stringify(updatedCallbacks))
    setCallbacks(updatedCallbacks)

    // Check if signature is invalid
    if (simulatedStatus === 'invalid_signature') {
      triggerUpdate()
      return { success: false, message: 'Lỗi 400 Bad Request: Chữ ký không hợp lệ' }
    }

    // Determine target payment transaction status
    const status: PaymentStatus = simulatedStatus === 'success' ? 'paid' : 'failed'
    const resMsg = simulatedStatus === 'success' 
      ? `00 - Tiếp nhận callback từ ${providerName} thành công: Giao dịch được xác nhận.`
      : `99 - Tiếp nhận callback từ ${providerName}: Giao dịch thất bại.`

    // Update or create PaymentTransaction
    let transactionCode = payloadObj.transId || payloadObj.vnp_BankTranNo || payloadObj.stripe_charge_id || `REF-${Date.now()}`
    let amount = Number(payloadObj.amount || payloadObj.vnp_Amount / 100 || 0)
    let paymentMethod: PaymentMethodType = 'QR Code'

    if (providerName.toLowerCase() === 'momo') paymentMethod = 'E-Wallet'
    else if (providerName.toLowerCase() === 'stripe') paymentMethod = 'Card'
    else if (providerName.toLowerCase() === 'paypal') paymentMethod = 'Balance'
    else if (providerName.toLowerCase() === 'payos') paymentMethod = 'Bank Transfer'

    const existingTxIdx = transactions.findIndex(t => t.orderCode === orderCode)
    let updatedTx = [...transactions]

    if (existingTxIdx > -1) {
      const updatedTxRecord = {
        ...transactions[existingTxIdx],
        status,
        responseMessage: resMsg,
        transactionCode: transactionCode || transactions[existingTxIdx].transactionCode,
        updatedAt: now
      }
      updatedTx[existingTxIdx] = updatedTxRecord
    } else {
      const newTxRecord: PaymentTransaction = {
        id: `PMT-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        orderId: orderCode, // Treat orderCode as orderId for fallback
        orderCode,
        paymentProviderId: providerId,
        paymentProviderName: providerName,
        amount: amount || 100000,
        currency: 'VND',
        transactionCode,
        paymentMethod,
        status,
        responseMessage: resMsg,
        createdAt: now,
        updatedAt: now
      }
      updatedTx = [newTxRecord, ...updatedTx]
    }

    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTx))
    setTransactions(updatedTx)

    // Sync back to ezsim_orders in localStorage
    try {
      const storedOrdersStr = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (storedOrdersStr) {
        const ordersData = JSON.parse(storedOrdersStr)
        const updatedOrdersData = ordersData.map((order: any) => {
          if (order.orderCode === orderCode) {
            return {
              ...order,
              paymentStatus: status === 'paid' ? 'paid' : 'error',
              orderStatus: status === 'paid' 
                ? (order.orderStatus === 'manual_processing' ? 'qr_code_esim' : order.orderStatus)
                : order.orderStatus,
              paymentInfo: {
                ...order.paymentInfo,
                provider: providerName,
                methodType: paymentMethod,
                transactionCode,
                amount: amount || order.finalAmount,
                status: status === 'paid' ? 'SUCCESS' : 'FAILED',
                paidAt: status === 'paid' ? new Date().toLocaleString('vi-VN') : undefined
              }
            }
          }
          return order
        })
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrdersData))
        // Dispatch orders_update event for other pages
        window.dispatchEvent(new Event('orders_update'))
      }
    } catch (err) {
      console.error('Failed to sync callback to orders', err)
    }

    triggerUpdate()
    return { success: true, message: `Thành công 200 OK: Đã xử lý callback cho đơn hàng ${orderCode}` }
  }, [providers, callbacks, transactions])

  // --- Refund transaction ---
  const refundTransaction = useCallback((id: string, reason: string) => {
    const now = new Date().toISOString()
    let orderCodeToSync = ''
    
    const updated = transactions.map(t => {
      if (t.id === id) {
        orderCodeToSync = t.orderCode
        return {
          ...t,
          status: 'refunded' as PaymentStatus,
          refundReason: reason || 'Hoàn tiền theo yêu cầu của Admin',
          responseMessage: `Giao dịch đã được hoàn tiền (Refunded) lúc ${new Date().toLocaleTimeString('vi-VN')}. Lý do: ${reason}`,
          updatedAt: now
        }
      }
      return t
    })

    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated))
    setTransactions(updated)

    // Sync back to orders
    if (orderCodeToSync) {
      try {
        const storedOrdersStr = localStorage.getItem(ORDERS_STORAGE_KEY)
        if (storedOrdersStr) {
          const ordersData = JSON.parse(storedOrdersStr)
          const updatedOrdersData = ordersData.map((order: any) => {
            if (order.orderCode === orderCodeToSync) {
              return {
                ...order,
                paymentStatus: 'refunded',
                paymentInfo: {
                  ...order.paymentInfo,
                  status: 'REFUNDED'
                }
              }
            }
            return order
          })
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrdersData))
          window.dispatchEvent(new Event('orders_update'))
        }
      } catch (err) {
        console.error('Failed to sync refund to orders', err)
      }
    }

    triggerUpdate()
  }, [transactions])

  return {
    providers,
    methods,
    transactions,
    callbacks,
    toggleProviderStatus,
    updateProviderSettings,
    toggleMethodStatus,
    updateMethodFees,
    simulateWebhookCallback,
    refundTransaction
  }
}
