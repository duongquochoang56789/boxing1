

# Tổng quan Dự án AI Slide Builder - Tiến độ & Cải thiện

## Đã hoàn thành

| Module | Trang | Trạng thái |
|--------|-------|-----------|
| Dashboard quản lý | /slides | Done - Xem, xoá, public/private, copy link |
| Tạo deck bằng AI | /slides/new | Done - Prompt, chọn số slide/ngôn ngữ/tone |
| Editor split-screen | /slides/:deckId | Done - Markdown editor + live preview |
| Trình chiếu fullscreen | /slides/:deckId/present | Done - Keyboard nav, progress bar |
| Chia sẻ công khai | /slides/shared/:slug | Done - Xem deck không cần đăng nhập |
| Edge Function AI | generate-deck | Done - Gemini 2.5 Flash, tạo JSON slides |
| 10 Layout types | SlideLayouts.tsx | Done - cover, two-column, stats, grid, table, timeline, quote, pricing, persona, chart |

## Cac phan can cai thien (7 hang muc)

### 1. Dashboard - Thumbnail preview that (hien tai chi hien icon Presentation)
- Hien thi slide dau tien cua deck lam thumbnail thay vi icon mo
- Them search/filter deck theo ten

### 2. Editor - Keo tha sap xep slide (Drag & Drop reorder)
- Hien tai chi co nut them/xoa slide, khong the sap xep lai thu tu
- Them drag-and-drop cho thumbnail strip ben trai
- Them duplicate slide

### 3. Editor - Chon mau nen (Background color picker)
- Truong background_color co trong database nhung chua co UI de thay doi
- Them color picker hoac preset colors

### 4. Trinh chieu - Presenter Notes view
- Truong notes da co trong editor nhung khong hien thi khi trinh chieu
- Them presenter view: slide hien tai + slide tiep theo + notes + timer

### 5. Export - Xuat PDF/PPTX
- Chua co chuc nang xuat file
- Them nut "Export PDF" su dung html2canvas hoac tuong tu

### 6. AI Image Generation
- Truong image_prompt da duoc AI tao nhung chua su dung de generate anh
- Ket noi voi AI image model de tu dong tao hinh minh hoa

### 7. Slide Layouts - Da dang hon va responsive hon
- Mot so layout (grid, stats, persona, pricing) giao dien gan giong nhau
- Cai thien visual distinction giua cac layout

---

## Ke hoach thuc hien (Theo do uu tien)

### Phase 1: UX co ban (nhanh, tac dong lon)
1. **Dashboard thumbnail** - Render slide dau tien lam preview card
2. **Drag & drop reorder** - Keo tha slides trong editor sidebar
3. **Duplicate slide** - Nhan doi slide hien tai
4. **Background color UI** - Them preset color cho moi slide

### Phase 2: Trinh chieu nang cao
5. **Presenter notes overlay** - Hien thi notes khi trinh chieu (phim tat N)
6. **Slide counter overlay** - Hien thi so slide + thoi gian

### Phase 3: Export & AI
7. **Export PDF** - Dung html2canvas + jsPDF
8. **AI image generation** - Dung image_prompt de generate anh minh hoa

---

## Chi tiet ky thuat

### Dashboard Thumbnail
- Trong `SlideDashboard.tsx`: fetch 1 slide dau tien cua moi deck (JOIN hoac query rieng)
- Render `SlideRenderer` thu nho (scale ~0.12) trong card preview

### Drag & Drop Reorder
- Them thu vien nhe hoac tu vien voi HTML5 drag events
- Update `slide_order` trong database sau khi tha

### Duplicate Slide
- Them nut Duplicate ben canh Delete trong `DeckEditor.tsx`
- Insert slide moi voi content copy, slide_order = current + 1, update cac slide sau

### Background Color
- Them row preset colors (6-8 mau) trong editor panel
- Update `background_color` qua `updateSlide()`

### Presenter Notes
- Trong `DeckPresent.tsx`: them state `showNotes`
- Toggle bang phim `N`, hien thi overlay goc duoi voi notes cua slide hien tai

### Export PDF
- Them dependency `html2canvas` va `jspdf`
- Vong lap render tung slide tai 1920x1080 -> canvas -> PDF page

