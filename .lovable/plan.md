

# Lo trinh Thong minh hoa AI Slide Builder - Cap do 8 den 12

## Hien trang: 7 Cap do da hoan thanh

| Cap do | Ten | Tinh trang |
|--------|-----|------------|
| 1 | Smart Defaults (auto-layout, template, auto-image dialog) | Da xong |
| 2 | Content Intelligence (AI viet lai, mo rong, tom tat) | Da xong |
| 3 | Design Intelligence (8 Theme presets, transitions) | Da xong |
| 4 | Interaction Intelligence (Undo/Redo 50 buoc, Templates) | Da xong |
| 5 | Performance Intelligence (Lazy loading, Grid View phim G) | Da xong |
| 6 | Export & Sharing (PPTX, PDF, public link, embed code) | Da xong |
| 7 | Collaboration (Comments, Version History, sidebar toggle) | Da xong |

---

## 5 Cap do moi: 8 - 12

### Cap do 8: Visual Intelligence (WYSIWYG nang cao)

Muc tieu: Slide hien thi chinh xac nhu khi trinh chieu, khong con "raw text".

**Layout moi:**
- `funnel`: Bieu do pheu (marketing funnel) - tu dong nhan dien khi noi dung co cac buoc giam dan (VD: 1000 -> 500 -> 100)
- `swot`: Ma tran SWOT 2x2 voi mau sac phan biet (Strengths/Weaknesses/Opportunities/Threats)
- `process`: Quy trinh buoc-theo-buoc voi mui ten noi giua cac buoc (flow diagram)
- `team`: Luoi thanh vien nhom voi avatar tron va vai tro

**Kha nang design:**
- Numbered list (1. 2. 3.) voi so thu tu duoc style dep
- Nested bullet (tab indent) hien thi dung cap bac
- Inline code va code block voi font monospace + nen xam
- Link clickable trong slide (hien mau accent, underline)
- Horizontal rule (---) render thanh divider dep

**Thay doi ky thuat:**
- Mo rong `ContentBlock` trong `SlideLayouts.tsx` de ho tro numbered list, nested bullets, code blocks
- Them 4 component layout moi: `FunnelSlide`, `SwotSlide`, `ProcessSlide`, `TeamSlide`
- Cap nhat `VALID_LAYOUTS` va `LAYOUT_TEMPLATES` trong `DeckEditor.tsx`
- Cap nhat ham `suggestLayout` de tu dong nhan dien noi dung phu hop voi layout moi

---

### Cap do 9: Media Intelligence (Da phuong tien)

Muc tieu: Slide khong chi co text va hinh anh tinh - ma con ho tro nhieu loai noi dung phong phu hon.

**Tinh nang moi:**
- **Icon Library**: Tich hop bo icon (lucide) de chen vao slide thay vi chi dung emoji
- **Shape Overlays**: Cac hinh dang trang tri (circle, rectangle, gradient blob) lam nen hoac accent
- **Image Filters**: Ap dung bo loc anh (grayscale, blur, brightness, overlay color) truc tiep tren slide
- **Gradient Editor**: Cho phep tuy chinh huong va mau gradient cho background thay vi chi chon mau don
- **Video Embed**: Nhung video YouTube/Vimeo vao slide (hien thumbnail khi khong trinh chieu, play khi present)

**Layout moi:**
- `image-grid`: Luoi 2-4 hinh anh voi caption
- `before-after`: So sanh truoc/sau voi thanh truot (slider)

**Thay doi ky thuat:**
- Tao `GradientPicker` component cho toolbar
- Them truong `media_type` va `media_url` vao bang `deck_slides` (migration)
- Tao `ImageFilterPanel` component
- Them 2 layout component moi: `ImageGridSlide`, `BeforeAfterSlide`

---

### Cap do 10: Presentation Intelligence (Trinh chieu chuyen nghiep)

Muc tieu: Che do trinh chieu dat chat luong nhu PowerPoint/Keynote.

**Tinh nang moi:**
- **Presenter View**: Man hinh rieng cho dien gia voi:
  - Slide hien tai (lon) + slide tiep theo (preview nho)
  - Speaker notes hien thi day du
  - Dong ho dem thoi gian (timer dong/dem nguoc)
  - Dieu khien: next/prev/jump-to-slide
  - Dong bo voi man hinh chinh qua `BroadcastChannel`
- **Slide Transitions**: Hieu ung chuyen canh giua cac slide khi present:
  - Fade, Slide Left/Right, Zoom In, Dissolve
  - Cau hinh per-slide hoac global
- **Laser Pointer**: Hieu ung con tro laser (cham do theo chuot) khi trinh chieu
- **Annotation Mode**: Ve/ghi chu truc tiep len slide khi dang present (dung canvas overlay)
- **Auto-advance**: Tu dong chuyen slide theo thoi gian (cau hinh so giay/slide)

**Thay doi ky thuat:**
- Tao `PresenterView.tsx` component voi dual-screen layout
- Tao `SlideTransition.tsx` wrapper component voi AnimatePresence
- Them truong `transition_type` va `auto_advance_seconds` vao bang `deck_slides` (migration)
- Tao `LaserPointer.tsx` va `AnnotationCanvas.tsx` overlay components
- Cap nhat `DeckPresent.tsx` de tich hop tat ca

---

### Cap do 11: Analytics & Optimization Intelligence

Muc tieu: Hieu nguoi xem tuong tac voi slide nhu the nao de toi uu noi dung.

**Tinh nang moi:**
- **View Tracking**: Dem so luot xem, thoi gian xem tung slide khi chia se public
- **Analytics Dashboard**: Bieu do hien thi:
  - So luot xem theo thoi gian
  - Slide nao duoc xem lau nhat (heat map)
  - Ty le drop-off (nguoi xem roi o slide nao)
  - Thiet bi/trinh duyet cua nguoi xem
- **AI Content Score**: AI cham diem noi dung tung slide (do dai, cau truc, keyword density) va goi y cai thien
- **A/B Testing**: Tao 2 phien ban cua 1 slide, tu dong phan bo cho nguoi xem khac nhau
- **QR Code**: Tu dong tao QR code cho link chia se de in/trinh chieu

**Thay doi ky thuat:**
- Tao bang `slide_views` (deck_id, slide_index, viewer_id, duration_ms, device, created_at)
- Tao `AnalyticsDashboard.tsx` page voi recharts
- Tao edge function `analyze-slide-content` de AI cham diem
- Tao `QRCodeGenerator` component (su dung thu vien hoac canvas API)

---

### Cap do 12: Platform Intelligence (He sinh thai)

Muc tieu: Slide Builder tro thanh nen tang hoan chinh, khong chi la cong cu tao slide.

**Tinh nang moi:**
- **Template Marketplace**: Thu vien template cong dong - nguoi dung luu va chia se template
- **Brand Kit Integration**: Tu dong ap dung bo nhan dien thuong hieu (logo, mau sac, font) tu `brand_kits` vao moi deck moi
- **Import tu nguon khac**: Import noi dung tu:
  - URL (crawl website -> tao slide)
  - Van ban dai (paste article -> AI chia thanh slides)
  - File PDF (extract text -> tao deck)
- **Multi-format Export**: Ngoai PPTX/PDF, them:
  - HTML standalone (1 file HTML chay offline)
  - Video MP4 (moi slide = 1 frame, chuyen canh tu dong)
  - Image pack (xuat tung slide thanh PNG/JPG)
- **Deck Collections**: Nhom nhieu deck thanh 1 bo suu tap (portfolio, khoa hoc)
- **Custom Domain**: Cho phep chia se deck tren ten mien rieng

**Thay doi ky thuat:**
- Tao bang `template_marketplace` (template_id, author_id, downloads, category, is_public)
- Tao bang `deck_collections` (collection_id, name, deck_ids[], owner_id)
- Tao edge function `import-from-url` (crawl + AI summarize)
- Tao edge function `export-video` (canvas rendering + ffmpeg)
- Mo rong `ShareDeckDialog` voi tab Export da dinh dang

---

## Tong hop Layout

| STT | Layout | Mo ta | Cap do |
|-----|--------|-------|--------|
| 1-12 | cover, two-column, stats, grid, table, timeline, quote, pricing, persona, chart, image-full, comparison | Da co | 1-7 |
| 13 | funnel | Bieu do pheu marketing | 8 |
| 14 | swot | Ma tran SWOT 2x2 | 8 |
| 15 | process | Quy trinh buoc voi mui ten | 8 |
| 16 | team | Luoi thanh vien nhom | 8 |
| 17 | image-grid | Luoi 2-4 hinh anh | 9 |
| 18 | before-after | So sanh truoc/sau | 9 |

**Tong: 18 layouts** (tu 12 hien tai len 18)

---

## Thu tu uu tien de xuat

Voi chien luoc MVP nhanh cua du an, de xuat trien khai theo thu tu:

1. **Cap do 8** (Visual Intelligence) - Anh huong truc tiep den trai nghiem nguoi dung, khac phuc van de WYSIWYG hien tai
2. **Cap do 10** (Presentation Intelligence) - Presenter View la tinh nang "must-have" cho bat ky cong cu slide nao nghiem tuc
3. **Cap do 9** (Media Intelligence) - Lam phong phu noi dung slide
4. **Cap do 11** (Analytics) - Gia tri cho nguoi dung chia se deck cong khai
5. **Cap do 12** (Platform) - Giai doan dai han, chuyen doi tu cong cu thanh nen tang

---

## Tac dong ky thuat tong the

- **4 layouts moi** (Level 8) + **2 layouts moi** (Level 9) = 18 tong cong
- **3-4 database migrations** (media fields, analytics tables, marketplace tables)
- **2-3 edge functions moi** (analyze-content, import-from-url, export-video)
- **~15 components moi** (PresenterView, AnnotationCanvas, AnalyticsDashboard, GradientPicker...)
- **2 pages moi** (Analytics Dashboard, Template Marketplace)
- Khong can dependency moi cho Level 8-10 (da co framer-motion, recharts, pptxgenjs)

