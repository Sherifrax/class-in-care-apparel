import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Zap, Shield, Droplets, Wind, Recycle } from "lucide-react";

const FeaturesPage = () => {
  const technicalFeatures = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Moisture-Wicking Technology",
      description: "Advanced fabric technology that pulls moisture away from skin to keep you dry and comfortable during long shifts."
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Breathable Fabric",
      description: "Engineered mesh zones and breathable weave patterns ensure optimal airflow and temperature regulation."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Antimicrobial Protection",
      description: "Built-in antimicrobial treatment prevents odor and bacteria buildup for enhanced hygiene."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "4-Way Stretch",
      description: "Flexible fabric moves with you, providing unrestricted movement for all your daily activities."
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Eco-Friendly Materials",
      description: "Sustainable fabric blend using recycled fibers without compromising performance or durability."
    }
  ];

  const careFeatures = [
    "Machine washable up to 40 cycles without fading",
    "Wrinkle-resistant - maintains professional appearance",
    "Stain-resistant coating for easy cleaning",
    "Color-lock technology prevents fading",
    "Quick-dry fabric reduces laundry time",
    "No-iron formula saves time and energy"
  ];

  return (
    <div className="min-h-screen pt-20">
      <Features />
      
      {/* Technical Features Section */}
      <section className="py-20 bg-gradient-to-b from-soft-gray/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Advanced <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Technology</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every Aura uniform incorporates cutting-edge fabric technology designed specifically for healthcare professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-luxury-navy mb-6">Performance Testing</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Every fabric undergoes rigorous testing to ensure it meets our high standards for durability, 
                  comfort, and performance in real healthcare environments.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-blue mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Wash Cycles Tested</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-blue mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Wear Testing</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white/50 rounded-2xl p-8 text-center animate-float">
                  <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h4 className="text-xl font-bold text-luxury-navy mb-4">Lab Certified</h4>
                  <p className="text-muted-foreground">
                    All fabrics are independently tested and certified for healthcare use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care & Maintenance Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Easy Care & Maintenance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Designed for busy professionals who need uniforms that maintain their appearance with minimal effort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-bold text-luxury-navy mb-8">Care Benefits</h3>
              <div className="space-y-4">
                {careFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-medical-blue flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-8">
                <h4 className="text-2xl font-bold text-luxury-navy mb-6">Simple Care Instructions</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-medical-blue">1</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-luxury-navy mb-1">Machine Wash</h5>
                      <p className="text-sm text-muted-foreground">Cold water, gentle cycle</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-medical-blue">2</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-luxury-navy mb-1">Tumble Dry</h5>
                      <p className="text-sm text-muted-foreground">Low heat or air dry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-medical-blue">3</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-luxury-navy mb-1">Ready to Wear</h5>
                      <p className="text-sm text-muted-foreground">No ironing required!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 animate-fade-in-up">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">Ready to Experience the Difference?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              See why thousands of healthcare professionals have made the switch to Aura Medical Uniforms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Ask Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;