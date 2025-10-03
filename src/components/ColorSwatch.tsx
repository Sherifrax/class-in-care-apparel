import { cn } from "@/lib/utils";
import { getColorInfo } from "@/constants/colors";
import { Check } from "lucide-react";

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
        "flex flex-col items-center gap-2 group relative",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${color} color${selected ? " (selected)" : ""}`}
    >
      <div className="relative">
        <div
          className={cn(
            sizeClasses[size],
            "rounded-full border-2 transition-all duration-300 relative",
            isLightColor ? "border-border" : "border-transparent",
            selected && "ring-4 ring-medical-blue ring-offset-2 shadow-glow border-medical-blue",
            !selected && onClick && "opacity-50 hover:opacity-100",
            onClick && "hover:scale-110 hover:shadow-lg"
          )}
          style={{ backgroundColor: colorInfo.hex }}
          title={colorInfo.displayName}
        >
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-medical-blue rounded-full p-0.5 shadow-lg">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>
      </div>
      {(showLabel || selected || onClick) && (
        <span className={cn(
          "text-xs font-medium transition-all duration-200 text-center",
          selected ? "text-medical-blue font-bold" : "text-muted-foreground opacity-60",
          onClick && "group-hover:text-medical-blue group-hover:opacity-100"
        )}>
          {colorInfo.displayName}
        </span>
      )}
    </div>
  );
};
