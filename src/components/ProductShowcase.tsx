import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced product data with multiple images and 3D positioning
const products = [
  {
    id: 1,
    name: "AURA Professional Collection",
    images: [
      "/images/collection-black-female.jpg",
      "/images/collection-black-female-2.jpg",
      "/images/collection-black-female-fun.jpg"
    ],
    badge: "Best Seller",
    position: { x: 0, y: 0, z: 0 }
  },
  {
    id: 2,
    name: "AURA Clinical Excellence",
    images: [
      "/images/collection-black-male-clinic.jpg",
      "/images/collection-black-male.jpg",
      "/images/collection-black-male-2.jpg"
    ],
    badge: "Premium",
    position: { x: 100, y: 50, z: -50 }
  },
  {
    id: 3,
    name: "AURA Lightweight Series",
    images: [
      "/images/collection-light-blue-front.jpg",
      "/images/collection-light-blue-back.jpg",
      "/images/collection-light-blue-detail.jpg",
      "/images/collection-light-blue-full.jpg",
      "/images/collection-light-blue-pants.jpg",
      "/images/collection-light-blue-side.jpg"
    ],
    badge: "New",
    position: { x: -100, y: 30, z: 30 }
  },
  {
    id: 4,
    name: "AURA Team Collection",
    images: [
      "/images/collection-team-black.jpg",
      "/images/collection-blue-scrubs.jpg"
    ],
    badge: "Team Favorite",
    position: { x: 50, y: -30, z: 80 }
  },
  {
    id: 5,
    name: "AURA Lifestyle Collection",
    images: [
      "/images/collection-white-lifestyle.jpg",
      "/images/collection-white-professional.jpg"
    ],
    badge: "Limited",
    position: { x: -50, y: -50, z: -30 }
  },
  {
    id: 6,
    name: "AURA Fabric Innovation",
    images: [
      "/images/fabric-texture.jpg"
    ],
    badge: "Innovation",
    position: { x: 150, y: 0, z: -100 }
  },
  {
    id: 7,
    name: "AURA Hero Collection",
    images: [
      "/images/hero-medical-professional.jpg"
    ],
    badge: "Hero",
    position: { x: -150, y: 80, z: 50 }
  }
];

const ProductShowcase = () => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax transforms for 3D effect
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Dynamic image rotation based on scroll position
  const getImageRotation = (productIndex: number, imageIndex: number) => {
    const baseRotation = scrollYProgress.get() * 360;
    const productOffset = productIndex * 45;
    const imageOffset = imageIndex * 15;
    return (baseRotation + productOffset + imageOffset) % 360;
  };

  // Get current image based on scroll position
  const getCurrentImage = (product: any, productIndex: number) => {
    const scrollProgress = scrollYProgress.get();
    const imageIndex = Math.floor(scrollProgress * product.images.length * 2) % product.images.length;
    return product.images[imageIndex];
  };

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-medical-blue/5 to-background">
      <div ref={containerRef} className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-6xl md:text-8xl font-bold text-luxury-navy mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ 
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            The <motion.span 
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
            >AURA Collection</motion.span>
          </motion.h2>
          <motion.p 
            className="text-2xl md:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience the future of medical uniforms. Each piece is crafted with precision, 
            designed for comfort, and built to last through your most demanding shifts.
          </motion.p>
        </motion.div>

        {/* 3D Product Gallery */}
        <div className="relative" style={{ perspective: "2000px" }}>
          {/* Background Elements */}
          <motion.div 
            className="absolute inset-0 -z-10"
            style={{ y: y1, opacity: opacity }}
          >
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-medical-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-medical-teal/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-full blur-3xl"></div>
          </motion.div>

          {/* Ultra-Modern Product Showcase */}
          <div className="relative">
            {/* Hero Section - Ultra Dynamic Background */}
            <motion.div 
              className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
            >
              {/* Ultra Dynamic Animated Background */}
              <div className="absolute inset-0">
                {/* Primary Floating Orbs */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                    x: [0, 50, -30, 0],
                    y: [0, -30, 40, 0]
                  }}
                  transition={{ 
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-pink-500/30 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                    x: [0, -40, 60, 0],
                    y: [0, 50, -20, 0]
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Secondary Floating Elements */}
                <motion.div
                  className="absolute top-1/2 left-1/6 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 360, 0],
                    x: [0, 80, -40, 0],
                    y: [0, -60, 30, 0]
                  }}
                  transition={{ 
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-gradient-to-r from-rose-500/25 to-orange-500/25 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1.1, 0.9, 1.1],
                    rotate: [0, -180, 0],
                    x: [0, -60, 40, 0],
                    y: [0, 40, -50, 0]
                  }}
                  transition={{ 
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Tertiary Micro Animations */}
                <motion.div
                  className="absolute top-1/6 right-1/3 w-48 h-48 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 rounded-full blur-2xl"
                  animate={{ 
                    scale: [0.5, 1.5, 0.5],
                    rotate: [0, 720, 0],
                    x: [0, 30, -20, 0],
                    y: [0, -25, 35, 0]
                  }}
                  transition={{ 
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/6 left-1/3 w-56 h-56 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1.3, 0.7, 1.3],
                    rotate: [0, -360, 0],
                    x: [0, -35, 25, 0],
                    y: [0, 30, -40, 0]
                  }}
                  transition={{ 
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Particle System */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Dynamic Grid Pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '50px 50px']
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Animated Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"
                  animate={{
                    background: [
                      'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
                      'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1))',
                      'linear-gradient(225deg, rgba(34, 197, 94, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))',
                      'linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1), rgba(236, 72, 153, 0.1))'
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Main Product Display */}
              <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <motion.div
                  className="relative w-full max-w-6xl"
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]),
                    scale: useTransform(scrollYProgress, [0, 1], [1, 0.95])
                  }}
                >
                  {/* Glass Container */}
                  <motion.div
                    className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Product Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.slice(0, 6).map((product, index) => (
                        <motion.div
                          key={product.id}
                          className="group relative"
                          initial={{ opacity: 0, y: 50, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: index * 0.1,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            y: -8,
                            scale: 1.05,
                            rotateY: 5
                          }}
                        >
                          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                            <motion.img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Modern Badge */}
                            <motion.div
                              className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800"
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                              viewport={{ once: true }}
                            >
                              {product.badge}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Product Carousel - Enhanced Dynamic Background */}
            <motion.div 
              className="relative bg-gradient-to-b from-slate-800 to-slate-900 py-20 overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              {/* Dynamic Background Elements */}
              <div className="absolute inset-0">
                {/* Animated Wave Patterns */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
                    `
                  }}
                  animate={{
                    background: [
                      `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
                      `radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 60% 60%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
                      `radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 60% 60%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`
                    ]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Floating Geometric Shapes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 border border-white/10 rounded-lg"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Animated Lines */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.05) 51%, transparent 52%),
                      linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.05) 51%, transparent 52%)
                    `,
                    backgroundSize: '60px 60px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '60px 60px']
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              <div className="container mx-auto px-6">
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold text-white text-center mb-16"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Premium Medical Collection
                </motion.h2>

                {/* Horizontal Scrolling Products */}
                <div className="relative overflow-hidden">
                  <motion.div
                    className="flex gap-8"
                    animate={{ x: [0, -100, 0] }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="flex-shrink-0 w-80 h-96 group cursor-pointer"
                        whileHover={{ 
                          scale: 1.05,
                          rotateY: 10
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                          <motion.img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Product Info */}
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 p-6 text-white"
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                            <p className="text-sm text-white/80">Premium Medical Collection</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
