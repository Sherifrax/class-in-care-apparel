import { Badge } from "@/components/ui/badge";
import { ColorSwatch } from "@/components/ColorSwatch";
import { COLOR_ORDER } from "@/constants/colors";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorChipSelectorProps {
  selectedColors: string[];
  onColorSelect: (color: string) => void;
  className?: string;
}

export const ColorChipSelector = ({
  selectedColors,
  onColorSelect,
  className,
}: ColorChipSelectorProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected colors as removable chips */}
      {selectedColors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-medical-blue">
            Selected Colors ({selectedColors.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                className="pl-2 pr-1 py-1 bg-medical-blue/10 hover:bg-medical-blue/20 border border-medical-blue/30 transition-colors"
              >
                <span className="text-sm font-medium text-medical-blue mr-2">
                  {color}
                </span>
                <button
                  onClick={() => onColorSelect(color)}
                  className="ml-1 hover:bg-medical-blue/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${color}`}
                >
                  <X className="w-3 h-3 text-medical-blue" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Color picker grid */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-luxury-navy">
          {selectedColors.length === 0 ? "Select Colors" : "Add More Colors"}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          {COLOR_ORDER.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <ColorSwatch
                key={color}
                color={color}
                size="lg"
                selected={isSelected}
                onClick={() => onColorSelect(color)}
                showLabel={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
