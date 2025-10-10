import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return <section ref={elementRef} id="about" className="py-20 bg-gradient-to-b from-background to-soft-gray relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-medical-blue/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-medical-teal/10 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Founded by Excellence, Led by Vision
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">Aura Medical Uniforms was born from Dr. Bayan's vision and is brought to life under her leadership. Together, we're revolutionizing how healthcare professionals present themselves.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We create medical uniforms that are more than scrubs — they are a statement of professionalism, 
              elegance, and resilience. Every Aura piece combines modern tailoring, high-performance fabrics, 
              and minimalist style to deliver comfort, durability, and prestige.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When you wear Aura, you carry yourself with the confidence of someone who knows they embody both care and class.
            </p>
          </div>
          
          <Card className={`p-8 shadow-luxury hover:shadow-elegant transition-all duration-700 hover:-translate-y-2 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center animate-float-slow shadow-glow">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <h4 className="text-2xl font-bold text-luxury-navy mb-4">"CLASS to CARE"</h4>
              <p className="text-muted-foreground italic">
                Our founding philosophy that drives every design decision, every fabric choice, 
                and every detail that makes Aura uniforms extraordinary.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>;
};
export default About;