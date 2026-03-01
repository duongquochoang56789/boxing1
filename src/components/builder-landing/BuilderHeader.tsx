import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Presentation, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const BuilderHeader = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/builder" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Presentation className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-light tracking-tight text-slate-50">
            Slide<span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Tính năng
          </a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Bảng giá
          </a>
          {user ? (
            <Button asChild size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0 text-white">
              <Link to="/slides">Dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                <Link to="/auth">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0 text-white">
                <Link to="/slides/new">Thử miễn phí</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 space-y-3"
        >
          <a href="#features" className="block text-sm text-slate-400 py-2" onClick={() => setMobileOpen(false)}>Tính năng</a>
          <a href="#pricing" className="block text-sm text-slate-400 py-2" onClick={() => setMobileOpen(false)}>Bảng giá</a>
          {user ? (
            <Button asChild size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 border-0 text-white">
              <Link to="/slides">Dashboard</Link>
            </Button>
          ) : (
            <div className="space-y-2">
              <Button asChild variant="ghost" size="sm" className="w-full text-slate-300 hover:bg-white/5">
                <Link to="/auth">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 border-0 text-white">
                <Link to="/slides/new">Thử miễn phí</Link>
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default BuilderHeader;
