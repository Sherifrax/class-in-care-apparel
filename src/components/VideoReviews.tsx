import { Card } from "@/components/ui/card";
import { Star, Play } from "lucide-react";
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
    <section className="py-24 bg-gradient-to-b from-background via-soft-gray/30 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-36 h-36 bg-medical-blue/5 rounded-full animate-apple-float"></div>
        <div className="absolute bottom-1/4 right-1/5 w-28 h-28 bg-medical-teal/5 rounded-full animate-apple-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent-coral/5 rounded-full animate-apple-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-apple-reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            AURA in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See real reviews from medical professionals who trust AURA uniforms for their daily work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => (
            <Card key={review.id} className="p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group animate-apple-reveal-stagger bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-sm border border-white/20 hover:border-medical-blue/30 rounded-3xl overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 group-hover:scale-105 transition-transform duration-500">
                <video 
                  className="w-full h-72 object-cover cursor-pointer"
                  poster=""
                  controls
                  preload="metadata"
                >
                  <source src={review.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl animate-apple-scale">
                    <Play className="w-8 h-8 text-medical-blue ml-1" />
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute top-4 left-4 animate-apple-float">
                  <div className="bg-white/90 text-luxury-navy px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    <Star className="w-4 h-4 inline mr-1 fill-current text-yellow-500" />
                    {review.rating}.0
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Verified Review</div>
                </div>
                
                <h3 className="text-2xl font-bold text-luxury-navy group-hover:text-medical-blue transition-colors">{review.title}</h3>
                
                <div className="pt-6 border-t border-medical-blue/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-medical-blue to-medical-teal rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {review.reviewer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-luxury-navy text-lg">{review.reviewer}</p>
                      <p className="text-sm text-muted-foreground font-medium">{review.profession}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Pricing Section */}
        <div className="text-center animate-apple-reveal-stagger animate-stagger-4">
          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 border border-medical-blue/10 shadow-xl backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">
              Premium Quality, <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Accessible Pricing</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-navy mb-2">250-275 AED</div>
                <div className="text-lg text-muted-foreground">Scrubs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-navy mb-2">300 AED</div>
                <div className="text-lg text-muted-foreground">Lab Coats</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-navy mb-2">+25 AED</div>
                <div className="text-lg text-muted-foreground">Shipping</div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-luxury-navy">Free exchanges</span> within 14 days • 
              <span className="font-bold text-luxury-navy"> Premium materials</span> • 
              <span className="font-bold text-luxury-navy"> Professional fit guarantee</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoReviews;