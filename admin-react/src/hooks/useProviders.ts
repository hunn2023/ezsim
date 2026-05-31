import { useState, useEffect, useCallback } from 'react'
import { type WholesalerProvider, type ProviderLog, type ProviderLogStatus } from '../types/provider'

const WHOLESALERS_KEY = 'ezsim_wholesalers'
const PROVIDER_LOGS_KEY = 'ezsim_provider_logs'
const PROVIDER_LOG_STATUS_KEY = 'ezsim_provider_log_statuses'
const INVENTORY_KEY = 'ezsim_inventory_items'
const INVENTORY_TX_KEY = 'ezsim_inventory_transactions'

const initialWholesalers: WholesalerProvider[] = [
  {
    id: 'WH-GIGSKY',
    name: 'GigSky',
    displayName: 'GigSky eSIM Wholesale Platform',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/GigSky_Logo.svg',
    apiBaseUrl: 'https://api.gigsky.com/v2/esim',
    apiKey: 'ggsk_live_api_key_8819230asdf921',
    balance: 1250.00,
    pingTimeMs: 42,
    isActive: true,
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T09:00:00Z'
  },
  {
    id: 'WH-KEEPGO',
    name: 'Keepgo',
    displayName: 'Keepgo Carrier API',
    logoUrl: 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_south_east,q_auto:eco,dpr_1/v1403258752/l3g7v54ucl2a51sh0iom.png',
    apiBaseUrl: 'https://api.keepgo.com/v1/provision',
    apiKey: 'kpg_prod_key_7719283asdf0021',
    balance: 480.50,
    pingTimeMs: 65,
    isActive: true,
    status: 'connected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T09:00:00Z'
  },
  {
    id: 'WH-TELNA',
    name: 'Telna',
    displayName: 'Telna Global MVNO API',
    logoUrl: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1415259972/uym2uoxluh0p87lggjgh.png',
    apiBaseUrl: 'https://api.telna.com/esim/v3',
    apiKey: 'tlna_live_key_9921827asdf0321',
    balance: 0.00, // Empty balance simulating failure
    pingTimeMs: 120,
    isActive: true,
    status: 'error',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T09:00:00Z'
  },
  {
    id: 'WH-JOYTEL',
    name: 'JoyTel',
    displayName: 'JoyTel Asia Telecom API',
    logoUrl: 'https://d12l99t29v10.cloudfront.net/images/partners/joytel.png',
    apiBaseUrl: 'https://api.joytel.sg/v1/esim',
    apiKey: 'jytl_sandbox_key_112039asdf29',
    balance: 120.00,
    pingTimeMs: 0,
    isActive: false, // Inactive
    status: 'disconnected',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T09:00:00Z'
  }
]

const initialLogs: ProviderLog[] = [
  {
    id: 'LOG-201',
    providerId: 'WH-GIGSKY',
    providerName: 'GigSky',
    categoryId: 'REG-002',
    variantId: 'SIM-001',
    variantName: '098.888.8888 (Viettel)',
    type: 'purchase_esim',
    content: 'Đã hoàn tất mua eSIM V120N cho Đơn hàng #ORD-882910 thành công qua GigSky API.',
    status: true,
    createdAt: '2026-05-18T14:32:10Z',
    updatedAt: '2026-05-18T14:32:10Z'
  },
  {
    id: 'LOG-202',
    providerId: 'WH-TELNA',
    providerName: 'Telna',
    categoryId: 'REG-001',
    variantId: 'SIM-003',
    variantName: '090.333.3999 (Mobifone)',
    type: 'purchase_esim',
    content: 'Yêu cầu mua gói eSIM Mobifone cho Đơn hàng #ORD-882912 bị từ chối do Wholesaler Telna hết số dư tài khoản.',
    status: false,
    createdAt: '2026-05-17T16:45:00Z',
    updatedAt: '2026-05-17T16:45:00Z'
  },
  {
    id: 'LOG-203',
    providerId: 'WH-KEEPGO',
    providerName: 'Keepgo',
    categoryId: 'REG-001',
    variantId: 'SIM-003',
    variantName: '090.333.3999 (Mobifone)',
    type: 'topup_plan',
    content: 'Lỗi Timeout 504 kết nối đến Keepgo Server khi gia hạn gói cước US ST100K.',
    status: false,
    createdAt: '2026-05-16T10:00:00Z',
    updatedAt: '2026-05-16T10:00:00Z'
  },
  {
    id: 'LOG-204',
    providerId: 'WH-GIGSKY',
    providerName: 'GigSky',
    categoryId: 'REG-004',
    variantId: 'SIM-004',
    variantName: '055.999.9686 (Wintel)',
    type: 'query_balance',
    content: 'Kiểm tra hạn ngạch tài khoản GigSky wholesale định kỳ thành công. Số dư khả dụng: $1,250.00.',
    status: true,
    createdAt: '2026-05-24T08:00:00Z',
    updatedAt: '2026-05-24T08:00:00Z'
  }
]

const initialLogStatuses: ProviderLogStatus[] = [
  {
    id: 'STAT-201',
    providerId: 'WH-GIGSKY',
    providerName: 'GigSky',
    requestId: 'req_gigsky_99182390a',
    responseBody: '{"status":"success","transactionId":"TX_GIGSKY_9910","esim":{"iccid":"8984040000001234567","lpaString":"LPA:1$rsp.gigsky.com$PROD_TOKEN_ORD882910","qrcodeUrl":"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LPA:1$rsp.gigsky.com$PROD_TOKEN_ORD882910"},"billing":{"cost":12.50,"currency":"USD","remainingBalance":1250.00}}',
    statusCode: 200,
    createdAt: '2026-05-18T14:32:10Z'
  },
  {
    id: 'STAT-202',
    providerId: 'WH-TELNA',
    providerName: 'Telna',
    requestId: 'req_telna_11029381b',
    responseBody: '{"error":{"code":"INSUFFICIENT_FUNDS","message":"Your wholesale account balance is $0.00. The requested eSIM profile costs $15.00. Please top-up to proceed.","requestId":"req_telna_11029381b"}}',
    statusCode: 402,
    createdAt: '2026-05-17T16:45:00Z'
  },
  {
    id: 'STAT-203',
    providerId: 'WH-KEEPGO',
    providerName: 'Keepgo',
    requestId: 'req_keepgo_88192301c',
    responseBody: '<html><head><title>504 Gateway Time-out</title></head><body><center><h1>504 Gateway Time-out</h1></center><hr><center>nginx/1.25.0</center></body></html>',
    statusCode: 504,
    createdAt: '2026-05-16T10:00:00Z'
  },
  {
    id: 'STAT-204',
    providerId: 'WH-GIGSKY',
    providerName: 'GigSky',
    requestId: 'req_gigsky_quota_992a',
    responseBody: '{"status":"success","account":{"id":"ACC-9921","name":"EZSim Vietnam","quota":{"limit":5000.00,"used":3750.00,"available":1250.00}}}',
    statusCode: 200,
    createdAt: '2026-05-24T08:00:00Z'
  }
]

export const useProviders = () => {
  const [providers, setProviders] = useState<WholesalerProvider[]>(() => {
    try {
      const stored = localStorage.getItem(WHOLESALERS_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse wholesalers', e)
    }
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(initialWholesalers))
    return initialWholesalers
  })

  const [logs, setLogs] = useState<ProviderLog[]>(() => {
    try {
      const stored = localStorage.getItem(PROVIDER_LOGS_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse provider logs', e)
    }
    localStorage.setItem(PROVIDER_LOGS_KEY, JSON.stringify(initialLogs))
    return initialLogs
  })

  const [statuses, setStatuses] = useState<ProviderLogStatus[]>(() => {
    try {
      const stored = localStorage.getItem(PROVIDER_LOG_STATUS_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse provider log statuses', e)
    }
    localStorage.setItem(PROVIDER_LOG_STATUS_KEY, JSON.stringify(initialLogStatuses))
    return initialLogStatuses
  })

  // Sync localStorage changes
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedWh = localStorage.getItem(WHOLESALERS_KEY)
        const storedLogs = localStorage.getItem(PROVIDER_LOGS_KEY)
        const storedStats = localStorage.getItem(PROVIDER_LOG_STATUS_KEY)

        if (storedWh) setProviders(JSON.parse(storedWh))
        if (storedLogs) setLogs(JSON.parse(storedLogs))
        if (storedStats) setStatuses(JSON.parse(storedStats))
      } catch (e) {
        console.error('Failed to sync providers storage', e)
      }
    }
    window.addEventListener('providers_update', handleSync)
    return () => window.removeEventListener('providers_update', handleSync)
  }, [])

  const triggerUpdate = () => {
    window.dispatchEvent(new Event('providers_update'))
  }

  // --- Provider actions ---
  const toggleProviderStatus = useCallback((id: string) => {
    const updated = providers.map(p => p.id === id ? { ...p, isActive: !p.isActive, status: !p.isActive ? 'connected' : 'disconnected' as any, updatedAt: new Date().toISOString() } : p)
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
  }, [providers])

  const updateProviderSettings = useCallback((id: string, updates: { apiBaseUrl: string; apiKey: string }) => {
    const updated = providers.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
  }, [providers])

  const topupProviderBalance = useCallback((id: string, amount: number) => {
    const updated = providers.map(p => {
      if (p.id === id) {
        const updatedBalance = p.balance + amount
        return {
          ...p,
          balance: updatedBalance,
          status: updatedBalance > 0 ? 'connected' as any : p.status,
          updatedAt: new Date().toISOString()
        }
      }
      return p
    })
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
  }, [providers])

  // Instant latency ping simulation
  const pingProviderApi = useCallback((id: string) => {
    const target = providers.find(p => p.id === id)
    if (!target) return

    const isConnected = target.isActive
    const latency = isConnected ? Math.floor(30 + Math.random() * 150) : 0
    const apiStatus = isConnected ? (target.balance > 0 ? 'connected' : 'error') : 'disconnected'

    const updated = providers.map(p => p.id === id ? { ...p, pingTimeMs: latency, status: apiStatus as any, updatedAt: new Date().toISOString() } : p)
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(updated))
    setProviders(updated)
    triggerUpdate()
    return latency
  }, [providers])

  // --- Reprovisioning (Retry connection & push generated ICCID/eSIM QR code profile to Inventory) ---
  const reprovisionEsim = useCallback((logId: string) => {
    const logObj = logs.find(l => l.id === logId)
    if (!logObj) return { success: false, message: 'Không tìm thấy nhật ký kết nối.' }

    const provider = providers.find(p => p.id === logObj.providerId)
    if (!provider) return { success: false, message: 'Nhà bán buôn không khả dụng.' }

    // Check balance
    const cost = 15.00 // Standard eSIM wholesale purchase cost
    if (provider.balance < cost) {
      return {
        success: false,
        message: `Số dư tài khoản Wholesaler ${provider.name} không đủ để cấp phát lại eSIM ($${provider.balance.toFixed(2)} < $${cost.toFixed(2)}). Vui lòng nạp tiền trước!`
      }
    }

    const now = new Date().toISOString()
    const newIccid = `89840${Date.now().toString()}${Math.floor(10 + Math.random() * 90)}`
    const newLpa = `LPA:1$rsp.${provider.name.toLowerCase()}.com$REPROV_TOKEN_${Date.now().toString().slice(-6)}`

    // 1. Deduct Wholesaler balance
    const updatedWholesalers = providers.map(p => {
      if (p.id === provider.id) {
        return {
          ...p,
          balance: p.balance - cost,
          status: (p.balance - cost) > 0 ? 'connected' as any : 'error' as any,
          updatedAt: now
        }
      }
      return p
    })
    localStorage.setItem(WHOLESALERS_KEY, JSON.stringify(updatedWholesalers))
    setProviders(updatedWholesalers)

    // 2. Update ProviderLog status to true
    const updatedLogs = logs.map(l => {
      if (l.id === logId) {
        return {
          ...l,
          status: true,
          content: `[Cấp phát lại thành công] Mua eSIM thành công qua API ${provider.name}. Mã phôi mới: ${newIccid}.`,
          updatedAt: now
        }
      }
      return l
    })
    localStorage.setItem(PROVIDER_LOGS_KEY, JSON.stringify(updatedLogs))
    setLogs(updatedLogs)

    // 3. Update ProviderLogStatus to 201 Created and success ResponseBody
    const newResponse = {
      status: 'success',
      action: 'reprovision',
      requestId: `req_${provider.name.toLowerCase()}_reprov_${Date.now().toString().slice(-4)}`,
      esim: {
        iccid: newIccid,
        lpaString: newLpa,
        qrcodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(newLpa)}`
      },
      billing: {
        cost,
        currency: 'USD',
        remainingBalance: provider.balance - cost
      }
    }

    const updatedStatuses = statuses.map(s => {
      if (s.providerId === provider.id && s.createdAt === logObj.createdAt) {
        return {
          ...s,
          statusCode: 201,
          responseBody: JSON.stringify(newResponse),
          createdAt: now
        }
      }
      return s
    })
    localStorage.setItem(PROVIDER_LOG_STATUS_KEY, JSON.stringify(updatedStatuses))
    setStatuses(updatedStatuses)

    // 4. CRITICAL INTEGRATION: Automatically insert the provisioned eSIM profile into Kho hàng chi tiết (Inventory)
    try {
      const storedInvStr = localStorage.getItem(INVENTORY_KEY)
      const storedTxStr = localStorage.getItem(INVENTORY_TX_KEY)

      if (storedInvStr) {
        const invItems = JSON.parse(storedInvStr)
        const invTx = storedTxStr ? JSON.parse(storedTxStr) : []

        // Generate clean carrier from variantName (defaults to Viettel if not match)
        let carrier: any = 'Viettel'
        if (logObj.variantName.toLowerCase().includes('mobifone')) carrier = 'Mobifone'
        else if (logObj.variantName.toLowerCase().includes('vinaphone')) carrier = 'Vinaphone'
        else if (logObj.variantName.toLowerCase().includes('wintel')) carrier = 'Wintel'

        const newItemId = `INV-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`
        
        const newInvItem = {
          id: newItemId,
          productVariantId: logObj.variantId,
          productName: logObj.variantName,
          type: 'sim',
          carrier,
          serialNumber: newIccid,
          pinCode: newLpa, // LPA string profiles serve as eSIM activations
          status: 'available',
          importedAt: now
        }

        const newTx = {
          id: `TX-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          inventoryItemId: newItemId,
          productVariantId: logObj.variantId,
          productName: logObj.variantName,
          transactionType: 'import',
          quantity: 1,
          note: `Nhập phôi eSIM tự động qua Cấp phát lại API (${provider.name})`,
          createdAt: now
        }

        localStorage.setItem(INVENTORY_KEY, JSON.stringify([newInvItem, ...invItems]))
        localStorage.setItem(INVENTORY_TX_KEY, JSON.stringify([newTx, ...invTx]))

        // Dispatch storage update for inventory sync
        window.dispatchEvent(new Event('inventory_update'))
      }
    } catch (err) {
      console.error('Failed to auto-insert reprovisioned eSIM to inventory', err)
    }

    triggerUpdate()
    return { success: true, message: `Thành công: Đã cấp phát lại eSIM! Số dư tài khoản ${provider.name} giảm $${cost.toFixed(2)}. Phôi mới đã được chèn vào Kho.` }
  }, [providers, logs, statuses])

  return {
    providers,
    logs,
    statuses,
    toggleProviderStatus,
    updateProviderSettings,
    topupProviderBalance,
    pingProviderApi,
    reprovisionEsim
  }
}
