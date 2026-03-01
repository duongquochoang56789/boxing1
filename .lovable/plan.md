

# Level B4: Font System + So sanh voi Canva

## So sanh tinh nang voi Canva

Canva co nhung tinh nang chinh sau cho slide editor. Day la so sanh voi he thong hien tai cua chung ta:

| Tinh nang Canva | Chung ta | Trang thai |
|-----------------|----------|------------|
| Click vao text de edit | EditableText (title/subtitle) + BlockWrapper | Co (B1-B2) |
| Floating toolbar (Bold/Italic/Size/Color/Align) | BlockToolbar.tsx | Co (B3) |
| Font family picker (1000+ fonts) | Chua co | **Lam lan nay** |
| Font weight (Thin/Light/Regular/Bold) | Chua co | **Lam lan nay** |
| Letter spacing | Chua co | **Lam lan nay** |
| Line height control | Chua co | **Lam lan nay** |
| Text effects (shadow, outline, curve) | Chua co | Tuong lai |
| Drag-and-drop repositioning elements | Chua co | B6 |
| Resize text box bang keo goc | Chua co | B6 |
| Layers panel (sap xep thu tu) | Chua co | B6 |
| Group/Ungroup elements | Chua co | B6+ |
| Snap-to-grid / smart guides | Chua co | B5 |
| Animation per-element | Chua co | Tuong lai |
| Shape/Icon insert | Chua co | Level 9 |
| Image filters (brightness, contrast) | Chua co | Level 9 |
| Background remover | Chua co | Tuong lai |
| Magic Resize | Chua co | Tuong lai |

**Nhan xet**: Chung ta da co nen tang tot (B1-B3). Buoc tiep theo quan trong nhat la **Font System** vi day la yeu to quyet dinh chat luong thiet ke. Mot slide dep hay xau phu thuoc 60% vao typography.

## Thay doi cu the

### 1. Nang cap BlockToolbar.tsx

Them dong thu 2 vao toolbar voi 3 control moi:

```text
Dong 1 (hien tai): [B] [I] | XS S M L XL | [o o o o o o o o] | Left Center Right
Dong 2 (moi):      [Font Family v]  [Weight v]  [Spacing v]  [Line Height v]
```

**12 font chuyen nghiep** (load dong qua Google Fonts CDN):

| Font | Loai | Muc dich |
|------|------|----------|
| Inter | Sans-serif | Default, hien dai |
| Playfair Display | Serif | Heading sang trong |
| Montserrat | Sans-serif | Heading geometric |
| Poppins | Sans-serif | Friendly, startup |
| Roboto | Sans-serif | Body trung tinh |
| Lora | Serif | Body trang trong |
| Be Vietnam Pro | Sans-serif | Tieng Viet toi uu |
| Bebas Neue | Display | So lieu, accent |
| Raleway | Sans-serif | Heading tinh te |
| Source Code Pro | Monospace | Code blocks |
| Dancing Script | Script | Diem nhan dac biet |
| Cormorant Garamond | Serif | Da co san (dependency) |

**6 muc font weight**: Thin (100), Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)

**4 muc letter spacing**: Tight (-0.02em), Normal (0), Wide (0.1em), Extra Wide (0.2em)

**4 muc line height**: Compact (1.1), Normal (1.4), Relaxed (1.7), Loose (2.0)

### 2. Cap nhat SlideLayouts.tsx

Mo rong `getStyleClasses` de xu ly cac style moi:

```text
Truoc: chi xu ly bold, italic, color, align, size
Sau:   them font, weight, spacing, lineheight

Vi du metadata:
<!-- style:font:Playfair Display,weight:600,spacing:wide,lineheight:relaxed,bold,color:#fb923c -->
```

Khi render, ap dung:
- `fontFamily: "'Playfair Display', serif"`
- `fontWeight: 600`
- `letterSpacing: '0.1em'`
- `lineHeight: '1.7'`

### 3. Dynamic Google Fonts loading

Tao ham `loadGoogleFont(fontName)` trong BlockToolbar.tsx:
- Khi nguoi dung chon font -> inject `<link>` tag vao `<head>`
- Lazy load: chi tai font khi can, khong tai tat ca 12 font truoc
- Cache: kiem tra `document.getElementById(id)` truoc khi them link moi

### 4. Thu gon editor panel (DeckEditor.tsx)

Hien tai BG colors chiem nhieu khong gian. Thu gon:
- Gop BG colors vao 1 section co the dong/mo (Collapsible)
- Mac dinh dong de giao textarea nhieu khong gian hon
- Giu nguyen Layout/Section selector va AI buttons

### 5. Cap nhat applyBlockStyle (DeckEditor.tsx)

Mo rong callback de xu ly cac key moi: `font`, `weight`, `spacing`, `lineheight`.
Them 4 callback moi truyen vao BlockToolbar: `onFont`, `onWeight`, `onSpacing`, `onLineHeight`.

---

## File thay doi

| File | Thao tac | Mo ta |
|------|----------|-------|
| `src/components/slides/BlockToolbar.tsx` | Sua | Them dong 2 voi Font picker, Weight, Spacing, Line Height dropdowns. Them loadGoogleFont utility |
| `src/components/slides/SlideLayouts.tsx` | Sua | Mo rong getStyleClasses xu ly font/weight/spacing/lineheight |
| `src/pages/DeckEditor.tsx` | Sua | Them 4 callback moi cho BlockToolbar, thu gon BG colors vao collapsible |

## Khong can migration, edge function, hay dependency moi
- Google Fonts load qua CDN `<link>` tag dong
- Cormorant Garamond da co san trong dependencies
- Style metadata luu trong content string (khong can cot DB moi)

