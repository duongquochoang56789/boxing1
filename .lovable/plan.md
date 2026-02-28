
# Chuyển generate-deck sang Google Gemini API trực tiếp

## Vấn đề
Edge function `generate-deck` hiện chỉ gọi qua Lovable AI Gateway (`LOVABLE_API_KEY`), dẫn đến lỗi 402 khi hết credits workspace. Bạn đã cung cấp `GOOGLE_GEMINI_API_KEY` nhưng function chưa sử dụng nó.

## Giải pháp
Refactor edge function để ưu tiên dùng `GOOGLE_GEMINI_API_KEY` gọi trực tiếp Google Gemini API. Chỉ fallback sang Lovable Gateway nếu không có key riêng.

## Chi tiết kỹ thuật

### Thay đổi file: `supabase/functions/generate-deck/index.ts`

1. **Thêm hàm gọi Google Gemini trực tiếp**
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=GOOGLE_GEMINI_API_KEY`
   - Format request body theo Gemini REST API (dùng `contents` thay vì `messages`)
   - Parse response từ format Gemini (`candidates[0].content.parts[0].text`)

2. **Logic ưu tiên**
   - Kiểm tra `GOOGLE_GEMINI_API_KEY` trước
   - Nếu có: gọi trực tiếp Google Gemini API (không tốn credits Lovable)
   - Nếu không có: fallback sang Lovable AI Gateway như cũ

3. **Fallback model cho Gemini trực tiếp**
   - Model chính: `gemini-2.5-flash`
   - Fallback: `gemini-2.5-flash-lite` (nếu model chính lỗi)

4. **Giữ nguyên toàn bộ logic còn lại**
   - Auth check, JSON parsing, slide validation, DB insert -- không thay đổi

### Thay đổi file: `src/pages/SlideBuilder.tsx`
- Không cần thay đổi -- error handling hiện tại đã đủ tốt

## Kết quả mong đợi
- Tạo slide dùng quota Google Gemini riêng của bạn, không phụ thuộc credits Lovable
- Hết lỗi 402
- Không ảnh hưởng các function khác vẫn dùng Lovable Gateway
