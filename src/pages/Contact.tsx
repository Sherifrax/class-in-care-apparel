import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, Users } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen pt-20">
      <CTA />
      
      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Get in <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our uniforms? Need sizing help? Our team of experts is here to help you find the perfect solution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 animate-slide-in-left">
              <h3 className="text-2xl font-bold text-luxury-navy mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-navy mb-2">First Name</label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-navy mb-2">Last Name</label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Phone (Optional)</label>
                  <Input type="tel" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us about your needs, questions, or feedback..." 
                    className="min-h-[120px]"
                  />
                </div>
                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-in-right">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-luxury-navy">Live Chat</h4>
                    <p className="text-muted-foreground text-sm">Available 24/7</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get instant help from Dr. Bayan, our AI customer support specialist, available around the clock.
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat Now
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-luxury-navy">Email Support</h4>
                    <p className="text-muted-foreground text-sm">Response within 24 hours</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">support@auramedical.com</p>
                <p className="text-muted-foreground text-sm">
                  For detailed inquiries, sizing questions, or order support.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-luxury-navy">Phone Support</h4>
                    <p className="text-muted-foreground text-sm">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">1-800-AURA-MED</p>
                <p className="text-muted-foreground text-sm">
                  Speak directly with our product specialists and sizing experts.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-luxury-navy">Bulk Orders</h4>
                    <p className="text-muted-foreground text-sm">Special pricing available</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Outfitting your entire team? Contact our bulk sales team for special pricing and customization options.
                </p>
                <Button variant="outline" className="w-full">
                  Request Quote
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6 animate-slide-in-left">
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">What makes Aura uniforms different?</h4>
                <p className="text-muted-foreground">
                  We combine luxury fashion design principles with advanced performance fabrics specifically engineered for healthcare professionals.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">How do I find my correct size?</h4>
                <p className="text-muted-foreground">
                  Use our detailed size guide or chat with our sizing experts. We also offer free exchanges within 14 days.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">What's your return policy?</h4>
                <p className="text-muted-foreground">
                  We accept returns and exchanges within 14 days. Items must be unworn with original tags attached.
                </p>
              </div>
            </div>

            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">How long does shipping take?</h4>
                <p className="text-muted-foreground">
                  Standard shipping takes 2-5 business days. Express options available for faster delivery.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">Do you offer customization?</h4>
                <p className="text-muted-foreground">
                  Yes! We offer embroidery, custom colors, and bulk customization options for healthcare facilities.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-3">Are your uniforms machine washable?</h4>
                <p className="text-muted-foreground">
                  Absolutely. Our uniforms are designed for easy care and maintain their appearance after hundreds of wash cycles.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you with any questions or concerns.
            </p>
            <Button size="lg">
              Chat with Dr. Bayan
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;