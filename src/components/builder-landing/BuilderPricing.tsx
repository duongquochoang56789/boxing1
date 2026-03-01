import { motion } from "framer-motion";
import { Check, Zap, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    icon: Zap,
    name: "Free",
    tagline: "Bắt đầu miễn phí",
    price: "$0",
    unit: "/ mãi mãi",
    highlight: false,
    features: [
      "3 bài thuyết trình",
      "5 lần AI tạo / tháng",
      "Xuất PDF",
      "12+ bố cục",
      "Chia sẻ link công khai",
    ],
    cta: "Bắt đầu miễn phí",
    ctaLink: "/slides/new",
  },
  {
    icon: Star,
    name: "Pro",
    tagline: "Cho chuyên gia",
    price: "$7",
    unit: "/ tháng",
    highlight: true,
    badge: "Phổ biến",
    features: [
      "Không giới hạn bài thuyết trình",
      "50 lần AI tạo / tháng",
      "Xuất PDF & PPTX",
      "AI viết lại nội dung",
      "AI tạo hình ảnh",
      "Không watermark",
    ],
    cta: "Nâng cấp Pro",
    ctaLink: "/slides/new",
  },
  {
    icon: Crown,
    name: "Business",
    tagline: "Cho đội nhóm",
    price: "$15",
    unit: "/ tháng",
    highlight: false,
    features: [
      "Tất cả trong Pro",
      "Không giới hạn AI",
      "Brand Kit tùy chỉnh",
      "Team workspace",
      "Hỗ trợ ưu tiên",
      "Xuất HD",
    ],
    cta: "Liên hệ",
    ctaLink: "/slides/new",
  },
];

const BuilderPricing = () => {
  return (
    <section id="pricing" className="relative py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
            Bảng giá{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              đơn giản
            </span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Bắt đầu miễn phí, nâng cấp khi bạn cần nhiều hơn.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col rounded-xl border p-8 ${
                plan.highlight
                  ? "border-indigo-500/50 bg-indigo-500/5 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-medium">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  plan.highlight ? "bg-indigo-500" : "bg-white/5"
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-white" : "text-indigo-400"}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-50 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400">{plan.tagline}</p>
              </div>

              <div className="mb-8">
                <span className="font-accent text-4xl text-slate-50">{plan.price}</span>
                <span className="text-sm text-slate-500 ml-1">{plan.unit}</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full h-11 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0 text-white"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Link to={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuilderPricing;
