import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

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

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
            Dịch vụ
          </span>
          <h2 className="heading-section mt-4">
            Đa dạng chương trình
            <br />
            <span className="text-accent">phù hợp</span> mọi nhu cầu
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-secondary cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-accent text-sm font-medium tracking-wider">
                      {service.number}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-medium mt-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-sm">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
