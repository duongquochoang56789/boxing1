
# Sua Branding va Thiet Ke FLYFIT

## Van De Hien Tai

### 1. Branding "EliteFit" trong CMS Database
Database `site_content` chua 12+ ban ghi voi ten "EliteFit" thay vi "FLYFIT":
- Hero: description, form_description
- About: label, description  
- Gallery: label
- Trainers: description
- Testimonials: heading_1, t1_quote, t3_quote, t4_quote
- Pricing: plan_1_tagline

### 2. Khong co Logo Hinh Anh
Hien tai chi co text logo "FLYFIT" trong code. Chua co file logo rieng (SVG/PNG) de su dung cho:
- Header
- Footer
- OG image
- Favicon

### 3. Slogan bi thay doi
Slogan goc "Bay Cao. Song Khoe." da bi CMS ghi de thanh noi dung khac.

---

## Ke Hoach Thuc Hien

### Buoc 1: Sua tat ca noi dung "EliteFit" thanh "FLYFIT" trong database
Chay SQL UPDATE de thay the "EliteFit" bang "FLYFIT" trong bang `site_content`:
- 12+ ban ghi can cap nhat
- Giu nguyen noi dung tieng Viet, chi doi ten thuong hieu

### Buoc 2: Khoi phuc slogan goc
Cap nhat lai cac truong hero ve noi dung FLYFIT goc:
- label: "Bay Cao. Song Khoe."
- heading_1: "Tap tai nha,"
- heading_2: "thay doi that."
- description: noi dung FLYFIT goc

### Buoc 3: Tao logo SVG cho FLYFIT
Tao component logo SVG voi:
- Text "FLY" mau charcoal + "FIT" mau terracotta
- Font Cormorant Garamond (dung font cua brand)
- 2 phien ban: logo sang (cho header tren hero) va logo toi (cho header khi scroll)
- Thay the text logo hien tai trong Header va Footer

### Buoc 4: Tao favicon moi
Tao favicon SVG don gian tu logo FLYFIT de thay the favicon hien tai.

---

## Chi Tiet Ky Thuat

### File can chinh sua:
1. **Database** — SQL UPDATE cho bang `site_content` (12+ ban ghi)
2. **src/components/ui/Logo.tsx** — Component logo SVG moi
3. **src/components/landing/Header.tsx** — Thay text logo bang component Logo
4. **src/components/landing/Footer.tsx** — Thay text logo bang component Logo
5. **public/favicon.ico** — Favicon moi tu logo

### SQL se chay:
```text
UPDATE site_content 
SET value = REPLACE(value, 'EliteFit', 'FLYFIT') 
WHERE value ILIKE '%elitefit%';
```
Kem theo cap nhat rieng cho cac truong hero de khoi phuc noi dung goc FLYFIT.
