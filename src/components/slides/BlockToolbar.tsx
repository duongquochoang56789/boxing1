import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface BlockToolbarProps {
  position: { top: number; left: number };
  onBold: () => void;
  onItalic: () => void;
  onFontSize: (size: string) => void;
  onColor: (color: string) => void;
  onAlign: (align: string) => void;
  onClose: () => void;
  currentSize?: string;
  currentColor?: string;
  currentAlign?: string;
}

const FONT_SIZES = [
  { label: "XS", value: "xs" },
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
  { label: "XL", value: "xl" },
];

const COLOR_PRESETS = [
  { color: "#ffffff", label: "Trắng" },
  { color: "#fb923c", label: "Cam" },
  { color: "#38bdf8", label: "Xanh dương" },
  { color: "#c084fc", label: "Tím" },
  { color: "#fbbf24", label: "Vàng" },
  { color: "#34d399", label: "Xanh lá" },
  { color: "#f472b6", label: "Hồng" },
  { color: "#94a3b8", label: "Xám" },
];

const BlockToolbar: React.FC<BlockToolbarProps> = ({
  position,
  onBold,
  onItalic,
  onFontSize,
  onColor,
  onAlign,
  onClose,
  currentSize = "md",
  currentColor,
  currentAlign = "left",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid immediate close from the click that opened toolbar
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Clamp position so toolbar stays visible
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.max(8, position.top - 52),
    left: Math.max(8, position.left),
    zIndex: 99999,
  };

  return createPortal(
    <div
      ref={ref}
      style={style}
      className="flex items-center gap-1 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl px-2 py-1.5 select-none"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Bold / Italic */}
      <button
        onClick={onBold}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onItalic}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-white/15 mx-0.5" />

      {/* Font Size */}
      <div className="flex items-center gap-0.5">
        {FONT_SIZES.map((s) => (
          <button
            key={s.value}
            onClick={() => onFontSize(s.value)}
            className={`px-1.5 py-0.5 text-[10px] rounded font-medium transition-colors ${
              currentSize === s.value
                ? "bg-orange-500/30 text-orange-400"
                : "text-white/40 hover:text-white/70 hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/15 mx-0.5" />

      {/* Colors */}
      <div className="flex items-center gap-0.5">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c.color}
            onClick={() => onColor(c.color)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              currentColor === c.color
                ? "border-white scale-110"
                : "border-transparent hover:border-white/40"
            }`}
            style={{ backgroundColor: c.color }}
            title={c.label}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-white/15 mx-0.5" />

      {/* Alignment */}
      <button
        onClick={() => onAlign("left")}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
          currentAlign === "left" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/10"
        }`}
        title="Căn trái"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onAlign("center")}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
          currentAlign === "center" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/10"
        }`}
        title="Căn giữa"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onAlign("right")}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
          currentAlign === "right" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/10"
        }`}
        title="Căn phải"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>
    </div>,
    document.body
  );
};

export default BlockToolbar;
