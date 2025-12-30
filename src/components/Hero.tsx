import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVideo from "@/assets/aura-hero-animation.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with gradient overlay */}
      <div className="absolute inset-0">
        <video 
          src={heroVideo} 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/95 via-luxury-navy/80 to-luxury-navy/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Enhanced Content with Apple-style animations */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
      </div>
      
      {/* Enhanced Decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-apple-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

    </section>
  );
};

export default Hero;