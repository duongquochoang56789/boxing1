import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

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
  { icon: Twitter, href: "#", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="bg-gym-charcoal text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
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
              ELITE<span className="text-accent">FIT</span>
            </motion.a>
            <p className="text-muted-foreground mt-6 max-w-sm leading-relaxed">
              Phòng tập đẳng cấp quốc tế với đội ngũ huấn luyện viên chuyên
              nghiệp, trang thiết bị hiện đại và không gian sang trọng.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 border border-border flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display text-lg font-medium mb-6">Dịch vụ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-6">Công ty</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-6">Hỗ trợ</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors text-sm"
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
      <div className="border-t border-border">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 EliteFit. Bản quyền thuộc về công ty.
          </p>
          <p className="text-muted-foreground text-sm">
            Thiết kế bởi{" "}
            <a href="#" className="text-accent hover:underline">
              Lovable
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
