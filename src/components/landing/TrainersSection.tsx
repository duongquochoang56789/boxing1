import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { ShimmerImage } from "@/components/ui/shimmer-image";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";
import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";
import trainer3 from "@/assets/trainer-3.jpg";
import trainer4 from "@/assets/trainer-4.jpg";

const defaultTrainers = [
  { key: "trainer_1", name: "Nguyễn Minh Tuấn", role: "Head Coach", specialty: "Strength & Conditioning", image: trainer1 },
  { key: "trainer_2", name: "Trần Thu Hương", role: "Yoga Master", specialty: "Yoga & Pilates", image: trainer2 },
  { key: "trainer_3", name: "Lê Quang Huy", role: "Fitness Coach", specialty: "HIIT & Functional Training", image: trainer3 },
  { key: "trainer_4", name: "Phạm Thị Mai", role: "Nutrition Expert", specialty: "Sports Nutrition", image: trainer4 },
];

const TrainersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { data: content } = useSiteContent("trainers");

  const trainers = defaultTrainers.map((t) => ({
    ...t,
    name: getContent(content, "text", `${t.key}_name`, t.name),
    role: getContent(content, "text", `${t.key}_role`, t.role),
    specialty: getContent(content, "text", `${t.key}_specialty`, t.specialty),
    image: getContent(content, "image", t.key, t.image),
    socials: { instagram: "#", facebook: "#", linkedin: "#" },
  }));

  return (
    <section id="trainers" className="section-padding bg-charcoal text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-peach rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-label text-terracotta">{getContent(content, "text", "label", "Đội ngũ chuyên gia")}</span>
          <h2 className="heading-section mt-4 text-cream">
            {getContent(content, "text", "heading_1", "Huấn luyện viên")}
            <br />
            <span className="text-terracotta">{getContent(content, "text", "heading_2", "đẳng cấp")}</span>
          </h2>
          <p className="text-cream/60 mt-6 text-body">
            {getContent(content, "text", "description", "Đội ngũ huấn luyện viên được chứng nhận quốc tế, tận tâm đồng hành cùng bạn trên hành trình chinh phục mục tiêu sức khỏe.")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.key}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <ShimmerImage src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" wrapperClassName="w-full h-full" style={{ scale: hoveredIndex === index ? 1.05 : 1, filter: hoveredIndex === index ? "grayscale(0%)" : "grayscale(100%)", transition: "all 0.6s ease" }} />
                <motion.div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" animate={{ opacity: hoveredIndex === index ? 0.5 : 0.3 }} transition={{ duration: 0.3 }} />
                <motion.div className="absolute inset-0 bg-terracotta/80 flex items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: hoveredIndex === index ? 1 : 0 }} transition={{ duration: 0.3 }}>
                  {[{ icon: Instagram, href: trainer.socials.instagram }, { icon: Facebook, href: trainer.socials.facebook }, { icon: Linkedin, href: trainer.socials.linkedin }].map((social, si) => (
                    <motion.a key={si} href={social.href} className="w-11 h-11 bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors" initial={{ y: 20, opacity: 0 }} animate={{ y: hoveredIndex === index ? 0 : 20, opacity: hoveredIndex === index ? 1 : 0 }} transition={{ duration: 0.3, delay: si * 0.05 }}>
                      <social.icon className="w-5 h-5 text-cream" />
                    </motion.a>
                  ))}
                </motion.div>
                <motion.div className="absolute top-0 right-0 w-16 h-16 bg-terracotta" initial={{ scale: 0 }} animate={{ scale: hoveredIndex === index ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
              </div>
              <div className="text-center">
                <motion.h3 className="font-display text-xl font-medium text-cream" animate={{ y: hoveredIndex === index ? -5 : 0 }} transition={{ duration: 0.3 }}>{trainer.name}</motion.h3>
                <p className="text-terracotta text-label mt-2">{trainer.role}</p>
                <motion.p className="text-cream/50 text-sm mt-1" animate={{ opacity: hoveredIndex === index ? 1 : 0.5 }} transition={{ duration: 0.3 }}>{trainer.specialty}</motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
