import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Presentation, Globe, Hash, Palette } from "lucide-react";
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
      toast({
        title: "Không thể tạo slide",
        description: err.message || "Vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
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
              className="text-center text-white/40 text-sm"
            >
              AI đang phân tích chủ đề và tạo nội dung cho {slideCount} slides...
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SlideBuilder;
