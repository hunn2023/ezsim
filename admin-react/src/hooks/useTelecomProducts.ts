import { useState, useEffect, useCallback } from 'react'
import { type CardProduct, type SimProduct, type TelecomProduct } from '../types/telecom'
import { initialTelecomProducts } from '../data/mockTelecom'

const STORAGE_KEY = 'ezsim_telecom_products'

export const useTelecomProducts = () => {
  const [products, setProducts] = useState<TelecomProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (err) {
      console.error('Failed to load telecom products from localStorage:', err)
    }
    localStorage.setItem(STORAGE_KEY, JSON.parse(JSON.stringify(initialTelecomProducts)))
    return initialTelecomProducts
  })

  // Sync state when localStorage changes across tabs or other components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setProducts(JSON.parse(stored))
        }
      } catch (err) {
        console.error('Error handling storage change:', err)
      }
    }

    window.addEventListener('telecom_products_update', handleStorageChange)
    return () => {
      window.removeEventListener('telecom_products_update', handleStorageChange)
    }
  }, [])

  const saveToStorage = useCallback((updatedList: TelecomProduct[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
      setProducts(updatedList)
      window.dispatchEvent(new Event('telecom_products_update'))
    } catch (err) {
      console.error('Failed to save telecom products to localStorage:', err)
    }
  }, [])

  const addProduct = useCallback(
    (productData: Omit<TelecomProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const newId = `${productData.type.toUpperCase()}-${Date.now().toString().slice(-6)}`
      const newProduct: TelecomProduct = {
        ...productData,
        id: newId,
        createdAt: now,
        updatedAt: now,
      } as TelecomProduct

      saveToStorage([newProduct, ...products])
      return newProduct
    },
    [products, saveToStorage]
  )

  const updateProduct = useCallback(
    (id: string, productData: Partial<TelecomProduct>) => {
      const now = new Date().toISOString()
      const updatedList = products.map((prod) =>
        prod.id === id ? ({ ...prod, ...productData, updatedAt: now } as TelecomProduct) : prod
      )
      saveToStorage(updatedList)
    },
    [products, saveToStorage]
  )

  const deleteProduct = useCallback(
    (id: string) => {
      const updatedList = products.filter((prod) => prod.id !== id)
      saveToStorage(updatedList)
    },
    [products, saveToStorage]
  )

  const deleteMultipleProducts = useCallback(
    (ids: string[]) => {
      const idSet = new Set(ids)
      const updatedList = products.filter((prod) => !idSet.has(prod.id))
      saveToStorage(updatedList)
    },
    [products, saveToStorage]
  )

  const resetToInitial = useCallback(() => {
    saveToStorage([...initialTelecomProducts])
  }, [saveToStorage])

  const simProducts = products.filter((prod): prod is SimProduct => prod.type === 'sim')
  const cardProducts = products.filter((prod): prod is CardProduct => prod.type === 'card')

  return {
    products,
    simProducts,
    cardProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    resetToInitial,
  }
}
