import { useSizeGuide } from "@/contexts/SizeGuideContext";

const Footer = () => {
  const { openSizeGuide } = useSizeGuide();
  
  return <footer className="bg-luxury-navy text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg"></div>
              <span className="text-xl font-bold">Aura Medical Uniforms</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Redefining scrubs with elegance, comfort, and performance. 
              Because caring for others begins with how you carry yourself.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/auramedicaluniforms/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-luxury-gold transition-colors">
                @auramedicaluniforms
              </a>
              <a href="https://www.instagram.com/dr.bayan_mhmhrs/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-luxury-gold transition-colors">
                @dr.bayan_mhmhrs
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">AURA Collection</a></li>
              
              
              
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="mailto:auramedicaluniforms@hotmail.com" className="hover:text-white transition-colors">auramedicaluniforms@hotmail.com</a></li>
              <li><button onClick={openSizeGuide} className="hover:text-white transition-colors text-left">Size Guide</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Aura Medical Uniforms. All rights reserved. Founded by <a href="https://www.instagram.com/dr.bayan_mhmhrs/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">Dr. Bayan</a></p>
        </div>
      </div>
    </footer>;
};
export default Footer;