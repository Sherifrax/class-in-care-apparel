import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageCircle, Users, Calendar, Award, Headphones, Globe2 } from "lucide-react";

const Contact = () => {
  const supportTeam = [
    {
      name: "Dr. Bayan",
      role: "Founder & Product Expert",
      specialty: "Product design and medical insights",
      availability: "Available for consultations",
      image: "DB"
    },
    {
      name: "Lisa Chen",
      role: "Senior Customer Success",
      specialty: "Orders, sizing, and general support",
      availability: "Mon-Fri 8AM-8PM EST",
      image: "LC"
    },
    {
      name: "Marcus Torres",
      role: "Technical Specialist", 
      specialty: "Fabric technology and care instructions",
      availability: "Mon-Fri 9AM-6PM EST",
      image: "MT"
    },
    {
      name: "Sarah Johnson",
      role: "Bulk Orders Coordinator",
      specialty: "Healthcare facility partnerships",
      availability: "Mon-Fri 9AM-5PM EST", 
      image: "SJ"
    }
  ];

  const responseStats = [
    { metric: "< 2 min", label: "Average Chat Response", icon: <MessageCircle className="w-5 h-5" /> },
    { metric: "< 4 hours", label: "Email Response Time", icon: <Mail className="w-5 h-5" /> },
    { metric: "99.8%", label: "Customer Satisfaction", icon: <Award className="w-5 h-5" /> },
    { metric: "24/7", label: "AI Support Available", icon: <Clock className="w-5 h-5" /> }
  ];

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      subtitle: "Available 24/7",
      description: "Get instant help from Dr. Bayan, our AI customer support specialist, available around the clock.",
      action: "Start Chat Now",
      highlight: true
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support", 
      subtitle: "Mon-Fri, 9 AM - 6 PM EST",
      description: "Speak directly with our product specialists and sizing experts.",
      action: "Call 1-800-AURA-MED",
      highlight: false
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      subtitle: "Response within 4 hours",
      description: "For detailed inquiries, sizing questions, or order support.",
      action: "Email auramedicaluniforms@hotmail.com",
      highlight: false
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bulk Orders",
      subtitle: "Special pricing available",
      description: "Outfitting your entire team? Contact our bulk sales team for special pricing and customization options.",
      action: "Request Quote", 
      highlight: false
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Video Consultation",
      subtitle: "15-30 min sessions",
      description: "Schedule a personalized video call with our product experts for sizing guidance and recommendations.",
      action: "Book Consultation",
      highlight: false
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "International Support",
      subtitle: "Global shipping available", 
      description: "Serving healthcare professionals worldwide with localized support in multiple languages.",
      action: "View Global Options",
      highlight: false
    }
  ];
  return (
    <div className="min-h-screen pt-20">
      <CTA />
      
      {/* Response Time Stats */}
      <section className="py-12 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {responseStats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full flex items-center justify-center text-white mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-luxury-navy mb-1">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Multiple Ways to <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the support method that works best for you. Our expert team is ready to help with any questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className={`p-6 hover:shadow-xl transition-all duration-300 animate-scale-in ${method.highlight ? 'ring-2 ring-medical-blue/20 bg-gradient-to-br from-medical-blue/5 to-medical-teal/5' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
                {method.highlight && (
                  <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-medical-blue to-medical-teal">
                    Most Popular
                  </Badge>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.highlight ? 'bg-gradient-to-br from-medical-blue to-medical-teal text-white' : 'bg-medical-blue/10 text-medical-blue'}`}>
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-luxury-navy">{method.title}</h4>
                    <p className="text-muted-foreground text-sm">{method.subtitle}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{method.description}</p>
                <Button 
                  variant={method.highlight ? "default" : "outline"} 
                  className="w-full"
                  size="sm"
                >
                  {method.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-luxury-navy mb-6">
              Meet Your Support Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real people with healthcare expertise, ready to help you find the perfect uniform solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {supportTeam.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{member.image}</span>
                </div>
                <h4 className="text-lg font-semibold text-luxury-navy mb-1">{member.name}</h4>
                <p className="text-medical-blue font-medium mb-3 text-sm">{member.role}</p>
                <p className="text-muted-foreground text-xs mb-3">{member.specialty}</p>
                <Badge variant="outline" className="text-xs">
                  {member.availability}
                </Badge>
              </Card>
            ))}
          </div>

          <div className="text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">Need Immediate Assistance?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our AI assistant Dr. Bayan is available 24/7 for instant support, or connect with a human expert during business hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Dr. Bayan
              </Button>
              <Button variant="outline" size="lg">
                <Headphones className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Send Us a <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Message</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our uniforms? Need sizing help? Our team of experts is here to help you find the perfect solution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 animate-slide-in-left">
              <h3 className="text-2xl font-bold text-luxury-navy mb-6">Get Personalized Help</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-navy mb-2">First Name *</label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-navy mb-2">Last Name *</label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Email *</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Phone (Optional)</label>
                  <Input type="tel" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">I'm interested in:</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue">
                    <option>General Information</option>
                    <option>Product Questions</option>
                    <option>Sizing Help</option>
                    <option>Bulk Orders</option>
                    <option>Custom Solutions</option>
                    <option>Partnership Opportunities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-navy mb-2">Message *</label>
                  <Textarea 
                    placeholder="Tell us about your needs, questions, or feedback..." 
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-muted-foreground">
                    I'd like to receive updates about new products and exclusive offers from Aura Medical Uniforms.
                  </label>
                </div>
                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information & FAQ */}
            <div className="space-y-8 animate-slide-in-right">
              <Card className="p-6 bg-gradient-to-br from-medical-blue/5 to-medical-teal/5">
                <h4 className="text-xl font-semibold text-luxury-navy mb-4">Quick Answers</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-luxury-navy mb-1">How quickly will I hear back?</h5>
                    <p className="text-sm text-muted-foreground">Email responses within 4 hours during business days, chat responses in under 2 minutes.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-luxury-navy mb-1">Need immediate help?</h5>
                    <p className="text-sm text-muted-foreground">Use our live chat feature for instant support from Dr. Bayan, available 24/7.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-luxury-navy mb-1">Ordering for a team?</h5>
                    <p className="text-sm text-muted-foreground">Contact our bulk orders team for special pricing and customization options.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-xl font-semibold text-luxury-navy mb-4">Office Hours</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Chat Support</span>
                      <span className="font-medium text-medical-blue">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-xl font-semibold text-luxury-navy mb-4">Emergency Contact</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  For urgent order issues or time-sensitive inquiries outside business hours:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-medical-blue" />
                    <span className="text-sm">Emergency Hotline: 1-800-AURA-911</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-medical-blue" />
                    <span className="text-sm">auramedicaluniforms@hotmail.com</span>
                  </div>
                </div>
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