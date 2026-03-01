import { motion } from "framer-motion";
import { PenLine, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    number: "01",
    title: "Nhập ý tưởng",
    description: "Mô tả chủ đề bài thuyết trình bằng một câu. AI sẽ hiểu ngữ cảnh và nội dung bạn cần.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI tạo slide tự động",
    description: "Trong vài giây, AI thiết kế toàn bộ bài thuyết trình với bố cục chuyên nghiệp, nội dung rõ ràng.",
  },
  {
    icon: Share2,
    number: "03",
    title: "Chỉnh sửa & Chia sẻ",
    description: "Tùy chỉnh nội dung, xuất PDF/PPTX, hoặc chia sẻ link trực tiếp cho đồng nghiệp.",
  },
];

const BuilderHowItWorks = () => {
  return (
    <section className="relative py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
            Đơn giản như{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              1-2-3
            </span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Không cần kỹ năng thiết kế. Chỉ cần ý tưởng.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center group"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
                <step.icon className="w-10 h-10 text-indigo-400" />
              </div>

              <span className="text-xs font-bold text-indigo-400/60 tracking-widest uppercase mb-2 block">
                Bước {step.number}
              </span>
              <h3 className="font-display text-xl font-semibold text-slate-50 mb-3">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuilderHowItWorks;
