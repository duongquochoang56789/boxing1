import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroBgImage from "@/assets/hero-bg.jpg";

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
});

const HeroDemo3 = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const statsOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.25, 0.5], [80, 0]);
  const formOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);
  const formX = useTransform(scrollYProgress, [0.4, 0.65], [100, 0]);

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
        source: "hero-storytelling",
      });
      if (error) throw error;
      toast.success("Đăng ký thành công!");
      setFormData({ full_name: "", email: "", phone: "" });
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-charcoal">
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
        <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-emerald-600 text-cream px-3 py-1.5 rounded-full">
          Option 3: Vertical Storytelling
        </span>
      </div>

      {/* Scrollable hero */}
      <div ref={containerRef} className="relative h-[200vh]">
        {/* Sticky background */}
        <motion.div className="sticky top-0 h-screen overflow-hidden" style={{ scale: bgScale }}>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${heroBgImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />
        </motion.div>

        {/* Content layers */}
        <div className="absolute inset-0">
          {/* Part 1: Heading */}
          <motion.div
            className="sticky top-0 h-screen flex items-center justify-center text-center"
            style={{ opacity: headingOpacity, y: headingY }}
          >
            <div className="space-y-6 max-w-4xl px-6">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-label text-cream/40 tracking-[0.4em] block"
              >
                FLYFIT STUDIO
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="font-display text-6xl md:text-8xl lg:text-9xl text-cream font-light leading-[0.85]"
              >
                Nơi sức mạnh
                <br />
                <span className="text-peach italic">bắt đầu.</span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Part 2: Stats + Form */}
          <div className="sticky top-0 h-screen flex items-end pb-20">
            <div className="container-custom w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-end">
                {/* Stats */}
                <motion.div className="space-y-8" style={{ opacity: statsOpacity, y: statsY }}>
                  <h2 className="font-display text-3xl md:text-4xl text-cream">
                    Con số <span className="text-peach">nói lên tất cả</span>
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { value: 500, suffix: "+", label: "Học viên" },
                      { value: 98, suffix: "%", label: "Hài lòng" },
                      { value: 15, suffix: "+", label: "HLV chuyên nghiệp" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="font-accent text-4xl md:text-5xl text-peach">
                          <AnimatedCounter end={stat.value} suffix={stat.suffix} label={stat.label} />
                        </div>
                        <p className="text-cream/50 text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Form */}
                <motion.div style={{ opacity: formOpacity, x: formX }}>
                  <div className="bg-cream/5 backdrop-blur-xl border border-cream/10 p-6 md:p-8 lg:max-w-sm lg:ml-auto">
                    <h3 className="font-display text-xl text-cream mb-1">Đăng ký trải nghiệm</h3>
                    <p className="text-cream/40 text-xs mb-5">Nhận ưu đãi và lịch tập thử miễn phí</p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <Input type="text" placeholder="Họ và tên" value={formData.full_name} onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))} className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm" />
                        {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                      </div>
                      <div>
                        <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm" />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Input type="tel" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="h-11 px-5 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm" />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <MagneticButton type="submit" className="w-full bg-cream text-charcoal rounded-full h-11 text-xs uppercase tracking-widest font-semibold" disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Đăng ký ngay"}
                        {!submitting && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
                      </MagneticButton>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDemo3;
