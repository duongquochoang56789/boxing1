import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block text-accent text-sm font-medium tracking-[0.3em] uppercase mb-4">
                Premium Fitness Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="heading-display leading-tight"
            >
              Khơi dậy
              <br />
              <span className="text-accent">sức mạnh</span>
              <br />
              tiềm ẩn
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-body text-muted-foreground max-w-md"
            >
              Trải nghiệm không gian tập luyện đẳng cấp với đội ngũ huấn luyện
              viên chuyên nghiệp và thiết bị hiện đại bậc nhất.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button className="btn-primary rounded-none group">
                Bắt đầu ngay
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                className="btn-outline rounded-none group"
              >
                <Play className="mr-2 w-4 h-4" />
                Xem video tour
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-12 pt-8 border-t border-border/50"
            >
              <div>
                <div className="text-3xl md:text-4xl font-display font-semibold text-accent">
                  10+
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Năm kinh nghiệm
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-semibold text-accent">
                  5000+
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Học viên
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-semibold text-accent">
                  20+
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Huấn luyện viên
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Empty for background image visibility */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-accent rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
