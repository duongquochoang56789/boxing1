interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { wrapper: "h-8", text: "text-lg", circles: 28 },
  md: { wrapper: "h-10 md:h-12", text: "text-xl md:text-2xl", circles: 36 },
  lg: { wrapper: "h-12 md:h-14", text: "text-2xl md:text-3xl", circles: 44 },
};

const Logo = ({ variant = "dark", className = "", size = "md" }: LogoProps) => {
  const s = sizes[size];
  const isLight = variant === "light";
  const mainColor = isLight ? "#F5F0EB" : "#2C2418";
  const accentColor = isLight ? "#D4936A" : "#B5654A";
  const circleColor = isLight ? "rgba(245, 240, 235, 0.25)" : "rgba(181, 101, 74, 0.2)";
  const dotColor = isLight ? "rgba(245, 240, 235, 0.4)" : "rgba(181, 101, 74, 0.35)";

  return (
    <span className={`inline-flex items-center gap-2.5 ${s.wrapper} ${className}`}>
      {/* Decorative circles icon */}
      <svg
        width={s.circles}
        height={s.circles}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer decorative ring */}
        <circle cx="24" cy="24" r="22" stroke={circleColor} strokeWidth="0.5" fill="none" />
        
        {/* Overlapping pilates-style circles */}
        <ellipse cx="20" cy="24" rx="11" ry="14" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.8" />
        <ellipse cx="28" cy="24" rx="11" ry="14" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        <ellipse cx="24" cy="24" rx="8" ry="16" stroke={mainColor} strokeWidth="1" fill="none" opacity="0.4" />
        
        {/* Decorative arc swooshes */}
        <path
          d="M8 20 Q16 8, 28 10"
          stroke={circleColor}
          strokeWidth="0.6"
          fill="none"
        />
        <path
          d="M40 28 Q32 40, 20 38"
          stroke={circleColor}
          strokeWidth="0.6"
          fill="none"
        />
        
        {/* Small floating dots */}
        <circle cx="10" cy="14" r="1" fill={dotColor} />
        <circle cx="38" cy="34" r="1" fill={dotColor} />
        <circle cx="36" cy="10" r="0.8" fill={dotColor} />
        <circle cx="12" cy="38" r="0.8" fill={dotColor} />
      </svg>

      {/* Typography */}
      <span className={`font-display font-light tracking-tight leading-none ${s.text}`}>
        <span style={{ color: mainColor }}>FLY</span>
        <span style={{ color: accentColor }}>FIT</span>
      </span>
    </span>
  );
};

export default Logo;
