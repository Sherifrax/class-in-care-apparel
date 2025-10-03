import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ColorSelector } from '@/components/ColorSelector';

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
  track_stock: boolean;
  low_stock_threshold: number;
}

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

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

  const openAddToCartDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setSelectedColor(product.colors[0] || '');
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    // Check stock availability
    if (selectedProduct.track_stock && selectedProduct.stock_quantity < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${selectedProduct.stock_quantity} items available`,
        variant: "destructive",
      });
      return;
    }

    await addToCart(selectedProduct.id, selectedSize, selectedColor || undefined, quantity);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
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
                <span className="text-lg font-bold">AED {product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    AED {product.original_price}
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                {product.sizes.length > 0 && (
                  <p>Sizes: {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</p>
                )}
                {product.colors.length > 0 && (
                  <p>Colors: {product.colors.length} available</p>
                )}
              </div>

              {/* Stock Status */}
              {product.track_stock && (
                <div className="mb-3">
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
                        : 'In Stock'}
                  </span>
                </div>
              )}

              <Button
                className="w-full gap-2 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal"
                onClick={() => openAddToCartDialog(product)}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md glass border-medical-blue/30 backdrop-blur-xl bg-gradient-to-b from-white/95 to-white/90">
          {selectedProduct && (
            <>
              <DialogHeader className="border-b border-medical-blue/20 pb-4">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                  Add to Cart
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Product Preview */}
                <div className="flex gap-4">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-luxury-navy mb-1">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-luxury-navy">AED {selectedProduct.price}</span>
                      {selectedProduct.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          AED {selectedProduct.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <Label htmlFor="size" className="text-base font-semibold">Select Size *</Label>
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

                {/* Color Selection */}
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

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity" className="text-base font-semibold">Quantity</Label>
                  <div className="flex items-center gap-3 mt-2 glass bg-medical-blue/5 rounded-xl p-2 border border-medical-blue/20">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      disabled={quantity <= 1}
                      className="hover:bg-medical-blue/10 rounded-lg h-8 w-8"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center font-bold text-lg">
                      {quantity}
                    </span>
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
                      className="hover:bg-medical-blue/10 rounded-lg h-8 w-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stock Status */}
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

                {/* Add to Cart Button */}
                <Button 
                  className="w-full h-12 text-base bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 rounded-xl font-semibold" 
                  onClick={handleAddToCart}
                  disabled={!selectedSize || (selectedProduct.track_stock && (selectedProduct.stock_quantity === 0 || quantity > selectedProduct.stock_quantity))}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {selectedProduct.track_stock && selectedProduct.stock_quantity === 0 
                    ? 'Out of Stock' 
                    : `Add ${quantity} to Cart`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Favorites;