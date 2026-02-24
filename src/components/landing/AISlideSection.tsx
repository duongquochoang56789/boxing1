import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, Share2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

const features = [
  {
    icon: Sparkles,
    title: "AI Tự Động Tạo",
    desc: "Chỉ cần mô tả ý tưởng, AI sẽ tạo bài thuyết trình hoàn chỉnh với nội dung chuyên nghiệp trong vài giây.",
  },
  {
    icon: LayoutGrid,
    title: "12+ Bố Cục Chuyên Nghiệp",
    desc: "Đa dạng layout từ tiêu đề, so sánh, ảnh toàn màn hình đến biểu đồ — phù hợp mọi ngữ cảnh.",
  },
  {
    icon: Share2,
    title: "Chia Sẻ & Trình Chiếu",
    desc: "Xuất PDF chất lượng cao, chia sẻ link công khai hoặc trình chiếu toàn màn hình ngay trên trình duyệt.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const AISlideSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-charcoal to-charcoal/95 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-terracotta" />
            <span className="text-label text-terracotta uppercase tracking-widest">
              Công Cụ AI
            </span>
            <div className="w-8 h-px bg-terracotta" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream leading-tight mb-4">
            Tạo Slide Thuyết Trình{" "}
            <span className="text-terracotta">Bằng AI</span>
          </h2>
          <p className="text-body text-cream/60 max-w-2xl mx-auto">
            Biến ý tưởng thành bài thuyết trình chuyên nghiệp chỉ trong vài giây.
            AI tự động tạo nội dung, bố cục và hình ảnh minh họa.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 border border-cream/10 bg-cream/5 backdrop-blur-sm hover:border-terracotta/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-terracotta/15 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-lg font-semibold text-cream mb-2">
                {f.title}
              </h3>
              <p className="text-body-sm text-cream/50 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto mb-12"
        >
          <div className="aspect-video border border-cream/10 bg-gradient-to-br from-charcoal via-charcoal/80 to-terracotta/10 overflow-hidden relative">
            {/* Fake slide content */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-terracotta/60" />
                <div className="w-3 h-3 rounded-full bg-cream/20" />
                <div className="w-3 h-3 rounded-full bg-cream/20" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="h-3 w-24 bg-terracotta/40 rounded mb-4" />
                <div className="h-6 w-3/4 bg-cream/15 rounded mb-3" />
                <div className="h-6 w-1/2 bg-cream/10 rounded mb-6" />
                <div className="h-3 w-full bg-cream/5 rounded mb-2" />
                <div className="h-3 w-5/6 bg-cream/5 rounded mb-2" />
                <div className="h-3 w-2/3 bg-cream/5 rounded" />
              </motion.div>
            </div>

            {/* Slide thumbnails sidebar mock */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`w-16 h-10 border rounded-sm ${
                    n === 1
                      ? "border-terracotta/50 bg-terracotta/10"
                      : "border-cream/10 bg-cream/5"
                  }`}
                />
              ))}
            </div>

            {/* Sparkle decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-6 right-6"
            >
              <Sparkles className="w-5 h-5 text-terracotta/30" />
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <MagneticButton
            size="lg"
            className="bg-terracotta text-cream hover:bg-terracotta/90 px-10 py-6 text-base group"
            onClick={() => navigate("/slides/new")}
          >
            Tạo Slide Ngay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </MagneticButton>
          <p className="text-sm text-cream/40 mt-4">Miễn phí • Không cần cài đặt</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AISlideSection;
