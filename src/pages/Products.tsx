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
import { Star, ShoppingCart, Heart, Eye, Plus, Minus, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useSizeGuide } from '@/contexts/SizeGuideContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { ColorSwatch } from "@/components/ColorSwatch";
import { ColorSelector } from "@/components/ColorSelector";
import { COLOR_ORDER } from "@/constants/colors";
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
const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    addToCart
  } = useCart();
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useFavorites();
  const {
    toast
  } = useToast();
  const {
    openSizeGuide
  } = useSizeGuide();

  // Fetch products from Supabase
  const {
    data: products = [],
    isLoading: productsLoading
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('products').select('*, product_categories(name)').order('created_at', {
        ascending: true
      });
      if (error) throw error;
      return data as (Product & {
        product_categories: {
          name: string;
        } | null;
      })[];
    }
  });


  // Show all products without any filtering
  const filteredProducts = products;



  // Get unique filter options from products
  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;

    // Check stock availability
    if (selectedProduct.track_stock && selectedProduct.stock_quantity < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${selectedProduct.stock_quantity} items available`,
        variant: "destructive"
      });
      return;
    }
    await addToCart(selectedProduct.id, selectedSize, selectedColor || undefined, quantity);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
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
    setSelectedColor(product.colors[0] || '');
    setQuantity(1);
    setCurrentImageIndex(0);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setCurrentImageIndex(0);
  };
  if (productsLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen pt-20">
      <AuroraCollection />
      
      
      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-apple-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy mb-4">
              Shop the <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA Collection</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {filteredProducts.map((product, index) => <Card key={product.id} className="p-6 sm:p-8 glass border-medical-blue/20 hover:shadow-2xl hover:border-medical-blue/40 transition-all duration-500 group animate-apple-reveal-stagger relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-2" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {/* Enhanced Badge */}
                {product.badge && <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-medical-blue to-medical-teal text-white border-0 px-4 py-2 font-semibold shadow-lg animate-apple-glow" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {product.badge}
                  </Badge>}
                
                {/* Enhanced Wishlist Button */}
                <Button variant="ghost" size="sm" className={cn("absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-110", isFavorite(product.id) && "opacity-100 text-red-500 bg-red-50")} onClick={e => handleToggleFavorite(product.id, e)}>
                  <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current animate-apple-scale")} />
                </Button>

                <div className="rounded-3xl h-80 sm:h-72 mb-6 overflow-hidden relative shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <img src={product.images && product.images.length > 0 ? product.images[0] : product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {product.images && product.images.length > 1 && <Badge className="absolute top-4 left-4 bg-black/80 text-white border-0 px-3 py-1 font-semibold backdrop-blur-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      +{product.images.length - 1} more
                    </Badge>}
                  
                  {/* Enhanced Quick View Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl flex items-center justify-center">
                    <div className="flex flex-col gap-3">
                      <Button size="lg" className="gap-3 bg-white/95 text-medical-blue hover:bg-white shadow-2xl backdrop-blur-sm rounded-2xl px-8 py-4 text-base font-semibold hover:scale-105 transition-all duration-300" onClick={() => openQuickView(product)}>
                        <Eye className="w-5 h-5" />
                        Quick View
                      </Button>
                    </div>
                  </div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-medical-blue/30 rounded-full animate-apple-float"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-medical-teal/40 rounded-full animate-apple-float" style={{animationDelay: '1s'}}></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-luxury-navy line-clamp-2 group-hover:text-medical-blue transition-colors">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Features */}
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 2).map((feature, i) => <Badge key={i} variant="outline" className="text-xs px-3 py-1 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 transition-colors">
                        {feature}
                      </Badge>)}
                    {product.features.length > 2 && <Badge variant="outline" className="text-xs px-3 py-1 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 transition-colors">
                        +{product.features.length - 2} more
                      </Badge>}
                  </div>
                  
                  {/* Enhanced Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">({product.reviews} reviews)</span>
                  </div>
                  
                  {/* Enhanced Colors */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">Colors:</span>
                    <div className="flex gap-2">
                      {product.colors.slice(0, 4).map((color, i) => <ColorSwatch key={i} color={color} size="md" className="w-8 h-8 sm:w-6 sm:h-6" />)}
                      {product.colors.length > 4 && <div className="text-xs text-muted-foreground font-medium">+{product.colors.length - 4}</div>}
                    </div>
                  </div>
                  
                  {/* Enhanced Sizes */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">Sizes:</span>
                    <div className="flex gap-2">
                      {product.sizes.slice(0, 4).map((size, i) => <Badge key={i} variant="outline" className="text-xs px-3 py-1 cursor-pointer hover:bg-medical-blue hover:text-white hover:border-medical-blue transition-all duration-200 border-medical-blue/30">
                          {size}
                        </Badge>)}
                      {product.sizes.length > 4 && <Badge variant="outline" className="text-xs px-3 py-1 border-medical-blue/30">
                          +{product.sizes.length - 4}
                        </Badge>}
                    </div>
                  </div>
                  
                  {/* Enhanced Stock Status */}
                  {product.track_stock && <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${product.stock_quantity === 0 ? 'bg-red-100 text-red-800' : product.stock_quantity <= product.low_stock_threshold ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity <= product.low_stock_threshold ? `Only ${product.stock_quantity} left` : 'In Stock'}
                      </span>
                    </div>}
                  
                  {/* Enhanced Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-medical-blue/10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AED {product.price}</span>
                      {product.original_price && <span className="text-lg text-muted-foreground line-through">AED {product.original_price}</span>}
                    </div>
                    <Button size="lg" className="gap-3 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3 font-semibold" onClick={() => openProductDialog(product)} disabled={product.track_stock && product.stock_quantity === 0}>
                      <ShoppingCart className="w-5 h-5" />
                      {product.track_stock && product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </Card>)}
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl p-12 text-center animate-apple-reveal-stagger animate-stagger-4 border border-medical-blue/10 shadow-xl backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-luxury-navy mb-6">
              Can't Find What You're <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Looking For</span>?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Our team is here to help you find the perfect uniform for your specific needs. 
              Get personalized recommendations from our experts and discover the perfect fit for your professional wardrobe.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105 border-0"
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  Contact Our Experts
                </Button>
              </Link>
              <Link to="/features">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-luxury-navy px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Learn About Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Detail Dialog (Add to Cart) */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass border-medical-blue/30 backdrop-blur-xl bg-gradient-to-b from-white/95 to-white/90">
          {selectedProduct && <>
              <DialogHeader className="border-b border-medical-blue/20 pb-4">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Image Section - Full Width Top */}
                <div className="w-full">
                  {selectedProduct.images && selectedProduct.images.length > 1 ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-medical-blue/5 to-medical-teal/5">
                        <img 
                          src={selectedProduct.images[currentImageIndex]} 
                          alt={selectedProduct.name} 
                          className="w-full h-80 object-cover"
                        />
                        {selectedProduct.badge && (
                          <Badge className="absolute top-4 left-4 z-10" variant={selectedProduct.badge === "Best Seller" ? "default" : "secondary"}>
                            {selectedProduct.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                              currentImageIndex === index 
                                ? "border-medical-blue ring-2 ring-medical-blue/30" 
                                : "border-transparent hover:border-medical-blue/50"
                            )}
                          >
                            <img 
                              src={image} 
                              alt={`${selectedProduct.name} ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-medical-blue/5 to-medical-teal/5">
                      <img 
                        src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Product Details Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-luxury-navy">
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
                            <Star 
                              key={i} 
                              className={cn(
                                "w-4 h-4",
                                i < Math.floor(selectedProduct.rating) 
                                  ? "fill-current text-yellow-500" 
                                  : "text-gray-300"
                              )} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({selectedProduct.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {selectedProduct.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-luxury-navy">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.track_stock && (
                      <div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
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
                              : `${selectedProduct.stock_quantity} available`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="size" className="text-base font-semibold">Select Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose your size" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.sizes.map(size => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedProduct.colors.length > 0 && (
                      <div>
                        <Label className="text-base font-semibold">Select Color</Label>
                        <div className="mt-2">
                          <ColorSelector 
                            colors={selectedProduct.colors} 
                            selectedColor={selectedColor} 
                            onColorSelect={setSelectedColor} 
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="quantity" className="text-base font-semibold">Quantity</Label>
                      <div className="flex items-center gap-3 mt-2 glass bg-medical-blue/5 rounded-xl p-3 border border-medical-blue/20">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                          disabled={quantity <= 1}
                          className="hover:bg-medical-blue/10 rounded-lg"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <Input 
                          id="quantity" 
                          value={quantity} 
                          onChange={e => {
                            const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                            if (selectedProduct.track_stock) {
                              setQuantity(Math.min(newQuantity, selectedProduct.stock_quantity));
                            } else {
                              setQuantity(newQuantity);
                            }
                          }} 
                          className="w-24 text-center border-0 bg-transparent font-bold text-lg" 
                          type="number" 
                          min="1" 
                          max={selectedProduct.track_stock ? selectedProduct.stock_quantity : undefined}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            if (selectedProduct.track_stock) {
                              setQuantity(Math.min(quantity + 1, selectedProduct.stock_quantity));
                            } else {
                              setQuantity(quantity + 1);
                            }
                          }} 
                          disabled={selectedProduct.track_stock && quantity >= selectedProduct.stock_quantity}
                          className="hover:bg-medical-blue/10 rounded-lg"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-14 text-lg bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] rounded-xl font-semibold" 
                      onClick={handleAddToCart} 
                      disabled={!selectedSize || (selectedProduct.track_stock && (selectedProduct.stock_quantity === 0 || quantity > selectedProduct.stock_quantity))}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {selectedProduct.track_stock && selectedProduct.stock_quantity === 0 
                        ? 'Out of Stock' 
                        : `Add to Cart (${quantity} item${quantity !== 1 ? 's' : ''})`}
                    </Button>
                  </div>
                </div>
              </div>
            </>}
        </DialogContent>
      </Dialog>

      {/* Quick View Dialog (Image Gallery) */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 glass border-medical-blue/30 backdrop-blur-xl bg-gradient-to-b from-white/95 to-white/90 overflow-hidden">
          {quickViewProduct && (
            <div className="flex flex-col h-full max-h-[95vh]">
              <DialogHeader className="border-b border-medical-blue/20 pb-4 px-6 pt-6 flex-shrink-0">
                <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                  {quickViewProduct.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                {/* Large Image Carousel */}
                {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                  <div className="relative animate-fade-in">
                    <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-medical-blue/5 to-medical-teal/5 shadow-luxury group">
                      <img 
                        src={quickViewProduct.images[currentImageIndex] || quickViewProduct.image} 
                        alt={quickViewProduct.name}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                        key={currentImageIndex}
                      />
                      {quickViewProduct.badge && (
                        <Badge className="absolute top-4 left-4 z-10 text-base px-4 py-2 animate-scale-in shadow-lg" variant={quickViewProduct.badge === "Best Seller" ? "default" : "secondary"}>
                          {quickViewProduct.badge}
                        </Badge>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {quickViewProduct.images.length}
                      </div>
                      
                      {/* Navigation Arrows */}
                      {quickViewProduct.images.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg h-14 w-14 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            onClick={() => setCurrentImageIndex((prev) => 
                              prev === 0 ? quickViewProduct.images!.length - 1 : prev - 1
                            )}
                          >
                            <ChevronLeft className="w-7 h-7" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg h-14 w-14 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            onClick={() => setCurrentImageIndex((prev) => 
                              prev === quickViewProduct.images!.length - 1 ? 0 : prev + 1
                            )}
                          >
                            <ChevronRight className="w-7 h-7" />
                          </Button>
                        </>
                      )}
                      
                      {/* Gradient Overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Thumbnail Navigation */}
                    {quickViewProduct.images.length > 1 && (
                      <div className="mt-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {quickViewProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg group relative",
                              currentImageIndex === index 
                                ? "border-medical-blue ring-4 ring-medical-blue/30 scale-105 shadow-glow" 
                                : "border-transparent hover:border-medical-blue/50"
                            )}
                          >
                            <img 
                              src={image} 
                              alt={`${quickViewProduct.name} ${index + 1}`}
                              className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                            />
                            {currentImageIndex === index && (
                              <div className="absolute inset-0 bg-medical-blue/20 backdrop-blur-[1px]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-medical-blue/5 to-medical-teal/5 shadow-luxury animate-fade-in">
                    <img 
                      src={quickViewProduct.image} 
                      alt={quickViewProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Quick Info & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-xl border border-medical-blue/10 animate-fade-in">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl md:text-3xl font-bold text-luxury-navy">
                        AED {quickViewProduct.price}
                      </span>
                      {quickViewProduct.original_price && (
                        <span className="text-lg text-muted-foreground line-through">
                          AED {quickViewProduct.original_price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(quickViewProduct.rating) 
                                ? "fill-current text-yellow-500" 
                                : "text-gray-300"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({quickViewProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    className="px-8 gap-2 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => {
                      setQuickViewProduct(null);
                      openProductDialog(quickViewProduct);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Size Guide Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-luxury-navy mb-4">
              Perfect Fit Guarantee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're so confident in our sizing that we offer free exchanges within 14 days. 
              Find your perfect fit with our comprehensive size guide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-xl font-bold text-luxury-navy mb-4">Size Guide Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-medical-blue">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Detailed Measurements</h4>
                    <p className="text-muted-foreground text-sm">Comprehensive size charts with exact measurements for all body types</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-medical-blue">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Fit Recommendations</h4>
                    <p className="text-muted-foreground text-sm">Personalized fit suggestions based on your measurements and preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-medical-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-medical-blue">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">Free Exchanges</h4>
                    <p className="text-muted-foreground text-sm">No-hassle exchanges if the fit isn't perfect</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl">📏</span>
                </div>
                <h4 className="text-lg font-bold text-luxury-navy mb-3">Need Help with Sizing?</h4>
                <p className="text-muted-foreground mb-4">Chat with our sizing experts for personalized assistance</p>
                <Button onClick={openSizeGuide}>Get Sizing Help</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Products;