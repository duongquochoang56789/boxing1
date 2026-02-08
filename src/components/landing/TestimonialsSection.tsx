import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thanh Hà",
    role: "Doanh nhân",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    content:
      "Sau 6 tháng tập luyện tại EliteFit, tôi đã giảm được 15kg và cảm thấy tự tin hơn bao giờ hết. Đội ngũ PT ở đây thực sự tuyệt vời!",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    role: "Kỹ sư IT",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    content:
      "Không gian tập luyện sang trọng, máy móc hiện đại. Tôi đặc biệt ấn tượng với chương trình dinh dưỡng được tư vấn riêng cho từng người.",
  },
  {
    id: 3,
    name: "Lê Thị Mai Anh",
    role: "Bác sĩ",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    content:
      "Các lớp Yoga ở đây rất chất lượng. Cô Hương dạy rất tận tình và chuyên nghiệp. Tôi đã giới thiệu cho rất nhiều bạn bè.",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="section-padding bg-warm-beige relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-peach/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-label text-terracotta">
              Đánh giá từ học viên
            </span>
            <h2 className="heading-section text-charcoal mt-4">
              Học viên nói gì
              <br />
              về <span className="text-terracotta">chúng tôi</span>
            </h2>

            {/* Testimonial Card */}
            <div className="mt-12 relative">
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -top-4 -left-4 z-0"
              >
                <Quote className="w-16 h-16 text-terracotta/10" />
              </motion.div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <p className="text-xl md:text-2xl font-display leading-relaxed text-charcoal/90 italic">
                    "{testimonials[current].content}"
                  </p>
                  <div className="flex items-center gap-4 mt-8">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-terracotta/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
                        <span className="text-cream text-xs">✓</span>
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="font-display font-medium text-lg text-charcoal">
                        {testimonials[current].name}
                      </h4>
                      <p className="text-soft-brown text-sm">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-10">
                <motion.button
                  onClick={prev}
                  className="w-12 h-12 border border-charcoal/20 flex items-center justify-center hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-300"
                  aria-label="Previous testimonial"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={next}
                  className="w-12 h-12 border border-charcoal/20 flex items-center justify-center hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-300"
                  aria-label="Next testimonial"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                
                {/* Progress dots */}
                <div className="flex gap-2 ml-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > current ? 1 : -1);
                        setCurrent(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === current 
                          ? "w-8 bg-terracotta" 
                          : "bg-charcoal/20 hover:bg-charcoal/40"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden image-reveal">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800"
                alt="Happy Member"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Stats Overlay */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-terracotta text-cream p-8 shadow-2xl"
            >
              <div className="text-5xl md:text-6xl font-display font-medium">
                98%
              </div>
              <div className="text-label text-cream/80 mt-2">
                Khách hàng hài lòng
              </div>
            </motion.div>

            {/* Decorative frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-terracotta/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
