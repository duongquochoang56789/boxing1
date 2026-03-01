import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, FileText, X, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail_emoji: string;
  accent_color: string;
  slide_count: number;
  slides: any[];
  is_featured: boolean;
}

const CATEGORIES = [
  { id: "all", label: "Tất cả", emoji: "🔥" },
  { id: "business", label: "Kinh doanh", emoji: "💼" },
  { id: "education", label: "Giáo dục", emoji: "🎓" },
  { id: "marketing", label: "Marketing", emoji: "📣" },
  { id: "technology", label: "Công nghệ", emoji: "💻" },
  { id: "creative", label: "Sáng tạo", emoji: "🎨" },
  { id: "general", label: "Tổng hợp", emoji: "📋" },
];

interface TemplateGalleryProps {
  onClose?: () => void;
}

const TemplateGallery = ({ onClose }: TemplateGalleryProps) => {
  const [category, setCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["slide-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("slide_templates" as any)
        .select("*")
        .order("is_featured", { ascending: false })
        .order("name");
      if (error) throw error;
      return (data as any[]) as SlideTemplate[];
    },
  });

  const filtered = category === "all"
    ? templates
    : templates.filter((t) => t.category === category);

  const handleUseTemplate = async (template: SlideTemplate) => {
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
        return;
      }

      // Create deck
      const { data: deck, error: deckErr } = await supabase
        .from("decks")
        .insert({
          title: template.name,
          description: template.description,
          user_id: user.id,
          slide_count: template.slides.length,
        })
        .select("id")
        .single();
      if (deckErr) throw deckErr;

      // Insert slides
      const slidesInsert = template.slides.map((s: any, i: number) => ({
        deck_id: deck.id,
        slide_order: i + 1,
        title: s.title || "Slide",
        subtitle: s.subtitle || null,
        content: s.content || "",
        layout: s.layout || "two-column",
        background_color: s.background_color || "#1a1a2e",
        section_name: s.section_name || "content",
        image_url: s.image_url || null,
        image_prompt: s.image_prompt || null,
      }));

      const { error: slideErr } = await supabase.from("deck_slides").insert(slidesInsert);
      if (slideErr) throw slideErr;

      toast({ title: `Đã tạo deck từ mẫu "${template.name}"` });
      navigate(`/slides/${deck.id}`);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Lỗi khi tạo deck", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.id
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.button
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                onClick={() => setSelectedTemplate(t)}
                className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 overflow-hidden transition-all text-left"
              >
                {/* Thumbnail area */}
                <div
                  className="aspect-[16/10] flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${t.accent_color}15, ${t.accent_color}05)`,
                  }}
                >
                  <span className="text-5xl">{t.thumbnail_emoji}</span>
                  {t.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-orange-500/80 text-white text-[10px] border-0">
                      ⭐ Nổi bật
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h3 className="text-white text-sm font-semibold truncate group-hover:text-orange-300 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-white/30 text-[10px] flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {t.slide_count} slides
                    </span>
                    <span className="text-white/20 text-[10px] capitalize">{t.category}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 text-white/30">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Không có mẫu nào trong danh mục này</p>
        </div>
      )}

      {/* Template detail modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-6 flex items-start gap-4"
                style={{
                  background: `linear-gradient(135deg, ${selectedTemplate.accent_color}20, transparent)`,
                }}
              >
                <span className="text-5xl">{selectedTemplate.thumbnail_emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white text-xl font-bold">{selectedTemplate.name}</h2>
                  <p className="text-white/50 text-sm mt-1">{selectedTemplate.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                      <Layers className="w-3 h-3 mr-1" /> {selectedTemplate.slide_count} slides
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white/60 text-xs capitalize">
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slide preview list */}
              <div className="px-6 pb-3 max-h-[240px] overflow-y-auto space-y-1.5">
                <p className="text-white/30 text-xs font-medium mb-2">Cấu trúc slides:</p>
                {selectedTemplate.slides.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
                    <span className="text-white/30 text-xs font-mono w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{s.title}</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-white/30 text-[10px]">
                      {s.layout}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-6 pt-4 border-t border-white/5 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-white/60 hover:bg-white/5"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  disabled={creating}
                >
                  {creating ? (
                    "Đang tạo..."
                  ) : (
                    <>
                      Sử dụng mẫu này
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateGallery;
