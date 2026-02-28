

# Tich hop AI Slide Builder vao Trang chu FLYFIT

## Tong quan
Hien tai, AI Slide Builder chi co the truy cap qua menu "Du an" trong Header (di den `/slides`), nhung tren trang chu khong co section nao gioi thieu hay quang ba tinh nang nay. Ke hoach nay se:

1. **Kiem tra va liet ke cac tinh nang chua hoan thien** cua Slide Builder
2. **Tao mot section moi tren trang chu** de gioi thieu AI Slide Builder, dat giua cac section hien co

---

## Phan 1: Tinh nang Slide Builder chua hoan thien

Dua tren ma nguon hien tai, cac tinh nang da hoat dong:
- Tao deck bang AI tu prompt
- Editor voi Markdown, keyboard shortcuts, auto-save indicator
- 12 loai layout (bao gom image-full, comparison)
- Xuat PDF, chia se public link
- Template suggestions khi tao moi
- Dashboard voi thumbnail, tim kiem, xoa/public/private

Cac tinh nang **chua co hoac chua hoan thien**:
- **Drag-and-drop sap xep slide**: Chua co code keo tha trong editor (chi co nut di chuyen len/xuong)
- **Grid View**: Khong co che do grid/overview trong editor
- **Presenter View** voi timer, notes, next slide preview: Chua co (chi co fullscreen presentation co ban)
- **Dark mode toggle** trong editor toolbar: Chua co
- **Xuat PowerPoint (PPTX)**: Chua co, chi co PDF
- **Realtime collaboration**: Chua co

---

## Phan 2: Tao Section "AI Slide Builder" tren Trang chu

### Vi tri
Dat section moi ngay **sau VirtualTrainingSection** va **truoc PricingSection** trong Index.tsx. Day la vi tri chien luoc vi:
- Sau khi nguoi dung da xem dich vu va mo hinh tap luyen
- Truoc phan bang gia, tao an tuong ve gia tri cong nghe

### Thiet ke Section

Section se bao gom:
- **Tieu de**: "Tao Slide Thuyet Trinh Bang AI" voi label "Cong Cu AI"
- **Mo ta ngan**: Nhan manh tinh nang tu dong tao slide tu prompt
- **3 Feature Cards**: Hien thi 3 diem noi bat (Tao tu dong, 12+ Layout, Chia se de dang)
- **Mock/Demo Preview**: Hien thi mot mockup giao dien slide builder hoac animation SVG minh hoa
- **CTA Button**: "Thu ngay mien phi" -> dieu huong den `/slides/new` (yeu cau dang nhap)

### Phong cach
- Nen gradient nhe (charcoal -> charcoal/95) de tao contrast voi cac section sang mau cream
- Cards dung glass effect (bg-cream/5 backdrop-blur) tuong tu style cua VirtualTrainingSection
- Animation: fade-in khi scroll vao view (useInView)
- Icon su dung lucide-react (Sparkles, Presentation, Layout, Share2...)

### File thay doi

| File | Thay doi |
|------|---------|
| **Tao moi**: `src/components/landing/AISlideSection.tsx` | Section gioi thieu AI Slide Builder voi 3 feature cards, mockup preview va CTA |
| **Sua**: `src/pages/Index.tsx` | Import va them `AISlideSection` vao giua VirtualTrainingSection va PricingSection |

---

## Chi tiet ky thuat

### AISlideSection.tsx
```text
Component structure:
- Section wrapper: nen gradient charcoal, padding section-padding
- Header: label "Cong Cu AI" + heading 2 dong + description
- Feature grid (3 cols):
  1. Icon Sparkles + "AI Tu Dong Tao" + mo ta
  2. Icon Layout + "12+ Bo Cuc Chuyen Nghiep" + mo ta  
  3. Icon Share2 + "Chia Se & Trinh Chieu" + mo ta
- Demo area: Mockup 16:9 voi gradient background, fake slide preview
- CTA: MagneticButton "Tao Slide Ngay" -> navigate("/slides/new")
- Animation: Framer Motion whileInView + stagger cho cards
```

### Index.tsx thay doi
```text
- Import AISlideSection
- Dat giua <VirtualTrainingSection /> va <PricingSection />
```

## Tong ket
- **1 file moi**: `AISlideSection.tsx`
- **1 file sua**: `Index.tsx` (them 2 dong import + render)
- Khong can migration, edge function, hay dependency moi
- Thiet ke nhat quan voi style hien tai cua landing page (premium, sang trong)
