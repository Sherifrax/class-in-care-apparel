import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AuroraCollection from "@/components/AuroraCollection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, Filter, Grid, List, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  original_price: string | null;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  colors: string[];
  features: string[];
  badge: string | null;
  sizes: string[];
  stock_quantity: number;
  low_stock_threshold: number;
  track_stock: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Collections");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();

  // Fetch products from Supabase
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(name)')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as (Product & { product_categories: { name: string } | null })[];
    }
  });

  // Fetch categories from Supabase
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    }
  });

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All Collections" 
    ? products 
    : products.filter(product => 
        product.product_categories?.name === selectedCategory
      );

  // Calculate category counts dynamically
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: products.filter(p => p.product_categories?.name === category.name).length
  }));

  // Get unique filter options from products
  const filterOptions = [
    { 
      name: "Size", 
      options: [...new Set(products.flatMap(p => p.sizes))].sort()
    },
    { 
      name: "Color", 
      options: [...new Set(products.flatMap(p => p.colors))].sort()
    },
    { 
      name: "Features", 
      options: [...new Set(products.flatMap(p => p.features))].sort()
    },
    { 
      name: "Price Range", 
      options: ["Under 200 AED", "200-300 AED", "Over 300 AED"]
    }
  ];

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;
    
    // Check stock availability
    if (selectedProduct.track_stock && selectedProduct.stock_quantity < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${selectedProduct.stock_quantity} items available`,
        variant: "destructive",
      });
      return;
    }
    
    await addToCart(selectedProduct.id, selectedSize, quantity);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
  };

  const handleToggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click events
    
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setQuantity(1);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <AuroraCollection />
      
      {/* Enhanced Filter Bar */}
      <section className="py-6 bg-gradient-to-r from-white/80 to-medical-blue/5 backdrop-blur-sm border-b border-medical-blue/10 sticky top-20 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <Button variant="outline" size="sm" className="gap-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/10 transition-all duration-200">
                <Filter className="w-4 h-4 text-medical-blue" />
                <span className="font-medium">Filters</span>
              </Button>
              
              {/* Desktop Category Pills */}
              <div className="hidden md:flex flex-wrap gap-2 max-w-full overflow-x-auto no-scrollbar">
                <Button
                  variant={selectedCategory === "All Collections" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-xs font-medium whitespace-nowrap transition-all duration-200 rounded-full px-4",
                    selectedCategory === "All Collections" 
                      ? "bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-md hover:shadow-lg" 
                      : "hover:bg-medical-blue/10 hover:text-medical-blue border-medical-blue/20"
                  )}
                  onClick={() => setSelectedCategory("All Collections")}
                >
                  All Collections <Badge variant="secondary" className="ml-2 text-xs">
                    {selectedCategory === "All Collections" ? filteredProducts.length : products.length}
                  </Badge>
                </Button>
                {categoriesWithCounts.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-all duration-200 rounded-full px-4",
                      selectedCategory === category.name 
                        ? "bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-md hover:shadow-lg" 
                        : "hover:bg-medical-blue/10 hover:text-medical-blue border-medical-blue/20"
                    )}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name} <Badge variant="secondary" className="ml-2 text-xs">
                      {selectedCategory === category.name ? filteredProducts.length : category.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Mobile Category Dropdown */}
              <div className="md:hidden w-full">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full border-medical-blue/30 hover:border-medical-blue">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white/95 backdrop-blur-md border-medical-blue/20">
                    <SelectItem value="All Collections">
                      All Collections ({products.length})
                    </SelectItem>
                    {categoriesWithCounts.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">View:</span>
              <div className="flex items-center gap-1 p-1 bg-white/60 rounded-lg border border-medical-blue/20">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-medical-blue/10 rounded-md">
                  <Grid className="w-4 h-4 text-medical-blue" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-medical-blue/10 rounded-md">
                  <List className="w-4 h-4 text-medical-blue" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-medical-blue to-medical-teal flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-luxury-navy mb-8 leading-tight">
              Shop the <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience the perfect blend of comfort, style, and functionality with our premium medical uniforms. 
              <span className="block mt-2 font-medium text-luxury-navy">Trusted by over 10,000+ healthcare professionals worldwide.</span>
            </p>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Free Shipping on Orders Above 500 AED</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="p-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group animate-scale-in relative overflow-hidden bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-sm border-white/20 hover:border-medical-blue/30 hover:scale-[1.02] transform" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Badge */}
                {product.badge && (
                  <Badge className="absolute top-6 left-6 z-10 bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-lg" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                    {product.badge}
                  </Badge>
                )}
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0",
                    isFavorite(product.id) && "opacity-100 text-red-500 bg-red-50/90"
                  )}
                  onClick={(e) => handleToggleFavorite(product.id, e)}
                >
                  <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
                </Button>

                <div className="relative overflow-hidden">
                  <div className="h-80 mb-0 overflow-hidden group-hover:scale-110 transition-transform duration-500 relative">
                    <img 
                      src={(product.images && product.images.length > 0) ? product.images[0] : product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images && product.images.length > 1 && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-black/80 to-black/60 text-white shadow-lg">
                        +{product.images.length - 1} more
                      </Badge>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="bg-white/95 hover:bg-white text-luxury-navy gap-2 shadow-xl rounded-full px-6 py-3 font-semibold backdrop-blur-sm border border-white/20"
                        onClick={() => openProductDialog(product)}
                      >
                        <Eye className="w-5 h-5" />
                        Quick View
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-luxury-navy mb-2 leading-tight">{product.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
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
                  
                  {/* Stock Status */}
                  {product.track_stock && (
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity === 0 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock_quantity <= product.low_stock_threshold
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock_quantity === 0 
                          ? 'Out of Stock' 
                          : product.stock_quantity <= product.low_stock_threshold
                          ? `Only ${product.stock_quantity} left`
                          : 'In Stock'
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-6 border-t border-medical-blue/10">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-luxury-navy">AED {product.price}</span>
                        {product.original_price && (
                          <span className="text-lg text-muted-foreground line-through">AED {product.original_price}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">+ Free shipping on orders above 500 AED</span>
                    </div>
                    <Button 
                      size="lg" 
                      className="gap-2 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue/90 hover:to-medical-teal/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                      onClick={() => openProductDialog(product)}
                      disabled={product.track_stock && product.stock_quantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.track_stock && product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </Card>
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
      
      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.images && selectedProduct.images.length > 1 ? (
                    <div className="space-y-2">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedProduct.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border-2 border-transparent hover:border-primary cursor-pointer flex-shrink-0"
                            onClick={(e) => {
                              const mainImage = e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement;
                              if (mainImage) mainImage.src = image;
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={(selectedProduct.images && selectedProduct.images.length > 0) ? selectedProduct.images[0] : selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-luxury-navy">
                        AED {selectedProduct.price}
                      </span>
                      {selectedProduct.original_price && (
                        <span className="text-lg text-muted-foreground line-through">
                          AED {selectedProduct.original_price}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn(
                            "w-4 h-4",
                            i < Math.floor(selectedProduct.rating) ? "fill-current text-yellow-500" : "text-gray-300"
                          )} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({selectedProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    {selectedProduct.description}
                  </p>

                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                   <div>
                     <Label htmlFor="quantity">Quantity</Label>
                     <div className="flex items-center gap-2 mt-2">
                       <Button
                         variant="outline"
                         size="icon"
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         disabled={quantity <= 1}
                       >
                         <Minus className="w-4 h-4" />
                       </Button>
                       <Input 
                         id="quantity"
                         value={quantity}
                         onChange={(e) => {
                           const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                           if (selectedProduct.track_stock) {
                             setQuantity(Math.min(newQuantity, selectedProduct.stock_quantity));
                           } else {
                             setQuantity(newQuantity);
                           }
                         }}
                         className="w-20 text-center"
                         type="number"
                         min="1"
                         max={selectedProduct.track_stock ? selectedProduct.stock_quantity : undefined}
                       />
                       <Button
                         variant="outline"
                         size="icon"
                         onClick={() => {
                           if (selectedProduct.track_stock) {
                             setQuantity(Math.min(quantity + 1, selectedProduct.stock_quantity));
                           } else {
                             setQuantity(quantity + 1);
                           }
                         }}
                         disabled={selectedProduct.track_stock && quantity >= selectedProduct.stock_quantity}
                       >
                         <Plus className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>

                   {selectedProduct.track_stock && (
                     <div className="mb-2">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                         selectedProduct.stock_quantity === 0 
                           ? 'bg-red-100 text-red-800' 
                           : selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold
                           ? 'bg-orange-100 text-orange-800'
                           : 'bg-green-100 text-green-800'
                       }`}>
                         {selectedProduct.stock_quantity === 0 
                           ? 'Out of Stock' 
                           : selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold
                           ? `Only ${selectedProduct.stock_quantity} left`
                           : `${selectedProduct.stock_quantity} available`
                         }
                       </span>
                     </div>
                   )}

                   <Button 
                     className="w-full" 
                     onClick={handleAddToCart}
                     disabled={!selectedSize || (selectedProduct.track_stock && (selectedProduct.stock_quantity === 0 || quantity > selectedProduct.stock_quantity))}
                   >
                     <ShoppingCart className="w-4 h-4 mr-2" />
                     {selectedProduct.track_stock && selectedProduct.stock_quantity === 0 
                       ? 'Out of Stock' 
                       : `Add to Cart (${quantity} item${quantity !== 1 ? 's' : ''})`
                     }
                   </Button>

                  {selectedProduct.features.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.colors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.colors.map((color, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
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