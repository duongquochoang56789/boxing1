import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    icon: MapPin,
    title: "Địa chỉ",
    content: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
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
    content: "5:00 - 22:00 (Thứ 2 - CN)",
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
              Liên hệ
            </span>
            <h2 className="heading-section mt-4">
              Sẵn sàng
              <br />
              <span className="text-accent">thay đổi</span> cuộc sống?
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md">
              Đăng ký ngay hôm nay để nhận buổi tập thử miễn phí và tư vấn từ
              chuyên gia của chúng tôi.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 font-display">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 aspect-video bg-muted overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4194929787595!2d106.69877107573575!3d10.778789859207456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704123456789!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </motion.div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-secondary p-8 md:p-12"
          >
            <h3 className="font-display text-2xl md:text-3xl font-medium mb-8">
              Đăng ký tư vấn miễn phí
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Họ và tên
                  </label>
                  <Input
                    id="name"
                    placeholder="Nhập họ tên..."
                    className="rounded-none border-border bg-background h-12"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Số điện thoại
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    className="rounded-none border-border bg-background h-12"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email..."
                  className="rounded-none border-border bg-background h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium mb-2"
                >
                  Dịch vụ quan tâm
                </label>
                <select
                  id="service"
                  className="w-full h-12 px-4 border border-border bg-background rounded-none focus:outline-none focus:ring-2 focus:ring-accent"
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
                  className="block text-sm font-medium mb-2"
                >
                  Lời nhắn
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Nhập lời nhắn của bạn..."
                  className="rounded-none border-border bg-background resize-none"
                />
              </div>
              <Button type="submit" className="btn-primary rounded-none w-full">
                Gửi đăng ký
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <a href="#" className="underline">
                  điều khoản dịch vụ
                </a>{" "}
                của chúng tôi.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
