

# Tong Quan Tinh Trang Du An FLYFIT va Tao Hinh OG

## Phan 1: Nhung gi da hoan thanh

Website FLYFIT da co day du cac thanh phan chinh:

**Landing Page (Trang chu)**
- Header voi navigation
- Hero Section voi form dang ky lead
- About Section
- Gallery Section (auto-scroll + lightbox)
- Services Section (FLY Class, Zen, Burn, Fuel)
- Virtual Training Section
- Pricing Section (3 goi: Khoi Dau, Thang, Premium)
- Trainers Section
- Testimonials Section
- CTA Section
- Contact Section
- Footer

**He thong Backend**
- Database: profiles, trainers, class_schedules, class_registrations, pt_sessions, leads, site_content, project_slides, admin_documents, user_roles, trainer_availability, group_classes
- Authentication (dang nhap/dang ky)
- Admin Content Management (quan ly noi dung, tai lieu, slides)

**Cac trang chuc nang**
- `/auth` — Dang nhap/Dang ky
- `/dashboard` — Dashboard nguoi dung
- `/schedule` — Lich lop hoc nhom (dang ky/huy)
- `/book-pt` — Dat lich PT ca nhan (3 buoc: chon PT > ngay > gio)
- `/project` — 30 slides thuyet trinh AI
- `/admin/content` — Quan ly noi dung + slides

**Tinh nang UI**
- Smooth scroll (Lenis)
- Scroll progress bar
- Scroll to top
- Page transitions (Framer Motion)
- Zalo floating button
- Responsive mobile/desktop
- Shimmer image loading

---

## Phan 2: Nhung gi con thieu / can hoan thien

### Muc do uu tien CAO
1. **Hinh anh OG moi** — Hien dang dung placeholder `og-image.jpg`. Can tao hinh OG chinh thuc voi logo FLYFIT va slogan "Bay Cao. Song Khoe."
2. **Trang `/profile`** — Dashboard link den `/profile` nhung chua co trang nay
3. **Trang `/history`** — Dashboard link den `/history` (lich su tap luyen) nhung chua co
4. **Trang `/admin`** — Dashboard co nut Admin link den `/admin` nhung chi co `/admin/content`

### Muc do uu tien TRUNG BINH
5. **Hinh anh thuc** — Gallery, Trainers, Hero dang dung anh Unsplash generic, chua co hinh FLYFIT thuc te
6. **Email xac nhan** — Khi dang ky tai khoan, chua co flow xac nhan email ro rang
7. **Thong bao / Notification** — Chua co he thong thong bao khi lop sap bat dau
8. **Payment / Thanh toan** — Chua co tich hop thanh toan (Stripe/MoMo/chuyen khoan)

### Muc do uu tien THAP
9. **SEO** — Chua co sitemap.xml, robots.txt co nhung chua toi uu
10. **PWA** — Chua co manifest.json, service worker
11. **Analytics chi tiet** — Co hook useAnalytics nhung chua tich hop GA4 hay cong cu nao
12. **Blog / Bai viet** — Chua co phan content marketing
13. **Nhieu ngon ngu** — Hien chi co tieng Viet

---

## Phan 3: Ke hoach tao hinh OG

Tao hinh OG 1200x630px cho FLYFIT bang AI image generation, sau do upload len storage va cap nhat file `public/og-image.jpg`.

### Buoc thuc hien

1. **Tao Edge Function `generate-og-image`**
   - Su dung model `google/gemini-2.5-flash-image` de tao hinh 1200x630
   - Prompt: Hinh nen gradient cam-den, logo text "FLYFIT" lon o giua, slogan "Bay Cao. Song Khoe." phia duoi, phong cach minimal chuyen nghiep
   - Upload ket qua vao storage bucket `project-slides` (da co san)
   - Tra ve URL cua hinh

2. **Them nut trong Admin** de trigger tao OG image
3. **Cap nhat `index.html`** voi URL hinh moi tu storage

### Thay the don gian hon

Thay vi tao edge function rieng, co the dung truc tiep edge function `generate-slides` da co (mode moi "og-image") hoac tao hinh ngay trong Admin UI roi upload.

---

## Tong ket

| Hang muc | So luong |
|---|---|
| Da hoan thanh | ~85% chuc nang chinh |
| Can lam ngay | 1 viec (OG image) |
| Can bo sung som | 3 trang (profile, history, admin hub) |
| Nang cao | 5-6 tinh nang (payment, notification, PWA...) |

Uu tien thuc hien trong lan nay: **Tao hinh OG moi bang AI** va upload len lam hinh chinh thuc cho website.

