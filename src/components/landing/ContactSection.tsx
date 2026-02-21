import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
});

const contactInfo = [
  { icon: MapPin, label: "Địa chỉ", value: "123 Nguyễn Huệ, Quận 1\nTP. Hồ Chí Minh" },
  { icon: Phone, label: "Điện thoại", value: "1900 1234" },
  { icon: Mail, label: "Email", value: "info@flyfit.vn" },
  { icon: Clock, label: "Giờ mở cửa", value: "05:00 – 22:00\nThứ Hai – Chủ Nhật" },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ full_name: "", phone: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
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
        service: result.data.service || null,
        message: result.data.message || null,
        source: "contact",
      });
      if (error) throw error;
      toast.success("Đăng ký thành công! Chúng tôi sẽ phản hồi trong 24h.");
      setFormData({ full_name: "", phone: "", email: "", service: "", message: "" });
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <section id="contact" className="section-padding bg-warm-beige relative overflow-hidden">
      <div className="container-custom" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-16 md:mb-20"
        >
          <span className="text-label text-terracotta">Liên hệ</span>
          <h2 className="heading-section text-charcoal mt-4">
            Sẵn sàng
            <br />
            <em className="not-italic text-terracotta">thay đổi?</em>
          </h2>
          <p className="text-body text-soft-brown mt-5 max-w-sm">
            Đăng ký ngay hôm nay để nhận buổi tập thử miễn phí và tư vấn 1-1 từ chuyên gia của chúng tôi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left – Info + Map */}
          <div>
            <div className="grid sm:grid-cols-2 gap-px bg-border">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="bg-warm-beige p-6 group hover:bg-cream transition-colors duration-300"
                >
                  <item.icon className="w-4 h-4 text-terracotta mb-4" />
                  <p className="text-label text-soft-brown mb-1.5">{item.label}</p>
                  <p className="font-display text-charcoal text-lg leading-snug whitespace-pre-line">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-px aspect-video overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4194929787595!2d106.69877107573575!3d10.778789859207456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704123456789!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(80%) contrast(1.05) sepia(10%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="hover:filter-none transition-all duration-700"
              />
            </motion.div>
          </div>

          {/* Right – Form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-cream p-8 md:p-10">
              <h3 className="font-display text-2xl md:text-3xl font-medium text-charcoal mb-1">
                Đăng ký tư vấn
              </h3>
              <p className="text-body-sm text-soft-brown mb-8">Miễn phí · Không ràng buộc</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-label text-soft-brown">Họ và tên</label>
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={formData.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      className="h-12 px-4 rounded-none border-border bg-background focus:border-terracotta focus:ring-0 focus-visible:ring-0 focus-visible:border-terracotta"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-label text-soft-brown">Số điện thoại</label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-12 px-4 rounded-none border-border bg-background focus:border-terracotta focus:ring-0 focus-visible:ring-0 focus-visible:border-terracotta"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-label text-soft-brown">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="h-12 px-4 rounded-none border-border bg-background focus:border-terracotta focus:ring-0 focus-visible:ring-0 focus-visible:border-terracotta"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="service" className="text-label text-soft-brown">Dịch vụ quan tâm</label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => updateField("service", e.target.value)}
                    className="w-full h-12 px-4 border border-border bg-background rounded-none focus:outline-none focus:border-terracotta text-charcoal text-sm"
                  >
                    <option value="">Chọn dịch vụ...</option>
                    <option value="flyclass">FLY Class — Nhóm nhỏ</option>
                    <option value="flyzen">FLY Zen — Yoga & Pilates</option>
                    <option value="flyburn">FLY Burn — HIIT & Cardio</option>
                    <option value="flyfuel">FLY Fuel — Dinh dưỡng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-label text-soft-brown">Lời nhắn <span className="opacity-50">(tuỳ chọn)</span></label>
                  <Textarea
                    id="message"
                    rows={3}
                    placeholder="Bạn muốn đạt được điều gì?"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className="rounded-none border-border bg-background resize-none focus:border-terracotta focus:ring-0 focus-visible:ring-0 focus-visible:border-terracotta text-sm"
                  />
                </div>

                <MagneticButton type="submit" className="btn-primary rounded-none w-full h-12 group text-sm" disabled={submitting}>
                  {submitting ? "Đang gửi..." : "Gửi đăng ký"}
                  {!submitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </MagneticButton>

                <p className="text-[11px] text-soft-brown/60 text-center">
                  Chúng tôi tôn trọng quyền riêng tư của bạn và sẽ phản hồi trong vòng 24h.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
