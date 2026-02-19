import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ShimmerImage } from "@/components/ui/shimmer-image";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thanh Hà",
    role: "Doanh nhân",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    content: "Sau 6 tháng tập luyện tại EliteFit, tôi đã giảm được 15kg và cảm thấy tự tin hơn bao giờ hết. Đội ngũ PT ở đây thực sự tuyệt vời!",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    role: "Kỹ sư IT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    content: "Không gian tập luyện sang trọng, máy móc hiện đại. Tôi đặc biệt ấn tượng với chương trình dinh dưỡng được tư vấn riêng cho từng người.",
    rating: 5,
  },
  {
    id: 3,
    name: "Lê Thị Mai Anh",
    role: "Bác sĩ",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    content: "Các lớp Yoga ở đây rất chất lượng. Cô Hương dạy rất tận tình và chuyên nghiệp. Tôi đã giới thiệu cho rất nhiều bạn bè.",
    rating: 5,
  },
  {
    id: 4,
    name: "Phạm Quốc Bảo",
    role: "Vận động viên",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    content: "EliteFit là nơi duy nhất tôi tin tưởng để tập luyện. Thiết bị chuyên nghiệp, huấn luyện viên tận tâm và không gian cực kỳ thoải mái.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const INTERVAL = 6000;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { next(); return 0; }
        return p + (100 / (INTERVAL / 50));
      });
    }, 50);
    return () => clearInterval(progressInterval);
  }, [isPaused, next]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
  };

  return (
    <section
      id="testimonials"
      className="section-padding bg-cream"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-label text-terracotta">Đánh giá từ học viên</span>
          <h2 className="heading-section text-charcoal mt-3">
            Học viên nói gì về <span className="text-terracotta">chúng tôi</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* Left - Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="relative min-h-[260px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Large quote mark */}
                  <div className="text-[80px] leading-none font-display text-terracotta/20 select-none mb-2">"</div>

                  <p className="text-xl md:text-2xl font-display leading-relaxed text-charcoal/80 italic -mt-6">
                    {testimonials[current].content}
                  </p>

                  <div className="flex items-center gap-3 mt-8 pt-8 border-t border-charcoal/8">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-display font-medium text-charcoal">
                        {testimonials[current].name}
                      </h4>
                      <p className="text-soft-brown text-xs tracking-widest uppercase">{testimonials[current].role}</p>
                    </div>
                    <div className="flex gap-0.5 ml-auto">
                      {[...Array(testimonials[current].rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-10">
              <motion.button
                onClick={prev}
                className="w-10 h-10 border border-charcoal/15 flex items-center justify-center text-charcoal hover:border-terracotta hover:text-terracotta transition-colors duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={next}
                className="w-10 h-10 border border-charcoal/15 flex items-center justify-center text-charcoal hover:border-terracotta hover:text-terracotta transition-colors duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <div className="flex gap-1.5 ml-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setDirection(index > current ? 1 : -1); setCurrent(index); setProgress(0); }}
                    className="relative h-px overflow-hidden transition-all duration-300"
                    style={{ width: index === current ? 32 : 12 }}
                  >
                    <div className="absolute inset-0 bg-charcoal/15" />
                    {index === current && (
                      <motion.div className="absolute inset-0 bg-terracotta origin-left" style={{ scaleX: progress / 100 }} />
                    )}
                    {index < current && (
                      <div className="absolute inset-0 bg-terracotta" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Image + stat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <ShimmerImage
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800"
                alt="Happy Member"
                className="w-full h-full object-cover grayscale-[20%]"
                wrapperClassName="w-full h-full"
              />
            </div>

            {/* Stat card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-0 left-0 bg-terracotta text-primary-foreground px-7 py-5"
            >
              <div className="text-4xl font-display font-medium">98%</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-primary-foreground/70 mt-0.5">Khách hàng hài lòng</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
