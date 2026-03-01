

# Ke hoach: Search trong Template Gallery + Chuyen doi sang UI Minimalist

## Phan 1: Them tinh nang Search vao Template Gallery

### Thay doi

**File sua: `src/components/slides/TemplateGallery.tsx`**
- Them state `searchQuery` (string)
- Them thanh tim kiem phia tren category filter: input voi icon Search, placeholder "Tim kiem mau slide..."
- Cap nhat logic `filtered`: loc theo ca `category` VA `searchQuery` (match ten, mo ta, category)
- Khi co searchQuery, tu dong chuyen category ve "all" de ket qua khong bi gioi han
- Hien thi so ket qua ("X mau") ben canh thanh tim kiem
- Nut X de xoa nhanh searchQuery

### Logic loc

```text
filtered = templates
  -> loc theo category (neu khong phai "all")
  -> loc theo searchQuery: name hoac description chua tu khoa (case-insensitive, normalize tieng Viet)
```

---

## Phan 2: Ke hoach chuyen sang UI Minimalist

### Triet ly Minimalist cho Slide Builder

Hien tai DeckEditor co **qua nhieu nut va tuy chon** hien thi cung luc tren man hinh (toolbar day dac, sidebar lon, nhieu dropdown). Cach tiep can minimalist:

### Nguyen tac thiet ke

1. **An cho den khi can** - Chi hien cong cu khi nguoi dung tuong tac (hover, click, select)
2. **Progressive disclosure** - Hien thi tung lop, khong do het len man hinh
3. **Focus mode** - Man hinh mac dinh chi co slide preview, sidebar thu gon
4. **Contextual toolbar** - Toolbar chi hien khi chon block/element
5. **Command palette** - Dung Ctrl+K de truy cap moi tinh nang (thay cho nhieu nut)

### Cac thay doi cu the (lo trinh tuong lai)

```text
+-------+----------------------------------------+-----------+
| Buoc  | Noi dung                               | Do kho    |
+-------+----------------------------------------+-----------+
| U1    | Thu gon toolbar thanh floating bar      | Trung     |
|       | Chi hien: Save, Present, More (...)     |           |
|       | Click "..." mo full toolbar             |           |
+-------+----------------------------------------+-----------+
| U2    | Sidebar thu gon mac dinh               | Thap      |
|       | Chi hien so slide nho, hover mo rong    |           |
|       | (da co sidebarCollapsed, can polish)    |           |
+-------+----------------------------------------+-----------+
| U3    | Command Palette (Ctrl+K)               | Trung     |
|       | Tim kiem: layout, theme, export, AI...  |           |
|       | Thay the nhieu dropdown menu            |           |
+-------+----------------------------------------+-----------+
| U4    | Contextual panels thay tabs             | Trung     |
|       | Click slide -> panel edit ben phai      |           |
|       | Click image -> panel image options      |           |
|       | Khong hien gi khi khong chon            |           |
+-------+----------------------------------------+-----------+
| U5    | Zen mode / Focus mode                   | Thap      |
|       | An het UI, chi con slide full-screen    |           |
|       | ESC de thoat                            |           |
+-------+----------------------------------------+-----------+
```

### Khi nao chuyen sang UI moi?

De nghi: **Sau khi hoan thanh Phase 1+2 trong roadmap** (C1-C4, M1-M3). Ly do:
- Hien tai dang them tinh nang -> doi UI som se phai lam lai
- Khi da co day du tinh nang, moi biet can "an" gi va "hien" gi
- UI minimalist la buoc **polish cuoi cung** truoc khi ra mat thu tien

### Trinh tu thuc hien ngay

Trong session nay chi lam **Phan 1** (search template gallery) vi day la tinh nang nho, ro rang. Phan 2 (minimalist UI) se la ke hoach cho giai doan sau.

### Tom tat thay doi

| File | Loai | Mo ta |
|------|------|-------|
| `src/components/slides/TemplateGallery.tsx` | Sua | Them search input + logic loc theo tu khoa |

