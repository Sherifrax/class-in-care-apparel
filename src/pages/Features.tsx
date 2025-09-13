import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Zap, Shield, Droplets, Wind, Recycle, Thermometer, Activity, Scissors, Microscope, Clock, TrendingUp } from "lucide-react";

const FeaturesPage = () => {
  const technicalFeatures = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Moisture-Wicking Technology",
      description: "Advanced fabric technology that pulls moisture away from skin to keep you dry and comfortable during long shifts.",
      performance: "98% moisture transfer rate",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Breathable Fabric",
      description: "Engineered mesh zones and breathable weave patterns ensure optimal airflow and temperature regulation.",
      performance: "40% better airflow vs standard scrubs",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Antimicrobial Protection",
      description: "Built-in antimicrobial treatment prevents odor and bacteria buildup for enhanced hygiene.",
      performance: "99.9% bacteria reduction",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "4-Way Stretch",
      description: "Flexible fabric moves with you, providing unrestricted movement for all your daily activities.",
      performance: "300% stretch capacity",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Eco-Friendly Materials",
      description: "Sustainable fabric blend using recycled fibers without compromising performance or durability.",
      performance: "60% recycled content",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Thermometer className="w-8 h-8" />,
      title: "Temperature Control",
      description: "Smart fabric technology adapts to your body temperature for optimal comfort throughout your shift.",
      performance: "±3°F temperature regulation",
      color: "from-red-500 to-red-600"
    }
  ];

  const beforeAfterComparisons = [
    {
      category: "Comfort",
      before: "Stiff, restrictive traditional scrubs",
      after: "Flexible, breathable AURA fabric",
      improvement: "+85% comfort rating"
    },
    {
      category: "Durability", 
      before: "Fades after 20-30 washes",
      after: "Maintains color after 500+ washes",
      improvement: "16x longer lasting"
    },
    {
      category: "Professional Look",
      before: "Wrinkled, baggy appearance",
      after: "Crisp, tailored silhouette all day",
      improvement: "+95% professional confidence"
    },
    {
      category: "Maintenance",
      before: "Requires ironing and special care",
      after: "Wash and wear, no ironing needed",
      improvement: "Save 2+ hours per week"
    }
  ];

  const technologySpotlight = [
    {
      name: "NanoFiber Weave™",
      description: "Microscopic fibers create superior breathability while maintaining durability",
      benefits: ["Enhanced airflow", "Moisture management", "Lightweight feel"]
    },
    {
      name: "FlexMotion™ Technology", 
      description: "Strategic stretch zones placed where you need mobility most",
      benefits: ["Unrestricted movement", "Perfect fit", "All-day comfort"]
    },
    {
      name: "StayFresh™ Treatment",
      description: "Long-lasting antimicrobial protection built into the fabric",
      benefits: ["Odor resistance", "Hygiene protection", "Extended freshness"]
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
      
      {/* Technology Spotlight */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Technology Spotlight
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dive deep into the innovative technologies that make Aura uniforms superior.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {technologySpotlight.map((tech, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-4">{tech.name}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{tech.description}</p>
                <div className="space-y-2">
                  {tech.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-medical-blue flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Interactive Demo Section */}
          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 animate-fade-in-up">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-luxury-navy mb-6">See the Technology in Action</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience our fabric technology through interactive demonstrations and real-world testing results.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">Live Performance Data</h4>
                <p className="text-muted-foreground text-sm">Real-time monitoring of fabric performance during wear</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-teal to-medical-blue rounded-full mx-auto mb-6 flex items-center justify-center animate-float">
                  <Scissors className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">Fabric Samples</h4>
                <p className="text-muted-foreground text-sm">Request free samples to feel the difference yourself</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">Performance Reports</h4>
                <p className="text-muted-foreground text-sm">Detailed analysis of durability and comfort metrics</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link to="/contact">
                <Button size="lg">
                  Request Fabric Samples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After Comparison */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              The Aura Difference
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how Aura uniforms compare to traditional medical apparel across key performance metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {beforeAfterComparisons.map((comparison, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-navy">{comparison.category}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-red-700">Before (Traditional Scrubs)</span>
                    </div>
                    <p className="text-sm text-red-600">{comparison.before}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-green-700">After (Aura Uniforms)</span>
                    </div>
                    <p className="text-sm text-green-600">{comparison.after}</p>
                  </div>
                  
                  <div className="text-center pt-4">
                    <Badge className="bg-gradient-to-r from-medical-blue to-medical-teal text-white">
                      {comparison.improvement}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <Card key={index} className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in relative overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-navy mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                  <Badge variant="outline" className="font-medium">
                    {feature.performance}
                  </Badge>
                </div>
              </Card>
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
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-blue mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Performance Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-blue mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Quality Checkpoints</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white/50 rounded-2xl p-8 text-center animate-float">
                  <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h4 className="text-xl font-bold text-luxury-navy mb-4">Lab Certified</h4>
                  <p className="text-muted-foreground mb-6">
                    All fabrics are independently tested and certified for healthcare use by leading textile laboratories.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">ISO 9001</Badge>
                    <Badge variant="outline">OEKO-TEX</Badge>
                    <Badge variant="outline">GREENGUARD</Badge>
                  </div>
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