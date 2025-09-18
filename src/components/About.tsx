import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-soft-gray">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Founded by Excellence, Led by Vision
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Aura Medical Uniforms was born from Dr. Bayan's vision and is brought to life under the leadership of CEO Suhaal Hamdan. 
            Together, we're revolutionizing how healthcare professionals present themselves.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-primary mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We create medical uniforms that are more than scrubs — they are a statement of professionalism, 
              elegance, and resilience. Every Aura piece combines modern tailoring, high-performance fabrics, 
              and minimalist style to deliver comfort, durability, and prestige.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When you wear Aura, you carry yourself with the confidence of someone who knows they embody both care and class.
            </p>
          </div>
          
          <Card className="p-8 shadow-luxury">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">A</span>
              </div>
              <h4 className="text-2xl font-bold text-primary mb-4">"CLASS to CARE"</h4>
              <p className="text-muted-foreground italic">
                Our founding philosophy that drives every design decision, every fabric choice, 
                and every detail that makes Aura uniforms extraordinary.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;