

# Tang Kich Thuoc Font va Cai Thien UX cho Slide Presentation

## Danh Gia Hien Trang

Tat ca slides render tai 1920x1080 roi scale xuong. Nhieu font size hien tai qua nho:

| Thanh phan | Hien tai | Van de |
|---|---|---|
| Slide label ("Slide 1/30") | 18px | Qua nho, kho doc |
| Subtitle | 24px | Nho so voi viewport 1920px |
| Content body text | 24px | Nho, can tang len |
| Bold heading trong content | 28px | Chua du noi bat |
| Emoji text | 24px, 22px | Nho |
| Emoji icon | 28px | Tuong doi ok nhung nen tang |
| Table header | 20px | Qua nho |
| Table cell | 18px | Rat nho, kho doc |
| Quote text | 28px | Nho cho kieu quote |
| Dash line | 22px | Nho |
| Cover title | 96px | OK |
| Section title (h2) | 52px | OK |

## Ke Hoach Thay Doi

### 1. Tang font size toan bo ContentBlock

| Thanh phan | Hien tai | Moi |
|---|---|---|
| Bold heading | text-[28px] | text-[36px] |
| Bold heading text phu | text-[24px] | text-[30px] |
| Emoji icon | text-[28px] | text-[32px] |
| Emoji bold text | text-[24px] | text-[30px] |
| Emoji description | text-[22px] | text-[28px] |
| Emoji plain text | text-[24px] | text-[30px] |
| Quote text | text-[28px] | text-[36px] |
| Dash line | text-[22px] | text-[26px] |
| Plain text | text-[24px] | text-[30px] |
| Spacing | space-y-3 | space-y-4 |

### 2. Tang font size TableContent

| Thanh phan | Hien tai | Moi |
|---|---|---|
| Table header | text-[20px] | text-[26px] |
| Table cell | text-[18px] | text-[24px] |
| Cell padding | px-6 py-3 | px-8 py-4 |

### 3. Tang font cac thanh phan chung tren moi slide layout

| Thanh phan | Hien tai | Moi |
|---|---|---|
| Slide label ("Slide X/30") | text-[18px] | text-[22px] |
| Subtitle | text-[24px] | text-[30px] |
| Cover content | text-[24px] | text-[30px] |
| Cover subtitle | text-[42px] | text-[48px] |

### 4. File can chinh sua

Chi can chinh sua **1 file duy nhat**: `src/components/slides/SlideLayouts.tsx`

- Cap nhat `ContentBlock` component (dong 29-102): tang tat ca font size
- Cap nhat `TableContent` component (dong 106-139): tang font va padding
- Cap nhat slide label va subtitle trong 10 layout components: CoverSlide, TwoColumnSlide, StatsSlide, GridSlide, TableSlide, TimelineSlide, QuoteSlide, PricingSlide, PersonaSlide, ChartSlide

### Tong ket

Thay doi nay khong anh huong cau truc hay logic, chi tang kich thuoc font de noi dung de doc hon khi trinh chieu. Tat ca thay doi nam trong 1 file.

