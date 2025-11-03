import Hero from "@/components/Hero";
import VideoReviews from "@/components/VideoReviews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Star, PlayCircle, Award, TrendingUp, Clock, Globe, Zap, Eye, Shirt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });

  // Fetch featured products
  const {
    data: featuredProducts = []
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('products').select('*').limit(6).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const floatingElements = Array.from({
    length: 20
  }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));
  return <div className="min-h-screen">
      <Hero />
      
      {/* Enhanced Quick Overview Section */}
      <section className="py-24 bg-gradient-to-b from-background via-soft-gray/20 to-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/6 w-28 h-28 bg-medical-blue/5 rounded-full animate-apple-float"></div>
          <div className="absolute bottom-1/3 right-1/6 w-20 h-20 bg-medical-teal/5 rounded-full animate-apple-float" style={{
          animationDelay: '3s'
        }}></div>
          <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-accent-mint/5 rounded-full animate-apple-float" style={{
          animationDelay: '1s'
        }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-apple-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Where <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Class</span> meets Care
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover premium medical uniforms that don't compromise on style, comfort, or performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div className="text-center group animate-apple-reveal-stagger animate-stagger-1">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-medical-blue to-medical-teal rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-glow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent-coral to-accent-mint rounded-full animate-apple-float"></div>
              </div>
              <h3 className="text-2xl font-bold text-luxury-navy mb-4 group-hover:text-medical-blue transition-colors">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">Luxury-inspired materials engineered for healthcare professionals who demand the best in comfort and style.</p>
            </div>

            <div className="text-center group animate-apple-reveal-stagger animate-stagger-2">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-medical-teal to-accent-mint rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-glow">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-blue-light rounded-full animate-apple-float" style={{
                animationDelay: '1s'
              }}></div>
              </div>
              <h3 className="text-2xl font-bold text-luxury-navy mb-4 group-hover:text-medical-teal transition-colors">Comfort First</h3>
              <p className="text-muted-foreground leading-relaxed">Designed for long shifts with breathable, flexible fabrics that move with you throughout your day.</p>
            </div>

            <div className="text-center group animate-apple-reveal-stagger animate-stagger-3">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-coral to-accent-coral-light rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-glow">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-medical-teal to-medical-teal-light rounded-full animate-apple-float" style={{
                animationDelay: '2s'
              }}></div>
              </div>
              <h3 className="text-2xl font-bold text-luxury-navy mb-4 group-hover:text-accent-coral transition-colors">Trusted by Professionals</h3>
              <p className="text-muted-foreground leading-relaxed">Join thousands of healthcare workers worldwide who choose AURA for their professional wardrobe.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="animate-apple-reveal-stagger animate-stagger-4">
              <h3 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-8 leading-tight">
                Experience the <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA</span> Collection
              </h3>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Our flagship collection combines performance sportswear technology with clinical elegance. 
                From sleek full-sleeve sets that project authority to lightweight options for maximum flexibility.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/products">
                  <Button size="lg" className="group bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0">
                    <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    Shop AURA Collection
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-luxury-navy px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-apple-reveal-stagger animate-stagger-5">
              <div className="relative">
                <div className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-12 text-center animate-apple-float border border-medical-blue/20 shadow-2xl">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto flex items-center justify-center animate-apple-glow shadow-2xl">
                      <span className="text-5xl font-bold text-white">A</span>
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-mint rounded-full animate-apple-float"></div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-medical-teal to-medical-teal-light rounded-full animate-apple-float" style={{
                    animationDelay: '1s'
                  }}></div>
                  </div>
                  <h4 className="text-3xl font-bold text-luxury-navy mb-6">Premium Experience</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Elevate your professional wardrobe with uniforms that feel as good as they look. 
                    Experience the difference that premium materials and thoughtful design can make.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-Style Product Showcase */}
      <section className="py-32 bg-gradient-to-b from-background to-soft-gray/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-40 h-40 bg-medical-blue/5 rounded-full animate-apple-float"></div>
          <div className="absolute bottom-1/4 right-1/5 w-32 h-32 bg-medical-teal/5 rounded-full animate-apple-float" style={{
          animationDelay: '2s'
        }}></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-accent-coral/5 rounded-full animate-apple-float" style={{
          animationDelay: '4s'
        }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24 animate-apple-reveal">
            <h2 className="text-6xl md:text-7xl font-bold text-luxury-navy mb-8 leading-tight">
              The <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA</span> Collection
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Where medical precision meets modern elegance
            </p>
          </div>

          {/* Apple-Style Product Gallery */}
          <div className="space-y-32">
            {featuredProducts.slice(0, 3).map((product, index) => <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
                {/* Product Image */}
                <div className="flex-1 animate-apple-reveal-stagger" style={{
              animationDelay: `${index * 0.2}s`
            }}>
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-medical-blue/5 to-medical-teal/5">
                      <img src={product.images && product.images.length > 0 ? product.images[0] : product.image} alt={product.name} className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/20 via-transparent to-transparent"></div>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 rounded-full animate-apple-float"></div>
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-accent-coral/20 to-accent-mint/20 rounded-full animate-apple-float" style={{
                  animationDelay: '1s'
                }}></div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="flex-1 animate-apple-reveal-stagger" style={{
              animationDelay: `${index * 0.2 + 0.1}s`
            }}>
                  <div className="max-w-lg">
                    <h3 className="text-5xl md:text-6xl font-bold text-luxury-navy mb-6 leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Product-Specific Features */}
                    <div className="space-y-4 mb-8">
                      {product.features && product.features.slice(0, 4).map((feature, i) => <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-medical-blue to-medical-teal rounded-full"></div>
                          <span className="text-lg text-muted-foreground">{feature}</span>
                        </div>)}
                    </div>

                    {/* CTA */}
                    <Link to="/products">
                      <Button size="lg" className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0">
                        <Sparkles className="w-5 h-5 mr-3" />
                        Explore Collection
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>)}
          </div>


          {/* Bottom CTA */}
          <div className="text-center mt-16 animate-apple-reveal-stagger animate-stagger-4">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white px-12 py-6 text-xl font-semibold rounded-3xl shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0">
                <Sparkles className="w-6 h-6 mr-4" />
                Discover All Products
                <ArrowRight className="w-6 h-6 ml-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AURA in Action - Video Reviews */}
      
    </div>;
};
export default Home;