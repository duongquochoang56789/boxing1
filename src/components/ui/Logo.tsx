interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
};

const Logo = ({ variant = "dark", className = "", size = "md" }: LogoProps) => {
  const flyColor = variant === "light" ? "text-cream" : "text-charcoal";

  return (
    <span className={`font-display font-semibold tracking-tight ${sizes[size]} ${className}`}>
      <span className={flyColor}>FLY</span>
      <span className="text-terracotta">FIT</span>
    </span>
  );
};

export default Logo;
