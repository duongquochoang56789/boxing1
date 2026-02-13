import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShimmerImage } from "@/components/ui/shimmer-image";

const features = [
  {
    title: "Huấn luyện cá nhân",
    description: "Chương trình được thiết kế riêng với huấn luyện viên chuyên nghiệp, đồng hành cùng bạn đạt mục tiêu.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  },
  {
    title: "Lớp nhóm đa dạng",
    description: "Từ Yoga, Pilates đến HIIT – các lớp tập nhóm sôi động phù hợp mọi trình độ.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
  },
  {
    title: "Không gian cao cấp",
    description: "Trang thiết bị nhập khẩu, không gian rộng rãi và tiện nghi đẳng cấp quốc tế.",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800",
  },
];

const AboutSection = () => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-cream relative overflow-hidden">
      <div className="container-custom" ref={contentRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-label text-terracotta">Về chúng tôi</span>
          <h2 className="heading-section text-charcoal mt-4">
            Nơi sự cân bằng
            <br />
            <span className="text-terracotta">gặp gỡ</span> sự bình yên
          </h2>
          <p className="text-body text-soft-brown mt-6">
            Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là điểm đến tin cậy 
            của hàng nghìn học viên trên hành trình chinh phục vóc dáng lý tưởng.
          </p>
        </motion.div>

        {/* 3 Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden mb-6">
                <ShimmerImage
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <h3 className="heading-subsection text-charcoal text-xl md:text-2xl mb-3">
                {feature.title}
              </h3>
              <p className="text-body-sm text-soft-brown">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
