import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    icon: MapPin,
    title: "Địa chỉ",
    content: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  {
    icon: Phone,
    title: "Điện thoại",
    content: "1900 1234",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@elitefit.vn",
  },
  {
    icon: Clock,
    title: "Giờ mở cửa",
    content: "5:00 - 22:00 (T2 - CN)",
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-warm-beige to-transparent" />
      
      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-label text-terracotta">
              Liên hệ với chúng tôi
            </span>
            <h2 className="heading-section text-charcoal mt-4">
              Sẵn sàng
              <br />
              <span className="text-terracotta">thay đổi</span> cuộc sống?
            </h2>
            <p className="text-body text-soft-brown mt-6 max-w-md">
              Đăng ký ngay hôm nay để nhận buổi tập thử miễn phí và tư vấn từ
              chuyên gia của chúng tôi.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group flex gap-4 p-4 bg-cream hover:bg-terracotta/5 transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
                    <item.icon className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-label text-soft-brown">
                      {item.title}
                    </h4>
                    <p className="mt-1 font-display text-charcoal">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 aspect-video overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4194929787595!2d106.69877107573575!3d10.778789859207456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704123456789!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(50%) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="hover:filter-none transition-all duration-500"
              />
            </motion.div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-gradient-to-br from-peach/30 to-transparent rounded-sm -z-10" />
            
            <div className="bg-cream p-8 md:p-12 shadow-xl shadow-charcoal/5">
              <h3 className="heading-subsection text-charcoal mb-2">
                Đăng ký tư vấn miễn phí
              </h3>
              <p className="text-soft-brown text-sm mb-8">
                Điền thông tin để nhận ưu đãi đặc biệt
              </p>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-label text-soft-brown mb-2 block"
                    >
                      Họ và tên
                    </label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên..."
                      className="h-14 px-5 rounded-none border-border/50 bg-background focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-label text-soft-brown mb-2 block"
                    >
                      Số điện thoại
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại..."
                      className="h-14 px-5 rounded-none border-border/50 bg-background focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="text-label text-soft-brown mb-2 block"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email..."
                    className="h-14 px-5 rounded-none border-border/50 bg-background focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="service"
                    className="text-label text-soft-brown mb-2 block"
                  >
                    Dịch vụ quan tâm
                  </label>
                  <select
                    id="service"
                    className="w-full h-14 px-5 border border-border/50 bg-background rounded-none focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all duration-300 text-charcoal"
                  >
                    <option value="">Chọn dịch vụ...</option>
                    <option value="personal">Personal Training</option>
                    <option value="group">Group Fitness</option>
                    <option value="strength">Strength Training</option>
                    <option value="nutrition">Nutrition Coaching</option>
                  </select>
                </div>
                
                <div>
                  <label
                    htmlFor="message"
                    className="text-label text-soft-brown mb-2 block"
                  >
                    Lời nhắn
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Nhập lời nhắn của bạn..."
                    className="rounded-none border-border/50 bg-background resize-none focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300"
                  />
                </div>
                
                <Button type="submit" className="btn-primary rounded-none w-full h-14 group">
                  Gửi đăng ký
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-xs text-soft-brown text-center">
                  Bằng việc đăng ký, bạn đồng ý với{" "}
                  <a href="#" className="text-terracotta hover:underline">
                    điều khoản dịch vụ
                  </a>{" "}
                  của chúng tôi.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
