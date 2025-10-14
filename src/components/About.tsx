import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Award, Heart } from "lucide-react";

const About = () => {
  const titleAnim = useScrollAnimation();
  const contentAnim = useScrollAnimation();
  const cardAnim = useScrollAnimation();

  return <section id="about" className="py-20 bg-gradient-to-b from-background to-soft-gray relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-medical-blue/5 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-medical-teal/5 rounded-full blur-2xl animate-float-medium"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div 
          ref={titleAnim.ref}
          className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            titleAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 backdrop-blur-sm border border-medical-blue/20 rounded-full text-medical-blue text-sm font-semibold">
              <Award className="inline w-4 h-4 mr-2" />
              Our Story
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6 leading-tight">
            Founded by Excellence, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Led by Vision</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Aura Medical Uniforms was born from Dr. Bayan's vision and is brought to life under her leadership. Together, we're revolutionizing how healthcare professionals present themselves.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            ref={contentAnim.ref}
            className={`transition-all duration-1000 delay-200 ${
              contentAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h3 className="text-3xl font-bold text-luxury-navy mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-medical-blue animate-pulse-glow" />
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We create medical uniforms that are more than scrubs — they are a statement of professionalism, 
              elegance, and resilience. Every Aura piece combines modern tailoring, high-performance fabrics, 
              and minimalist style to deliver comfort, durability, and prestige.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When you wear Aura, you carry yourself with the confidence of someone who knows they embody both care and class.
            </p>
          </div>
          
          <Card 
            ref={cardAnim.ref}
            className={`p-8 shadow-luxury hover:shadow-glow transition-all duration-1000 hover:scale-105 border-medical-blue/20 bg-gradient-to-br from-white to-soft-gray ${
              cardAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center shadow-glow animate-pulse-glow">
                <Heart className="w-8 h-8 text-white animate-scale-pulse" />
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