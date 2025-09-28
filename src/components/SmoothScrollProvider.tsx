import { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Smooth scroll behavior
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({
        top: e.deltaY * 0.5,
        behavior: 'smooth'
      });
    };

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optional: Add wheel event listener for enhanced smooth scrolling
    // window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      // window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <motion.div
      style={{
        scale: useTransform(smoothProgress, [0, 1], [1, 0.95]),
        opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
      }}
    >
      {children}
    </motion.div>
  );
};

export default SmoothScrollProvider;
