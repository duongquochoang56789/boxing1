import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Trash2, CheckCircle, Circle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  slide_id: string;
  user_id: string;
  content: string;
  resolved: boolean;
  created_at: string;
  profile_name?: string;
}

interface SlideCommentsProps {
  slideId: string;
  open: boolean;
  onClose: () => void;
}

const SlideComments = ({ slideId, open, onClose }: SlideCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  useEffect(() => {
    if (!slideId || !open) return;
    loadComments();

    // Realtime subscription
    const channel = supabase
      .channel(`comments-${slideId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'slide_comments',
        filter: `slide_id=eq.${slideId}`,
      }, () => loadComments())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slideId, open]);

  const loadComments = async () => {
    const { data } = await supabase
      .from("slide_comments")
      .select("*")
      .eq("slide_id", slideId)
      .order("created_at", { ascending: true });
    if (data) setComments(data as Comment[]);
  };

  const addComment = async () => {
    if (!newComment.trim() || !userId) return;
    setLoading(true);
    await supabase.from("slide_comments").insert({
      slide_id: slideId,
      user_id: userId,
      content: newComment.trim(),
    });
    setNewComment("");
    setLoading(false);
  };

  const toggleResolved = async (comment: Comment) => {
    await supabase.from("slide_comments")
      .update({ resolved: !comment.resolved })
      .eq("id", comment.id);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("slide_comments").delete().eq("id", id);
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
            <MessageCircle className="w-4 h-4" />
            Bình luận ({comments.length})
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-white/30 text-xs text-center py-8">Chưa có bình luận nào</p>
          )}
          {comments.map(c => (
            <div key={c.id} className={`rounded-lg p-3 text-sm ${c.resolved ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-white/5 border border-white/10"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className={`text-white/80 leading-relaxed flex-1 ${c.resolved ? "line-through opacity-50" : ""}`}>
                  {c.content}
                </p>
                {c.user_id === userId && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleResolved(c)} className="text-white/30 hover:text-emerald-400 transition-colors p-0.5">
                      {c.resolved ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteComment(c.id)} className="text-white/30 hover:text-red-400 transition-colors p-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-white/20 text-[10px] mt-1 block">
                {new Date(c.created_at).toLocaleString("vi")}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3 flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
            placeholder="Viết bình luận..."
            className="bg-white/5 border-white/10 text-white text-xs resize-none h-16 placeholder:text-white/20"
          />
          <Button size="sm" onClick={addComment} disabled={!newComment.trim() || loading}
            className="bg-orange-500 hover:bg-orange-600 text-white shrink-0 self-end h-8 w-8 p-0">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideComments;
