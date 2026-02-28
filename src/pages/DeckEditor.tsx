import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import {
  Save, ArrowLeft, Presentation, Plus, Trash2, ChevronUp, ChevronDown, Loader2, Share2, Copy, Palette, ImageIcon, Download, Check, CloudOff, Images, X
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BrandedLoader } from "@/components/ui/branded-loader";

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
const VALID_LAYOUTS = ["cover", "two-column", "stats", "grid", "table", "timeline", "quote", "pricing", "persona", "chart", "image-full", "comparison"];
const BG_PRESETS = [
  "#1a1a2e", "#16213e", "#0f3460", "#1a0a2e", "#2e1a1a", "#1a2e1a", "#2e2a1a", "#0a0a0a",
  "#e2e8f0", "#fef3c7", "#fee2e2", "#dbeafe", "#d1fae5", "#ede9fe",
];

const DeckEditor = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [deckTitle, setDeckTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);
  const batchCancelledRef = useRef(false);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveAll();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        duplicateSlide();
      }
      if (e.key === "Delete" && !isEditing) {
        deleteSlide();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowUp") {
        e.preventDefault();
        setCurrent(prev => Math.max(0, prev - 1));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowDown") {
        e.preventDefault();
        setCurrent(prev => Math.min(slides.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, current]);

  const slide = slides[current];

  // Auto-save with debounce + status indicator
  const triggerSave = useCallback((updated: DeckSlide) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");
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
          image_prompt: updated.image_prompt,
        })
        .eq("id", updated.id);
      if (error) { console.error("Auto-save error:", error); setSaveStatus("idle"); return; }
      setSaveStatus("saved");
      if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
      saveStatusTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
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

  const duplicateSlide = async () => {
    if (!deckId || !slide) return;
    const newOrder = slide.slide_order + 1;
    // Shift subsequent slides
    const toShift = slides.filter(s => s.slide_order >= newOrder);
    for (const s of toShift) {
      await supabase.from("deck_slides").update({ slide_order: s.slide_order + 1 }).eq("id", s.id);
    }
    const { data, error } = await supabase.from("deck_slides").insert({
      deck_id: deckId,
      slide_order: newOrder,
      title: slide.title,
      subtitle: slide.subtitle,
      content: slide.content,
      layout: slide.layout,
      section_name: slide.section_name,
      background_color: slide.background_color,
      notes: slide.notes,
      image_url: slide.image_url,
      image_prompt: slide.image_prompt,
    }).select().single();
    if (!error && data) {
      const updated = slides.map(s => s.slide_order >= newOrder ? { ...s, slide_order: s.slide_order + 1 } : s);
      updated.splice(current + 1, 0, data as DeckSlide);
      setSlides(updated);
      setCurrent(current + 1);
      toast({ title: "Đã nhân đôi slide" });
    }
  };

  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
    // Make the drag image semi-transparent
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "0.4";
  };
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(i);
  };
  const handleDragLeave = () => setDragOverIndex(null);
  const handleDragEnd = async (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) {
      setDragIndex(null); setDragOverIndex(null); return;
    }
    const reordered = [...slides];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dragOverIndex, 0, moved);
    const updated = reordered.map((s, idx) => ({ ...s, slide_order: idx + 1 }));
    setSlides(updated);
    setCurrent(dragOverIndex);
    setDragIndex(null); setDragOverIndex(null);
    for (const s of updated) {
      await supabase.from("deck_slides").update({ slide_order: s.slide_order }).eq("id", s.id);
    }
  };

  const updateBgColor = async (color: string) => {
    if (!slide) return;
    await supabase.from("deck_slides").update({ background_color: color }).eq("id", slide.id);
    setSlides(prev => prev.map((s, i) => i === current ? { ...s, background_color: color } : s));
  };

  const generateImage = async () => {
    if (!slide || !slide.image_prompt) {
      toast({ title: "Slide này chưa có image prompt", variant: "destructive" });
      return;
    }
    setGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-slide-image", {
        body: { slideId: slide.id, imagePrompt: slide.image_prompt },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setSlides(prev => prev.map((s, i) => i === current ? { ...s, image_url: data.imageUrl } : s));
        toast({ title: "Đã tạo hình minh hoạ!" });
      } else if (data?.error) {
        toast({ title: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Lỗi tạo ảnh: " + (e.message || "Unknown"), variant: "destructive" });
    }
    setGeneratingImage(false);
  };

  const generateAllImages = async () => {
    const slidesNeedingImages = slides.filter(s => s.image_prompt && !s.image_url);
    if (slidesNeedingImages.length === 0) {
      toast({ title: "Tất cả slide đã có ảnh!" });
      return;
    }
    batchCancelledRef.current = false;
    setBatchGenerating(true);
    setBatchTotal(slidesNeedingImages.length);
    setBatchProgress(0);

    let successCount = 0;
    for (let i = 0; i < slidesNeedingImages.length; i++) {
      if (batchCancelledRef.current) break;
      const s = slidesNeedingImages[i];
      setBatchProgress(i + 1);
      try {
        const { data, error } = await supabase.functions.invoke("generate-slide-image", {
          body: { slideId: s.id, imagePrompt: s.image_prompt },
        });
        if (!error && data?.imageUrl) {
          setSlides(prev => prev.map(sl => sl.id === s.id ? { ...sl, image_url: data.imageUrl } : sl));
          successCount++;
        }
      } catch (e) {
        console.error(`Batch image error for slide ${s.slide_order}:`, e);
      }
      // Small delay between requests to avoid rate limiting
      if (i < slidesNeedingImages.length - 1 && !batchCancelledRef.current) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setBatchGenerating(false);
    if (batchCancelledRef.current) {
      toast({ title: `Đã dừng. Tạo được ${successCount}/${slidesNeedingImages.length} ảnh.` });
    } else {
      toast({ title: `Đã tạo ${successCount}/${slidesNeedingImages.length} ảnh thành công!` });
    }
  };

  const exportPdf = async () => {
    setExportingPdf(true);
    toast({ title: "Đang xuất PDF..." });
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [SLIDE_W, SLIDE_H] });

      // Create offscreen container
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-99999px";
      container.style.top = "0";
      container.style.width = `${SLIDE_W}px`;
      container.style.height = `${SLIDE_H}px`;
      document.body.appendChild(container);

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], "landscape");

        // Render slide into container
        const { createRoot } = await import("react-dom/client");
        const React = await import("react");
        const { SlideRenderer: SR } = await import("@/components/slides/SlideLayouts");

        const wrapper = document.createElement("div");
        wrapper.style.width = `${SLIDE_W}px`;
        wrapper.style.height = `${SLIDE_H}px`;
        container.innerHTML = "";
        container.appendChild(wrapper);

        const root = createRoot(wrapper);
        root.render(React.createElement(SR, { slide: slides[i] }));

        // Wait for render
        await new Promise(r => setTimeout(r, 300));

        const canvas = await html2canvas(wrapper, {
          width: SLIDE_W,
          height: SLIDE_H,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.85);
        pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_W, SLIDE_H);
        root.unmount();
      }

      document.body.removeChild(container);
      pdf.save(`${deckTitle || "slides"}.pdf`);
      toast({ title: "Đã xuất PDF thành công!" });
    } catch (e: any) {
      console.error("PDF export error:", e);
      toast({ title: "Lỗi xuất PDF", variant: "destructive" });
    }
    setExportingPdf(false);
  };

  if (loading) {
    return (
      <BrandedLoader variant="page" className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/slides" className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-white font-bold">FLY<span className="text-orange-400">FIT</span></span>
          <span className="text-white/40 text-sm truncate max-w-[200px]">{deckTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">{current + 1} / {slides.length}</span>
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-orange-400 text-xs animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> Đang lưu...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <Check className="w-3 h-3" /> Đã lưu
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={generateImage} disabled={generatingImage || !slide?.image_prompt} 
            className="text-white/60 hover:text-white" title={slide?.image_prompt ? "Tạo ảnh AI" : "Không có image prompt"}>
            {generatingImage ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-1" />}
            {generatingImage ? "Đang tạo..." : "AI Ảnh"}
          </Button>
          {batchGenerating ? (
            <div className="flex items-center gap-2 px-2">
              <div className="w-24">
                <Progress value={(batchProgress / batchTotal) * 100} className="h-2" />
              </div>
              <span className="text-white/60 text-xs whitespace-nowrap">{batchProgress}/{batchTotal}</span>
              <Button size="sm" variant="ghost" onClick={() => { batchCancelledRef.current = true; }}
                className="text-red-400/60 hover:text-red-400 p-1 h-6 w-6">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={generateAllImages} 
              disabled={generatingImage || !slides.some(s => s.image_prompt && !s.image_url)}
              className="text-white/60 hover:text-white" title="Tạo ảnh AI cho tất cả slide">
              <Images className="w-4 h-4 mr-1" />
              Tạo tất cả ảnh
            </Button>
          )}
          {/* More actions dropdown */}
          <div className="relative group">
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
              <Save className="w-4 h-4 mr-1" /> Thêm ▾
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px] hidden group-hover:block z-50">
              <button onClick={saveAll} disabled={saving} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu tất cả"}
              </button>
              <button onClick={exportPdf} disabled={exportingPdf} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">
                <Download className="w-4 h-4" /> {exportingPdf ? "Đang xuất..." : "Xuất PDF"}
              </button>
              <button onClick={() => {
                const shareUrl = `${window.location.origin}/slides/${deckId}/present`;
                navigator.clipboard.writeText(shareUrl);
                toast({ title: "Đã copy link trình chiếu!" });
              }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" /> Copy link
              </button>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate(`/slides/${deckId}/present`)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Presentation className="w-4 h-4 mr-1" /> Trình chiếu
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail strip */}
        <div className="w-[120px] bg-[#0d0d0d] border-r border-white/10 overflow-y-auto shrink-0">
          {slides.map((s, i) => {
            const isDragging = dragIndex === i;
            const isOver = dragOverIndex === i && dragIndex !== null && dragIndex !== i;
            const dropAbove = isOver && dragIndex !== null && i < dragIndex;
            const dropBelow = isOver && dragIndex !== null && i > dragIndex;
            return (
              <div
                key={s.id}
                className="relative"
              >
                {/* Drop indicator line - above */}
                {dropAbove && (
                  <div className="absolute top-0 left-2 right-2 h-[3px] bg-orange-400 rounded-full z-10 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                )}
                <button
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => { e.preventDefault(); handleDragEnd(e); }}
                  onClick={() => setCurrent(i)}
                  className={`w-full p-2 border-b border-white/5 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    i === current ? "bg-orange-400/10 border-l-2 border-l-orange-400" : "hover:bg-white/5"
                  } ${isDragging ? "opacity-30 scale-95" : ""} ${isOver ? "bg-orange-400/5" : ""}`}
                  style={{
                    transition: "transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: isDragging ? "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(251,146,60,0.3)" : "none",
                  }}
                >
                  <div className={`aspect-video bg-[#1a1a2e] rounded overflow-hidden relative pointer-events-none transition-transform duration-200 ${isOver ? "scale-90" : ""}`}>
                    <div style={{ width: SLIDE_W, height: SLIDE_H, transform: "scale(0.05)", transformOrigin: "top left" }}>
                      <SlideRenderer slide={s} />
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40 mt-1 block truncate">{i + 1}. {s.title}</span>
                </button>
                {/* Drop indicator line - below */}
                {dropBelow && (
                  <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-orange-400 rounded-full z-10 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                )}
              </div>
            );
          })}
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
                  <Button size="sm" variant="ghost" onClick={duplicateSlide}
                    className="h-8 text-white/40 hover:text-white hover:bg-white/10 px-2" title="Nhân đôi">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={deleteSlide} disabled={slides.length <= 1}
                    className="h-8 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 px-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {/* Background color presets */}
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-white/30" />
                  {BG_PRESETS.map(c => (
                    <button
                      key={c}
                      onClick={() => updateBgColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${slide?.background_color === c ? "border-orange-400 scale-110" : "border-transparent hover:border-white/30"}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={slide?.content || ""}
                onChange={(e) => updateSlide("content", e.target.value)}
                className="flex-1 w-full bg-transparent text-white/80 font-mono text-sm p-4 resize-none outline-none placeholder:text-white/20"
                placeholder="Nội dung slide (Markdown)..."
              />
              {/* Image Prompt Editor */}
              <div className="border-t border-white/10 px-4 py-2">
                <label className="text-white/30 text-[10px] uppercase tracking-wider flex items-center gap-1 mb-1">
                  <ImageIcon className="w-3 h-3" /> Image Prompt
                </label>
                <textarea
                  value={slide?.image_prompt || ""}
                  onChange={(e) => updateSlide("image_prompt", e.target.value || null)}
                  className="w-full bg-white/5 border border-white/10 rounded text-white/60 text-xs resize-none outline-none h-16 p-2 placeholder:text-white/15 focus:border-orange-400/30 transition-colors"
                  placeholder="Mô tả hình ảnh AI sẽ tạo cho slide này..."
                />
              </div>
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
