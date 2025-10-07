import { useSizeGuide } from "@/contexts/SizeGuideContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Footer = () => {
  const { openSizeGuide } = useSizeGuide();
  const [showReturnsDialog, setShowReturnsDialog] = useState(false);
  
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
              <li><button onClick={() => setShowReturnsDialog(true)} className="hover:text-white transition-colors text-left">Returns & Exchanges</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Aura Medical Uniforms. All rights reserved. Founded by <a href="https://www.instagram.com/dr.bayan_mhmhrs/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">Dr. Bayan</a></p>
        </div>
      </div>

      <Dialog open={showReturnsDialog} onOpenChange={setShowReturnsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-luxury-navy">Returns & Exchanges Policy</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-luxury-navy mb-2">Return Window</h4>
                <p className="text-muted-foreground">
                  We accept returns and exchanges within <strong>7 days</strong> of delivery for non-customized items only.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-luxury-navy mb-2">Eligible Items</h4>
                <p className="text-muted-foreground">
                  • Items must be unworn, unwashed, and in original condition<br/>
                  • All tags must be attached<br/>
                  • Items must be in original packaging<br/>
                  • <strong>Customized items (with embroidery) are not eligible for return or exchange</strong>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-luxury-navy mb-2">Process</h4>
                <p className="text-muted-foreground">
                  Contact us at <a href="mailto:auramedicaluniforms@hotmail.com" className="text-medical-blue hover:underline">auramedicaluniforms@hotmail.com</a> or WhatsApp at <a href="https://wa.me/971568988436" className="text-medical-blue hover:underline">+971 56 898 8436</a> to initiate a return or exchange.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-luxury-navy mb-2">Refunds</h4>
                <p className="text-muted-foreground">
                  Refunds will be processed within 5-7 business days after we receive the returned item. Shipping costs are non-refundable.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>;
};
export default Footer;