import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { trackLeadSubmission } from "@/hooks/useAnalytics";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
});

const CTASection = () => {
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { data: content } = useSiteContent("cta");

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
        source: "cta",
      });
      if (error) throw error;
      trackLeadSubmission("cta");
      toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      setFormData({ full_name: "", email: "", phone: "" });
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const bgImage = getContent(content, "image", "background", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070");

  const inputClasses = "h-14 md:h-16 px-6 bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-base focus:ring-2 focus:ring-peach/30 focus:border-cream/40";

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/75" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsla(15, 50%, 40%, 0.25) 0%, hsla(25, 50%, 70%, 0.15) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="heading-section text-cream text-3xl md:text-4xl lg:text-5xl mb-3">
            {getContent(content, "text", "heading", "Bắt Đầu Hành Trình Của Bạn")}
          </h2>
          <p className="text-body text-cream/60 mb-10 max-w-2xl text-sm md:text-base">
            {getContent(content, "text", "description", "Để lại thông tin để FLYFIT đồng hành cùng bạn trên chặng đường nâng tầm sức khoẻ và phong cách sống.")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
            <div>
              <Input
                type="text"
                placeholder="Họ và tên"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className={inputClasses}
              />
              {errors.full_name && <p className="text-red-300 text-xs mt-1.5">{errors.full_name}</p>}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={inputClasses}
              />
              {errors.email && <p className="text-red-300 text-xs mt-1.5">{errors.email}</p>}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={inputClasses}
              />
              {errors.phone && <p className="text-red-300 text-xs mt-1.5">{errors.phone}</p>}
            </div>

            <MagneticButton
              type="submit"
              className="w-full bg-cream text-charcoal rounded-full h-14 md:h-16 px-10 text-sm md:text-base uppercase tracking-widest font-semibold group hover:bg-cream/90 transition-all"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Đăng ký ngay"}
              {!submitting && <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </MagneticButton>
          </form>

          <p className="text-cream/40 text-sm mt-6">Chúng tôi tôn trọng quyền riêng tư của bạn</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
