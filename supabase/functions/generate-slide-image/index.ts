import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Call Gemini direct for image generation
async function callGeminiImageDirect(apiKey: string, prompt: string): Promise<{ base64: string } | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const errText = await response.text();
    console.error(`[generate-slide-image] Gemini direct error: ${status}`, errText);
    if (status === 429) throw new Error("RATE_LIMIT");
    if (status === 402) throw new Error("PAYMENT_REQUIRED");
    return null;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return { base64: part.inlineData.data };
    }
  }
  return null;
}

// Call Lovable Gateway for image generation (fallback)
async function callLovableGatewayImage(apiKey: string, prompt: string): Promise<{ base64: string } | null> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const errText = await response.text();
    console.error(`[generate-slide-image] Gateway error: ${status}`, errText);
    if (status === 429) throw new Error("RATE_LIMIT");
    if (status === 402) throw new Error("PAYMENT_REQUIRED");
    return null;
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!imageUrl) return null;

  // Extract base64 from data URL
  const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
  return { base64: base64Data };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slideId, imagePrompt } = await req.json();

    if (!slideId || !imagePrompt) {
      return new Response(JSON.stringify({ error: "slideId and imagePrompt are required" }), {
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

    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!GEMINI_API_KEY && !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullPrompt = `Generate a professional presentation slide illustration: ${imagePrompt}. Style: clean, modern, corporate, high quality. No text overlay.`;

    let imageResult: { base64: string } | null = null;

    try {
      // Try Gemini direct first
      if (GEMINI_API_KEY) {
        console.log("[generate-slide-image] Trying Gemini direct...");
        imageResult = await callGeminiImageDirect(GEMINI_API_KEY, fullPrompt);
      }

      // Fallback to Lovable Gateway
      if (!imageResult && LOVABLE_API_KEY) {
        console.log("[generate-slide-image] Falling back to Lovable Gateway...");
        imageResult = await callLovableGatewayImage(LOVABLE_API_KEY, fullPrompt);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "RATE_LIMIT") {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg === "PAYMENT_REQUIRED") {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }

    if (!imageResult) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upload base64 image to storage
    const binaryData = Uint8Array.from(atob(imageResult.base64), (c) => c.charCodeAt(0));
    const fileName = `${slideId}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("deck-assets")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("deck-assets").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Update slide with image URL
    const { error: updateError } = await supabase
      .from("deck_slides")
      .update({ image_url: publicUrl })
      .eq("id", slideId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update slide" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, imageUrl: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-slide-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
