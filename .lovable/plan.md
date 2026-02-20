
# Ke Hoach Hoan Thien UI & UX Toan Bo Trang Web EliteFit

## Danh Gia Hien Trang

Sau khi xem xet toan bo codebase va kiem tra tren ca desktop (1920px) va mobile (375px), day la nhung van de can xu ly:

### Van De Phat Hien

**Landing Page:**
1. **Header (Mobile)**: Nav links bi ngat dong (2 dong) tren desktop khi co nhieu link — "HUAN LUYEN VIEN" va "LIEN HE" bi xuong dong 2, tao cam giac khong chuyen nghiep
2. **Hero (Mobile)**: Tieu de va form chong cheo nhau, form bi ep sat, khong co khoang cach voi header — text bi de len logo
3. **Gallery Section**: Carousel tu dong nhung khong co indicator so luong anh, khong co swipe gesture tren mobile
4. **Virtual Training Section**: Chua dung noi dung dong tu CMS (useSiteContent), dang hard-code text
5. **Pricing Section**: Chua dung noi dung dong tu CMS, dang hard-code text
6. **Contact form**: Chua luu du lieu xuong database — form submit khong lam gi ca
7. **Hero form**: Tuong tu — submit chi console.log, khong luu lead
8. **Footer**: Thieu link den Virtual Training va Pricing trong phan "Kham pha"
9. **NotFound page**: Qua don gian, khong theo design system cua trang

**User Portal (Dashboard, BookPT, Schedule):**
10. **Dashboard**: Hardcode "7 ngay" cho chuoi ngay tap — khong chinh xac
11. **Schedule (Mobile)**: Grid 7 cot bi be tren mobile, kho doc
12. **BookPT**: Khong co back link ve trang chu cho nguoi chua dang nhap

**Accessibility & UX:**
13. **Form inputs**: Khong co validation feedback tren Hero form va Contact form
14. **Loading states**: Mot so trang chua co skeleton loading dong bo voi design
15. **Scroll-to-top**: Khong co nut quay lai dau trang khi cuon xuong cuoi

---

## Ke Hoach Thuc Hien (Theo Thu Tu Uu Tien)

### Giai Doan 1 — Sua Loi UI Co Ban (Uu Tien Cao)

**1.1 — Fix Header Desktop: Nav links bi ngat dong**
- Giam font size hoac rut gon ten nav links (vd: "Huan luyen vien" -> "HLV", hoac giam tracking/gap)
- Dam bao tat ca links nam tren 1 dong

**1.2 — Fix Hero Section Mobile**
- Them padding-top de tranh bi header che
- Stack layout dung (text tren, form duoi) voi khoang cach hop ly
- Giam font size heading tren mobile

**1.3 — Fix NotFound Page**
- Redesign theo design system: dung font Cormorant Garamond, mau terracotta, animation nhẹ
- Them link quay ve trang chu va dashboard

### Giai Doan 2 — Ket Noi CMS & Database

**2.1 — Virtual Training Section dung CMS**
- Ket noi voi useSiteContent("virtual-training") de lay noi dung dong
- Hien thi fallback text khi chua co content

**2.2 — Pricing Section dung CMS**
- Ket noi voi useSiteContent("pricing") de lay noi dung dong

**2.3 — Luu Lead Form vao Database**
- Tao bang `leads` (name, email, phone, source, created_at)
- RLS: chi admin doc, anyone insert
- Ket noi Hero form va Contact form de luu du lieu
- Hien thi toast thanh cong/that bai

### Giai Doan 3 — Nang Cap UX

**3.1 — Nut Scroll-to-Top**
- Hien thi khi cuon xuong > 500px
- Animation fade-in/out muot ma
- Vi tri: goc duoi ben phai

**3.2 — Footer cap nhat links**
- Them "Virtual Training" va "Bang gia" vao phan "Kham pha"

**3.3 — Contact form validation**
- Them validation cho cac truong bat buoc (ten, SDT, email)
- Hien thi loi inline va toast feedback

**3.4 — Schedule mobile responsive**
- Chuyen tu grid 7 cot sang list view tren mobile
- Moi ngay la 1 card co the mo rong (accordion)

### Giai Doan 4 — Polish & Micro-interactions

**4.1 — Gallery mobile swipe**
- Them touch swipe support cho carousel
- Them dot indicators hien thi vi tri hien tai

**4.2 — Dashboard fix hardcode stats**
- Thay "7 ngay" bang du lieu thuc tu database hoac hien thi 0 khi chua co

**4.3 — Page transition consistency**
- Dam bao tat ca trang deu co PageTransition wrapper dong nhat

---

## Chi Tiet Ky Thuat

### Database Migration Moi
- Bang `leads`: id (uuid PK), full_name (text), email (text), phone (text), service (text nullable), message (text nullable), source (text — 'hero' | 'contact'), created_at (timestamptz default now())
- RLS: INSERT cho anon/authenticated, SELECT chi admin

### Files Can Tao Moi
- `src/components/ui/scroll-to-top.tsx` — nut quay lai dau trang

### Files Can Chinh Sua
- `src/components/landing/Header.tsx` — fix nav overflow
- `src/components/landing/HeroSection.tsx` — fix mobile layout + luu lead
- `src/components/landing/VirtualTrainingSection.tsx` — ket noi CMS
- `src/components/landing/PricingSection.tsx` — ket noi CMS
- `src/components/landing/ContactSection.tsx` — validation + luu lead
- `src/components/landing/Footer.tsx` — them links
- `src/components/landing/GallerySection.tsx` — mobile touch
- `src/pages/NotFound.tsx` — redesign
- `src/pages/Index.tsx` — them ScrollToTop component
- `src/pages/Dashboard.tsx` — fix hardcode stat
- `src/pages/Schedule.tsx` — mobile responsive

### Khong Thay Doi
- Khong thay doi design system (mau sac, font, animation style)
- Khong thay doi cau truc routing
- Khong thay doi cac file auto-generated (client.ts, types.ts, .env)
