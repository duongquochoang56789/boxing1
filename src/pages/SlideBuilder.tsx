import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Presentation, Globe, Hash, Palette, Zap } from "lucide-react";
import { BrandedLoader } from "@/components/ui/branded-loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SlideBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState("15");
  const [language, setLanguage] = useState("vi");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      toast({ title: "Vui lòng nhập chủ đề (ít nhất 3 ký tự)", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-deck", {
        body: { prompt: prompt.trim(), slideCount: parseInt(slideCount), language, tone },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: `Đã tạo ${data.slideCount} slides thành công!` });
      navigate(`/slides/${data.deckId}`);
    } catch (err: any) {
      console.error("Generate deck error:", err);
      
      // Try to extract the actual error body from FunctionsHttpError
      let errorMsg = "";
      let httpStatus = 0;
      try {
        if (err?.context && typeof err.context.json === "function") {
          const body = await err.context.json();
          errorMsg = (body?.error || "").toLowerCase();
        }
      } catch { /* ignore parse errors */ }
      
      if (!errorMsg) {
        errorMsg = (err.message || "").toLowerCase();
      }
      
      // Check error name for FunctionsHttpError pattern
      const isHttpError = err?.name === "FunctionsHttpError";
      
      if (errorMsg.includes("unauthorized") || errorMsg.includes("401")) {
        toast({ title: "Phiên đăng nhập hết hạn", description: "Vui lòng đăng nhập lại để tiếp tục.", variant: "destructive" });
      } else if (errorMsg.includes("credit") || errorMsg.includes("402") || errorMsg.includes("hết credit")) {
        toast({ title: "Hết credits AI", description: "Credits AI đã hết. Vui lòng liên hệ admin hoặc đợi reset.", variant: "destructive" });
      } else if (errorMsg.includes("429") || errorMsg.includes("quá nhiều") || errorMsg.includes("rate")) {
        toast({ title: "Quá nhiều yêu cầu", description: "Vui lòng đợi 30 giây rồi thử lại.", variant: "destructive" });
      } else {
        toast({ title: "Không thể tạo slide", description: errorMsg || err.message || "Vui lòng thử lại", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link to="/slides" className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-white font-bold text-xl">FLY<span className="text-orange-400">FIT</span></span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 text-sm">AI Slide Builder</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 rounded-full text-orange-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Tạo Slide Deck <span className="text-orange-400">tự động</span>
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto">
              Nhập chủ đề, AI sẽ tạo bộ slide thuyết trình hoàn chỉnh với nội dung và layout phù hợp.
            </p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Kế hoạch kinh doanh quán cà phê ở Quận 1, TP.HCM..."
              className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg resize-none focus:border-orange-400/50"
              disabled={loading}
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white/50 text-sm flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> Số slide
              </label>
              <Select value={slideCount} onValueChange={setSlideCount} disabled={loading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 slides</SelectItem>
                  <SelectItem value="15">15 slides</SelectItem>
                  <SelectItem value="20">20 slides</SelectItem>
                  <SelectItem value="30">30 slides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white/50 text-sm flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Ngôn ngữ
              </label>
              <Select value={language} onValueChange={setLanguage} disabled={loading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white/50 text-sm flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Phong cách
              </label>
              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                  <SelectItem value="creative">Sáng tạo</SelectItem>
                  <SelectItem value="simple">Đơn giản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-xl transition-all"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tạo slide... (30-60 giây)
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Presentation className="w-5 h-5" />
                Tạo Slide Deck
              </span>
            )}
          </Button>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <BrandedLoader size="md" message={`AI đang tạo nội dung cho ${slideCount} slides...`} showProgress variant="inline" />
            </motion.div>
          )}

          {/* Template Suggestions */}
          {!loading && !prompt && (
            <div className="space-y-3">
              <p className="text-white/30 text-sm text-center">Hoặc chọn nhanh một chủ đề:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { emoji: "🚀", label: "Kế hoạch kinh doanh startup" },
                  { emoji: "📊", label: "Báo cáo tài chính quý" },
                  { emoji: "🎯", label: "Giới thiệu sản phẩm mới" },
                  { emoji: "📋", label: "Đề xuất dự án đầu tư" },
                  { emoji: "📈", label: "Phân tích thị trường" },
                  { emoji: "🎓", label: "Bài giảng đào tạo nội bộ" },
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setPrompt(t.label)}
                    className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm hover:bg-white/10 hover:border-orange-400/30 hover:text-white transition-all text-left"
                  >
                    <span className="text-lg">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SlideBuilder;
