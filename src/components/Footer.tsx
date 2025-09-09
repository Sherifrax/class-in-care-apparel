const Footer = () => {
  return (
    <footer className="bg-luxury-navy text-white py-16">
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
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-medical-blue-light transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white/60 hover:text-medical-blue-light transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-white/60 hover:text-medical-blue-light transition-colors">
                Facebook
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Aurora Collection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Full-Sleeve Sets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lightweight Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Aura Medical Uniforms. All rights reserved. Founded by Dr. Bayan • Led by CEO Suhaal Hamdan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;