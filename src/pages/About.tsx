import About from "@/components/About";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Leaf, Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20">
      <About />
      
      {/* Our Mission Section */}
      <section className="py-20 bg-gradient-to-b from-soft-gray/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              To revolutionize medical apparel by bringing luxury design principles to professional healthcare wear, 
              without compromising on performance or comfort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group animate-scale-in" style={{animationDelay: "0.1s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Excellence</h3>
              <p className="text-muted-foreground text-sm">Premium quality in every stitch</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.2s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Reliability</h3>
              <p className="text-muted-foreground text-sm">Built to last through demanding shifts</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Sustainability</h3>
              <p className="text-muted-foreground text-sm">Eco-conscious materials and processes</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.4s"}}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Global Impact</h3>
              <p className="text-muted-foreground text-sm">Supporting healthcare worldwide</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 text-center animate-fade-in-up">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">Join Our Story</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the movement that's changing how healthcare professionals feel and look at work. 
              Experience the difference that true luxury medical apparel can make.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Healthcare professionals and fashion innovators working together to create the future of medical apparel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-scale-in" style={{animationDelay: "0.1s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">DB</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Dr. Bayan</h3>
              <p className="text-medical-blue font-medium mb-3">Founder & Chief Designer</p>
              <p className="text-muted-foreground text-sm">
                Combining 15 years of healthcare experience with luxury fashion design principles.
              </p>
            </div>

            <div className="text-center animate-scale-in" style={{animationDelay: "0.2s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-teal to-medical-blue rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">SA</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Sarah Ahmed</h3>
              <p className="text-medical-blue font-medium mb-3">Head of Innovation</p>
              <p className="text-muted-foreground text-sm">
                Leading fabric technology research and sustainable manufacturing processes.
              </p>
            </div>

            <div className="text-center animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">MR</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Marcus Rodriguez</h3>
              <p className="text-medical-blue font-medium mb-3">Quality Director</p>
              <p className="text-muted-foreground text-sm">
                Ensuring every product meets our rigorous standards for comfort and durability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;