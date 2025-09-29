import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
  disabled?: boolean;
  className?: string;
}

const AnimatedQuantitySelector = ({
  quantity,
  onQuantityChange,
  maxQuantity = 99,
  minQuantity = 1,
  disabled = false,
  className = ""
}: AnimatedQuantitySelectorProps) => {
  const handleIncrease = () => {
    if (quantity < maxQuantity && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > minQuantity && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const canIncrease = quantity < maxQuantity && !disabled;
  const canDecrease = quantity > minQuantity && !disabled;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Decrease Button */}
      <motion.div
        whileHover={canDecrease ? { scale: 1.05 } : {}}
        whileTap={canDecrease ? { scale: 0.95 } : {}}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={cn(
            "w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white transition-all duration-200",
            !canDecrease && "opacity-50 cursor-not-allowed"
          )}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Quantity Display */}
      <motion.div
        key={quantity}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mx-4 min-w-[60px] text-center"
      >
        <div className={cn(
          "text-lg font-semibold text-foreground px-4 py-2 rounded-lg bg-white/70 backdrop-blur-sm border border-white/30",
          disabled && "opacity-50"
        )}>
          {quantity}
        </div>
      </motion.div>

      {/* Increase Button */}
      <motion.div
        whileHover={canIncrease ? { scale: 1.05 } : {}}
        whileTap={canIncrease ? { scale: 0.95 } : {}}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={!canIncrease}
          className={cn(
            "w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white transition-all duration-200",
            !canIncrease && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Stock Info */}
      {maxQuantity < 10 && maxQuantity > 0 && !disabled && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-2 text-xs text-muted-foreground"
        >
          Only {maxQuantity} left
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedQuantitySelector;