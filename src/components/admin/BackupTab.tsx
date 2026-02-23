import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Clock, FileJson, AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackupFile {
  name: string;
  created_at: string;
  metadata: Record<string, any> | null;
}

const BackupTab = () => {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBackupList();
  }, []);

  const loadBackupList = async () => {
    setListLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('backup-database', {
        body: null,
        method: 'GET',
      });
      // Use list action via query param workaround - call with list action
      const { data: listData } = await supabase.storage
        .from('backups')
        .list('', { sortBy: { column: 'created_at', order: 'desc' } });
      
      if (listData) {
        setBackupFiles(listData.filter(f => f.name.endsWith('.json')) as BackupFile[]);
      }
    } catch (e) {
      console.error('Error loading backup list:', e);
    } finally {
      setListLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('backup-database');

      if (error) throw error;

      if (data?.backup) {
        // Download as file
        const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName || `flyfit-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: 'Sao lưu thành công!',
          description: `File "${data.fileName}" đã được tải về máy và lưu trên hệ thống.`,
        });

        loadBackupList();
      }
    } catch (e: any) {
      toast({
        title: 'Lỗi sao lưu',
        description: e.message || 'Không thể tạo backup. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.tables) {
        throw new Error('File backup không hợp lệ. Vui lòng chọn file đúng định dạng.');
      }

      const { data, error } = await supabase.functions.invoke('restore-database', {
        body: { backup },
      });

      if (error) throw error;

      const failedTables = Object.entries(data.results || {})
        .filter(([, r]: [string, any]) => !r.success)
        .map(([t]) => t);

      if (failedTables.length > 0) {
        toast({
          title: 'Khôi phục hoàn tất (có lỗi)',
          description: `Một số bảng gặp lỗi: ${failedTables.join(', ')}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Khôi phục thành công!',
          description: 'Toàn bộ dữ liệu đã được nhập lại từ file backup.',
        });
      }
    } catch (e: any) {
      toast({
        title: 'Lỗi khôi phục',
        description: e.message || 'Không thể khôi phục dữ liệu.',
        variant: 'destructive',
      });
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 gap-5"
      >
        <Card className="border-border/50">
          <CardHeader>
            <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center mb-3">
              <Download className="w-6 h-6 text-terracotta" />
            </div>
            <CardTitle className="font-display text-lg text-charcoal">Tải backup về máy</CardTitle>
            <CardDescription className="text-soft-brown">
              Tải toàn bộ nội dung landing page, slide thuyết trình, hồ sơ, phân quyền về 1 file JSON.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackup} disabled={loading} className="w-full bg-terracotta hover:bg-terracotta/90">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo backup...</>
              ) : (
                <><Download className="w-4 h-4" /> Tải backup ngay</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-terracotta" />
            </div>
            <CardTitle className="font-display text-lg text-charcoal">Khôi phục từ file</CardTitle>
            <CardDescription className="text-soft-brown">
              Upload file JSON đã tải trước đó để nhập lại toàn bộ dữ liệu vào hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={restoring}
              variant="outline"
              className="w-full border-terracotta/50 text-terracotta hover:bg-terracotta/10"
            >
              {restoring ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Đang khôi phục...</>
              ) : (
                <><Upload className="w-4 h-4" /> Chọn file backup</>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warning */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 space-y-1">
                <p className="font-medium">Lưu ý quan trọng:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Backup <strong>không bao gồm</strong> tài khoản đăng nhập (email/mật khẩu) — cần tạo lại thủ công.</li>
                  <li>Backup <strong>không bao gồm</strong> hình ảnh đã upload — cần tải riêng hoặc upload lại.</li>
                  <li>Khôi phục sẽ <strong>ghi đè</strong> dữ liệu hiện có nếu trùng ID.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Backup history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-terracotta" />
              <CardTitle className="font-display text-lg text-charcoal">Lịch sử backup</CardTitle>
            </div>
            <CardDescription className="text-soft-brown">
              Các file backup đã tạo trước đó (lưu trên hệ thống).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
              </div>
            ) : backupFiles.length === 0 ? (
              <p className="text-soft-brown text-sm text-center py-8">Chưa có backup nào. Bấm "Tải backup ngay" để tạo.</p>
            ) : (
              <div className="space-y-3">
                {backupFiles.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-3 bg-cream/50 border border-border/30">
                    <div className="flex items-center gap-3">
                      <FileJson className="w-5 h-5 text-terracotta" />
                      <div>
                        <p className="text-sm font-medium text-charcoal">{file.name}</p>
                        <p className="text-xs text-soft-brown">
                          {formatDate(file.created_at)}
                          {file.metadata?.size && ` • ${formatFileSize(file.metadata.size)}`}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Manual backup guide */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-terracotta" />
              <CardTitle className="font-display text-lg text-charcoal">Hướng dẫn backup thủ công</CardTitle>
            </div>
            <CardDescription className="text-soft-brown">
              Cách backup trực tiếp qua giao diện Lovable Cloud (phòng trường hợp cần backup từng bảng riêng).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Mở Lovable Cloud', desc: 'Trong giao diện Lovable, bấm vào tab "Cloud" phía trên cửa sổ xem trước (preview).' },
                { step: 2, title: 'Vào phần Database', desc: 'Chọn mục "Database" > "Tables" để xem danh sách tất cả các bảng dữ liệu.' },
                { step: 3, title: 'Export từng bảng', desc: 'Chọn bảng cần backup (ví dụ: site_content), bấm nút "Export" để tải file CSV về máy.' },
                { step: 4, title: 'Lặp lại', desc: 'Làm tương tự cho các bảng quan trọng: site_content, project_slides, profiles, user_roles.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-terracotta/10 flex items-center justify-center shrink-0 text-sm font-bold text-terracotta">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{item.title}</p>
                    <p className="text-sm text-soft-brown">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BackupTab;
