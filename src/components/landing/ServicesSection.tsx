import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

const services = [
  {
    number: "01",
    title: "Personal Training",
    description:
      "Luyện tập 1-1 với huấn luyện viên chuyên nghiệp, chương trình được thiết kế riêng cho mục tiêu của bạn.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  },
  {
    number: "02",
    title: "Group Fitness",
    description:
      "Các lớp tập nhóm đa dạng từ Yoga, Pilates đến HIIT, Spinning với không khí sôi động.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
  },
  {
    number: "03",
    title: "Strength Training",
    description:
      "Khu vực gym rộng rãi với đầy đủ máy móc hiện đại cho việc tập luyện sức mạnh.",
    image:
      "https://images.unsplash.com/photo-1534368959876-26bf04f2c947?q=80&w=800",
  },
  {
    number: "04",
    title: "Nutrition Coaching",
    description:
      "Tư vấn dinh dưỡng cá nhân hóa, hỗ trợ bạn đạt được kết quả tối ưu nhất.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-warm-beige to-transparent" />
      
      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-label text-terracotta">
            Dịch vụ của chúng tôi
          </span>
          <h2 className="heading-section text-charcoal mt-4">
            Đa dạng chương trình
            <br />
            <span className="text-terracotta">phù hợp</span> mọi nhu cầu
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <TiltCard key={service.number} tiltStrength={8}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden bg-cream cursor-pointer card-hover"
            >
              {/* Image with zoom effect */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                    filter: hoveredIndex === index ? "grayscale(0%)" : "grayscale(20%)",
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent"
                  animate={{
                    opacity: hoveredIndex === index ? 0.9 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <motion.span
                      className="text-terracotta-light text-label block mb-2"
                      animate={{
                        y: hoveredIndex === index ? 0 : 10,
                        opacity: hoveredIndex === index ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.number}
                    </motion.span>
                    <motion.h3
                      className="font-display text-2xl md:text-3xl font-medium text-cream"
                      animate={{
                        y: hoveredIndex === index ? 0 : 5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.p
                      className="text-cream/80 text-sm md:text-base mt-3 max-w-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        y: hoveredIndex === index ? 0 : 20,
                      }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {service.description}
                    </motion.p>
                  </div>
                  
                  {/* Arrow button */}
                  <motion.div
                    className="flex-shrink-0 w-14 h-14 bg-terracotta text-cream flex items-center justify-center"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                      rotate: hoveredIndex === index ? 45 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              {/* Hover border effect */}
              <motion.div
                className="absolute inset-0 border-2 border-terracotta pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
