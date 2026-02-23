import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import {
  Save, ArrowLeft, Presentation, Plus, Trash2, ChevronUp, ChevronDown, Loader2, Share2
} from "lucide-react";

interface DeckSlide {
  id: string;
  deck_id: string;
  slide_order: number;
  title: string;
  subtitle: string | null;
  content: string;
  layout: string;
  image_url: string | null;
  image_prompt: string | null;
  section_name: string;
  background_color: string;
  notes: string | null;
}

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const VALID_LAYOUTS = ["cover", "two-column", "stats", "grid", "table", "timeline", "quote", "pricing", "persona", "chart"];

const DeckEditor = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [deckTitle, setDeckTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load deck + slides
  useEffect(() => {
    if (!deckId) return;
    const load = async () => {
      const [deckRes, slidesRes] = await Promise.all([
        supabase.from("decks").select("*").eq("id", deckId).single(),
        supabase.from("deck_slides").select("*").eq("deck_id", deckId).order("slide_order"),
      ]);
      if (deckRes.error || slidesRes.error) {
        toast({ title: "Không tải được deck", variant: "destructive" });
        navigate("/slides/new");
        return;
      }
      setDeckTitle(deckRes.data.title);
      setSlides(slidesRes.data as DeckSlide[]);
      setLoading(false);
    };
    load();
  }, [deckId]);

  // Update preview scale
  useEffect(() => {
    const update = () => {
      if (!previewRef.current) return;
      const r = previewRef.current.getBoundingClientRect();
      setScale(Math.min(r.width / SLIDE_W, r.height / SLIDE_H));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slides, current]);

  const slide = slides[current];

  // Auto-save with debounce
  const triggerSave = useCallback((updated: DeckSlide) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from("deck_slides")
        .update({
          title: updated.title,
          subtitle: updated.subtitle,
          content: updated.content,
          layout: updated.layout,
          section_name: updated.section_name,
          notes: updated.notes,
        })
        .eq("id", updated.id);
      if (error) console.error("Auto-save error:", error);
    }, 2000);
  }, []);

  const updateSlide = (field: keyof DeckSlide, value: string | null) => {
    setSlides(prev => {
      const copy = [...prev];
      copy[current] = { ...copy[current], [field]: value };
      triggerSave(copy[current]);
      return copy;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const s of slides) {
        await supabase.from("deck_slides").update({
          title: s.title, subtitle: s.subtitle, content: s.content,
          layout: s.layout, section_name: s.section_name, notes: s.notes,
        }).eq("id", s.id);
      }
      toast({ title: "Đã lưu tất cả slides!" });
    } catch {
      toast({ title: "Lỗi khi lưu", variant: "destructive" });
    }
    setSaving(false);
  };

  const addSlide = async () => {
    if (!deckId) return;
    const newOrder = slides.length + 1;
    const { data, error } = await supabase.from("deck_slides").insert({
      deck_id: deckId,
      slide_order: newOrder,
      title: `Slide ${newOrder}`,
      content: "",
      layout: "two-column",
      section_name: "brand",
      background_color: "#1a1a2e",
    }).select().single();
    if (!error && data) {
      setSlides(prev => [...prev, data as DeckSlide]);
      setCurrent(slides.length);
    }
  };

  const deleteSlide = async () => {
    if (slides.length <= 1) return;
    const s = slides[current];
    await supabase.from("deck_slides").delete().eq("id", s.id);
    setSlides(prev => prev.filter((_, i) => i !== current));
    setCurrent(prev => Math.min(prev, slides.length - 2));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/slides/new" className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-white font-bold">FLY<span className="text-orange-400">FIT</span></span>
          <span className="text-white/40 text-sm truncate max-w-[200px]">{deckTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">{current + 1} / {slides.length}</span>
          <Button size="sm" variant="ghost" onClick={saveAll} disabled={saving} className="text-white/60 hover:text-white">
            <Save className="w-4 h-4 mr-1" /> {saving ? "..." : "Lưu"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/slides/${deckId}/present`)} className="text-white/60 hover:text-white">
            <Presentation className="w-4 h-4 mr-1" /> Trình chiếu
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail strip */}
        <div className="w-[120px] bg-[#0d0d0d] border-r border-white/10 overflow-y-auto shrink-0">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`w-full p-2 border-b border-white/5 transition-colors ${i === current ? "bg-orange-400/10 border-l-2 border-l-orange-400" : "hover:bg-white/5"}`}
            >
              <div className="aspect-video bg-[#1a1a2e] rounded overflow-hidden relative">
                <div style={{ width: SLIDE_W, height: SLIDE_H, transform: "scale(0.05)", transformOrigin: "top left" }}>
                  <SlideRenderer slide={s} />
                </div>
              </div>
              <span className="text-[10px] text-white/40 mt-1 block truncate">{i + 1}. {s.title}</span>
            </button>
          ))}
          <button onClick={addSlide} className="w-full p-3 text-white/30 hover:text-orange-400 hover:bg-white/5 transition-colors">
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Editor + Preview */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Markdown Editor */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full flex flex-col bg-[#0d0d0d]">
              <div className="px-4 py-3 border-b border-white/10 space-y-3">
                <input
                  value={slide?.title || ""}
                  onChange={(e) => updateSlide("title", e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg border-none outline-none placeholder:text-white/30"
                  placeholder="Tiêu đề slide..."
                />
                <input
                  value={slide?.subtitle || ""}
                  onChange={(e) => updateSlide("subtitle", e.target.value || null)}
                  className="w-full bg-transparent text-white/60 text-sm border-none outline-none placeholder:text-white/20"
                  placeholder="Phụ đề (tuỳ chọn)..."
                />
                <div className="flex gap-2">
                  <Select value={slide?.layout || "two-column"} onValueChange={(v) => updateSlide("layout", v)}>
                    <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_LAYOUTS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={slide?.section_name || "brand"} onValueChange={(v) => updateSlide("section_name", v)}>
                    <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["brand", "product", "operations", "market", "finance", "roadmap"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={deleteSlide} disabled={slides.length <= 1}
                    className="h-8 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 px-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <textarea
                value={slide?.content || ""}
                onChange={(e) => updateSlide("content", e.target.value)}
                className="flex-1 w-full bg-transparent text-white/80 font-mono text-sm p-4 resize-none outline-none placeholder:text-white/20"
                placeholder="Nội dung slide (Markdown)..."
              />
              {/* Notes */}
              <div className="border-t border-white/10 px-4 py-2">
                <textarea
                  value={slide?.notes || ""}
                  onChange={(e) => updateSlide("notes", e.target.value || null)}
                  className="w-full bg-transparent text-white/40 text-xs resize-none outline-none h-12 placeholder:text-white/15"
                  placeholder="Ghi chú trình chiếu..."
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Live Preview */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div ref={previewRef} className="h-full relative overflow-hidden bg-black">
              {slide && (
                <div
                  className="absolute"
                  style={{
                    width: SLIDE_W,
                    height: SLIDE_H,
                    left: "50%",
                    top: "50%",
                    marginLeft: -(SLIDE_W / 2),
                    marginTop: -(SLIDE_H / 2),
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <SlideRenderer slide={slide} />
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DeckEditor;
