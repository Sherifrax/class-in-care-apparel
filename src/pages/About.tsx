import About from "@/components/About";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Leaf, Shield, Calendar, MapPin, Target, Lightbulb, Factory, Users2 } from "lucide-react";

const AboutPage = () => {
  const timeline = [
    { year: "2019", title: "The Vision", description: "Dr. Bayan identifies the gap in luxury medical apparel during her residency" },
    { year: "2020", title: "First Prototype", description: "Development of the first Aurora uniform with advanced fabric technology" },
    { year: "2021", title: "Clinical Testing", description: "6-month pilot program with healthcare professionals across 5 hospitals" },
    { year: "2022", title: "Official Launch", description: "Aura Medical Uniforms launches with the Aurora Collection" },
    { year: "2023", title: "Global Expansion", description: "Serving healthcare professionals in 25+ countries" },
    { year: "2024", title: "Innovation Awards", description: "Recognition for excellence in healthcare apparel design" }
  ];

  const locations = [
    { city: "New York", role: "Global Headquarters", employees: "120+" },
    { city: "Los Angeles", role: "Design Studio", employees: "45+" },
    { city: "Toronto", role: "Manufacturing Hub", employees: "200+" },
    { city: "London", role: "European Operations", employees: "80+" }
  ];

  const culture = [
    { icon: <Target className="w-8 h-8" />, title: "Purpose-Driven", description: "Every decision centers around improving healthcare professionals' lives" },
    { icon: <Lightbulb className="w-8 h-8" />, title: "Innovation First", description: "Constantly pushing boundaries in fabric technology and design" },
    { icon: <Users2 className="w-8 h-8" />, title: "Collaborative", description: "Working closely with healthcare workers to understand their needs" },
    { icon: <Leaf className="w-8 h-8" />, title: "Sustainable", description: "Committed to environmental responsibility in all operations" }
  ];

  return (
    <div className="min-h-screen pt-20">
      <About />
      
      {/* Company Timeline */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From a vision in a hospital break room to revolutionizing medical apparel worldwide.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-medical-blue to-medical-teal"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 animate-slide-in-${index % 2 === 0 ? 'left' : 'right'}`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className={`w-full ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'} pl-12 md:w-1/2`}>
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-medical-blue mr-2" />
                      <span className="text-2xl font-bold text-medical-blue">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-luxury-navy mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </div>
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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

      {/* Global Presence */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Global Presence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to healthcare excellence spans continents, with teams dedicated to serving medical professionals worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {locations.map((location, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <MapPin className="w-8 h-8 text-medical-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-luxury-navy mb-2">{location.city}</h3>
                <p className="text-medical-blue font-medium mb-2">{location.role}</p>
                <p className="text-muted-foreground text-sm">{location.employees} employees</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            {culture.map((item, index) => (
              <div key={index} className="text-center group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Healthcare professionals and fashion innovators working together to create the future of medical apparel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 animate-scale-in" style={{animationDelay: "0.1s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">DB</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Dr. Bayan</h3>
              <p className="text-medical-blue font-medium mb-3">Founder & Chief Designer</p>
              <p className="text-muted-foreground text-sm mb-4">
                Combining 15 years of healthcare experience with luxury fashion design principles.
              </p>
              <div className="text-xs text-muted-foreground">
                MD, Harvard Medical School • Fashion Institute of Technology
              </div>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 animate-scale-in" style={{animationDelay: "0.2s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-teal to-medical-blue rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">SA</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Sarah Ahmed</h3>
              <p className="text-medical-blue font-medium mb-3">Head of Innovation</p>
              <p className="text-muted-foreground text-sm mb-4">
                Leading fabric technology research and sustainable manufacturing processes.
              </p>
              <div className="text-xs text-muted-foreground">
                PhD Materials Science, MIT • Former Nike Innovation Team
              </div>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">MR</span>
              </div>
              <h3 className="text-xl font-semibold text-luxury-navy mb-2">Marcus Rodriguez</h3>
              <p className="text-medical-blue font-medium mb-3">Quality Director</p>
              <p className="text-muted-foreground text-sm mb-4">
                Ensuring every product meets our rigorous standards for comfort and durability.
              </p>
              <div className="text-xs text-muted-foreground">
                MS Industrial Engineering • Former Lululemon Quality Lead
              </div>
            </Card>
          </div>

          <div className="text-center mt-16 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">Want to Join Our Team?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for passionate individuals who want to make a difference in healthcare.
            </p>
            <Link to="/contact">
              <Button size="lg">
                View Career Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;