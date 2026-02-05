

# 🏋️ Kế hoạch phát triển Gym/Fitness Center Website

## Tổng quan
Website cho phòng tập gym với giao diện sang trọng như Pilates Circles, kèm hệ thống CMS, đặt lịch và quản lý thành viên.

---

## 📅 Phase 1: Landing Page & Nền tảng cơ bản
**Mục tiêu**: Tạo website giới thiệu đẹp mắt có thể chỉnh sửa nội dung

### Tính năng:
- **Hero Section** với video/hình ảnh ấn tượng, slogan và form liên hệ
- **Giới thiệu phòng tập** - Các điểm nổi bật về không gian, thiết bị
- **Tour ảo studio** - Gallery hình ảnh/video các khu vực
- **Danh sách dịch vụ** - Các loại hình tập luyện
- **Đội ngũ huấn luyện viên** - Profile các PT
- **Testimonials** - Đánh giá từ học viên
- **Thông tin liên hệ & bản đồ**
- **Footer với links và mạng xã hội**

### CMS (Admin Panel):
- Đăng nhập quản trị viên
- Quản lý nội dung: chỉnh sửa text, hình ảnh, thông tin dịch vụ
- Quản lý huấn luyện viên
- Quản lý testimonials

---

## 📅 Phase 2: Hệ thống đăng ký & Đặt lịch
**Mục tiêu**: Khách hàng có thể đăng ký tài khoản và đặt lịch tập

### Tính năng khách hàng:
- **Đăng ký / Đăng nhập** - Email và mật khẩu
- **Lịch lớp học nhóm** - Xem lịch các class theo tuần/tháng
- **Đăng ký lớp học** - Chọn và đăng ký tham gia class
- **Đặt lịch cá nhân** - Chọn PT và khung giờ trống
- **Xác nhận qua email** - Thông báo đặt lịch thành công

### CMS (Admin Panel):
- Quản lý lịch lớp học (thêm/sửa/xóa class)
- Quản lý khung giờ huấn luyện cá nhân
- Xem danh sách đăng ký

---

## 📅 Phase 3: Quản lý thành viên & Gói tập
**Mục tiêu**: Theo dõi gói thành viên và lịch sử tập luyện

### Tính năng khách hàng:
- **Dashboard cá nhân** - Tổng quan thông tin thành viên
- **Xem gói thành viên** - Số buổi còn lại, ngày hết hạn
- **Lịch sử tập luyện** - Các buổi đã tham gia
- **Cập nhật hồ sơ** - Thông tin cá nhân, ảnh đại diện
- **Thông báo** - Nhắc nhở lịch tập, sắp hết hạn gói

### CMS (Admin Panel):
- Quản lý danh sách thành viên
- Cấp/gia hạn gói tập cho thành viên
- Xem thống kê: số lượng đăng ký, buổi tập...
- Check-in thành viên (đánh dấu tham gia)

---

## 📅 Phase 4: Hoàn thiện & Nâng cao (Tuỳ chọn)
**Mục tiêu**: Tính năng nâng cao theo nhu cầu

### Có thể bổ sung:
- Thanh toán online (Stripe/VNPAY)
- Đánh giá & feedback sau buổi tập
- Blog/tin tức phòng tập
- Ưu đãi & khuyến mãi
- Mobile responsive hoàn chỉnh
- SEO optimization

---

## 🛠️ Công nghệ sử dụng
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend/Database**: Lovable Cloud (Supabase)
- **Authentication**: Supabase Auth
- **Lưu trữ file**: Supabase Storage

---

## ⏱️ Ước tính thời gian
| Phase | Thời gian |
|-------|-----------|
| Phase 1 | 2-3 ngày |
| Phase 2 | 2-3 ngày |
| Phase 3 | 2-3 ngày |
| Phase 4 | Tuỳ nhu cầu |

**Tổng cộng: ~4 phases chính**, có thể triển khai từng phase để ra sản phẩm nhanh nhất.

