import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVideo from "@/assets/aura-hero-animation.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with premium gradient overlay */}
      <div className="absolute inset-0">
        <video 
          src={heroVideo} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-105 animate-apple-parallax" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-navy/95 via-luxury-navy/85 to-medical-blue-dark/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/20 via-transparent to-medical-teal/20"></div>
      </div>
      
      {/* Premium Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="space-y-8 animate-apple-reveal">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-apple-glow">
            <Sparkles className="w-5 h-5 text-medical-teal-light" />
            <span className="text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider">Premium Medical Apparel</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
            Where <span className="bg-gradient-to-r from-medical-blue-light via-medical-teal-light to-accent-mint bg-clip-text text-transparent">Presence</span>
            <br />
            Becomes <span className="bg-gradient-to-r from-accent-coral via-luxury-gold to-accent-mint bg-clip-text text-transparent">Power</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
            Premium medical scrubs engineered for professionals who refuse to compromise on style, comfort, or performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
            <Link to="/products">
              <Button 
                size="lg" 
                className="w-full sm:w-auto group bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Shop AURA Collection
                <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-white/30 hover:border-white hover:bg-white/10 text-white backdrop-blur-sm px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Discover Our Story
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-12 sm:pt-16 max-w-4xl mx-auto">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50k+</div>
              <div className="text-sm sm:text-base text-white/70">Healthcare Professionals</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-sm sm:text-base text-white/70">Customer Rating</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm sm:text-base text-white/70">Premium Quality</div>
            </div>
          </div>
        </div>
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