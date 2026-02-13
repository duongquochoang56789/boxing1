import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerImageProps {
  src?: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
}

const ShimmerImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  style,
}: ShimmerImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && (
        <div className="absolute inset-0 shimmer" />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={cn(className)}
        style={style}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};

export { ShimmerImage };
