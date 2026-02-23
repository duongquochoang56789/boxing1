import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useNavigate } from "react-router-dom";

const HeroDemo5 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/hero-options")}
          className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors text-sm bg-cream/80 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Badge */}
      <div className="fixed top-6 right-6 z-50">
        <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-charcoal text-cream px-3 py-1.5 rounded-full">
          Option 5: Minimal Typography
        </span>
      </div>

      {/* Hero */}
      <div className="h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 flex justify-between items-center"
        >
          <span className="font-display text-xl text-charcoal tracking-wider">FLYFIT</span>
          <span className="text-[10px] text-charcoal/40 tracking-[0.3em] uppercase">Studio & Training</span>
        </motion.div>

        {/* Center: Typography hero */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-6xl">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] text-charcoal font-light leading-[0.85] tracking-tight"
            >
              Tập tại nhà
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] text-terracotta font-light leading-[0.85] italic tracking-tight"
            >
              thay đổi thật
            </motion.h1>
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="pb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-charcoal/50 text-sm max-w-sm text-center md:text-left">
            Tập luyện nhóm nhỏ trực tuyến cùng huấn luyện viên chuyên nghiệp. Tiện lợi, hiệu quả.
          </p>

          <MagneticButton
            onClick={() => {
              const el = document.getElementById("register-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-charcoal text-cream rounded-full h-14 px-10 group text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-all"
          >
            Đăng ký ngay
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Register section below fold */}
      <div id="register-section" className="min-h-[60vh] bg-charcoal flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <h2 className="font-display text-3xl md:text-4xl text-cream">Bắt đầu hành trình</h2>
          <p className="text-cream/50 text-sm">Nhận ưu đãi và lịch tập thử miễn phí</p>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              // Form handled in next section
            }}
          >
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full h-12 px-5 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm focus:outline-none focus:border-cream/40 transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-12 px-5 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm focus:outline-none focus:border-cream/40 transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full h-12 px-5 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm focus:outline-none focus:border-cream/40 transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
            <MagneticButton type="submit" className="w-full bg-cream text-charcoal rounded-full h-12 text-xs uppercase tracking-widest font-semibold hover:bg-cream/90">
              Gửi đăng ký
              <ArrowRight className="ml-2 w-4 h-4" />
            </MagneticButton>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroDemo5;
