import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minimize, Loader2, StickyNote, Clock } from "lucide-react";

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
  notes: string | null;
}

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const DeckPresent = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!deckId) return;
    supabase
      .from("deck_slides")
      .select("*")
      .eq("deck_id", deckId)
      .order("slide_order")
      .then(({ data }) => {
        if (data) setSlides(data as DeckSlide[]);
        setLoading(false);
      });
  }, [deckId]);

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
      if (e.key === "Escape") navigate(`/slides/${deckId}`);
      if (e.key === "n" || e.key === "N") setShowNotes(prev => !prev);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo, navigate, deckId]);

  // Auto fullscreen
  useEffect(() => {
    if (!loading && slides.length > 0) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
    return () => { document.exitFullscreen?.().catch(() => {}); };
  }, [loading, slides.length]);

  // Timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const slide = slides[current];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!slide) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50">
        Không có slide nào
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-[9999] cursor-none" onClick={() => goTo(current + 1)}>
      <div
        className="absolute"
        style={{
          width: SLIDE_W, height: SLIDE_H,
          left: "50%", top: "50%",
          marginLeft: -(SLIDE_W / 2), marginTop: -(SLIDE_H / 2),
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.slide_order}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <SlideRenderer slide={slide} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Exit */}
      <button onClick={(e) => { e.stopPropagation(); navigate(`/slides/${deckId}`); }}
        className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
        <Minimize className="w-5 h-5" />
      </button>

      {/* Slide counter + timer */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 text-white/40 text-xs opacity-0 hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(elapsed)}</span>
        <span>{current + 1} / {slides.length}</span>
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/5">
        <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
      </div>

      {/* Notes overlay */}
      <AnimatePresence>
        {showNotes && slide.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="absolute bottom-6 left-4 right-4 max-w-2xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-white/80 text-sm leading-relaxed"
          >
            <div className="flex items-center gap-2 mb-2 text-orange-400 text-xs font-medium">
              <StickyNote className="w-3.5 h-3.5" /> Ghi chú (N để ẩn)
            </div>
            <p className="whitespace-pre-wrap">{slide.notes}</p>
            {slides[current + 1] && (
              <div className="mt-3 pt-3 border-t border-white/10 text-white/40 text-xs">
                Slide tiếp: {slides[current + 1].title}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckPresent;
