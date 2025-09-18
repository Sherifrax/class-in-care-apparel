import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Stethoscope, ArrowRight } from "lucide-react";
import drBayan1 from "@/assets/dr-bayan-1.jpg";
import drBayan2 from "@/assets/dr-bayan-2.jpg";
import drBayan3 from "@/assets/dr-bayan-3.jpg";
import drBayan4 from "@/assets/dr-bayan-4.jpg";
import drBayan5 from "@/assets/dr-bayan-5.jpg";
import drBayan6 from "@/assets/dr-bayan-6.jpg";
import drBayan7 from "@/assets/dr-bayan-7.jpg";
import drBayan8 from "@/assets/dr-bayan-8.jpg";

const FounderSection = () => {
  const images = [
    { src: drBayan4, alt: "Dr. Bayan Hares - Professional Portrait" },
    { src: drBayan7, alt: "Dr. Bayan Hares - Smiling" },
    { src: drBayan8, alt: "Dr. Bayan Hares - Thumbs Up" },
    { src: drBayan1, alt: "Dr. Bayan Hares - Classic Pose" },
    { src: drBayan2, alt: "Dr. Bayan Hares - Lab Coat" },
    { src: drBayan3, alt: "Dr. Bayan Hares - Side Profile" },
    { src: drBayan5, alt: "Dr. Bayan Hares - Surgical Attire" },
    { src: drBayan6, alt: "Dr. Bayan Hares - Back View" },
  ];

  const achievements = [
    { icon: <Award className="w-6 h-6" />, text: "15+ Years Healthcare Experience" },
    { icon: <Stethoscope className="w-6 h-6" />, text: "MD, Harvard Medical School" },
    { icon: <Heart className="w-6 h-6" />, text: "Fashion Institute of Technology Graduate" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-soft-gray/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About Our Founder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet Dr. Bayan Hares, the visionary who combines medical expertise with luxury fashion design
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Photo Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-left">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 
                  index === 3 ? 'md:col-span-1 md:row-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="animate-fade-in-right">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-primary mb-4">
                  Dr. Bayan Hares
                </h3>
                <p className="text-xl text-secondary-foreground font-semibold mb-6">
                  Founder & Chief Designer
                </p>
                
                <div className="space-y-4 mb-8">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center text-muted-foreground">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground mr-4 flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <span className="font-medium">{achievement.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prose prose-lg text-muted-foreground mb-8">
                <p className="mb-4">
                  "During my years in healthcare, I witnessed firsthand how uncomfortable and poorly designed medical uniforms affected both staff confidence and patient perception. I knew there had to be a better way."
                </p>
                <p className="mb-4">
                  Dr. Bayan's unique background combining medical practice with fashion design education led to the creation of AURA - where luxury meets functionality in medical apparel.
                </p>
                <p>
                  "Every uniform we design is tested by real healthcare professionals in real clinical environments. We don't just make clothes; we craft confidence."
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-primary mb-3">The AURA Philosophy</h4>
                <p className="text-muted-foreground text-sm">
                  Combining the precision of medical practice with the elegance of high fashion to create uniforms that make healthcare professionals feel confident, comfortable, and professional.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    Shop the Collection
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Dr. Bayan
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;