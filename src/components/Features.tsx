import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Features = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const features = [
    {
      title: "Premium Fabrics",
      description: "Breathable, wrinkle-resistant, and long-lasting materials that maintain their quality shift after shift.",
      icon: "✨"
    },
    {
      title: "Modern Aesthetics",
      description: "Minimalist elegance with tailored fits that enhance your professional presence.",
      icon: "👔"
    },
    {
      title: "Professional Empowerment",
      description: "Made to enhance confidence in every shift, helping you feel your absolute best.",
      icon: "💪"
    },
    {
      title: "Customer-First Service",
      description: "Easy ordering, size guidance, and hassle-free exchanges to ensure perfect satisfaction.",
      icon: "🤝"
    }
  ];

  return (
    <section ref={elementRef} id="features" className="py-20 bg-gradient-to-b from-soft-gray to-background relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/6 w-40 h-40 bg-accent-coral/10 rounded-full blur-3xl animate-drift"></div>
        <div className="absolute bottom-1/3 left-1/6 w-36 h-36 bg-accent-mint/10 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Our Commitment Goes Beyond Design
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every aspect of Aura Medical Uniforms is crafted with intention, from the premium materials 
            to the customer experience that makes you feel valued and supported.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`p-8 text-center shadow-card hover:shadow-luxury transition-all duration-700 hover:-translate-y-2 hover:scale-105 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-slow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className={`bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 rounded-2xl p-8 max-w-4xl mx-auto transition-all duration-1000 hover:shadow-elegant hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">
              Join the Movement
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With thousands of healthcare professionals already embracing Aura, we are not just a brand — 
              we are a movement, redefining medical fashion for a new era.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;