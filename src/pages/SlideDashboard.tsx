import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Presentation, Trash2, Share2, Globe, Lock, MoreVertical, Clock, Search, ArrowUpDown, CheckSquare, Square, X } from "lucide-react";
import { BrandedLoader } from "@/components/ui/branded-loader";
import { SlideRenderer } from "@/components/slides/SlideLayouts";
import LazySlideThumb from "@/components/slides/LazySlideThumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

interface Deck {
  id: string;
  title: string;
  description: string;
  slide_count: number;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
  firstSlide?: DeckSlide;
}

type SortOption = "newest" | "oldest" | "name-asc" | "most-slides";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const SlideDashboard = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const sortedDecks = [...decks].sort((a, b) => {
    switch (sortBy) {
      case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "name-asc": return a.title.localeCompare(b.title, "vi");
      case "most-slides": return b.slide_count - a.slide_count;
      default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const filteredDecks = sortedDecks.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error && data) {
        const deckIds = data.map((d: any) => d.id);
        const { data: allSlides } = await supabase
          .from("deck_slides")
          .select("*")
          .in("deck_id", deckIds)
          .order("slide_order");
        
        const firstSlideMap = new Map<string, DeckSlide>();
        if (allSlides) {
          for (const s of allSlides as DeckSlide[]) {
            if (!firstSlideMap.has((s as any).deck_id)) {
              firstSlideMap.set((s as any).deck_id, s);
            }
          }
        }
        
        setDecks(data.map((d: any) => ({ ...d, firstSlide: firstSlideMap.get(d.id) })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const deleteDeck = async (id: string, title: string) => {
    if (!confirm(`Xoá deck "${title}"?`)) return;
    await supabase.from("deck_slides").delete().eq("deck_id", id);
    await supabase.from("decks").delete().eq("id", id);
    setDecks((prev) => prev.filter((d) => d.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Đã xoá deck" });
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xoá ${selectedIds.size} deck đã chọn?`)) return;
    for (const id of selectedIds) {
      await supabase.from("deck_slides").delete().eq("deck_id", id);
      await supabase.from("decks").delete().eq("id", id);
    }
    setDecks(prev => prev.filter(d => !selectedIds.has(d.id)));
    toast({ title: `Đã xoá ${selectedIds.size} deck` });
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDecks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDecks.map(d => d.id)));
    }
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
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Slide Decks của bạn</h1>
            <p className="text-white/50 mt-1">Tạo và quản lý bộ slide thuyết trình bằng AI</p>
          </div>
          {decks.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="h-9 w-[160px] bg-white/5 border-white/10 text-white text-sm">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-white/40" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="most-slides">Nhiều slide nhất</SelectItem>
                </SelectContent>
              </Select>
              {/* Select mode toggle */}
              <Button
                size="sm"
                variant={selectMode ? "default" : "ghost"}
                onClick={() => { setSelectMode(!selectMode); setSelectedIds(new Set()); }}
                className={selectMode ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-white/50 hover:text-white"}
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Chọn
              </Button>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm deck..."
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm w-48 outline-none focus:border-orange-400/50 placeholder:text-white/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Batch action bar */}
        {selectMode && selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-400/20 rounded-xl"
          >
            <button onClick={toggleSelectAll} className="text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
              {selectedIds.size === filteredDecks.length ? <CheckSquare className="w-4 h-4 text-orange-400" /> : <Square className="w-4 h-4" />}
              {selectedIds.size === filteredDecks.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
            <span className="text-white/40">|</span>
            <span className="text-orange-400 text-sm font-medium">{selectedIds.size} đã chọn</span>
            <div className="flex-1" />
            <Button size="sm" variant="ghost" onClick={() => { setSelectedIds(new Set()); setSelectMode(false); }} className="text-white/50 hover:text-white">
              <X className="w-4 h-4 mr-1" /> Huỷ
            </Button>
            <Button size="sm" onClick={deleteSelected} className="bg-red-500/80 hover:bg-red-500 text-white">
              <Trash2 className="w-4 h-4 mr-1" /> Xoá {selectedIds.size} deck
            </Button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <BrandedLoader variant="inline" size="md" />
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
            {!search && !selectMode && (
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
            )}

            {/* Deck cards */}
            {filteredDecks.map((deck, i) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white/[0.03] border rounded-xl overflow-hidden hover:border-white/20 transition-all group ${
                  selectedIds.has(deck.id) ? "border-orange-400 ring-1 ring-orange-400/30" : "border-white/10"
                }`}
              >
                {/* Preview area */}
                <div className="relative">
                  {selectMode && (
                    <button
                      onClick={() => toggleSelect(deck.id)}
                      className="absolute top-3 left-3 z-10 p-1 rounded bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      {selectedIds.has(deck.id) ? (
                        <CheckSquare className="w-5 h-5 text-orange-400" />
                      ) : (
                        <Square className="w-5 h-5 text-white/50" />
                      )}
                    </button>
                  )}
                  <Link
                    to={selectMode ? "#" : `/slides/${deck.id}`}
                    onClick={(e) => { if (selectMode) { e.preventDefault(); toggleSelect(deck.id); } }}
                    className="block aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#16213e] relative overflow-hidden"
                  >
                    {deck.firstSlide ? (
                      <div className="absolute inset-0">
                        <LazySlideThumb slide={deck.firstSlide} scale={0.188} className="w-full h-full rounded-none" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Presentation className="w-12 h-12 text-white/10" />
                      </div>
                    )}
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
                </div>

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
                    {!selectMode && (
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
                    )}
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
