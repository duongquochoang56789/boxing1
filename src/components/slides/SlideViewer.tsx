import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3, X } from "lucide-react";
import { SlideRenderer } from "./SlideLayouts";

interface SlideData {
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

interface SlideViewerProps {
  slides: SlideData[];
}

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const sectionLabels: Record<string, string> = {
  brand: "Giới thiệu thương hiệu",
  product: "Sản phẩm & Dịch vụ",
  operations: "Mô hình hoạt động",
  market: "Thị trường & Cạnh tranh",
  finance: "Tài chính & Kinh doanh",
  roadmap: "Lộ trình & Kết thúc",
};

export const SlideViewer = ({ slides }: SlideViewerProps) => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = [...slides].sort((a, b) => a.slide_order - b.slide_order);
  const slide = sorted[current];

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sx = rect.width / SLIDE_W;
    const sy = rect.height / SLIDE_H;
    setScale(Math.min(sx, sy));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale, isFullscreen]);

  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < sorted.length) setCurrent(i);
  }, [sorted.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && isFullscreen) toggleFullscreen();
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
      if (e.key === "g") setShowThumbnails(p => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, next, prev, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!slide) return <div className="flex items-center justify-center h-screen text-white">Chưa có slide nào</div>;

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-[9999] bg-black" : "h-screen bg-[#0a0a0a]"}`}>
      {/* Toolbar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-lg">FLY<span className="text-orange-400">FIT</span></span>
            <span className="text-white/40 text-sm">Tài liệu dự án</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">{sectionLabels[slide.section_name] || slide.section_name}</span>
            <span className="text-white/30 text-sm mx-2">|</span>
            <span className="text-white/70 text-sm font-medium">{current + 1} / {sorted.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowThumbnails(p => !p)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Grid view (G)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={toggleFullscreen}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Fullscreen (F5)"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main slide area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" onClick={next}>
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
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
            style={{ opacity: isFullscreen ? 0 : undefined }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = isFullscreen ? "0" : "0.5")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {current < sorted.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
            style={{ opacity: isFullscreen ? 0 : 0.5 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = isFullscreen ? "0" : "0.5")}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Fullscreen exit button */}
        {isFullscreen && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 hover:opacity-100"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Minimize className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-orange-400 transition-all duration-300"
          style={{ width: `${((current + 1) / sorted.length) * 100}%` }}
        />
      </div>

      {/* Thumbnail grid overlay */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Tất cả Slides ({sorted.length})</h2>
              <button onClick={() => setShowThumbnails(false)} className="p-2 text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sorted.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setCurrent(i); setShowThumbnails(false); }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    i === current ? "border-orange-400" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="w-full h-full" style={{ transform: "scale(0.999)" }}>
                    <div style={{
                      width: SLIDE_W,
                      height: SLIDE_H,
                      transform: `scale(${0.15})`,
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

export default SlideViewer;
