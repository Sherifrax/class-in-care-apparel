import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Shirt, Zap, Users, Award } from "lucide-react";

const Features = () => {
  const titleAnim = useScrollAnimation();
  const cardsAnim = useScrollAnimation();
  const features = [
    {
      title: "Premium Fabrics",
      description: "Breathable, wrinkle-resistant, and long-lasting materials that maintain their quality shift after shift.",
      icon: Sparkles,
      gradient: "from-medical-blue to-medical-blue-light"
    },
    {
      title: "Modern Aesthetics",
      description: "Minimalist elegance with tailored fits that enhance your professional presence.",
      icon: Shirt,
      gradient: "from-medical-teal to-medical-teal-light"
    },
    {
      title: "Professional Empowerment",
      description: "Made to enhance confidence in every shift, helping you feel your absolute best.",
      icon: Zap,
      gradient: "from-accent-coral to-accent-coral-light"
    },
    {
      title: "Customer-First Service",
      description: "Easy ordering, size guidance, and hassle-free exchanges to ensure perfect satisfaction.",
      icon: Users,
      gradient: "from-accent-mint to-medical-teal"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-soft-gray to-background relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-40 left-10 w-40 h-40 bg-medical-blue/5 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-medical-teal/5 rounded-full blur-3xl animate-float-medium"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div 
          ref={titleAnim.ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 backdrop-blur-sm border border-medical-blue/20 rounded-full text-medical-blue text-sm font-semibold">
              <Award className="inline w-4 h-4 mr-2" />
              Why Choose AURA
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6 leading-tight">
            Our Commitment Goes <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Beyond Design</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every aspect of Aura Medical Uniforms is crafted with intention, from the premium materials 
            to the customer experience that makes you feel valued and supported.
          </p>
        </div>
        
        <div 
          ref={cardsAnim.ref}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`p-8 text-center shadow-card hover:shadow-glow transition-all duration-500 group border-medical-blue/20 hover:border-medical-blue/40 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-white to-soft-gray/50 ${
                  cardsAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-4 group-hover:text-medical-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
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