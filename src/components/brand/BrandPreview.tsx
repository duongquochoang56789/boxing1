import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, ImageIcon, Download, Pencil } from "lucide-react";

interface BrandKit {
  name: string;
  slogan: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  heading_font: string;
  body_font: string;
  accent_font: string;
}

interface BrandPreviewProps {
  brand: BrandKit;
  onUpdate: (field: keyof BrandKit, value: string) => void;
  onSave: () => void;
  onGenerateLogo: () => void;
  onExportPdf: () => void;
  saving: boolean;
  generatingLogo: boolean;
  exportingPdf: boolean;
}

const ColorSwatch = ({ color, label, onChange }: { color: string; label: string; onChange: (c: string) => void }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="relative group">
      <div className="w-14 h-14 rounded-lg shadow-lg border border-white/10 cursor-pointer" style={{ backgroundColor: color }} />
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      <Pencil className="w-3 h-3 text-white/60 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <span className="text-[10px] text-white/40">{label}</span>
    <span className="text-[10px] text-white/60 font-mono">{color}</span>
  </div>
);

const BrandPreview = ({ brand, onUpdate, onSave, onGenerateLogo, onExportPdf, saving, generatingLogo, exportingPdf }: BrandPreviewProps) => {
  const [editingSlogan, setEditingSlogan] = useState(false);

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt="Logo" className="w-32 h-32 object-contain mx-auto rounded-xl bg-white/5 p-2" />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white/20" />
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onGenerateLogo} disabled={generatingLogo}
          className="mt-2 text-orange-400 hover:text-orange-300 text-xs gap-1.5">
          {generatingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
          {generatingLogo ? "Đang tạo..." : brand.logo_url ? "Tạo lại logo" : "Tạo logo AI"}
        </Button>
      </div>

      {/* Name + Slogan */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-bold text-white">{brand.name}</h3>
        {editingSlogan ? (
          <Input value={brand.slogan} onChange={(e) => onUpdate("slogan", e.target.value)}
            onBlur={() => setEditingSlogan(false)} autoFocus
            className="bg-white/5 border-white/10 text-white text-center text-sm max-w-xs mx-auto" />
        ) : (
          <p className="text-white/60 text-sm italic cursor-pointer hover:text-white/80 transition-colors"
            onClick={() => setEditingSlogan(true)}>
            {brand.slogan || "Chưa có slogan"} <Pencil className="w-3 h-3 inline ml-1" />
          </p>
        )}
      </div>

      {/* Color Palette */}
      <div>
        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Bảng màu</h4>
        <div className="flex justify-center gap-4">
          <ColorSwatch color={brand.primary_color} label="Primary" onChange={(c) => onUpdate("primary_color", c)} />
          <ColorSwatch color={brand.secondary_color} label="Secondary" onChange={(c) => onUpdate("secondary_color", c)} />
          <ColorSwatch color={brand.accent_color} label="Accent" onChange={(c) => onUpdate("accent_color", c)} />
          <ColorSwatch color={brand.bg_color} label="Background" onChange={(c) => onUpdate("bg_color", c)} />
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Typography</h4>
        <div className="space-y-2 bg-white/5 rounded-lg p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-white/30">Heading</span>
            <span className="text-xl text-white" style={{ fontFamily: brand.heading_font }}>{brand.heading_font}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-white/30">Body</span>
            <span className="text-base text-white/70" style={{ fontFamily: brand.body_font }}>{brand.body_font}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-white/30">Accent</span>
            <span className="text-sm text-white/50 uppercase tracking-wider" style={{ fontFamily: brand.accent_font }}>{brand.accent_font}</span>
          </div>
        </div>
      </div>

      {/* Brand preview card */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: brand.bg_color }}>
        <div className="p-6 text-center space-y-2">
          <h5 className="text-lg font-bold" style={{ color: brand.primary_color, fontFamily: brand.heading_font }}>
            {brand.name}
          </h5>
          <p className="text-sm" style={{ color: brand.secondary_color, fontFamily: brand.body_font }}>
            {brand.slogan}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded text-xs text-white" style={{ backgroundColor: brand.primary_color }}>{brand.name}</span>
            <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: brand.accent_color, color: brand.bg_color }}>{brand.accent_font}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Đang lưu..." : "Lưu Brand Kit"}
        </Button>
        <Button variant="outline" onClick={onExportPdf} disabled={exportingPdf}
          className="border-white/20 text-white hover:bg-white/10 gap-2">
          {exportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF
        </Button>
      </div>
    </div>
  );
};

export default BrandPreview;
