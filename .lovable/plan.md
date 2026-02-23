

# Thêm link Quản trị vào trang chủ FLYFIT

## Mục tiêu
Thêm một đường dẫn "Quản trị" ở phần chân trang (footer) của website, giúp admin truy cập nhanh vào trang quản lý mà không cần gõ URL thủ công.

## Thay đổi cụ thể

### 1. Footer - Thêm link "Quản trị"
Trong file `src/components/landing/Footer.tsx`, thêm mục "Quản trị" vào danh sách "Khám phá" (cột bên phải của footer):

```text
Khám phá:
- Về chúng tôi
- Virtual Training
- Bảng giá
- Huấn luyện viên
- Tài liệu dự án
- Liên hệ
- Quản trị        <-- MỚI (link đến /auth)
```

Link sẽ dẫn đến trang `/auth` (trang đăng nhập), nơi đã có sẵn nút "Đăng nhập nhanh Admin Demo" với tài khoản `admin@flyfit.vn / admin123`. Sau khi đăng nhập, hệ thống tự động chuyển đến trang Admin.

### File cần sửa
| File | Thay đổi |
|---|---|
| `src/components/landing/Footer.tsx` | Thêm 1 dòng link "Quản trị" vào mảng `footerLinks.company`, trỏ đến `/auth` |

Thay đổi rất nhỏ - chỉ thêm 1 dòng code.
