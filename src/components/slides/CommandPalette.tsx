import { useEffect, useMemo } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import {
  ArrowRight, Presentation, Grid3X3, Undo2, Redo2, Plus, Trash2, Copy,
  Layout, Download, ImageIcon, Images, Share2, MessageCircle, History,
  PenLine, Maximize2, Minimize2, FileText, Sparkles, BookmarkPlus, BookMarked,
  Maximize, Palette
} from "lucide-react";

const VALID_LAYOUTS = [
  "cover", "two-column", "stats", "grid", "table", "timeline",
  "quote", "pricing", "persona", "chart", "image-full", "comparison",
  "funnel", "swot", "process", "team"
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalSlides: number;
  currentLayout: string;
  onGoToSlide: (index: number) => void;
  onPresent: () => void;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  onDuplicateSlide: () => void;
  onChangeLayout: (layout: string) => void;
  onExportPdf: () => void;
  onExportPptx: () => void;
  onGenerateImage: () => void;
  onGenerateAllImages: () => void;
  onShare: () => void;
  onToggleComments: () => void;
  onToggleVersionHistory: () => void;
  onToggleZen: () => void;
  onSaveTemplate: () => void;
  onUseTemplate: () => void;
  onAiRewrite: () => void;
  onAiExpand: () => void;
  onAiSummarize: () => void;
  onAiNotes: () => void;
  onSaveAll: () => void;
}

const CommandPalette = ({
  open, onOpenChange, totalSlides, currentLayout,
  onGoToSlide, onPresent, onToggleGrid, onUndo, onRedo,
  onAddSlide, onDeleteSlide, onDuplicateSlide, onChangeLayout,
  onExportPdf, onExportPptx, onGenerateImage, onGenerateAllImages,
  onShare, onToggleComments, onToggleVersionHistory, onToggleZen,
  onSaveTemplate, onUseTemplate, onAiRewrite, onAiExpand, onAiSummarize,
  onAiNotes, onSaveAll,
}: CommandPaletteProps) => {

  const slideItems = useMemo(() =>
    Array.from({ length: totalSlides }, (_, i) => ({
      label: `Đi đến Slide ${i + 1}`,
      action: () => onGoToSlide(i),
    })),
    [totalSlides, onGoToSlide]
  );

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="bg-[#1a1a1a] border-white/10 text-white">
        <CommandInput placeholder="Tìm lệnh..." className="text-white placeholder:text-white/30" />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="text-white/40 py-6 text-center">Không tìm thấy lệnh</CommandEmpty>

          <CommandGroup heading="Điều hướng">
            <CommandItem onSelect={() => run(onPresent)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Presentation className="w-4 h-4 mr-2 text-orange-400" /> Trình chiếu <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">F5</kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(onToggleGrid)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Grid3X3 className="w-4 h-4 mr-2 text-orange-400" /> Grid View <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">G</kbd>
            </CommandItem>
            {slideItems.map((item, i) => (
              <CommandItem key={i} onSelect={() => run(item.action)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
                <ArrowRight className="w-4 h-4 mr-2 text-white/30" /> {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="bg-white/10" />

          <CommandGroup heading="Chỉnh sửa">
            <CommandItem onSelect={() => run(onUndo)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Undo2 className="w-4 h-4 mr-2" /> Hoàn tác <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">⌘Z</kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(onRedo)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Redo2 className="w-4 h-4 mr-2" /> Làm lại <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">⌘⇧Z</kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(onAddSlide)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Plus className="w-4 h-4 mr-2" /> Thêm slide
            </CommandItem>
            <CommandItem onSelect={() => run(onDuplicateSlide)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Copy className="w-4 h-4 mr-2" /> Nhân đôi slide <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">⌘D</kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(onDeleteSlide)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Trash2 className="w-4 h-4 mr-2 text-red-400" /> Xoá slide <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Del</kbd>
            </CommandItem>
            <CommandItem onSelect={() => run(onSaveAll)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <FileText className="w-4 h-4 mr-2" /> Lưu tất cả <kbd className="ml-auto text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">⌘S</kbd>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/10" />

          <CommandGroup heading="Layout">
            {VALID_LAYOUTS.map(l => (
              <CommandItem key={l} onSelect={() => run(() => onChangeLayout(l))}
                className={`text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white ${currentLayout === l ? "text-orange-400" : ""}`}>
                <Layout className="w-4 h-4 mr-2" /> {l} {currentLayout === l && <span className="ml-auto text-orange-400 text-xs">●</span>}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="bg-white/10" />

          <CommandGroup heading="AI">
            <CommandItem onSelect={() => run(onAiRewrite)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <PenLine className="w-4 h-4 mr-2 text-orange-400" /> Viết lại nội dung
            </CommandItem>
            <CommandItem onSelect={() => run(onAiExpand)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Maximize2 className="w-4 h-4 mr-2 text-emerald-400" /> Mở rộng nội dung
            </CommandItem>
            <CommandItem onSelect={() => run(onAiSummarize)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Minimize2 className="w-4 h-4 mr-2 text-blue-400" /> Tóm tắt nội dung
            </CommandItem>
            <CommandItem onSelect={() => run(onAiNotes)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <FileText className="w-4 h-4 mr-2 text-purple-400" /> Tạo ghi chú AI
            </CommandItem>
            <CommandItem onSelect={() => run(onGenerateImage)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Tạo ảnh AI
            </CommandItem>
            <CommandItem onSelect={() => run(onGenerateAllImages)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Images className="w-4 h-4 mr-2" /> Tạo tất cả ảnh
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/10" />

          <CommandGroup heading="Xuất & Chia sẻ">
            <CommandItem onSelect={() => run(onExportPdf)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Download className="w-4 h-4 mr-2" /> Xuất PDF
            </CommandItem>
            <CommandItem onSelect={() => run(onExportPptx)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Download className="w-4 h-4 mr-2" /> Xuất PPTX
            </CommandItem>
            <CommandItem onSelect={() => run(onShare)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Share2 className="w-4 h-4 mr-2" /> Chia sẻ & Nhúng
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/10" />

          <CommandGroup heading="Công cụ">
            <CommandItem onSelect={() => run(onToggleZen)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <Maximize className="w-4 h-4 mr-2 text-orange-400" /> Zen Mode
            </CommandItem>
            <CommandItem onSelect={() => run(onToggleComments)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <MessageCircle className="w-4 h-4 mr-2" /> Bình luận
            </CommandItem>
            <CommandItem onSelect={() => run(onToggleVersionHistory)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <History className="w-4 h-4 mr-2" /> Lịch sử phiên bản
            </CommandItem>
            <CommandItem onSelect={() => run(onSaveTemplate)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <BookmarkPlus className="w-4 h-4 mr-2" /> Lưu template
            </CommandItem>
            <CommandItem onSelect={() => run(onUseTemplate)} className="text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white">
              <BookMarked className="w-4 h-4 mr-2" /> Dùng template
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandPalette;
