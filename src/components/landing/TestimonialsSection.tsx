import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
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
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    role: "Kỹ sư IT",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    content:
      "Không gian tập luyện sang trọng, máy móc hiện đại. Tôi đặc biệt ấn tượng với chương trình dinh dưỡng được tư vấn riêng cho từng người.",
    rating: 5,
  },
  {
    id: 3,
    name: "Lê Thị Mai Anh",
    role: "Bác sĩ",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    content:
      "Các lớp Yoga ở đây rất chất lượng. Cô Hương dạy rất tận tình và chuyên nghiệp. Tôi đã giới thiệu cho rất nhiều bạn bè.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-secondary">
      <div className="container-custom" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
              Đánh giá
            </span>
            <h2 className="heading-section mt-4">
              Học viên nói gì
              <br />
              về <span className="text-accent">chúng tôi</span>
            </h2>

            {/* Testimonial Card */}
            <div className="mt-10 relative">
              <Quote className="w-12 h-12 text-accent/20 absolute -top-2 -left-2" />
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <p className="text-xl md:text-2xl font-display leading-relaxed text-foreground/90">
                  "{testimonials[current].content}"
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <img
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-display font-medium text-lg">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={prev}
                  className="w-12 h-12 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-12 h-12 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800"
                alt="Happy Member"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-8 -left-8 bg-accent text-accent-foreground p-8">
              <div className="text-4xl md:text-5xl font-display font-bold">
                98%
              </div>
              <div className="text-sm uppercase tracking-wider mt-2">
                Khách hàng hài lòng
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
