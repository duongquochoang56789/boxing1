import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LazySlideThumb from "./LazySlideThumb";

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
  image_prompt?: string | null;
}

interface EditorGridViewProps {
  open: boolean;
  slides: DeckSlide[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

const EditorGridView = memo(({ open, slides, currentIndex, onSelect, onClose }: EditorGridViewProps) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">
                Tất cả Slides ({slides.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {slides.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  onClick={() => { onSelect(i); onClose(); }}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 group ${
                    i === currentIndex
                      ? "border-orange-400 ring-2 ring-orange-400/30"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <LazySlideThumb slide={s} scale={0.12} />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <span className="text-white/80 text-xs font-medium truncate block">
                      {s.slide_order}. {s.title}
                    </span>
                  </div>
                  {i === currentIndex && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">{i + 1}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <p className="text-white/20 text-xs text-center mt-8">
              Nhấn G hoặc Esc để đóng • Click vào slide để chuyển đến
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

EditorGridView.displayName = "EditorGridView";

export default EditorGridView;
