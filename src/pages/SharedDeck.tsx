import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Loader2 } from "lucide-react";

interface DeckSlide {
  id: string;
  slide_order: number;
  title: string;
  subtitle: string | null;
  content: string;
  layout: string;
  image_url: string | null;
  background_color: string;
  section_name: string;
}

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const SharedDeck = () => {
  const { slug } = useParams<{ slug: string }>();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [deckTitle, setDeckTitle] = useState("");
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data: deck } = await supabase
        .from("decks")
        .select("id, title")
        .eq("share_slug", slug)
        .eq("is_public", true)
        .single();

      if (!deck) { setNotFound(true); setLoading(false); return; }
      setDeckTitle(deck.title);

      const { data: slideData } = await supabase
        .from("deck_slides")
        .select("*")
        .eq("deck_id", deck.id)
        .order("slide_order");

      if (slideData) setSlides(slideData as DeckSlide[]);
      setLoading(false);
    };
    load();
  }, [slug]);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setScale(Math.min(r.width / SLIDE_W, r.height / SLIDE_H));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale, loading]);

  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < slides.length) setCurrent(i);
  }, [slides.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-400" /></div>;
  }

  if (notFound) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">Slide deck không tồn tại hoặc chưa được công khai.</div>;
  }

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10">
        <span className="text-white font-bold">FLY<span className="text-orange-400">FIT</span> <span className="text-white/40 text-sm ml-2">{deckTitle}</span></span>
        <span className="text-white/50 text-sm">{current + 1} / {slides.length}</span>
      </div>
      <div ref={containerRef} className="flex-1 relative overflow-hidden" onClick={() => goTo(current + 1)}>
        <div className="absolute" style={{
          width: SLIDE_W, height: SLIDE_H,
          left: "50%", top: "50%",
          marginLeft: -(SLIDE_W / 2), marginTop: -(SLIDE_H / 2),
          transform: `scale(${scale})`, transformOrigin: "center center",
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={slide.slide_order} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full">
              <SlideRenderer slide={slide} />
            </motion.div>
          </AnimatePresence>
        </div>
        {current > 0 && (
          <button onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-50 hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {current < slides.length - 1 && (
          <button onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-50 hover:opacity-100 transition-opacity">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="h-1 bg-white/5">
        <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
      </div>
    </div>
  );
};

export default SharedDeck;
