import AuroraCollection from "@/components/AuroraCollection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Aurora Classic Set",
      price: "$149",
      rating: 4.9,
      image: "bg-gradient-to-br from-medical-blue/20 to-medical-teal/20",
      description: "Our signature full-sleeve set combining elegance with performance",
      colors: ["Navy", "Teal", "Charcoal", "White"]
    },
    {
      id: 2,
      name: "Aurora Flex Collection",
      price: "$129",
      rating: 4.8,
      image: "bg-gradient-to-br from-medical-teal/20 to-medical-blue/20",
      description: "Lightweight and flexible for maximum mobility",
      colors: ["Sage", "Blush", "Steel", "Cream"]
    },
    {
      id: 3,
      name: "Aurora Premium Edition",
      price: "$199",
      rating: 5.0,
      image: "bg-gradient-to-br from-luxury-navy/20 to-medical-blue/20",
      description: "Ultimate luxury with advanced fabric technology",
      colors: ["Midnight", "Rose Gold", "Platinum", "Pearl"]
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <AuroraCollection />
      
      {/* Products Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Shop the <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Aurora Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our complete range of premium medical uniforms designed for the modern healthcare professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product, index) => (
              <div key={product.id} className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`${product.image} rounded-2xl h-64 mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-luxury-navy">A</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-luxury-navy">{product.name}</h3>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-medical-blue/30 to-medical-teal/30 border border-border"></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-luxury-navy">{product.price}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 text-center animate-fade-in-up">
            <h3 className="text-3xl font-bold text-luxury-navy mb-6">Can't Find What You're Looking For?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect uniform for your specific needs. 
              Get personalized recommendations from our experts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg">
                  Contact Our Experts
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  Learn About Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy mb-6">
              Perfect Fit Guarantee
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're so confident in our sizing that we offer free exchanges within 14 days. 
              Find your perfect fit with our comprehensive size guide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-bold text-luxury-navy mb-6">Size Guide Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-medical-blue">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Detailed Measurements</h4>
                    <p className="text-muted-foreground text-sm">Comprehensive size charts with exact measurements for all body types</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-medical-blue">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Fit Recommendations</h4>
                    <p className="text-muted-foreground text-sm">Personalized fit suggestions based on your measurements and preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-medical-blue">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Free Exchanges</h4>
                    <p className="text-muted-foreground text-sm">No-hassle exchanges if the fit isn't perfect</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">📏</span>
                </div>
                <h4 className="text-xl font-bold text-luxury-navy mb-4">Need Help with Sizing?</h4>
                <p className="text-muted-foreground mb-6">Chat with our sizing experts for personalized assistance</p>
                <Button>Get Sizing Help</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;