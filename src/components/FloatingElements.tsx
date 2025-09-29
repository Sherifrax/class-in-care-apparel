import { motion } from 'framer-motion';
import { useParallaxLayers } from '@/hooks/useAppleScrollAnimation';

const FloatingElements = () => {
  const { ref, layers } = useParallaxLayers();

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-medical-blue/20 to-medical-teal/20 rounded-full blur-3xl"
        style={layers.background}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, -30, 0],
          y: [0, -30, 40, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-luxury-navy/15 to-medical-blue/15 rounded-full blur-3xl"
        style={layers.midground}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -40, 60, 0],
          y: [0, 50, -20, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-medical-blue/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            ...layers.foreground
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-1/2 left-1/6 w-8 h-8 border border-medical-teal/40 rotate-45"
        style={layers.midground}
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/6 w-6 h-6 bg-luxury-navy/20 rounded-full"
        style={layers.foreground}
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FloatingElements;