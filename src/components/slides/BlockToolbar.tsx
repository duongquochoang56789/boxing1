import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown } from "lucide-react";

interface BlockToolbarProps {
  position: { top: number; left: number };
  onBold: () => void;
  onItalic: () => void;
  onFontSize: (size: string) => void;
  onColor: (color: string) => void;
  onAlign: (align: string) => void;
  onFont: (font: string) => void;
  onWeight: (weight: string) => void;
  onSpacing: (spacing: string) => void;
  onLineHeight: (lh: string) => void;
  onClose: () => void;
  currentSize?: string;
  currentColor?: string;
  currentAlign?: string;
  currentFont?: string;
  currentWeight?: string;
  currentSpacing?: string;
  currentLineHeight?: string;
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

const FONT_LIST = [
  { name: "Mặc định", value: "" },
  { name: "Inter", value: "Inter" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Poppins", value: "Poppins" },
  { name: "Roboto", value: "Roboto" },
  { name: "Lora", value: "Lora" },
  { name: "Be Vietnam Pro", value: "Be Vietnam Pro" },
  { name: "Bebas Neue", value: "Bebas Neue" },
  { name: "Raleway", value: "Raleway" },
  { name: "Source Code Pro", value: "Source Code Pro" },
  { name: "Dancing Script", value: "Dancing Script" },
  { name: "Cormorant Garamond", value: "Cormorant Garamond" },
];

const WEIGHT_LIST = [
  { label: "Thin", value: "100" },
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "SemiBold", value: "600" },
  { label: "Bold", value: "700" },
];

const SPACING_LIST = [
  { label: "Tight", value: "tight" },
  { label: "Normal", value: "normal" },
  { label: "Wide", value: "wide" },
  { label: "X-Wide", value: "xwide" },
];

const LINE_HEIGHT_LIST = [
  { label: "Compact", value: "compact" },
  { label: "Normal", value: "normal" },
  { label: "Relaxed", value: "relaxed" },
  { label: "Loose", value: "loose" },
];

/** Lazy-load a Google Font by injecting a <link> into <head> */
const loadGoogleFont = (fontName: string) => {
  if (!fontName) return;
  const id = `gfont-${fontName.replace(/\s/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@100;300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

// Dropdown component for toolbar
const ToolbarDropdown = ({ label, options, value, onChange, fontPreview }: {
  label: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange: (v: string) => void;
  fontPreview?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
          value && value !== "normal" && value !== "400" && value !== ""
            ? "bg-orange-500/20 text-orange-400"
            : "text-white/50 hover:text-white/80 hover:bg-white/10"
        }`}
        style={fontPreview && value ? { fontFamily: `'${value}', sans-serif` } : undefined}
      >
        <span className="truncate max-w-[80px]">{current?.label || label}</span>
        <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl py-1 min-w-[130px] max-h-[200px] overflow-y-auto z-[100000]">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${
                value === o.value ? "bg-orange-500/20 text-orange-400" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              style={fontPreview && o.value ? { fontFamily: `'${o.value}', sans-serif` } : undefined}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BlockToolbar: React.FC<BlockToolbarProps> = ({
  position,
  onBold,
  onItalic,
  onFontSize,
  onColor,
  onAlign,
  onFont,
  onWeight,
  onSpacing,
  onLineHeight,
  onClose,
  currentSize = "md",
  currentColor,
  currentAlign = "left",
  currentFont = "",
  currentWeight = "400",
  currentSpacing = "normal",
  currentLineHeight = "normal",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Pre-load fonts for preview
  useEffect(() => {
    FONT_LIST.forEach(f => { if (f.value) loadGoogleFont(f.value); });
  }, []);

  const handleFontChange = (font: string) => {
    if (font) loadGoogleFont(font);
    onFont(font);
  };

  // Clamp position so toolbar stays visible
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.max(8, position.top - 90),
    left: Math.max(8, position.left),
    zIndex: 99999,
  };

  return createPortal(
    <div
      ref={ref}
      style={style}
      className="flex flex-col gap-1 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl px-2 py-1.5 select-none"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Row 1: Bold, Italic, Size, Color, Align */}
      <div className="flex items-center gap-1">
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
      </div>

      {/* Row 2: Font Family, Weight, Spacing, Line Height */}
      <div className="flex items-center gap-1 border-t border-white/10 pt-1">
        <ToolbarDropdown
          label="Font"
          options={FONT_LIST.map(f => ({ label: f.name, value: f.value }))}
          value={currentFont}
          onChange={handleFontChange}
          fontPreview
        />
        <ToolbarDropdown
          label="Weight"
          options={WEIGHT_LIST}
          value={currentWeight}
          onChange={onWeight}
        />
        <ToolbarDropdown
          label="Spacing"
          options={SPACING_LIST}
          value={currentSpacing}
          onChange={onSpacing}
        />
        <ToolbarDropdown
          label="Line H."
          options={LINE_HEIGHT_LIST}
          value={currentLineHeight}
          onChange={onLineHeight}
        />
      </div>
    </div>,
    document.body
  );
};

export default BlockToolbar;
