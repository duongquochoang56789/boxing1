import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Minimize, Loader2, StickyNote,
  Clock, RotateCcw, Monitor, Eye, EyeOff, Grid3X3, X,
} from "lucide-react";

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

/** Scaled slide in a container that fills its parent */
const ScaledSlide = ({ slide, className = "" }: { slide: DeckSlide; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);

  useEffect(() => {
    if (!ref.current) return;
    const update = () => {
      const r = ref.current!.getBoundingClientRect();
      setScale(Math.min(r.width / SLIDE_W, r.height / SLIDE_H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
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
        <SlideRenderer slide={slide} />
      </div>
    </div>
  );
};

const DeckPresent = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [presenterMode, setPresenterMode] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Fetch slides
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

  // Scale for audience view
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setScale(Math.min(r.width / SLIDE_W, r.height / SLIDE_H));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale, loading, presenterMode]);

  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < slides.length) setCurrent(i);
  }, [slides.length]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
      if (e.key === "Escape") navigate(`/slides/${deckId}`);
      if (e.key === "n" || e.key === "N") setShowNotes(prev => !prev);
      if (e.key === "p" || e.key === "P") setPresenterMode(prev => !prev);
      if (e.key === "g" || e.key === "G") setShowGrid(prev => !prev);
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

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setElapsed(0);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const slide = slides[current];
  const nextSlide = slides[current + 1] || null;

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

  // ─── PRESENTER MODE ───
  if (presenterMode) {
    return (
      <div className="fixed inset-0 bg-[#111] z-[9999] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm">FLY<span className="text-orange-400">FIT</span></span>
            <span className="text-white/40 text-xs">Presenter View</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resetTimer} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors" title="Reset timer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="flex items-center gap-1.5 text-orange-400 text-sm font-mono font-medium">
              <Clock className="w-3.5 h-3.5" />{formatTime(elapsed)}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/70 text-sm font-medium">{current + 1} / {slides.length}</span>
            <span className="text-white/30">|</span>
            <button onClick={() => setPresenterMode(false)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors" title="Audience view (P)">
              <Monitor className="w-3.5 h-3.5" /> Audience View
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/slides/${deckId}`); }}
              className="p-1.5 text-white/50 hover:text-white transition-colors" title="Exit (Esc)">
              <Minimize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex min-h-0">
          {/* Left: Current + Next */}
          <div className="flex-1 flex flex-col p-3 gap-3 min-w-0">
            {/* Current slide - large */}
            <div className="flex-[3] rounded-lg overflow-hidden border border-white/10 bg-black">
              <ScaledSlide slide={slide} className="w-full h-full" />
            </div>
            {/* Next slide - small */}
            <div className="flex-[1] flex gap-3 min-h-0">
              <div className="flex-1 rounded-lg overflow-hidden border border-white/10 bg-black/50 relative">
                {nextSlide ? (
                  <>
                    <ScaledSlide slide={nextSlide} className="w-full h-full" />
                    <div className="absolute top-2 left-2 bg-black/70 text-white/60 text-[10px] px-2 py-0.5 rounded font-medium">
                      NEXT: {nextSlide.title}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                    Slide cuối cùng
                  </div>
                )}
              </div>
              {/* Navigation */}
              <div className="flex flex-col items-center justify-center gap-2 w-16 shrink-0">
                <button
                  onClick={() => goTo(current - 1)}
                  disabled={current === 0}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(current + 1)}
                  disabled={current >= slides.length - 1}
                  className="p-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 disabled:opacity-20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Notes */}
          {showNotes && (
            <div className="w-[340px] shrink-0 border-l border-white/10 bg-black/40 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-medium">
                  <StickyNote className="w-3.5 h-3.5" /> Ghi chú diễn giả
                </div>
                <button onClick={() => setShowNotes(false)} className="text-white/30 hover:text-white/60 transition-colors">
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {slide.notes ? (
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{slide.notes}</p>
                ) : (
                  <p className="text-white/30 text-sm italic">Chưa có ghi chú cho slide này.</p>
                )}
              </div>
            </div>
          )}
          {!showNotes && (
            <button
              onClick={() => setShowNotes(true)}
              className="w-10 shrink-0 border-l border-white/10 bg-black/40 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
              title="Show notes (N)"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5 shrink-0">
          <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
        </div>
      </div>
    );
  }

  // ─── AUDIENCE MODE (default) ───
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

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <button onClick={() => setPresenterMode(true)}
          className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors" title="Presenter View (P)">
          <Eye className="w-5 h-5" />
        </button>
        <button onClick={() => setShowGrid(true)}
          className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors" title="Grid View (G)">
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button onClick={() => navigate(`/slides/${deckId}`)}
          className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors" title="Exit (Esc)">
          <Minimize className="w-5 h-5" />
        </button>
      </div>

      {/* Slide counter + timer */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 text-white/40 text-xs opacity-0 hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(elapsed)}</span>
        <span>{current + 1} / {slides.length}</span>
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/5">
        <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
      </div>

      {/* Grid overlay */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 overflow-y-auto p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Tất cả Slides ({slides.length})</h2>
              <button onClick={() => setShowGrid(false)} className="p-2 text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setCurrent(i); setShowGrid(false); }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    i === current ? "border-orange-400" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="w-full h-full">
                    <div style={{
                      width: SLIDE_W, height: SLIDE_H,
                      transform: "scale(0.15)",
                      transformOrigin: "top left",
                    }}>
                      <SlideRenderer slide={s} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <span className="text-white/80 text-xs font-medium">{s.slide_order}. {s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckPresent;
