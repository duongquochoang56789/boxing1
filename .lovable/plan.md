

# Tạo Content và Hình ảnh bằng AI cho Landing Page

## Tổng quan
Sử dụng Lovable AI (đã tích hợp sẵn, KHÔNG cần API key) để tạo hình ảnh và nội dung text phù hợp phong cách luxury gym/wellness cho toàn bộ landing page.

## Mô hình AI sử dụng
- **Hình ảnh**: `google/gemini-2.5-flash-image` - tạo ảnh gym/fitness/wellness
- **Text content**: `google/gemini-3-flash-preview` - viết nội dung tiếng Việt

## Kế hoạch thực hiện

### 1. Tạo Supabase Storage bucket
- Tạo bucket `site-images` (public) để lưu trữ ảnh AI-generated
- Cho phép public read access

### 2. Tạo Edge Function `generate-content`
- Nhận prompt mô tả loại ảnh cần tạo (gym, yoga, trainer, equipment...)
- Gọi Lovable AI gateway với model `google/gemini-2.5-flash-image`
- Upload ảnh base64 lên Supabase Storage
- Trả về URL public của ảnh

### 3. Tạo Edge Function `generate-text`
- Nhận context (section name, style guide)
- Gọi Lovable AI gateway với model `google/gemini-3-flash-preview`
- Tạo heading, description, slogan phù hợp phong cách luxury Vietnamese

### 4. Tạo trang Admin `/admin/content`
- Giao dien don gian de:
  - Generate anh cho tung section (Hero, About, Gallery, Services, Trainers)
  - Generate text content cho tung section
  - Preview ket qua truoc khi apply
  - Apply content vao landing page

### 5. Tao database table `site_content`
- Luu tru content da generate (images URLs, text, section mapping)
- Cho phep update landing page tu database thay vi hardcode

### 6. Cap nhat cac component landing page
- Hero, About, Gallery, Services, Trainers, Testimonials
- Doc content tu database thay vi hardcode
- Fallback ve content mac dinh neu chua co data

## Danh sach anh can generate

| Section | So luong | Mo ta |
|---------|----------|-------|
| Hero | 1 | Full-bleed luxury gym interior, warm lighting |
| About | 3 | Personal training, group class, premium equipment |
| Gallery | 6 | Various gym spaces: main floor, weights, cardio, yoga, PT zone, lounge |
| Services | 4 | PT session, group fitness, strength area, nutrition |
| Trainers | 4 | Professional trainer portraits |
| Testimonials | 1 | Happy member in gym |

## Chi tiet ky thuat

### Files can tao moi
- `supabase/functions/generate-content/index.ts` - Edge function generate anh
- `supabase/functions/generate-text/index.ts` - Edge function generate text
- `src/pages/AdminContent.tsx` - Trang quan ly content
- Migration SQL tao table `site_content` va storage bucket

### Files can sua
- `src/App.tsx` - Them route /admin/content
- `src/components/landing/HeroSection.tsx` - Doc content tu database
- `src/components/landing/AboutSection.tsx` - Doc content tu database
- `src/components/landing/GallerySection.tsx` - Doc content tu database
- `src/components/landing/ServicesSection.tsx` - Doc content tu database
- `src/components/landing/TrainersSection.tsx` - Doc content tu database
- `src/components/landing/TestimonialsSection.tsx` - Doc content tu database
- `supabase/config.toml` - KHONG DUOC EDIT (tu dong cap nhat)

### Database schema

```text
site_content
  - id: uuid (PK)
  - section: text (hero, about, gallery, services, trainers, testimonials)
  - content_type: text (image, text)
  - key: text (title, description, image_url, etc.)
  - value: text
  - created_at: timestamptz
  - updated_at: timestamptz
```

### Edge function flow

```text
Client -> generate-content edge function
  -> Lovable AI (gemini-2.5-flash-image)
  -> Base64 image
  -> Upload to Supabase Storage
  -> Return public URL
  -> Save to site_content table
```

### Luu y
- Lovable AI da co san, KHONG can API key tu nguoi dung
- Anh generate co the mat 5-10 giay moi anh
- Tat ca anh duoc luu tru vinh vien tren Storage
- Content co the re-generate bat ky luc nao tu trang Admin
- RLS policy: public read cho site_content, authenticated write

