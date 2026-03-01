

# Phan tich & Lo trinh: Tach du an Builder + So sanh Canva

## Phan 1: Cach tach Slide Builder thanh du an doc lap

### Kien truc hien tai

Slide Builder hien tai **da duoc thiet ke kha doc lap** trong FLYFIT. Day la tin tot - viec tach se khong qua phuc tap.

**Cac thanh phan thuoc Slide Builder:**

| Loai | File/Thu muc |
|------|-------------|
| Pages | `SlideBuilder.tsx`, `SlideDashboard.tsx`, `DeckEditor.tsx`, `DeckPresent.tsx`, `SharedDeck.tsx` |
| Components | `src/components/slides/*` (9 file: BlockToolbar, BlockContextMenu, SlideLayouts, EditorGridView, LazySlideThumb, ShareDeckDialog, SlideComments, SlideVersionHistory, SlideViewer) |
| Hooks | `useSlideHistory.ts`, `useSlideTemplates.ts` |
| Edge Functions | `generate-deck/`, `generate-slides/`, `generate-slide-image/`, `generate-text/`, `ai-slide-assist/` |
| Export | `src/lib/exportPptx.ts` |
| DB Tables | `decks`, `deck_slides`, `deck_comments` |

**Phu thuoc chung voi FLYFIT (can thay the khi tach):**

| Thanh phan | Dung chung | Giai phap khi tach |
|------------|-----------|-------------------|
| Auth (`useAuth`) | Dung chung profiles, user_roles | Giu nguyen, chi xoa role "admin" cua FLYFIT |
| UI components | `button`, `select`, `dialog`, `toast`... | Copy nguyen bo `src/components/ui/` |
| Supabase client | `src/integrations/supabase/client.ts` | Tu dong co khi tao Cloud project moi |
| Branding | Logo "FLYFIT", mau cam | Doi thanh brand moi |
| Landing page | `Index.tsx`, `Header.tsx`... | Tao landing page moi cho Builder |
| ZaloButton, ProjectChatbot | Chi FLYFIT | Xoa |

### Cach tach (khi ban Remix)

**Buoc 1: Remix du an**
- Remix se tao ban sao toan bo code

**Buoc 2: Xoa phan FLYFIT** (trong du an moi)
- Xoa cac page: `Index.tsx`, `Dashboard.tsx`, `Schedule.tsx`, `BookPT.tsx`, `Admin*.tsx`, `Profile.tsx`, `History.tsx`, `HeroDemo*.tsx`, `HeroOptions.tsx`, `AIAssistant.tsx`, `ProjectPresentation.tsx`
- Xoa `src/components/landing/*` (toan bo)
- Xoa `src/assets/*` (hero-bg, trainer-*, gallery-*, service-*)
- Xoa edge functions: `backup-database/`, `restore-database/`, `generate-content/`, `project-chat/`
- Xoa hooks: `useLenis.ts`, `useMagnetic.ts`, `useScrollProgress.ts`, `useSiteContent.ts`

**Buoc 3: Cap nhat App.tsx**
- Chi giu routes: `/` (SlideDashboard), `/new` (SlideBuilder), `/:deckId` (DeckEditor), `/:deckId/present`, `/shared/:slug`, `/auth`
- Xoa ZaloButton, ProjectChatbot

**Buoc 4: Doi brand**
- Thay "FLYFIT" bang ten moi (VD: "SlideAI", "DeckFlow")
- Doi mau sac neu can

**Buoc 5: Database**
- Du an Remix moi se co Lovable Cloud moi
- Chay migration chi tao: `profiles`, `decks`, `deck_slides`, `deck_comments`
- Khong can cac bang FLYFIT (trainers, classes, pt_sessions, site_content...)

**Ket luan:** Viec tach kha don gian vi Slide Builder da duoc thiet ke doc lap. Khoang 1-2 session la xong.

---

## Phan 2: So sanh chi tiet voi Canva & Lo trinh canh tranh

### Bang so sanh day du

| # | Tinh nang | Canva | Chung ta | Trang thai |
|---|-----------|-------|----------|------------|
| 1 | AI tao slide tu prompt | Co (Magic Design) | Co (generate-deck) | Done |
| 2 | 12+ layouts chuyen nghiep | Co (hang ngan) | Co (16 layouts) | Done |
| 3 | Inline text editing | Co | Co (B1-B2) | Done |
| 4 | Text formatting toolbar | Co | Co (B3) | Done |
| 5 | Font system (12+ fonts) | Co (1000+ fonts) | Co (12 fonts, B4) | Done |
| 6 | Spacing/Padding controls | Co | Co (B5) | Done |
| 7 | Block reorder/duplicate/delete | Co | Co (B6) | Done |
| 8 | Right-click context menu | Co | Co | Done |
| 9 | AI rewrite/expand content | Co (Magic Write) | Co (ai-slide-assist) | Done |
| 10 | Export PDF | Co | Co (html2canvas) | Done |
| 11 | Export PPTX | Co | Co (pptxgenjs) | Done |
| 12 | Share link & embed | Co | Co (share_slug) | Done |
| 13 | Slide comments | Co | Co | Done |
| 14 | Version history | Co | Co | Done |
| 15 | Grid overview | Co | Co (EditorGridView) | Done |
| 16 | Fullscreen present | Co | Co (DeckPresent) | Done |
| 17 | AI image generation | Co (Magic Media) | Co (generate-slide-image) | Done |
| --- | --- | --- | --- | --- |
| 18 | **Undo/Redo** | Co | Chua dung duoc tot | **Can fix** |
| 19 | **Template gallery** | Co (hang ngan) | Chi local storage | **Quan trong** |
| 20 | **Drag-drop blocks tren preview** | Co | Chi co nut Move Up/Down | **Nang cao** |
| 21 | **Shape/Icon insert** | Co (Elements panel) | Chua co | **Quan trong** |
| 22 | **Image upload tu may** | Co | Chua co (chi AI gen) | **Quan trong** |
| 23 | **Image crop/resize** | Co | Chua co | Nang cao |
| 24 | **Background image** | Co | Chi background color | **Quan trong** |
| 25 | **Text effects (shadow/outline)** | Co | Chua co | Nice-to-have |
| 26 | **Element resize (keo goc)** | Co | Chua co | Nang cao |
| 27 | **Snap-to-grid / guides** | Co | Chua co | Nang cao |
| 28 | **Animation per-element** | Co | Chua co | Nang cao |
| 29 | **Video embed** | Co | Chua co | Nice-to-have |
| 30 | **Thanh toan / Subscription** | Co | Chua co | **Bat buoc de thu tien** |
| 31 | **Landing page cho san pham** | Co | Chua co (chi co FLYFIT) | **Bat buoc** |
| 32 | **Usage limits / Quota** | Co | Chua co | **Bat buoc de thu tien** |
| 33 | **Multi-user workspace** | Co | Chua co | Tuong lai |
| 34 | **Presenter view (notes + timer)** | Co | Chua co | Quan trong |
| 35 | **Realtime collaboration** | Co | Chua co | Nang cao |
| 36 | **Custom brand kit** | Co | Co (brand_kits table) | Can UI |
| 37 | **Import PDF/PPTX** | Co | Chua co | Nang cao |

### Loi the canh tranh cua chung ta so voi Canva

Canva la "giant" - khong the canh tranh toan dien. **Chien luoc dung:**

1. **AI-first**: Canva them AI sau, chung ta xay AI tu dau. Nguoi dung chi can nhap chu de -> co slide hoan chinh. Day la UX tot hon Canva cho 80% use case.
2. **Don gian hon**: Canva phuc tap qua nhieu tinh nang. Chung ta tap trung vao "nhanh va dep".
3. **Gia re hon**: Canva Pro $13/thang. Chung ta co the dat $5-8/thang.
4. **Toi uu tieng Viet**: Canva khong toi uu cho thi truong Viet Nam.

### Lo trinh 12 buoc den san pham thu tien

```text
Phase 1: HOan thien CORE (4 buoc)
+-------+-------------------------------+----------+
| Buoc  | Noi dung                      | Uu tien  |
+-------+-------------------------------+----------+
| C1    | Image upload tu may           | Cao      |
|       | + Background image cho slide  |          |
+-------+-------------------------------+----------+
| C2    | Template Gallery (DB-backed)  | Cao      |
|       | Pre-built 20+ templates dep   |          |
+-------+-------------------------------+----------+
| C3    | Presenter View                | Trung    |
|       | Timer, notes, next slide      |          |
+-------+-------------------------------+----------+
| C4    | Undo/Redo fix + Keyboard      | Trung    |
|       | shortcuts (Ctrl+Z, Ctrl+B...) |          |
+-------+-------------------------------+----------+

Phase 2: MONETIZATION (3 buoc)
+-------+-------------------------------+----------+
| M1    | Landing page cho Builder      | Cao      |
|       | (marketing, pricing, demo)    |          |
+-------+-------------------------------+----------+
| M2    | Stripe subscription           | Cao      |
|       | Free (3 decks) / Pro ($7/mo)  |          |
+-------+-------------------------------+----------+
| M3    | Usage quota system            | Cao      |
|       | AI gen limits, export limits  |          |
+-------+-------------------------------+----------+

Phase 3: CHUYEN NGHIEP HOA (3 buoc)
+-------+-------------------------------+----------+
| P1    | Shape/Icon library            | Trung    |
|       | (Lucide icons insert)         |          |
+-------+-------------------------------+----------+
| P2    | Brand Kit UI                  | Trung    |
|       | (colors, fonts, logo preset)  |          |
+-------+-------------------------------+----------+
| P3    | Advanced export               | Trung    |
|       | (HD PDF, animated HTML)       |          |
+-------+-------------------------------+----------+

Phase 4: NANG CAO (2 buoc)
+-------+-------------------------------+----------+
| A1    | Realtime collaboration        | Thap     |
|       | (multi-user editing)          |          |
+-------+-------------------------------+----------+
| A2    | Import PDF/PPTX               | Thap     |
|       | (AI parse -> slides)          |          |
+-------+-------------------------------+----------+
```

### Mo hinh gia de xuat

| Plan | Gia | Gioi han |
|------|-----|---------|
| Free | $0 | 3 decks, 5 AI gen/thang, watermark, PDF export chi |
| Pro | $7/thang | Unlimited decks, 50 AI gen/thang, PPTX export, no watermark |
| Business | $15/thang | Unlimited AI, brand kit, team workspace, priority support |

### Tong ket

- **Hien tai**: 17/37 tinh nang Canva da co (~46%)
- **Sau Phase 1+2** (7 buoc): ~65% tinh nang + co the thu tien
- **Sau Phase 3+4**: ~80% tinh nang, du de canh tranh o phan khuc "AI-first slide builder"
- **Thoi gian uoc tinh**: Phase 1+2 khoang 6-8 sessions Lovable

**De nghi buoc tiep theo**: Bat dau voi **C1 (Image upload + Background image)** vi day la tinh nang co ban nhat ma nguoi dung mong doi.

