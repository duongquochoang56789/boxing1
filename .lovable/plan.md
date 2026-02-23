
# Thêm mục "Dự án" vào Header trang chủ với link đến Slide Builder

## Mục tiêu
Thêm mục **"Dự án"** vào thanh điều hướng chính (Header) của trang chủ, cho phép truy cập nhanh vào ứng dụng AI Slide Builder (`/slides`) ngay từ landing page.

## Thay đổi

### 1. Header - Thêm nav link "Dự án" (`src/components/landing/Header.tsx`)
- Thêm một mục mới vào mảng `navLinks` với thuộc tính `isRoute: true` để điều hướng bằng React Router thay vì scroll:
  - `{ name: "Dự án", href: "/slides", isRoute: true }`
- Vị trí: đặt sau "Liên hệ" hoặc trước "Liên hệ" tuỳ flow tự nhiên

### 2. Footer - Thêm link Slide Builder (`src/components/landing/Footer.tsx`)
- Thêm `{ name: "AI Slide Builder", href: "/slides" }` vào `footerLinks.company` để đồng bộ với Header

### 3. Kiểu link `isRoute`
- Logic xử lý `isRoute` đã có sẵn trong Header (cả desktop lẫn mobile menu) -- chỉ cần thêm thuộc tính `isRoute: true` là hoạt động
- Footer cũng đã xử lý link bắt đầu bằng `/` -- không cần sửa thêm logic

## Kỹ thuật
- Không cần thêm dependency hay migration
- Chỉ sửa 2 file: `Header.tsx` và `Footer.tsx`
- Tổng thay đổi: khoảng 2-3 dòng code
