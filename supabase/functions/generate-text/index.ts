import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STYLE_GUIDE = `
Bạn là copywriter chuyên nghiệp cho một phòng tập gym/wellness cao cấp tại Việt Nam tên "EliteFit".
Phong cách viết:
- Tiếng Việt tự nhiên, tinh tế, sang trọng
- Ngắn gọn, súc tích, tránh sáo rỗng
- Tông giọng: ấm áp, chuyên nghiệp, truyền cảm hứng
- Phù hợp phong cách minimalist luxury (tương tự Pilates Circles by Cult)
- Tránh dùng từ ngữ quá phổ biến hoặc clichê
- Tập trung vào cảm xúc và trải nghiệm, không chỉ tính năng
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { section, keys, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const prompt = `${STYLE_GUIDE}

Section: ${section}
Context: ${context || "Landing page cho phòng tập gym/wellness cao cấp"}

Hãy tạo nội dung tiếng Việt cho các key sau. Quy tắc BẮT BUỘC:
- Chỉ trả về JSON object hợp lệ, KHÔNG có markdown, KHÔNG có code block
- Mỗi value PHẢI ngắn gọn: label/heading <= 6 từ, description/title <= 15 từ
- KHÔNG được viết câu dài, KHÔNG giải thích, KHÔNG thêm bất kỳ text nào ngoài JSON
Keys: ${JSON.stringify(keys)}

Ví dụ format: {"label":"Tour our Space","heading_1":"Khám phá","heading_2":"không gian"}`;

    // Use gemini-2.0-flash for text - fast, reliable JSON output
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const errorText = await aiResponse.text();
      console.error("Gemini API error:", status, errorText);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Gemini API error: ${status} - ${errorText.substring(0, 300)}`);
    }

    const aiData = await aiResponse.json();
    let textContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Raw Gemini text response:", textContent.substring(0, 300));

    // Strip markdown code blocks if present
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) textContent = jsonMatch[1].trim();
    textContent = textContent.trim();

    let parsed: Record<string, string>;
    try {
      let raw = JSON.parse(textContent);
      // Handle if model returns an array wrapping the object
      if (Array.isArray(raw)) raw = raw[0];
      parsed = raw;
    } catch {
      console.error("Failed to parse Gemini response:", textContent.substring(0, 500));
      throw new Error("Gemini returned invalid JSON. Raw: " + textContent.substring(0, 200));
    }

    // Save each key to database
    const upserts = Object.entries(parsed).map(([key, value]) => ({
      section,
      content_type: "text",
      key,
      value: String(value),
    }));

    for (const item of upserts) {
      const { error } = await supabase
        .from("site_content")
        .upsert(item, { onConflict: "section,content_type,key" });
      if (error) console.error("DB upsert error:", error);
    }

    console.log(`Saved ${upserts.length} text items for section: ${section}`);

    return new Response(JSON.stringify({ content: parsed, section }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
