import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/aura-hero-animation.mp4";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Where <span className="text-medical-blue">Class</span> meets <span className="text-medical-teal">Care</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Premium medical uniforms that blend luxury design with clinical performance. 
          Experience the difference that true professionalism makes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/products">
            <Button size="lg" className="group">
              Explore AURA Collection
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
              Learn Our Story
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>;
};
export default Hero;