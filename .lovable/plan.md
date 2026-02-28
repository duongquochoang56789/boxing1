
# Chuyển tất cả Edge Function AI sang Google Gemini + Tự động hóa luồng tạo ảnh

## Phần 1: Chuyển 2 function còn lại sang Gemini trực tiếp

### 1A. `generate-slide-image` (tạo ảnh cho deck_slides)
- Hiện dùng Lovable Gateway (`LOVABLE_API_KEY`) với model `google/gemini-2.5-flash-image`
- Chuyển sang gọi trực tiếp Google Gemini API endpoint: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent` với `responseModalities: ["IMAGE"]`
- Giữ logic fallback: ưu tiên `GOOGLE_GEMINI_API_KEY`, fallback sang Lovable Gateway nếu không có
- Giữ nguyên logic upload Storage + update `deck_slides`

### 1B. `generate-slides` (tạo ảnh cho project_slides - bộ 30 slide FLYFIT cũ)
- Hiện dùng Lovable Gateway cho phần image generation (mode "images")
- Chuyển sang Gemini trực tiếp tương tự như trên
- Phần mode "content" không liên quan AI gateway nên giữ nguyên

## Phần 2: Đánh giá luồng hoạt động hiện tại

### Luồng hiện tại (chưa hoàn chỉnh)
```text
[Nhập prompt] --> generate-deck --> [Nội dung + Cấu trúc + Layout]
                                          |
                                          v
                                    [DeckEditor]
                                          |
                                    (Thủ công) Bấm "AI Ảnh" từng slide
                                          |
                                          v
                                    generate-slide-image --> [1 ảnh]
```

### Vấn đề
- Người dùng phải bấm nút "AI Ảnh" cho TỪNG slide (15 slide = 15 lần bấm)
- Không có tùy chọn tạo ảnh hàng loạt (batch)
- Trải nghiệm không liền mạch

### Luồng đề xuất (cải tiến)
```text
[Nhập prompt] --> generate-deck --> [Nội dung + Cấu trúc]
                                          |
                                          v
                                    [DeckEditor]
                                          |
                     +--------------------+--------------------+
                     |                                         |
              [Nút "AI Ảnh"]                          [Nút "Tạo tất cả ảnh"]
              (từng slide)                            (batch - MỚI)
                     |                                         |
                     v                                         v
           generate-slide-image                   Gọi generate-slide-image
              (1 ảnh)                             lần lượt cho mỗi slide
                                                  (hiển thị progress bar)
```

## Phần 3: Thêm nút "Tạo tất cả ảnh" (Batch Generate)

### Frontend (DeckEditor.tsx)
- Thêm nút "Tạo tất cả ảnh" trên toolbar, bên cạnh nút "AI Ảnh" hiện tại
- Khi bấm: lặp qua tất cả slide có `image_prompt` nhưng chưa có `image_url`
- Gọi `generate-slide-image` tuần tự (tránh rate limit)
- Hiển thị progress: "Đang tạo ảnh slide 3/15..."
- Cập nhật thumbnail realtime khi mỗi ảnh hoàn thành
- Cho phép hủy giữa chừng

## Chi tiết kỹ thuật

### File thay đổi

1. **`supabase/functions/generate-slide-image/index.ts`**
   - Thêm hàm `callGeminiImageDirect(apiKey, prompt)` gọi endpoint `gemini-2.5-flash-image:generateContent` với `responseModalities: ["IMAGE"]`
   - Logic: kiểm tra `GOOGLE_GEMINI_API_KEY` truoc, fallback sang `LOVABLE_API_KEY` + Lovable Gateway
   - Parse response: `candidates[0].content.parts[].inlineData.data` (base64)
   - Giữ nguyên logic upload Storage + update DB

2. **`supabase/functions/generate-slides/index.ts`**
   - Tương tự: thêm Gemini direct cho phần mode "images"
   - Ưu tiên `GOOGLE_GEMINI_API_KEY`, fallback Lovable Gateway

3. **`src/pages/DeckEditor.tsx`**
   - Thêm state: `batchGenerating`, `batchProgress`, `batchTotal`, `batchCancelled`
   - Thêm hàm `generateAllImages()`: lọc slide chua co anh, goi tuan tu, cap nhat state
   - Thêm nút "Tạo tất cả ảnh" với icon và progress indicator
   - Ref `batchCancelledRef` để cho phép hủy giữa chừng

## Kết quả mong đợi
- Tất cả 6 edge function AI dùng Google Gemini API trực tiếp, không phụ thuộc credits Lovable
- Luồng tạo slide hoàn chỉnh: Nội dung -> Cấu trúc -> Ảnh (tự động batch)
- Trải nghiệm người dùng liền mạch hơn
