import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const plans = [
  {
    icon: Zap,
    key: "plan_1",
    name: "Gói Khởi Đầu",
    tagline: "Thử nghiệm miễn rủi ro",
    price: "200k–300k",
    unit: "/ 2–3 buổi thử",
    highlight: false,
    badge: null,
    features: [
      "2–3 buổi tập thử online",
      "Nhóm 5–7 người",
      "Trainer hướng dẫn trực tiếp",
      "Không cam kết dài hạn",
      "Đánh giá thể lực ban đầu",
    ],
    cta: "Đăng ký thử",
    ctaLink: "/book-pt",
    variant: "outline",
  },
  {
    icon: Star,
    key: "plan_2",
    name: "Gói Tháng",
    tagline: "Phổ biến nhất",
    price: "800k–1.2tr",
    unit: "/ tháng · 8–12 buổi",
    highlight: true,
    badge: "Phổ biến",
    features: [
      "8–12 buổi online/tháng",
      "Nhóm 5–7 người",
      "Trainer cố định theo dõi",
      "1 buổi offline tại phòng gym",
      "Theo dõi tiến độ hàng tuần",
      "Cộng đồng Zalo nhóm",
    ],
    cta: "Chọn gói này",
    ctaLink: "/book-pt",
    variant: "primary",
  },
  {
    icon: Crown,
    key: "plan_3",
    name: "Gói Premium",
    tagline: "Toàn diện · Nhanh nhất",
    price: "1.5tr–2tr",
    unit: "/ tháng · trọn gói",
    highlight: false,
    badge: null,
    features: [
      "Tất cả trong Gói Tháng",
      "2 buổi offline/tháng",
      "Tư vấn dinh dưỡng cá nhân",
      "Thực đơn tuần theo mục tiêu",
      "Check-in tiến độ hàng ngày",
      "Ưu tiên đặt lịch PT 1-1",
    ],
    cta: "Tư vấn ngay",
    ctaLink: "/book-pt",
    variant: "outline",
  },
];

const PricingSection = () => {
  const { data: content } = useSiteContent("pricing");

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-terracotta" />
            <span className="text-label text-terracotta uppercase tracking-widest">
              {getContent(content, "text", "label", "Bảng giá")}
            </span>
            <div className="w-8 h-px bg-terracotta" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {getContent(content, "text", "heading_1", "Chọn gói phù hợp")}{" "}
            <span className="text-terracotta">{getContent(content, "text", "heading_2", "với bạn")}</span>
          </h2>
          <p className="text-body text-soft-brown max-w-xl mx-auto">
            {getContent(content, "text", "description", "Không có hợp đồng ẩn — bắt đầu với gói thử, nâng cấp bất cứ lúc nào khi bạn sẵn sàng")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col border p-8 ${
                plan.highlight
                  ? "border-terracotta shadow-2xl shadow-terracotta/10 scale-[1.02]"
                  : "border-border/60"
              } bg-background`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-terracotta text-cream text-xs font-medium">
                  {getContent(content, "text", `${plan.key}_badge`, plan.badge)}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className={`w-10 h-10 flex items-center justify-center mb-4 ${plan.highlight ? "bg-terracotta" : "bg-terracotta/10"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-cream" : "text-terracotta"}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-1">
                  {getContent(content, "text", `${plan.key}_name`, plan.name)}
                </h3>
                <p className="text-body-sm text-soft-brown">
                  {getContent(content, "text", `${plan.key}_tagline`, plan.tagline)}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="font-display text-3xl font-bold text-charcoal">
                  {getContent(content, "text", `${plan.key}_price`, plan.price)}
                </div>
                <div className="text-body-sm text-soft-brown mt-1">
                  {getContent(content, "text", `${plan.key}_unit`, plan.unit)}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-terracotta" />
                    </div>
                    <span className="text-body-sm text-soft-brown">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaLink}
                className={`block text-center py-3.5 text-sm font-medium transition-all duration-300 ${
                  plan.variant === "primary"
                    ? "bg-terracotta text-cream hover:bg-terracotta/90"
                    : "border border-terracotta text-terracotta hover:bg-terracotta hover:text-cream"
                }`}
              >
                {getContent(content, "text", `${plan.key}_cta`, plan.cta)}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-body-sm text-muted-foreground mt-10"
        >
          {getContent(content, "text", "bottom_note", "Tất cả các gói đều bao gồm buổi đánh giá thể lực miễn phí · Thanh toán linh hoạt qua chuyển khoản")}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
