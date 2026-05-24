import { useState, useEffect, useCallback } from 'react'
import { type Region, type Country } from '../types/telecom'

const REGIONS_STORAGE_KEY = 'ezsim_regions'
const COUNTRIES_STORAGE_KEY = 'ezsim_countries'

const initialRegions: Region[] = [
  {
    id: 'REG-001',
    name: 'Đông Nam Á (ASEAN)',
    code: 'asean',
    description: 'Các quốc gia thuộc khu vực Đông Nam Á',
    displayOrder: 1,
    status: true,
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'REG-002',
    name: 'Đông Bắc Á',
    code: 'east-asia',
    description: 'Nhật Bản, Hàn Quốc, Đài Loan, Trung Quốc',
    displayOrder: 2,
    status: true,
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'REG-003',
    name: 'Châu Âu (EU)',
    code: 'europe',
    description: 'Các quốc gia khu vực Châu Âu và Schengen',
    displayOrder: 3,
    status: true,
    isPublished: true,
    isFeatured: false,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'REG-004',
    name: 'Toàn Cầu (Multi-region)',
    code: 'global',
    description: 'Các gói cước sử dụng trên nhiều quốc gia/lục địa',
    displayOrder: 4,
    status: true,
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  }
]

const initialCountries: Country[] = [
  {
    id: 'CTR-001',
    regionId: 'REG-002',
    name: 'Nhật Bản',
    code: 'JP',
    flagEmoji: '🇯🇵',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'CTR-002',
    regionId: 'REG-002',
    name: 'Hàn Quốc',
    code: 'KR',
    flagEmoji: '🇰🇷',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'CTR-003',
    regionId: 'REG-001',
    name: 'Việt Nam',
    code: 'VN',
    flagEmoji: '🇻🇳',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'CTR-004',
    regionId: 'REG-001',
    name: 'Thái Lan',
    code: 'TH',
    flagEmoji: '🇹🇭',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'CTR-005',
    regionId: 'REG-001',
    name: 'Singapore',
    code: 'SG',
    flagEmoji: '🇸🇬',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'CTR-006',
    regionId: 'REG-004',
    name: 'Hoa Kỳ',
    code: 'US',
    flagEmoji: '🇺🇸',
    status: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z'
  }
]

export const useCountriesRegions = () => {
  const [regions, setRegions] = useState<Region[]>(() => {
    try {
      const stored = localStorage.getItem(REGIONS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse regions', e)
    }
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(initialRegions))
    return initialRegions
  })

  const [countries, setCountries] = useState<Country[]>(() => {
    try {
      const stored = localStorage.getItem(COUNTRIES_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse countries', e)
    }
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(initialCountries))
    return initialCountries
  })

  // Sync when changed
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedRegions = localStorage.getItem(REGIONS_STORAGE_KEY)
        const storedCountries = localStorage.getItem(COUNTRIES_STORAGE_KEY)
        if (storedRegions) setRegions(JSON.parse(storedRegions))
        if (storedCountries) setCountries(JSON.parse(storedCountries))
      } catch (e) {
        console.error('Failed to sync countries/regions', e)
      }
    }
    window.addEventListener('countries_regions_update', handleSync)
    return () => window.removeEventListener('countries_regions_update', handleSync)
  }, [])

  const triggerUpdate = () => {
    window.dispatchEvent(new Event('countries_regions_update'))
  }

  // --- Region Actions ---
  const addRegion = useCallback((regionData: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newRegion: Region = {
      ...regionData,
      id: `REG-${Date.now().toString().slice(-4)}`,
      createdAt: now,
      updatedAt: now
    }
    const updated = [...regions, newRegion]
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(updated))
    setRegions(updated)
    triggerUpdate()
    return newRegion
  }, [regions])

  const updateRegion = useCallback((id: string, regionData: Partial<Region>) => {
    const now = new Date().toISOString()
    const updated = regions.map(r => r.id === id ? { ...r, ...regionData, updatedAt: now } : r)
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(updated))
    setRegions(updated)
    triggerUpdate()
  }, [regions])

  const deleteRegion = useCallback((id: string) => {
    const updated = regions.filter(r => r.id !== id)
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(updated))
    setRegions(updated)
    triggerUpdate()
  }, [regions])

  // --- Country Actions ---
  const addCountry = useCallback((countryData: Omit<Country, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newCountry: Country = {
      ...countryData,
      id: `CTR-${Date.now().toString().slice(-4)}`,
      createdAt: now,
      updatedAt: now
    }
    const updated = [...countries, newCountry]
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(updated))
    setCountries(updated)
    triggerUpdate()
    return newCountry
  }, [countries])

  const updateCountry = useCallback((id: string, countryData: Partial<Country>) => {
    const now = new Date().toISOString()
    const updated = countries.map(c => c.id === id ? { ...c, ...countryData, updatedAt: now } : c)
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(updated))
    setCountries(updated)
    triggerUpdate()
  }, [countries])

  const deleteCountry = useCallback((id: string) => {
    const updated = countries.filter(c => c.id !== id)
    localStorage.setItem(COUNTRIES_STORAGE_KEY, JSON.stringify(updated))
    setCountries(updated)
    triggerUpdate()
  }, [countries])

  return {
    regions,
    countries,
    addRegion,
    updateRegion,
    deleteRegion,
    addCountry,
    updateCountry,
    deleteCountry
  }
}
