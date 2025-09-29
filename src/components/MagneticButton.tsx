import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useMagneticHover } from '@/hooks/useAppleScrollAnimation';
import { Button } from '@/components/ui/button';

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MagneticButton = ({ 
  children, 
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false
}: MagneticButtonProps) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticHover();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden transition-all duration-300 ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </Button>
    </motion.div>
  );
};

export default MagneticButton;