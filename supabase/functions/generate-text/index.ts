import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STYLE_GUIDE = `
Bạn là copywriter chuyên nghiệp cho một phòng tập gym/wellness cao cấp tại Việt Nam.
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

Hãy tạo nội dung cho các key sau dưới dạng JSON object. Chỉ trả về JSON, không giải thích thêm:
${JSON.stringify(keys)}

Ví dụ format output:
${JSON.stringify(keys.reduce((acc: Record<string, string>, k: string) => { acc[k] = "nội dung mẫu"; return acc; }, {}))}
`;

    // Call Google Gemini API directly
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
          systemInstruction: {
            parts: [{ text: STYLE_GUIDE }],
          },
          generationConfig: {
            responseMimeType: "application/json",
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
      throw new Error(`Gemini API error: ${status}`);
    }

    const aiData = await aiResponse.json();
    let textContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) textContent = jsonMatch[1].trim();

    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      console.error("Failed to parse Gemini response:", textContent);
      throw new Error("Gemini returned invalid JSON");
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
