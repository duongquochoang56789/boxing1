import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { TextReveal } from "@/components/ui/text-reveal";

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead form submitted:", email);
    setEmail("");
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075')`,
          }}
        />
        {/* Elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/98 via-cream/80 to-cream/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-peach/20 via-transparent to-transparent" />
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-terracotta/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-peach/30 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container-custom"
        style={{ y: textY, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-32">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-label text-terracotta mb-6 block">
                Premium Wellness Experience
              </span>
            </motion.div>

            <div className="space-y-2">
              <h1 className="heading-display text-charcoal">
                <TextReveal text="Cân bằng" delay={0.3} />
              </h1>
              <h1 className="heading-display">
                <TextReveal 
                  text="Cơ thể & Tâm trí" 
                  delay={0.5} 
                  className="text-terracotta"
                />
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-body text-soft-brown max-w-lg"
            >
              Khám phá không gian luyện tập sang trọng, nơi sự tinh tế gặp gỡ 
              hiệu quả. Đội ngũ huấn luyện viên hàng đầu đồng hành cùng bạn 
              trên hành trình chăm sóc sức khỏe toàn diện.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <MagneticButton className="btn-primary rounded-none group">
                Khám phá ngay
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                className="btn-outline rounded-none"
              >
                Đặt lịch tư vấn
              </MagneticButton>
            </motion.div>

            {/* Elegant Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex gap-12 pt-12"
            >
              {[
                { value: "10+", label: "Năm Kinh Nghiệm" },
                { value: "5K+", label: "Học Viên" },
                { value: "20+", label: "Huấn Luyện Viên" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-4xl md:text-5xl text-terracotta font-medium">
                    {stat.value}
                  </div>
                  <div className="text-label text-soft-brown mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Lead Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Decorative circle behind form */}
              <div className="absolute -inset-8 bg-gradient-to-br from-peach/50 to-transparent rounded-full blur-2xl" />
              
              {/* Lead Form Card */}
              <motion.div
                className="relative bg-background/80 backdrop-blur-xl p-10 rounded-sm shadow-2xl shadow-charcoal/5 border border-border/50 max-w-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h3 className="heading-subsection text-charcoal mb-3">
                    Đăng ký trải nghiệm
                  </h3>
                  <p className="text-body-sm text-muted-foreground">
                    Nhận ưu đãi đặc biệt và lịch tập thử miễn phí
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Input
                      type="text"
                      placeholder="Họ và tên"
                      className="h-14 px-5 bg-secondary/50 border-border/50 rounded-none focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 px-5 bg-secondary/50 border-border/50 rounded-none focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Số điện thoại"
                      className="h-14 px-5 bg-secondary/50 border-border/50 rounded-none focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                    />
                  </div>
                   <MagneticButton
                    type="submit"
                    className="w-full btn-primary rounded-none h-14 group"
                  >
                    Đăng ký ngay
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  Chúng tôi tôn trọng quyền riêng tư của bạn
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-soft-brown hover:text-terracotta transition-colors duration-300 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-label">Khám phá</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
