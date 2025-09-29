import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AuroraCollection from "@/components/AuroraCollection";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import GlassmorphismFilter from "@/components/GlassmorphismFilter";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import AppleStyleSection from "@/components/AppleStyleSection";
import FloatingElements from "@/components/FloatingElements";

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
    // Category filter
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

  // Helper functions
  const getFilterKey = (filterGroupName: string) => {
    switch (filterGroupName.toLowerCase()) {
      case 'size': return 'sizes';
      case 'color': return 'colors';
      case 'features': return 'features';
      case 'price range': return 'priceRange';
      default: return filterGroupName.toLowerCase();
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      sizes: [],
      colors: [],
      features: [],
      priceRange: null,
    });
    setSelectedCategory('All Collections');
  };

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

  const hasActiveFilters = (selectedCategory !== null && selectedCategory !== 'All Collections') || 
    selectedFilters.sizes.length > 0 || 
    selectedFilters.colors.length > 0 || 
    selectedFilters.features.length > 0 || 
    selectedFilters.priceRange !== null;

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setQuantity(1);
  };

  const handleQuickAddToCart = async (product: Product) => {
    if (!product.sizes || product.sizes.length === 0) {
      await addToCart(product.id, '', 1);
    } else {
      openProductDialog(product);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;
    
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
    e.stopPropagation();
    
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  // Get unique filter options
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

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingElements />
      <AuroraCollection />
      
      {/* Modern Filter Bar */}
      <AppleStyleSection className="py-4 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-20 z-40 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && <Badge variant="secondary" className="text-xs">Active</Badge>}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} products
            </div>
          </div>
        </div>
      </AppleStyleSection>

      {/* Glassmorphism Filter Panel */}
      {showFilters && (
        <section className="py-6 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl border-b border-white/20">
          <div className="container mx-auto px-4 sm:px-6">
            <GlassmorphismFilter
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilterOption}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </section>
      )}
      
      {/* Enhanced Products Grid */}
      <AppleStyleSection className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Shop the <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AURA Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Premium medical uniforms for modern healthcare professionals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <EnhancedProductCard
                key={product.id}
                product={product}
                index={index}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onQuickView={openProductDialog}
                onAddToCart={handleQuickAddToCart}
              />
            ))}
          </div>
        </div>
      </AppleStyleSection>

      {/* Enhanced Product Dialog */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default Products;