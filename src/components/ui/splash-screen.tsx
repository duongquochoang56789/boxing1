import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"drawing" | "text" | "reveal">("drawing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 800);
    const t2 = setTimeout(() => setPhase("reveal"), 2000);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // SVG path lengths for stroke animation
  const outerCircumference = 2 * Math.PI * 22; // r=22
  const ellipse1Circumference = 2 * Math.PI * Math.sqrt((11 * 11 + 14 * 14) / 2);
  const ellipse2Circumference = 2 * Math.PI * Math.sqrt((11 * 11 + 14 * 14) / 2);
  const ellipse3Circumference = 2 * Math.PI * Math.sqrt((8 * 8 + 16 * 16) / 2);

  return (
    <AnimatePresence>
      {phase !== "reveal" ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal"
        animate={phase === "reveal" ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={phase === "reveal" ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] } : {}}
      >
        {/* Logo SVG */}
        <motion.svg
          width={120}
          height={120}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8"
        >
          {/* Outer ring - drawing effect */}
          <motion.circle
            cx="24" cy="24" r="22"
            stroke="rgba(245, 240, 235, 0.15)"
            strokeWidth="0.5"
            fill="none"
            initial={{ strokeDasharray: outerCircumference, strokeDashoffset: outerCircumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Ellipse 1 */}
          <motion.ellipse
            cx="20" cy="24" rx="11" ry="14"
            stroke="#D4936A"
            strokeWidth="1.2"
            fill="none"
            initial={{ opacity: 0, scale: 0.5, strokeDasharray: ellipse1Circumference, strokeDashoffset: ellipse1Circumference }}
            animate={{ opacity: 0.8, scale: 1, strokeDashoffset: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "20px 24px" }}
          />

          {/* Ellipse 2 */}
          <motion.ellipse
            cx="28" cy="24" rx="11" ry="14"
            stroke="#D4936A"
            strokeWidth="1.2"
            fill="none"
            initial={{ opacity: 0, scale: 0.5, strokeDasharray: ellipse2Circumference, strokeDashoffset: ellipse2Circumference }}
            animate={{ opacity: 0.6, scale: 1, strokeDashoffset: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "28px 24px" }}
          />

          {/* Ellipse 3 */}
          <motion.ellipse
            cx="24" cy="24" rx="8" ry="16"
            stroke="#F5F0EB"
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0, scale: 0.5, strokeDasharray: ellipse3Circumference, strokeDashoffset: ellipse3Circumference }}
            animate={{ opacity: 0.4, scale: 1, strokeDashoffset: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "24px 24px" }}
          />

          {/* Floating dots */}
          {[
            { cx: 10, cy: 14, r: 1, delay: 1.0 },
            { cx: 38, cy: 34, r: 1, delay: 1.1 },
            { cx: 36, cy: 10, r: 0.8, delay: 1.2 },
            { cx: 12, cy: 38, r: 0.8, delay: 1.3 },
          ].map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx} cy={dot.cy} r={dot.r}
              fill="rgba(245, 240, 235, 0.4)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: dot.delay }}
            />
          ))}
        </motion.svg>

        {/* Text "FLYFIT" */}
        <div className="flex items-baseline gap-0 mb-4">
          {"FLY".split("").map((char, i) => (
            <motion.span
              key={`fly-${i}`}
              className="font-display text-3xl md:text-4xl font-light tracking-tight text-cream"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.08 }}
            >
              {char}
            </motion.span>
          ))}
          {"FIT".split("").map((char, i) => (
            <motion.span
              key={`fit-${i}`}
              className="font-display text-3xl md:text-4xl font-light tracking-tight text-terracotta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.45 + i * 0.08 }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Slogan */}
        <motion.p
          className="text-cream/50 text-sm md:text-base tracking-[0.3em] uppercase font-body"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          Bay Cao · Sống Khoẻ
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
