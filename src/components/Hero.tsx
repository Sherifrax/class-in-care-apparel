import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import heroVideo from "@/assets/aura-hero-animation.mp4";
import { heroText, heroButtons, float, glow } from "@/lib/animations";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <video 
          src={heroVideo} 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/70 to-transparent"></div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-luxury-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 text-center md:text-left"
        style={{ opacity }}
      >
        <motion.div 
          className="max-w-2xl bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-luxury-gold/20"
          variants={glow}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="font-posterama text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            Where <motion.span 
              className="text-luxury-gold"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(255, 215, 0, 0)",
                  "0 0 20px rgba(255, 215, 0, 0.8)",
                  "0 0 0px rgba(255, 215, 0, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >PRESENCE</motion.span> Becomes <motion.span 
              className="text-luxury-gold"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(255, 215, 0, 0)",
                  "0 0 20px rgba(255, 215, 0, 0.8)",
                  "0 0 0px rgba(255, 215, 0, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >POWER</motion.span>
          </motion.h1>
          
          <motion.p 
            className="font-posterama text-lg text-luxury-gold mb-8 leading-relaxed drop-shadow-xl"
            variants={heroText}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Elevating medical uniforms with premium design and unmatched elegance. 
            Crafted for healthcare professionals who command respect through presence.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={heroButtons}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 215, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-dark hover:to-luxury-gold text-black font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Explore AURA Collection
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black px-8 py-3 text-lg">
                  Discover Our Power
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        variants={float}
        initial="hidden"
        animate="visible"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;