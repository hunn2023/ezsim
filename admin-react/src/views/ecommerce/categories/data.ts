import product1 from '@/assets/images/products/1.png'
import product2 from '@/assets/images/products/2.png'
import product3 from '@/assets/images/products/3.png'
import product4 from '@/assets/images/products/4.png'
import product5 from '@/assets/images/products/5.png'

export type CategoryStatus = 'Active' | 'Inactive'

export type CategoryType = {
  id: number
  name: string
  slug: string
  image: string
  products: number
  orders: string
  earnings: string
  lastModified: string
  lastModifiedTime: string
  status: CategoryStatus
}

export const categoriesData: CategoryType[] = [
  {
    id: 1,
    name: 'eSIM (Sim điện tử)',
    slug: 'esim',
    image: product1,
    products: 450,
    orders: '12.5k',
    earnings: '$180,450',
    lastModified: '27 May, 2026',
    lastModifiedTime: '10:15 AM',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Phone Card (Thẻ nạp)',
    slug: 'phone-card',
    image: product2,
    products: 120,
    orders: '8.4k',
    earnings: '$95,300',
    lastModified: '27 May, 2026',
    lastModifiedTime: '11:20 AM',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Physical SIM (Sim vật lý)',
    slug: 'physical-sim',
    image: product3,
    products: 350,
    orders: '6.2k',
    earnings: '$78,120',
    lastModified: '26 May, 2026',
    lastModifiedTime: '04:30 PM',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Add-on / Data Pack (Gói cước phụ)',
    slug: 'data-pack',
    image: product4,
    products: 95,
    orders: '15.1k',
    earnings: '$120,900',
    lastModified: '25 May, 2026',
    lastModifiedTime: '09:00 AM',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Voucher (Mã ưu đãi)',
    slug: 'voucher',
    image: product5,
    products: 45,
    orders: '2.3k',
    earnings: '$15,650',
    lastModified: '24 May, 2026',
    lastModifiedTime: '02:15 PM',
    status: 'Active',
  },
]
