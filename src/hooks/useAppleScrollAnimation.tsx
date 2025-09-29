import { useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, RefObject } from 'react';

export const useAppleScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring physics for Apple-like feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Apple-style transforms
  const y = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [0, 5, 0]);
  const rotateY = useTransform(smoothProgress, [0, 1], [0, 360]);

  return {
    ref,
    scrollYProgress: smoothProgress,
    transforms: {
      y,
      opacity,
      scale,
      rotateX,
      rotateY
    }
  };
};

export const useParallaxLayers = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Multiple parallax layers for depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  
  return {
    ref,
    layers: {
      background: { y: backgroundY },
      midground: { y: midgroundY },
      foreground: { y: foregroundY }
    }
  };
};

export const useMagneticHover = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 100;
    
    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      const moveX = deltaX * strength * 0.3;
      const moveY = deltaY * strength * 0.3;
      
      ref.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`;
    }
  };
  
  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };
  
  return {
    ref,
    handleMouseMove,
    handleMouseLeave
  };
};