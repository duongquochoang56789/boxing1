import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { History, RotateCcw, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SlideVersion {
  id: string;
  slide_id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  content: string;
  layout: string;
  notes: string | null;
  version_number: number;
  created_at: string;
}

interface SlideVersionHistoryProps {
  slideId: string;
  open: boolean;
  onClose: () => void;
  onRestore: (version: { title: string; subtitle: string | null; content: string; layout: string; notes: string | null }) => void;
}

const SlideVersionHistory = ({ slideId, open, onClose, onRestore }: SlideVersionHistoryProps) => {
  const [versions, setVersions] = useState<SlideVersion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!slideId || !open) return;
    loadVersions();
  }, [slideId, open]);

  const loadVersions = async () => {
    const { data } = await supabase
      .from("slide_versions")
      .select("*")
      .eq("slide_id", slideId)
      .order("version_number", { ascending: false })
      .limit(20);
    if (data) setVersions(data as SlideVersion[]);
  };

  const handleRestore = (v: SlideVersion) => {
    onRestore({
      title: v.title,
      subtitle: v.subtitle,
      content: v.content,
      layout: v.layout,
      notes: v.notes,
    });
    toast({ title: `Đã khôi phục phiên bản #${v.version_number}` });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-[300px] shrink-0 border-l border-white/10 bg-[#0d0d0d] flex flex-col h-full"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
            <History className="w-4 h-4" />
            Lịch sử ({versions.length})
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {versions.length === 0 && (
            <p className="text-white/30 text-xs text-center py-8">Chưa có lịch sử phiên bản</p>
          )}
          {versions.map(v => (
            <div key={v.id} className="rounded-lg p-3 bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-orange-400 text-xs font-medium">v{v.version_number}</span>
                <Button size="sm" variant="ghost" onClick={() => handleRestore(v)}
                  className="text-white/30 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-[10px] gap-1">
                  <RotateCcw className="w-3 h-3" /> Khôi phục
                </Button>
              </div>
              <p className="text-white/70 text-xs font-medium truncate">{v.title}</p>
              <p className="text-white/40 text-[10px] line-clamp-2 mt-1">{v.content.slice(0, 100)}</p>
              <div className="flex items-center gap-1 text-white/20 text-[10px] mt-2">
                <Clock className="w-2.5 h-2.5" />
                {new Date(v.created_at).toLocaleString("vi")}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideVersionHistory;
