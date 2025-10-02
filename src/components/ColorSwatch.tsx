import { cn } from "@/lib/utils";
import { getColorInfo } from "@/constants/colors";

interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const ColorSwatch = ({
  color,
  size = "md",
  showLabel = false,
  className,
  selected = false,
  onClick,
}: ColorSwatchProps) => {
  const colorInfo = getColorInfo(color);
  
  if (!colorInfo) return null;

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const isLightColor = color === "White";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${color} color${selected ? " (selected)" : ""}`}
    >
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full border-2 transition-all duration-200",
          isLightColor ? "border-border" : "border-transparent",
          selected && "ring-2 ring-primary ring-offset-2",
          onClick && "hover:scale-110"
        )}
        style={{ backgroundColor: colorInfo.hex }}
        title={colorInfo.displayName}
      />
      {showLabel && (
        <span className="text-sm font-medium">{colorInfo.displayName}</span>
      )}
    </div>
  );
};
