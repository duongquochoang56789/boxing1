import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";
import Logo from "@/components/ui/Logo";
import useScrollTo from "@/hooks/useScrollTo";

const navLinks = [
  { name: "Trang chủ", href: "#home" },
  { name: "Giới thiệu", href: "#about" },
  { name: "Dịch vụ", href: "#services" },
  { name: "Online", href: "#virtual-training" },
  { name: "Bảng giá", href: "#pricing" },
  { name: "HLV", href: "#trainers" },
  { name: "Liên hệ", href: "#contact" },
];

const Header = () => {
  const { handleClick } = useScrollTo();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > 100) {
        setIsVisible(currentScrollY < lastScrollY.current || currentScrollY < 50);
      } else {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible || isMobileMenuOpen ? 0 : -100 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-cream/95 backdrop-blur-xl shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleClick(e, "#home")}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="transition-colors duration-500"
          >
            <Logo variant={isScrolled ? "dark" : "light"} />
          </motion.a>

          {/* Desktop Navigation */}
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex items-center gap-5 xl:gap-7"
          >
            {navLinks.map((link, index) => (
              <motion.li
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <a
                  href={link.href}
                  onClick={(e) => {
                    if ((link as any).isRoute) {
                      e.preventDefault();
                      navigate(link.href);
                    } else {
                      handleClick(e, link.href);
                    }
                  }}
                  className={`text-label transition-colors duration-300 link-underline ${
                    isScrolled
                      ? "text-soft-brown hover:text-terracotta"
                      : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <MagneticButton className="btn-primary rounded-none">
              Đặt lịch ngay
            </MagneticButton>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`lg:hidden p-2 -mr-2 transition-colors ${
              isScrolled ? "text-charcoal hover:text-terracotta" : "text-cream hover:text-peach"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 top-0 bg-cream/98 backdrop-blur-xl z-40"
          >
            <div className="container-custom pt-24 pb-12 h-full flex flex-col">
              <ul className="space-y-1 flex-1">
                {navLinks.map((link, index) => (
                  <motion.li key={link.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                    <a href={link.href} onClick={(e) => {
                      if ((link as any).isRoute) {
                        e.preventDefault();
                        navigate(link.href);
                        setIsMobileMenuOpen(false);
                      } else {
                        handleClick(e, link.href, () => setIsMobileMenuOpen(false));
                      }
                    }} className="block py-4 font-display text-3xl md:text-4xl text-charcoal hover:text-terracotta transition-colors duration-300">
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.4 }} className="pt-8 border-t border-border">
                <MagneticButton className="btn-primary rounded-none w-full h-14">Đặt lịch ngay</MagneticButton>
                <p className="text-center text-sm text-muted-foreground mt-6">Hotline: <a href="tel:1900xxxx" className="text-terracotta">1900 xxxx</a></p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
