import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  services: [
    { name: "Personal Training", href: "#" },
    { name: "Group Fitness", href: "#" },
    { name: "Yoga & Pilates", href: "#" },
    { name: "Nutrition Coaching", href: "#" },
  ],
  company: [
    { name: "Về chúng tôi", href: "#about" },
    { name: "Huấn luyện viên", href: "#trainers" },
    { name: "Tin tức", href: "#" },
    { name: "Tuyển dụng", href: "#" },
  ],
  support: [
    { name: "FAQ", href: "#" },
    { name: "Liên hệ", href: "#contact" },
    { name: "Chính sách bảo mật", href: "#" },
    { name: "Điều khoản sử dụng", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-peach/5 rounded-full blur-3xl" />
      
      {/* Newsletter Section */}
      <div className="border-b border-cream/10">
        <div className="container-custom py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="heading-subsection text-cream">
                Nhận thông tin ưu đãi
              </h3>
              <p className="text-cream/60 mt-2">
                Đăng ký để nhận thông tin khuyến mãi và tin tức mới nhất
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="h-14 px-5 bg-cream/5 border-cream/20 text-cream placeholder:text-cream/40 rounded-none w-full lg:w-80 focus:border-terracotta focus:ring-terracotta/20"
              />
              <MagneticButton className="h-14 px-8 bg-terracotta hover:bg-terracotta/90 text-cream rounded-none whitespace-nowrap">
                Đăng ký
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.a
              href="#home"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block font-display text-3xl font-semibold tracking-tight"
            >
              ELITE<span className="text-terracotta">FIT</span>
            </motion.a>
            <p className="text-cream/60 mt-6 max-w-sm leading-relaxed">
              Phòng tập đẳng cấp quốc tế với đội ngũ huấn luyện viên chuyên
              nghiệp, trang thiết bị hiện đại và không gian sang trọng.
            </p>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a href="tel:19001234" className="flex items-center gap-3 text-cream/60 hover:text-terracotta transition-colors">
                <Phone className="w-4 h-4" />
                <span>1900 1234</span>
              </a>
              <a href="mailto:info@elitefit.vn" className="flex items-center gap-3 text-cream/60 hover:text-terracotta transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@elitefit.vn</span>
              </a>
              <div className="flex items-start gap-3 text-cream/60">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 border border-cream/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta text-cream/60 hover:text-cream transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display text-lg font-medium mb-6 text-cream">Dịch vụ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-terracotta transition-colors text-sm link-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-6 text-cream">Công ty</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-terracotta transition-colors text-sm link-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-6 text-cream">Hỗ trợ</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/60 hover:text-terracotta transition-colors text-sm link-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-sm">
            © 2024 EliteFit. Bản quyền thuộc về công ty.
          </p>
          <p className="text-cream/40 text-sm">
            Thiết kế với{" "}
            <span className="text-terracotta">♥</span>{" "}
            bởi EliteFit Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
