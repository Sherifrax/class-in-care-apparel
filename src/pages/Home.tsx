import Hero from "@/components/Hero";
import VideoReviews from "@/components/VideoReviews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Star, PlayCircle, Award, TrendingUp, Clock, Globe } from "lucide-react";

const Home = () => {
  const stats = [
    { number: "50,000+", label: "Healthcare Professionals", icon: <Users className="w-6 h-6" /> },
    { number: "98%", label: "Customer Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "2M+", label: "Hours Worn", icon: <Clock className="w-6 h-6" /> },
    { number: "25+", label: "Countries Served", icon: <Globe className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Emergency Medicine Physician",
      hospital: "Johns Hopkins Hospital",
      quote: "After 12-hour shifts, I still look and feel professional. The fabric breathes amazingly well.",
      rating: 5,
      image: "SC"
    },
    {
      name: "Nurse Maria Rodriguez",
      role: "ICU Head Nurse",
      hospital: "Mayo Clinic",
      quote: "Finally, scrubs that don't look like pajamas. My patients notice the difference in my confidence.",
      rating: 5,
      image: "MR"
    },
    {
      name: "Dr. James Kim",
      role: "Surgeon",
      hospital: "Cleveland Clinic",
      quote: "The fit is perfect for long surgeries. No bunching, no restriction of movement.",
      rating: 5,
      image: "JK"
    }
  ];

  const awards = [
    { title: "Healthcare Innovation Award 2024", org: "Medical Design Excellence" },
    { title: "Best New Product", org: "Healthcare Fashion Week" },
    { title: "Sustainability Excellence", org: "Green Healthcare Initiative" }
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground mx-auto mb-3 sm:mb-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-muted-foreground px-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick Overview Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Where <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Class</span> meets Care
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Discover premium medical uniforms that don't compromise on style, comfort, or performance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center group animate-scale-in sm:col-span-2 lg:col-span-1" style={{animationDelay: "0.1s"}}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Premium Quality</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-2">Luxury-inspired materials engineered for healthcare professionals</p>
            </div>

            <div className="text-center group animate-scale-in" style={{animationDelay: "0.2s"}}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Comfort First</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-2">Designed for long shifts with breathable, flexible fabrics</p>
            </div>

            <div className="text-center group animate-scale-in sm:col-span-2 lg:col-span-1" style={{animationDelay: "0.3s"}}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Trusted by Professionals</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-2">Join thousands of healthcare workers who choose Aura</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
            <div className="animate-slide-in-left order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Experience the AURA Collection</h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Our flagship collection combines performance sportswear technology with clinical elegance. 
                From sleek full-sleeve sets that project authority to lightweight options for maximum flexibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Shop AURA Collection
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-in-right order-1 lg:order-2">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center animate-float">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">A</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Premium Experience</h4>
                <p className="text-sm sm:text-base text-muted-foreground">Elevate your professional wardrobe with uniforms that feel as good as they look.</p>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="text-center mb-20 animate-fade-in-up">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">See Aura in Action</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Watch healthcare professionals share their experience with Aura Medical Uniforms
            </p>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 rounded-3xl aspect-video flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-12 h-12 text-medical-blue ml-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl flex items-end p-8">
                <div className="text-left text-white">
                  <h4 className="text-xl font-semibold mb-2">Customer Stories</h4>
                  <p className="text-white/80">Real healthcare professionals, real experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Loved by Healthcare Heroes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what medical professionals are saying about Aura.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-medical-blue">{testimonial.hospital}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>

          <div className="text-center animate-fade-in-up">
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gradient-to-b from-soft-gray/10 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Award-Winning Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognition from industry leaders validates our commitment to innovation and quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-luxury-navy mb-2">{award.title}</h3>
                <p className="text-muted-foreground text-sm">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AURA in Action - Video Reviews */}
      <VideoReviews />
    </div>
  );
};

export default Home;