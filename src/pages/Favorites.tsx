import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  original_price?: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
}

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});

  // Fetch product details for favorites
  const { data: favoriteProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['favorite-products', favorites.map(f => f.product_id)],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      
      const productIds = favorites.map(f => f.product_id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (error) {
        console.error('Error fetching favorite products:', error);
        return [];
      }

      return data || [];
    },
    enabled: favorites.length > 0,
  });

  const handleAddToCart = async (product: Product) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0];
    
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, selectedSize, undefined, 1);
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Sign in to view your favorites</h1>
          <p className="text-muted-foreground mt-2">
            Please sign in to see your favorite products.
          </p>
        </div>
      </div>
    );
  }

  if (favoritesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">No favorites yet</h1>
          <p className="text-muted-foreground mt-2">
            Start adding products to your favorites to see them here.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/products'}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">My Favorites</h1>
        <p className="text-muted-foreground text-center mt-2">
          {favoriteProducts.length} product{favoriteProducts.length !== 1 ? 's' : ''} in your favorites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {product.badge}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                onClick={() => removeFromFavorites(product.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
              
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold">{product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.original_price}
                  </span>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Size:</p>
                  <div className="flex gap-1 flex-wrap">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes[product.id] === size ? "default" : "outline"}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => handleSizeSelect(product.id, size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;