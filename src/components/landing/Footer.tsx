import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube } from "lucide-react";
import useScrollTo from "@/hooks/useScrollTo";

const footerLinks = {
  services: [
    { name: "Personal Training", href: "#services" },
    { name: "Group Fitness", href: "#services" },
    { name: "Yoga & Pilates", href: "#services" },
    { name: "Nutrition Coaching", href: "#services" },
  ],
  company: [
    { name: "Về chúng tôi", href: "#about" },
    { name: "Virtual Training", href: "#virtual-training" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "Huấn luyện viên", href: "#trainers" },
    { name: "Liên hệ", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

const Footer = () => {
  const { handleClick } = useScrollTo();
  return (
    <footer className="bg-charcoal text-cream">
      {/* Top divider line */}
      <div className="border-t border-cream/8" />

      {/* Main footer content */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" onClick={(e) => handleClick(e, "#home")} className="inline-block font-display text-3xl font-semibold tracking-tight mb-6">
              ELITE<span className="text-terracotta">FIT</span>
            </a>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              Không gian luyện tập đẳng cấp — nơi sự cân bằng gặp gỡ tinh tế.
              Trải nghiệm khác biệt, kết quả bền vững.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ y: -2 }}
                  className="w-9 h-9 border border-cream/15 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream/40 transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Contact minimal */}
            <div className="mt-8 space-y-1.5 text-sm text-cream/40">
              <p>1900 1234</p>
              <p>info@elitefit.vn</p>
              <p>123 Nguyễn Huệ, Quận 1, TP.HCM</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-label text-cream/50 mb-5">Dịch vụ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-cream/60 hover:text-cream transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-cream/50 mb-5">Khám phá</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-cream/60 hover:text-cream transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/8">
        <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-cream/30 text-xs">
            © 2025 EliteFit. Bản quyền thuộc về công ty.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
