import { Card } from "@/components/ui/card";

const Features = () => {
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
    <section id="features" className="py-20 bg-gradient-to-b from-soft-gray to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Our Commitment Goes Beyond Design
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every aspect of Aura Medical Uniforms is crafted with intention, from the premium materials 
            to the customer experience that makes you feel valued and supported.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-4 sm:p-6 md:p-8 text-center shadow-card hover:shadow-luxury transition-shadow group overflow-hidden break-words">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-luxury-navy mb-3 sm:mb-4 break-words">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed break-words">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 rounded-2xl p-8 max-w-4xl mx-auto">
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