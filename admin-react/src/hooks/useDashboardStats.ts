import { useMemo } from 'react'
import { useTelecomProducts } from './useTelecomProducts'
import { useInventory } from './useInventory'
import { orders } from '@/views/ecommerce/orders/data'
import type { CarrierType } from '@/types/telecom'

export interface DashboardStats {
  // Revenue
  totalRevenueTodayVND: number
  totalRevenueMonthVND: number
  revenueGrowthPercent: number

  // Orders
  totalOrdersToday: number
  totalOrdersMonth: number
  pendingOrders: number
  cancelledOrders: number

  // Inventory
  simAvailableCount: number
  simSoldCount: number
  cardAvailableCount: number
  cardSoldCount: number

  // Products
  totalSimProducts: number
  totalCardProducts: number

  // Chart data: daily revenue for current month (30 days)
  dailyRevenueData: number[]
  dailyOrdersData: number[]

  // Carrier breakdown (inventory)
  carrierStats: { carrier: CarrierType; simCount: number; cardCount: number }[]

  // Recent orders (latest 5)
  recentOrders: typeof orders
}

// Generate deterministic seeded random
const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export const useDashboardStats = (): DashboardStats => {
  const { simProducts, cardProducts } = useTelecomProducts()
  const { inventoryItems } = useInventory()

  return useMemo<DashboardStats>(() => {
    // ── Inventory breakdown ──────────────────────────────────
    const simItems = inventoryItems.filter((i) => i.type === 'sim')
    const cardItems = inventoryItems.filter((i) => i.type === 'card')

    const simAvailableCount = simItems.filter((i) => i.status === 'available').length
    const simSoldCount = simItems.filter((i) => i.status === 'sold').length
    const cardAvailableCount = cardItems.filter((i) => i.status === 'available').length
    const cardSoldCount = cardItems.filter((i) => i.status === 'sold').length

    // ── Carrier stats ─────────────────────────────────────────
    const carriersSet = new Set<CarrierType>([
      'Viettel', 'Vinaphone', 'Mobifone', 'Vietnamobile', 'iTel', 'Wintel',
    ])
    const carrierStats = Array.from(carriersSet).map((carrier) => ({
      carrier,
      simCount: simItems.filter((i) => i.carrier === carrier && i.status === 'available').length,
      cardCount: cardItems.filter((i) => i.carrier === carrier && i.status === 'available').length,
    }))

    // ── Orders stats ──────────────────────────────────────────
    const today = new Date()
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`

    const todayOrders = orders.filter((o) => o.date === todayStr)
    const totalOrdersToday = todayOrders.length

    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    const monthOrders = orders.filter((o) => {
      const parts = o.date.split('/')
      return parseInt(parts[1]) === currentMonth && parseInt(parts[2]) === currentYear
    })
    const totalOrdersMonth = monthOrders.length
    const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending' || o.paymentStatus === 'processing').length
    const cancelledOrders = orders.filter((o) => o.paymentStatus === 'cancelled').length

    // ── Revenue ───────────────────────────────────────────────
    const totalRevenueTodayVND = todayOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0)

    const totalRevenueMonthVND = monthOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0)

    // If real data is 0 (mock dates don't match today), use seeded mock totals
    const revenueMonth = totalRevenueMonthVND > 0 ? totalRevenueMonthVND : 345_800_000
    const revenueGrowthPercent = 15.4

    // ── Daily chart data (30 days, seeded random) ─────────────
    const dailyRevenueData = Array.from({ length: 30 }, (_, i) => {
      const base = 8_000_000 + seededRand(i * 7) * 22_000_000
      return Math.round(base / 1_000_000) * 1_000_000
    })
    const dailyOrdersData = Array.from({ length: 30 }, (_, i) => {
      return Math.round(2 + seededRand(i * 13) * 18)
    })

    // ── Recent orders ──────────────────────────────────────────
    const recentOrders = [...orders].slice(0, 5)

    return {
      totalRevenueTodayVND: totalRevenueTodayVND > 0 ? totalRevenueTodayVND : 24_500_000,
      totalRevenueMonthVND: revenueMonth,
      revenueGrowthPercent,
      totalOrdersToday: totalOrdersToday > 0 ? totalOrdersToday : 7,
      totalOrdersMonth: totalOrdersMonth > 0 ? totalOrdersMonth : 312,
      pendingOrders: pendingOrders > 0 ? pendingOrders : 18,
      cancelledOrders: cancelledOrders > 0 ? cancelledOrders : 5,
      simAvailableCount,
      simSoldCount,
      cardAvailableCount,
      cardSoldCount,
      totalSimProducts: simProducts.length,
      totalCardProducts: cardProducts.length,
      dailyRevenueData,
      dailyOrdersData,
      carrierStats,
      recentOrders,
    }
  }, [simProducts, cardProducts, inventoryItems])
}
