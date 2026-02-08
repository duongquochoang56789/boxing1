import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface UseScrollProgressOptions {
  offset?: ["start start" | "start end" | "end start" | "end end", "start start" | "start end" | "end start" | "end end"];
}

export const useScrollProgress = (options?: UseScrollProgressOptions) => {
  const ref = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options?.offset || ["start end", "end start"],
  });

  return { ref, scrollYProgress };
};

export const useParallax = (
  scrollYProgress: MotionValue<number>,
  distance: number = 100
) => {
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
};

export const useOpacityOnScroll = (
  scrollYProgress: MotionValue<number>,
  fadeIn: boolean = true
) => {
  return useTransform(
    scrollYProgress,
    fadeIn ? [0, 0.3, 0.7, 1] : [0, 0.3, 0.7, 1],
    fadeIn ? [0, 1, 1, 0] : [1, 1, 1, 0]
  );
};
