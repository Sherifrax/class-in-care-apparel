import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/aura-hero-animation.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <video 
          src={heroVideo} 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
        <div className="max-w-2xl bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-luxury-gold/20">
          <h1 className="font-posterama text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Where <span className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">PRESENCE</span> Becomes <span className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">POWER</span>
          </h1>
          
          <p className="font-posterama text-lg bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent mb-8 leading-relaxed drop-shadow-xl">
            Elevating medical uniforms with premium design and unmatched elegance. 
            Crafted for healthcare professionals who command respect through presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-dark hover:to-luxury-gold text-black font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Explore AURA Collection
            </Button>
            <Button variant="outline" size="lg" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black px-8 py-3 text-lg">
              Discover Our Power
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;