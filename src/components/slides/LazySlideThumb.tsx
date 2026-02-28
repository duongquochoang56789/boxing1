import { useState, useEffect, useRef, memo } from "react";
import { SlideRenderer } from "@/components/slides/SlideLayouts";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

interface LazySlideThumbProps {
  slide: {
    id: string;
    slide_order: number;
    title: string;
    subtitle: string | null;
    content: string;
    layout: string;
    image_url: string | null;
    background_color: string;
    section_name: string;
    notes?: string | null;
    image_prompt?: string | null;
  };
  scale?: number;
  className?: string;
}

/** Renders slide thumbnail only when visible in viewport (IntersectionObserver) */
const LazySlideThumb = memo(({ slide, scale = 0.05, className = "" }: LazySlideThumbProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Once visible, stay rendered
        }
      },
      { rootMargin: "100px" } // Pre-load 100px before entering viewport
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`aspect-video rounded overflow-hidden relative pointer-events-none ${className}`}
      style={{ backgroundColor: slide.background_color || "#1a1a2e" }}>
      {visible ? (
        <div style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <SlideRenderer slide={slide} />
        </div>
      ) : (
        <div className="w-full h-full animate-pulse bg-white/5" />
      )}
    </div>
  );
}, (prev, next) => {
  // Only re-render if slide content actually changed
  return (
    prev.slide.id === next.slide.id &&
    prev.slide.content === next.slide.content &&
    prev.slide.title === next.slide.title &&
    prev.slide.layout === next.slide.layout &&
    prev.slide.background_color === next.slide.background_color &&
    prev.slide.image_url === next.slide.image_url &&
    prev.scale === next.scale
  );
});

LazySlideThumb.displayName = "LazySlideThumb";

export default LazySlideThumb;
