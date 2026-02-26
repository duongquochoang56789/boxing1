

# Kiem tra toan bo tinh nang AI Slide Builder - Bao cao & Ke hoach sua loi

## Tong quan
Sau khi kiem tra ky luong toan bo ma nguon cua he thong AI Slide Builder, day la danh sach cac van de phat hien va ke hoach khac phuc.

---

## Van de 1 (NGHIEM TRONG): Edge Function `generate-deck` su dung `getClaims(token)` sai cach

**File**: `supabase/functions/generate-deck/index.ts` (dong 40)

**Van de**: Ham `supabase.auth.getClaims(token)` truyen token lam tham so, nhung theo tai lieu Supabase SDK, `getClaims()` khong nhan tham so - no doc tu session hien tai. Dieu nay co the gay loi "Unauthorized" khi tao slide.

**Giai phap**: Thay `getClaims(token)` bang `getUser()` giong nhu cach `generate-slide-image` dang lam:
```text
// Thay dong 39-47 bang:
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError || !user) { return 401 Unauthorized }
const userId = user.id;
```

---

## Van de 2 (TRUNG BINH): SlideDashboard van dung Loader2 spinner thay vi BrandedLoader

**File**: `src/pages/SlideDashboard.tsx` (dong 163-165)

**Van de**: Trang Dashboard (`/slides`) van dung `<Loader2>` spinner co ban, khong nhat quan voi cac trang khac da duoc cap nhat sang BrandedLoader.

**Giai phap**: Import va thay `<Loader2>` bang `<BrandedLoader variant="page" />`.

---

## Van de 3 (TRUNG BINH): DeckEditor van dung Loader2 spinner khi loading

**File**: `src/pages/DeckEditor.tsx` (dong 331-337)

**Van de**: Trang Editor cung van dung Loader2 spinner khi dang tai deck.

**Giai phap**: Thay bang `<BrandedLoader variant="page" />`.

---

## Van de 4 (NHO): DeckPresent van dung Loader2 spinner

**File**: `src/pages/DeckPresent.tsx` (dong 147-153)

**Van de**: Man hinh trinh chieu cung dung Loader2 khi loading.

**Giai phap**: Thay bang `<BrandedLoader variant="page" />` voi nen den (can custom style).

---

## Van de 5 (NHO): BrandedLoader co nen `bg-cream` co dinh, khong phu hop nen toi

**File**: `src/components/ui/branded-loader.tsx` (dong 122)

**Van de**: Khi variant="page", component render `<div className="min-h-screen bg-cream ...">`. Dieu nay khong phu hop voi cac trang dark theme (Slide Dashboard, Editor, Present) vi se hien nen sang giua trang toi.

**Giai phap**: Them prop `darkMode` hoac `className` de ho tro nen toi:
```text
Props moi:
  className?: string  // override container class
```

---

## Van de 6 (NHO): Console error - ProtectedRoute khong dung forwardRef

**File**: `src/components/ProtectedRoute.tsx`

**Van de**: Console log hien loi "Function components cannot be given refs" do AnimatePresence co gang truyen ref vao ProtectedRoute nhung component nay khong dung `forwardRef`.

**Giai phap**: Wrap ProtectedRoute bang `React.forwardRef`.

---

## Tong ket cac file can sua

| File | Loai thay doi | Muc do |
|------|--------------|--------|
| `supabase/functions/generate-deck/index.ts` | Sua getClaims -> getUser | Nghiem trong |
| `src/components/ui/branded-loader.tsx` | Them prop className cho dark mode | Nho |
| `src/pages/SlideDashboard.tsx` | Thay Loader2 -> BrandedLoader | Trung binh |
| `src/pages/DeckEditor.tsx` | Thay Loader2 -> BrandedLoader | Trung binh |
| `src/pages/DeckPresent.tsx` | Thay Loader2 -> BrandedLoader | Nho |
| `src/components/ProtectedRoute.tsx` | Them forwardRef | Nho |

**Tong cong**: 6 file can sua, 0 file moi, 0 migration

---

## Cac tinh nang HOAT DONG TOT (khong can sua)
- Tao deck tu AI prompt (ngoai tru van de auth o tren)
- Editor voi Markdown, auto-save, keyboard shortcuts
- 12 loai layout (cover, two-column, stats, grid, table, timeline, quote, pricing, persona, chart, image-full, comparison)
- Drag-and-drop sap xep slide trong editor
- Nhan doi slide, xoa slide
- Xuat PDF
- Tao anh AI tu image prompt
- Chia se public link
- Presenter View voi timer, notes, next slide preview, grid overview
- Tim kiem deck trong dashboard
- Chuyen doi cong khai/rieng tu

