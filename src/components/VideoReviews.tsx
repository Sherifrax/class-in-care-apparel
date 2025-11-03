import { Card } from "@/components/ui/card";
import { Star, Play } from "lucide-react";
import reviewVideo1 from "@/assets/review-video-1.mp4";
import reviewVideo2 from "@/assets/review-video-2.mp4";
import reviewVideo3 from "@/assets/review-video-3.mp4";
const VideoReviews = () => {
  const reviews = [{
    id: 1,
    video: reviewVideo1,
    rating: 5,
    reviewer: "Dr. Sarah Ahmed",
    profession: "Emergency Medicine",
    title: "Perfect for long shifts"
  }, {
    id: 2,
    video: reviewVideo2,
    rating: 5,
    reviewer: "Nurse Fatima",
    profession: "ICU Nurse",
    title: "Incredibly comfortable"
  }, {
    id: 3,
    video: reviewVideo3,
    rating: 5,
    reviewer: "Dr. Ahmed Hassan",
    profession: "Surgeon",
    title: "Professional and stylish"
  }];
  return <section className="py-24 bg-gradient-to-b from-background via-soft-gray/30 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-36 h-36 bg-medical-blue/5 rounded-full animate-apple-float"></div>
        <div className="absolute bottom-1/4 right-1/5 w-28 h-28 bg-medical-teal/5 rounded-full animate-apple-float" style={{
        animationDelay: "2s"
      }}></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent-coral/5 rounded-full animate-apple-float" style={{
        animationDelay: "4s"
      }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        

        

        {/* Enhanced Pricing Section */}
        <div className="text-center animate-apple-reveal-stagger animate-stagger-4">
          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 border border-medical-blue/10 shadow-xl backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">
              Premium Quality,{" "}
              <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                Accessible Pricing
              </span>
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
              <span className="font-bold text-luxury-navy">Free exchanges</span> within 7 days •
              <span className="font-bold text-luxury-navy"> Premium materials</span> •
              <span className="font-bold text-luxury-navy"> Professional fit guarantee</span>
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default VideoReviews;