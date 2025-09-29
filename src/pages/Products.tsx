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
import { Star, ShoppingCart, Heart, Eye, Filter, Plus, Minus } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All Collections');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    features: [] as string[],
    priceRange: null as string | null
  });
  const [showFilters, setShowFilters] = useState(false);
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

  // Fetch categories from Supabase
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('product_categories').select('*').order('name', {
        ascending: true
      });
      if (error) throw error;
      return data as Category[];
    }
  });

  // Apply all filters
  const filteredProducts = products.filter(product => {
    // Category filter - "All Collections" shows all products
    if (selectedCategory !== null && selectedCategory !== 'All Collections') {
      const productCategory = product.product_categories?.name || null;
      if (productCategory !== selectedCategory) return false;
    }

    // Size filter
    if (selectedFilters.sizes.length > 0) {
      if (!selectedFilters.sizes.some(size => (product.sizes || []).includes(size))) return false;
    }

    // Color filter
    if (selectedFilters.colors.length > 0) {
      if (!selectedFilters.colors.some(color => (product.colors || []).includes(color))) return false;
    }

    // Features filter
    if (selectedFilters.features.length > 0) {
      if (!selectedFilters.features.some(feature => (product.features || []).includes(feature))) return false;
    }

    // Price range filter
    if (selectedFilters.priceRange) {
      const price = parseFloat(product.price);
      switch (selectedFilters.priceRange) {
        case "Under 200 AED":
          if (price >= 200) return false;
          break;
        case "200-300 AED":
          if (price < 200 || price > 300) return false;
          break;
        case "Over 300 AED":
          if (price <= 300) return false;
          break;
      }
    }
    return true;
  });

  // Helper function to map filter group names to selectedFilters keys
  const getFilterKey = (filterGroupName: string) => {
    switch (filterGroupName.toLowerCase()) {
      case 'size':
        return 'sizes';
      case 'color':
        return 'colors';
      case 'features':
        return 'features';
      case 'price range':
        return 'priceRange';
      default:
        return filterGroupName.toLowerCase();
    }
  };

  // De-duplicate categories by name and add dynamic counts
  const uniqueCategories = categories.reduce((acc, category) => {
    const existing = acc.find(c => c.name === category.name);
    if (!existing) {
      acc.push(category);
    }
    return acc;
  }, [] as Category[]);

  // Add "All Collections" if not present
  if (!uniqueCategories.find(c => c.name === 'All Collections')) {
    uniqueCategories.unshift({
      id: 'all',
      name: 'All Collections',
      count: 0,
      active: true
    });
  }

  // Use unique categories with dynamic counts
  const allCategories = uniqueCategories.map(category => ({
    ...category,
    count: category.name === 'All Collections' ? products.length : products.filter(p => p.product_categories?.name === category.name).length
  }));

  // Get unique filter options from products
  const filterOptions = [{
    name: "Size",
    options: [...new Set(products.flatMap(p => p.sizes || []))].filter(Boolean).sort()
  }, {
    name: "Color",
    options: [...new Set(products.flatMap(p => p.colors || []))].filter(Boolean).sort()
  }, {
    name: "Features",
    options: [...new Set(products.flatMap(p => p.features || []))].filter(Boolean).sort()
  }, {
    name: "Price Range",
    options: ["Under 200 AED", "200-300 AED", "Over 300 AED"]
  }];

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      sizes: [],
      colors: [],
      features: [],
      priceRange: null
    });
    setSelectedCategory('All Collections');
  };

  // Toggle filter option
  const toggleFilterOption = (filterGroupName: string, option: string) => {
    const filterKey = getFilterKey(filterGroupName);
    if (filterKey === 'priceRange') {
      setSelectedFilters(prev => ({
        ...prev,
        priceRange: prev.priceRange === option ? null : option
      }));
    } else {
      setSelectedFilters(prev => {
        const currentArray = prev[filterKey as keyof typeof prev] as string[];
        return {
          ...prev,
          [filterKey]: (currentArray || []).includes(option) ? (currentArray || []).filter(item => item !== option) : [...(currentArray || []), option]
        };
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== null && selectedCategory !== 'All Collections' || selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0 || selectedFilters.features.length > 0 || selectedFilters.priceRange !== null;
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
    return <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen pt-20">
      <AuroraCollection />
      
      {/* Optimized Filter Bar */}
      

      {/* Advanced Filters Panel */}
      {showFilters && <section className="py-6 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterOptions.map(filterGroup => <div key={filterGroup.name} className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">{filterGroup.name}</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                     {filterGroup.options.map(option => {
                const filterKey = getFilterKey(filterGroup.name);
                const isSelected = filterKey === 'priceRange' ? selectedFilters.priceRange === option : (selectedFilters[filterKey as keyof typeof selectedFilters] as string[] || []).includes(option);
                return <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                           <input type={filterGroup.name === 'Price Range' ? 'radio' : 'checkbox'} checked={isSelected} onChange={() => toggleFilterOption(filterGroup.name, option)} className="w-4 h-4 text-medical-blue border-gray-300 rounded focus:ring-medical-blue" />
                           <span className={cn("text-sm transition-colors", isSelected ? "text-medical-blue font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                             {option}
                           </span>
                         </label>;
              })}
                  </div>
                </div>)}
            </div>
          </div>
        </section>}
      
      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-b from-background to-soft-gray/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy mb-4">
              Shop the <span className="text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">AURA Collection</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of premium medical uniforms designed for the modern healthcare professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.map((product, index) => <Card key={product.id} className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-scale-in relative overflow-hidden" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {/* Badge */}
                {product.badge && <Badge className="absolute top-3 left-3 z-10" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                    {product.badge}
                  </Badge>}
                
                {/* Wishlist Button */}
                <Button variant="ghost" size="sm" className={cn("absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white", isFavorite(product.id) && "opacity-100 text-red-500")} onClick={e => handleToggleFavorite(product.id, e)}>
                  <Heart className={cn("w-4 h-4", isFavorite(product.id) && "fill-current")} />
                </Button>

                <div className="rounded-xl h-56 sm:h-64 mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 relative">
                  <img src={product.images && product.images.length > 0 ? product.images[0] : product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.images && product.images.length > 1 && <Badge className="absolute top-3 left-3 bg-black/70 text-white">
                      +{product.images.length - 1} more
                    </Badge>}
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2" onClick={() => openProductDialog(product)}>
                      <Eye className="w-4 h-4" />
                      Quick View
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-luxury-navy line-clamp-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, i) => <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>)}
                    {product.features.length > 2 && <Badge variant="outline" className="text-xs">
                        +{product.features.length - 2} more
                      </Badge>}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 4).map((color, i) => <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-medical-blue/30 to-medical-teal/30 border border-border cursor-pointer hover:scale-110 transition-transform"></div>)}
                      {product.colors.length > 4 && <div className="w-4 h-4 rounded-full bg-gray-200 border border-border flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{product.colors.length - 4}</span>
                        </div>}
                    </div>
                  </div>
                  
                  {/* Sizes */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sizes:</span>
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 4).map((size, i) => <Badge key={i} variant="outline" className="text-xs px-2 py-0 cursor-pointer hover:bg-medical-blue hover:text-white transition-colors">
                          {size}
                        </Badge>)}
                      {product.sizes.length > 4 && <Badge variant="outline" className="text-xs px-2 py-0">
                          +{product.sizes.length - 4}
                        </Badge>}
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  {product.track_stock && <div className="mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity === 0 ? 'bg-red-100 text-red-800' : product.stock_quantity <= product.low_stock_threshold ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity <= product.low_stock_threshold ? `Only ${product.stock_quantity} left` : 'In Stock'}
                      </span>
                    </div>}
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-xl font-bold text-luxury-navy">AED {product.price}</span>
                      {product.original_price && <span className="text-sm text-muted-foreground line-through">AED {product.original_price}</span>}
                    </div>
                    <Button size="sm" className="gap-2 text-xs" onClick={() => openProductDialog(product)} disabled={product.track_stock && product.stock_quantity === 0}>
                      <ShoppingCart className="w-4 h-4" />
                      {product.track_stock && product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </Card>)}
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-2xl p-8 text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the perfect uniform for your specific needs. 
              Get personalized recommendations from our experts.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
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
          {selectedProduct && <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.images && selectedProduct.images.length > 1 ? <div className="space-y-2">
                      <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg" />
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedProduct.images.map((image, index) => <img key={index} src={image} alt={`${selectedProduct.name} ${index + 1}`} className="w-16 h-16 object-cover rounded border-2 border-transparent hover:border-primary cursor-pointer flex-shrink-0" onClick={e => {
                    const mainImage = e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement;
                    if (mainImage) mainImage.src = image;
                  }} />)}
                      </div>
                    </div> : <img src={selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg" />}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-luxury-navy">
                        AED {selectedProduct.price}
                      </span>
                      {selectedProduct.original_price && <span className="text-lg text-muted-foreground line-through">
                          AED {selectedProduct.original_price}
                        </span>}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < Math.floor(selectedProduct.rating) ? "fill-current text-yellow-500" : "text-gray-300")} />)}
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
                        {selectedProduct.sizes.map(size => <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                   <div>
                     <Label htmlFor="quantity">Quantity</Label>
                     <div className="flex items-center gap-2 mt-2">
                       <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                         <Minus className="w-4 h-4" />
                       </Button>
                       <Input id="quantity" value={quantity} onChange={e => {
                    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                    if (selectedProduct.track_stock) {
                      setQuantity(Math.min(newQuantity, selectedProduct.stock_quantity));
                    } else {
                      setQuantity(newQuantity);
                    }
                  }} className="w-20 text-center" type="number" min="1" max={selectedProduct.track_stock ? selectedProduct.stock_quantity : undefined} />
                       <Button variant="outline" size="icon" onClick={() => {
                    if (selectedProduct.track_stock) {
                      setQuantity(Math.min(quantity + 1, selectedProduct.stock_quantity));
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }} disabled={selectedProduct.track_stock && quantity >= selectedProduct.stock_quantity}>
                         <Plus className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>

                   {selectedProduct.track_stock && <div className="mb-2">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedProduct.stock_quantity === 0 ? 'bg-red-100 text-red-800' : selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                         {selectedProduct.stock_quantity === 0 ? 'Out of Stock' : selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold ? `Only ${selectedProduct.stock_quantity} left` : `${selectedProduct.stock_quantity} available`}
                       </span>
                     </div>}

                   <Button className="w-full" onClick={handleAddToCart} disabled={!selectedSize || selectedProduct.track_stock && (selectedProduct.stock_quantity === 0 || quantity > selectedProduct.stock_quantity)}>
                     <ShoppingCart className="w-4 h-4 mr-2" />
                     {selectedProduct.track_stock && selectedProduct.stock_quantity === 0 ? 'Out of Stock' : `Add to Cart (${quantity} item${quantity !== 1 ? 's' : ''})`}
                   </Button>

                  {selectedProduct.features.length > 0 && <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.features.map((feature, index) => <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>)}
                      </div>
                    </div>}

                  {selectedProduct.colors.length > 0 && <div>
                      <h4 className="font-medium mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.colors.map((color, index) => <Badge key={index} variant="secondary" className="text-xs">
                            {color}
                          </Badge>)}
                      </div>
                    </div>}
                </div>
              </div>
            </>}
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
                <Button>Get Sizing Help</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Products;