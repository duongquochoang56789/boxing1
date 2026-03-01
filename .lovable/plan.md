

# Ke hoach: Hoan thien Minimalist UI (Part A) + Brand Identity Generator (Part B)

## Tong quan

Ke hoach gom 2 phan chinh:
- **Part A**: Hoan thien cac tinh nang Minimalist UI chua duoc trien khai (Command Palette, Zen Mode, Contextual Panels)
- **Part B**: Xay dung Brand Identity Generator - cho phep AI tao bo nhan dien thuong hieu va xuat Brand Kit PDF

---

## Part A: Hoan thien Minimalist UI

Hien tai FloatingToolbar da duoc tao, nhung **Command Palette** va **Zen Mode** chua co code. Can tao moi va tich hop.

### A1: Command Palette (Ctrl+K)

**File tao moi: `src/components/slides/CommandPalette.tsx`**
- Su dung thu vien `cmdk` (da cai san) ket hop Dialog
- Phim tat `Ctrl+K` / `Cmd+K` mo palette
- Cac nhom lenh:
  - **Dieu huong**: Di den slide N, Grid view, Present
  - **Chinh sua**: Undo, Redo, Them slide, Xoa slide, Nhan doi
  - **Layout**: Chuyen sang 16 loai layout
  - **Theme**: Ap dung 8 theme presets
  - **Xuat**: PDF, PPTX
  - **AI**: Tao anh, Viet lai, Mo rong noi dung
  - **Cong cu**: Chia se, Comments, Version History, Zen Mode
- Tim kiem fuzzy theo ten lenh
- Hien thi phim tat tuong ung ben canh moi lenh

### A2: Zen Mode

**File sua: `src/components/slides/FloatingToolbar.tsx`**
- Them nut Zen Mode (icon Maximize2) vao nhom core actions
- Them prop `onToggleZen` va `zenMode`

**File sua: `src/pages/DeckEditor.tsx`**
- Them state `zenMode`, `showCommandPalette`
- Khi `zenMode = true`: an sidebar, editor panel, toolbar - chi hien slide preview full-screen tren nen den
- Tooltip "ESC de thoat" hien 3 giay khi vao zen mode
- Them phim tat Ctrl+K cho Command Palette
- Import va render CommandPalette component

### A3: Contextual Panels (don gian hoa)
- Thu gon cac section Style/AI trong editor panel vao collapsible mac dinh dong
- Chi hien khi nguoi dung click icon tuong ung

---

## Part B: Brand Identity Generator

### Brand Identity Generator la gi?

Day la cong cu cho phep nguoi dung **mo ta thuong hieu cua ho** (ten, nganh nghe, phong cach...) va AI se tu dong tao:

1. **Logo**: AI tao hinh anh logo dua tren mo ta thuong hieu (su dung Gemini Image Generation)
2. **Slogan**: Cau khau hieu phu hop voi thuong hieu
3. **Bang mau (Color Palette)**: 4 mau chinh (Primary, Secondary, Accent, Background) hai hoa voi phong cach thuong hieu
4. **Bo font chu**: Goi y 3 font (Heading, Body, Accent) phu hop voi tone thuong hieu
5. **Brand Kit PDF**: Xuat toan bo thanh file PDF de dung offline hoac gui cho doi ngu

### Database

Bang `brand_kits` da ton tai voi cac cot:
- `id`, `user_id`, `name`
- `logo_url`, `logo_prompt`, `slogan`
- `primary_color`, `secondary_color`, `accent_color`, `bg_color`
- `heading_font`, `body_font`, `accent_font`
- `created_at`, `updated_at`

**Khong can migration moi** - schema da day du.

### Cac file can tao/sua

| File | Loai | Mo ta |
|------|------|-------|
| `src/pages/BrandGenerator.tsx` | Tao moi | Trang chinh cua Brand Identity Generator |
| `src/components/brand/BrandForm.tsx` | Tao moi | Form nhap thong tin thuong hieu (ten, nganh, phong cach, mo ta) |
| `src/components/brand/BrandPreview.tsx` | Tao moi | Preview Brand Kit: logo, mau sac, font, slogan |
| `src/components/brand/BrandPdfExport.tsx` | Tao moi | Xuat Brand Kit thanh PDF (dung jspdf da cai san) |
| `supabase/functions/generate-brand/index.ts` | Tao moi | Edge function goi AI tao slogan, mau sac, font |
| `src/App.tsx` | Sua | Them route `/brand` |
| `src/components/landing/Header.tsx` | Sua | Them link "Brand Kit" vao menu |
| `src/components/slides/CommandPalette.tsx` | Tao moi | (Part A) |

### Luong hoat dong Brand Generator

```text
1. Nguoi dung vao /brand -> Nhap ten thuong hieu, nganh nghe, phong cach
2. Bam "Tao Brand Kit" -> Goi edge function generate-brand
3. AI tra ve: slogan, 4 mau sac, 3 font
4. Hien thi preview voi color swatches, font samples, slogan
5. Nguoi dung co the chinh sua thu cong tung thanh phan
6. Bam "Tao Logo AI" -> Goi generate-slide-image (reuse) voi prompt logo
7. Logo duoc upload len bucket brand-assets
8. Luu vao bang brand_kits
9. Xuat PDF: jspdf render trang A4 voi logo, mau, font, slogan
```

### Edge Function: generate-brand

- Input: `{ name, industry, style, description }`
- Su dung GOOGLE_GEMINI_API_KEY (da co) goi Gemini API
- Output: `{ slogan, primary_color, secondary_color, accent_color, bg_color, heading_font, body_font, accent_font }`
- Su dung tool calling de dam bao output co cau truc

### Brand PDF Export

Su dung `jspdf` (da cai san) de tao PDF bao gom:
- Trang 1: Logo + Ten thuong hieu + Slogan
- Trang 2: Color Palette (4 hinh vuong mau + ma hex + ten mau)
- Trang 3: Typography (3 font voi sample text)
- Trang 4: Huong dan su dung (do's and don'ts co ban)

### Tich hop voi Slide Builder

Bang `decks` da co cot `brand_kit_id` (foreign key den `brand_kits`). Sau khi tao Brand Kit, nguoi dung co the ap dung no vao bat ky deck nao de dong bo mau sac va font.

---

## Tom tat tong hop

| Stt | File | Loai | Part |
|-----|------|------|------|
| 1 | `src/components/slides/CommandPalette.tsx` | Tao moi | A |
| 2 | `src/components/slides/FloatingToolbar.tsx` | Sua | A |
| 3 | `src/pages/DeckEditor.tsx` | Sua | A |
| 4 | `src/pages/BrandGenerator.tsx` | Tao moi | B |
| 5 | `src/components/brand/BrandForm.tsx` | Tao moi | B |
| 6 | `src/components/brand/BrandPreview.tsx` | Tao moi | B |
| 7 | `src/components/brand/BrandPdfExport.tsx` | Tao moi | B |
| 8 | `supabase/functions/generate-brand/index.ts` | Tao moi | B |
| 9 | `src/App.tsx` | Sua | B |
| 10 | `src/components/landing/Header.tsx` | Sua | B |

### Khong can
- Migration database (brand_kits da co, bucket brand-assets da co)
- API key moi (dung GOOGLE_GEMINI_API_KEY co san)
- Dependency moi (jspdf, cmdk da cai san)

