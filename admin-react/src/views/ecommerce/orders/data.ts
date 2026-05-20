import type { IconType } from 'react-icons'
import { TbCheck, TbClock, TbDeviceSim, TbQrcode, TbTruck, TbX } from 'react-icons/tb'

import user1 from '@/assets/images/users/user-1.jpg'
import user10 from '@/assets/images/users/user-10.jpg'
import user2 from '@/assets/images/users/user-2.jpg'
import user3 from '@/assets/images/users/user-3.jpg'
import user4 from '@/assets/images/users/user-4.jpg'
import user5 from '@/assets/images/users/user-5.jpg'
import user6 from '@/assets/images/users/user-6.jpg'
import user7 from '@/assets/images/users/user-7.jpg'
import user8 from '@/assets/images/users/user-8.jpg'
import user9 from '@/assets/images/users/user-9.jpg'

export type OrderStatisticsType = {
  title: string
  count: string | number
  change: string
  icon: IconType
  variant: string
}

export type OrderItemType = {
  id: string
  productId: string
  productName: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  productType: 'sim' | 'card'
  carrier: 'Viettel' | 'Vinaphone' | 'Mobifone' | 'Wintel' | 'Vietnamobile' | 'iTel'
}

export type PaymentTransactionInfo = {
  provider: 'VNPay' | 'MoMo' | 'ZaloPay' | 'VietQR' | 'Visa/Mastercard'
  methodType: 'E-Wallet' | 'Bank Transfer' | 'QR Code' | 'Card' | 'Balance'
  transactionCode: string
  amount: number
  currency: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED'
  paidAt?: string
}

export type OrderStatusType = 'qr_code_esim' | 'activation_code' | 'manual_processing' | 'physical_sim_shipping' | 'delivered' | 'cancelled'
export type PaymentStatusType = 'pending' | 'processing' | 'paid' | 'error' | 'cancelled' | 'refunded'

export type OrderType = {
  id: string
  orderCode: string
  date: string
  time: string
  customer: {
    id: string
    name: string
    avatar: string
    phone: string
    email: string
  }
  items: OrderItemType[]
  totalAmount: number
  discountAmount: number
  shippingFee: number
  finalAmount: number
  currency: string
  paymentStatus: PaymentStatusType
  orderStatus: OrderStatusType
  paymentInfo: PaymentTransactionInfo
  shippingAddress?: {
    fullName: string
    phone: string
    address: string
    province: string
    district: string
    ward: string
  }
  note?: string
}

export const orderStats: OrderStatisticsType[] = [
  {
    title: 'Tổng doanh thu',
    count: '345.8M VNĐ',
    change: '+15.4',
    icon: TbCheck,
    variant: 'success',
  },
  {
    title: 'Đơn thành công (Paid)',
    count: 1420,
    change: '+8.2',
    icon: TbQrcode,
    variant: 'primary',
  },
  {
    title: 'Đang xử lý / Chờ chuyển khoản',
    count: 85,
    change: '-2.5',
    icon: TbClock,
    variant: 'warning',
  },
  {
    title: 'Đang giao SIM vật lý',
    count: 142,
    change: '+5.0',
    icon: TbTruck,
    variant: 'info',
  },
  {
    title: 'Đơn đã hủy / Hoàn tiền',
    count: 36,
    change: '-1.2',
    icon: TbX,
    variant: 'danger',
  },
]

export const orders: OrderType[] = [
  {
    id: 'ORD-882910',
    orderCode: 'ORD-882910',
    date: '18/05/2026',
    time: '14:30',
    customer: {
      id: 'CUST-001',
      name: 'Nguyễn Văn An',
      avatar: user2,
      phone: '0987123456',
      email: 'nguyenvanan@gmail.com',
    },
    items: [
      {
        id: 'ITEM-01',
        productId: 'SIM-001',
        productName: 'SIM Số Đẹp Viettel 098.888.8888',
        variantName: 'Gói V120N - 4GB/ngày',
        quantity: 1,
        unitPrice: 125000000,
        totalPrice: 125000000,
        productType: 'sim',
        carrier: 'Viettel',
      },
    ],
    totalAmount: 125000000,
    discountAmount: 5000000,
    shippingFee: 0, // Freeship
    finalAmount: 120000000,
    currency: 'VND',
    paymentStatus: 'paid',
    orderStatus: 'physical_sim_shipping',
    paymentInfo: {
      provider: 'VNPay',
      methodType: 'QR Code',
      transactionCode: 'VNPAY-992103821',
      amount: 120000000,
      currency: 'VND',
      status: 'SUCCESS',
      paidAt: '18/05/2026 14:32:10',
    },
    shippingAddress: {
      fullName: 'Nguyễn Văn An',
      phone: '0987123456',
      address: 'Tòa nhà Landmark 81, Vinhomes Central Park',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      ward: 'Phường 22',
    },
    note: 'Giao giờ hành chính, gọi trước khi đến',
  },
  {
    id: 'ORD-882911',
    orderCode: 'ORD-882911',
    date: '18/05/2026',
    time: '11:15',
    customer: {
      id: 'CUST-002',
      name: 'Trần Thị Mai',
      avatar: user9,
      phone: '0912333444',
      email: 'tranthimai@techvn.com',
    },
    items: [
      {
        id: 'ITEM-02',
        productId: 'SIM-003',
        productName: 'SIM Mobifone 0903.333.999 (eSIM)',
        variantName: 'Gói MobiData - 5GB/ngày',
        quantity: 1,
        unitPrice: 25000000,
        totalPrice: 25000000,
        productType: 'sim',
        carrier: 'Mobifone',
      },
      {
        id: 'ITEM-03',
        productId: 'CARD-002',
        productName: 'Thẻ nạp Viettel 500.000đ',
        variantName: 'Mã thẻ điện tử trực tiếp',
        quantity: 2,
        unitPrice: 480000,
        totalPrice: 960000,
        productType: 'card',
        carrier: 'Viettel',
      },
    ],
    totalAmount: 25960000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 25960000,
    currency: 'VND',
    paymentStatus: 'paid',
    orderStatus: 'qr_code_esim',
    paymentInfo: {
      provider: 'MoMo',
      methodType: 'E-Wallet',
      transactionCode: 'MOMO-102938472',
      amount: 25960000,
      currency: 'VND',
      status: 'SUCCESS',
      paidAt: '18/05/2026 11:16:00',
    },
    shippingAddress: {
      fullName: 'Trần Thị Mai',
      phone: '0912333444',
      address: 'Nhận qua Email và Zalo',
      province: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng',
    },
    note: 'Gửi mã QR eSIM qua Zalo số 0912333444',
  },
  {
    id: 'ORD-882912',
    orderCode: 'ORD-882912',
    date: '17/05/2026',
    time: '16:45',
    customer: {
      id: 'CUST-003',
      name: 'Lê Hoàng Nam',
      avatar: user1,
      phone: '0909555666',
      email: 'namle@hoangnamcorp.vn',
    },
    items: [
      {
        id: 'ITEM-04',
        productId: 'SIM-004',
        productName: 'SIM Wintel 055.999.9686 (Data Không Giới Hạn)',
        variantName: 'Gói WIN60',
        quantity: 5,
        unitPrice: 250000,
        totalPrice: 1250000,
        productType: 'sim',
        carrier: 'Wintel',
      },
    ],
    totalAmount: 1250000,
    discountAmount: 50000,
    shippingFee: 30000,
    finalAmount: 1230000,
    currency: 'VND',
    paymentStatus: 'pending',
    orderStatus: 'manual_processing',
    paymentInfo: {
      provider: 'VietQR',
      methodType: 'Bank Transfer',
      transactionCode: 'VIETQR-PENDING',
      amount: 1230000,
      currency: 'VND',
      status: 'PENDING',
    },
    shippingAddress: {
      fullName: 'Lê Hoàng Nam',
      phone: '0909555666',
      address: '154 Nguyễn Thái Học',
      province: 'Đà Nẵng',
      district: 'Quận Hải Châu',
      ward: 'Phường Thạch Thang',
    },
    note: 'Khách yêu cầu kiểm tra kỹ sóng tại khu vực Hải Châu',
  },
  {
    id: 'ORD-882913',
    orderCode: 'ORD-882913',
    date: '17/05/2026',
    time: '09:20',
    customer: {
      id: 'CUST-004',
      name: 'Phạm Minh Tuấn',
      avatar: user4,
      phone: '0934111222',
      email: 'tuanpm@devworld.io',
    },
    items: [
      {
        id: 'ITEM-05',
        productId: 'CARD-007',
        productName: 'Thẻ Data Viettel ST100K - 15GB',
        variantName: 'Mã nạp nhanh',
        quantity: 10,
        unitPrice: 95000,
        totalPrice: 950000,
        productType: 'card',
        carrier: 'Viettel',
      },
    ],
    totalAmount: 950000,
    discountAmount: 100000,
    shippingFee: 0,
    finalAmount: 850000,
    currency: 'VND',
    paymentStatus: 'paid',
    orderStatus: 'activation_code',
    paymentInfo: {
      provider: 'ZaloPay',
      methodType: 'E-Wallet',
      transactionCode: 'ZALO-39281029',
      amount: 850000,
      currency: 'VND',
      status: 'SUCCESS',
      paidAt: '17/05/2026 09:21:05',
    },
    shippingAddress: {
      fullName: 'Phạm Minh Tuấn',
      phone: '0934111222',
      address: 'Nhận SMS trực tiếp',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
  },
  {
    id: 'ORD-882914',
    orderCode: 'ORD-882914',
    date: '16/05/2026',
    time: '18:10',
    customer: {
      id: 'CUST-005',
      name: 'Hoàng Bảo Trâm',
      avatar: user6,
      phone: '0989888999',
      email: 'tramhoang@luxbeauty.vn',
    },
    items: [
      {
        id: 'ITEM-06',
        productId: 'SIM-006',
        productName: 'SIM Lộc Phát Viettel 098.168.6868 (eSIM)',
        variantName: 'Gói V200C - 6GB/ngày',
        quantity: 1,
        unitPrice: 85000000,
        totalPrice: 85000000,
        productType: 'sim',
        carrier: 'Viettel',
      },
    ],
    totalAmount: 85000000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 85000000,
    currency: 'VND',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    paymentInfo: {
      provider: 'Visa/Mastercard',
      methodType: 'Card',
      transactionCode: 'CHASE-00219382',
      amount: 85000000,
      currency: 'VND',
      status: 'SUCCESS',
      paidAt: '16/05/2026 18:12:30',
    },
    shippingAddress: {
      fullName: 'Hoàng Bảo Trâm',
      phone: '0989888999',
      address: 'Khu biệt thự Chateau, Phú Mỹ Hưng',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Phường Tân Phú',
    },
    note: 'Đã gửi mã QR và kích hoạt thành công trên iPhone 16 Pro Max',
  },
  {
    id: 'ORD-882915',
    orderCode: 'ORD-882915',
    date: '15/05/2026',
    time: '10:05',
    customer: {
      id: 'CUST-006',
      name: 'Đặng Quốc Bảo',
      avatar: user5,
      phone: '0922111333',
      email: 'baodq@vinagame.com',
    },
    items: [
      {
        id: 'ITEM-07',
        productId: 'CARD-009',
        productName: 'Thẻ Garena 200.000đ',
        variantName: 'Mã thẻ game trực tuyến',
        quantity: 5,
        unitPrice: 194000,
        totalPrice: 970000,
        productType: 'card',
        carrier: 'Viettel', // Hoặc Garena
      },
      {
        id: 'ITEM-08',
        productId: 'CARD-010',
        productName: 'Thẻ Zing 100.000đ',
        variantName: 'Mã thẻ game trực tuyến',
        quantity: 5,
        unitPrice: 96000,
        totalPrice: 480000,
        productType: 'card',
        carrier: 'Viettel', // Hoặc Zing
      },
    ],
    totalAmount: 1450000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 1450000,
    currency: 'VND',
    paymentStatus: 'error',
    orderStatus: 'cancelled',
    paymentInfo: {
      provider: 'VNPay',
      methodType: 'Bank Transfer',
      transactionCode: 'VNPAY-ERR503',
      amount: 1450000,
      currency: 'VND',
      status: 'FAILED',
    },
    note: 'Giao dịch bị từ chối bởi ngân hàng phát hành thẻ',
  },
]
