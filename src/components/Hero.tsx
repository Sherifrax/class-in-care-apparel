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
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
            <span className="inline-block animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              Premium Medical
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-medical-blue via-medical-teal to-accent-coral bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              Scrubs Collection
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            Experience unparalleled comfort and style with our Aurora Collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <Link to="/products">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-medical-blue to-medical-teal hover:shadow-2xl hover:shadow-medical-blue/50 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medical-teal to-accent-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Discover Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Enhanced Decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-apple-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Enhanced Floating particles and icons for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-medical-blue/40 rounded-full animate-float-slow blur-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-medical-teal/50 rounded-full animate-float-medium blur-sm"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-accent-coral/40 rounded-full animate-float-fast blur-sm"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-accent-mint/50 rounded-full animate-drift blur-sm"></div>
        
        {/* Larger floating orbs */}
        <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-gradient-to-br from-medical-blue/20 to-transparent rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/6 w-40 h-40 bg-gradient-to-br from-medical-teal/20 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-accent-coral/15 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Rotating rings */}
        <div className="absolute top-1/4 right-1/5 w-24 h-24 border-2 border-medical-blue/20 rounded-full animate-rotate-slow"></div>
        <div className="absolute bottom-1/4 left-1/5 w-32 h-32 border-2 border-medical-teal/20 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
        
        {/* Small sparkles */}
        <div className="absolute top-1/5 left-1/3 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div className="absolute top-2/5 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-2/5 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/5 right-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </section>;
};
export default Hero;