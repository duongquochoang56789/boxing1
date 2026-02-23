import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Presentation, Trash2, Share2, Globe, Lock, Loader2, MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deck {
  id: string;
  title: string;
  description: string;
  slide_count: number;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
}

const SlideDashboard = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error && data) setDecks(data);
      setLoading(false);
    };
    load();
  }, []);

  const deleteDeck = async (id: string, title: string) => {
    if (!confirm(`Xoá deck "${title}"?`)) return;
    await supabase.from("deck_slides").delete().eq("deck_id", id);
    await supabase.from("decks").delete().eq("id", id);
    setDecks((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Đã xoá deck" });
  };

  const togglePublic = async (deck: Deck) => {
    const slug = deck.is_public ? null : deck.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) + "-" + Date.now();
    const { error } = await supabase
      .from("decks")
      .update({ is_public: !deck.is_public, share_slug: slug })
      .eq("id", deck.id);
    if (!error) {
      setDecks((prev) =>
        prev.map((d) => (d.id === deck.id ? { ...d, is_public: !d.is_public, share_slug: slug } : d))
      );
      toast({ title: deck.is_public ? "Đã ẩn deck" : "Đã public deck" });
    }
  };

  const copyShareLink = (slug: string) => {
    const url = `${window.location.origin}/slides/shared/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Đã copy link chia sẻ!" });
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">FLY<span className="text-orange-400">SLIDES</span></span>
          </Link>
          <Button
            onClick={() => navigate("/slides/new")}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo mới
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Slide Decks của bạn</h1>
          <p className="text-white/50 mt-1">Tạo và quản lý bộ slide thuyết trình bằng AI</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-orange-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Presentation className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Chưa có slide deck nào</h2>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              Nhập chủ đề bất kỳ, AI sẽ tạo bộ slide thuyết trình hoàn chỉnh trong vài giây.
            </p>
            <Button
              onClick={() => navigate("/slides/new")}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Tạo Slide Deck đầu tiên
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* New deck card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate("/slides/new")}
              className="border-2 border-dashed border-white/10 hover:border-orange-400/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-orange-400 transition-all min-h-[200px] group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-orange-400/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Tạo deck mới</span>
            </motion.button>

            {/* Deck cards */}
            {decks.map((deck, i) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
              >
                {/* Preview area */}
                <Link
                  to={`/slides/${deck.id}`}
                  className="block aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#16213e] relative overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Presentation className="w-12 h-12 text-white/10" />
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 bg-black/50 text-white/60 rounded-full">
                      {deck.slide_count} slides
                    </span>
                    {deck.is_public && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> Public
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/slides/${deck.id}`} className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate hover:text-orange-400 transition-colors">
                        {deck.title}
                      </h3>
                      <p className="text-white/40 text-sm mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(deck.updated_at)}
                      </p>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/30 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                        <DropdownMenuItem
                          onClick={() => navigate(`/slides/${deck.id}`)}
                          className="text-white/70 hover:text-white focus:text-white focus:bg-white/10"
                        >
                          <Presentation className="w-4 h-4 mr-2" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/slides/${deck.id}/present`)}
                          className="text-white/70 hover:text-white focus:text-white focus:bg-white/10"
                        >
                          <Presentation className="w-4 h-4 mr-2" /> Trình chiếu
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => togglePublic(deck)}
                          className="text-white/70 hover:text-white focus:text-white focus:bg-white/10"
                        >
                          {deck.is_public ? <Lock className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                          {deck.is_public ? "Đặt riêng tư" : "Công khai"}
                        </DropdownMenuItem>
                        {deck.is_public && deck.share_slug && (
                          <DropdownMenuItem
                            onClick={() => copyShareLink(deck.share_slug!)}
                            className="text-white/70 hover:text-white focus:text-white focus:bg-white/10"
                          >
                            <Share2 className="w-4 h-4 mr-2" /> Copy link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => deleteDeck(deck.id, deck.title)}
                          className="text-red-400/70 hover:text-red-400 focus:text-red-400 focus:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SlideDashboard;
