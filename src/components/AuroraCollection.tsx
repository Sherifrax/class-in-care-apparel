import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import fabricTexture from "@/assets/fabric-texture.jpg";
const AuroraCollection = () => {
  return <section id="collection" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            The AURA Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our flagship collection exemplifies luxury medical apparel. Breathable, wrinkle-resistant, 
            and stretch-engineered fabrics designed for long shifts, high mobility, and everyday confidence.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img src={fabricTexture} alt="Premium medical fabric texture" className="w-full h-96 object-cover rounded-2xl shadow-card" />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-luxury-navy">Engineered for Excellence</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-medical-teal rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-luxury-navy mb-1">Breathable Performance</h4>
                  <p className="text-muted-foreground">Advanced moisture-wicking technology keeps you comfortable during long shifts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-luxury-navy mb-1">Wrinkle-Resistant</h4>
                  <p className="text-muted-foreground">Maintain professional appearance throughout your entire shift</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-medical-teal rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-luxury-navy mb-1">Stretch-Engineered</h4>
                  <p className="text-muted-foreground">Four-way stretch fabric adapts to your every movement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </section>;
};
export default AuroraCollection;