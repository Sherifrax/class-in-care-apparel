import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  threshold = 0.1
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const getAnimationClass = () => {
    switch (animation) {
      case 'slideLeft':
        return 'scroll-slide-left';
      case 'slideRight':
        return 'scroll-slide-right';
      case 'scale':
        return 'scroll-scale-in';
      default:
        return 'scroll-fade-in';
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        getAnimationClass(),
        isVisible && 'visible',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;