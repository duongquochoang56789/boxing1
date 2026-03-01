import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, industry, style, description } = await req.json();
    if (!name) throw new Error("Brand name is required");

    const apiKey = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY not configured");

    const prompt = `You are a brand identity expert. Generate a complete brand identity for:
Brand name: "${name}"
${industry ? `Industry: ${industry}` : ""}
${style ? `Design style: ${style}` : ""}
${description ? `Description: ${description}` : ""}

Return a JSON object with these exact fields:
- slogan: A catchy Vietnamese slogan (max 10 words)
- primary_color: Main brand color as HEX (e.g. "#C67A4B")
- secondary_color: Secondary color as HEX
- accent_color: Accent/highlight color as HEX  
- bg_color: Background color as HEX (light, readable)
- heading_font: A Google Font name for headings (e.g. "Playfair Display", "Montserrat")
- body_font: A Google Font name for body text (e.g. "Inter", "Open Sans")
- accent_font: A Google Font name for accent/labels (e.g. "Bebas Neue", "Oswald")
- logo_prompt: An English prompt to generate a minimalist logo for this brand (describe style, colors, shapes)

Colors must be harmonious and match the brand style. Fonts must be real Google Fonts.
Return ONLY the JSON object, no markdown or explanation.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", res.status, errText);
      throw new Error(`AI error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");

    const brandKit = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(brandKit), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-brand error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
