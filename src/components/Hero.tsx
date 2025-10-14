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
          className="w-full h-full object-cover scale-105 animate-apple-parallax" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/95 via-luxury-navy/80 to-luxury-navy/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Enhanced Content with Apple-style animations */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="animate-apple-reveal mb-6">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-8 animate-pulse-glow">
            <Sparkles className="inline w-4 h-4 mr-2 animate-apple-float" />
            Premium Medical Apparel
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-apple-reveal-stagger animate-stagger-1">
          Elevate Your <br />
          <span className="bg-gradient-to-r from-medical-blue-light via-medical-teal-light to-accent-mint bg-clip-text text-transparent animate-apple-shimmer">
            Professional Presence
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-apple-reveal-stagger animate-stagger-2">
          Discover the AURA Collection — where luxury meets functionality. 
          Designed for healthcare professionals who demand excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-apple-reveal-stagger animate-stagger-3">
          <Link to="/products">
            <Button size="lg" className="bg-white text-luxury-navy hover:bg-white/90 px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 group">
              Explore Collection
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white px-10 py-7 text-lg font-bold rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105">
              Our Story
            </Button>
          </Link>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-medical-blue/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-medical-teal/20 rounded-full blur-3xl animate-float-medium" style={{animationDelay: '2s'}}></div>
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
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-medical-teal/40 rounded-full animate-apple-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-accent-coral/30 rounded-full animate-apple-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-accent-mint/40 rounded-full animate-apple-float" style={{animationDelay: '3s'}}></div>
      </div>
    </section>
  );
};

export default Hero;