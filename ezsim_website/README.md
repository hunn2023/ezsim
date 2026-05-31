# EZSIM.VN - WEBSITE DESIGN MOCKUP

> Kết nối dễ như chớp mắt — Connect in a Flash

---

## 📦 NỘI DUNG GÓI FILE

### 🌐 3 trang HTML có thể chạy trực tiếp trên trình duyệt

| File | Mô tả |
|------|-------|
| `01_trang_chu.html` | **Trang chủ** - showcase 4 dòng sản phẩm, điểm đến hot, testimonials |
| `02_danh_muc_esim.html` | **Danh mục eSIM Du lịch** (lấy ví dụ Nhật Bản) - có bộ lọc thông minh |
| `03_danh_muc_the_game.html` | **Danh mục Thẻ Viễn thông & Game** - flow mua nhanh 3 bước |

### 🖼️ Preview ảnh fullpage (1440×screenshot dài)

| File | Mô tả |
|------|-------|
| `preview_01_homepage.png` | Trang chủ render đầy đủ |
| `preview_02_esim_category.png` | Trang eSIM Nhật Bản |
| `preview_03_card_game.png` | Trang thẻ viễn thông/game |

---

## 🎯 PHÂN TÍCH & CHIẾN LƯỢC THIẾT KẾ

### Học hỏi từ esimdulich.com
✅ Cấu trúc phân loại: eSIM quốc gia / khu vực / toàn cầu  
✅ 3 bước mua hàng đơn giản (Chọn → QR → Kết nối)  
✅ Trust signals (100K+ đánh giá, hoàn tiền 100%)  
✅ Mục "Bán chạy nhất" trên menu  

### Cải tiến vượt trội của EZSIM
🚀 **4 dòng sản phẩm trong 1 site** (thay vì chỉ eSIM): eSIM Du lịch + Thẻ Viễn thông + Thẻ Game + Data 4G/5G  
🚀 **Bộ lọc thông minh**: theo số ngày, dung lượng, khoảng giá, tính năng  
🚀 **Quick filter pills** ngay trên đầu danh sách: Bán chạy / Giá rẻ / 5G / Unlimited / Có SĐT  
🚀 **Flow mua thẻ chỉ 3 bước rõ ràng**: Chọn nhà cung cấp → Mệnh giá → Thanh toán  
🚀 **Hiển thị giá đã chiết khấu ngay**: User thấy lợi ích tức thì  
🚀 **Header sticky + thanh search luôn hiện**: Mua nhanh không cần scroll lên  

---

## 🏗️ KIẾN TRÚC WEBSITE TỔNG THỂ

```
ezsim.vn/
├── / (Trang chủ)
│
├── /esim-du-lich/
│   ├── /viet-nam (về VN)
│   ├── /nhat-ban
│   ├── /han-quoc
│   ├── /chau-au
│   ├── /toan-cau
│   └── ... 200+ trang quốc gia
│
├── /the-vien-thong/
│   ├── /viettel
│   ├── /vinaphone
│   ├── /mobifone
│   └── /vietnamobile
│
├── /the-game/
│   ├── /garena
│   ├── /zing
│   ├── /vcoin
│   ├── /gate
│   ├── /steam
│   ├── /riot
│   ├── /mycard
│   └── /bit
│
├── /data-4g-5g/
│   ├── /viettel-4g
│   ├── /vinaphone-4g
│   ├── /mobifone-4g
│   └── /vietnamobile-4g
│
├── /khuyen-mai
├── /huong-dan/
├── /cau-hoi-thuong-gap
├── /lien-he
└── /blog
```

---

## 🎨 NGUYÊN TẮC THIẾT KẾ ĐÃ ÁP DỤNG

### 1. Phân cấp sản phẩm theo 4 tab chính
```
[ Trang chủ | eSIM Du lịch | Thẻ Viễn thông | Thẻ Game | Data 4G/5G | Khuyến mãi ]
```
Mỗi nhóm có icon khác màu để dễ phân biệt:
- 🌍 eSIM Du lịch: Xanh dương (gradient brand)
- 📱 Thẻ Viễn thông: Cam (Telecom warmth)
- 🎮 Thẻ Game: Tím (Gaming vibe)
- 📶 Data 4G/5G: Xanh lá (Tốc độ, fresh)

### 2. Hierarchy tối ưu trên trang danh mục eSIM
```
Country Hero (cờ + thông tin nhà mạng)
    ↓
Quick Filter Pills (Bán chạy / Giá rẻ / 5G...)
    ↓
Sidebar Filter + Grid sản phẩm (2 cột)
    ↓
Tabs Info (Giới thiệu / Cài đặt / FAQ)
```

### 3. Flow mua thẻ Game/VT chỉ 3 bước
```
Bước 1: Chọn nhà cung cấp (logo grid lớn, có chiết khấu)
    ↓
Bước 2: Chọn mệnh giá (8 ô từ 10K → 500K, hiện giá thanh toán)
    ↓
Bước 3: Form + Tóm tắt đơn hàng cùng 1 màn hình → Thanh toán
```
**Không cần đăng ký tài khoản** mới mua được - giảm rào cản chuyển đổi.

### 4. Trust signals khắp nơi
- Top bar: Hotline 24/7 luôn hiện
- Hero: 200+ quốc gia, 100K+ KH, 4.9 sao
- Trust bar: 4 USPs (30s / Hoàn tiền / 24/7 / Rẻ nhất)
- Testimonials thật bằng tiếng Việt
- "Bộ Công Thương đã thông báo" ở footer

### 5. Mobile-first & responsive
File HTML đã có CSS responsive cơ bản. Khi triển khai chính thức cần:
- Mobile: 1 cột sản phẩm (thay vì 2)
- Tablet: 2 cột (như desktop hiện tại)
- Bottom navbar trên mobile (Trang chủ / Tìm kiếm / Giỏ / Tài khoản)

---

## 💡 CÁC TÍNH NĂNG ĐỀ XUẤT THÊM (ROADMAP)

### Phase 1 - MVP (đã có trong mockup)
- [x] Trang chủ với 4 dòng sản phẩm
- [x] Danh mục eSIM theo quốc gia
- [x] Mua thẻ điện thoại / game
- [x] Bộ lọc & sort
- [x] Checkout 1 trang

### Phase 2 - Tăng conversion
- [ ] **AI Suggester**: "Tôi đi Nhật 7 ngày, ngân sách 200K" → gợi ý gói phù hợp nhất
- [ ] **Live chat** Zalo/Messenger float góc phải
- [ ] **Pop-up exit intent**: giảm 5% cho khách định rời trang
- [ ] **Stick add-to-cart** mobile khi xem chi tiết gói

### Phase 3 - Trải nghiệm người dùng nâng cao
- [ ] **Tính năng "So sánh gói"**: tick 2-3 gói cạnh nhau
- [ ] **Lịch sử mua hàng** + tự động re-order
- [ ] **Mã QR cài eSIM gửi qua app riêng** (đã có hiện hữu)
- [ ] **Dashboard quản lý data còn lại** trên app
- [ ] **Affiliate/Reseller portal** cho đại lý

### Phase 4 - Mở rộng
- [ ] **Quà tặng eSIM**: gửi gift card cho người thân đi du lịch
- [ ] **B2B portal**: giá sỉ cho công ty, đại lý du lịch
- [ ] **API integration**: tích hợp với Booking.com, Klook, Traveloka

---

## 🛠️ HƯỚNG DẪN TRIỂN KHAI

### Bước 1: Mở file HTML để xem
Click đúp vào từng file `.html` - mở trực tiếp bằng Chrome/Safari/Edge để xem trên máy.

### Bước 2: Chuyển đổi sang code production
Bạn (hoặc team dev) có thể chuyển sang:

**Frontend Framework đề xuất:**
- **Next.js + Tailwind CSS** - SEO tốt, render server-side, phù hợp e-commerce
- **Nuxt.js (Vue)** - Giống stack esimdulich.com đang dùng
- **Astro** - Build tĩnh siêu nhanh, SEO tuyệt vời

**Backend đề xuất:**
- **Supabase / Firebase** - nhanh launch MVP
- **Laravel / Node.js + PostgreSQL** - khi scale lớn

**Cổng thanh toán cho VN:**
- VNPay, Momo, ZaloPay, OnePay, Stripe (cho thẻ quốc tế)

### Bước 3: SEO setup
- Mỗi trang quốc gia có URL friendly: `/esim-du-lich/nhat-ban`
- Title format: `eSIM Nhật Bản giá từ 79K - Kích hoạt 30s | EZSIM`
- Meta description tối ưu các keyword: eSIM nhật bản, sim du lịch nhật, sim 4g nhật
- Schema.org Product markup cho từng gói data

---

## 🎨 STYLE GUIDE TÓM TẮT

### Màu chủ đạo
- Primary: `#0066FF` (Electric Blue)
- Cyan: `#00D4FF`
- Navy: `#0A1628` (text + footer)
- Background: `#F8FAFC`

### Typography
- Font: Be Vietnam Pro (Google Fonts) - hỗ trợ tiếng Việt tốt nhất
- H1: 48px / weight 800 / letter-spacing -1px
- H2: 32px / weight 800
- H3: 18-20px / weight 700
- Body: 14-15px / weight 400 / line-height 1.6

### Spacing
- Container max-width: 1280px
- Section padding: 64px (top/bottom)
- Card padding: 24-28px
- Border-radius: 12px (small), 16-20px (cards), 50% (avatar/icon)

### Component naming convention
- `.section` - khu vực lớn
- `.section-inner` - container giới hạn 1280px
- `.card` - thẻ chứa nội dung
- `.btn-primary` - nút CTA chính
- `.tag` / `.badge` - nhãn nhỏ

---

**© 2026 EZSIM Vietnam — Bộ design v1.0**
