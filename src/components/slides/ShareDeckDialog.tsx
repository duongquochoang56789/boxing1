import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Check, Globe, Link2, Code, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShareDeckDialogProps {
  open: boolean;
  onClose: () => void;
  deckId: string;
  deckTitle: string;
}

const ShareDeckDialog = ({ open, onClose, deckId, deckTitle }: ShareDeckDialogProps) => {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !deckId) return;
    const load = async () => {
      const { data } = await supabase
        .from("decks")
        .select("is_public, share_slug")
        .eq("id", deckId)
        .single();
      if (data) {
        setIsPublic(data.is_public);
        setShareSlug(data.share_slug);
      }
    };
    load();
  }, [open, deckId]);

  const generateSlug = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let slug = "";
    for (let i = 0; i < 8; i++) slug += chars[Math.floor(Math.random() * chars.length)];
    return slug;
  };

  const togglePublic = async (value: boolean) => {
    setLoading(true);
    const slug = value ? (shareSlug || generateSlug()) : shareSlug;
    const { error } = await supabase
      .from("decks")
      .update({ is_public: value, share_slug: slug })
      .eq("id", deckId);
    if (!error) {
      setIsPublic(value);
      setShareSlug(slug);
      toast({ title: value ? "Deck đã được công khai!" : "Deck đã ẩn" });
    }
    setLoading(false);
  };

  const baseUrl = window.location.origin;
  const shareUrl = shareSlug ? `${baseUrl}/slides/shared/${shareSlug}` : "";
  const presentUrl = `${baseUrl}/slides/${deckId}/present`;
  const embedCode = shareSlug
    ? `<iframe src="${shareUrl}" width="960" height="540" frameborder="0" allowfullscreen></iframe>`
    : "";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: `Đã copy ${label}!` });
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, label }: { text: string; label: string }) => (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => copyToClipboard(text, label)}
      className="text-white/50 hover:text-white shrink-0"
    >
      {copied === label ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-400" />
            Chia sẻ & Nhúng
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Chia sẻ "{deckTitle}" với mọi người
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Public toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Globe className={`w-5 h-5 ${isPublic ? "text-emerald-400" : "text-white/30"}`} />
              <div>
                <Label className="text-white text-sm font-medium">Công khai</Label>
                <p className="text-white/40 text-xs">Bất kỳ ai có link đều xem được</p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={togglePublic}
              disabled={loading}
            />
          </div>

          {/* Share link */}
          {isPublic && shareSlug && (
            <>
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Link chia sẻ
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="bg-white/5 border-white/10 text-white/80 text-sm flex-1"
                  />
                  <CopyBtn text={shareUrl} label="link" />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(shareUrl, "_blank")}
                    className="text-white/50 hover:text-white shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Present link */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Link trình chiếu
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={presentUrl}
                    readOnly
                    className="bg-white/5 border-white/10 text-white/80 text-sm flex-1"
                  />
                  <CopyBtn text={presentUrl} label="present link" />
                </div>
              </div>

              {/* Embed code */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Mã nhúng (Embed)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={embedCode}
                    readOnly
                    className="bg-white/5 border-white/10 text-white/80 text-xs font-mono flex-1"
                  />
                  <CopyBtn text={embedCode} label="embed code" />
                </div>
                <p className="text-white/30 text-[11px]">
                  Dán mã HTML này vào website để nhúng bài trình chiếu
                </p>
              </div>
            </>
          )}

          {!isPublic && (
            <p className="text-white/30 text-sm text-center py-4">
              Bật "Công khai" để tạo link chia sẻ và mã nhúng
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDeckDialog;
