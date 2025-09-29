import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const ScrollReveal = ({ 
  children, 
  variants,
  className = "",
  delay = 0,
  duration = 0.6,
  threshold = 0.1
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once: true,
    margin: "0px 0px -50px 0px"
  });

  const defaultVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants || defaultVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
