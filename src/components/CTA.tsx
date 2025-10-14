import { Button } from "@/components/ui/button";
import { useSizeGuide } from "@/contexts/SizeGuideContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const { openSizeGuide } = useSizeGuide();
  const ctaAnim = useScrollAnimation();
  const statsAnim = useScrollAnimation();

  return <section className="py-20 bg-gradient-to-br from-luxury-navy via-medical-blue to-medical-teal text-white relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-medical-teal/10 rounded-full blur-3xl animate-scale-pulse"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div 
          ref={ctaAnim.ref}
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            ctaAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Caring for Others Begins with How You Carry Yourself
          </h2>
          
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Experience the difference that true luxury medical apparel can make. 
            Join thousands of healthcare professionals who have chosen to elevate their professional presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-luxury-navy hover:bg-white/90 px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                Shop AURA Collection
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white px-10 py-7 text-lg font-bold rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105" onClick={openSizeGuide}>
              Request Size Guide
            </Button>
          </div>
          
          <div 
            ref={statsAnim.ref}
            className={`mt-12 grid md:grid-cols-3 gap-8 text-center transition-all duration-1000 delay-300 ${
              statsAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 animate-pulse-glow">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-scale-pulse">1000+</div>
              <div className="text-white/90 font-medium">Healthcare Professionals</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-scale-pulse">50+</div>
              <div className="text-white/90 font-medium">Hospital Partners</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '1s'}}>
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-scale-pulse">99%</div>
              <div className="text-white/90 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTA;