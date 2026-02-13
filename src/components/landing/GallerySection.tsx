import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ShimmerImage } from "@/components/ui/shimmer-image";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const defaultImages = [
  { key: "space_1", src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200", alt: "Phòng tập chính", description: "Không gian rộng rãi, thoáng đãng" },
  { key: "space_2", src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800", alt: "Khu vực tạ", description: "Trang thiết bị hiện đại" },
  { key: "space_3", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800", alt: "Cardio Zone", description: "Khu vực cardio đẳng cấp" },
  { key: "space_4", src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800", alt: "Phòng Yoga", description: "Không gian yên tĩnh, thư giãn" },
  { key: "space_5", src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800", alt: "PT Zone", description: "Khu vực tập luyện cá nhân" },
  { key: "space_6", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200", alt: "Lounge", description: "Khu nghỉ ngơi sang trọng" },
];

const GallerySection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: content } = useSiteContent("gallery");

  const galleryImages = defaultImages.map((img) => ({
    ...img,
    src: getContent(content, "image", img.key, img.src),
    alt: getContent(content, "text", `${img.key}_title`, img.alt),
    description: getContent(content, "text", `${img.key}_desc`, img.description),
  }));

  const loopImages = [...galleryImages, ...galleryImages];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let scrollPos = 0;
    const speed = 0.5;
    const halfWidth = el.scrollWidth / 2;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= halfWidth) scrollPos = 0;
      el.scrollLeft = scrollPos;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(animate); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => { if (selectedImage !== null) setSelectedImage((selectedImage + 1) % galleryImages.length); };
  const prevImage = () => { if (selectedImage !== null) setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length); };

  return (
    <section ref={ref} className="section-padding bg-warm-beige relative overflow-hidden">
      <div className="container-custom mb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center max-w-2xl mx-auto">
          <span className="text-label text-terracotta">{getContent(content, "text", "label", "Tour our Space")}</span>
          <h2 className="heading-section text-charcoal mt-4">
            {getContent(content, "text", "heading_1", "Khám phá")} <span className="text-terracotta">{getContent(content, "text", "heading_2", "không gian")}</span>
          </h2>
        </motion.div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-hidden px-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {loopImages.map((image, index) => (
          <motion.div
            key={`${image.key}-${index}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
            onClick={() => setSelectedImage(index % galleryImages.length)}
            className="flex-shrink-0 w-[350px] md:w-[420px] lg:w-[480px] cursor-pointer group"
          >
            <div className="aspect-[4/3] overflow-hidden mb-4">
              <ShimmerImage src={image.src} alt={image.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" wrapperClassName="w-full h-full" />
            </div>
            <h4 className="font-display text-xl text-charcoal font-medium">{image.alt}</h4>
            <p className="text-body-sm text-soft-brown mt-1">{image.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center" onClick={closeLightbox}>
            <button className="absolute top-6 right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors z-10" onClick={closeLightbox}><X className="w-6 h-6" /></button>
            <button className="absolute left-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }}><ChevronLeft className="w-6 h-6" /></button>
            <button className="absolute right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }}><ChevronRight className="w-6 h-6" /></button>
            <motion.img key={selectedImage} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} src={galleryImages[selectedImage].src} alt={galleryImages[selectedImage].alt} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
