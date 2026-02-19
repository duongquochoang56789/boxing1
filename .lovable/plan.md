
# Kế Hoạch Tích Hợp Mô Hình Kinh Doanh & Lưu Trữ Tài Liệu Admin

## Đánh Giá Sơ Bộ — Mô Hình Small Group Virtual Training

### Điểm Mạnh (từ tài liệu)
- Thị trường fitness online tăng 17.2%/năm, dự kiến đạt 34.72 tỷ USD (2026-2030)
- Doanh thu/giờ gấp 3-5 lần PT 1-1 (trainer thu nhiều hơn, khách trả ít hơn: 50-100k/buổi thay vì 300-400k)
- Chi phí vận hành thấp: 3-7 triệu setup, 3-5 triệu/tháng
- Retention rate tăng 25-30% so với video tự học

### Rủi Ro Cần Xử Lý
- Kỹ thuật: internet, âm thanh, hình ảnh
- Khó kiểm soát form/động tác qua camera
- Cạnh tranh với nội dung miễn phí (YouTube)
- Người tập dễ bỏ cuộc vì thiếu cộng đồng

### Khuyến Nghị Tích Hợp
- Kết hợp hybrid: offline 1-2 buổi/tháng + online phần còn lại
- 3 gói dịch vụ rõ ràng: Gói thử, Gói tháng, Gói premium (kèm dinh dưỡng)
- Marketing: TikTok/Reels + Zalo community + lead magnet 7 ngày free

---

## Phần 1 — Trang Admin Quản Lý Tài Liệu

Xây dựng một tab "Tài Liệu" trong khu vực admin (`/admin/content`) để lưu trữ, xem lại, và bổ sung file PDF, tài liệu chiến lược.

### Database — Bảng mới `admin_documents`

```text
admin_documents
  - id: uuid (PK)
  - title: text (tên tài liệu)
  - description: text (mô tả ngắn)
  - category: text (business-plan, marketing, operations...)
  - file_url: text (URL file trong Storage)
  - file_name: text
  - file_size: integer
  - uploaded_by: uuid (user_id)
  - created_at: timestamptz
  - updated_at: timestamptz
```

### Storage Bucket
- Tạo bucket `admin-documents` (private — chỉ authenticated user có thể đọc)

### RLS Policies
- Chỉ admin mới có thể đọc/ghi/xóa tài liệu
- Public không thể truy cập

### UI — Tab "Tài Liệu" trong Admin

Tab mới bên cạnh tab "Content" hiện có, gồm:
- **Upload zone**: kéo thả hoặc chọn file (PDF, DOCX, XLSX)
- **Danh sách tài liệu**: hiển thị theo category (Business Plan, Marketing, Vận hành...)
- **Preview PDF**: click mở xem trực tiếp trong browser
- **Metadata**: tên, mô tả, ngày upload, kích thước file
- **Xóa tài liệu**: có confirm dialog

---

## Phần 2 — Tích Hợp Mô Hình Kinh Doanh Vào Landing Page

### 2a. Section "Virtual Training" mới trên landing page

Thêm một section giữa Services và Trainers, giới thiệu mô hình hybrid online/offline:

```text
[Icon] Luyện tập không giới hạn không gian
Headline: "Tập cùng chuyên gia — dù bạn ở đâu"
Sub: Nhóm nhỏ 5-7 người, trainer theo dõi trực tiếp qua video
3 điểm nổi bật: Tiện lợi | Tiết kiệm | Hiệu quả
CTA: "Xem các gói dịch vụ"
```

### 2b. Bảng Pricing 3 Gói

Section mới `/pricing` hoặc anchor `#pricing` trên landing page:

```text
┌─────────────────┬─────────────────┬─────────────────┐
│   Gói Khởi Đầu  │   Gói Tháng     │   Gói Premium   │
│   2-3 buổi thử  │   8-12 buổi     │  + Dinh dưỡng   │
│   ~200-300k     │   ~800k-1.2tr   │   ~1.5-2tr      │
│ [Đăng ký thử]  │  [Chọn gói]     │  [Tư vấn]       │
└─────────────────┴─────────────────┴─────────────────┘
```

### 2c. Cập nhật Booking Flow

Thêm option "Online" / "Offline" khi đặt lịch PT (trang `/book-pt` hiện có):
- Chọn hình thức: Tập tại phòng / Tập online qua Zoom
- Nếu online: hiển thị link Zoom sau khi xác nhận booking

---

## Thứ Tự Thực Hiện

### Bước 1 — Nền tảng lưu trữ tài liệu (ưu tiên trước)
1. Tạo migration: bảng `admin_documents` + RLS policies
2. Tạo storage bucket `admin-documents` (private)
3. Thêm tab "Tài Liệu" vào trang `/admin/content`
4. Upload ngay file PDF hiện tại vào hệ thống

### Bước 2 — Landing page tích hợp mô hình
5. Thêm section "Virtual Training" giữa Services và Trainers
6. Thêm section Pricing với 3 gói dịch vụ
7. Cập nhật form đặt lịch thêm option Online/Offline

### Bước 3 — Admin content cho section mới
8. Thêm "Virtual Training" và "Pricing" vào `/admin/content` để generate AI content

---

## Chi Tiết Kỹ Thuật

### Files cần tạo mới
- `src/components/landing/VirtualTrainingSection.tsx`
- `src/components/landing/PricingSection.tsx`
- `src/components/admin/DocumentsTab.tsx`

### Files cần chỉnh sửa
- `src/pages/AdminContent.tsx` — thêm tab Documents
- `src/pages/Index.tsx` — thêm 2 section mới
- `src/pages/BookPT.tsx` — thêm option Online/Offline

### Database migration
- Tạo bảng `admin_documents`
- Tạo bucket `admin-documents` qua SQL (storage.buckets)
- RLS: chỉ admin đọc/ghi

### Lưu ý quan trọng
- File PDF sẽ được lưu vĩnh viễn trong hệ thống
- Admin có thể upload thêm tài liệu bất kỳ lúc nào
- Tài liệu được phân loại theo category để dễ tìm kiếm
- Chỉ tài khoản admin mới truy cập được
