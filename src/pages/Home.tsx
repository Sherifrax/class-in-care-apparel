import Hero from "@/components/Hero";
import VideoReviews from "@/components/VideoReviews";
import ProductShowcase from "@/components/ProductShowcase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Star, PlayCircle, Award, TrendingUp, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer, staggerItem, float, glow } from "@/lib/animations";
const Home = () => {
  const stats = [{
    number: "50,000+",
    label: "Healthcare Professionals",
    icon: <Users className="w-6 h-6" />
  }, {
    number: "98%",
    label: "Customer Satisfaction",
    icon: <Star className="w-6 h-6" />
  }, {
    number: "2M+",
    label: "Hours Worn",
    icon: <Clock className="w-6 h-6" />
  }, {
    number: "25+",
    label: "Countries Served",
    icon: <Globe className="w-6 h-6" />
  }];
  const testimonials = [{
    name: "Dr. Sarah Chen",
    role: "Emergency Medicine Physician",
    hospital: "Johns Hopkins Hospital",
    quote: "After 12-hour shifts, I still look and feel professional. The fabric breathes amazingly well.",
    rating: 5,
    image: "SC"
  }, {
    name: "Nurse Maria Rodriguez",
    role: "ICU Head Nurse",
    hospital: "Mayo Clinic",
    quote: "Finally, scrubs that don't look like pajamas. My patients notice the difference in my confidence.",
    rating: 5,
    image: "MR"
  }, {
    name: "Dr. James Kim",
    role: "Surgeon",
    hospital: "Cleveland Clinic",
    quote: "The fit is perfect for long surgeries. No bunching, no restriction of movement.",
    rating: 5,
    image: "JK"
  }];
  const awards = [{
    title: "Healthcare Innovation Award 2024",
    org: "Medical Design Excellence"
  }, {
    title: "Best New Product",
    org: "Healthcare Fashion Week"
  }, {
    title: "Sustainability Excellence",
    org: "Green Healthcare Initiative"
  }];
  return <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={staggerItem}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white mx-auto mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-luxury-navy mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Quick Overview Section */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <ScrollReveal variants={fadeInUp}>
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Where <motion.span 
                  className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >Class</motion.span> meets Care
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover premium medical uniforms that don't compromise on style, comfort, or performance.
              </motion.p>
            </div>
          </ScrollReveal>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
          >
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-white" />,
                title: "Premium Quality",
                description: "Luxury-inspired materials engineered for healthcare professionals"
              },
              {
                icon: <Heart className="w-8 h-8 text-white" />,
                title: "Comfort First",
                description: "Designed for long shifts with breathable, flexible fabrics"
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: "Trusted by Professionals",
                description: "Join thousands of healthcare workers who choose Aura"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                variants={staggerItem}
                whileHover={{ 
                  scale: 1.05,
                  y: -10
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <ScrollReveal variants={fadeInLeft}>
              <div>
                <motion.h3 
                  className="text-3xl font-bold text-luxury-navy mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Experience the AURA Collection
                </motion.h3>
                <motion.p 
                  className="text-lg text-muted-foreground mb-8 leading-relaxed"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Our flagship collection combines performance sportswear technology with clinical elegance. 
                  From sleek full-sleeve sets that project authority to lightweight options for maximum flexibility.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/products">
                      <Button size="lg" className="group">
                        Shop AURA Collection
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/about">
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variants={fadeInRight}>
              <motion.div 
                className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-8 text-center"
                variants={float}
                initial="hidden"
                whileInView="visible"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center"
                  variants={glow}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span 
                    className="text-3xl font-bold text-white"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    A
                  </motion.span>
                </motion.div>
                <h4 className="text-2xl font-bold text-luxury-navy mb-4">Premium Experience</h4>
                <p className="text-muted-foreground">Elevate your professional wardrobe with uniforms that feel as good as they look.</p>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Video Section */}
          
        </div>
      </section>

      {/* Product Showcase - Apple-style scrolling */}
      <ProductShowcase />

      {/* Testimonials Section */}
      

      {/* Awards & Recognition */}
      

      {/* AURA in Action - Video Reviews */}
      <VideoReviews />
    </div>;
};
export default Home;