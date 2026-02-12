import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useRef, useCallback, useState } from "react";

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface MagneticButtonProps extends ButtonProps {
  magnetic?: boolean;
  ripple?: boolean;
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, children, magnetic = true, ripple = true, ...props }, ref) => {
    const { ref: magneticRef, springX, springY, handleMouseMove, handleMouseLeave } = useMagnetic(0.25);
    const [ripples, setRipples] = useState<(RippleStyle & { key: number })[]>([]);
    const rippleTimeout = useRef<number>();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ripple) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const newRipple = {
          left: e.clientX - rect.left - size / 2,
          top: e.clientY - rect.top - size / 2,
          width: size,
          height: size,
          key: Date.now(),
        };
        setRipples((prev) => [...prev, newRipple]);
        clearTimeout(rippleTimeout.current);
        rippleTimeout.current = window.setTimeout(() => setRipples([]), 600);
        props.onClick?.(e);
      },
      [ripple, props]
    );

    return (
      <motion.div
        ref={magneticRef as React.RefObject<HTMLDivElement>}
        style={magnetic ? { x: springX, y: springY } : undefined}
        onMouseMove={magnetic ? handleMouseMove : undefined}
        onMouseLeave={magnetic ? handleMouseLeave : undefined}
        className="inline-block"
      >
        <Button
          ref={ref}
          className={cn("relative overflow-hidden", className)}
          {...props}
          onClick={handleClick}
        >
          {children}
          {ripple &&
            ripples.map((r) => (
              <motion.span
                key={r.key}
                className="absolute rounded-full bg-primary-foreground/30 pointer-events-none"
                style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
        </Button>
      </motion.div>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

export { MagneticButton };
