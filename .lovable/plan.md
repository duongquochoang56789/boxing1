

# Chuyển toàn bộ AI sang model mới nhất + Hoàn thiện UI/UX Slide Builder

## Phan 1: Sua model AI cho image generation

### Van de hien tai
- `generate-slides`: dung `gemini-2.0-flash-exp` (deprecated, gay loi 404)
- `generate-slide-image`: dung `gemini-2.0-flash-exp-image-generation` (hoat dong nhung cu)
- `generate-content`: dung `gemini-2.5-flash-image` (model khong ro rang cho image gen)

### Giai phap
Chuyen tat ca sang model image generation moi nhat: `gemini-2.0-flash-exp-image-generation` (da xac nhan hoat dong tot) cho Gemini direct API. Voi Lovable Gateway fallback, dung `google/gemini-2.5-flash-image`.

| File | Model cu | Model moi |
|------|----------|-----------|
| `generate-slides/index.ts` (line 121) | `gemini-2.0-flash-exp` | `gemini-2.0-flash-exp-image-generation` |
| `generate-content/index.ts` (line 25) | `gemini-2.5-flash-image` | `gemini-2.0-flash-exp-image-generation` |
| `generate-slide-image/index.ts` (line 11) | Da dung dung | Giu nguyen |

Dong thoi them `responseModalities: ["IMAGE", "TEXT"]` cho `generate-content` de dam bao nhan anh.

---

## Phan 2: Ke hoach hoan thien UI/UX Slide Builder

Dua tren phan tich toan bo codebase (5 trang: SlideBuilder, SlideDashboard, DeckEditor, DeckPresent, SharedDeck + SlideLayouts component), day la cac cai tien UX theo thu tu uu tien:

### 2A. Editor UX (DeckEditor.tsx) - Uu tien cao

**Image Prompt Editor**
- Hien tai: image_prompt an, nguoi dung khong biet slide co prompt gi de tao anh
- Cai tien: Them textarea nho duoi phan content de xem/sua image_prompt cua slide hien tai
- Vi tri: Ngay tren phan "Ghi chu trinh chieu" trong panel editor

**Toolbar responsive**
- Hien tai: tat ca nut xep tren 1 hang, tran khi man hinh nho
- Cai tien: Nhom cac nut it dung vao dropdown menu (Save, PDF, Share)
- Giu cac nut chinh tren toolbar: Back, AI Anh, Tao tat ca anh, Trinh chieu

**Empty state cho slide moi**
- Khi tao slide moi (noi dung trong), hien placeholder huong dan Markdown co ban

### 2B. Dashboard UX (SlideDashboard.tsx) - Uu tien cao

**Sorting options**
- Hien tai: chi sap xep theo `updated_at` DESC
- Them: dropdown chon sap xep (Moi nhat, Cu nhat, Ten A-Z, Nhieu slide nhat)

**Batch actions**
- Cho phep chon nhieu deck de xoa cung luc (checkbox + nut "Xoa da chon")

### 2C. Slide Creation UX (SlideBuilder.tsx) - Uu tien trung binh

**Tu dong tao anh sau khi generate**
- Sau khi `generate-deck` thanh cong va chuyen den DeckEditor, hien dialog hoi: "Ban co muon AI tu dong tao anh cho tat ca slide? (mat ~2-3 phut)"
- Neu dong y: tu dong chay `generateAllImages()`
- Lam luong hoan chinh: Prompt -> Noi dung -> Cau truc -> Anh

**Progress chi tiet hon**
- Hien ten slide dang tao thay vi chi so (VD: "Dang tao: Slide 3 - Giai phap FLYFIT")

### 2D. Presentation UX (DeckPresent.tsx) - Uu tien trung binh

**Slide transitions**
- Hien tai: chi fade in/out don gian
- Them 2-3 kieu transition: slide-left, zoom, fade (chon trong toolbar truoc khi present)

**Keyboard hints overlay**
- Lan dau vao present mode: hien overlay 3 giay voi phim tat (Arrows, P, N, G, Esc)

### 2E. SlideLayouts (SlideLayouts.tsx) - Uu tien thap

**Font scaling**
- Mot so layout (stats, grid) co font size co dinh (96px, 76px) co the tran khi noi dung dai
- Them logic tu dong giam font khi noi dung vuot qua gioi han ky tu

---

## Chi tiet ky thuat

### File thay doi

| File | Thay doi |
|------|---------|
| `supabase/functions/generate-slides/index.ts` | Sua model line 121 |
| `supabase/functions/generate-content/index.ts` | Sua model line 25, them responseModalities |
| `src/pages/DeckEditor.tsx` | Them image prompt editor, toolbar responsive, empty state, auto-generate dialog |
| `src/pages/SlideDashboard.tsx` | Sorting dropdown, batch select |
| `src/pages/SlideBuilder.tsx` | Progress chi tiet |
| `src/pages/DeckPresent.tsx` | Transition options, keyboard hints |

### Pham vi thuc hien
Do khoi luong lon, de xuat chia thanh 2 phase:

**Phase 1 (lam ngay):**
- Sua model AI cho 2 edge function
- Them image prompt editor trong DeckEditor
- Them auto-generate dialog khi vao editor tu SlideBuilder
- Toolbar responsive

**Phase 2 (lam sau):**
- Dashboard sorting + batch actions
- Presentation transitions + keyboard hints
- Font scaling cho layouts

