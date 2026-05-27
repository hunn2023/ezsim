import { type MenuItemType } from '@/types/layout'
import { type IconType } from 'react-icons'
import {
  TbAlertHexagon,
  TbApps,
  TbBan,
  TbBasket,
  TbBellRinging,
  TbBoxAlignTop,
  TbBriefcase,
  TbCalendar,
  TbCategory,
  TbChartBar,
  TbChartHistogram,
  TbChartPie,
  TbCheckupList,
  TbComponents,
  TbCreditCard,
  TbFiles,
  TbFolder,
  TbHeadset,
  TbIcons,
  TbInvoice,
  TbLayout,
  TbLayoutDashboard,
  TbLayoutNavbar,
  TbLayoutSidebar,
  TbLock,
  TbLockAccess,
  TbLogout2,
  TbMail,
  TbMap,
  TbMessageDots,
  TbNotebook,
  TbPackage,
  TbPalette,
  TbRocket,
  TbSettings2,
  TbShieldLock,
  TbSitemap,
  TbStackFront,
  TbStar,
  TbTableColumn,
  TbUserCircle,
  TbUserHexagon,
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
  {
    label: 'Welcome back!',
    isHeader: true,
  },
  {
    label: 'Profile',
    icon: TbUserCircle,
    url: '/pages/profile',
  },
  {
    label: 'Notifications',
    icon: TbBellRinging,
    url: '#',
  },
  {
    label: 'Balance: $985.25',
    icon: TbCreditCard,
    url: '#',
  },
  {
    label: 'Account Settings',
    icon: TbSettings2,
    url: '#',
  },
  {
    label: 'Support Center',
    icon: TbHeadset,
    url: '#',
  },
  {
    isDivider: true,
  },
  {
    label: 'Lock Screen',
    icon: TbLock,
    url: '/auth-1/lock-screen',
  },
  {
    label: 'Log Out',
    icon: TbLogout2,
    url: '#',
    class: 'text-danger fw-semibold',
  },
]

export const menuItems: MenuItemType[] = [
  { key: 'menu', label: 'Menu', isTitle: true },
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: TbLayoutDashboard,
    badge: { variant: 'success', text: '5' },
    children: [
      { key: 'dashboard-v1', label: 'Dashboard v.1', url: '/dashboard' },
      { key: 'dashboard-v2', label: 'Dashboard v.2', url: '/dashboard2' },
      { key: 'dashboard-v3', label: 'Dashboard v.3', url: '/dashboard3' },

    ],
  },
  { key: 'apps', label: 'Apps', isTitle: true },
  {
    key: 'ecommerce',
    label: 'Ecommerce',
    icon: TbBasket,
    children: [
      {
        key: 'products',
        label: 'Products',
        children: [
          { key: 'product-list', label: 'Product', url: '/products' },
          { key: 'product-grid', label: 'Product Grid', url: '/products-grid' },
          { key: 'product-details', label: 'Product Details', url: '/products/1' },
          { key: 'add-product', label: 'Add Product', url: '/add-product' },
        ],
      },
      { key: 'categories', label: 'Categories', url: '/categories' },
      { key: 'countries-regions', label: 'Countries & Regions', url: '/countries-regions' },
      { key: 'inventory', label: 'Inventory (Serial/PIN)', url: '/inventory' },
      { key: 'payments', label: 'Payment Gateways', url: '/payments' },
      { key: 'providers', label: 'eSIM Wholesalers (API)', url: '/providers' },
      {
        key: 'orders',
        label: 'Orders',
        children: [
          { key: 'orders-list', label: 'Orders', url: '/orders' },
          { key: 'order-details', label: 'Order Details', url: '/orders/1' },
        ],
      },
      { key: 'customers', label: 'Customers', url: '/customers' },
      {
        key: 'sellers',
        label: 'Sellers',
        children: [
          { key: 'sellers-list', label: 'Sellers', url: '/sellers' },
          { key: 'seller-details', label: 'Seller Details', url: '/sellers/1' },
        ],
      },
      { key: 'reviews', label: 'Reviews', url: '/reviews' },
      {
        key: 'reports',
        label: 'Reports',
        children: [
          { key: 'product-views', label: 'Product Views', url: '/reports/product-views' },
          { key: 'sales', label: 'Sales', url: '/reports/sales' },
        ],
      },
    ],
  },

  {
    key: 'users',
    label: 'Users',
    icon: TbUsers,
    children: [
      { key: 'contacts', label: 'Contacts', url: '/users/contacts' },
      { key: 'roles', label: 'Roles', url: '/users/roles' },
      { key: 'permissions', label: 'Permissions', url: '/users/permissions' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: TbBriefcase,
    children: [
      { key: 'my-projects', label: 'My Projects', url: '/projects' },
      { key: 'projects-list', label: 'Projects List', url: '/projects-list' },
      { key: 'project-details', label: 'View Project', url: '/projects/1' },
      { key: 'kanban-board', label: 'Kanban Board', url: '/kanban-board' },
      { key: 'team-board', label: 'Team Board', url: '/team-board' },
      { key: 'activity-stream', label: 'Activity Stream', url: '/activity-stream' },
    ],
  },
  { key: 'file-manager', label: 'File Manager', icon: TbFolder, url: '/file-manager' },
  { key: 'chat', label: 'Chat', icon: TbMessageDots, url: '/chat' },


  { key: 'custom', label: 'Custom Pages', isTitle: true },


  {
    key: 'auth',
    label: 'Authentication',
    icon: TbLock,
    children: [
      {
        key: 'version-1',
        label: 'Version 1',
        parentKey: 'auth',
        children: [
          { key: 'sign-in', label: 'Sign In', url: '/auth-1/sign-in' },
          { key: 'sign-up', label: 'Sign Up', url: '/auth-1/sign-up' },
          { key: 'reset-pass', label: 'Reset Password', url: '/auth-1/reset-password' },
          { key: 'new-pass', label: 'New Password', url: '/auth-1/new-password' },
          { key: 'two-factor', label: 'Two Factor', url: '/auth-1/two-factor' },
          { key: 'lock-screen', label: 'Lock Screen', url: '/auth-1/lock-screen' },
          { key: 'success-mail', label: 'Success Mail', url: '/auth-1/success-mail' },
          { key: 'login-pin', label: 'Login with PIN', url: '/auth-1/login-pin' },
          { key: 'delete-account', label: 'Delete Account', url: '/auth-1/delete-account' },
        ],
      },
      {
        key: 'version-2',
        label: 'Version 2',
        parentKey: 'auth',
        children: [
          { key: 'sign-in-2', label: 'Sign In', url: '/auth-2/sign-in' },
          { key: 'sign-up-2', label: 'Sign Up', url: '/auth-2/sign-up' },
          {
            key: 'reset-pass-2',
            label: 'Reset Password',
            url: '/auth-2/reset-password',
          },
          { key: 'new-pass-2', label: 'New Password', url: '/auth-2/new-password' },
          { key: 'two-factor-2', label: 'Two Factor', url: '/auth-2/two-factor' },
          { key: 'lock-screen-2', label: 'Lock Screen', url: '/auth-2/lock-screen' },
          { key: 'success-mail-2', label: 'Success Mail', url: '/auth-2/success-mail' },
          { key: 'login-pin-2', label: 'Login with PIN', url: '/auth-2/login-pin' },
          {
            key: 'delete-account-2',
            label: 'Delete Account',
            url: '/auth-2/delete-account',
          },
        ],
      },
      {
        key: 'version-3',
        label: 'Version 3',
        parentKey: 'auth',
        children: [
          { key: 'sign-in-3', label: 'Sign In', url: '/auth-3/sign-in' },
          { key: 'sign-up-3', label: 'Sign Up', url: '/auth-3/sign-up' },
          {
            key: 'reset-pass-3',
            label: 'Reset Password',
            url: '/auth-3/reset-password',
          },
          { key: 'new-pass-3', label: 'New Password', url: '/auth-3/new-password' },
          { key: 'two-factor-3', label: 'Two Factor', url: '/auth-3/two-factor' },
          { key: 'lock-screen-3', label: 'Lock Screen', url: '/auth-3/lock-screen' },
          { key: 'success-mail-3', label: 'Success Mail', url: '/auth-3/success-mail' },
          { key: 'login-pin-3', label: 'Login with PIN', url: '/auth-3/login-pin' },
          {
            key: 'delete-account-3',
            label: 'Delete Account',
            url: '/auth-3/delete-account',
          },
        ],
      },
    ],
  },

  { key: 'layouts', label: 'Layouts', isTitle: true },
  {
    key: 'layout-options',
    label: 'Layout Options',
    icon: TbLayout,
    children: [
      { key: 'scrollable', label: 'Scrollable', url: '/layouts/scrollable' },
      { key: 'compact', label: 'Compact', url: '/layouts/compact' },
      { key: 'boxed', label: 'Boxed', url: '/layouts/boxed' },
      { key: 'horizontal', label: 'Horizontal', url: '/layouts/horizontal' },
    ],
  },
  {
    key: 'sidebars',
    label: 'Sidebars',
    icon: TbLayoutSidebar,
    children: [
      { key: 'compact-menu', label: 'Compact Menu', url: '/layouts/sidebars/compact' },
      { key: 'icon-view-menu', label: 'Icon View Menu', url: '/layouts/sidebars/icon-view' },
      { key: 'on-hover-menu', label: 'On Hover Menu', url: '/layouts/sidebars/on-hover' },
      {
        key: 'on-hover-active-menu',
        label: 'On Hover Active Menu',
        url: '/layouts/sidebars/on-hover-active',
      },
      { key: 'offcanvas-menu', label: 'Offcanvas Menu', url: '/layouts/sidebars/offcanvas' },
      {
        key: 'no-icons-with-lines-menu',
        label: 'No Icons With Lines',
        url: '/layouts/sidebars/no-icons-with-lines',
      },
      {
        key: 'with-lines-menu',
        label: 'Sidebar With Lines',
        url: '/layouts/sidebars/with-lines',
      },
      { key: 'light-menu', label: 'Light Menu', url: '/layouts/sidebars/light' },
      { key: 'gradient-menu', label: 'Gradient Menu', url: '/layouts/sidebars/gradient' },
      { key: 'gray-menu', label: 'Gray Menu', url: '/layouts/sidebars/gray' },
      { key: 'image-menu', label: 'Image Menu', url: '/layouts/sidebars/image' },
    ],
  },
  {
    key: 'topbars',
    label: 'Topbars',
    icon: TbLayoutNavbar,
    children: [
      { key: 'dark-topbar', label: 'Dark Topbar', url: '/layouts/topbars/dark' },
      { key: 'gray-topbar', label: 'Gray Topbar', url: '/layouts/topbars/gray' },
      { key: 'gradient-topbar', label: 'Gradient Topbar', url: '/layouts/topbars/gradient' },
      {
        key: 'with-sub-items-topbar',
        label: 'Topbar with Sub Items',
        url: '/layouts/topbars/with-sub-items',
      },
      {
        key: 'with-tools-topbar',
        label: 'Topbar with Tools',
        url: '/layouts/topbars/with-tools',
      },
    ],
  },

]

export const horizontalMenuItems: MenuItemType[] = [
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: TbLayoutDashboard,
    children: [
      { key: 'dashboard-v1', label: 'Dashboard v.1', url: '/dashboard' },
      { key: 'dashboard-v2', label: 'Dashboard v.2', url: '/dashboard2' },
      { key: 'dashboard-v3', label: 'Dashboard v.3', url: '/dashboard3' },
    ],
  },
  {
    key: 'apps',
    label: 'Apps',
    icon: TbApps,
    children: [
      {
        key: 'ecommerce',
        label: 'Ecommerce',
        icon: TbBasket,
        children: [
          {
            key: 'products',
            label: 'Products',
            children: [
              { key: 'product-list', label: 'Product', url: '/products' },
              { key: 'product-grid', label: 'Product Grid', url: '/products-grid' },
              { key: 'product-details', label: 'Product Details', url: '/products/1' },
              { key: 'add-product', label: 'Add Product', url: '/add-product' },
            ],
          },
          { key: 'categories', label: 'Categories', url: '/categories' },
          { key: 'countries-regions', label: 'Countries & Regions', url: '/countries-regions' },
          { key: 'inventory', label: 'Inventory (Serial/PIN)', url: '/inventory' },
          { key: 'payments', label: 'Payment Gateways', url: '/payments' },
          { key: 'providers', label: 'eSIM Wholesalers (API)', url: '/providers' },
          {
            key: 'orders',
            label: 'Orders',
            children: [
              { key: 'orders-list', label: 'Orders', url: '/orders' },
              { key: 'order-details', label: 'Order Details', url: '/orders/1' },
            ],
          },
          { key: 'customers', label: 'Customers', url: '/customers' },
          {
            key: 'sellers',
            label: 'Sellers',
            children: [
              { key: 'sellers-list', label: 'Sellers', url: '/sellers' },
              { key: 'seller-details', label: 'Seller Details', url: '/sellers/1' },
            ],
          },
          { key: 'reviews', label: 'Reviews', url: '/reviews' },
          {
            key: 'reports',
            label: 'Reports',
            children: [
              { key: 'product-views', label: 'Product Views', url: '/reports/product-views' },
              { key: 'sales', label: 'Sales', url: '/reports/sales' },
            ],
          },
        ],
      },
      {
        key: 'email',
        label: 'Email',
        icon: TbMail,
        badge: { variant: 'danger', text: 'New' },
        children: [
          { key: 'inbox', label: 'Inbox', url: '/inbox' },
          { key: 'inbox-details', label: 'Details', url: '/inbox/1' },
          { key: 'email-compose', label: 'Compose', url: '/email-compose' },
        ],
      },
      {
        key: 'users',
        label: 'Users',
        icon: TbUsers,
        children: [
          { key: 'contacts', label: 'Contacts', url: '/users/contacts' },
          { key: 'roles', label: 'Roles', url: '/users/roles' },
          { key: 'permissions', label: 'Permissions', url: '/users/permissions' },
        ],
      },


    ],
  },


  {
    key: 'layouts',
    label: 'Layouts',
    icon: TbLayout,
    children: [
      {
        key: 'layout-options',
        label: 'Layout Options',
        icon: TbLayout,
        children: [
          { key: 'scrollable', label: 'Scrollable', url: '/layouts/scrollable' },
          { key: 'compact', label: 'Compact', url: '/layouts/compact' },
          { key: 'boxed', label: 'Boxed', url: '/layouts/boxed' },
          { key: 'horizontal', label: 'Horizontal', url: '/layouts/horizontal' },
        ],
      },
      {
        key: 'sidebars',
        label: 'Sidebars',
        icon: TbLayoutSidebar,
        children: [
          { key: 'compact-menu', label: 'Compact Menu', url: '/layouts/sidebars/compact' },
          { key: 'icon-view-menu', label: 'Icon View Menu', url: '/layouts/sidebars/icon-view' },
          { key: 'on-hover-menu', label: 'On Hover Menu', url: '/layouts/sidebars/on-hover' },
          {
            key: 'on-hover-active-menu',
            label: 'On Hover Active Menu',
            url: '/layouts/sidebars/on-hover-active',
          },
          { key: 'offcanvas-menu', label: 'Offcanvas Menu', url: '/layouts/sidebars/offcanvas' },
          {
            key: 'no-icons-with-lines-menu',
            label: 'No Icons With Lines',
            url: '/layouts/sidebars/no-icons-with-lines',
          },
          {
            key: 'with-lines-menu',
            label: 'Sidebar With Lines',
            url: '/layouts/sidebars/with-lines',
          },
          { key: 'light-menu', label: 'Light Menu', url: '/layouts/sidebars/light' },
          { key: 'gradient-menu', label: 'Gradient Menu', url: '/layouts/sidebars/gradient' },
          { key: 'gray-menu', label: 'Gray Menu', url: '/layouts/sidebars/gray' },
          { key: 'image-menu', label: 'Image Menu', url: '/layouts/sidebars/image' },
        ],
      },
      {
        key: 'topbars',
        label: 'Topbar',
        icon: TbBoxAlignTop,
        children: [
          { key: 'dark-topbar', label: 'Dark Topbar', url: '/layouts/topbars/dark' },
          { key: 'gray-topbar', label: 'Gray Topbar', url: '/layouts/topbars/gray' },
          { key: 'gradient-topbar', label: 'Gradient Topbar', url: '/layouts/topbars/gradient' },
          {
            key: 'with-sub-items-topbar',
            label: 'Topbar with Sub Items',
            url: '/layouts/topbars/with-sub-items',
          },
          {
            key: 'with-tools-topbar',
            label: 'Topbar with Tools',
            url: '/layouts/topbars/with-tools',
          },
        ],
      },
    ],
  },
]
