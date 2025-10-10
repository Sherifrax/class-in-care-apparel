import { Button } from "@/components/ui/button";
import { useSizeGuide } from "@/contexts/SizeGuideContext";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTA = () => {
  const { openSizeGuide } = useSizeGuide();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return <section ref={elementRef} className="py-20 bg-gradient-to-br from-luxury-navy via-medical-blue to-medical-teal text-white relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-white/5 rounded-full animate-pulse-glow blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-white/5 rounded-full animate-pulse-glow blur-2xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-drift blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Caring for Others Begins with How You Carry Yourself
          </h2>
          
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Experience the difference that true luxury medical apparel can make. 
            Join thousands of healthcare professionals who have chosen to elevate their professional presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="bg-white text-luxury-navy hover:bg-white/90 px-8 py-3 text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                Shop AURA Collection
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-luxury-navy px-8 py-3 text-lg text-zinc-950 hover:scale-105 transition-all duration-300" onClick={openSizeGuide}>
              Request Size Guide
            </Button>
          </div>
          
          <div className={`mt-12 grid md:grid-cols-3 gap-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2 animate-scale-pulse">1000+</div>
              <div className="text-white/80">Healthcare Professionals</div>
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2 animate-scale-pulse" style={{ animationDelay: '0.5s' }}>50+</div>
              <div className="text-white/80">Hospital Partners</div>
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2 animate-scale-pulse" style={{ animationDelay: '1s' }}>99%</div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTA;