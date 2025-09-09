import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical-professional.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional healthcare worker in elegant Aura medical uniforms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy/90 via-luxury-navy/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            We bring <span className="text-medical-blue-light">CLASS</span> to <span className="text-medical-teal">CARE</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Redefining medical uniforms with luxury-inspired design, premium fabrics, and professional elegance. 
            Crafted for healthcare heroes who refuse to compromise on style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-medical-blue hover:bg-medical-blue/90 text-white px-8 py-3 text-lg">
              Explore Aurora Collection
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-luxury-navy px-8 py-3 text-lg">
              Learn Our Story
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