import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Đẳng cấp quốc tế",
    description: "Trang thiết bị nhập khẩu từ các thương hiệu hàng đầu thế giới",
  },
  {
    icon: Users,
    title: "Huấn luyện viên ưu tú",
    description: "Đội ngũ PT được chứng nhận quốc tế với kinh nghiệm dày dặn",
  },
  {
    icon: Target,
    title: "Chương trình cá nhân hóa",
    description: "Lộ trình tập luyện được thiết kế riêng cho từng học viên",
  },
  {
    icon: Zap,
    title: "Kết quả nhanh chóng",
    description: "Phương pháp khoa học giúp bạn đạt mục tiêu trong thời gian ngắn",
  },
];

const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageY2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="section-padding bg-warm-beige relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-peach/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center" ref={contentRef}>
          {/* Left - Image Grid with Parallax */}
          <div className="relative">
            <div className="grid grid-cols-12 gap-4">
              {/* Main large image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
                style={{ y: imageY1 }}
                className="col-span-7 row-span-2"
              >
                <div className="aspect-[3/4] overflow-hidden image-reveal">
                  <img
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800"
                    alt="Gym Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Top right image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ y: imageY2 }}
                className="col-span-5 mt-20"
              >
                <div className="aspect-square overflow-hidden image-reveal">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800"
                    alt="Fitness Equipment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Bottom right image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="col-span-5"
              >
                <div className="aspect-[4/3] overflow-hidden image-reveal">
                  <img
                    src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800"
                    alt="Personal Training"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating accent element */}
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-terracotta/10 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-label text-terracotta block mb-4"
              >
                Về chúng tôi
              </motion.span>
              <h2 className="heading-section text-charcoal">
                Nơi đam mê
                <br />
                <span className="text-terracotta">thể thao</span> được
                <br />
                trọn vẹn
              </h2>
            </div>

            <p className="text-body text-soft-brown">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực fitness, chúng tôi tự
              hào là điểm đến tin cậy của hàng nghìn học viên. Không gian sang
              trọng, hiện đại cùng đội ngũ chuyên gia hàng đầu sẽ đồng hành cùng
              bạn trên hành trình chinh phục vóc dáng lý tưởng.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group flex gap-4 p-4 rounded-sm bg-background/50 backdrop-blur-sm hover:bg-background transition-all duration-500 card-hover"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg text-charcoal">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-soft-brown mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
