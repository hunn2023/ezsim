import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import MainLayout from '@/layouts/MainLayout.tsx'
import ProtectedRoute from '@/routes/ProtectedRoute'

// Dashboards
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const Dashboard2 = lazy(() => import('@/views/dashboards/dashboard2'))
const Dashboard3 = lazy(() => import('@/views/dashboards/dashboard3'))

// Ecommerce
const ProductList = lazy(() => import('@/pages/products/ProductListPage'))
const ProductCreate = lazy(() => import('@/pages/products/ProductCreatePage'))
const ProductEdit = lazy(() => import('@/pages/products/ProductEditPage'))
const ProductGrid = lazy(() => import('@/views/ecommerce/products-grid'))
const ProductDetails = lazy(() => import('@/views/ecommerce/products/[productId]'))
const AddProduct = lazy(() => import('@/views/ecommerce/add-product'))
const Categories = lazy(() => import('@/pages/categories/CategoryListPage'))
const CountriesRegions = lazy(() => import('@/views/ecommerce/countries-regions'))
const InventoryDetails = lazy(() => import('@/views/ecommerce/inventory'))
const Payments = lazy(() => import('@/views/ecommerce/payments'))
const Orders = lazy(() => import('@/pages/orders/OrderListPage'))
const OrderDetails = lazy(() => import('@/pages/orders/OrderDetailPage'))
const Customers = lazy(() => import('@/pages/customers/CustomerListPage'))
const CustomerDetails = lazy(() => import('@/pages/customers/CustomerDetailPage'))
const Sellers = lazy(() => import('@/views/ecommerce/sellers'))
const SellerDetails = lazy(() => import('@/views/ecommerce/sellers/[sellerId]'))
const Reviews = lazy(() => import('@/views/ecommerce/reviews'))
const ProductViews = lazy(() => import('@/views/ecommerce/reports/product-views'))
const Sales = lazy(() => import('@/views/ecommerce/reports/sales'))
const Banners = lazy(() => import('@/pages/banners/BannerListPage'))
const BannerCreate = lazy(() => import('@/pages/banners/BannerCreatePage'))
const BannerEdit = lazy(() => import('@/pages/banners/BannerEditPage'))
const Settings = lazy(() => import('@/pages/settings/SettingsPage'))

// Other Apps
const Companies = lazy(() => import('@/views/other-apps/companies'))
const Clients = lazy(() => import('@/views/other-apps/clients'))
const OutlookView = lazy(() => import('@/views/other-apps/outlook-view'))
const VoteList = lazy(() => import('@/views/other-apps/vote-list'))
const IssueTracker = lazy(() => import('@/views/other-apps/issue-tracker'))
const ApiKeys = lazy(() => import('@/views/other-apps/api-keys'))
const Blogs = lazy(() => import('@/views/other-apps/blogs'))
const Article = lazy(() => import('@/views/other-apps/article'))
const PinBoard = lazy(() => import('@/views/other-apps/pin-board'))
const ForumView = lazy(() => import('@/views/other-apps/forum-view'))
const ForumPost = lazy(() => import('@/views/other-apps/forum-post'))

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
const NestableList = lazy(() => import('@/views/miscellaneous/nestable-list'))
const TextDifferent = lazy(() => import('@/views/miscellaneous/text-different'))
const PdfViewer = lazy(() => import('@/views/miscellaneous/pdf-viewer'))
const SweetAlert = lazy(() => import('@/views/miscellaneous/sweet-alert'))
const IdleTimer = lazy(() => import('@/views/miscellaneous/idle-timer'))
const PasswordMeter = lazy(() => import('@/views/miscellaneous/password-meter'))
const Clipboard = lazy(() => import('@/views/miscellaneous/clipboard'))
const TreeView = lazy(() => import('@/views/miscellaneous/tree-view'))
const LoadingButtons = lazy(() => import('@/views/miscellaneous/loading-buttons'))
const Gallery = lazy(() => import('@/views/miscellaneous/gallery'))
const Masonry = lazy(() => import('@/views/miscellaneous/masonry'))
const Tour = lazy(() => import('@/views/miscellaneous/tour'))
const Animation = lazy(() => import('@/views/miscellaneous/animation'))

// Login (canonical entry point — real API auth)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

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
const Error400 = lazy(() => import('@/views/error/400'))
const Error401 = lazy(() => import('@/views/error/401'))
const Error403 = lazy(() => import('@/views/error/403'))
const Error404 = lazy(() => import('@/views/error/404'))
const Error408 = lazy(() => import('@/views/error/408'))
const Error500 = lazy(() => import('@/views/error/500'))
const Maintenance = lazy(() => import('@/views/other-pages/maintenance'))

// Layouts
const ScrollableLayout = lazy(() => import('@/views/layouts/scrollable'))
const CompactLayout = lazy(() => import('@/views/layouts/compact'))
const BoxedLayout = lazy(() => import('@/views/layouts/boxed'))
const HorizontalLayout = lazy(() => import('@/views/layouts/horizontal'))

const SidebarCompact = lazy(() => import('@/views/layouts/sidebars/compact'))
const SidebarIconView = lazy(() => import('@/views/layouts/sidebars/icon-view'))
const SidebarOnHover = lazy(() => import('@/views/layouts/sidebars/on-hover'))
const SidebarOnHoverActive = lazy(() => import('@/views/layouts/sidebars/on-hover-active'))
const SidebarOffcanvas = lazy(() => import('@/views/layouts/sidebars/offcanvas'))
const SidebarNoIconsLines = lazy(() => import('@/views/layouts/sidebars/no-icons-with-lines'))
const SidebarWithLines = lazy(() => import('@/views/layouts/sidebars/with-lines'))
const SidebarLight = lazy(() => import('@/views/layouts/sidebars/light'))
const SidebarGradient = lazy(() => import('@/views/layouts/sidebars/gradient'))
const SidebarGray = lazy(() => import('@/views/layouts/sidebars/gray'))
const SidebarImage = lazy(() => import('@/views/layouts/sidebars/image'))

const TopbarDark = lazy(() => import('@/views/layouts/topbars/dark'))
const TopbarGray = lazy(() => import('@/views/layouts/topbars/gray'))
const TopbarGradient = lazy(() => import('@/views/layouts/topbars/gradient'))
const TopbarWithSubItems = lazy(() => import('@/views/layouts/topbars/with-sub-items'))
const TopbarWithTools = lazy(() => import('@/views/layouts/topbars/with-tools'))

// Components
const Widgets = lazy(() => import('@/views/widgets'))
const Metrics = lazy(() => import('@/views/metrics'))

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

const errorRoutes: RouteObject[] = [
  { path: '/error/400', element: <Error400 /> },
  { path: '/error/401', element: <Error401 /> },
  { path: '/error/403', element: <Error403 /> },
  { path: '/error/404', element: <Error404 /> },
  { path: '/error/408', element: <Error408 /> },
  { path: '/error/500', element: <Error500 /> },
]

const otherPagesRoutes: RouteObject[] = [
  { path: '/coming-soon', element: <ComingSoon /> },
  { path: '/maintenance', element: <Maintenance /> },
]

const dashboardRoutes: RouteObject[] = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/dashboard2', element: <Dashboard2 /> },
  { path: '/dashboard3', element: <Dashboard3 /> },
]

const ecommerceRoutes: RouteObject[] = [
  { path: '/products', element: <ProductList /> },
  { path: '/products/create', element: <ProductCreate /> },
  { path: '/products/edit/:productId', element: <ProductEdit /> },
  { path: '/products-grid', element: <ProductGrid /> },
  { path: '/products/:productId', element: <ProductDetails /> },
  { path: '/add-product', element: <AddProduct /> },
  { path: '/categories', element: <Categories /> },
  { path: '/countries-regions', element: <CountriesRegions /> },
  { path: '/inventory', element: <InventoryDetails /> },
  { path: '/payments', element: <Payments /> },
  { path: '/orders', element: <Orders /> },
  { path: '/orders/:orderId', element: <OrderDetails /> },
  { path: '/customers', element: <Customers /> },
  { path: '/customers/:customerId', element: <CustomerDetails /> },
  { path: '/sellers', element: <Sellers /> },
  { path: '/sellers/:sellerId', element: <SellerDetails /> },
  { path: '/reviews', element: <Reviews /> },
  { path: '/reports/product-views', element: <ProductViews /> },
  { path: '/reports/sales', element: <Sales /> },
  { path: '/banners', element: <Banners /> },
  { path: '/banners/new', element: <BannerCreate /> },
  { path: '/banners/:bannerId/edit', element: <BannerEdit /> },
]

const settingsRoutes: RouteObject[] = [
  { path: '/settings', element: <Settings /> },
]

const otherAppsRoutes: RouteObject[] = [
  { path: '/companies', element: <Companies /> },
  { path: '/clients', element: <Clients /> },
  { path: '/outlook-view', element: <OutlookView /> },
  { path: '/vote-list', element: <VoteList /> },
  { path: '/issue-tracker', element: <IssueTracker /> },
  { path: '/api-keys', element: <ApiKeys /> },
  { path: '/blogs', element: <Blogs /> },
  { path: '/article', element: <Article /> },
  { path: '/pin-board', element: <PinBoard /> },
  { path: '/forum-view', element: <ForumView /> },
  { path: '/forum-post', element: <ForumPost /> },
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

const miscellaneousRoutes: RouteObject[] = [
  { path: '/miscellaneous/nestable-list', element: <NestableList /> },
  { path: '/miscellaneous/text-different', element: <TextDifferent /> },
  { path: '/miscellaneous/pdf-viewer', element: <PdfViewer /> },
  { path: '/miscellaneous/sweet-alert', element: <SweetAlert /> },
  { path: '/miscellaneous/idle-timer', element: <IdleTimer /> },
  { path: '/miscellaneous/password-meter', element: <PasswordMeter /> },
  { path: '/miscellaneous/clipboard', element: <Clipboard /> },
  { path: '/miscellaneous/tree-view', element: <TreeView /> },
  { path: '/miscellaneous/loading-buttons', element: <LoadingButtons /> },
  { path: '/miscellaneous/gallery', element: <Gallery /> },
  { path: '/miscellaneous/masonry', element: <Masonry /> },
  { path: '/miscellaneous/tour', element: <Tour /> },
  { path: '/miscellaneous/animation', element: <Animation /> },
]

const layoutRoutes: RouteObject[] = [
  { path: '/layouts/scrollable', element: <ScrollableLayout /> },
  { path: '/layouts/compact', element: <CompactLayout /> },
  { path: '/layouts/boxed', element: <BoxedLayout /> },
  { path: '/layouts/horizontal', element: <HorizontalLayout /> },

  { path: '/layouts/sidebars/compact', element: <SidebarCompact /> },
  { path: '/layouts/sidebars/icon-view', element: <SidebarIconView /> },
  { path: '/layouts/sidebars/on-hover', element: <SidebarOnHover /> },
  { path: '/layouts/sidebars/on-hover-active', element: <SidebarOnHoverActive /> },
  { path: '/layouts/sidebars/offcanvas', element: <SidebarOffcanvas /> },
  { path: '/layouts/sidebars/no-icons-with-lines', element: <SidebarNoIconsLines /> },
  { path: '/layouts/sidebars/with-lines', element: <SidebarWithLines /> },
  { path: '/layouts/sidebars/light', element: <SidebarLight /> },
  { path: '/layouts/sidebars/gradient', element: <SidebarGradient /> },
  { path: '/layouts/sidebars/gray', element: <SidebarGray /> },
  { path: '/layouts/sidebars/image', element: <SidebarImage /> },

  { path: '/layouts/topbars/dark', element: <TopbarDark /> },
  { path: '/layouts/topbars/gray', element: <TopbarGray /> },
  { path: '/layouts/topbars/gradient', element: <TopbarGradient /> },
  { path: '/layouts/topbars/with-sub-items', element: <TopbarWithSubItems /> },
  { path: '/layouts/topbars/with-tools', element: <TopbarWithTools /> },
]

const componentRoutes: RouteObject[] = [
  { path: '/widgets', element: <Widgets /> },
  { path: '/metrics', element: <Metrics /> },
]

const allRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          ...dashboardRoutes,
          ...ecommerceRoutes,
          ...otherAppsRoutes,
          ...pagesRoutes,
          ...miscellaneousRoutes,
          ...layoutRoutes,
          ...componentRoutes,
          ...settingsRoutes,
        ],
      },
    ],
  },
]

const otherRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  ...authRoutes,
  ...errorRoutes,
  ...otherPagesRoutes,
]

export const routes: RouteObject[] = [...allRoutes, ...otherRoutes]
