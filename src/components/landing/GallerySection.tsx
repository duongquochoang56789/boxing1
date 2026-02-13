import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ShimmerImage } from "@/components/ui/shimmer-image";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200",
    alt: "Main Gym Floor",
    category: "Gym",
    height: "h-[400px]",
  },
  {
    src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800",
    alt: "Weight Area",
    category: "Equipment",
    height: "h-[320px]",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
    alt: "Cardio Zone",
    category: "Cardio",
    height: "h-[360px]",
  },
  {
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800",
    alt: "Yoga Studio",
    category: "Yoga",
    height: "h-[340px]",
  },
  {
    src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800",
    alt: "Personal Training",
    category: "Training",
    height: "h-[380px]",
  },
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
    alt: "Luxury Lounge",
    category: "Amenities",
    height: "h-[300px]",
  },
  {
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
    alt: "Free Weights",
    category: "Equipment",
    height: "h-[360px]",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
    alt: "Group Class",
    category: "Classes",
    height: "h-[340px]",
  },
];

const categories = ["Tất cả", ...Array.from(new Set(galleryImages.map(i => i.category)))];

const GallerySection = () => {
  const ref = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filteredImages = activeCategory === "Tất cả"
    ? galleryImages
    : galleryImages.filter(i => i.category === activeCategory);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    if (selectedImage !== null) setSelectedImage((selectedImage + 1) % filteredImages.length);
  };
  const prevImage = () => {
    if (selectedImage !== null) setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section ref={ref} className="section-padding bg-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-peach/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-label text-terracotta">Không gian đẳng cấp</span>
          <h2 className="heading-section text-charcoal mt-4">
            Khám phá<br />
            <span className="text-terracotta">phòng tập</span> của chúng tôi
          </h2>
          <p className="text-body text-soft-brown mt-6">
            Không gian tập luyện hiện đại, sang trọng với đầy đủ tiện nghi đẳng cấp quốc tế.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-label px-5 py-2.5 border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-terracotta text-primary-foreground border-terracotta"
                  : "bg-transparent text-soft-brown border-border/50 hover:border-terracotta/50 hover:text-terracotta"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-5 px-5 sm:px-8 lg:px-10 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          drag="x"
          dragConstraints={scrollContainerRef}
          dragElastic={0.1}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openLightbox(index)}
                className={`flex-shrink-0 w-[300px] md:w-[380px] lg:w-[420px] ${image.height} overflow-hidden cursor-pointer relative group`}
              >
                <ShimmerImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                  style={{
                    scale: hoveredIndex === index ? 1.08 : 1,
                    filter: hoveredIndex === index ? "grayscale(0%) brightness(1.05)" : "grayscale(20%)",
                    transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent flex flex-col justify-end p-6"
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="text-terracotta-light text-label"
                    animate={{
                      y: hoveredIndex === index ? 0 : 10,
                      opacity: hoveredIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {image.category}
                  </motion.span>
                  <motion.span
                    className="text-cream font-display text-xl md:text-2xl mt-1"
                    animate={{
                      y: hoveredIndex === index ? 0 : 10,
                      opacity: hoveredIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    {image.alt}
                  </motion.span>
                </motion.div>

                {/* Corner decorations */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cream"
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, scale: hoveredIndex === index ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cream"
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, scale: hoveredIndex === index ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 mt-6 text-soft-brown/60"
        >
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1 text-label"
          >
            <ChevronLeft className="w-4 h-4" />
            Kéo để xem thêm
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
            >
              <span className="text-terracotta-light text-label">{filteredImages[selectedImage].category}</span>
              <h3 className="font-display text-2xl text-cream mt-1">{filteredImages[selectedImage].alt}</h3>
              <span className="text-cream/50 text-sm mt-2 block">{selectedImage + 1} / {filteredImages.length}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
