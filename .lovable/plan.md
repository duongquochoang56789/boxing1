

# M1: Landing Page moi cho Slide Builder

## Chien luoc vi tri & tach biet UI

### Vi tri route
- **Landing Page Builder**: `/builder` - trang marketing gioi thieu san pham
- Trang FlyFit (`/`) van giu nguyen, khong thay doi
- Khi nguoi dung click CTA tren `/builder` -> chuyen den `/slides/new` (tao moi) hoac `/slides` (dashboard)

### Cau truc route moi trong App.tsx

```text
/              -> Index.tsx (FlyFit landing - giu nguyen)
/builder       -> BuilderLanding.tsx (TRANG MOI - marketing cho Slide Builder)
/slides        -> SlideDashboard.tsx (dashboard, yeu cau dang nhap)
/slides/new    -> SlideBuilder.tsx (tao deck moi)
/slides/:id    -> DeckEditor.tsx (editor)
```

### Tach biet hoan toan UI/UX

Landing page `/builder` se co **thiet ke hoan toan khac** voi FlyFit:
- **Khong** dung Header/Footer cua FlyFit
- Co header rieng (logo Builder + CTA "Dang nhap" / "Thu mien phi")
- Tone mau: Dark-first (charcoal/slate) + accent gradient (tim/xanh duong), khac han FlyFit terracotta
- Font: Van dung Cormorant Garamond heading + Be Vietnam Pro body (nhat quan he thong)

---

## Noi dung Landing Page `/builder`

### Section 1: Hero
- Headline lon: "Tao Slide Thuyet Trinh Trong 30 Giay"
- Sub: "Chi can nhap y tuong — AI tu dong thiet ke toan bo bai thuyet trinh chuyen nghiep"
- CTA: "Thu mien phi" (-> /slides/new) + "Xem demo" (scroll xuong)
- Visual: Mockup animated cua giao dien editor (CSS/SVG, khong phai anh that)

### Section 2: How It Works (3 buoc)
1. Nhap y tuong/chu de
2. AI tao slide tu dong (12+ layout)
3. Chinh sua, xuat PDF/PPTX, chia se

### Section 3: Feature Highlights
- 6 feature cards: AI Generation, 12+ Layouts, Export PDF/PPTX, Share Link, AI Rewrite, Image AI
- Moi card co icon + mo ta ngan

### Section 4: Demo/Preview
- Screenshot hoac mockup tuong tac cua editor
- Co the dung slide tu anh user da upload lam reference

### Section 5: Pricing
- 3 goi: Free / Pro ($7/mo) / Business ($15/mo)
- Bang so sanh tinh nang
- CTA "Bat dau mien phi"

### Section 6: Footer nho
- Logo Builder + links (Dashboard, Pricing, Contact)
- Copyright

---

## Chi tiet ky thuat

### File moi can tao

| File | Mo ta |
|------|-------|
| `src/pages/BuilderLanding.tsx` | Trang landing page chinh |
| `src/components/builder-landing/BuilderHeader.tsx` | Header rieng (logo + nav + CTA) |
| `src/components/builder-landing/BuilderHero.tsx` | Hero section voi mockup |
| `src/components/builder-landing/BuilderHowItWorks.tsx` | 3 buoc |
| `src/components/builder-landing/BuilderFeatures.tsx` | 6 feature cards |
| `src/components/builder-landing/BuilderPricing.tsx` | Bang gia 3 goi |
| `src/components/builder-landing/BuilderFooter.tsx` | Footer don gian |

### File sua

| File | Thay doi |
|------|---------|
| `src/App.tsx` | Them route `/builder` -> `BuilderLanding` |

### Phong cach thiet ke

- Nen: gradient tu `#0f172a` (slate-900) den `#1e293b` (slate-800)
- Accent: gradient `#6366f1` (indigo) -> `#8b5cf6` (violet)
- Text: `#f8fafc` (slate-50) cho heading, `#94a3b8` (slate-400) cho body
- Cards: `bg-white/5 backdrop-blur border border-white/10`
- Animation: Framer Motion whileInView, stagger cho cards
- Responsive: Mobile-first, 1 cot mobile -> 2-3 cot desktop

### Khong phu thuoc FlyFit
- Khong import bat ky component nao tu `src/components/landing/`
- Chi dung shared UI (`button`, `badge`) tu `src/components/ui/`
- Co the tai su dung `useAuth` de kiem tra trang thai dang nhap

---

## Tong ket
- **7 file moi** (1 page + 6 components)
- **1 file sua** (App.tsx - them 1 route)
- Khong can migration, khong can edge function
- Thiet ke tach biet hoan toan voi FlyFit, san sang cho viec Remix sau nay
- Khi Remix, chi can doi `/builder` thanh `/` va xoa FlyFit

