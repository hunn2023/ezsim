export type CarrierType =
  | 'Viettel'
  | 'Vinaphone'
  | 'Mobifone'
  | 'Vietnamobile'
  | 'iTel'
  | 'Wintel'
  | 'Garena'
  | 'Zing'

export type SimCategory = 'Số đẹp' | 'Data 4G/5G' | 'Du lịch'
export type SimFormat = 'Vật lý' | 'eSIM'
export type SimStatus = 'available' | 'reserved' | 'sold' | 'locked'

export interface SimAttributes {
  totalPoints?: number
  element?: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'
  headCode?: string
  tailCode?: string
}

export interface SimProduct {
  id: string
  type: 'sim'
  simNumber: string
  carrier: CarrierType
  category: SimCategory
  format: SimFormat
  dataPlan: string
  price: number
  originalPrice: number
  status: SimStatus
  attributes?: SimAttributes
  highlightFeatures: string[]
  createdAt: string
  updatedAt: string
}

export type CardType = 'topup' | 'data'
export type CardStatus = 'available' | 'out_of_stock' | 'locked'

export interface CardProduct {
  id: string
  type: 'card'
  carrier: CarrierType
  faceValue: number
  price: number
  discountRate: number
  cardType: CardType
  stockCount: number
  dataPlanDescription?: string
  status: CardStatus
  createdAt: string
  updatedAt: string
}

export type TelecomProduct = SimProduct | CardProduct

export interface Region {
  id: string
  name: string
  code: string
  description?: string
  displayOrder: number
  status: boolean
  isPublished: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface Country {
  id: string
  regionId: string // FK
  name: string
  code: string // ISO code (e.g. JP, KR)
  flagEmoji: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export type InventoryItemStatus = 'available' | 'sold' | 'expired' | 'locked'

export interface InventoryItem {
  id: string
  productVariantId: string // ID of SIM product or Card product
  productName: string // Cache product name for easy display
  type: 'sim' | 'card' // eSIM/SIM vs Game Card/Phone Card
  carrier: CarrierType
  serialNumber: string
  pinCode?: string // Only for cards
  expirationDate?: string // Only for cards/some eSIM packages
  status: InventoryItemStatus
  importedAt: string
  usedAt?: string
}

export type TransactionType = 'import' | 'export' | 'adjust'

export interface InventoryTransaction {
  id: string
  inventoryItemId: string
  productVariantId: string
  productName: string
  transactionType: TransactionType
  quantity: number
  note: string
  createdAt: string
}

