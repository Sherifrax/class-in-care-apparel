import About from "@/components/About";
import FounderSection from "@/components/FounderSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Leaf, Shield, Calendar, MapPin, Target, Lightbulb, Factory, Users2 } from "lucide-react";
const AboutPage = () => {
  const timeline = [{
    year: "2019",
    title: "The Vision",
    description: "Dr. Bayan identifies the gap in luxury medical apparel during her residency"
  }, {
    year: "2020",
    title: "First Prototype",
    description: "Development of the first AURA uniform with advanced fabric technology"
  }, {
    year: "2021",
    title: "Clinical Testing",
    description: "6-month pilot program with healthcare professionals across 5 hospitals"
  }, {
    year: "2022",
    title: "Official Launch",
    description: "Aura Medical Uniforms launches with the AURA Collection"
  }, {
    year: "2023",
    title: "Global Expansion",
    description: "Serving healthcare professionals in 25+ countries"
  }, {
    year: "2024",
    title: "Innovation Awards",
    description: "Recognition for excellence in healthcare apparel design"
  }];
  const locations = [{
    city: "New York",
    role: "Global Headquarters",
    employees: "120+"
  }, {
    city: "Los Angeles",
    role: "Design Studio",
    employees: "45+"
  }, {
    city: "Toronto",
    role: "Manufacturing Hub",
    employees: "200+"
  }, {
    city: "London",
    role: "European Operations",
    employees: "80+"
  }];
  const culture = [{
    icon: <Target className="w-8 h-8" />,
    title: "Purpose-Driven",
    description: "Every decision centers around improving healthcare professionals' lives"
  }, {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation First",
    description: "Constantly pushing boundaries in fabric technology and design"
  }, {
    icon: <Users2 className="w-8 h-8" />,
    title: "Collaborative",
    description: "Working closely with healthcare workers to understand their needs"
  }, {
    icon: <Leaf className="w-8 h-8" />,
    title: "Sustainable",
    description: "Committed to environmental responsibility in all operations"
  }];
  return <div className="min-h-screen pt-20">
      <About />
      
      {/* Company Timeline */}
      
      
      {/* Our Mission Section */}
      <section className="py-20 bg-gradient-to-b from-soft-gray/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              To revolutionize medical apparel by bringing luxury design principles to professional healthcare wear, 
              without compromising on performance or comfort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group animate-scale-in" style={{
            animationDelay: "0.1s"
          }}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Excellence</h3>
              <p className="text-muted-foreground text-sm">Premium quality in every stitch</p>
            </div>

            <div className="text-center group animate-scale-in" style={{
            animationDelay: "0.2s"
          }}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Reliability</h3>
              <p className="text-muted-foreground text-sm">Built to last through demanding shifts</p>
            </div>

            <div className="text-center group animate-scale-in" style={{
            animationDelay: "0.3s"
          }}>
              <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy mb-3">Sustainability</h3>
              <p className="text-muted-foreground text-sm">Eco-conscious materials and processes</p>
            </div>

            <div className="text-center group animate-scale-in" style={{
            animationDelay: "0.4s"
          }}>
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

      {/* Global Presence */}
      

      {/* Company Culture */}
      <section className="py-20 bg-gradient-to-b from-soft-gray/10 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Our Culture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The values that drive everything we do, from product design to customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {culture.map((item, index) => <div key={index} className="text-center group animate-scale-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* About Our Founder */}
      <FounderSection />
    </div>;
};
export default AboutPage;