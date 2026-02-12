import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glare?: boolean;
}

export const TiltCard = ({ children, className, tiltStrength = 10, glare = true }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltStrength, -tiltStrength]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltStrength, tiltStrength]), { stiffness: 200, damping: 20 });
  const glareOpacity = useTransform(y, [0, 0.5, 1], [0.15, 0, 0.15]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn("relative", className)}
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            opacity: glareOpacity,
            background: "linear-gradient(135deg, hsl(var(--primary-foreground)) 0%, transparent 80%)",
          }}
        />
      )}
    </motion.div>
  );
};
