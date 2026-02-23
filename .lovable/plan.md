

# MEGAPLAN: FLYFIT AI Platform
## Tu AI Slide Builder den Nen tang Sang tao Toan dien

---

## Tong quan du an

Xay dung mot nen tang AI toan dien tren co so ha tang FLYFIT hien tai, gom 3 module chinh va 8 tinh nang mo rong. Du an tan dung toi da stack hien co (React, Tailwind, Framer Motion, Lovable Cloud, Gemini API) va 10+ layout slide da xay dung.

---

## PHAN A: KIEN TRUC KY THUAT

### A1. Database Schema (Lovable Cloud)

**Bang moi can tao:**

```text
1. decks (Bo slide)
   - id: uuid PK
   - user_id: uuid (FK profiles)
   - title: text
   - description: text
   - brand_kit_id: uuid (FK brand_kits, nullable)
   - is_public: boolean (default false)
   - share_slug: text (unique, nullable) -- URL chia se
   - slide_count: integer (default 0)
   - thumbnail_url: text
   - created_at, updated_at: timestamptz

2. deck_slides (Slide trong deck)
   - id: uuid PK
   - deck_id: uuid (FK decks)
   - slide_order: integer
   - title: text
   - subtitle: text (nullable)
   - content: text (markdown)
   - layout: text (default 'two-column')
   - image_url: text (nullable)
   - image_prompt: text (nullable)
   - section_name: text (default 'brand')
   - background_color: text (default '#1a1a2e')
   - notes: text (nullable) -- presenter notes
   - created_at, updated_at: timestamptz

3. brand_kits (Bo nhan dien thuong hieu)
   - id: uuid PK
   - user_id: uuid (FK profiles)
   - name: text
   - logo_url: text (nullable)
   - logo_prompt: text (nullable)
   - slogan: text (nullable)
   - primary_color: text (default '#C67A4B')
   - secondary_color: text (default '#2D2D2D')
   - accent_color: text (default '#8B9E82')
   - bg_color: text (default '#FAF3EB')
   - heading_font: text (default 'Cormorant Garamond')
   - body_font: text (default 'Be Vietnam Pro')
   - accent_font: text (default 'Bebas Neue')
   - created_at, updated_at: timestamptz

4. reviews (Danh gia)
   - id: uuid PK
   - user_id: uuid
   - target_type: text ('trainer' | 'class' | 'service')
   - target_id: uuid
   - rating: integer (1-5)
   - comment: text (nullable)
   - is_approved: boolean (default false)
   - created_at: timestamptz

5. achievements (Gamification)
   - id: uuid PK
   - name: text
   - description: text
   - icon: text
   - badge_url: text (nullable)
   - condition_type: text ('streak' | 'count' | 'milestone')
   - condition_value: integer
   - points: integer (default 0)
   - created_at: timestamptz

6. user_achievements (User x Achievement)
   - id: uuid PK
   - user_id: uuid
   - achievement_id: uuid (FK achievements)
   - earned_at: timestamptz (default now())

7. user_streaks (Streak tracking)
   - id: uuid PK
   - user_id: uuid (unique)
   - current_streak: integer (default 0)
   - longest_streak: integer (default 0)
   - last_activity_date: date
   - total_points: integer (default 0)

8. ai_meal_plans (AI Meal Plan)
   - id: uuid PK
   - user_id: uuid
   - goal: text
   - preferences: text
   - plan_content: text (markdown)
   - created_at: timestamptz

9. ai_workout_plans (AI Workout Plan)
   - id: uuid PK
   - user_id: uuid
   - goal: text
   - fitness_level: text
   - plan_content: text (markdown)
   - created_at: timestamptz

10. blog_posts (Content Platform)
    - id: uuid PK
    - author_id: uuid
    - title: text
    - slug: text (unique)
    - content: text (markdown)
    - excerpt: text
    - cover_image_url: text (nullable)
    - category: text
    - tags: text[] (array)
    - is_published: boolean (default false)
    - published_at: timestamptz (nullable)
    - created_at, updated_at: timestamptz
```

**Storage Buckets moi:**
- `deck-assets` (public) -- hinh anh trong slide decks
- `brand-assets` (public) -- logo, brand materials
- `blog-images` (public) -- anh bai viet

### A2. Edge Functions moi

```text
1. generate-deck        -- Nhan prompt, tao toan bo deck (text + cau truc)
2. generate-deck-image  -- Tao hinh anh cho 1 slide trong deck
3. generate-brand-kit   -- Tao logo + slogan + color palette
4. generate-meal-plan   -- Tao meal plan ca nhan hoa
5. generate-workout     -- Tao workout plan ca nhan hoa
6. generate-blog-post   -- Tao/goi y bai viet blog
7. project-chat (nang cap) -- Doc du lieu thuc tu DB thay vi hardcode
```

### A3. Route Structure

```text
/                        -- Landing page (giu nguyen)
/auth                    -- Dang nhap/dang ky
/dashboard               -- Dashboard thanh vien
/slides                  -- AI Slide Builder (MOI)
  /slides/new            -- Tao deck moi (nhap prompt)
  /slides/:deckId        -- CMS Editor (split-screen)
  /slides/:deckId/present -- Trinh chieu fullscreen
  /slides/shared/:slug   -- Xem deck public (khong can dang nhap)
/brand                   -- Brand Identity Generator (MOI)
  /brand/new             -- Tao brand kit moi
  /brand/:kitId          -- Xem/chinh sua brand kit
/trainer/:id             -- Trang HLV (co reviews)
/blog                    -- Blog (MOI)
  /blog/:slug            -- Bai viet chi tiet
/leaderboard             -- Leaderboard gamification (MOI)
/ai-assistant            -- Chatbot (nang cap)
/admin                   -- Admin panel
  /admin/content         -- CMS (giu nguyen)
  /admin/analytics       -- Analytics Dashboard (MOI)
  /admin/reviews         -- Quan ly danh gia (MOI)
  /admin/blog            -- Quan ly blog (MOI)
/project                 -- Slide thuyet trinh FLYFIT (giu nguyen)
```

---

## PHAN B: CHI TIET 3 MODULE CHINH

### Module 1: AI Slide Builder

**Workflow:**

```text
Buoc 1: User nhap prompt (VD: "Ke hoach kinh doanh quan ca phe")
       |
Buoc 2: Edge function `generate-deck` gui prompt den Gemini
        -> Gemini tra ve JSON gom 15-30 slides
        -> Moi slide co: title, subtitle, content, layout (tu dong chon tu 10 layout)
       |
Buoc 3: Luu vao bang `deck_slides`, tao record `decks`
       |
Buoc 4: Chuyen user den CMS Editor de chinh sua
       |
Buoc 5: (Tuy chon) Tao hinh anh AI cho tung slide
```

**Prompt template cho Gemini (trong edge function):**

```text
"Tao [N] slide thuyet trinh ve chu de: [USER_PROMPT].
Tra ve JSON array, moi slide gom:
- slide_order (1-N)
- title (ngan gon, <60 ky tu)
- subtitle (nullable)
- content (markdown, co emoji, bullet points)
- layout (chon 1 trong: cover, two-column, stats, grid, table, timeline, quote, pricing, persona, chart)
- section_name (chon 1 trong: brand, product, operations, market, finance, roadmap)
- image_prompt (mo ta anh bang tieng Anh, <200 tu)

Quy tac layout:
- Slide 1 va slide cuoi: dung 'cover'
- Slide co so lieu: dung 'stats' hoac 'chart'
- Slide co bang: dung 'table'
- Slide co trích dan: dung 'quote'
- Slide co gia: dung 'pricing'
- Con lai: dung 'two-column' hoac 'grid'"
```

**UI man hinh tao deck:**
- Input lon o giua trang (textarea)
- Dropdown: so luong slide (10/15/20/30)
- Dropdown: ngon ngu (Viet/Anh)
- Dropdown: tone (chuyen nghiep/sang tao/don gian)
- Nut "Tao Slide Deck" -> loading animation -> chuyen sang Editor

### Module 2: CMS Editor (Split-screen)

**Layout giao dien:**

```text
+--------------------------------------------------+
| Toolbar: [Save] [Undo] [Layout v] [AI v] [Present] [Share] |
+--------+-------------------+---------------------+
| Thumb  |  MARKDOWN EDITOR  |   LIVE SLIDE        |
| Strip  |                   |   PREVIEW           |
|        |  # Slide 3        |  [1920x1080 scaled] |
| [1] *  |  ## Revenue Plan  |                     |
| [2]    |                   |                     |
| [3] <- |  **Q1**: 500M     |   (auto-sync khi    |
| [4]    |  **Q2**: 1.2B     |    user go phim)    |
| [5]    |                   |                     |
| ...    |  > "Great quote"  |                     |
|        |                   |                     |
| [+Add] |                   |                     |
+--------+-------------------+---------------------+
| Notes: Presenter notes cho slide nay...          |
+--------------------------------------------------+
```

**Tinh nang Editor:**
- Markdown editor ben trai (textarea hoac contenteditable)
- Live preview ben phai (dung `SlideRenderer` da co)
- Thumbnail strip ben trai (click de chuyen slide)
- Drag-drop de sap xep thu tu slide
- Toolbar: doi layout, them slide, xoa slide, AI regenerate
- Presenter notes (panel phia duoi, collapse duoc)
- Keyboard shortcuts: Ctrl+S luu, Ctrl+Enter preview, F5 present
- Resizable panels (dung `react-resizable-panels` da co)

**Sync logic:**
- Debounce 500ms: khi user ngung go, cap nhat preview
- Auto-save: debounce 2s sau khi ngung go, luu vao DB
- Optimistic update: UI cap nhat ngay, DB save background

### Module 3: Brand Identity Generator

**Workflow:**

```text
Buoc 1: User nhap ten thuong hieu + mo ta ngan
       |
Buoc 2: AI tao dong thoi:
        - 3 phuong an slogan (Gemini Text)
        - 3 phuong an color palette
        - 2-3 goi y font pairing (tu Google Fonts list)
       |
Buoc 3: User chon/chinh sua tung thanh phan
       |
Buoc 4: AI tao logo (Gemini Image Generation)
        -> Upload vao bucket `brand-assets`
       |
Buoc 5: Xuat Brand Kit hoan chinh
        -> Co the ap dung truc tiep cho bat ky deck nao
```

**Brand Kit output:**
- Logo (PNG, nhieu kich thuoc)
- Slogan/Tagline
- Color palette (primary, secondary, accent, background)
- Typography pairing (heading + body + accent)
- Preview card: hien thi tat ca thanh phan cung nhau
- Nut "Ap dung cho Deck" -> tu dong doi mau sac slide

**UI man hinh Brand Kit:**

```text
+--------------------------------------------------+
| Brand Identity Generator                          |
+--------------------------------------------------+
| Ten thuong hieu: [_______________]                |
| Mo ta ngan:      [_______________]                |
| [Tao Brand Kit]                                   |
+--------------------------------------------------+
| LOGO          | SLOGAN         | COLORS          |
| [AI Logo]     | O "Bay cao..." | [#C67A4B] Primary |
| [Regenerate]  | O "Song khoe"  | [#2D2D2D] Secondary|
|               | O "Custom..."  | [#8B9E82] Accent  |
+--------------------------------------------------+
| TYPOGRAPHY                                        |
| Heading: Cormorant Garamond  [Change]             |
| Body:    Be Vietnam Pro      [Change]             |
+--------------------------------------------------+
| [Preview Card]  [Download Kit]  [Ap dung cho Deck]|
+--------------------------------------------------+
```

---

## PHAN C: 8 TINH NANG MO RONG

### C1. Reviews & Ratings
- Member danh gia trainer va lop hoc (1-5 sao + comment)
- Admin duyet truoc khi hien thi (is_approved)
- Hien thi rating trung binh tren trang trainer/services
- Top reviews tu dong len landing page (testimonials)

### C2. Gamification
- **Streak**: Dem ngay tap lien tiep -> hien badge "7-Day Warrior"
- **Points**: +10 diem/buoi tap, +5 diem/review, +20 diem/referral
- **Leaderboard**: Xep hang theo diem, filter theo thang/tuan
- **Achievements**: "First Class", "10 Classes", "30-Day Streak", "Review Master"
- UI: Progress bar tren dashboard, popup khi dat achievement

### C3. AI Personal Trainer
- User nhap muc tieu (giam can/tang co/deo dai) + thong tin co ban
- AI tao:
  - Workout plan 7 ngay (markdown, co hinh minh hoa)
  - Meal plan tuan (calories, macros, thuc don Viet Nam)
- Luu vao DB, user xem lai bat ky luc nao
- Edge functions: `generate-workout`, `generate-meal-plan`

### C4. Marketplace (Phase 2+)
- Ban merch FLYFIT (ao, binh nuoc, thun tap)
- Ve workshop/retreat
- Tich hop thanh toan (Stripe da co san trong Lovable)
- Bang `products`, `orders`, `order_items`

### C5. Community Social Feed (Phase 3+)
- Post anh/video sau buoi tap
- Like, comment
- Group theo lop hoc
- Bang `posts`, `comments`, `likes`

### C6. Admin Analytics Dashboard
- **Revenue**: Bieu do line chart (Recharts da co)
- **Member retention**: Cohort analysis
- **Class heatmap**: Gio nao dong nhat trong tuan
- **Trainer performance**: Rating trung binh, so buoi day
- Du lieu tu cac bang hien co: class_registrations, pt_sessions, reviews

### C7. Content Platform (Blog)
- Admin viet bai viet (Markdown editor tai su dung tu Module 2)
- AI goi y noi dung, tieu de, SEO tags
- Hien thi tren route /blog
- Categories: Fitness Tips, Nutrition, Lifestyle, Success Stories

### C8. Smart Chatbot (Project Knowledge Assistant)
- Nang cap edge function `project-chat`:
  - Query song song: site_content + project_slides + admin_documents
  - Inject du lieu thuc vao system prompt
  - Chatbot tra loi chinh xac ve noi dung website, slide, tai lieu
- Khong can thay doi UI (chatbot popup + trang /ai-assistant giu nguyen)

---

## PHAN D: LO TRINH PHAT TRIEN

### Phase 1: Nen tang (2-3 tuan)
1. Tao database schema (10 bang moi)
2. Nang cap chatbot thanh Knowledge Assistant (C8)
3. He thong Reviews & Ratings co ban (C1)
4. Gamification: streak + points + achievements (C2)

### Phase 2: AI Slide Builder (3-4 tuan)
1. Edge function `generate-deck` (tao slide tu prompt)
2. Trang tao deck moi (/slides/new)
3. CMS Editor split-screen (/slides/:deckId)
4. Fullscreen presentation mode
5. Share link public (/slides/shared/:slug)
6. Edge function `generate-deck-image` (tao anh cho slide)

### Phase 3: Brand Identity (2 tuan)
1. Edge function `generate-brand-kit`
2. UI tao va chinh sua brand kit
3. Ap dung brand kit vao slide deck
4. Download/export brand kit

### Phase 4: Mo rong (3-4 tuan)
1. AI Personal Trainer - meal plan + workout (C3)
2. Admin Analytics Dashboard (C6)
3. Blog/Content Platform (C7)
4. PDF export cho slide deck

### Phase 5: Thuong mai (tuong lai)
1. Marketplace + thanh toan (C4)
2. Community social feed (C5)
3. Mobile optimization nang cao

---

## PHAN E: FILE CAN TAO/SUA

### Edge Functions (supabase/functions/)
| File | Muc dich |
|---|---|
| `generate-deck/index.ts` | MOI - Tao slide deck tu prompt |
| `generate-deck-image/index.ts` | MOI - Tao anh cho slide |
| `generate-brand-kit/index.ts` | MOI - Tao brand kit |
| `generate-meal-plan/index.ts` | MOI - Tao meal plan |
| `generate-workout/index.ts` | MOI - Tao workout plan |
| `generate-blog-post/index.ts` | MOI - Tao/goi y blog |
| `project-chat/index.ts` | SUA - Them query DB dong |

### Pages (src/pages/)
| File | Muc dich |
|---|---|
| `SlideBuilder.tsx` | MOI - Trang tao deck moi |
| `DeckEditor.tsx` | MOI - CMS Editor split-screen |
| `DeckPresent.tsx` | MOI - Fullscreen presentation |
| `SharedDeck.tsx` | MOI - Xem deck public |
| `BrandKit.tsx` | MOI - Brand Identity Generator |
| `BrandKitEditor.tsx` | MOI - Chinh sua brand kit |
| `Blog.tsx` | MOI - Danh sach bai viet |
| `BlogPost.tsx` | MOI - Bai viet chi tiet |
| `Leaderboard.tsx` | MOI - Bang xep hang |
| `MealPlan.tsx` | MOI - AI meal plan |
| `WorkoutPlan.tsx` | MOI - AI workout plan |
| `AdminAnalytics.tsx` | MOI - Analytics dashboard |
| `AdminReviews.tsx` | MOI - Quan ly reviews |
| `AdminBlog.tsx` | MOI - Quan ly blog |

### Components (src/components/)
| File | Muc dich |
|---|---|
| `slides/DeckCMSEditor.tsx` | MOI - Split-screen editor chinh |
| `slides/MarkdownSlideEditor.tsx` | MOI - Markdown editor panel |
| `slides/SlideThumbStrip.tsx` | MOI - Thumbnail navigation |
| `slides/SlideToolbar.tsx` | MOI - Toolbar editor |
| `brand/BrandPreview.tsx` | MOI - Preview brand kit |
| `brand/ColorPicker.tsx` | MOI - Chon mau |
| `brand/FontSelector.tsx` | MOI - Chon font |
| `gamification/StreakBadge.tsx` | MOI - Hien streak |
| `gamification/PointsDisplay.tsx` | MOI - Hien diem |
| `gamification/AchievementPopup.tsx` | MOI - Popup achievement |
| `reviews/ReviewForm.tsx` | MOI - Form danh gia |
| `reviews/ReviewList.tsx` | MOI - Danh sach danh gia |
| `reviews/StarRating.tsx` | MOI - Component sao |
| `analytics/RevenueChart.tsx` | MOI - Bieu do doanh thu |
| `analytics/ClassHeatmap.tsx` | MOI - Heatmap lich hoc |

### Tai su dung tu codebase hien tai
- `SlideLayouts.tsx` -- 10 layout da co, dung truc tiep
- `SlideViewer.tsx` -- Logic scale 1920x1080, fullscreen
- `react-resizable-panels` -- Split-screen editor
- `Recharts` -- Analytics charts
- `Framer Motion` -- Animation
- `Lenis` -- Smooth scroll
- Gemini API integration pattern -- Tu `generate-content` va `generate-slides`

---

## PHAN F: QUYET DINH KY THUAT QUAN TRONG

### 1. Du an moi hay tich hop?
**Khuyen nghi: Tich hop vao FLYFIT hien tai**
- Co san toan bo ha tang (DB, Auth, Storage, Edge Functions)
- Tai su dung 10+ slide layouts, SlideViewer, authentication
- Them route moi khong anh huong route cu
- Tiet kiem thoi gian setup

### 2. AI Provider
- **Gemini API (GOOGLE_GEMINI_API_KEY)**: Dung cho text generation (da co, on dinh)
- **Lovable AI Gateway (LOVABLE_API_KEY)**: Dung cho image generation (gemini-2.5-flash-image hoac gemini-3-pro-image-preview)
- Ket hop ca hai de toi uu chi phi va chat luong

### 3. Markdown Editor
- Dung `textarea` don gian voi syntax highlighting co ban (khong can thu vien ngoai)
- Preview realtime bang `SlideRenderer` da co
- Khong can WYSIWYG editor phuc tap

### 4. Export
- **PDF**: Dung `html2canvas` + `jsPDF` (can cai them)
- **Hinh anh**: `html2canvas` chup tung slide
- **PPTX**: Phuc tap, de Phase 5+

