import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShimmerImage } from "@/components/ui/shimmer-image";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const defaultFeatures = [
  { key: "feature_1", title: "Nhóm nhỏ trực tuyến", description: "Tập luyện nhóm 5-7 người qua Zoom, trainer quan sát và sửa động tác trực tiếp — như PT 1-1 nhưng chi phí hợp lý.", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800" },
  { key: "feature_2", title: "Đa dạng chương trình", description: "Từ FLY Zen (Yoga), FLY Burn (HIIT) đến FLY Fuel (Dinh dưỡng) – phù hợp mọi mục tiêu và trình độ.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800" },
  { key: "feature_3", title: "Mô hình Hybrid", description: "80% Online + 20% Offline tại phòng gym thực tế — kết hợp sự tiện lợi với trải nghiệm chuyên nghiệp.", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800" },
];

const AboutSection = () => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });
  const { data: content } = useSiteContent("about");

  const features = defaultFeatures.map((f) => ({
    ...f,
    title: getContent(content, "text", `${f.key}_title`, f.title),
    description: getContent(content, "text", `${f.key}_desc`, f.description),
    image: getContent(content, "image", f.key, f.image),
  }));

  return (
    <section id="about" className="section-padding bg-cream relative overflow-hidden">
      <div className="container-custom" ref={contentRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-label text-terracotta">{getContent(content, "text", "label", "Về chúng tôi")}</span>
          <h2 className="heading-section text-charcoal mt-4">
            {getContent(content, "text", "heading_1", "Tập luyện thông minh,")}
            <br />
            <span className="text-terracotta">{getContent(content, "text", "heading_2", "sống khỏe mỗi ngày")}</span>
          </h2>
          <p className="text-body text-soft-brown mt-6">
            {getContent(content, "text", "description", "FLYFIT xóa bỏ rào cản tập luyện — không cần đến phòng gym, không cần đầu tư đắt đỏ. Chỉ cần kết nối internet và quyết tâm thay đổi.")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden mb-6">
                <ShimmerImage src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" wrapperClassName="w-full h-full" />
              </div>
              <h3 className="heading-subsection text-charcoal text-xl md:text-2xl mb-3">{feature.title}</h3>
              <p className="text-body-sm text-soft-brown">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
