

# Ke hoach: Thong nhat cac trang Builder thanh ung dung hoan chinh

## Van de hien tai

3 trang chinh dang hoat dong nhu 3 ung dung rieng biet:

```text
/builder  --> Header: "SlideAI" (indigo/violet), nav rieng
/slides   --> Header: "FLYSLIDES" (dark/orange), nav rieng
/brand    --> Header: chi co nut Back, khong nav
```

- Khong co thanh dieu huong chung
- Khong co cach di chuyen nhanh giua Slides va Brand
- Thuong hieu khong nhat quan (SlideAI vs FLYSLIDES)

## Giai phap: App Shell chung

Tao mot **App Shell** (layout wrapper) dung chung cho tat ca cac trang builder, bao gom:
- Sidebar navigation co dinh (hoac top nav) voi cac muc: Dashboard, Brand Kit, Tao moi
- Thuong hieu thong nhat
- User menu (profile, logout)

### Phuong an cu the: Sidebar Layout

```text
+------------------+----------------------------------------+
| LOGO             |  (Noi dung thay doi theo route)        |
|                  |                                        |
| Dashboard (/slides)                                      |
| Brand Kit (/brand)                                       |
| Tao moi (/slides/new)                                    |
|                  |                                        |
| --- bottom ---   |                                        |
| Profile          |                                        |
| Dang xuat        |                                        |
+------------------+----------------------------------------+
```

- Sidebar thu gon (chi icon) tren mobile va mac dinh, hover/click de mo rong
- Trang `/builder` (landing marketing) van giu doc lap vi day la trang cong khai cho khach chua dang nhap
- Tat ca trang sau dang nhap (`/slides`, `/brand`, `/slides/:id`, `/slides/new`) dung chung layout

### Cac file can tao/sua

| File | Loai | Mo ta |
|------|------|-------|
| `src/components/builder/AppSidebar.tsx` | Tao moi | Sidebar dieu huong chung voi logo, nav items, user menu |
| `src/components/builder/AppLayout.tsx` | Tao moi | Layout wrapper: sidebar + main content area |
| `src/pages/SlideDashboard.tsx` | Sua | Xoa header rieng, chi giu phan content |
| `src/pages/BrandGenerator.tsx` | Sua | Xoa header rieng, chi giu phan content |
| `src/pages/SlideBuilder.tsx` | Sua | Tich hop vao AppLayout |
| `src/pages/DeckEditor.tsx` | Sua nhe | Giu nguyen (editor co toolbar rieng la hop ly) |
| `src/App.tsx` | Sua | Boc cac route builder trong AppLayout |

### Thuong hieu thong nhat

- Ten: **SlideAI** (da co tren landing page /builder)
- Mau chinh: Gradient indigo-violet (tu landing) ket hop voi dark theme (tu dashboard)
- Logo: Icon Presentation + "SlideAI" text

### Luong dieu huong moi

```text
/builder          --> Landing page marketing (KHONG co sidebar, cong khai)
/slides           --> AppLayout > SlideDashboard (danh sach deck)
/slides/new       --> AppLayout > SlideBuilder (tao deck moi)
/slides/:id       --> DeckEditor (editor rieng, co FloatingToolbar)
/slides/:id/present --> DeckPresent (fullscreen)
/brand            --> AppLayout > BrandGenerator
```

### Chi tiet AppSidebar

- Logo SlideAI phia tren
- Navigation items:
  - Presentation icon: "Dashboard" -> /slides
  - Palette icon: "Brand Kit" -> /brand
  - Plus icon: "Tao moi" -> /slides/new
- Phan duoi:
  - User avatar + ten
  - Nut dang xuat
  - Link ve trang chu FLYFIT (/)
- Thu gon thanh 60px (chi icon) tren mobile
- Active state: highlight muc dang chon

### Chi tiet AppLayout

```text
<div className="flex min-h-screen bg-[#0a0a0a]">
  <AppSidebar />
  <main className="flex-1 overflow-auto">
    <Outlet /> {/* hoac children */}
  </main>
</div>
```

## Khong can thay doi

- Database: khong can migration
- Edge functions: khong thay doi
- Dependencies: khong can cai them
- DeckEditor va DeckPresent: giu nguyen vi co giao dien dac thu rieng (FloatingToolbar, fullscreen)
- Trang /builder (landing): giu doc lap vi la trang marketing cong khai

## Ket qua mong doi

- Nguoi dung dang nhap -> vao /slides -> thay sidebar ben trai
- Co the chuyen nhanh giua Dashboard, Brand Kit, Tao moi
- Thuong hieu nhat quan "SlideAI" tren tat ca cac trang
- Trai nghiem lien mach nhu mot ung dung SaaS chuyen nghiep

