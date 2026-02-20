import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-[120px] md:text-[180px] font-bold text-terracotta/15 leading-none select-none"
        >
          404
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal -mt-8 mb-4">
          Trang không <span className="text-terracotta">tồn tại</span>
        </h1>
        <p className="text-body text-soft-brown mb-10 max-w-sm mx-auto">
          Đường dẫn bạn tìm kiếm không có hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta text-cream text-sm font-medium hover:bg-terracotta/90 transition-colors duration-300"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-terracotta text-terracotta text-sm font-medium hover:bg-terracotta hover:text-cream transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
