

# Cap do 1: Smart Defaults - Ke hoach trien khai

## Tong quan
Trien khai 3 tinh nang thong minh co ban de giam thao tac thu cong va tao trai nghiem muot hon cho nguoi dung.

---

## 1A. Auto-generate anh sau khi tao deck

**Luong hoat dong:**
1. `SlideBuilder.tsx`: Sau khi `generate-deck` thanh cong, navigate den `/slides/{deckId}?autoImages=true`
2. `DeckEditor.tsx`: Doc URL param `autoImages`, hien dialog hoi nguoi dung co muon AI tu dong tao anh cho tat ca slide khong
3. Neu dong y: tu dong goi `generateAllImages()` va xoa param khoi URL
4. Neu tu choi: dong dialog, xoa param

**Thay doi cu the:**
- `SlideBuilder.tsx` line 37: Doi `navigate(\`/slides/${data.deckId}\`)` thanh `navigate(\`/slides/${data.deckId}?autoImages=true\`)`
- `DeckEditor.tsx`: Them state `showAutoImageDialog`, useEffect doc `searchParams`, hien Dialog voi 2 nut "Tao anh ngay" va "De sau"

---

## 1B. Smart layout suggestions

**Logic phan tich noi dung:**
- Noi dung co bang (bat dau voi `|`) -> goi y `table`
- Noi dung co nhieu so (`**so**`) -> goi y `stats`
- Noi dung co nhieu bullet/emoji -> goi y `grid`
- Noi dung co dau `"` hoac `\u201C` -> goi y `quote`
- Noi dung ngan, co subtitle -> goi y `cover`

**UI:**
- Hien mot badge nho ben canh dropdown layout: "Goi y: stats" (click de ap dung)
- Chi hien khi layout hien tai khac voi goi y
- Mau cam nhe, animation subtle fade-in

**Thay doi:** Them function `suggestLayout(content)` va hien badge trong editor panel cua `DeckEditor.tsx`

---

## 1C. Empty state template cho slide moi

**Logic:**
- Khi tao slide moi (`addSlide`), thay vi content rong, dien template Markdown mau theo layout
- Template tuy theo layout duoc chon:
  - `cover`: "# Tieu de chinh\n\nPhu de hoac mo ta ngan..."
  - `two-column`: "**Diem 1** Mo ta chi tiet\n**Diem 2** Mo ta chi tiet..."
  - `stats`: "**100+** Khach hang\n**50%** Tang truong..."
  - `grid`: Emoji + bold pattern
  - `table`: Bang Markdown mau

**Thay doi:** Sua function `addSlide` trong `DeckEditor.tsx`, them map `LAYOUT_TEMPLATES` va dung lam default content

---

## File thay doi

| File | Thay doi |
|------|---------|
| `src/pages/SlideBuilder.tsx` | Them `?autoImages=true` vao navigate (1 dong) |
| `src/pages/DeckEditor.tsx` | Them auto-image dialog (useSearchParams + Dialog component), smart layout suggestion (function + badge UI), empty state templates (LAYOUT_TEMPLATES map + update addSlide) |

## Khong can thay doi
- Khong can migration database
- Khong can edge function moi
- Khong can dependency moi
- Chi thay doi 2 file frontend

