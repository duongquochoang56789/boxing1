import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SLIDES_DATA = [
  // PART 1: BRAND INTRODUCTION
  { slide_order: 1, title: "FLYFIT", subtitle: "Bay cao. Sống khoẻ.", content: "Nền tảng tập luyện trực tuyến nhóm nhỏ\nKết nối — Hiệu quả — Tiện lợi", layout: "cover", section_name: "brand", image_prompt: "A dramatic silhouette of a person doing yoga at sunrise, warm orange-golden tones, mountains in background, motivational fitness scene. Ultra high resolution 1920x1080 hero image." },
  { slide_order: 2, title: "Vấn đề thị trường", subtitle: "Tại sao người Việt không tập luyện?", content: "**70%** dân văn phòng không tập thể dục thường xuyên\n**85%** thiếu động lực duy trì sau 1 tháng\n**60%** không có thời gian đến phòng tập", layout: "stats", section_name: "brand", image_prompt: "Tired Vietnamese office worker sitting at desk late at night, stressed, dim office lighting, modern office. Infographic style photography. Ultra high resolution 1920x1080." },
  { slide_order: 3, title: "Insight khách hàng", subtitle: "Tiếng nói từ khách hàng mục tiêu", content: "\"Tôi muốn tập nhưng không biết bắt đầu từ đâu. Đến gym thì ngại, tập ở nhà thì không có ai hướng dẫn.\"\n\n— Nhân viên văn phòng, 28 tuổi, Quận 1, TP.HCM", layout: "quote", section_name: "brand", image_prompt: "Young Vietnamese woman sitting on couch looking at phone, contemplative expression, modern living room, warm soft lighting. Lifestyle portrait photography. Ultra high resolution 1920x1080." },
  { slide_order: 4, title: "Giải pháp FLYFIT", subtitle: "Tập tại nhà. Thay đổi thật.", content: "Mô hình **Small Group Virtual Training** 5-7 người\n\n✅ Huấn luyện viên theo dõi trực tiếp qua camera\n✅ Sửa tư thế realtime qua video call\n✅ Nhóm nhỏ = động lực lớn\n✅ Chỉ cần internet + 1m² = bắt đầu ngay", layout: "two-column", section_name: "brand", image_prompt: "Laptop screen showing online fitness class with 6 participants in small boxes, trainer smiling and coaching, bright modern room. Virtual training concept. Ultra high resolution 1920x1080." },
  { slide_order: 5, title: "Tầm nhìn & Sứ mệnh", subtitle: null, content: "🎯 **Tầm nhìn**\nMọi người Việt đều có thể sống khoẻ — không phụ thuộc vào phòng tập hay thời gian\n\n🚀 **Sứ mệnh**\nXoá bỏ rào cản tập luyện bằng công nghệ và cộng đồng", layout: "two-column", section_name: "brand", image_prompt: "Diverse group of Vietnamese people of different ages exercising together happily, outdoor park setting, warm morning light, community fitness. Ultra high resolution 1920x1080." },

  // PART 2: PRODUCTS & SERVICES
  { slide_order: 6, title: "Tổng quan dịch vụ", subtitle: "4 dịch vụ cốt lõi", content: "🏋️ **FLY Class** — Tập nhóm nhỏ 5-7 người\n🧘 **FLY Zen** — Yoga & Pilates\n🔥 **FLY Burn** — HIIT & Cardio\n🥗 **FLY Fuel** — Tư vấn dinh dưỡng", layout: "grid", section_name: "product", image_prompt: "Four fitness activity icons in modern flat design: group training, yoga, HIIT workout, healthy nutrition. Clean grid layout, warm gradient background. Ultra high resolution 1920x1080." },
  { slide_order: 7, title: "FLY Class — Nhóm nhỏ", subtitle: "Trải nghiệm phòng tập tại nhà", content: "👥 5-7 người mỗi lớp\n📹 Trainer theo dõi camera từng người\n🔧 Sửa tư thế trực tiếp qua video\n⏱️ 45-60 phút mỗi buổi\n📅 Lịch cố định, cam kết đều đặn", layout: "two-column", section_name: "product", image_prompt: "Fitness trainer looking at laptop screen with 6 video call participants working out at home, professional setup, warm lighting. Virtual group training concept. Ultra high resolution 1920x1080." },
  { slide_order: 8, title: "FLY Zen — Yoga & Pilates", subtitle: "Cân bằng thân tâm", content: "🧘 Giảm stress hiệu quả sau giờ làm\n🤸 Tăng linh hoạt, phù hợp người mới\n🌅 Buổi sáng 6:00 & buổi tối 20:00\n💆 Kết hợp thiền và thở", layout: "two-column", section_name: "product", image_prompt: "Vietnamese woman doing yoga in bright living room, morning sunlight streaming in, yoga mat on wooden floor, peaceful serene atmosphere. Lifestyle fitness photography. Ultra high resolution 1920x1080." },
  { slide_order: 9, title: "FLY Burn — HIIT & Cardio", subtitle: "Đốt mỡ tối đa trong 30 phút", content: "🔥 Đốt mỡ hiệu quả gấp 3 lần cardio thường\n⏱️ Chỉ 30 phút mỗi buổi\n🏠 Không cần dụng cụ\n⚡ Năng lượng cao, nhạc sôi động", layout: "two-column", section_name: "product", image_prompt: "Energetic person doing burpees in small apartment, dynamic action shot, warm vibrant lighting, motivational fitness scene. Ultra high resolution 1920x1080." },
  { slide_order: 10, title: "FLY Fuel — Dinh dưỡng", subtitle: "Ăn đúng. Sống khoẻ.", content: "🥗 Kế hoạch ăn cá nhân hoá\n📊 Theo dõi macro hàng ngày\n👩‍⚕️ Tư vấn 1-1 hàng tuần\n📱 Tracking qua app di động", layout: "two-column", section_name: "product", image_prompt: "Beautiful healthy meal prep with colorful vegetables, fruits, lean protein on modern kitchen counter, phone showing nutrition tracking app. Food photography warm tones. Ultra high resolution 1920x1080." },

  // PART 3: OPERATIONS MODEL
  { slide_order: 11, title: "Mô hình Hybrid", subtitle: "80% Online + 20% Offline", content: "🌐 **Online (80%)**\nTập qua Zoom, mọi lúc mọi nơi\nTrainer theo dõi trực tiếp\n\n🏢 **Offline (20%)**\nPhòng tập thuê 1-2 buổi/tháng\nKiểm tra kỹ thuật, teambuilding", layout: "two-column", section_name: "operations", image_prompt: "Split image: top half shows Zoom video call with fitness class, bottom half shows people training together in a real gym. Hybrid fitness model concept. Ultra high resolution 1920x1080." },
  { slide_order: 12, title: "Hành trình khách hàng", subtitle: "Từ quảng cáo đến thành viên trung thành", content: "📱 Quảng cáo → 🖥️ Landing Page → 📝 Form đăng ký → 💬 Tư vấn Zalo → ✅ Đăng ký → 🎯 Tập thử → 💳 Mua gói", layout: "timeline", section_name: "operations", image_prompt: "Beautiful horizontal flowchart with 7 steps, modern icons at each step, gradient blue-orange background, clean business infographic style. Ultra high resolution 1920x1080." },
  { slide_order: 13, title: "Lịch tập mẫu 1 tuần", subtitle: "Đa dạng lớp, linh hoạt giờ", content: "| | Sáng 6:00 | Trưa 12:00 | Tối 19:00 | Tối 20:30 |\n|---|---|---|---|---|\n| T2 | FLY Zen | — | FLY Class | FLY Burn |\n| T3 | — | FLY Burn | FLY Zen | — |\n| T4 | FLY Zen | — | FLY Class | FLY Burn |\n| T5 | — | FLY Class | FLY Zen | — |\n| T6 | FLY Burn | — | FLY Class | FLY Zen |\n| T7 | FLY Class | FLY Zen | — | — |\n| CN | FLY Zen | — | — | — |", layout: "table", section_name: "operations", image_prompt: "Beautiful weekly calendar design with colorful class schedules, modern flat design, warm color palette, fitness schedule infographic. Ultra high resolution 1920x1080." },
  { slide_order: 14, title: "Công nghệ & Platform", subtitle: "Hệ sinh thái số hoàn chỉnh", content: "🖥️ **Website** — Landing page & đặt lịch\n📊 **Dashboard** — Quản lý lớp & học viên\n💬 **Zalo OA** — Chăm sóc & thông báo\n📹 **Zoom** — Lớp học trực tuyến", layout: "grid", section_name: "operations", image_prompt: "Modern devices mockup showing fitness platform: laptop with dashboard, phone with Zalo app, tablet with class schedule. Clean tech presentation style. Ultra high resolution 1920x1080." },
  { slide_order: 15, title: "Trải nghiệm Offline", subtitle: "Kết nối thật — Kết quả thật", content: "📅 1-2 buổi/tháng tại phòng tập partner\n✅ Kiểm tra kỹ thuật trực tiếp\n🤝 Team building & networking\n📸 Check-in & chia sẻ cộng đồng", layout: "two-column", section_name: "operations", image_prompt: "Happy group of Vietnamese people training together in a modern gym, laughing, high-fiving, team spirit. Warm friendly atmosphere. Ultra high resolution 1920x1080." },

  // PART 4: MARKET & COMPETITION
  { slide_order: 16, title: "Quy mô thị trường", subtitle: "Fitness Việt Nam 2025", content: "🟢 **TAM** — $2.5 tỷ thị trường fitness VN\n🔵 **SAM** — $180 triệu fitness online\n🔴 **SOM** — $3.6 triệu (2,000 KH × 150k/tháng)\n\n📈 Tăng trưởng 25%/năm", layout: "stats", section_name: "market", image_prompt: "Three concentric circles infographic in gradient colors (green, blue, red), large numbers, modern business presentation style, dark background. Ultra high resolution 1920x1080." },
  { slide_order: 17, title: "Đối thủ cạnh tranh", subtitle: "FLYFIT ở đâu trên thị trường?", content: "| Tiêu chí | PT 1-1 | Gym truyền thống | App tự tập | **FLYFIT** |\n|---|---|---|---|---|\n| Giá/tháng | 3-8 triệu | 500k-1.5 triệu | 0-200k | **800k-2 triệu** |\n| Trainer trực tiếp | ✅ | ❌ | ❌ | **✅** |\n| Nhóm nhỏ | ❌ | ❌ | ❌ | **✅** |\n| Tập tại nhà | ❌ | ❌ | ✅ | **✅** |\n| Cộng đồng | ❌ | ✅ | ❌ | **✅** |", layout: "table", section_name: "market", image_prompt: "Modern comparison table with 4 columns, FLYFIT column highlighted in green, checkmarks and crosses, clean business infographic. Ultra high resolution 1920x1080." },
  { slide_order: 18, title: "Lợi thế cạnh tranh", subtitle: "5 điểm khác biệt của FLYFIT", content: "💰 **Giá hợp lý** — Bằng 1/5 PT 1-1\n👥 **Nhóm nhỏ** — 5-7 người, không đông đúc\n📹 **Trainer trực tiếp** — Theo dõi & sửa realtime\n🔄 **Hybrid** — Online chủ đạo + Offline bổ trợ\n❤️ **Cộng đồng** — Gắn kết, động viên lẫn nhau", layout: "grid", section_name: "market", image_prompt: "Five bold icons on gradient background representing: price tag, small group, video camera, hybrid arrows, heart community. Modern flat design. Ultra high resolution 1920x1080." },
  { slide_order: 19, title: "Đối tượng chi tiết", subtitle: "2 Persona khách hàng mục tiêu", content: "👩 **Linh — NV Văn phòng 28 tuổi**\nQuận 1, TP.HCM | Thu nhập 15-25 triệu\nMuốn giảm cân nhưng ngại đến gym\nDùng TikTok & Instagram hàng ngày\n\n👨 **Minh — Freelancer 35 tuổi**\nQuận 7, TP.HCM | Thu nhập 20-40 triệu\nLàm việc tại nhà, ít vận động\nƯu tiên sức khoẻ, sẵn sàng đầu tư", layout: "persona", section_name: "market", image_prompt: "Two professional portrait cards side by side: young Vietnamese woman office worker and Vietnamese man freelancer, modern clean design, warm tones. Ultra high resolution 1920x1080." },
  { slide_order: 20, title: "Xu hướng thị trường", subtitle: "3 xu hướng định hình tương lai", content: "📈 **Online fitness tăng 300%** sau 2020\nNgười tiêu dùng quen với tập online\n\n🔄 **Hybrid là tương lai**\nKết hợp online + offline = trải nghiệm tốt nhất\n\n👥 **Gen Z thích cộng đồng**\nTập một mình = bỏ cuộc, tập cùng nhóm = bền vững", layout: "grid", section_name: "market", image_prompt: "Three trend cards with upward arrows and growth charts, modern gradient colors, business presentation style. Ultra high resolution 1920x1080." },

  // PART 5: FINANCE & BUSINESS
  { slide_order: 21, title: "Bảng giá 3 gói", subtitle: "Linh hoạt — Không hợp đồng dài hạn", content: "🟢 **FLY Starter — 800.000đ/tháng**\n8 buổi/tháng | FLY Class hoặc FLY Zen\n\n⭐ **FLY Plus — 1.200.000đ/tháng** *(Phổ biến)*\n12 buổi/tháng | Tất cả lớp | 1 buổi offline\n\n💎 **FLY Unlimited — 2.000.000đ/tháng**\nKhông giới hạn buổi | FLY Fuel | 2 buổi offline", layout: "pricing", section_name: "finance", image_prompt: "Three pricing cards with gradient backgrounds, middle card largest and highlighted with star badge, modern SaaS pricing design, warm color palette. Ultra high resolution 1920x1080." },
  { slide_order: 22, title: "Unit Economics", subtitle: "Các chỉ số kinh doanh cốt lõi", content: "💰 **CAC** (Chi phí có KH) — 150.000đ\n📊 **LTV** (Giá trị vòng đời) — 7.200.000đ\n📈 **LTV/CAC** — 48x\n💵 **Margin** — 65%\n⏰ **Break-even** — Tháng 4 (50 KH)\n🏷️ **Doanh thu/trainer/giờ** — 350.000đ", layout: "stats", section_name: "finance", image_prompt: "Clean business metrics dashboard with large numbers, simple bar chart, modern dark background with accent colors. Financial infographic. Ultra high resolution 1920x1080." },
  { slide_order: 23, title: "Dự báo doanh thu", subtitle: "12 tháng đầu tiên", content: "| Tháng | Khách hàng | Doanh thu | Chi phí | Lãi/Lỗ |\n|---|---|---|---|---|\n| T1-T3 | 30→80 | 36-96 tr | 60 tr/tháng | -24→+36 tr |\n| T4-T6 | 80→150 | 96-180 tr | 80 tr/tháng | +16→+100 tr |\n| T7-T9 | 150→300 | 180-360 tr | 120 tr/tháng | +60→+240 tr |\n| T10-T12 | 300→500 | 360-600 tr | 180 tr/tháng | +180→+420 tr |", layout: "chart", section_name: "finance", image_prompt: "Line chart showing revenue growth over 12 months, upward trend with milestone markers, modern business presentation, dark background with glowing lines. Ultra high resolution 1920x1080." },
  { slide_order: 24, title: "Cấu trúc chi phí", subtitle: "Phân bổ chi phí hàng tháng", content: "👩‍🏫 **Lương Trainer** — 40%\n📢 **Marketing** — 25%\n💻 **Platform & Công nghệ** — 15%\n🏢 **Phòng tập Offline** — 10%\n📋 **Khác** — 10%", layout: "chart", section_name: "finance", image_prompt: "Beautiful pie chart with 5 segments in warm gradient colors, percentages displayed, clean modern business infographic, dark background. Ultra high resolution 1920x1080." },
  { slide_order: 25, title: "Kênh marketing", subtitle: "Chiến lược đa kênh", content: "📘 **Facebook Ads** — 40% ngân sách | ROI 3.5x\n💬 **Zalo OA** — 25% ngân sách | ROI 5x\n🎵 **TikTok** — 20% ngân sách | ROI 2.8x\n🤝 **Referral** — 15% ngân sách | ROI 8x", layout: "grid", section_name: "finance", image_prompt: "Four social media marketing cards with Facebook, Zalo, TikTok, and Referral icons, ROI numbers, modern gradient design. Ultra high resolution 1920x1080." },

  // PART 6: ROADMAP & CLOSING
  { slide_order: 26, title: "Lộ trình 2025", subtitle: "4 cột mốc quan trọng", content: "🟢 **Q1** — Launch + 50 KH đầu tiên\n🔵 **Q2** — 150 KH + App MVP\n🟡 **Q3** — 300 KH + Mở rộng HLV\n🔴 **Q4** — 500 KH + Break-even", layout: "timeline", section_name: "roadmap", image_prompt: "Horizontal timeline with 4 quarterly milestones, modern icons, gradient colors green-blue-yellow-red, business roadmap design. Ultra high resolution 1920x1080." },
  { slide_order: 27, title: "Lộ trình 2025-2028", subtitle: "Tầm nhìn dài hạn", content: "📱 **2025** — FLYFIT Online (nhóm nhỏ virtual)\n📲 **2026** — FLYFIT App (ứng dụng di động)\n🏢 **2027** — FLYFIT Studio (phòng tập boutique)\n🌟 **2028** — FLYFIT Lifestyle (thời trang, phụ kiện)", layout: "timeline", section_name: "roadmap", image_prompt: "Vertical roadmap with 4 years, each with illustration: laptop, phone app, studio building, lifestyle brand. Modern gradient design. Ultra high resolution 1920x1080." },
  { slide_order: 28, title: "Đội ngũ", subtitle: "Những người tạo nên FLYFIT", content: "👨‍💼 **Founder & CEO** — Chiến lược & vận hành\n👩‍🏫 **Head Trainer** — Xây dựng chương trình tập\n👨‍🏫 **Trainer Team** (2-3 người) — Dẫn lớp & hỗ trợ KH\n👩‍⚕️ **Chuyên gia dinh dưỡng** — Tư vấn FLY Fuel\n📢 **Marketing** — Content & quảng cáo", layout: "grid", section_name: "roadmap", image_prompt: "Team grid with 5 professional avatar cards, modern flat design, warm gradient background, startup team presentation. Ultra high resolution 1920x1080." },
  { slide_order: 29, title: "Lời kêu gọi hợp tác", subtitle: "Cùng nhau tạo ra sự thay đổi", content: "🤝 **Chúng tôi cần**\n— Vốn đầu tư seed: 500 triệu\n— Đối tác phòng tập offline\n— Trainer chất lượng cao\n\n🎁 **Đổi lại**\n— Cổ phần equity\n— Hoa hồng doanh thu\n— Cùng tăng trưởng bền vững", layout: "two-column", section_name: "roadmap", image_prompt: "Professional handshake icon with investment and growth symbols, clean modern business presentation, dark elegant background with gold accents. Ultra high resolution 1920x1080." },
  { slide_order: 30, title: "Cảm ơn!", subtitle: "Bay cao. Sống khoẻ.", content: "🌐 **Website:** flyfit.vn\n📧 **Email:** hello@flyfit.vn\n📞 **Hotline:** 1900 xxxx\n💬 **Zalo:** @flyfit.vn\n\nFLYFIT — Tập tại nhà. Thay đổi thật.", layout: "cover", section_name: "roadmap", image_prompt: "FLYFIT logo text on beautiful warm gradient background, minimal elegant design, sunrise colors orange-gold, professional brand closing slide. Ultra high resolution 1920x1080." },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "content"; // "content" = just insert slides, "images" = generate images for specific slides

    if (mode === "content") {
      // Clear existing slides
      await supabase.from("project_slides").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert all slides (without images)
      const slidesToInsert = SLIDES_DATA.map(s => ({
        slide_order: s.slide_order,
        title: s.title,
        subtitle: s.subtitle,
        content: s.content,
        layout: s.layout,
        section_name: s.section_name,
        image_prompt: s.image_prompt,
        background_color: "#1a1a2e",
      }));

      const { data: inserted, error: insertError } = await supabase
        .from("project_slides")
        .insert(slidesToInsert)
        .select();

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ success: true, mode: "content", slides: inserted!.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "images") {
      const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
      const slideId = body.slideId;
      
      if (!slideId) {
        // Get all slides without images
        const { data: slides } = await supabase
          .from("project_slides")
          .select("*")
          .is("image_url", null)
          .order("slide_order")
          .limit(3); // Process 3 at a time to avoid timeout

        if (!slides || slides.length === 0) {
          return new Response(JSON.stringify({ success: true, mode: "images", message: "All slides have images", remaining: 0 }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const results = [];
        for (const slide of slides) {
          try {
            const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${lovableApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-image",
                messages: [{ role: "user", content: slide.image_prompt }],
                modalities: ["image", "text"],
              }),
            });

            if (!imageResponse.ok) {
              console.error(`Image gen failed for slide ${slide.slide_order}: ${imageResponse.status}`);
              results.push({ slide_order: slide.slide_order, status: "failed" });
              continue;
            }

            const imageData = await imageResponse.json();
            const base64Url = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

            if (base64Url) {
              const base64Data = base64Url.split(",")[1];
              const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
              const fileName = `slide-${slide.slide_order}.png`;

              const { error: uploadError } = await supabase.storage
                .from("project-slides")
                .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

              if (uploadError) {
                console.error(`Upload failed for slide ${slide.slide_order}:`, uploadError);
                results.push({ slide_order: slide.slide_order, status: "upload_failed" });
                continue;
              }

              const { data: publicUrl } = supabase.storage.from("project-slides").getPublicUrl(fileName);
              await supabase.from("project_slides").update({ image_url: publicUrl.publicUrl }).eq("id", slide.id);
              results.push({ slide_order: slide.slide_order, status: "ok" });
            } else {
              results.push({ slide_order: slide.slide_order, status: "no_image_data" });
            }
          } catch (imgErr) {
            console.error(`Error for slide ${slide.slide_order}:`, imgErr);
            results.push({ slide_order: slide.slide_order, status: "error" });
          }
        }

        // Count remaining
        const { count } = await supabase
          .from("project_slides")
          .select("*", { count: "exact", head: true })
          .is("image_url", null);

        return new Response(JSON.stringify({ success: true, mode: "images", results, remaining: count || 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid mode. Use 'content' or 'images'" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-slides error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
