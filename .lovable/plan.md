
# Ke hoach: Trang Hub tong hop ket noi FLYFIT va SlideAI

## Van de hien tai

Sau khi dang nhap, nguoi dung bi dua thang vao `/dashboard` (FLYFIT) hoac `/slides` (SlideAI) ma khong co cach chuyen doi nhanh giua 2 ung dung. Chung hoan toan tach biet ve giao dien va dieu huong.

## Giai phap: Trang Hub (`/hub`)

Tao mot **trang Hub trung tam** - noi dau tien nguoi dung thay sau khi dang nhap. Trang nay hien thi 2 "app card" lon de nguoi dung chon vao ung dung muon su dung:

```text
+----------------------------------------------------------+
|  Xin chao, [Ten]!          [Profile] [Logout]            |
|                                                          |
|  +------------------------+  +------------------------+  |
|  |   FLYFIT               |  |   SlideAI              |  |
|  |   [Fitness Icon]       |  |   [Presentation Icon]  |  |
|  |                        |  |                        |  |
|  |   3 buoi tap sap toi   |  |   5 deck da tao        |  |
|  |   2 lop dang ky        |  |   2 brand kit          |  |
|  |                        |  |                        |  |
|  |   [Mo FLYFIT ->]       |  |   [Mo SlideAI ->]      |  |
|  +------------------------+  +------------------------+  |
|                                                          |
|  Hoat dong gan day:                                      |
|  - Tao deck "Marketing Q1" - 2 gio truoc                |
|  - Dang ky lop Yoga - hom qua                            |
+----------------------------------------------------------+
```

## Chi tiet ky thuat

### File tao moi

**`src/pages/Hub.tsx`**
- Layout: full-page, nen sang (cream) giong Dashboard FLYFIT
- Header: logo chung, user info, logout
- 2 App Cards lon (grid 2 col tren desktop, stack tren mobile):
  - **FLYFIT Card**: icon Dumbbell, mau terracotta, hien so buoi tap sap toi + lop dang ky, link `/dashboard`
  - **SlideAI Card**: icon Presentation, mau indigo-violet, hien so deck + brand kit da tao, link `/slides`
- Phan "Hoat dong gan day" (optional): gop 3-5 hoat dong moi nhat tu ca 2 ung dung
- Fetch data tu `class_registrations`, `pt_sessions`, `decks`, `brand_kits` de hien thi so lieu thong ke

### File sua

**`src/App.tsx`**
- Them route `/hub` -> Hub (protected)
- Doi redirect mac dinh sau dang nhap tu `/dashboard` sang `/hub`

**`src/hooks/useAuth.tsx`** (neu can)
- Cap nhat redirect sau login tu `/dashboard` sang `/hub`

**`src/pages/Dashboard.tsx`**
- Them nut "Quay lai Hub" hoac breadcrumb de quay ve `/hub`
- Them nut "Mo SlideAI" de chuyen sang `/slides`

**`src/components/builder/AppSidebar.tsx`**
- Doi link "Trang chu" tu `/` sang `/hub` de quay ve hub thay vi landing page
- Hoac them muc "FLYFIT" trong footer de chuyen nhanh

### Luong dieu huong moi

```text
Dang nhap -> /hub (Hub tong hop)
                |
        +-------+-------+
        |               |
    /dashboard       /slides
    (FLYFIT)        (SlideAI App Shell)
        |               |
   /schedule         /brand
   /book-pt          /slides/new
   /history          /slides/:id
   /profile
```

### Du lieu hien thi tren Hub

- **FLYFIT stats**: dem `class_registrations` (status=registered, tuong lai) + `pt_sessions` (status=booked/confirmed, tuong lai)
- **SlideAI stats**: dem `decks` (user_id) + `brand_kits` (user_id)
- Query don gian, chi can count

### Thiet ke UI

- Phong cach: minimalist, sang trong, tuong tu Dashboard hien tai
- App cards co hover effect (shadow, translate-y, border highlight)
- Moi card co gradient nhe theo mau thuong hieu (terracotta cho FLYFIT, indigo cho SlideAI)
- Responsive: 2 col tren desktop, 1 col stack tren mobile
- Animation: framer-motion stagger nhu Dashboard hien tai

## Khong can thay doi
- Database: khong can migration (chi query data co san)
- Edge functions: khong thay doi
- Dependencies: khong can cai them
