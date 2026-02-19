import { motion } from "framer-motion";
import { Video, Users, Zap, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Video,
    title: "Tiện lợi",
    desc: "Tập mọi lúc, mọi nơi — chỉ cần kết nối internet và không gian nhỏ tại nhà",
  },
  {
    icon: Users,
    title: "Nhóm nhỏ",
    desc: "5–7 người mỗi nhóm, trainer quan sát và sửa động tác trực tiếp qua video",
  },
  {
    icon: Zap,
    title: "Tiết kiệm",
    desc: "Chi phí chỉ 50–100k/buổi, tiết kiệm 60% so với PT 1-1 truyền thống",
  },
];

const VirtualTrainingSection = () => {
  return (
    <section id="virtual-training" className="py-24 bg-charcoal overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-terracotta" />
              <span className="text-label text-terracotta uppercase tracking-widest">Virtual Training</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream leading-tight mb-6">
              Tập cùng chuyên gia —{" "}
              <span className="text-terracotta">dù bạn ở đâu</span>
            </h2>

            <p className="text-body text-cream/70 mb-10 leading-relaxed">
              Mô hình nhóm nhỏ trực tuyến kết hợp hiệu quả của PT cá nhân và sự kết nối của lớp học nhóm.
              Trainer EliteFit theo dõi và hướng dẫn trực tiếp — bạn tập tại nhà, chúng tôi đồng hành cùng bạn.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-terracotta/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-cream mb-1">{f.title}</h3>
                    <p className="text-body-sm text-cream/60">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hybrid badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-terracotta/30 bg-terracotta/10 mb-8">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span className="text-sm text-cream/80">
                Kết hợp <span className="text-terracotta font-medium">offline 1–2 buổi/tháng</span> tại phòng gym để kiểm tra và nâng cấp kỹ thuật
              </span>
            </div>

            <Link
              to="#pricing"
              onClick={() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-cream text-sm font-medium hover:bg-terracotta/90 transition-colors duration-300 group"
            >
              Xem các gói dịch vụ
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Right — stats visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5–7", label: "Người/nhóm", desc: "Nhóm nhỏ, cá nhân hóa tối đa" },
                { value: "3–5×", label: "Doanh thu/giờ", desc: "Hiệu quả hơn PT 1-1 truyền thống" },
                { value: "50k", label: "Đồng/buổi", desc: "Chi phí phải chăng nhất thị trường" },
                { value: "+25%", label: "Tỉ lệ duy trì", desc: "So với tập video tự học một mình" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className={`p-6 border ${i === 1 ? "border-terracotta bg-terracotta/10" : "border-cream/10 bg-cream/5"}`}
                >
                  <div className={`font-display text-4xl font-bold mb-1 ${i === 1 ? "text-terracotta" : "text-cream"}`}>
                    {stat.value}
                  </div>
                  <div className="text-label text-cream/50 uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-body-sm text-cream/40">{stat.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Market growth tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 p-4 border border-cream/10 bg-cream/5 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
              <p className="text-body-sm text-cream/60">
                Thị trường fitness online tăng trưởng{" "}
                <span className="text-cream font-medium">17.2%/năm</span>,
                dự kiến đạt <span className="text-cream font-medium">34.72 tỷ USD</span> vào 2030
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTrainingSection;
