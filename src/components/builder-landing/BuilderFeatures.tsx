import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, FileDown, Link2, PenTool, ImagePlus } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Tự Động Tạo",
    description: "Nhập chủ đề, AI tạo toàn bộ slide với nội dung chuyên nghiệp chỉ trong vài giây.",
  },
  {
    icon: LayoutGrid,
    title: "12+ Bố Cục Đẹp",
    description: "Cover, hai cột, timeline, so sánh, quote — đa dạng layout cho mọi nhu cầu.",
  },
  {
    icon: FileDown,
    title: "Xuất PDF & PPTX",
    description: "Tải về dạng PDF chất lượng cao hoặc PowerPoint để chỉnh sửa thêm.",
  },
  {
    icon: Link2,
    title: "Chia Sẻ Link",
    description: "Tạo link công khai để bất kỳ ai cũng xem được bài thuyết trình của bạn.",
  },
  {
    icon: PenTool,
    title: "AI Viết Lại Nội Dung",
    description: "Chọn đoạn text bất kỳ, AI sẽ viết lại ngắn gọn hơn, chuyên nghiệp hơn.",
  },
  {
    icon: ImagePlus,
    title: "AI Tạo Hình Ảnh",
    description: "Tự động tạo hình minh họa phù hợp với nội dung từng slide.",
  },
];

const BuilderFeatures = () => {
  return (
    <section id="features" className="relative py-24 bg-slate-800/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(99,102,241,0.08),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
            Mọi thứ bạn cần để{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              tỏa sáng
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Công cụ toàn diện giúp bạn tạo bài thuyết trình ấn tượng mà không cần kỹ năng thiết kế.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 hover:bg-white/[0.06] hover:border-indigo-500/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuilderFeatures;
