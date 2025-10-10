import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVideo from "@/assets/aura-hero-animation.mp4";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with premium gradient overlay */}
      <div className="absolute inset-0">
        <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 animate-apple-parallax" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-navy/95 via-luxury-navy/85 to-medical-blue-dark/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/20 via-transparent to-medical-teal/20"></div>
      </div>
      
      {/* Premium Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto">
        
      </div>
      
      {/* Enhanced Decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-apple-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Floating particles for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-medical-blue/30 rounded-full animate-apple-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-medical-teal/40 rounded-full animate-apple-float" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-accent-coral/30 rounded-full animate-apple-float" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-accent-mint/40 rounded-full animate-apple-float" style={{
        animationDelay: '3s'
      }}></div>
      </div>
    </section>;
};
export default Hero;