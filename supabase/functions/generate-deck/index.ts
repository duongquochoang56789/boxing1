import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Robust JSON extraction with truncation repair
function extractJsonArray(raw: string): any[] {
  // Strip markdown code blocks
  let cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // Find array boundaries
  const arrStart = cleaned.indexOf("[");
  if (arrStart === -1) throw new Error("No JSON array found");

  let arrEnd = cleaned.lastIndexOf("]");
  if (arrEnd === -1 || arrEnd <= arrStart) {
    // Truncated - try to repair
    console.warn("[generate-deck] JSON appears truncated, attempting repair...");
    cleaned = cleaned.substring(arrStart);
    // Remove trailing incomplete object
    const lastCompleteObj = cleaned.lastIndexOf("}");
    if (lastCompleteObj > 0) {
      cleaned = cleaned.substring(0, lastCompleteObj + 1);
      // Count brackets to close
      let brackets = 0;
      for (const ch of cleaned) {
        if (ch === "[") brackets++;
        if (ch === "]") brackets--;
      }
      while (brackets > 0) { cleaned += "]"; brackets--; }
    }
  } else {
    cleaned = cleaned.substring(arrStart, arrEnd + 1);
  }

  // Fix trailing commas and control chars
  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/[\x00-\x1F\x7F]/g, (ch) => ch === "\n" || ch === "\r" || ch === "\t" ? ch : "");

  return JSON.parse(cleaned);
}

// Call Google Gemini API directly
async function callGeminiDirect(apiKey: string, model: string, systemPrompt: string, userPrompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 30000 },
    }),
  });
}

// Call Lovable AI Gateway (OpenAI-compatible)
async function callLovableGateway(apiKey: string, model: string, systemPrompt: string, userPrompt: string) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
}

// Extract text content from either API format
async function extractTextContent(response: Response, isDirect: boolean): Promise<string> {
  const data = await response.json();
  if (isDirect) {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, slideCount = 15, language = "vi", tone = "professional" } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt is required (min 3 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    // Build prompt
    const langLabel = language === "vi" ? "tiếng Việt" : "English";
    const toneMap: Record<string, string> = {
      professional: "chuyên nghiệp, dữ liệu rõ ràng",
      creative: "sáng tạo, trực quan, nhiều emoji",
      simple: "đơn giản, dễ hiểu, súc tích",
    };
    const toneDesc = toneMap[tone] || toneMap.professional;

    const systemPrompt = `Bạn là chuyên gia tạo slide thuyết trình. Tạo chính xác ${slideCount} slide bằng ${langLabel}, phong cách ${toneDesc}.

Trả về CHỈNH xác một JSON array, mỗi phần tử gồm:
- slide_order (1-${slideCount})
- title (ngắn gọn, <60 ký tự)
- subtitle (nullable, <80 ký tự)
- content (markdown: emoji, bullet points, **bold**, bảng nếu cần)
- layout (chọn 1 trong: cover, two-column, stats, grid, table, timeline, quote, pricing, persona, chart, image-full, comparison)
- section_name (chọn 1 trong: brand, product, operations, market, finance, roadmap)
- image_prompt (mô tả ảnh bằng tiếng Anh, <200 từ, kết thúc bằng "Ultra high resolution 1920x1080.")

Quy tắc layout:
- Slide 1 và slide cuối: dùng 'cover'
- Slide có số liệu thống kê: dùng 'stats'
- Slide có bảng so sánh: dùng 'table'
- Slide có trích dẫn: dùng 'quote'
- Slide có giá/gói: dùng 'pricing'
- Slide có lộ trình/timeline: dùng 'timeline'
- Slide có chân dung khách hàng: dùng 'persona'
- Slide có biểu đồ: dùng 'chart'
- Slide có ảnh minh hoạ lớn, ấn tượng: dùng 'image-full'
- Slide so sánh 2 phương án/đối thủ: dùng 'comparison' (nội dung chia bằng dòng "VS")
- Còn lại: dùng 'two-column' hoặc 'grid'

CHỈ trả về JSON array, không có text khác.`;

    const userPrompt = `Tạo bộ slide thuyết trình về: ${prompt}`;

    // Determine which API to use
    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const useDirect = !!GEMINI_API_KEY;

    if (!GEMINI_API_KEY && !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const models = useDirect
      ? ["gemini-2.5-flash", "gemini-2.5-flash-lite"]
      : ["google/gemini-2.5-flash", "google/gemini-2.5-flash-lite"];

    let aiResponse: Response | null = null;
    const isDirect = useDirect;

    for (const model of models) {
      console.log(`[generate-deck] Trying ${useDirect ? "Gemini direct" : "Lovable Gateway"} model: ${model}`);

      aiResponse = useDirect
        ? await callGeminiDirect(GEMINI_API_KEY!, model, systemPrompt, userPrompt)
        : await callLovableGateway(LOVABLE_API_KEY!, model, systemPrompt, userPrompt);

      if (aiResponse.ok) {
        console.log(`[generate-deck] Success with model: ${model}`);
        break;
      }

      const status = aiResponse.status;
      console.warn(`[generate-deck] Model ${model} failed with status ${status}`);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (status === 402) {
        if (model !== models[models.length - 1]) continue;
        return new Response(JSON.stringify({ error: "Hết credits AI, vui lòng liên hệ admin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const errText = await aiResponse.text();
      console.error(`[generate-deck] AI error: ${status}`, errText);

      if (model !== models[models.length - 1]) continue;

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!aiResponse || !aiResponse.ok) {
      return new Response(JSON.stringify({ error: "All AI models failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawContent = await extractTextContent(aiResponse, isDirect);
    console.log(`[generate-deck] Raw response length: ${rawContent.length} chars`);

    // Parse with robust extraction
    let slides: any[];
    try {
      slides = extractJsonArray(rawContent);
    } catch (e) {
      console.error("Failed to parse AI response:", rawContent.substring(0, 500));
      return new Response(JSON.stringify({ error: "AI trả về định dạng không hợp lệ, vui lòng thử lại." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      return new Response(JSON.stringify({ error: "AI không tạo được slide, vui lòng thử lại." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[generate-deck] Parsed ${slides.length} slides successfully`);

    // Generate share slug & create deck
    const shareSlug = crypto.randomUUID().split("-")[0];

    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .insert({
        user_id: userId,
        title: prompt.substring(0, 100),
        description: prompt,
        slide_count: slides.length,
        share_slug: shareSlug,
      })
      .select("id")
      .single();

    if (deckError) {
      console.error("Deck insert error:", deckError);
      return new Response(JSON.stringify({ error: "Failed to create deck" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and insert slides
    const validLayouts = ["cover", "two-column", "stats", "grid", "table", "timeline", "quote", "pricing", "persona", "chart", "image-full", "comparison"];
    const validSections = ["brand", "product", "operations", "market", "finance", "roadmap"];

    const slidesToInsert = slides.map((s: any, i: number) => ({
      deck_id: deck.id,
      slide_order: s.slide_order || i + 1,
      title: String(s.title || `Slide ${i + 1}`).substring(0, 200),
      subtitle: s.subtitle ? String(s.subtitle).substring(0, 200) : null,
      content: String(s.content || ""),
      layout: validLayouts.includes(s.layout) ? s.layout : "two-column",
      section_name: validSections.includes(s.section_name) ? s.section_name : "brand",
      image_prompt: s.image_prompt ? String(s.image_prompt).substring(0, 500) : null,
      background_color: "#1a1a2e",
    }));

    const { error: slidesError } = await supabase
      .from("deck_slides")
      .insert(slidesToInsert);

    if (slidesError) {
      console.error("Slides insert error:", slidesError);
      await supabase.from("decks").delete().eq("id", deck.id);
      return new Response(JSON.stringify({ error: "Failed to save slides" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      deckId: deck.id,
      slideCount: slides.length,
      shareSlug,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("generate-deck error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
