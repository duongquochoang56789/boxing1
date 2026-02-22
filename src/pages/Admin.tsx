import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, BarChart3, Users, Settings, Presentation } from 'lucide-react';

const adminLinks = [
  { title: 'Quản lý nội dung', description: 'Chỉnh sửa nội dung website, tài liệu, slides', icon: FileText, href: '/admin/content' },
  { title: 'Thuyết trình dự án', description: 'Xem 30 slides thuyết trình FLYFIT', icon: Presentation, href: '/project' },
];

const Admin = () => {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-soft-brown hover:text-terracotta transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-label">Dashboard</span>
          </Link>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            FLY<span className="text-terracotta">FIT</span>
          </Link>
        </div>
      </header>

      <main className="container-custom py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-label text-terracotta block mb-3">Quản trị</span>
          <h1 className="heading-section text-charcoal mb-2">Admin Dashboard</h1>
          <p className="text-body text-soft-brown mb-10">Quản lý toàn bộ hệ thống FLYFIT.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group block p-8 bg-background border border-border/50 hover:border-terracotta/50 hover:shadow-xl hover:shadow-terracotta/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center mb-5 group-hover:bg-terracotta/20 transition-colors">
                <link.icon className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-lg font-medium text-charcoal mb-1 group-hover:text-terracotta transition-colors">
                {link.title}
              </h3>
              <p className="text-body-sm text-soft-brown">{link.description}</p>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
