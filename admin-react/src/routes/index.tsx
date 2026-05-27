import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import MainLayout from '@/layouts/MainLayout.tsx'

// Dashboards
const Dashboard = lazy(() => import('@/views/dashboards/dashboard'))
const Dashboard2 = lazy(() => import('@/views/dashboards/dashboard2'))
const Dashboard3 = lazy(() => import('@/views/dashboards/dashboard3'))

// Ecommerce
const ProductList = lazy(() => import('@/views/ecommerce/products'))
const ProductGrid = lazy(() => import('@/views/ecommerce/products-grid'))
const ProductDetails = lazy(() => import('@/views/ecommerce/products/[productId]'))
const AddProduct = lazy(() => import('@/views/ecommerce/add-product'))
const EditProduct = lazy(() => import('@/views/ecommerce/edit-product'))
const Categories = lazy(() => import('@/views/ecommerce/categories'))
const CountriesRegions = lazy(() => import('@/views/ecommerce/countries-regions'))
const InventoryDetails = lazy(() => import('@/views/ecommerce/inventory'))
const Payments = lazy(() => import('@/views/ecommerce/payments'))
const Providers = lazy(() => import('@/views/ecommerce/providers'))
const Orders = lazy(() => import('@/views/ecommerce/orders'))
const OrderDetails = lazy(() => import('@/views/ecommerce/orders/[orderId]'))
const Customers = lazy(() => import('@/views/ecommerce/customers'))
const Sellers = lazy(() => import('@/views/ecommerce/sellers'))
const SellerDetails = lazy(() => import('@/views/ecommerce/sellers/[sellerId]'))
const Reviews = lazy(() => import('@/views/ecommerce/reviews'))
const ProductViews = lazy(() => import('@/views/ecommerce/reports/product-views'))
const Sales = lazy(() => import('@/views/ecommerce/reports/sales'))

// Users Management
const UserContacts = lazy(() => import('@/views/users/contacts'))
const UserRoles = lazy(() => import('@/views/users/roles'))
const UserPermissions = lazy(() => import('@/views/users/permissions'))

// Other Apps

// Pages
const Profile = lazy(() => import('@/views/pages/profile'))
const Faq = lazy(() => import('@/views/pages/faq'))
const Pricing = lazy(() => import('@/views/pages/pricing'))
const EmptyPage = lazy(() => import('@/views/pages/empty-page'))
const Timeline = lazy(() => import('@/views/pages/timeline'))
const SearchResults = lazy(() => import('@/views/pages/search-results'))
const ComingSoon = lazy(() => import('@/views/other-pages/coming-soon'))
const TermsConditions = lazy(() => import('@/views/pages/terms-conditions'))

// Miscellaneous


// Auth
const Auth1SignIn = lazy(() => import('@/views/auth/auth-1/sign-in'))
const Auth1SignUp = lazy(() => import('@/views/auth/auth-1/sign-up'))
const Auth1ResetPassword = lazy(() => import('@/views/auth/auth-1/reset-password'))
const Auth1NewPassword = lazy(() => import('@/views/auth/auth-1/new-password'))
const Auth1TwoFactor = lazy(() => import('@/views/auth/auth-1/two-factor'))
const Auth1LockScreen = lazy(() => import('@/views/auth/auth-1/lock-screen'))
const Auth1SuccessMail = lazy(() => import('@/views/auth/auth-1/success-mail'))
const Auth1LoginPin = lazy(() => import('@/views/auth/auth-1/login-pin'))
const Auth1DeleteAccount = lazy(() => import('@/views/auth/auth-1/delete-account'))

const Auth2SignIn = lazy(() => import('@/views/auth/auth-2/sign-in'))
const Auth2SignUp = lazy(() => import('@/views/auth/auth-2/sign-up'))
const Auth2ResetPassword = lazy(() => import('@/views/auth/auth-2/reset-password'))
const Auth2NewPassword = lazy(() => import('@/views/auth/auth-2/new-password'))
const Auth2TwoFactor = lazy(() => import('@/views/auth/auth-2/two-factor'))
const Auth2LockScreen = lazy(() => import('@/views/auth/auth-2/lock-screen'))
const Auth2SuccessMail = lazy(() => import('@/views/auth/auth-2/success-mail'))
const Auth2LoginPin = lazy(() => import('@/views/auth/auth-2/login-pin'))
const Auth2DeleteAccount = lazy(() => import('@/views/auth/auth-2/delete-account'))

const Auth3SignIn = lazy(() => import('@/views/auth/auth-3/sign-in'))
const Auth3SignUp = lazy(() => import('@/views/auth/auth-3/sign-up'))
const Auth3ResetPassword = lazy(() => import('@/views/auth/auth-3/reset-password'))
const Auth3NewPassword = lazy(() => import('@/views/auth/auth-3/new-password'))
const Auth3TwoFactor = lazy(() => import('@/views/auth/auth-3/two-factor'))
const Auth3LockScreen = lazy(() => import('@/views/auth/auth-3/lock-screen'))
const Auth3SuccessMail = lazy(() => import('@/views/auth/auth-3/success-mail'))
const Auth3LoginPin = lazy(() => import('@/views/auth/auth-3/login-pin'))
const Auth3DeleteAccount = lazy(() => import('@/views/auth/auth-3/delete-account'))

// Error


// Layouts

// Components

const authRoutes: RouteObject[] = [
  { path: '/auth-1/sign-in', element: <Auth1SignIn /> },
  { path: '/auth-1/sign-up', element: <Auth1SignUp /> },
  { path: '/auth-1/reset-password', element: <Auth1ResetPassword /> },
  { path: '/auth-1/new-password', element: <Auth1NewPassword /> },
  { path: '/auth-1/two-factor', element: <Auth1TwoFactor /> },
  { path: '/auth-1/lock-screen', element: <Auth1LockScreen /> },
  { path: '/auth-1/success-mail', element: <Auth1SuccessMail /> },
  { path: '/auth-1/login-pin', element: <Auth1LoginPin /> },
  { path: '/auth-1/delete-account', element: <Auth1DeleteAccount /> },

  { path: '/auth-2/sign-in', element: <Auth2SignIn /> },
  { path: '/auth-2/sign-up', element: <Auth2SignUp /> },
  { path: '/auth-2/reset-password', element: <Auth2ResetPassword /> },
  { path: '/auth-2/new-password', element: <Auth2NewPassword /> },
  { path: '/auth-2/two-factor', element: <Auth2TwoFactor /> },
  { path: '/auth-2/lock-screen', element: <Auth2LockScreen /> },
  { path: '/auth-2/success-mail', element: <Auth2SuccessMail /> },
  { path: '/auth-2/login-pin', element: <Auth2LoginPin /> },
  { path: '/auth-2/delete-account', element: <Auth2DeleteAccount /> },

  { path: '/auth-3/sign-in', element: <Auth3SignIn /> },
  { path: '/auth-3/sign-up', element: <Auth3SignUp /> },
  { path: '/auth-3/reset-password', element: <Auth3ResetPassword /> },
  { path: '/auth-3/new-password', element: <Auth3NewPassword /> },
  { path: '/auth-3/two-factor', element: <Auth3TwoFactor /> },
  { path: '/auth-3/lock-screen', element: <Auth3LockScreen /> },
  { path: '/auth-3/success-mail', element: <Auth3SuccessMail /> },
  { path: '/auth-3/login-pin', element: <Auth3LoginPin /> },
  { path: '/auth-3/delete-account', element: <Auth3DeleteAccount /> },
]



const otherPagesRoutes: RouteObject[] = [
  { path: '/coming-soon', element: <ComingSoon /> },

]

const dashboardRoutes: RouteObject[] = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/dashboard2', element: <Dashboard2 /> },
  { path: '/dashboard3', element: <Dashboard3 /> },
]

const ecommerceRoutes: RouteObject[] = [
  { path: '/products', element: <ProductList /> },
  { path: '/products-grid', element: <ProductGrid /> },
  { path: '/products/:productId', element: <ProductDetails /> },
  { path: '/products/edit/:productId', element: <EditProduct /> },
  { path: '/add-product', element: <AddProduct /> },
  { path: '/categories', element: <Categories /> },
  { path: '/countries-regions', element: <CountriesRegions /> },
  { path: '/inventory', element: <InventoryDetails /> },
  { path: '/payments', element: <Payments /> },
  { path: '/providers', element: <Providers /> },
  { path: '/orders', element: <Orders /> },
  { path: '/orders/:orderId', element: <OrderDetails /> },
  { path: '/customers', element: <Customers /> },
  { path: '/sellers', element: <Sellers /> },
  { path: '/sellers/:sellerId', element: <SellerDetails /> },
  { path: '/reviews', element: <Reviews /> },
  { path: '/reports/product-views', element: <ProductViews /> },
  { path: '/reports/sales', element: <Sales /> },
]

const usersRoutes: RouteObject[] = [
  { path: '/users/contacts', element: <UserContacts /> },
  { path: '/users/roles', element: <UserRoles /> },
  { path: '/users/permissions', element: <UserPermissions /> },
]



const pagesRoutes: RouteObject[] = [
  { path: '/pages/profile', element: <Profile /> },
  { path: '/pages/faq', element: <Faq /> },
  { path: '/pages/pricing', element: <Pricing /> },
  { path: '/pages/empty-page', element: <EmptyPage /> },
  { path: '/pages/timeline', element: <Timeline /> },
  { path: '/pages/search-results', element: <SearchResults /> },
  { path: '/pages/terms-conditions', element: <TermsConditions /> },
]







const allRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      ...dashboardRoutes,
      ...ecommerceRoutes,
      ...usersRoutes,
      ...pagesRoutes,
    ],
  },
]

const otherRoutes: RouteObject[] = [...authRoutes, ...otherPagesRoutes]

export const routes: RouteObject[] = [...allRoutes, ...otherRoutes]
