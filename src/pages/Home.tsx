import Hero from "@/components/Hero";
import VideoReviews from "@/components/VideoReviews";
import ProductShowcase from "@/components/ProductShowcase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Star, PlayCircle, Award, TrendingUp, Clock, Globe } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import AppleStyleSection from "@/components/AppleStyleSection";
import FloatingElements from "@/components/FloatingElements";
import MagneticButton from "@/components/MagneticButton";
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
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return <div className="min-h-screen relative">
      <FloatingElements />
      
      <motion.div style={{ opacity: heroOpacity }}>
        <Hero />
      </motion.div>
      
      {/* Dynamic Stats Section with Apple-style animations */}
      <AppleStyleSection 
        className="py-20 bg-gradient-to-br from-background via-medical-blue/5 to-medical-teal/5 relative overflow-hidden"
        enableParallax={true}
      >
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-medical-teal/20 rounded-full blur-3xl"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group perspective-1000"
                variants={staggerItem}
                whileHover={{ 
                  scale: 1.1,
                  y: -10,
                  rotateY: 5
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white mx-auto mb-6 relative"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 10,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {stat.icon}
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-luxury-navy mb-3"
                  initial={{ scale: 0, rotateY: -90 }}
                  whileInView={{ scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.number}
                </motion.div>
                <motion.div 
                  className="text-sm text-muted-foreground font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AppleStyleSection>
      
      {/* Enhanced Quick Overview Section with Apple-style Design */}
      <AppleStyleSection 
        className="py-32 bg-gradient-to-b from-background via-soft-gray/10 to-background relative overflow-hidden"
        enableParallax={true}
        enableScale={true}
      >
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal variants={fadeInUp}>
            <div className="text-center mb-20">
              <motion.h2 
                className="text-5xl md:text-7xl font-bold text-luxury-navy mb-8 perspective-1000"
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 2
                }}
              >
                Where <motion.span 
                  className="text-gradient-animated inline-block"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >Class</motion.span> meets Care
              </motion.h2>
              <motion.p 
                className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Discover premium medical uniforms that don't compromise on style, comfort, or performance.
              </motion.p>
            </div>
          </ScrollReveal>

          <motion.div 
            className="grid md:grid-cols-3 gap-10 mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              {
                icon: <Sparkles className="w-10 h-10 text-white" />,
                title: "Premium Quality",
                description: "Luxury-inspired materials engineered for healthcare professionals"
              },
              {
                icon: <Heart className="w-10 h-10 text-white" />,
                title: "Comfort First",
                description: "Designed for long shifts with breathable, flexible fabrics"
              },
              {
                icon: <Users className="w-10 h-10 text-white" />,
                title: "Trusted by Professionals",
                description: "Join thousands of healthcare workers who choose Aura"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center group perspective-1000"
                variants={staggerItem}
                whileHover={{ 
                  scale: 1.08,
                  y: -15,
                  rotateY: 5
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center mx-auto mb-8 relative"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 15,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)"
                  }}
                  animate={{
                    boxShadow: [
                      "0 15px 30px rgba(59, 130, 246, 0.2)",
                      "0 20px 40px rgba(59, 130, 246, 0.3)",
                      "0 15px 30px rgba(59, 130, 246, 0.2)"
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-luxury-navy mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <ScrollReveal variants={fadeInLeft}>
              <div>
                <motion.h3 
                  className="text-4xl md:text-5xl font-bold text-luxury-navy mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Experience the AURA Collection
                </motion.h3>
                <motion.p 
                  className="text-xl text-muted-foreground mb-10 leading-relaxed"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Our flagship collection combines performance sportswear technology with clinical elegance. 
                  From sleek full-sleeve sets that project authority to lightweight options for maximum flexibility.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link to="/products">
                    <MagneticButton size="lg" className="group text-lg px-8 py-4">
                      Shop AURA Collection
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </Link>
                  <Link to="/about">
                    <MagneticButton variant="outline" size="lg" className="text-lg px-8 py-4">
                      Learn More
                    </MagneticButton>
                  </Link>
                </motion.div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variants={fadeInRight}>
              <motion.div 
                className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-12 text-center glass relative overflow-hidden"
                variants={float}
                initial="hidden"
                whileInView="visible"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 8,
                  boxShadow: "0 30px 60px rgba(59, 130, 246, 0.2)"
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-8 flex items-center justify-center relative"
                  variants={glow}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 15
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <motion.span 
                    className="text-4xl font-bold text-white"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -360, 0]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    A
                  </motion.span>
                </motion.div>
                <motion.h4 
                  className="text-3xl font-bold text-luxury-navy mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Premium Experience
                </motion.h4>
                <motion.p 
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Elevate your professional wardrobe with uniforms that feel as good as they look.
                </motion.p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </AppleStyleSection>

      {/* Product Showcase - Apple-style scrolling */}
      <ProductShowcase />

      {/* Testimonials Section */}
      

      {/* Awards & Recognition */}
      

      {/* AURA in Action - Video Reviews */}
      <VideoReviews />
    </div>;
};
export default Home;