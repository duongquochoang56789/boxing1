import { motion } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>
          {/* Left - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800"
                  alt="Gym Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800"
                  alt="Training Session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800"
                  alt="Fitness Equipment"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800"
                  alt="Personal Training"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
                Về chúng tôi
              </span>
              <h2 className="heading-section mt-4">
                Nơi đam mê
                <br />
                <span className="text-accent">thể thao</span> được
                <br />
                trọn vẹn
              </h2>
            </div>

            <p className="text-body text-muted-foreground">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực fitness, chúng tôi tự
              hào là điểm đến tin cậy của hàng nghìn học viên. Không gian sang
              trọng, hiện đại cùng đội ngũ chuyên gia hàng đầu sẽ đồng hành cùng
              bạn trên hành trình chinh phục vóc dáng lý tưởng.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
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
