import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Dumbbell, Gift, UserPlus } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
});

const HeroDemo4 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
        email: "",
        phone: result.data.phone,
        source: "hero-cards",
      });
      if (error) throw error;
      toast.success("Đăng ký thành công!");
      setFormData({ full_name: "", phone: "" });
    } catch {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    {
      icon: Dumbbell,
      title: "FLY Class",
      subtitle: "Dịch vụ nổi bật",
      description: "Tập nhóm nhỏ 5-7 người với HLV chuyên nghiệp. Online & Offline kết hợp.",
      cta: "Tìm hiểu thêm",
      color: "from-terracotta/20 to-terracotta/5",
      borderColor: "border-terracotta/20 hover:border-terracotta/40",
    },
    {
      icon: Gift,
      title: "Ưu đãi tháng này",
      subtitle: "Khuyến mãi",
      description: "Giảm 30% gói 3 tháng đầu tiên. Tặng kèm 1 buổi PT miễn phí.",
      cta: "Xem chi tiết",
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
    },
  ];

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
        <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-violet-600 text-cream px-3 py-1.5 rounded-full">
          Option 4: Card-Based Modular
        </span>
      </div>

      {/* Hero */}
      <div className="min-h-screen flex flex-col justify-center">
        {/* Upper: Heading */}
        <div className="container-custom pt-24 pb-8 text-center flex-1 flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-label text-cream/40 tracking-[0.4em] block mb-4"
          >
            FLYFIT STUDIO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-light leading-[0.9] mb-4"
          >
            Tập tại nhà,
            <br />
            <span className="text-peach">thay đổi thật.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-cream/40 text-sm md:text-base max-w-md mx-auto"
          >
            Chọn hành trình phù hợp với bạn
          </motion.p>
        </div>

        {/* Lower: Cards */}
        <div className="container-custom pb-16">
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
                className={`bg-gradient-to-b ${card.color} backdrop-blur-xl border ${card.borderColor} p-6 transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cream/10 flex items-center justify-center rounded-full">
                    <card.icon className="w-5 h-5 text-cream/70" />
                  </div>
                  <span className="text-[10px] text-cream/40 tracking-wider uppercase">{card.subtitle}</span>
                </div>
                <h3 className="font-display text-xl text-cream mb-2">{card.title}</h3>
                <p className="text-cream/50 text-sm mb-4 leading-relaxed">{card.description}</p>
                <span className="text-peach text-xs uppercase tracking-wider font-semibold group-hover:tracking-[0.2em] transition-all">
                  {card.cta} →
                </span>
              </motion.div>
            ))}

            {/* Register card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-cream/5 backdrop-blur-xl border border-cream/10 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-peach/20 flex items-center justify-center rounded-full">
                  <UserPlus className="w-5 h-5 text-peach" />
                </div>
                <span className="text-[10px] text-cream/40 tracking-wider uppercase">Đăng ký nhanh</span>
              </div>
              <h3 className="font-display text-xl text-cream mb-3">Bắt đầu ngay</h3>
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <Input type="text" placeholder="Họ và tên" value={formData.full_name} onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))} className="h-10 px-4 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm" />
                  {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <Input type="tel" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="h-10 px-4 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <MagneticButton type="submit" className="w-full bg-peach text-charcoal rounded-full h-10 text-xs uppercase tracking-widest font-semibold" disabled={submitting}>
                  {submitting ? "Đang gửi..." : "Đăng ký"}
                  {!submitting && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
                </MagneticButton>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDemo4;
