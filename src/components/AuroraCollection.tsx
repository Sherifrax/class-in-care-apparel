import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Zap, Shield, Award } from "lucide-react";
import fabricTexture from "@/assets/fabric-texture.jpg";

const AuroraCollection = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Breathable Performance",
      description: "Advanced moisture-wicking technology keeps you comfortable during long shifts",
      color: "from-medical-teal to-medical-teal-light"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Wrinkle-Resistant",
      description: "Maintain professional appearance throughout your entire shift",
      color: "from-medical-blue to-medical-blue-light"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Stretch-Engineered",
      description: "Four-way stretch fabric adapts to your every movement",
      color: "from-accent-coral to-accent-coral-light"
    }
  ];


  return (
    <section id="collection" className="py-20 bg-gradient-to-b from-background via-soft-gray/30 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-medical-blue/5 rounded-full animate-apple-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-medical-teal/5 rounded-full animate-apple-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent-coral/5 rounded-full animate-apple-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 animate-apple-reveal">
          <Badge className="mb-6 bg-gradient-to-r from-medical-blue to-medical-teal text-white border-0 px-6 py-2 text-sm font-semibold animate-apple-glow">
            <Award className="w-4 h-4 mr-2" />
            Premium Collection
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            The AURA Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our flagship collection exemplifies luxury medical apparel. Breathable, wrinkle-resistant, 
            and stretch-engineered fabrics designed for long shifts, high mobility, and everyday confidence.
          </p>
        </div>
        
        {/* Enhanced Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Enhanced Image Section */}
          <div className="relative group animate-apple-reveal-stagger animate-stagger-1">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={fabricTexture} 
                alt="Premium medical fabric texture" 
                className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/20 via-transparent to-transparent"></div>
              
              {/* Floating badges */}
              <div className="absolute top-6 left-6 animate-apple-float">
                <Badge className="bg-white/90 text-luxury-navy border-0 px-4 py-2 font-semibold backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium Quality
                </Badge>
              </div>
              
              <div className="absolute bottom-6 right-6 animate-apple-float" style={{animationDelay: '1s'}}>
                <Badge className="bg-gradient-to-r from-medical-blue to-medical-teal text-white border-0 px-4 py-2 font-semibold">
                  <Heart className="w-4 h-4 mr-2" />
                  Loved by 50K+
                </Badge>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 rounded-full animate-apple-morph"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-accent-coral/20 to-accent-mint/20 rounded-full animate-apple-morph" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Enhanced Features Section */}
          <div className="space-y-8 animate-apple-reveal-stagger animate-stagger-2">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-4">
                Engineered for <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Excellence</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every detail crafted with precision, every fabric chosen for performance, 
                every design optimized for the modern healthcare professional.
              </p>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="group flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border border-white/20 hover:border-medical-blue/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-luxury-navy mb-2 group-hover:text-medical-blue transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA */}
            <div className="pt-6">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0"
                >
                  <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default AuroraCollection;