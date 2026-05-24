import { useState, useEffect, useCallback } from 'react'
import { type InventoryItem, type InventoryTransaction, type CarrierType, type InventoryItemStatus } from '../types/telecom'

const INVENTORY_STORAGE_KEY = 'ezsim_inventory_items'
const TRANSACTIONS_STORAGE_KEY = 'ezsim_inventory_transactions'

const initialInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    productVariantId: 'SIM-001',
    productName: '098.888.8888 (Viettel)',
    type: 'sim',
    carrier: 'Viettel',
    serialNumber: '8984040000001234567',
    status: 'available',
    importedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'INV-002',
    productVariantId: 'SIM-001',
    productName: '098.888.8888 (Viettel)',
    type: 'sim',
    carrier: 'Viettel',
    serialNumber: '8984040000001234568',
    status: 'sold',
    importedAt: '2026-05-01T10:00:00Z',
    usedAt: '2026-05-15T12:00:00Z'
  },
  {
    id: 'INV-003',
    productVariantId: 'SIM-003',
    productName: '090.333.3999 (Mobifone)',
    type: 'sim',
    carrier: 'Mobifone',
    serialNumber: '8984010000009876543',
    status: 'locked',
    importedAt: '2026-05-03T14:30:00Z'
  },
  {
    id: 'INV-004',
    productVariantId: 'CARD-001',
    productName: 'Thẻ nạp thoại Viettel 100k',
    type: 'card',
    carrier: 'Viettel',
    serialNumber: '1000123456789',
    pinCode: '1234567890123',
    status: 'available',
    expirationDate: '2028-12-31T23:59:59Z',
    importedAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'INV-005',
    productVariantId: 'CARD-001',
    productName: 'Thẻ nạp thoại Viettel 100k',
    type: 'card',
    carrier: 'Viettel',
    serialNumber: '1000123456790',
    pinCode: '1234567890124',
    status: 'available',
    expirationDate: '2028-12-31T23:59:59Z',
    importedAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'INV-006',
    productVariantId: 'CARD-003',
    productName: 'Thẻ nạp thoại Vinaphone 100k',
    type: 'card',
    carrier: 'Vinaphone',
    serialNumber: '2000987654321',
    pinCode: '9876543210987',
    status: 'sold',
    expirationDate: '2028-12-31T23:59:59Z',
    importedAt: '2026-05-02T09:00:00Z',
    usedAt: '2026-05-18T10:15:00Z'
  }
]

const initialTransactions: InventoryTransaction[] = [
  {
    id: 'TX-001',
    inventoryItemId: 'INV-001',
    productVariantId: 'SIM-001',
    productName: '098.888.8888 (Viettel)',
    transactionType: 'import',
    quantity: 1,
    note: 'Nhập phôi SIM mới cho số 098.888.8888',
    createdAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'TX-002',
    inventoryItemId: 'INV-002',
    productVariantId: 'SIM-001',
    productName: '098.888.8888 (Viettel)',
    transactionType: 'export',
    quantity: 1,
    note: 'Giao số SIM cho đơn hàng #ORD-10029',
    createdAt: '2026-05-15T12:00:00Z'
  },
  {
    id: 'TX-003',
    inventoryItemId: 'INV-004',
    productVariantId: 'CARD-001',
    productName: 'Thẻ nạp thoại Viettel 100k',
    transactionType: 'import',
    quantity: 1,
    note: 'Nhập kho lô thẻ cào tháng 5',
    createdAt: '2026-05-01T08:00:00Z'
  }
]

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse inventory items', e)
    }
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialInventoryItems))
    return initialInventoryItems
  })

  const [transactions, setTransactions] = useState<InventoryTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse transactions', e)
    }
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialTransactions))
    return initialTransactions
  })

  // Sync state
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedInv = localStorage.getItem(INVENTORY_STORAGE_KEY)
        const storedTx = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
        if (storedInv) setInventoryItems(JSON.parse(storedInv))
        if (storedTx) setTransactions(JSON.parse(storedTx))
      } catch (e) {
        console.error('Failed to sync inventory', e)
      }
    }
    window.addEventListener('inventory_update', handleSync)
    return () => window.removeEventListener('inventory_update', handleSync)
  }, [])

  const triggerUpdate = () => {
    window.dispatchEvent(new Event('inventory_update'))
  }

  const saveInventory = (updatedItems: InventoryItem[]) => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedItems))
    setInventoryItems(updatedItems)
    triggerUpdate()
  }

  const saveTransactions = (updatedTx: InventoryTransaction[]) => {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTx))
    setTransactions(updatedTx)
    triggerUpdate()
  }

  // --- Bulk Import ---
  const bulkImport = useCallback((
    productVariantId: string,
    productName: string,
    type: 'sim' | 'card',
    carrier: CarrierType,
    itemsToImport: { serialNumber: string; pinCode?: string; expirationDate?: string }[],
    note: string
  ) => {
    const now = new Date().toISOString()
    const newItems: InventoryItem[] = itemsToImport.map((item, index) => ({
      id: `INV-${Date.now().toString().slice(-4)}-${index}`,
      productVariantId,
      productName,
      type,
      carrier,
      serialNumber: item.serialNumber,
      pinCode: item.pinCode,
      expirationDate: item.expirationDate,
      status: 'available',
      importedAt: now
    }))

    const newTransactions: InventoryTransaction[] = newItems.map(item => ({
      id: `TX-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 4)}`,
      inventoryItemId: item.id,
      productVariantId,
      productName,
      transactionType: 'import',
      quantity: 1,
      note: note || `Nhập kho lô ${type === 'sim' ? 'SIM' : 'Thẻ cào'}`,
      createdAt: now
    }))

    const updatedItems = [...newItems, ...inventoryItems]
    const updatedTx = [...newTransactions, ...transactions]

    saveInventory(updatedItems)
    saveTransactions(updatedTx)

    // Optional: We can update the stock count of the corresponding card product in localStorage as well!
    if (type === 'card') {
      try {
        const telecomKey = 'ezsim_telecom_products'
        const storedProducts = localStorage.getItem(telecomKey)
        if (storedProducts) {
          const products = JSON.parse(storedProducts)
          const updatedProducts = products.map((p: any) => {
            if (p.id === productVariantId) {
              return { ...p, stockCount: (p.stockCount || 0) + itemsToImport.length }
            }
            return p
          })
          localStorage.setItem(telecomKey, JSON.stringify(updatedProducts))
          window.dispatchEvent(new Event('telecom_products_update'))
        }
      } catch (err) {
        console.error('Failed to update product stock count during import', err)
      }
    }

    return newItems.length
  }, [inventoryItems, transactions])

  // --- Update Item Status ---
  const updateItemStatus = useCallback((id: string, status: InventoryItemStatus, note?: string) => {
    const now = new Date().toISOString()
    const updatedItems = inventoryItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, status }
        if (status === 'sold') {
          updated.usedAt = now
        }
        return updated
      }
      return item
    })

    const targetItem = inventoryItems.find(item => item.id === id)
    if (targetItem && targetItem.status !== status) {
      const newTx: InventoryTransaction = {
        id: `TX-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 4)}`,
        inventoryItemId: id,
        productVariantId: targetItem.productVariantId,
        productName: targetItem.productName,
        transactionType: 'adjust',
        quantity: 1,
        note: note || `Điều chỉnh trạng thái từ ${targetItem.status} sang ${status}`,
        createdAt: now
      }
      saveTransactions([newTx, ...transactions])
    }

    saveInventory(updatedItems)
  }, [inventoryItems, transactions])

  // --- Delete Item ---
  const deleteItem = useCallback((id: string) => {
    const updated = inventoryItems.filter(item => item.id !== id)
    saveInventory(updated)
  }, [inventoryItems])

  return {
    inventoryItems,
    transactions,
    bulkImport,
    updateItemStatus,
    deleteItem
  }
}
