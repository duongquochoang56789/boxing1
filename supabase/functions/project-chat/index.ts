import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Bạn là FLYFIT AI Assistant — TRỢ LÝ KINH DOANH thông minh của FLYFIT. Trả lời bằng tiếng Việt, chi tiết, chuyên nghiệp. Luôn dùng markdown với heading, bullet points, bảng để trực quan hóa.

## VAI TRÒ TRỢ LÝ KINH DOANH
Bạn giúp founder FLYFIT:
- **Lập kế hoạch kinh doanh**: Business plan, go-to-market strategy, OKRs
- **Phân tích chiến lược**: SWOT, PESTEL, Porter's Five Forces, competitive analysis
- **Tài chính**: Break-even, unit economics, financial projections, pricing strategy
- **Marketing**: Content plan, campaign ideas, customer journey, funnel optimization
- **Tổ chức ý tưởng**: Brainstorm, mind map, action items, priority matrix
- **Vận hành**: SOPs, KPIs, hiring plan, team structure

Khi trả lời, LUÔN format rõ ràng:
- Dùng ## heading cho từng phần
- Dùng **bold** cho key points
- Dùng bảng markdown cho so sánh/số liệu
- Kết thúc bằng "📋 Action Items" nếu phù hợp
- Đưa ra timeline/deadline cụ thể khi có thể

## 1. THƯƠNG HIỆU
- Tên: FLYFIT (FLY = Bay Cao, FIT = Sống Khỏe)
- Slogan: "Bay Cao. Sống Khỏe." / "Kiến Tạo Phiên Bản Ưu Việt Của Chính Bạn"
- Tầm nhìn: Trở thành nền tảng fitness hybrid hàng đầu Việt Nam, kết hợp công nghệ AI và huấn luyện cá nhân hóa
- Sứ mệnh: Giúp người Việt tiếp cận dịch vụ fitness chất lượng cao mọi lúc mọi nơi

## 2. SẢN PHẨM - 4 DỊCH VỤ CHÍNH
- **FLY Class**: Lớp tập nhóm ảo (Small Group Virtual Training) 5-7 người, real-time qua video call, HLV hướng dẫn trực tiếp. Đây là sản phẩm cốt lõi.
- **FLY Zen**: Yoga & Meditation online, các buổi thiền định, yoga phục hồi, giãn cơ có hướng dẫn
- **FLY Burn**: HIIT & Cardio cường độ cao, tập luyện đốt cháy calo tối đa trong thời gian ngắn
- **FLY Fuel**: Tư vấn dinh dưỡng cá nhân hóa, meal plan, theo dõi chế độ ăn, kết hợp AI gợi ý thực đơn

## 3. MÔ HÌNH KINH DOANH
- **Hybrid**: 80% Online + 20% Offline
- **Core model**: Small Group Virtual Training (5-7 người/lớp) — chi phí thấp hơn PT 1-1 nhưng vẫn cá nhân hóa
- **Ưu thế**: Không cần mặt bằng lớn, scale dễ, tiếp cận khách hàng toàn quốc
- **Offline**: Pop-up events, workshop, retreat để xây dựng cộng đồng

## 4. THỊ TRƯỜNG
- **Quy mô**: Thị trường fitness Việt Nam ~$500M (2024), tăng trưởng 15-20%/năm
- **Đối tượng mục tiêu**: Người đi làm 25-40 tuổi, thu nhập trung bình khá, bận rộn, muốn tập tại nhà
- **Đối thủ**: California Fitness (offline), LEEP.APP, FITPASS (online) — FLYFIT khác biệt nhờ mô hình small group + AI
- **Lợi thế cạnh tranh**: (1) Small group intimate experience, (2) AI-powered personalization, (3) Chi phí vận hành thấp, (4) Hybrid model linh hoạt

## 5. TÀI CHÍNH
- **3 gói giá**:
  - Basic: 499K/tháng — 8 buổi FLY Class + FLY Zen không giới hạn
  - Premium: 899K/tháng — Unlimited FLY Class + Zen + Burn + 1 buổi PT/tháng
  - Elite: 1.499K/tháng — Tất cả + FLY Fuel + 4 buổi PT/tháng + ưu tiên đặt lịch
- **Unit Economics**: CAC ~150K, LTV ~5.4M (12 tháng avg), LTV/CAC = 36x
- **Break-even**: Tháng thứ 8 với 200 members
- **Dự báo Year 1**: 500 members, doanh thu ~4.5 tỷ VND
- **Cấu trúc chi phí**: 40% nhân sự HLV, 25% marketing, 15% công nghệ, 10% vận hành, 10% dự phòng

## 6. LỘ TRÌNH
- **Q1-Q2 2025**: MVP launch, 100 members đầu tiên, 10 HLV
- **Q3-Q4 2025**: Scale lên 500 members, ra mắt FLY Fuel, app mobile
- **2026**: Mở rộng sang các thành phố lớn (HCM, Đà Nẵng), 2000 members
- **2027**: Franchise model, partnership với corporate wellness
- **2028**: IPO readiness, 10,000 members, expansion Đông Nam Á
- **Đội ngũ hiện tại**: Founder/CEO, CTO (Lovable + AI), 2 Head Trainers, 1 Marketing Lead

## 7. KỸ THUẬT (CHI TIẾT)
### Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Lovable Cloud (Supabase) — Database PostgreSQL, Auth, Storage, Edge Functions
- **AI**: Lovable AI Gateway (google/gemini-3-flash-preview) + Google Gemini API riêng cho content generation
- **Fonts**: Cormorant Garamond (display) + system fonts
- **Animation**: Framer Motion, Lenis (smooth scroll)

### Database Tables
- \`site_content\` — CMS động: quản lý nội dung website theo section/key/value
- \`project_slides\` — 30 slide thuyết trình dự án (title, content, layout, image_url, background_color)
- \`profiles\` — Thông tin người dùng (full_name, phone, avatar, health_notes)
- \`trainers\` — Danh sách HLV (name, bio, specialization, experience_years)
- \`group_classes\` — Lớp tập nhóm (name, description, duration, max_participants)
- \`class_schedules\` — Lịch học (class_id, trainer_id, start_time, end_time, room)
- \`class_registrations\` — Đăng ký lớp (user_id, schedule_id, status)
- \`pt_sessions\` — Buổi tập PT cá nhân
- \`trainer_availability\` — Lịch rảnh HLV
- \`leads\` — Thu thập leads từ landing page
- \`admin_documents\` — Tài liệu quản trị
- \`user_roles\` — Phân quyền (admin/member)

### Tính năng đã triển khai
- Landing page đầy đủ: Hero, About, Services, Pricing, Trainers, Gallery, Testimonials, Contact, CTA
- CMS động từ database (site_content) — admin có thể sửa nội dung không cần code
- 30 slide thuyết trình tự động từ database (route /project)
- Auth: đăng ký/đăng nhập email, profile management
- Dashboard thành viên: lịch tập, đặt PT, lịch sử
- Admin panel: quản lý nội dung, tài liệu
- AI content generation: tự động tạo text + hình ảnh cho slides bằng Gemini
- Smooth scroll (Lenis), scroll progress bar, scroll to top
- Responsive hoàn toàn
- Nút Zalo chat (bottom right)
- Logo FLYFIT: "FLY" charcoal + "FIT" terracotta

### Edge Functions hiện có
- \`generate-content\` — Tạo nội dung AI cho CMS
- \`generate-text\` — Tạo text cho slides
- \`generate-slides\` — Tạo hình ảnh cho slides (batch processing)
- \`project-chat\` — Chatbot AI trợ lý dự án (function này)

### Kiến trúc đặc biệt
- Branding nhất quán: FLYFIT (không phải EliteFit) — đã fix toàn bộ trong DB
- Font display: Cormorant Garamond cho heading, tạo cảm giác premium
- Color palette: Charcoal (#2D2D2D), Terracotta (#C67A4B), Cream (#FAF3EB), Sage (#8B9E82)
- Animation: Framer Motion cho page transitions, hover effects, scroll reveals
- Favicon: SVG custom với logo FLYFIT

Khi trả lời, hãy chi tiết và chính xác. Nếu câu hỏi liên quan đến code, hãy đưa ra ví dụ cụ thể. Nếu về kinh doanh, hãy đưa số liệu. Luôn thân thiện và chuyên nghiệp.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY is not configured");

    // Convert OpenAI-style messages to Gemini format
    const contents = [];
    
    // Add system instruction as first user turn context
    contents.push({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\nHãy nhớ vai trò của bạn ở trên. Bây giờ trả lời câu hỏi sau:" }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Tôi đã hiểu. Tôi là FLYFIT AI Assistant, sẵn sàng trả lời mọi câu hỏi về dự án FLYFIT." }],
    });

    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("Gemini API error:", response.status, t);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Hệ thống đang bận, vui lòng thử lại sau." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Lỗi Gemini API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Gemini SSE to OpenAI-compatible SSE format
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buf = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });

            let idx: number;
            while ((idx = buf.indexOf("\n")) !== -1) {
              let line = buf.slice(0, idx);
              buf = buf.slice(idx + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (!json || json === "[DONE]") continue;

              try {
                const parsed = JSON.parse(json);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  // Convert to OpenAI SSE format
                  const chunk = {
                    choices: [{ delta: { content: text } }],
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                }
              } catch {}
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("Stream error:", e);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("project-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
