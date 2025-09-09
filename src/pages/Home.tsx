import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Quick Overview Section */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Where <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Class</span> meets Care
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover premium medical uniforms that don't compromise on style, comfort, or performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group animate-scale-in" style={{animationDelay: "0.1s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">Luxury-inspired materials engineered for healthcare professionals</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.2s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-3">Comfort First</h3>
              <p className="text-muted-foreground">Designed for long shifts with breathable, flexible fabrics</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-3">Trusted by Professionals</h3>
              <p className="text-muted-foreground">Join thousands of healthcare workers who choose Aura</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-3xl font-bold text-luxury-navy mb-6">Experience the Aurora Collection</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our flagship collection combines performance sportswear technology with clinical elegance. 
                From sleek full-sleeve sets that project authority to lightweight options for maximum flexibility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    Shop Aurora Collection
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-8 text-center animate-float">
                <div className="w-24 h-24 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                  <span className="text-3xl font-bold text-white">A</span>
                </div>
                <h4 className="text-2xl font-bold text-luxury-navy mb-4">Premium Experience</h4>
                <p className="text-muted-foreground">Elevate your professional wardrobe with uniforms that feel as good as they look.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;