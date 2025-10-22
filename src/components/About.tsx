import { Card } from "@/components/ui/card";
const About = () => {
  return <section id="about" className="py-20 bg-gradient-to-b from-background to-soft-gray">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-luxury-navy mb-4 sm:mb-6 break-words">
            Founded by Excellence, Led by Vision
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed break-words">Aura Medical Uniforms was born from Dr. Bayan's vision and is brought to life under her leadership. Together, we're revolutionizing how healthcare professionals present themselves.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-luxury-navy mb-4 sm:mb-6 break-words">Our Mission</h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed break-words">
              We create medical uniforms that are more than scrubs — they are a statement of professionalism, 
              elegance, and resilience. Every Aura piece combines modern tailoring, high-performance fabrics, 
              and minimalist style to deliver comfort, durability, and prestige.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed break-words">
              When you wear Aura, you carry yourself with the confidence of someone who knows they embody both care and class.
            </p>
          </div>
          
          <Card className="p-6 sm:p-8 shadow-luxury overflow-hidden">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
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