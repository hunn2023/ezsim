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

import vnFlag from '@/assets/images/flags/vn.svg'

export type CustomerType = {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  country: string
  countryFlag: string
  address: {
    province: string
    district: string
    ward: string
    street: string
  }
  joined: {
    date: string
    time: string
  }
  orders: number
  totalSpends: number
  status: 'active' | 'locked' | 'unverified'
}

export const customers: CustomerType[] = [
  {
    id: 'CUST-001',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    avatar: user2,
    phone: '0987123456',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      ward: 'Phường 22',
      street: 'Tòa nhà Landmark 81',
    },
    joined: {
      date: '02/02/2026',
      time: '08:34',
    },
    orders: 12,
    totalSpends: 135000000,
    status: 'active',
  },
  {
    id: 'CUST-002',
    name: 'Trần Thị Mai',
    email: 'tranthimai@techvn.com',
    avatar: user9,
    phone: '0912333444',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng',
      street: '128 Xuân Thủy',
    },
    joined: {
      date: '15/03/2026',
      time: '10:22',
    },
    orders: 8,
    totalSpends: 25960000,
    status: 'active',
  },
  {
    id: 'CUST-003',
    name: 'Lê Hoàng Nam',
    email: 'namle@hoangnamcorp.vn',
    avatar: user1,
    phone: '0909555666',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'Đà Nẵng',
      district: 'Quận Hải Châu',
      ward: 'Phường Thạch Thang',
      street: '154 Nguyễn Thái Học',
    },
    joined: {
      date: '28/01/2026',
      time: '15:15',
    },
    orders: 15,
    totalSpends: 12500000,
    status: 'active',
  },
  {
    id: 'CUST-004',
    name: 'Phạm Minh Tuấn',
    email: 'tuanpm@devworld.io',
    avatar: user4,
    phone: '0934111222',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      street: '68 Nguyễn Huệ',
    },
    joined: {
      date: '10/04/2026',
      time: '09:47',
    },
    orders: 24,
    totalSpends: 18500000,
    status: 'active',
  },
  {
    id: 'CUST-005',
    name: 'Hoàng Bảo Trâm',
    email: 'tramhoang@luxbeauty.vn',
    avatar: user6,
    phone: '0989888999',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Phường Tân Phú',
      street: 'Khu biệt thự Chateau',
    },
    joined: {
      date: '20/02/2026',
      time: '14:10',
    },
    orders: 5,
    totalSpends: 85000000,
    status: 'active',
  },
  {
    id: 'CUST-006',
    name: 'Đặng Quốc Bảo',
    email: 'baodq@vinagame.com',
    avatar: user5,
    phone: '0922111333',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'Hà Nội',
      district: 'Quận Đống Đa',
      ward: 'Phường Ô Chợ Dừa',
      street: '36 Hoàng Cầu',
    },
    joined: {
      date: '05/03/2026',
      time: '11:25',
    },
    orders: 18,
    totalSpends: 14500000,
    status: 'active',
  },
  {
    id: 'CUST-007',
    name: 'Vũ Đức Khang',
    email: 'khangvu@fintech.vn',
    avatar: user7,
    phone: '0977654321',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'Hải Phòng',
      district: 'Quận Ngô Quyền',
      ward: 'Phường Lạch Tray',
      street: '256 Lạch Tray',
    },
    joined: {
      date: '18/04/2026',
      time: '16:50',
    },
    orders: 9,
    totalSpends: 9200000,
    status: 'active',
  },
  {
    id: 'CUST-008',
    name: 'Bùi Thu Hà',
    email: 'habui@vinhomes.vn',
    avatar: user8,
    phone: '0933999888',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'TP. Hồ Chí Minh',
      district: 'TP. Thủ Đức',
      ward: 'Phường Thảo Điền',
      street: '12 Xuân Thủy',
    },
    joined: {
      date: '10/01/2026',
      time: '06:30',
    },
    orders: 31,
    totalSpends: 45000000,
    status: 'active',
  },
  {
    id: 'CUST-009',
    name: 'Đỗ Tuấn Hưng',
    email: 'hungdo@fpt.com.vn',
    avatar: user10,
    phone: '0902123987',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'Hà Nội',
      district: 'Quận Nam Từ Liêm',
      ward: 'Phường Mễ Trì',
      street: 'KĐT Mỹ Đình',
    },
    joined: {
      date: '25/03/2026',
      time: '13:15',
    },
    orders: 14,
    totalSpends: 22500000,
    status: 'locked',
  },
  {
    id: 'CUST-010',
    name: 'Ngô Thanh Vân',
    email: 'vanngo@studios.vn',
    avatar: user3,
    phone: '0988777666',
    countryFlag: vnFlag,
    country: 'Việt Nam',
    address: {
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu',
      street: '182 Điện Biên Phủ',
    },
    joined: {
      date: '08/02/2026',
      time: '07:40',
    },
    orders: 22,
    totalSpends: 38000000,
    status: 'active',
  },
]
