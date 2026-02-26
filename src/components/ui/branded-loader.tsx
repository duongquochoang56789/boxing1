import { motion } from "framer-motion";

interface BrandedLoaderProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  showProgress?: boolean;
  variant?: "page" | "inline";
  className?: string;
}

const sizeConfig = {
  sm: { svg: 24, viewBox: 48, text: "text-xs", gap: "gap-2" },
  md: { svg: 56, viewBox: 48, text: "text-sm", gap: "gap-3" },
  lg: { svg: 80, viewBox: 48, text: "text-base", gap: "gap-4" },
};

const BrandedLoader = ({
  size = "md",
  message,
  showProgress = false,
  variant = "page",
  className,
}: BrandedLoaderProps) => {
  const s = sizeConfig[size];

  const loader = (
    <div className={`flex ${variant === "inline" ? "flex-row items-center" : "flex-col items-center"} ${s.gap}`}>
      <motion.svg
        width={s.svg}
        height={s.svg}
        viewBox={`0 0 ${s.viewBox} ${s.viewBox}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        {/* Ellipse 1 - rotates independently */}
        <motion.ellipse
          cx="20" cy="24" rx="11" ry="14"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          className="text-terracotta"
          opacity={0.8}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "24px 24px" }}
        />

        {/* Ellipse 2 */}
        <motion.ellipse
          cx="28" cy="24" rx="11" ry="14"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          className="text-terracotta"
          opacity={0.5}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "24px 24px" }}
        />

        {/* Ellipse 3 */}
        <motion.ellipse
          cx="24" cy="24" rx="8" ry="16"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-charcoal/40"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "24px 24px" }}
        />
      </motion.svg>

      {variant === "page" && size !== "sm" && (
        <>
          {/* Breathing FLYFIT text */}
          <motion.div
            className="flex items-baseline"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className={`font-display font-light tracking-tight ${size === "lg" ? "text-xl" : "text-base"} text-charcoal`}>
              FLY
            </span>
            <span className={`font-display font-light tracking-tight ${size === "lg" ? "text-xl" : "text-base"} text-terracotta`}>
              FIT
            </span>
          </motion.div>

          {/* Message */}
          {message && (
            <motion.p
              className={`${s.text} text-soft-brown`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.p>
          )}

          {/* Progress bar */}
          {showProgress && (
            <div className="w-48 h-0.5 bg-border/50 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-terracotta rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "40%" }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  if (variant === "inline") return loader;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      {loader}
    </div>
  );
};

export { BrandedLoader };
export default BrandedLoader;
