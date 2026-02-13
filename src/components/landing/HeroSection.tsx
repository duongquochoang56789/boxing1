import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead form submitted:", email);
    setEmail("");
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen overflow-hidden"
    >
      {/* Full-bleed Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: backgroundScale }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075')`,
          }}
        />
        {/* Minimal gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-charcoal/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent" />
      </motion.div>

      {/* Content overlay - bottom aligned */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-end"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="container-custom pb-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Bottom-left - Large Heading */}
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-label text-cream/80 block"
              >
                Premium Wellness Experience
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="heading-display text-cream"
              >
                Cân bằng,
                <br />
                <span className="text-peach">trọn vẹn.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-body text-cream/70 max-w-md"
              >
                Không gian luyện tập sang trọng, nơi sự tinh tế 
                gặp gỡ hiệu quả.
              </motion.p>
            </div>

            {/* Bottom-right - Glassmorphism Lead Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="lg:max-w-sm lg:ml-auto"
            >
              <div className="bg-cream/10 backdrop-blur-xl border border-cream/20 p-8">
                <h3 className="heading-subsection text-cream mb-2">
                  Đăng ký trải nghiệm
                </h3>
                <p className="text-body-sm text-cream/60 mb-6">
                  Nhận ưu đãi và lịch tập thử miễn phí
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Họ và tên"
                    className="h-12 px-4 bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 rounded-none focus:border-peach focus:ring-peach/20"
                  />
                  <Input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 px-4 bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 rounded-none focus:border-peach focus:ring-peach/20"
                  />
                  <Input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="h-12 px-4 bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 rounded-none focus:border-peach focus:ring-peach/20"
                  />
                  <MagneticButton
                    type="submit"
                    className="w-full btn-primary rounded-none h-12 group"
                  >
                    Đăng ký ngay
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </form>

                <p className="text-xs text-cream/40 text-center mt-4">
                  Chúng tôi tôn trọng quyền riêng tư của bạn
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator - bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-cream/60 hover:text-cream transition-colors duration-300 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-label">Khám phá</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
