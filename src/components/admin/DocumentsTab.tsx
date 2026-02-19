import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  Loader2,
  FolderOpen,
  Download,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AdminDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "business-plan", label: "Kế hoạch kinh doanh" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Vận hành" },
  { value: "finance", label: "Tài chính" },
  { value: "general", label: "Chung" },
];

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getCategoryLabel = (value: string) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const DocumentsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadForm, setUploadForm] = useState<{
    file: File | null;
    title: string;
    description: string;
    category: string;
  }>({ file: null, title: "", description: "", category: "general" });
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminDocument[];
    },
  });

  const filtered = documents.filter((doc) => {
    const matchSearch =
      search === "" ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || doc.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleFileSelect = (file: File) => {
    setUploadForm((prev) => ({
      ...prev,
      file,
      title: prev.title || file.name.replace(/\.[^.]+$/, ""),
    }));
    setUploadOpen(true);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleUpload = async () => {
    if (!uploadForm.file || !user || !uploadForm.title.trim()) return;
    setUploading(true);
    try {
      const ext = uploadForm.file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("admin-documents")
        .upload(path, uploadForm.file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("admin-documents")
        .getPublicUrl(path);

      const { error: dbError } = await supabase.from("admin_documents").insert({
        title: uploadForm.title.trim(),
        description: uploadForm.description.trim() || null,
        category: uploadForm.category,
        file_url: path,
        file_name: uploadForm.file.name,
        file_size: uploadForm.file.size,
        uploaded_by: user.id,
      });
      if (dbError) throw dbError;

      toast({ title: "✓ Upload thành công", description: uploadForm.title });
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      setUploadOpen(false);
      setUploadForm({ file: null, title: "", description: "", category: "general" });
    } catch (e: any) {
      toast({ title: "Lỗi upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenFile = async (doc: AdminDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("admin-documents")
        .createSignedUrl(doc.file_url, 3600);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (e: any) {
      toast({ title: "Lỗi mở file", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const doc = documents.find((d) => d.id === deleteId);
      if (doc) {
        await supabase.storage.from("admin-documents").remove([doc.file_url]);
      }
      const { error } = await supabase
        .from("admin_documents")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;
      toast({ title: "✓ Đã xóa tài liệu" });
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
    } catch (e: any) {
      toast({ title: "Lỗi xóa", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["doc", "docx"].includes(ext ?? "")) return "📝";
    if (["xls", "xlsx"].includes(ext ?? "")) return "📊";
    return "📁";
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                  filterCategory === cat.value
                    ? "bg-terracotta text-cream border-terracotta"
                    : "border-border text-soft-brown hover:border-terracotta/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-terracotta hover:bg-terracotta/90 text-cream flex-shrink-0"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload tài liệu
        </Button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? "border-terracotta bg-terracotta/5"
            : "border-border hover:border-terracotta/40 hover:bg-cream/30"
        }`}
      >
        <FolderOpen className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragging ? "text-terracotta" : "text-muted-foreground"}`} />
        <p className="text-sm text-soft-brown">
          <span className="text-terracotta font-medium">Kéo thả file vào đây</span> hoặc click để chọn
        </p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX · Tối đa 50MB</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
      />

      {/* Document List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-soft-brown">
            {search || filterCategory !== "all"
              ? "Không tìm thấy tài liệu phù hợp"
              : "Chưa có tài liệu nào — upload file đầu tiên"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 border border-border/60 rounded-lg bg-cream/20 hover:bg-cream/40 transition-colors group"
            >
              <span className="text-2xl flex-shrink-0">{getFileIcon(doc.file_name)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-charcoal truncate">{doc.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 flex-shrink-0">
                    {getCategoryLabel(doc.category)}
                  </span>
                </div>
                {doc.description && (
                  <p className="text-xs text-soft-brown mt-0.5 line-clamp-1">{doc.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>{doc.file_name}</span>
                  <span>·</span>
                  <span>{formatFileSize(doc.file_size)}</span>
                  <span>·</span>
                  <span>{format(new Date(doc.created_at), "dd/MM/yyyy", { locale: vi })}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenFile(doc)}
                  title="Xem / tải file"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteId(doc.id)}
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(o) => { if (!uploading) setUploadOpen(o); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload tài liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {uploadForm.file && (
              <div className="flex items-center gap-3 p-3 bg-cream/50 rounded border border-border/60">
                <span className="text-xl">{getFileIcon(uploadForm.file.name)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadForm.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uploadForm.file.size)}</p>
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Tên tài liệu *</Label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="VD: Kế hoạch kinh doanh Q1 2025"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả (tùy chọn)</Label>
              <Input
                value={uploadForm.description}
                onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Mô tả ngắn về tài liệu..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setUploadForm((p) => ({ ...p, category: cat.value }))}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      uploadForm.category === cat.value
                        ? "bg-terracotta text-cream border-terracotta"
                        : "border-border text-soft-brown hover:border-terracotta/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadOpen(false)}
              disabled={uploading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.title.trim() || !uploadForm.file}
              className="bg-terracotta hover:bg-terracotta/90 text-cream"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!deleting) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-soft-brown">
            Bạn có chắc muốn xóa tài liệu này? Hành động này không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Xóa tài liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
