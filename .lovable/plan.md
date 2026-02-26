
Mục tiêu lần này là xử lý dứt điểm tình trạng “không đăng nhập được” và tách bạch rõ lỗi “không tạo được slide” để tránh nhầm là lỗi đăng nhập.

1) Kết quả kiểm tra hiện tại (đã đối chiếu code + backend logs)
- Luồng backend xác thực đang hoạt động: có bản ghi `/user` trả về 200 (đã có session hợp lệ).
- Tài khoản demo `admin@flyfit.vn` vẫn tồn tại, đã xác nhận email, có role `admin` + `member`.
- Lỗi tạo slide hiện thấy là `POST generate-deck -> 402` (hết credits AI), không phải 401 auth.
- Session replay tại thời điểm user báo lỗi chỉ thấy loader quay liên tục (dấu hiệu có thể bị kẹt trạng thái loading ở lớp bảo vệ route).

2) Nhận định nguyên nhân gốc cần xử lý
- Nguyên nhân A (ưu tiên cao): `useAuth` có thể kẹt `loading=true` trong một số tình huống promise reject/chậm mạng vì callback auth chưa được “harden” đủ (thiếu `try/catch/finally` toàn luồng).
- Nguyên nhân B (đã xác nhận): tạo slide thất bại vì credits AI (402), nhưng UI hiện báo chung chung, làm user hiểu là chưa đăng nhập.
- Nguyên nhân C: thiếu phân loại lỗi rõ ràng giữa “đăng nhập thất bại”, “phiên hết hạn”, “hết credits”, “quá nhiều yêu cầu”.

3) Kế hoạch sửa toàn diện (theo thứ tự triển khai)
Bước 1 — Ổn định luồng đăng nhập, chống kẹt loader
- Refactor `src/hooks/useAuth.tsx`:
  - Tách hàm kiểm tra role admin riêng, có `try/catch`, luôn trả về boolean an toàn.
  - Bọc cả nhánh `onAuthStateChange` và `getSession` bằng `try/catch/finally` để luôn `setLoading(false)` dù lỗi mạng.
  - Không để callback auth bị phụ thuộc vào await dài; cập nhật `user/session` trước, kiểm tra role bất đồng bộ an toàn sau.
  - Thêm fallback timeout (ví dụ 8–10s) để tránh treo vô hạn ở ProtectedRoute.
- Kết quả mong đợi: user không còn bị đứng ở màn hình loader khi auth bị chập chờn.

Bước 2 — Làm rõ lỗi đăng nhập trên UI
- Cập nhật `src/pages/Auth.tsx`:
  - Chuẩn hóa thông báo cho các nhóm lỗi: sai email/mật khẩu, tài khoản chưa xác nhận, giới hạn tần suất, lỗi mạng.
  - Ưu tiên điều hướng theo `from` route (nếu user bị chặn ở `/slides/new` thì login xong quay lại đúng màn đó).
  - Giữ nút demo login nhưng thông báo lỗi cụ thể hơn để user biết là credential hay mạng.

Bước 3 — Tách lỗi tạo slide khỏi lỗi auth
- Cập nhật `src/pages/SlideBuilder.tsx`:
  - Parse chi tiết lỗi từ function: 401/403 => yêu cầu đăng nhập lại; 402 => hết credits; 429 => quá tải.
  - Hiển thị toast đúng nguyên nhân, không dùng một thông báo “Không thể tạo slide” chung cho mọi trường hợp.
- Kết quả mong đợi: user biết chính xác đang thiếu đăng nhập hay thiếu credits.

Bước 4 — Tăng khả năng thành công khi credits thấp (backend function)
- Cập nhật `supabase/functions/generate-deck/index.ts`:
  - Giữ xác thực `getUser()` như hiện tại.
  - Bổ sung logging có cấu trúc theo từng nhánh lỗi (401/402/429/500) để lần sau truy vết nhanh.
  - (Tùy chọn) fallback model rẻ hơn khi model chính trả 402; nếu vẫn 402 thì trả thông báo rõ ràng.
- Kết quả mong đợi: giảm tỷ lệ fail do hạn mức thấp và dễ debug hơn.

Bước 5 — Rà soát bảo mật và phân quyền (không thay đổi mô hình role)
- Giữ role ở bảng `user_roles` riêng, không đưa role vào profile/users.
- Kiểm tra truy vấn role phía client chỉ phục vụ hiển thị; các hành động nhạy cảm vẫn kiểm tra ở backend/RLS.
- Không dùng localStorage/hardcode để quyết định quyền admin.

4) Kế hoạch kiểm thử end-to-end (bắt buộc)
- Test 1: vào `/slides/new` khi chưa login -> bị chuyển `/auth`.
- Test 2: login đúng -> quay về đúng route trước đó, không treo loader.
- Test 3: login sai mật khẩu -> báo lỗi đúng, không redirect sai.
- Test 4: vào `/slides/new`, bấm tạo slide:
  - Nếu hết credits -> hiện đúng thông báo credits.
  - Nếu đủ điều kiện -> tạo deck thành công và chuyển sang editor.
- Test 5: refresh trình duyệt ở route protected -> vẫn giữ session ổn định.
- Test 6: kiểm tra console/network không còn lỗi runtime liên quan auth loop.

5) File dự kiến chỉnh sửa
- `src/hooks/useAuth.tsx` (harden auth state + timeout fallback)
- `src/pages/Auth.tsx` (thông báo lỗi + redirect theo from)
- `src/pages/SlideBuilder.tsx` (phân loại lỗi invoke function)
- `supabase/functions/generate-deck/index.ts` (logging + fallback chiến lược khi cần)

6) Tiêu chí hoàn tất
- User đăng nhập được ổn định, không còn màn hình loader treo.
- User phân biệt được rõ lỗi auth và lỗi credits.
- Tạo slide không còn “mập mờ lỗi”; hoặc thành công, hoặc báo đúng nguyên nhân hành động tiếp theo.
