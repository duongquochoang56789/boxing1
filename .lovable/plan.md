
# Splash Screen + Branded Loading Animation - FlyFit

## Tong quan
Them 2 thanh phan thuong hieu vao trai nghiem nguoi dung:
1. **Splash Screen** - Man hinh gioi thieu khi lan dau mo trang web, logo FlyFit xuat hien voi animation sang trong truoc khi noi dung chinh hien ra
2. **Branded Loader** - Thay the tat ca spinner don gian bang animation thuong hieu FlyFit cho cac trang cho du lieu

---

## Phan 1: Splash Screen (Intro Animation)

### Y tuong
Khi nguoi dung mo trang web:
1. Man hinh nen mau cream/charcoal xuat hien
2. Logo SVG FlyFit (cac ellipse chong nhau) ve tu tu bang hieu ung "drawing" (stroke-dashoffset)
3. Chu "FLYFIT" fade in tung ky tu
4. Slogan "Bay Cao. Song Khoe." hien ra nhe
5. Toan bo man hinh "mo ra" (scale up + fade out) de lo noi dung trang chu phia sau
6. Toan bo mat khoang 2.5-3 giay

### Ky thuat
- Tao component `SplashScreen` (`src/components/ui/splash-screen.tsx`)
- Su dung Framer Motion cho tat ca animation
- Tich hop vao `Index.tsx` (trang chu) voi state `showSplash`
- Chi hien 1 lan moi session (dung `sessionStorage` de khong lap lai khi quay ve trang chu)
- Animation sequence:
  - 0s-0.8s: Outer ring ve vong tron (stroke-dashoffset animation)
  - 0.3s-1.2s: 3 ellipse hien ra luan phien (staggered scale + opacity)
  - 1s-1.5s: Floating dots pulse vao
  - 1.2s-1.8s: Text "FLY" + "FIT" fade in tung phan
  - 1.5s-2s: Slogan slide up + fade in
  - 2.2s-3s: Toan bo splash scale up 1.2x + fade out, de lo trang chu

### File thay doi
- **Tao moi**: `src/components/ui/splash-screen.tsx`
- **Sua**: `src/pages/Index.tsx` - Wrap noi dung voi splash logic

---

## Phan 2: Branded Loader (Loading Animation)

### Hien trang
Co 5 vi tri dung spinner co ban (vong tron border quay):
- `Auth.tsx`, `History.tsx`, `Profile.tsx`, `SlideBuilder.tsx`, `BookPT.tsx`

### Giai phap
Tao component `BrandedLoader` tai su dung voi 2 che do:
- **page**: Hien giua man hinh cho loading trang (logo + text + progress)
- **inline**: Nho gon cho button (chi co logo quay nho)

### Animation
- Logo SVG thu nho voi 3 ellipse quay doc lap (rotation staggered)
- Text "FLYFIT" co hieu ung opacity breathing nhe
- Optional: thanh progress bar cho tac vu dai (AI generation)
- Message tuy chinh (VD: "Dang tao slide...", "Dang tai...")

### File thay doi
- **Tao moi**: `src/components/ui/branded-loader.tsx`
- **Sua**: `Auth.tsx`, `History.tsx`, `Profile.tsx`, `SlideBuilder.tsx`, `BookPT.tsx` - Thay spinner cu bang `BrandedLoader`

---

## Chi tiet ky thuat

### SplashScreen component
```text
Props:
  onComplete: () => void    // Goi khi animation ket thuc

State noi bo:
  - phase: "drawing" | "text" | "reveal" | "done"
  - Dung Framer Motion variants + stagger

Animation timeline:
  [0s]      Nen charcoal xuat hien
  [0-0.8s]  Outer ring SVG stroke draw
  [0.3-1.2s] 3 ellipse scale in luan phien
  [1.2-1.8s] "FLY" + "FIT" text fade in
  [1.5-2s]  Slogan fade in
  [2.2-3s]  Scale up 1.2x + opacity -> 0, goi onComplete
```

### BrandedLoader component
```text
Props:
  size?: "sm" | "md" | "lg" (mac dinh "md")
  message?: string
  showProgress?: boolean
  variant?: "page" | "inline" (mac dinh "page")
```

### Index.tsx thay doi
```text
- Them state: showSplash (true neu chua co sessionStorage key)
- Khi showSplash = true: render SplashScreen
- Khi SplashScreen goi onComplete: set showSplash = false, luu sessionStorage
- Khi showSplash = false: render noi dung trang chu binh thuong
```

## Tong ket
- **2 file moi**: `splash-screen.tsx`, `branded-loader.tsx`
- **6 file sua**: `Index.tsx` + 5 trang co spinner
- **Khong can** them dependency (da co Framer Motion)
- **Khong can** migration hay edge function
