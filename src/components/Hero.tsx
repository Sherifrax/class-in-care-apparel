import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/aura-hero-animation.mp4";
import { useParallax } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const { elementRef: heroRef, offset } = useParallax(0.3);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay and parallax */}
      <div 
        className="absolute inset-0" 
        style={{ transform: `translateY(${offset}px)` }}
      >
        <video 
          src={heroVideo} 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/70 to-transparent"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-luxury-gold/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-medical-blue/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-luxury-gold/5 rounded-full blur-xl float"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
        <div className={cn(
          "max-w-2xl bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-luxury-gold/20 transition-all duration-1000",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h1 className={cn(
            "font-posterama text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl transition-all duration-1000 delay-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Where <span className="text-luxury-gold animate-pulse-glow">PRESENCE</span> Becomes <span className="text-luxury-gold animate-pulse-glow">POWER</span>
          </h1>
          
          <p className={cn(
            "font-posterama text-lg text-luxury-gold mb-8 leading-relaxed drop-shadow-xl transition-all duration-1000 delay-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Elevating medical uniforms with premium design and unmatched elegance. 
            Crafted for healthcare professionals who command respect through presence.
          </p>
          
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button size="lg" className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-dark hover:to-luxury-gold text-black font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 magnetic-hover">
              Explore AURA Collection
            </Button>
            <Button variant="outline" size="lg" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black px-8 py-3 text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              Discover Our Power
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center hover:border-luxury-gold/70 transition-colors duration-300 cursor-pointer">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce hover:bg-luxury-gold/70 transition-colors duration-300"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;