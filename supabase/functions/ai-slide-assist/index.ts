import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string) {
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "";
}

async function callLovableGateway(apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gateway error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, slideTitle, slideContent, slideNotes, deckTitle, layout, language = "vi" } = await req.json();

    if (!action || !["rewrite", "expand", "summarize", "notes"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langLabel = language === "vi" ? "tiếng Việt" : "English";

    const prompts: Record<string, { system: string; user: string }> = {
      rewrite: {
        system: `Bạn là chuyên gia viết nội dung slide thuyết trình. Viết lại nội dung slide cho chuyên nghiệp, súc tích hơn. Giữ nguyên format Markdown. Trả về CHỈ nội dung mới, không giải thích. Viết bằng ${langLabel}.`,
        user: `Deck: "${deckTitle}"\nSlide: "${slideTitle}"\nLayout: ${layout}\n\nNội dung hiện tại:\n${slideContent}\n\nViết lại nội dung này cho chuyên nghiệp và hấp dẫn hơn, phù hợp với layout "${layout}".`,
      },
      expand: {
        system: `Bạn là chuyên gia viết nội dung slide. Mở rộng nội dung slide bằng cách thêm chi tiết, dữ liệu, ví dụ cụ thể. Giữ format Markdown. Trả về CHỈ nội dung mới. Viết bằng ${langLabel}.`,
        user: `Deck: "${deckTitle}"\nSlide: "${slideTitle}"\nLayout: ${layout}\n\nNội dung hiện tại:\n${slideContent}\n\nMở rộng nội dung này, thêm chi tiết và ví dụ cụ thể. Phù hợp layout "${layout}".`,
      },
      summarize: {
        system: `Bạn là chuyên gia tóm tắt nội dung. Tóm tắt nội dung slide thành các bullet points ngắn gọn, dễ hiểu. Giữ format Markdown. Trả về CHỈ nội dung mới. Viết bằng ${langLabel}.`,
        user: `Deck: "${deckTitle}"\nSlide: "${slideTitle}"\nLayout: ${layout}\n\nNội dung hiện tại:\n${slideContent}\n\nTóm tắt thành các bullet points ngắn gọn, mỗi điểm không quá 1-2 dòng.`,
      },
      notes: {
        system: `Bạn là diễn giả chuyên nghiệp. Tạo ghi chú thuyết trình (speaker notes) cho slide này. Ghi chú nên bao gồm: điểm chính cần nhấn mạnh, cách mở đầu, dữ liệu bổ sung, và câu chuyển tiếp. Trả về CHỈ ghi chú, không giải thích. Viết bằng ${langLabel}.`,
        user: `Deck: "${deckTitle}"\nSlide: "${slideTitle}"\n\nNội dung slide:\n${slideContent}\n\nGhi chú hiện tại: ${slideNotes || "(chưa có)"}\n\nTạo ghi chú thuyết trình chi tiết cho slide này.`,
      },
    };

    const { system, user: userPrompt } = prompts[action];

    let result = "";
    const geminiKey = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (geminiKey) {
      try {
        result = await callGemini(geminiKey, system, userPrompt);
      } catch (e) {
        console.warn("Gemini direct failed, trying gateway:", e);
        if (lovableKey) {
          result = await callLovableGateway(lovableKey, system, userPrompt);
        } else throw e;
      }
    } else if (lovableKey) {
      result = await callLovableGateway(lovableKey, system, userPrompt);
    } else {
      throw new Error("No AI API key configured");
    }

    return new Response(JSON.stringify({ result: result.trim(), action }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("ai-slide-assist error:", e);
    const status = e.message?.includes("429") ? 429 : e.message?.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
