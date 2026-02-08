import { useInView } from "framer-motion";
import { useRef, useMemo } from "react";

export const useTextReveal = (text: string, delay: number = 0.03) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const characters = useMemo(() => {
    return text.split("").map((char, index) => ({
      char,
      delay: delay * index,
    }));
  }, [text, delay]);

  return { ref, isInView, characters };
};

export const useWordReveal = (text: string, delay: number = 0.1) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = useMemo(() => {
    return text.split(" ").map((word, index) => ({
      word,
      delay: delay * index,
    }));
  }, [text, delay]);

  return { ref, isInView, words };
};
