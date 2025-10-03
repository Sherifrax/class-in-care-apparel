import { ColorSwatch } from "./ColorSwatch";
import { COLOR_ORDER } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  multiSelect?: boolean;
  selectedColors?: string[];
  className?: string;
}

export const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
  multiSelect = false,
  selectedColors = [],
  className,
}: ColorSelectorProps) => {
  // Sort colors according to COLOR_ORDER
  const sortedColors = colors.sort((a, b) => {
    const indexA = COLOR_ORDER.indexOf(a);
    const indexB = COLOR_ORDER.indexOf(b);
    return indexA - indexB;
  });

  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4", className)}>
      {sortedColors.map((color) => {
        const isSelected = multiSelect
          ? selectedColors.includes(color)
          : selectedColor === color;

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
  );
};
