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
