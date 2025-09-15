import AuroraCollection from "@/components/AuroraCollection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, Filter, Grid, List, ArrowRight, Zap, Shield, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import blackFemale from "@/assets/collection-black-female.jpg";
import blackMale from "@/assets/collection-black-male.jpg";
import teamBlack from "@/assets/collection-team-black.jpg";
import blackMale2 from "@/assets/collection-black-male-2.jpg";
import blueScrubs from "@/assets/collection-blue-scrubs.jpg";
import blackFemale2 from "@/assets/collection-black-female-2.jpg";
import blackFemaleFun from "@/assets/collection-black-female-fun.jpg";
import blackMaleClinic from "@/assets/collection-black-male-clinic.jpg";
import lightBlueBack from "@/assets/collection-light-blue-back.jpg";
import lightBlueFront from "@/assets/collection-light-blue-front.jpg";
import lightBlueSide from "@/assets/collection-light-blue-side.jpg";
import whiteLifestyle from "@/assets/collection-white-lifestyle.jpg";
import whiteProfessional from "@/assets/collection-white-professional.jpg";
import lightBluePants from "@/assets/collection-light-blue-pants.jpg";
import lightBlueFull from "@/assets/collection-light-blue-full.jpg";
import lightBlueDetail from "@/assets/collection-light-blue-detail.jpg";

// Image mapping for converting database paths to actual imports
const imageMap: Record<string, string> = {
  "/src/assets/collection-black-female.jpg": blackFemale,
  "/src/assets/collection-black-male.jpg": blackMale,
  "/src/assets/collection-light-blue-front.jpg": lightBlueFront,
  "/src/assets/collection-white-lifestyle.jpg": whiteLifestyle,
  "/src/assets/collection-team-black.jpg": teamBlack,
  "/src/assets/collection-black-male-clinic.jpg": blackMaleClinic,
  "/src/assets/collection-light-blue-full.jpg": lightBlueFull,
};

interface Product {
  id: string;
  name: string;
  price: string;
  original_price?: string;
  rating: number;
  reviews: number;
  image_path: string;
  description: string;
  colors: string[];
  features: string[];
  badge?: string;
  sizes: string[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: "All Collections", count: 8, active: true },
    { name: "Black Professional", count: 3, active: false },
    { name: "Light Blue", count: 3, active: false },
    { name: "White Professional", count: 1, active: false },
    { name: "Team Uniforms", count: 1, active: false }
  ];

  const filterOptions = [
    { name: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { name: "Color", options: ["Navy", "Teal", "White", "Charcoal", "Sage"] },
    { name: "Features", options: ["4-Way Stretch", "Moisture-Wicking", "Antimicrobial"] },
    { name: "Price Range", options: ["Under $150", "$150-$200", "Over $200"] }
  ];

  return (
    <div className="min-h-screen pt-20">
      <AuroraCollection />
      
      {/* Filter Bar */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <div className="flex gap-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={category.active ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button variant="ghost" size="sm">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Shop the <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our complete range of premium medical uniforms designed for the modern healthcare professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-6 shadow-lg animate-pulse">
                  <div className="rounded-2xl h-64 mb-6 bg-gray-200"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))
            ) : (
              products.map((product, index) => (
                <Card key={product.id} className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in relative overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
                  {/* Badge */}
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 z-10" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                      {product.badge}
                    </Badge>
                  )}
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>

                  <div className="rounded-2xl h-64 mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300 relative">
                    <img 
                      src={imageMap[product.image_path] || product.image_path} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Quick View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-luxury-navy">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Colors:</span>
                      <div className="flex gap-1">
                        {product.colors.slice(0, 4).map((color, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-medical-blue/30 to-medical-teal/30 border border-border cursor-pointer hover:scale-110 transition-transform"></div>
                        ))}
                        {product.colors.length > 4 && (
                          <div className="w-4 h-4 rounded-full bg-gray-200 border border-border flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{product.colors.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Sizes */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sizes:</span>
                      <div className="flex gap-1">
                        {product.sizes.slice(0, 4).map((size, i) => (
                          <Badge key={i} variant="outline" className="text-xs px-2 py-0 cursor-pointer hover:bg-medical-blue hover:text-white transition-colors">
                            {size}
                          </Badge>
                        ))}
                        {product.sizes.length > 4 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{product.sizes.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-luxury-navy">{product.price}</span>
                        {product.original_price && (
                          <span className="text-lg text-muted-foreground line-through">{product.original_price}</span>
                        )}
                        <span className="text-sm text-muted-foreground">+ 25 AED shipping</span>
                      </div>
                      <Button size="sm" className="gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
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