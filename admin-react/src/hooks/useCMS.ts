import { useState, useCallback } from 'react'
import { type PostCategory, type BlogPost, type StaticPage } from '../types/cms'

const CATEGORIES_KEY = 'ezsim_cms_categories'
const POSTS_KEY = 'ezsim_cms_posts'
const PAGES_KEY = 'ezsim_cms_pages'

const initialCategories: PostCategory[] = [
  {
    id: 'CAT-001',
    name: 'Cẩm nang du lịch eSIM',
    slug: 'cam-nang-esim',
    description: 'Hướng dẫn cài đặt eSIM, mẹo sử dụng data tiết kiệm khi đi du lịch nước ngoài và thông tin tương thích thiết bị.',
    displayOrder: 1,
    status: 1,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  },
  {
    id: 'CAT-002',
    name: 'Tin tức & Khuyến mãi',
    slug: 'tin-tuc-khuyen-mai',
    description: 'Chương trình ưu đãi nạp thẻ, giảm giá gói cước eSIM, và các hoạt động sự kiện nổi bật của ezsim.',
    displayOrder: 2,
    status: 1,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  },
  {
    id: 'CAT-003',
    name: 'Hỗ trợ kỹ thuật',
    slug: 'ho-tro-ky-thuat',
    description: 'Hướng dẫn khắc phục sự cố mất sóng, không kết nối được mạng di động, và cấu hình APN tối ưu cho từng nước.',
    displayOrder: 3,
    status: 1,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  }
]

const initialPosts: BlogPost[] = [
  {
    id: 'POST-001',
    categoryId: 'CAT-001',
    authorId: 'USR-001',
    authorName: 'Nguyễn Văn Hùng',
    title: 'Hướng dẫn kích hoạt eSIM trên điện thoại iPhone từ A-Z',
    slug: 'huong-dan-kich-hoat-esim-iphone',
    summary: 'Chỉ với 3 bước đơn giản quét mã QR, bạn có thể dễ dàng cài đặt và kích hoạt gói data du lịch trên iPhone trước khi bay.',
    content: 'Để cài đặt eSIM trên iPhone thành công, điện thoại của bạn cần phải là phiên bản Quốc tế (Unlocked) và kết nối mạng Wi-Fi ổn định. Bước 1: Vào Cài đặt di động -> Thêm gói cước di động. Bước 2: Quét mã QR nhận được từ email của ezsim. Bước 3: Đặt nhãn cho eSIM là Du lịch, tắt Dữ liệu di động của SIM chính và bật Dữ liệu di động của eSIM kèm theo tính năng Chuyển vùng dữ liệu khi đặt chân đến nước ngoài. Chúc bạn có chuyến đi vui vẻ!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=500&auto=format&fit=crop&q=60',
    status: 1,
    sortOrder: 1,
    endDate: null,
    isActive: true,
    createdAt: '2026-05-18T14:32:10Z',
    updatedAt: '2026-05-18T14:32:10Z'
  },
  {
    id: 'POST-002',
    categoryId: 'CAT-002',
    authorId: 'USR-002',
    authorName: 'Trần Thị Lan',
    title: 'Khuyến mãi hè 2026: Giảm ngay 20% cho tất cả gói eSIM châu Âu',
    slug: 'khuyen-mai-he-esim-chau-au',
    summary: 'Đón hè rực rỡ, ezsim tung ưu đãi cực khủng giảm 20% cho các dòng eSIM Châu Âu (Pháp, Đức, Ý, Anh) cho các đơn hàng đến hết 30/6/2026.',
    content: 'Chào hè rực rỡ 2026, ezsim triển khai chương trình tri ân khách hàng du lịch châu Âu. Nhập mã SUMMER20 để nhận ưu đãi giảm giá trực tiếp 20% hóa đơn mua eSIM. Áp dụng cho các dòng eSIM Multi-country châu Âu với thời hạn sử dụng lên đến 30 ngày và dung lượng cước không giới hạn. Mua ngay hôm nay để nhận thông tin phôi mã QR kích hoạt tức thời.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop&q=60',
    status: 1,
    sortOrder: 2,
    endDate: '2026-06-30T23:59:59Z',
    isActive: true,
    createdAt: '2026-05-20T10:15:00Z',
    updatedAt: '2026-05-20T10:15:00Z'
  },
  {
    id: 'POST-003',
    categoryId: 'CAT-003',
    authorId: 'USR-003',
    authorName: 'Lê Minh Tuấn',
    title: 'Mẹo khắc phục lỗi eSIM mất sóng hoặc không truy cập được mạng 4G/5G',
    slug: 'khac-phuc-loi-esim-mat-song',
    summary: 'Nếu eSIM hiển thị "Không có dịch vụ" hoặc không tải được dữ liệu, hãy thử ngay các bước khắc phục điểm truy cập APN này.',
    content: 'Khi đặt chân đến nước ngoài, một số điện thoại không tự nhận diện cấu hình nhà mạng. Hãy kiểm tra các mục sau: 1. Đảm bảo "Chuyển vùng dữ liệu" (Data Roaming) đã được bật trong cài đặt eSIM. 2. Khởi động lại thiết bị để nhận sóng. 3. Nếu vẫn không được, hãy cài đặt APN thủ công. Ví dụ, với eSIM GigSky, cấu hình APN là "mobile.gigsky.com". Với mạng khác, hãy xem kỹ email hướng dẫn chi tiết của ezsim để điền đúng tên APN tương ứng.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60',
    status: 1,
    sortOrder: 3,
    endDate: null,
    isActive: true,
    createdAt: '2026-05-22T08:00:00Z',
    updatedAt: '2026-05-22T08:00:00Z'
  }
]

const initialPages: StaticPage[] = [
  {
    id: 'PAGE-001',
    title: 'Điều khoản Dịch vụ',
    slug: 'terms-of-service',
    content: 'Chào mừng quý khách đến với ezsim.vn. Bằng việc truy cập ứng dụng và sử dụng các dịch vụ viễn thông, eSIM du lịch và thẻ cào của chúng tôi, bạn cam kết tuân thủ các chính sách của ezsim: 1. Thông tin eSIM được gửi qua email ngay sau khi thanh toán thành công. 2. ezsim không chịu trách nhiệm nếu thiết bị của bạn bị lock mạng di động. 3. Dịch vụ eSIM không hỗ trợ hoàn tiền sau khi mã QR đã được quét kích hoạt hoặc sau 7 ngày kể từ lúc mua hàng nếu phôi chưa quét.',
    metaTitle: 'Điều khoản Dịch vụ mua bán eSIM du lịch - ezsim.vn',
    metaDescription: 'Quy định, chính sách bảo hành, hoàn tiền và các quy tắc khi sử dụng sản phẩm viễn thông eSIM du lịch và thẻ điện thoại tại ezsim.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  },
  {
    id: 'PAGE-002',
    title: 'Chính sách Bảo mật',
    slug: 'privacy-policy',
    content: 'Chúng tôi cam kết bảo vệ tuyệt đối dữ liệu cá nhân của người dùng. ezsim chỉ thu thập email và số điện thoại để gửi thông tin đơn hàng eSIM. Các giao dịch thanh toán thông qua VNPay, MoMo, PayPal, Stripe được bảo mật SSL/TLS và xử lý trực tiếp bởi cổng đối tác, ezsim không bao giờ lưu trữ thông tin thẻ ngân hàng hay số tài khoản ví điện tử của khách hàng.',
    metaTitle: 'Chính sách bảo mật thông tin tài khoản khách hàng - ezsim',
    metaDescription: 'Chính sách thu thập, lưu trữ thông tin cá nhân và bảo đảm an toàn dữ liệu khách hàng khi thanh toán mua hàng tại ezsim.vn.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  },
  {
    id: 'PAGE-003',
    title: 'Hướng dẫn cài đặt chung',
    slug: 'installation-guide',
    content: 'Để cài đặt eSIM du lịch cho chuyến đi của bạn, hãy đảm bảo các yêu cầu sau: Thiết bị là máy Quốc tế (Unlocked) và đã bật kết nối Wi-Fi. Cách 1: Quét mã QR code trong Email đặt hàng. Cách 2: Nhập thủ công các thông số SM-DP+ Address và Activation Code. Khuyên dùng: Nên quét mã cài đặt từ trước khi cất cánh tại Việt Nam, eSIM sẽ tự động tìm mạng chuyển vùng ngay khi bạn hạ cánh đến nước ngoài.',
    metaTitle: 'Hướng dẫn quét QR Code cài đặt eSIM đơn giản cho iOS & Android',
    metaDescription: 'Cẩm nang hướng dẫn cài đặt nhanh eSIM du lịch thông qua mã QR và hướng dẫn nhập thủ công SM-DP+ Address cho thiết bị iPhone, Samsung.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z'
  }
]

const loadFromStorage = <T>(key: string, fallback: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

export const useCMS = () => {
  const [categories, setCategories] = useState<PostCategory[]>(() =>
    loadFromStorage(CATEGORIES_KEY, initialCategories)
  )
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    loadFromStorage(POSTS_KEY, initialPosts)
  )
  const [pages, setPages] = useState<StaticPage[]>(() =>
    loadFromStorage(PAGES_KEY, initialPages)
  )

  const saveCategories = (data: PostCategory[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data))
    setCategories(data)
  }

  const savePosts = (data: BlogPost[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(data))
    setPosts(data)
  }

  const savePages = (data: StaticPage[]) => {
    localStorage.setItem(PAGES_KEY, JSON.stringify(data))
    setPages(data)
  }

  // --- Post Categories actions ---
  const addCategory = useCallback((catData: Omit<PostCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: PostCategory = {
      ...catData,
      id: `CAT-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveCategories([...categories, newCat])
  }, [categories])

  const updateCategory = useCallback((id: string, data: Partial<PostCategory>) => {
    saveCategories(categories.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
  }, [categories])

  const deleteCategory = useCallback((id: string) => {
    saveCategories(categories.filter(c => c.id !== id))
    // Clean up category references in posts
    savePosts(posts.map(p => p.categoryId === id ? { ...p, categoryId: null } : p))
  }, [categories, posts])

  // --- Blog Posts actions ---
  const addPost = useCallback((postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: `POST-${Date.now().toString().slice(-5)}`,
      authorId: 'USR-001',
      authorName: 'Nguyễn Văn Hùng',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    savePosts([newPost, ...posts])
  }, [posts])

  const updatePost = useCallback((id: string, data: Partial<BlogPost>) => {
    savePosts(posts.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
  }, [posts])

  const deletePost = useCallback((id: string) => {
    savePosts(posts.filter(p => p.id !== id))
  }, [posts])

  // --- Static Pages actions ---
  const addPage = useCallback((pageData: Omit<StaticPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: StaticPage = {
      ...pageData,
      id: `PAGE-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    savePages([...pages, newPage])
  }, [pages])

  const updatePage = useCallback((id: string, data: Partial<StaticPage>) => {
    savePages(pages.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
  }, [pages])

  const deletePage = useCallback((id: string) => {
    savePages(pages.filter(p => p.id !== id))
  }, [pages])

  return {
    categories,
    posts,
    pages,
    addCategory,
    updateCategory,
    deleteCategory,
    addPost,
    updatePost,
    deletePost,
    addPage,
    updatePage,
    deletePage
  }
}
