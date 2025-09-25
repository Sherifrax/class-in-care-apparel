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
    priceRange: null as string | null,
  });
  const [showFilters, setShowFilters] = useState(false);
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
      case 'size': return 'sizes';
      case 'color': return 'colors';
      case 'features': return 'features';
      case 'price range': return 'priceRange';
      default: return filterGroupName.toLowerCase();
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
    count: category.name === 'All Collections' 
      ? products.length 
      : products.filter(p => p.product_categories?.name === category.name).length
  }));

  // Get unique filter options from products
  const filterOptions = [
    { 
      name: "Size", 
      options: [...new Set(products.flatMap(p => p.sizes || []))].filter(Boolean).sort()
    },
    { 
      name: "Color", 
      options: [...new Set(products.flatMap(p => p.colors || []))].filter(Boolean).sort()
    },
    { 
      name: "Features", 
      options: [...new Set(products.flatMap(p => p.features || []))].filter(Boolean).sort()
    },
    { 
      name: "Price Range", 
      options: ["Under 200 AED", "200-300 AED", "Over 300 AED"]
    }
  ];

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      sizes: [],
      colors: [],
      features: [],
      priceRange: null,
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
          [filterKey]: (currentArray || []).includes(option)
            ? (currentArray || []).filter(item => item !== option)
            : [...(currentArray || []), option]
        };
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = (selectedCategory !== null && selectedCategory !== 'All Collections') || 
    selectedFilters.sizes.length > 0 || 
    selectedFilters.colors.length > 0 || 
    selectedFilters.features.length > 0 || 
    selectedFilters.priceRange !== null;

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
      
      {/* Optimized Filter Bar */}
      <section className="py-3 bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
              {/* Filter Toggle Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "gap-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/10 transition-all duration-200",
                  hasActiveFilters && "bg-medical-blue/10 border-medical-blue"
                )}
                onClick={() => setShowFilters(!showFilters)}
                disabled={filterOptions.every(group => group.options.length === 0)}
              >
                <Filter className="w-4 h-4 text-medical-blue" />
                <span className="font-medium">Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="text-xs">
                    {[selectedFilters.sizes.length, selectedFilters.colors.length, selectedFilters.features.length, selectedFilters.priceRange ? 1 : 0, (selectedCategory && selectedCategory !== 'All Collections') ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
              
              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              )}
              
              {/* Desktop Category Pills */}
              <div className="hidden md:flex flex-wrap gap-1.5 max-w-full overflow-x-auto no-scrollbar">
                {allCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-all duration-200 rounded-full px-3 py-1.5",
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-sm hover:shadow-md" 
                        : "hover:bg-medical-blue/10 hover:text-medical-blue border-medical-blue/20"
                    )}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name} <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0.5">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Mobile Category Dropdown */}
              <div className="md:hidden w-full">
                <Select value={selectedCategory || "All Collections"} onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-full border-medical-blue/30 hover:border-medical-blue text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white/95 backdrop-blur-md border-medical-blue/20">
                    {allCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results Count - Compact display */}
            <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterOptions.map((filterGroup) => (
                <div key={filterGroup.name} className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">{filterGroup.name}</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                     {filterGroup.options.map((option) => {
                       const filterKey = getFilterKey(filterGroup.name);
                       const isSelected = filterKey === 'priceRange' 
                         ? selectedFilters.priceRange === option
                         : (selectedFilters[filterKey as keyof typeof selectedFilters] as string[] || []).includes(option);
                       
                       return (
                         <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                           <input
                             type={filterGroup.name === 'Price Range' ? 'radio' : 'checkbox'}
                             checked={isSelected}
                             onChange={() => toggleFilterOption(filterGroup.name, option)}
                             className="w-4 h-4 text-medical-blue border-gray-300 rounded focus:ring-medical-blue"
                           />
                           <span className={cn(
                             "text-sm transition-colors",
                             isSelected ? "text-medical-blue font-medium" : "text-muted-foreground group-hover:text-foreground"
                           )}>
                             {option}
                           </span>
                         </label>
                       );
                     })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
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
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group interactive-card relative overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Badge */}
                {product.badge && (
                  <Badge className="absolute top-3 left-3 z-10" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                    {product.badge}
                  </Badge>
                )}
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white hover:scale-110",
                    isFavorite(product.id) && "opacity-100 text-red-500"
                  )}
                  onClick={(e) => handleToggleFavorite(product.id, e)}
                >
                  <Heart className={cn("w-4 h-4", isFavorite(product.id) && "fill-current")} />
                </Button>

                {/* Product Image with Enhanced Hover */}
                <div className="rounded-xl h-56 sm:h-64 mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-500 relative">
                  <img 
                    src={(product.images && product.images.length > 0) ? product.images[0] : product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover-glow"
                  />
                  {product.images && product.images.length > 1 && (
                    <Badge className="absolute top-3 left-3 bg-black/70 text-white animate-pulse">
                      +{product.images.length - 1} more
                    </Badge>
                  )}
                  
                  {/* Enhanced Quick View Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                    <Button
                      size="sm"
                      className="bg-white/90 text-black hover:bg-white transition-all duration-300 hover:scale-105 magnetic-hover"
                      onClick={() => openProductDialog(product)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg group-hover:text-medical-blue transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-4 h-4 transition-colors",
                            i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  {product.track_stock && product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      Only {product.stock_quantity} left!
                    </Badge>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <span className="text-xl font-bold text-luxury-navy">AED {product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">AED {product.original_price}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-2 text-xs magnetic-hover hover-lift"
                    onClick={() => openProductDialog(product)}
                    disabled={product.track_stock && product.stock_quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.track_stock && product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-2xl p-8 text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-luxury-navy mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the perfect uniform for your specific needs. 
              Get personalized recommendations from our experts.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact">
                <Button size="lg">Contact Our Experts</Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">Learn About Features</Button>
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
                        {selectedProduct.images.slice(1).map((image, i) => (
                          <img
                            key={i}
                            src={image}
                            alt={`${selectedProduct.name} view ${i + 2}`}
                            className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">{selectedProduct.description}</p>
                    <div className="flex items-center gap-1 text-sm mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < selectedProduct.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-luxury-navy">AED {selectedProduct.price}</span>
                      {selectedProduct.original_price && (
                        <span className="text-lg text-muted-foreground line-through">AED {selectedProduct.original_price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.sizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleAddToCart}
                      disabled={!selectedSize || (selectedProduct.track_stock && selectedProduct.stock_quantity === 0)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {selectedProduct.track_stock && selectedProduct.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleToggleFavorite(selectedProduct.id, e)}
                    >
                      <Heart className={cn("w-4 h-4", isFavorite(selectedProduct.id) && "fill-current text-red-500")} />
                    </Button>
                  </div>
                  
                  {selectedProduct.track_stock && selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold && selectedProduct.stock_quantity > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Only {selectedProduct.stock_quantity} left in stock!
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Size Guide Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-luxury-navy mb-4">Size Guide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing guide for all AURA medical uniforms.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Chest (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Waist (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Hip (inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['XS', '32-34', '26-28', '34-36', '25'],
                    ['S', '34-36', '28-30', '36-38', '26'],
                    ['M', '36-38', '30-32', '38-40', '27'],
                    ['L', '38-40', '32-34', '40-42', '28'],
                    ['XL', '40-42', '34-36', '42-44', '29'],
                    ['XXL', '42-44', '36-38', '44-46', '30'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{row[0]}</td>
                      <td className="py-3 px-4">{row[1]}</td>
                      <td className="py-3 px-4">{row[2]}</td>
                      <td className="py-3 px-4">{row[3]}</td>
                      <td className="py-3 px-4">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;