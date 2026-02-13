import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { ShimmerImage } from "@/components/ui/shimmer-image";

const trainers = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "Head Coach",
    specialty: "Strength & Conditioning",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800",
    socials: { instagram: "#", facebook: "#", linkedin: "#" },
  },
  {
    name: "Trần Thu Hương",
    role: "Yoga Master",
    specialty: "Yoga & Pilates",
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800",
    socials: { instagram: "#", facebook: "#", linkedin: "#" },
  },
  {
    name: "Lê Quang Huy",
    role: "Fitness Coach",
    specialty: "HIIT & Functional Training",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
    socials: { instagram: "#", facebook: "#", linkedin: "#" },
  },
  {
    name: "Phạm Thị Mai",
    role: "Nutrition Expert",
    specialty: "Sports Nutrition",
    image:
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800",
    socials: { instagram: "#", facebook: "#", linkedin: "#" },
  },
];

const TrainersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="trainers" className="section-padding bg-charcoal text-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-peach rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-label text-terracotta">
            Đội ngũ chuyên gia
          </span>
          <h2 className="heading-section mt-4 text-cream">
            Huấn luyện viên
            <br />
            <span className="text-terracotta">đẳng cấp</span>
          </h2>
          <p className="text-cream/60 mt-6 text-body">
            Đội ngũ huấn luyện viên được chứng nhận quốc tế, tận tâm đồng hành
            cùng bạn trên hành trình chinh phục mục tiêu sức khỏe.
          </p>
        </motion.div>

        {/* Trainers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <ShimmerImage
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                  style={{
                    scale: hoveredIndex === index ? 1.05 : 1,
                    filter: hoveredIndex === index ? "grayscale(0%)" : "grayscale(100%)",
                    transition: "all 0.6s ease",
                  }}
                />
                
                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"
                  animate={{
                    opacity: hoveredIndex === index ? 0.5 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Social Overlay */}
                <motion.div
                  className="absolute inset-0 bg-terracotta/80 flex items-center justify-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {[
                    { icon: Instagram, href: trainer.socials.instagram },
                    { icon: Facebook, href: trainer.socials.facebook },
                    { icon: Linkedin, href: trainer.socials.linkedin },
                  ].map((social, socialIndex) => (
                    <motion.a
                      key={socialIndex}
                      href={social.href}
                      className="w-11 h-11 bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: hoveredIndex === index ? 0 : 20,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, delay: socialIndex * 0.05 }}
                    >
                      <social.icon className="w-5 h-5 text-cream" />
                    </motion.a>
                  ))}
                </motion.div>

                {/* Decorative corner */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 bg-terracotta"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />
              </div>

              {/* Info */}
              <div className="text-center">
                <motion.h3
                  className="font-display text-xl font-medium text-cream"
                  animate={{
                    y: hoveredIndex === index ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {trainer.name}
                </motion.h3>
                <p className="text-terracotta text-label mt-2">
                  {trainer.role}
                </p>
                <motion.p
                  className="text-cream/50 text-sm mt-1"
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {trainer.specialty}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
