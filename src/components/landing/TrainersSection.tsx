import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";

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

  return (
    <section id="trainers" className="section-padding bg-gym-charcoal text-white">
      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
            Đội ngũ
          </span>
          <h2 className="heading-section mt-4 text-white">
            Huấn luyện viên
            <br />
            <span className="text-accent">chuyên nghiệp</span>
          </h2>
          <p className="text-gray-400 mt-6">
            Đội ngũ huấn luyện viên được chứng nhận quốc tế, tận tâm đồng hành
            cùng bạn trên hành trình chinh phục mục tiêu sức khỏe.
          </p>
        </motion.div>

        {/* Trainers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-accent/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={trainer.socials.instagram}
                    className="w-10 h-10 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={trainer.socials.facebook}
                    className="w-10 h-10 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={trainer.socials.linkedin}
                    className="w-10 h-10 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-display text-xl font-medium">
                  {trainer.name}
                </h3>
                <p className="text-accent text-sm font-medium mt-1">
                  {trainer.role}
                </p>
                <p className="text-gray-400 text-sm mt-1">{trainer.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
