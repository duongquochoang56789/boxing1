

# Block Editor WYSIWYG - He thong chinh sua truc quan giong Canva

## Block Editor la gi?

Hien tai, ban soan noi dung slide bang Markdown (gõ text trong o textarea ben trai), roi xem ket qua ben phai (preview). **Block Editor** cho phep ban **click thang vao slide preview** de chinh sua -- giong nhu Canva, Google Slides. Moi phan tu tren slide (tieu de, doan van, bullet, so lieu...) tro thanh 1 "block" rieng biet ma ban co the:
- Click vao de sua noi dung
- Thay doi font chu, co chu, mau sac
- Can chinh (trai/giua/phai)
- Va nhieu tinh nang thiet ke khac

## Chia thanh 6 cap do

| Cap do | Ten | Mo ta ngan |
|--------|-----|------------|
| B1 | Inline Text Editing | Click vao Title/Subtitle tren slide de sua tai cho |
| B2 | Content Block Selection | Moi dong noi dung tro thanh 1 block, click de chon, hover de highlight |
| B3 | Block Text Formatting | Toolbar xuat hien khi chon block: Bold, Italic, Font Size, Text Color |
| B4 | Font System | He thong font chu: chon font family, trong luong (weight), khoang cach chu |
| B5 | Block Alignment & Spacing | Can chinh block (trai/giua/phai), khoang cach giua cac block, padding |
| B6 | Advanced Block Controls | Duplicate block, xoa block, keo di chuyen thu tu, thêm block mới |

---

## Trien khai trong lan nay: B1 + B2 + B3 (co ban nhat)

### B1: Inline Text Editing
- Click vao **Title** tren slide preview -> hien con tro, go de sua
- Click vao **Subtitle** -> tuong tu
- Khi blur (click ra ngoai), tu dong dong bo nguoc ve Markdown editor ben trai
- Vien nhe (border dashed) xuat hien khi hover de nguoi dung biet co the click

### B2: Content Block Selection
- Moi phan tu trong ContentBlock (heading, bullet, paragraph) co the click de chon
- Block dang chon co vien highlight mau cam
- Hien nut chinh sua nho (floating toolbar) phia tren block dang chon
- Khi chon 1 block, textarea ben trai tu dong highlight dong tuong ung

### B3: Block Text Formatting Toolbar
Khi chon 1 block text, hien thanh cong cu noi (floating toolbar) voi:
- **Bold** (B) / **Italic** (I)
- **Co chu**: 5 muc (XS, S, M, L, XL)  
- **Mau chu**: 8 preset mau (trang, cam, xanh, tim, vang, xanh la, hong, xam)
- **Can chinh**: Trai / Giua / Phai

---

## Chi tiet ky thuat

### Thay doi SlideLayouts.tsx

Them props moi cho `SlideRenderer`:
```text
interface SlideRendererProps {
  slide: SlideData;
  editable?: boolean;              // bat che do edit
  onUpdateField?: (field: 'title' | 'subtitle' | 'content', value: string) => void;
  onBlockSelect?: (blockIndex: number) => void;  // khi click 1 block
  selectedBlock?: number | null;
}
```

**Title & Subtitle editable**: Cac layout component (CoverSlide, TwoColumnSlide...) se render title/subtitle dung `contentEditable` div khi `editable=true`:
- hover: border dashed white/20
- focus: border solid orange-400/50
- onBlur: goi onUpdateField('title', innerText)

**ContentBlock editable**: Moi element trong ContentBlock duoc boc trong div co:
- onClick -> goi onBlockSelect(blockIndex)
- className highlight khi selectedBlock === blockIndex
- Con tro contentEditable khi duoc chon

### Tao BlockToolbar.tsx (file moi)

Floating toolbar xuat hien phia tren block dang chon:
```text
Component: BlockToolbar
Props: 
  - position: { top, left } (tinh tu block element rect)
  - onBold, onItalic
  - onFontSize(size: 'xs'|'sm'|'md'|'lg'|'xl')
  - onColor(color: string)
  - onAlign(align: 'left'|'center'|'right')
  - onClose

Render:
  - Portal vao document.body
  - Position absolute theo toa do
  - Row cac nut: B | I | Size dropdown | Color dots | Align icons
  - Style: bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl
```

### Thay doi DeckEditor.tsx

- Them state: `selectedBlock`, `blockToolbarPos`
- Truyen `editable={true}` va callbacks vao SlideRenderer trong preview panel
- Khi `onUpdateField` duoc goi -> cap nhat slide state + trigger auto-save
- Khi `onBlockSelect` -> tinh vi tri block element -> hien BlockToolbar

### Cach block formatting hoat dong

Khi nguoi dung bam Bold/Italic/Color/Size trong toolbar:
1. Tim dong tuong ung trong slide.content (theo blockIndex)
2. Ap dung Markdown formatting (VD: boc `**...**` cho bold)
3. Hoac them metadata dang `<!-- style:bold,color:#fb923c,size:lg -->` vao cuoi dong
4. ContentBlock parser se doc metadata nay de render dung style

**Chon cach tiep can metadata comment** vi:
- Khong pha vo cu phap Markdown
- De luu tru va parse
- Nguoi dung khong thay metadata khi trinh chieu

### Format metadata:
```text
Dong goc:     * Diem noi bat cua san pham
Sau format:   * Diem noi bat cua san pham <!-- style:bold,color:#fb923c,size:lg,align:center -->
```

ContentBlock se parse comment `<!-- style:... -->` va ap dung CSS tuong ung.

---

## Tong ket file thay doi

| File | Thao tac | Mo ta |
|------|----------|-------|
| `src/components/slides/BlockToolbar.tsx` | Tao moi | Floating toolbar voi Bold/Italic/Size/Color/Align |
| `src/components/slides/SlideLayouts.tsx` | Sua | Them props editable, onUpdateField, onBlockSelect, selectedBlock. Title/Subtitle contentEditable. ContentBlock parse metadata style |
| `src/pages/DeckEditor.tsx` | Sua | Them state selectedBlock, truyen editable props vao SlideRenderer, render BlockToolbar |

## Khong can migration hay dependency moi
- Su dung contentEditable native cua browser
- CSS inline cho positioning toolbar
- Metadata style luu trong content string (khong can cot DB moi)

## Cac cap do tiep theo (B4-B6) se lam sau

- **B4 Font System**: Them Google Fonts picker, font weight selector, letter spacing
- **B5 Alignment & Spacing**: Drag handle de chinh khoang cach, snap-to-grid, padding controls
- **B6 Advanced Blocks**: Keo tha doi vi tri block, them block moi (text/image/shape), xoa block, duplicate

