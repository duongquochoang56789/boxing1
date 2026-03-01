import { Link } from "react-router-dom";
import { Presentation } from "lucide-react";

const BuilderFooter = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/builder" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Presentation className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-light text-slate-300">
              Slide<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/slides" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Bảng giá</a>
            <a href="#features" className="hover:text-slate-300 transition-colors">Tính năng</a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SlideAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BuilderFooter;
