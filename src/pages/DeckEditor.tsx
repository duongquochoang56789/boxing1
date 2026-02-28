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
  Save, ArrowLeft, Presentation, Plus, Trash2, ChevronUp, ChevronDown, Loader2, Share2, Copy, Palette, ImageIcon, Download, Check, CloudOff, Images, X, Sparkles, PenLine, Maximize2, Minimize2, FileText, Undo2, Redo2, BookmarkPlus, BookMarked, Grid3X3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BrandedLoader } from "@/components/ui/branded-loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSlideHistory } from "@/hooks/useSlideHistory";
import { useSlideTemplates } from "@/hooks/useSlideTemplates";
import { Input } from "@/components/ui/input";
import LazySlideThumb from "@/components/slides/LazySlideThumb";
import EditorGridView from "@/components/slides/EditorGridView";

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

const LAYOUT_TEMPLATES: Record<string, string> = {
  cover: "# Tiêu đề chính\n\nPhụ đề hoặc mô tả ngắn gọn về nội dung trình bày",
  "two-column": "**Điểm 1:** Mô tả chi tiết điểm đầu tiên\n\n**Điểm 2:** Mô tả chi tiết điểm thứ hai\n\n**Điểm 3:** Mô tả chi tiết điểm thứ ba",
  stats: "**100+** Khách hàng hài lòng\n\n**50%** Tăng trưởng hàng năm\n\n**24/7** Hỗ trợ khách hàng\n\n**99.9%** Uptime",
  grid: "🎯 **Mục tiêu** Mô tả ngắn\n\n🚀 **Chiến lược** Mô tả ngắn\n\n💡 **Giải pháp** Mô tả ngắn\n\n📈 **Kết quả** Mô tả ngắn",
  table: "| Tiêu chí | Phương án A | Phương án B |\n|----------|-------------|-------------|\n| Chi phí | Thấp | Trung bình |\n| Thời gian | 2 tháng | 1 tháng |\n| Hiệu quả | Cao | Rất cao |",
  timeline: "**Q1 2025** Giai đoạn nghiên cứu và lập kế hoạch\n\n**Q2 2025** Phát triển sản phẩm MVP\n\n**Q3 2025** Ra mắt beta và thu thập phản hồi\n\n**Q4 2025** Ra mắt chính thức",
  quote: '"Trích dẫn ấn tượng hoặc nhận xét từ khách hàng, đối tác"\n\n— Tên người, Chức vụ',
  pricing: "**Gói Cơ bản** 499K/tháng\n- Tính năng A\n- Tính năng B\n\n**Gói Pro** 999K/tháng\n- Tất cả gói Cơ bản\n- Tính năng C\n- Tính năng D",
  persona: "**Tên nhân vật** Chức vụ / Vai trò\n\nMô tả ngắn về nhân vật, kinh nghiệm và đóng góp nổi bật.",
  chart: "**Dữ liệu biểu đồ**\n\nMô tả xu hướng hoặc chỉ số quan trọng cần trực quan hóa.",
  "image-full": "# Tiêu đề nổi bật\n\nMô tả ngắn phủ lên hình nền toàn slide",
  comparison: "**Phương án A**\n- Ưu điểm 1\n- Ưu điểm 2\n\n---\n\n**Phương án B**\n- Ưu điểm 1\n- Ưu điểm 2",
};

interface ThemePreset {
  id: string;
  name: string;
  colors: string[]; // background colors to apply to slides cyclically
  label: string; // short color indicator
}

const THEME_PRESETS: ThemePreset[] = [
  { id: "default", name: "Mặc định", label: "🌙", colors: ["#1a1a2e", "#16213e", "#0f3460", "#1a0a2e"] },
  { id: "corporate-blue", name: "Corporate Blue", label: "🔵", colors: ["#0f172a", "#1e3a5f", "#0c4a6e", "#164e63"] },
  { id: "startup-orange", name: "Startup Orange", label: "🟠", colors: ["#1c1917", "#431407", "#7c2d12", "#1a1a2e"] },
  { id: "nature-green", name: "Nature Green", label: "🟢", colors: ["#052e16", "#14532d", "#1a2e1a", "#0a0a0a"] },
  { id: "elegant-dark", name: "Elegant Dark", label: "⚫", colors: ["#0a0a0a", "#171717", "#1c1917", "#0c0a09"] },
  { id: "warm-cream", name: "Warm Cream", label: "🟡", colors: ["#fef3c7", "#fde68a", "#f5f0e1", "#e2e8f0"] },
  { id: "royal-purple", name: "Royal Purple", label: "🟣", colors: ["#1a0a2e", "#2e1065", "#312e81", "#1e1b4b"] },
  { id: "rose-gold", name: "Rose Gold", label: "🌸", colors: ["#2e1a1a", "#4a1d1d", "#1c1917", "#0a0a0a"] },
];

const suggestLayout = (content: string): string | null => {
  if (!content || content.trim().length < 10) return null;
  if (content.includes("|") && content.includes("---")) return "table";
  const statMatches = content.match(/\*\*\d[\d,.%+]*\*\*/g);
  if (statMatches && statMatches.length >= 2) return "stats";
  if ((content.includes('"') || content.includes('\u201C')) && content.includes('—')) return "quote";
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]/gu;
  const emojiMatches = content.match(emojiPattern);
  if (emojiMatches && emojiMatches.length >= 3) return "grid";
  const bulletLines = content.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
  if (bulletLines.length >= 4) return "two-column";
  if (content.includes('VS') || (content.split('---').length >= 2 && !content.includes('|'))) return "comparison";
  return null;
};

const DeckEditor = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [showAutoImageDialog, setShowAutoImageDialog] = useState(false);
  const [aiAssisting, setAiAssisting] = useState<string | null>(null);
  const [deckTheme, setDeckTheme] = useState("default");
  const [deckTransition, setDeckTransition] = useState("fade");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showEditorGrid, setShowEditorGrid] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showTemplateList, setShowTemplateList] = useState(false);
  const history = useSlideHistory();
  const { templates, saveTemplate, deleteTemplate } = useSlideTemplates();

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
      setDeckTheme((deckRes.data as any).theme || "default");
      setDeckTransition((deckRes.data as any).transition || "fade");
      setSlides(slidesRes.data as DeckSlide[]);
      setLoading(false);

      // Check for auto-image generation param
      if (searchParams.get("autoImages") === "true") {
        setShowAutoImageDialog(true);
        setSearchParams({}, { replace: true });
      }
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
    const oldValue = slide ? (slide[field] as string | null) : null;
    if (slide && (field === "content" || field === "title" || field === "subtitle" || field === "notes")) {
      history.push({ slideId: slide.id, field, oldValue, newValue: value });
    }
    setSlides(prev => {
      const copy = [...prev];
      copy[current] = { ...copy[current], [field]: value };
      triggerSave(copy[current]);
      return copy;
    });
  };

  const handleUndo = useCallback(() => {
    const entry = history.undo();
    if (!entry) return;
    setSlides(prev => prev.map(s =>
      s.id === entry.slideId ? { ...s, [entry.field]: entry.oldValue } : s
    ));
    supabase.from("deck_slides").update({ [entry.field]: entry.oldValue }).eq("id", entry.slideId);
  }, [history]);

  const handleRedo = useCallback(() => {
    const entry = history.redo();
    if (!entry) return;
    setSlides(prev => prev.map(s =>
      s.id === entry.slideId ? { ...s, [entry.field]: entry.newValue } : s
    ));
    supabase.from("deck_slides").update({ [entry.field]: entry.newValue }).eq("id", entry.slideId);
  }, [history]);

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
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        handleRedo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (e.key === "Delete" && !isEditing) {
        deleteSlide();
      }
      if ((e.key === "g" || e.key === "G") && !isEditing) {
        e.preventDefault();
        setShowEditorGrid(prev => !prev);
      }
      if (e.key === "Escape" && showEditorGrid) {
        e.preventDefault();
        setShowEditorGrid(false);
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
  }, [slides, current, handleUndo, handleRedo]);

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
    const defaultLayout = "two-column";
    const { data, error } = await supabase.from("deck_slides").insert({
      deck_id: deckId,
      slide_order: newOrder,
      title: `Slide ${newOrder}`,
      content: LAYOUT_TEMPLATES[defaultLayout] || "",
      layout: defaultLayout,
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

  const applyTheme = async (themeId: string) => {
    if (!deckId) return;
    const theme = THEME_PRESETS.find(t => t.id === themeId);
    if (!theme) return;
    setDeckTheme(themeId);
    // Update deck record
    await supabase.from("decks").update({ theme: themeId } as any).eq("id", deckId);
    // Apply colors to all slides cyclically
    const updated = slides.map((s, i) => ({
      ...s,
      background_color: theme.colors[i % theme.colors.length],
    }));
    setSlides(updated);
    for (const s of updated) {
      await supabase.from("deck_slides").update({ background_color: s.background_color }).eq("id", s.id);
    }
    toast({ title: `Đã áp dụng theme "${theme.name}"!` });
  };

  const updateDeckTransition = async (t: string) => {
    if (!deckId) return;
    setDeckTransition(t);
    await supabase.from("decks").update({ transition: t } as any).eq("id", deckId);
    toast({ title: `Transition: ${t}` });
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


  const aiAssist = async (action: "rewrite" | "expand" | "summarize" | "notes") => {
    if (!slide) return;
    setAiAssisting(action);
    try {
      const { data, error } = await supabase.functions.invoke("ai-slide-assist", {
        body: {
          action,
          slideTitle: slide.title,
          slideContent: slide.content,
          slideNotes: slide.notes,
          deckTitle,
          layout: slide.layout,
          language: "vi",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (action === "notes") {
        updateSlide("notes", data.result);
        toast({ title: "Đã tạo ghi chú thuyết trình!" });
      } else {
        updateSlide("content", data.result);
        toast({ title: action === "rewrite" ? "Đã viết lại nội dung!" : action === "expand" ? "Đã mở rộng nội dung!" : "Đã tóm tắt nội dung!" });
      }
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("429")) {
        toast({ title: "Quá nhiều yêu cầu", description: "Vui lòng đợi 30 giây rồi thử lại.", variant: "destructive" });
      } else if (msg.includes("402")) {
        toast({ title: "Hết credits AI", variant: "destructive" });
      } else {
        toast({ title: "Lỗi AI: " + (msg || "Unknown"), variant: "destructive" });
      }
    }
    setAiAssisting(null);
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
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 mr-1">
            <Button size="sm" variant="ghost" onClick={handleUndo} className="text-white/40 hover:text-white p-1.5 h-8 w-8" title="Hoàn tác (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleRedo} className="text-white/40 hover:text-white p-1.5 h-8 w-8" title="Làm lại (Ctrl+Shift+Z)">
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-white/20">|</span>
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
          {/* Theme selector */}
          <div className="relative group">
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" title="Theme">
              <Palette className="w-4 h-4 mr-1" /> Theme ▾
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 min-w-[180px] hidden group-hover:block z-50">
              {THEME_PRESETS.map(t => (
                <button key={t.id} onClick={() => applyTheme(t.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    deckTheme === t.id ? "text-orange-400 bg-orange-400/10" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}>
                  <span>{t.label}</span>
                  <span>{t.name}</span>
                  {deckTheme === t.id && <Check className="w-3 h-3 ml-auto" />}
                </button>
              ))}
              <div className="border-t border-white/10 mt-1 pt-1 px-3 py-1.5">
                <span className="text-white/30 text-[10px] uppercase tracking-wider">Transition</span>
                <div className="flex gap-1 mt-1">
                  {["fade", "slide", "zoom"].map(t => (
                    <button key={t} onClick={() => updateDeckTransition(t)}
                      className={`px-2 py-1 text-[11px] rounded capitalize transition-colors ${
                        deckTransition === t ? "bg-orange-500/20 text-orange-400" : "text-white/40 hover:text-white/70 bg-white/5"
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              <div className="border-t border-white/10 my-1" />
              <button onClick={() => {
                if (slide) {
                  setTemplateName(slide.title);
                  setShowTemplateDialog(true);
                }
              }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <BookmarkPlus className="w-4 h-4" /> Lưu template
              </button>
              <button onClick={() => setShowTemplateList(true)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <BookMarked className="w-4 h-4" /> Dùng template ({templates.length})
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
                  <LazySlideThumb slide={s} scale={0.05} className={`transition-transform duration-200 ${isOver ? "scale-90" : ""}`} />
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
                  {/* Smart layout suggestion */}
                  {slide && (() => {
                    const suggested = suggestLayout(slide.content);
                    if (suggested && suggested !== slide.layout) {
                      return (
                        <Badge
                          className="h-8 cursor-pointer bg-orange-400/10 text-orange-400 border-orange-400/30 hover:bg-orange-400/20 text-[10px] whitespace-nowrap animate-in fade-in duration-300"
                          onClick={() => updateSlide("layout", suggested)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Gợi ý: {suggested}
                        </Badge>
                      );
                    }
                    return null;
                  })()}
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
              {/* AI Assist Buttons */}
              <div className="border-t border-white/10 px-4 py-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-white/20 text-[10px] uppercase tracking-wider mr-1">AI</span>
                <Button size="sm" variant="ghost" onClick={() => aiAssist("rewrite")}
                  disabled={!!aiAssisting || !slide?.content}
                  className="h-7 text-[11px] text-white/40 hover:text-orange-400 hover:bg-orange-400/10 px-2 gap-1">
                  {aiAssisting === "rewrite" ? <Loader2 className="w-3 h-3 animate-spin" /> : <PenLine className="w-3 h-3" />}
                  Viết lại
                </Button>
                <Button size="sm" variant="ghost" onClick={() => aiAssist("expand")}
                  disabled={!!aiAssisting || !slide?.content}
                  className="h-7 text-[11px] text-white/40 hover:text-emerald-400 hover:bg-emerald-400/10 px-2 gap-1">
                  {aiAssisting === "expand" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Maximize2 className="w-3 h-3" />}
                  Mở rộng
                </Button>
                <Button size="sm" variant="ghost" onClick={() => aiAssist("summarize")}
                  disabled={!!aiAssisting || !slide?.content}
                  className="h-7 text-[11px] text-white/40 hover:text-blue-400 hover:bg-blue-400/10 px-2 gap-1">
                  {aiAssisting === "summarize" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minimize2 className="w-3 h-3" />}
                  Tóm tắt
                </Button>
                <Button size="sm" variant="ghost" onClick={() => aiAssist("notes")}
                  disabled={!!aiAssisting}
                  className="h-7 text-[11px] text-white/40 hover:text-purple-400 hover:bg-purple-400/10 px-2 gap-1">
                  {aiAssisting === "notes" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                  Tạo ghi chú
                </Button>
                {aiAssisting && (
                  <span className="text-orange-400/60 text-[10px] animate-pulse ml-1">Đang xử lý...</span>
                )}
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

      {/* Auto-generate images dialog */}
      <Dialog open={showAutoImageDialog} onOpenChange={setShowAutoImageDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="w-5 h-5 text-orange-400" />
              Tạo ảnh minh hoạ tự động?
            </DialogTitle>
            <DialogDescription className="text-white/50">
              AI đã tạo xong nội dung slide. Bạn có muốn AI tự động tạo ảnh minh hoạ cho tất cả slide không? (Mất khoảng 30-60 giây)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowAutoImageDialog(false)} className="text-white/50 hover:text-white">
              Để sau
            </Button>
            <Button onClick={() => { setShowAutoImageDialog(false); generateAllImages(); }} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Tạo ảnh ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save as Template dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-orange-400" />
              Lưu slide làm template
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Template sẽ lưu layout, nội dung, ghi chú và màu nền để tái sử dụng.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Tên template..."
            className="bg-white/5 border-white/10 text-white"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowTemplateDialog(false)} className="text-white/50 hover:text-white">
              Huỷ
            </Button>
            <Button onClick={() => {
              if (slide && templateName.trim()) {
                saveTemplate(templateName.trim(), {
                  layout: slide.layout,
                  content: slide.content,
                  subtitle: slide.subtitle,
                  section_name: slide.section_name,
                  background_color: slide.background_color,
                  notes: slide.notes,
                  image_prompt: slide.image_prompt,
                });
                setShowTemplateDialog(false);
                toast({ title: `Đã lưu template "${templateName.trim()}"!` });
              }
            }} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={!templateName.trim()}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template list dialog */}
      <Dialog open={showTemplateList} onOpenChange={setShowTemplateList}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-orange-400" />
              Slide Templates ({templates.length})
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Chọn template để áp dụng cho slide hiện tại.
            </DialogDescription>
          </DialogHeader>
          {templates.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">Chưa có template nào. Lưu slide làm template từ menu "Thêm".</p>
          ) : (
            <div className="space-y-2">
              {templates.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.layout} • {new Date(t.savedAt).toLocaleDateString("vi")}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => {
                    if (slide) {
                      updateSlide("content", t.content);
                      updateSlide("layout", t.layout);
                      if (t.subtitle) updateSlide("subtitle", t.subtitle);
                      if (t.notes) updateSlide("notes", t.notes);
                      if (t.image_prompt) updateSlide("image_prompt", t.image_prompt);
                      updateBgColor(t.background_color);
                      setShowTemplateList(false);
                      toast({ title: `Đã áp dụng template "${t.name}"!` });
                    }
                  }} className="text-orange-400 hover:bg-orange-400/10 text-xs shrink-0">
                    Áp dụng
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteTemplate(t.id)}
                    className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 p-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckEditor;
