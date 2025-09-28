import { Card } from "@/components/ui/card";
import { Star, Play } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import reviewVideo1 from "@/assets/review-video-1.mp4";
import reviewVideo2 from "@/assets/review-video-2.mp4";
import reviewVideo3 from "@/assets/review-video-3.mp4";

const VideoReviews = () => {
  const reviews = [
    {
      id: 1,
      video: reviewVideo1,
      rating: 5,
      reviewer: "Dr. Sarah Ahmed",
      profession: "Emergency Medicine",
      title: "Perfect for long shifts"
    },
    {
      id: 2,
      video: reviewVideo2,
      rating: 5,
      reviewer: "Nurse Fatima",
      profession: "ICU Nurse",
      title: "Incredibly comfortable"
    },
    {
      id: 3,
      video: reviewVideo3,
      rating: 5,
      reviewer: "Dr. Ahmed Hassan",
      profession: "Surgeon",
      title: "Professional and stylish"
    }
  ];

  return (
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
              AURA in Action
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              See real reviews from medical professionals who trust AURA uniforms for their daily work.
            </motion.p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={staggerItem}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 group card-enhanced">
                <motion.div 
                  className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <video 
                    className="w-full h-64 object-cover cursor-pointer"
                    poster=""
                    controls
                    preload="metadata"
                  >
                    <source src={review.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <motion.div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-6 h-6 text-medical-blue ml-1" />
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.5 + i * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Star className={`w-5 h-5 ${i < review.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-semibold text-luxury-navy"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {review.title}
                  </motion.h3>
                  
                  <motion.div 
                    className="pt-4 border-t"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {review.reviewer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-luxury-navy">{review.reviewer}</p>
                        <p className="text-sm text-muted-foreground">{review.profession}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal variants={fadeInUp}>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-2xl p-8 inline-block"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.p 
                className="text-lg text-muted-foreground mb-4"
                animate={{ 
                  color: ["hsl(var(--muted-foreground))", "hsl(var(--medical-blue))", "hsl(var(--muted-foreground))"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="font-bold text-luxury-navy">250-300 AED</span> per uniform
              </motion.p>
              <p className="text-sm text-muted-foreground">
                Scrubs: 250-275 AED • Lab Coats: 300 AED • + 25 AED shipping
              </p>
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VideoReviews;