import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useAppleScrollAnimation } from '@/hooks/useAppleScrollAnimation';

interface AppleStyleSectionProps {
  children: ReactNode;
  className?: string;
  enableParallax?: boolean;
  enableScale?: boolean;
  enableRotation?: boolean;
}

const AppleStyleSection = ({ 
  children, 
  className = "",
  enableParallax = true,
  enableScale = false,
  enableRotation = false
}: AppleStyleSectionProps) => {
  const { ref, transforms } = useAppleScrollAnimation();

  const motionStyle: any = {};
  
  if (enableParallax) {
    motionStyle.y = transforms.y;
    motionStyle.opacity = transforms.opacity;
  }
  
  if (enableScale) {
    motionStyle.scale = transforms.scale;
  }
  
  if (enableRotation) {
    motionStyle.rotateY = transforms.rotateY;
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={motionStyle}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default AppleStyleSection;