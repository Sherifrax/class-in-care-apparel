import { Button } from "@/components/ui/button";
const CTA = () => {
  return <section className="py-20 bg-gradient-to-br from-luxury-navy via-medical-blue to-medical-teal text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Caring for Others Begins with How You Carry Yourself
          </h2>
          
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Experience the difference that true luxury medical apparel can make. 
            Join thousands of healthcare professionals who have chosen to elevate their professional presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-luxury-navy hover:bg-white/90 px-8 py-3 text-lg">
              Shop AURA Collection
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-luxury-navy px-8 py-3 text-lg text-zinc-950">
              Request Size Guide
            </Button>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Healthcare Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-white/80">Hospital Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTA;