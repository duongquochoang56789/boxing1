import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import heroBgImage from "@/assets/hero-bg.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
});

const HeroDemo1 = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        full_name: result.data.full_name,
        email: result.data.email,
        phone: result.data.phone,
        source: "hero-cinematic",
      });
      if (error) throw error;
      toast.success("Đăng ký thành công!");
      setFormData({ full_name: "", email: "", phone: "" });
      setOpen(false);
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/hero-options")}
          className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm bg-charcoal/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Badge */}
      <div className="fixed top-6 right-6 z-50">
        <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-terracotta text-cream px-3 py-1.5 rounded-full">
          Option 1: Cinematic Full-Bleed
        </span>
      </div>

      {/* Hero */}
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ scale: backgroundScale }}>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${heroBgImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/10" />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center text-center"
          style={{ opacity: contentOpacity }}
        >
          <div className="container-custom max-w-4xl space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-label text-cream/50 block tracking-[0.3em]"
            >
              Bay Cao. Sống Khỏe.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-cream font-light leading-[0.9]"
            >
              Tập tại nhà,
              <br />
              <span className="text-peach">thay đổi thật.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-cream/50 max-w-lg mx-auto text-sm md:text-base"
            >
              Tập luyện nhóm nhỏ trực tuyến cùng huấn luyện viên chuyên nghiệp.
              Tiện lợi, hiệu quả, chi phí hợp lý.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center justify-center gap-4"
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <MagneticButton className="bg-cream text-charcoal rounded-full h-14 px-10 group text-xs uppercase tracking-widest font-semibold hover:bg-cream/90 transition-all">
                    Đăng ký ngay
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </DialogTrigger>
                <DialogContent className="bg-charcoal border-cream/10 text-cream max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-cream">Đăng ký trải nghiệm</DialogTitle>
                    <p className="text-cream/50 text-sm">Nhận ưu đãi và lịch tập thử miễn phí</p>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Họ và tên"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full focus:border-cream/40 focus:ring-2 focus:ring-peach/30 text-sm"
                      />
                      {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email của bạn"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full focus:border-cream/40 focus:ring-2 focus:ring-peach/30 text-sm"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full focus:border-cream/40 focus:ring-2 focus:ring-peach/30 text-sm"
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <MagneticButton type="submit" className="w-full bg-cream text-charcoal rounded-full h-11 group text-xs uppercase tracking-widest font-semibold hover:bg-cream/90" disabled={submitting}>
                      {submitting ? "Đang gửi..." : "Gửi đăng ký"}
                    </MagneticButton>
                  </form>
                </DialogContent>
              </Dialog>

              <button className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm">
                <div className="w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center hover:border-cream/60 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Xem video
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            className="flex flex-col items-center gap-1.5 text-cream/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase">Khám phá</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroDemo1;
