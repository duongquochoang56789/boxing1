

# Kế hoạch Sao lưu và Phục hồi Dữ liệu cho FLYFIT

## Vấn đề cần giải quyết

Nếu dự án bị xóa hoặc gặp sự cố, toàn bộ dữ liệu bên dưới sẽ mất vĩnh viễn:

| Nội dung cụ thể | Số lượng hiện tại | Mức quan trọng |
|---|---|---|
| Nội dung landing page (tiêu đề, mô tả các section Hero, About, Services, Pricing...) | 129 mục | Rất cao |
| 30 slide thuyết trình dự án FLYFIT | 30 slide | Cao |
| Tin nhắn trò chuyện với trợ lý AI | 4 tin nhắn, 2 cuộc hội thoại | Trung bình |
| Phân quyền admin (tài khoản admin@flyfit.vn) | 2 bản ghi | Cao |
| Hồ sơ người dùng | 1 hồ sơ | Cao |
| Thông tin khách hàng tiềm năng (form liên hệ) | 0 (sẽ quan trọng khi có khách) | Tương lai |
| Lịch tập, đặt PT, đăng ký lớp | 0 | Tương lai |
| Hình ảnh trong thư mục lưu trữ (ảnh landing page, tài liệu quản trị, ảnh slide) | Tùy số lượng đã upload | Cao |

**Lưu ý:** Tài khoản đăng nhập (email, mật khẩu) không thể backup tự động -- cần tạo lại thủ công.

## Giải pháp: 2 cách backup song song

### Cách 1: Nút "Sao lưu" ngay trong trang Quản trị FLYFIT

Thêm một ô chức năng mới trên trang Admin (`/admin`) với tên "Sao lưu dữ liệu". Khi bấm vào, hiển thị trang có:

- **Nút "Tải backup về máy"**: Bấm là tự động tải 1 file JSON chứa toàn bộ nội dung website về máy tính
- **Nút "Khôi phục từ file"**: Upload file JSON đã tải trước đó để nhập lại dữ liệu
- **Danh sách backup đã tạo**: Hiển thị ngày giờ và dung lượng từng lần backup

Nội dung file backup sẽ gồm:
- Toàn bộ 129 mục nội dung landing page
- 30 slide thuyết trình
- Hồ sơ người dùng và phân quyền
- Lịch sử chat AI
- Thông tin khách hàng tiềm năng
- Lịch tập, đặt PT (nếu có)

### Cách 2: Hướng dẫn backup qua Lovable Cloud

Trong cùng trang backup, hiển thị hướng dẫn từng bước kèm hình ảnh:
1. Bấm vào tab Cloud phía trên cửa sổ xem trước
2. Chọn Database > Tables
3. Chọn bảng cần export, bấm nút Export
4. Lặp lại cho từng bảng

---

## Chi tiết thực hiện

### 1. Tạo chức năng backend "backup-database"
- Đọc dữ liệu từ tất cả 14 bảng
- Đóng gói thành 1 file JSON có ghi ngày giờ
- Lưu vào thư mục lưu trữ riêng (chỉ admin truy cập)
- Trả file về cho trình duyệt tải xuống

### 2. Tạo chức năng backend "restore-database"
- Nhận file JSON từ người dùng upload
- Nhập dữ liệu vào từng bảng theo đúng thứ tự (để tránh lỗi liên kết giữa các bảng)
- Thứ tự: Huấn luyện viên -> Hồ sơ -> Phân quyền -> Lớp học -> Lịch tập -> Nội dung web -> Slide -> Khách hàng -> Chat -> Buổi PT -> Đăng ký lớp -> Tài liệu

### 3. Tạo thư mục lưu trữ "backups" (chỉ admin truy cập)

### 4. Thêm ô "Sao lưu dữ liệu" trên trang Admin
- Thêm vào danh sách chức năng hiện có (bên cạnh "Quản lý nội dung" và "Thuyết trình dự án")

### 5. Tạo trang Backup (`/admin/backup`)
Giao diện gồm:
- Phần trên: Nút bấm "Tải backup ngay" + "Khôi phục từ file"
- Phần giữa: Danh sách các file backup đã tạo trước đó (tên file, ngày, dung lượng)
- Phần dưới: Hướng dẫn backup thủ công qua Lovable Cloud (dạng bước 1-2-3 kèm mô tả)
- Phong cách đồng bộ với brand FLYFIT (màu charcoal, terracotta, cream)

### Các file cần tạo/sửa

| File | Hành động |
|---|---|
| Tạo thư mục lưu trữ `backups` + quyền truy cập | Migration SQL mới |
| `supabase/functions/backup-database/index.ts` | Tạo mới - chức năng đọc và đóng gói dữ liệu |
| `supabase/functions/restore-database/index.ts` | Tạo mới - chức năng khôi phục dữ liệu từ file |
| `src/components/admin/BackupTab.tsx` | Tạo mới - giao diện trang sao lưu |
| `src/pages/AdminBackup.tsx` | Tạo mới - trang `/admin/backup` |
| `src/pages/Admin.tsx` | Thêm ô "Sao lưu dữ liệu" vào danh sách chức năng |
| `src/App.tsx` | Thêm route `/admin/backup` |

### Lưu ý quan trọng
- Backup **không bao gồm** tài khoản đăng nhập (email/mật khẩu) -- cần tạo lại thủ công nếu phục hồi
- Backup **không bao gồm** hình ảnh đã upload -- cần tải riêng hoặc upload lại
- Chỉ tài khoản admin mới có quyền sao lưu và khôi phục

