

# Nâng cấp giao diện theo đúng phong cách Pilates Circles by Cult

## So sánh hiện tại vs Trang mẫu

| Yếu tố | Trang mẫu (Pilates Circles) | Trang hiện tại (EliteFit) |
|---------|------------------------------|--------------------------|
| Hero layout | Full-bleed ảnh lớn, text ở bottom-left, form ở bottom-right | Split 2 cột, form bên phải, text bên trái |
| Hero text | Heading cuc lon serif "Move, full circle." overlay trên ảnh | Text trên nền gradient nhạt, không nằm trên ảnh |
| Form vị trí | Glassmorphism card chồng lên ảnh ở góc phải dưới | Card riêng biệt bên cột phải |
| About section | "A studio where control meets calm" + 3 feature cards dạng ảnh + title | Grid 2 cột phức tạp, nhiều element |
| Gallery | "Tour our Space" - horizontal carousel loop | Horizontal drag + category filter |
| Tổng thể | Minimalist, ít decoration, clean | Nhiều blur orbs, gradients, decorative elements |
| Background | Tông peach/terracotta đồng nhất, ảnh chiếm chủ đạo | Nhiều gradient overlay, blur blobs |

## Kế hoạch thực hiện

### 1. Hero Section - Redesign hoàn toàn
- **Ảnh full-bleed** chiếm toàn bộ viewport, không split layout
- **Heading lớn** (serif) đặt ở bottom-left, overlay trực tiếp trên ảnh
- **Lead form** glassmorphism card đặt ở bottom-right, chồng lên ảnh
- **"Discover More"** scroll indicator ở bottom-center
- Bỏ các decorative blur orbs, giữ gradient overlay tối thiểu cho readability
- Bỏ stats row khỏi hero (chuyển sang About)

### 2. About/Features Section - Đơn giản hóa
- Heading "A studio where control meets calm" style
- 3 feature cards ngang: mỗi card gồm ảnh + title + mô tả ngắn
- Layout sạch, ít decorative elements
- Bỏ image grid phức tạp, thay bằng 3 cards đơn giản

### 3. Gallery Section - "Tour our Space"
- Giữ horizontal scroll nhưng theo style infinite carousel
- Cards lớn hơn, ảnh + title + description
- Bỏ category filter (trang mẫu không có)
- Style giống "Tour our Space" của Pilates Circles

### 4. Cleanup toàn bộ
- Giảm decorative blur orbs ở tất cả sections
- Giữ tông màu peach/terracotta nhưng sử dụng tinh tế hơn
- Đảm bảo ảnh là focal point, không phải gradients

## Chi tiết kỹ thuật

### Files cần sửa
- `src/components/landing/HeroSection.tsx` - Redesign hoàn toàn layout
- `src/components/landing/AboutSection.tsx` - Đơn giản hóa thành 3 feature cards
- `src/components/landing/GallerySection.tsx` - Chuyển sang infinite carousel style
- `src/components/landing/ServicesSection.tsx` - Có thể merge hoặc điều chỉnh
- `src/index.css` - Tinh chỉnh CSS utilities nếu cần

### Giữ nguyên
- Color palette (đã match tốt)
- Typography system (Cormorant Garamond)
- Trainers, Testimonials, Contact, Footer (đã tốt)
- Tất cả animations và hooks hiện có
- Trang nội bộ (Auth, Dashboard, Schedule, BookPT)

