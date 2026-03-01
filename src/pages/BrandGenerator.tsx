import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BrandForm from "@/components/brand/BrandForm";
import BrandPreview from "@/components/brand/BrandPreview";
import { exportBrandPdf } from "@/components/brand/BrandPdfExport";

interface BrandKit {
  name: string;
  slogan: string;
  logo_url: string | null;
  logo_prompt: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  heading_font: string;
  body_font: string;
  accent_font: string;
}

const BrandGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [brand, setBrand] = useState<BrandKit | null>(null);

  const handleGenerate = async (input: { name: string; industry: string; style: string; description: string }) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-brand", { body: input });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setBrand({
        name: input.name,
        slogan: data.slogan || "",
        logo_url: null,
        logo_prompt: data.logo_prompt || null,
        primary_color: data.primary_color || "#C67A4B",
        secondary_color: data.secondary_color || "#2D2D2D",
        accent_color: data.accent_color || "#8B9E82",
        bg_color: data.bg_color || "#FAF3EB",
        heading_font: data.heading_font || "Cormorant Garamond",
        body_font: data.body_font || "Be Vietnam Pro",
        accent_font: data.accent_font || "Bebas Neue",
      });
      toast({ title: "Đã tạo Brand Kit!" });
    } catch (e: any) {
      toast({ title: "Lỗi: " + (e.message || "Unknown"), variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleUpdateField = (field: keyof BrandKit, value: string) => {
    if (!brand) return;
    setBrand({ ...brand, [field]: value });
  };

  const handleGenerateLogo = async () => {
    if (!brand?.logo_prompt) {
      toast({ title: "Không có logo prompt", variant: "destructive" });
      return;
    }
    setGeneratingLogo(true);
    try {
      // Reuse generate-slide-image with a custom prompt
      const { data, error } = await supabase.functions.invoke("generate-slide-image", {
        body: { slideId: "brand-logo", imagePrompt: `Minimalist professional logo: ${brand.logo_prompt}. White background, clean vector style, no text.` },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setBrand({ ...brand, logo_url: data.imageUrl });
        toast({ title: "Đã tạo logo!" });
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast({ title: "Lỗi tạo logo: " + (e.message || "Unknown"), variant: "destructive" });
    }
    setGeneratingLogo(false);
  };

  const handleSave = async () => {
    if (!brand) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      const { error } = await supabase.from("brand_kits").insert({
        user_id: user.id,
        name: brand.name,
        slogan: brand.slogan,
        logo_url: brand.logo_url,
        logo_prompt: brand.logo_prompt,
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        accent_color: brand.accent_color,
        bg_color: brand.bg_color,
        heading_font: brand.heading_font,
        body_font: brand.body_font,
        accent_font: brand.accent_font,
      });
      if (error) throw error;
      toast({ title: "Đã lưu Brand Kit thành công!" });
    } catch (e: any) {
      toast({ title: "Lỗi lưu: " + (e.message || "Unknown"), variant: "destructive" });
    }
    setSaving(false);
  };

  const handleExportPdf = async () => {
    if (!brand) return;
    setExportingPdf(true);
    try {
      await exportBrandPdf(brand);
      toast({ title: "Đã xuất Brand Kit PDF!" });
    } catch (e: any) {
      toast({ title: "Lỗi xuất PDF: " + (e.message || "Unknown"), variant: "destructive" });
    }
    setExportingPdf(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-400" />
            <h1 className="text-lg font-bold">Brand Identity Generator</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-1">Mô tả thương hiệu</h2>
              <p className="text-white/40 text-sm mb-6">AI sẽ tạo bộ nhận diện hoàn chỉnh từ thông tin bạn cung cấp</p>
              <BrandForm onGenerate={handleGenerate} loading={generating} />
            </div>
          </motion.div>

          {/* Right: Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-1">Brand Kit Preview</h2>
              <p className="text-white/40 text-sm mb-6">Xem trước và chỉnh sửa bộ nhận diện</p>
              {brand ? (
                <BrandPreview
                  brand={brand}
                  onUpdate={handleUpdateField}
                  onSave={handleSave}
                  onGenerateLogo={handleGenerateLogo}
                  onExportPdf={handleExportPdf}
                  saving={saving}
                  generatingLogo={generatingLogo}
                  exportingPdf={exportingPdf}
                />
              ) : (
                <div className="text-center py-16 text-white/20">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Điền thông tin và bấm "Tạo Brand Kit" để bắt đầu</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandGenerator;
