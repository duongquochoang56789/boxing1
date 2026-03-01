import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Presentation, Save, Undo2, Redo2, Loader2, Check,
  MoreHorizontal, ImageIcon, Images, X, Palette, Share2, Download,
  BookmarkPlus, BookMarked, MessageCircle, History, Grid3X3,
  PanelLeftClose, PanelLeft, ChevronDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ThemePreset {
  id: string;
  name: string;
  colors: string[];
  label: string;
}

interface FloatingToolbarProps {
  deckId?: string;
  deckTitle: string;
  currentIndex: number;
  totalSlides: number;
  saveStatus: "idle" | "saving" | "saved";
  saving: boolean;
  generatingImage: boolean;
  hasImagePrompt: boolean;
  batchGenerating: boolean;
  batchProgress: number;
  batchTotal: number;
  hasUngeneratedImages: boolean;
  exportingPdf: boolean;
  exportingPptx: boolean;
  deckTheme: string;
  deckTransition: string;
  showComments: boolean;
  showVersionHistory: boolean;
  sidebarCollapsed: boolean;
  templateCount: number;
  themePresets: ThemePreset[];
  onUndo: () => void;
  onRedo: () => void;
  onSaveAll: () => void;
  onGenerateImage: () => void;
  onGenerateAllImages: () => void;
  onCancelBatch: () => void;
  onExportPdf: () => void;
  onExportPptx: () => void;
  onApplyTheme: (id: string) => void;
  onUpdateTransition: (t: string) => void;
  onShare: () => void;
  onToggleComments: () => void;
  onToggleVersionHistory: () => void;
  onToggleGrid: () => void;
  onToggleSidebar: () => void;
  onSaveTemplate: () => void;
  onUseTemplate: () => void;
  onPresent: () => void;
}

const FloatingToolbar = ({
  deckId,
  deckTitle,
  currentIndex,
  totalSlides,
  saveStatus,
  saving,
  generatingImage,
  hasImagePrompt,
  batchGenerating,
  batchProgress,
  batchTotal,
  hasUngeneratedImages,
  exportingPdf,
  exportingPptx,
  deckTheme,
  deckTransition,
  showComments,
  showVersionHistory,
  sidebarCollapsed,
  templateCount,
  themePresets,
  onUndo,
  onRedo,
  onSaveAll,
  onGenerateImage,
  onGenerateAllImages,
  onCancelBatch,
  onExportPdf,
  onExportPptx,
  onApplyTheme,
  onUpdateTransition,
  onShare,
  onToggleComments,
  onToggleVersionHistory,
  onToggleGrid,
  onToggleSidebar,
  onSaveTemplate,
  onUseTemplate,
  onPresent,
}: FloatingToolbarProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5"
    >
      {/* Back + Title (always visible, left-aligned) */}
      <div className="flex items-center gap-2 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-1.5 shadow-2xl">
        <Link to="/slides" className="p-1 text-white/40 hover:text-white rounded transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-white/50 text-xs truncate max-w-[140px]">{deckTitle}</span>
        <span className="text-white/20 text-[10px]">{currentIndex + 1}/{totalSlides}</span>
      </div>

      {/* Core actions (always visible) */}
      <div className="flex items-center gap-1 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl px-2 py-1.5 shadow-2xl">
        {/* Undo/Redo */}
        <Button size="sm" variant="ghost" onClick={onUndo} className="text-white/40 hover:text-white p-1.5 h-7 w-7" title="Ctrl+Z">
          <Undo2 className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onRedo} className="text-white/40 hover:text-white p-1.5 h-7 w-7" title="Ctrl+Shift+Z">
          <Redo2 className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-white/10 mx-0.5" />

        {/* Save status */}
        {saveStatus === "saving" && (
          <span className="flex items-center gap-1 text-orange-400 text-[10px] animate-pulse px-1">
            <Loader2 className="w-3 h-3 animate-spin" />
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex items-center text-emerald-400 px-1">
            <Check className="w-3 h-3" />
          </span>
        )}

        {/* Sidebar toggle */}
        <Button size="sm" variant="ghost" onClick={onToggleSidebar} className="text-white/40 hover:text-white p-1.5 h-7 w-7" title="Toggle sidebar">
          {sidebarCollapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </Button>

        {/* Grid */}
        <Button size="sm" variant="ghost" onClick={onToggleGrid} className="text-white/40 hover:text-white p-1.5 h-7 w-7" title="Grid (G)">
          <Grid3X3 className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-white/10 mx-0.5" />

        {/* Present */}
        <Button size="sm" onClick={onPresent} className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 text-xs gap-1.5">
          <Presentation className="w-3.5 h-3.5" /> Trình chiếu
        </Button>

        {/* More actions */}
        <Popover open={expanded} onOpenChange={setExpanded}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="text-white/40 hover:text-white p-1.5 h-7 w-7">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[280px] bg-[#1a1a1a] border-white/10 p-0">
            <ExpandedMenu
              saving={saving}
              generatingImage={generatingImage}
              hasImagePrompt={hasImagePrompt}
              batchGenerating={batchGenerating}
              batchProgress={batchProgress}
              batchTotal={batchTotal}
              hasUngeneratedImages={hasUngeneratedImages}
              exportingPdf={exportingPdf}
              exportingPptx={exportingPptx}
              deckTheme={deckTheme}
              deckTransition={deckTransition}
              showComments={showComments}
              showVersionHistory={showVersionHistory}
              templateCount={templateCount}
              themePresets={themePresets}
              onSaveAll={onSaveAll}
              onGenerateImage={onGenerateImage}
              onGenerateAllImages={onGenerateAllImages}
              onCancelBatch={onCancelBatch}
              onExportPdf={onExportPdf}
              onExportPptx={onExportPptx}
              onApplyTheme={onApplyTheme}
              onUpdateTransition={onUpdateTransition}
              onShare={onShare}
              onToggleComments={onToggleComments}
              onToggleVersionHistory={onToggleVersionHistory}
              onSaveTemplate={onSaveTemplate}
              onUseTemplate={onUseTemplate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
};

/* Expanded menu inside popover */
const ExpandedMenu = ({
  saving, generatingImage, hasImagePrompt, batchGenerating, batchProgress, batchTotal,
  hasUngeneratedImages, exportingPdf, exportingPptx, deckTheme, deckTransition,
  showComments, showVersionHistory, templateCount, themePresets,
  onSaveAll, onGenerateImage, onGenerateAllImages, onCancelBatch,
  onExportPdf, onExportPptx, onApplyTheme, onUpdateTransition,
  onShare, onToggleComments, onToggleVersionHistory, onSaveTemplate, onUseTemplate,
}: Omit<FloatingToolbarProps, 'deckId' | 'deckTitle' | 'currentIndex' | 'totalSlides' | 'saveStatus' | 'sidebarCollapsed' | 'onUndo' | 'onRedo' | 'onToggleGrid' | 'onToggleSidebar' | 'onPresent'>) => {
  const [showThemes, setShowThemes] = useState(false);

  const MenuItem = ({ icon: Icon, label, onClick, disabled, active, destructive }: {
    icon: any; label: string; onClick: () => void; disabled?: boolean; active?: boolean; destructive?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors disabled:opacity-40 ${
        active ? "text-orange-400 bg-orange-400/10" : destructive ? "text-red-400 hover:bg-red-400/10" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="py-1">
      {/* AI Images section */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">AI Ảnh</span>
      </div>
      <MenuItem icon={ImageIcon} label={generatingImage ? "Đang tạo..." : "Tạo ảnh AI"} onClick={onGenerateImage} disabled={generatingImage || !hasImagePrompt} />
      {batchGenerating ? (
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex-1">
            <Progress value={(batchProgress / batchTotal) * 100} className="h-1.5" />
          </div>
          <span className="text-white/50 text-[10px]">{batchProgress}/{batchTotal}</span>
          <button onClick={onCancelBatch} className="text-red-400/60 hover:text-red-400 p-0.5">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <MenuItem icon={Images} label="Tạo tất cả ảnh" onClick={onGenerateAllImages} disabled={generatingImage || !hasUngeneratedImages} />
      )}

      <div className="border-t border-white/10 my-1" />

      {/* Theme */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Giao diện</span>
      </div>
      <button
        onClick={() => setShowThemes(!showThemes)}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <Palette className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Theme</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${showThemes ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {showThemes && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pb-2 space-y-1">
              <div className="grid grid-cols-4 gap-1">
                {themePresets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => onApplyTheme(t.id)}
                    className={`p-1.5 rounded text-center text-[11px] transition-colors ${
                      deckTheme === t.id ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-400/30" : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                    title={t.name}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 mt-1.5">
                {["fade", "slide", "zoom"].map(t => (
                  <button key={t} onClick={() => onUpdateTransition(t)}
                    className={`flex-1 px-2 py-1 text-[10px] rounded capitalize transition-colors ${
                      deckTransition === t ? "bg-orange-500/20 text-orange-400" : "text-white/40 hover:text-white/70 bg-white/5"
                    }`}>{t}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-white/10 my-1" />

      {/* Actions */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Hành động</span>
      </div>
      <MenuItem icon={Save} label={saving ? "Đang lưu..." : "Lưu tất cả"} onClick={onSaveAll} disabled={saving} />
      <MenuItem icon={Share2} label="Chia sẻ & Nhúng" onClick={onShare} />
      <MenuItem icon={Download} label={exportingPdf ? "Đang xuất..." : "Xuất PDF"} onClick={onExportPdf} disabled={exportingPdf} />
      <MenuItem icon={Download} label={exportingPptx ? "Đang xuất..." : "Xuất PPTX"} onClick={onExportPptx} disabled={exportingPptx} />

      <div className="border-t border-white/10 my-1" />

      {/* Tools */}
      <div className="px-3 py-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Công cụ</span>
      </div>
      <MenuItem icon={MessageCircle} label="Bình luận" onClick={onToggleComments} active={showComments} />
      <MenuItem icon={History} label="Lịch sử phiên bản" onClick={onToggleVersionHistory} active={showVersionHistory} />
      <MenuItem icon={BookmarkPlus} label="Lưu template" onClick={onSaveTemplate} />
      <MenuItem icon={BookMarked} label={`Dùng template (${templateCount})`} onClick={onUseTemplate} />
    </div>
  );
};

export default FloatingToolbar;
