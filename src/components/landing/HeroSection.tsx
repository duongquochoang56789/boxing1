import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { trackLeadSubmission } from "@/hooks/useAnalytics";

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
});

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { data: content } = useSiteContent("hero");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

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
        source: "hero",
      });
      if (error) throw error;
      trackLeadSubmission("hero");
      toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      setFormData({ full_name: "", email: "", phone: "" });
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const bgImage = getContent(content, "image", "background", "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075");

  return (
    <section ref={containerRef} id="home" className="relative h-screen overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ scale: backgroundScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsla(15, 65%, 45%, 0.1) 0%, hsla(25, 60%, 85%, 0.08) 50%, transparent 100%)' }} />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-end"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="container-custom pb-20 md:pb-28 pt-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-end">
            <div className="space-y-5">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-label text-cream/70 block"
              >
                {getContent(content, "text", "label", "Premium Wellness Experience")}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="heading-display text-cream text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                {getContent(content, "text", "heading_1", "Cân bằng,")}
                <br />
                <span className="text-peach">{getContent(content, "text", "heading_2", "trọn vẹn.")}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-body text-cream/60 max-w-md text-sm md:text-base"
              >
                {getContent(content, "text", "description", "Không gian luyện tập sang trọng, nơi sự tinh tế gặp gỡ hiệu quả.")}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="lg:max-w-sm lg:ml-auto"
            >
              <div className="bg-cream/8 backdrop-blur-2xl border border-cream/15 p-6 md:p-8">
                <h3 className="heading-subsection text-cream text-lg md:text-2xl mb-1.5">
                  {getContent(content, "text", "form_title", "Đăng ký trải nghiệm")}
                </h3>
                <p className="text-body-sm text-cream/50 mb-5 text-xs md:text-sm">
                  {getContent(content, "text", "form_description", "Nhận ưu đãi và lịch tập thử miễn phí")}
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="Họ và tên"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="h-11 px-4 bg-cream/8 border-cream/15 text-cream placeholder:text-cream/35 rounded-none focus:border-peach focus:ring-peach/20 text-sm"
                    />
                    {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email của bạn"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-11 px-4 bg-cream/8 border-cream/15 text-cream placeholder:text-cream/35 rounded-none focus:border-peach focus:ring-peach/20 text-sm"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-11 px-4 bg-cream/8 border-cream/15 text-cream placeholder:text-cream/35 rounded-none focus:border-peach focus:ring-peach/20 text-sm"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <MagneticButton type="submit" className="w-full btn-primary rounded-none h-11 group text-xs" disabled={submitting}>
                    {submitting ? "Đang gửi..." : "Đăng ký ngay"}
                    {!submitting && <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                  </MagneticButton>
                </form>
                <p className="text-[11px] text-cream/30 text-center mt-3">Chúng tôi tôn trọng quyền riêng tư của bạn</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-1.5 text-cream/50 hover:text-cream transition-colors duration-300 cursor-pointer"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-label text-[10px]">Khám phá</span>
          <ChevronDown className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
