import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200",
    alt: "Main Gym Floor",
    span: "col-span-2 row-span-2",
    category: "Gym",
  },
  {
    src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800",
    alt: "Weight Area",
    span: "col-span-1 row-span-1",
    category: "Equipment",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800",
    alt: "Cardio Zone",
    span: "col-span-1 row-span-1",
    category: "Cardio",
  },
  {
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800",
    alt: "Yoga Studio",
    span: "col-span-1 row-span-1",
    category: "Yoga",
  },
  {
    src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800",
    alt: "Personal Training",
    span: "col-span-1 row-span-1",
    category: "Training",
  },
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
    alt: "Luxury Lounge",
    span: "col-span-2 row-span-1",
    category: "Amenities",
  },
];

const GallerySection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
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
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-label text-terracotta">
            Không gian đẳng cấp
          </span>
          <h2 className="heading-section text-charcoal mt-4">
            Khám phá
            <br />
            <span className="text-terracotta">phòng tập</span> của chúng tôi
          </h2>
          <p className="text-body text-soft-brown mt-6">
            Không gian tập luyện hiện đại, sang trọng với đầy đủ tiện
            nghi đẳng cấp quốc tế.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          style={{ y }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[280px]"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openLightbox(index)}
              className={`${image.span} overflow-hidden cursor-pointer relative group`}
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                animate={{
                  scale: hoveredIndex === index ? 1.1 : 1,
                  filter: hoveredIndex === index ? "grayscale(0%)" : "grayscale(30%)",
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex flex-col justify-end p-6"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-terracotta-light text-label"
                  initial={{ y: 10, opacity: 0 }}
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
                  initial={{ y: 10, opacity: 0 }}
                  animate={{
                    y: hoveredIndex === index ? 0 : 10,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {image.alt}
                </motion.span>
              </motion.div>

              {/* Corner decoration */}
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cream"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cream"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
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
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation buttons */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-6 w-12 h-12 bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Image */}
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
            >
              <span className="text-terracotta-light text-label">
                {galleryImages[selectedImage].category}
              </span>
              <h3 className="font-display text-2xl text-cream mt-1">
                {galleryImages[selectedImage].alt}
              </h3>
              <span className="text-cream/50 text-sm mt-2 block">
                {selectedImage + 1} / {galleryImages.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
