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
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Our Commitment Goes Beyond Design
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every aspect of Aura Medical Uniforms is crafted with intention, from the premium materials 
            to the customer experience that makes you feel valued and supported.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center shadow-card hover:shadow-luxury transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
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