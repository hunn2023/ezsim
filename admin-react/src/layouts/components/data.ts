import { type MenuItemType } from '@/types/layout'
import { type IconType } from 'react-icons'
import {
  TbBasket,
  TbBoxAlignTop,
  TbCategory,
  TbInvoice,
  TbLayoutDashboard,
  TbLogout2,
  TbSettings2,
  TbUsers,
} from 'react-icons/tb'

type UserDropdownItemType = {
  label?: string
  icon?: IconType
  url?: string
  isDivider?: boolean
  isHeader?: boolean
  class?: string
}

export const userDropdownItems: UserDropdownItemType[] = [
  { label: 'Xin chào!', isHeader: true },
  { label: 'Cài đặt', icon: TbSettings2, url: '/settings' },
  { isDivider: true },
  { label: 'Đăng xuất', icon: TbLogout2, url: '#', class: 'text-danger fw-semibold' },
]

const adMenu: MenuItemType[] = [
  { key: 'menu', label: 'Menu', isTitle: true },

  { key: 'dashboard', label: 'Dashboard', icon: TbLayoutDashboard, url: '/dashboard' },

  { key: 'apps', label: 'Ecommerce', isTitle: true },

  {
    key: 'products',
    label: 'Sản phẩm',
    icon: TbBasket,
    children: [
      { key: 'product-list',   label: 'Danh sách sản phẩm', url: '/products' },
      { key: 'product-create', label: 'Thêm sản phẩm',      url: '/products/create' },
    ],
  },

  { key: 'categories', label: 'Danh mục',    icon: TbCategory, url: '/categories' },
  { key: 'orders',     label: 'Đơn hàng',    icon: TbInvoice,  url: '/orders' },
  { key: 'customers',  label: 'Khách hàng',  icon: TbUsers,    url: '/customers' },

  {
    key: 'banners',
    label: 'Banner',
    icon: TbBoxAlignTop,
    children: [
      { key: 'banner-list',   label: 'Danh sách banner', url: '/banners' },
      { key: 'banner-create', label: 'Thêm banner',      url: '/banners/new' },
    ],
  },

  { key: 'system', label: 'Hệ thống', isTitle: true },

  { key: 'settings', label: 'Cài đặt website', icon: TbSettings2, url: '/settings' },
]

export const menuItems: MenuItemType[] = adMenu
export const horizontalMenuItems: MenuItemType[] = adMenu.filter((m) => !m.isTitle)
