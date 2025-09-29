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
    <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            AURA in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See real reviews from medical professionals who trust AURA uniforms for their daily work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={review.id} className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10">
                <video 
                  className="w-full h-64 object-cover cursor-pointer"
                  poster=""
                  controls
                  preload="metadata"
                >
                  <source src={review.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-medical-blue ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold text-luxury-navy">{review.title}</h3>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.reviewer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-luxury-navy">{review.reviewer}</p>
                      <p className="text-sm text-muted-foreground">{review.profession}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-2xl p-8 inline-block">
            <p className="text-lg text-muted-foreground mb-4">
              <span className="font-bold text-luxury-navy">250-300 AED</span> per uniform
            </p>
            <p className="text-sm text-muted-foreground">
              Scrubs: 250-275 AED • Lab Coats: 300 AED • + 25 AED shipping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoReviews;