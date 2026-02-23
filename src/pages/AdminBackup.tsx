import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import BackupTab from '@/components/admin/BackupTab';

const AdminBackup = () => {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-soft-brown hover:text-terracotta transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-label">Quản trị</span>
          </Link>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            FLY<span className="text-terracotta">FIT</span>
          </Link>
        </div>
      </header>

      <main className="container-custom py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-label text-terracotta block mb-3">Quản trị</span>
          <h1 className="heading-section text-charcoal mb-2">Sao lưu dữ liệu</h1>
          <p className="text-body text-soft-brown mb-10">
            Tải toàn bộ nội dung website về máy hoặc khôi phục từ file backup.
          </p>
        </motion.div>

        <BackupTab />
      </main>
    </div>
  );
};

export default AdminBackup;
