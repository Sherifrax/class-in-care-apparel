import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Heart, Plus, Minus, ShoppingCart, X, Truck, Shield, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import InteractiveImageGallery from './InteractiveImageGallery';
import AnimatedQuantitySelector from './AnimatedQuantitySelector';

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

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
}

const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  selectedSize,
  onSizeChange,
  quantity,
  onQuantityChange,
  onAddToCart,
  isFavorite,
  onToggleFavorite
}: ProductDetailModalProps) => {
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!product) return null;

  const getStockStatus = () => {
    if (!product.track_stock) return { status: 'In Stock', className: 'text-green-600', bgColor: 'bg-green-100' };
    if (product.stock_quantity === 0) return { status: 'Out of Stock', className: 'text-red-600', bgColor: 'bg-red-100' };
    if (product.stock_quantity <= product.low_stock_threshold) return { status: `Only ${product.stock_quantity} left`, className: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'In Stock', className: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockInfo = getStockStatus();
  const isOutOfStock = stockInfo.status === 'Out of Stock';

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white/95 backdrop-blur-xl border border-white/20">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <InteractiveImageGallery
                images={product.images && product.images.length > 0 ? product.images : [product.image]}
                productName={product.name}
              />
              
              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <h4 className="font-medium text-sm text-foreground mb-3">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs justify-start">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                {product.badge && (
                  <Badge className="mb-3" variant={product.badge === "Best Seller" ? "default" : "secondary"}>
                    {product.badge}
                  </Badge>
                )}
                
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(product.rating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {/* Wishlist Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
                        isFavorite && "text-red-500"
                      )}
                      onClick={(e) => onToggleFavorite(product.id, e)}
                    >
                      <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">{product.price} AED</span>
                {product.original_price && (
                  <span className="text-lg line-through text-muted-foreground">
                    {product.original_price} AED
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium", stockInfo.bgColor)}>
                <div className={cn("w-2 h-2 rounded-full", stockInfo.className.replace('text-', 'bg-'))} />
                <span className={stockInfo.className}>{stockInfo.status}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color</Label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-200",
                          selectedColor === color
                            ? "border-primary shadow-lg scale-110"
                            : "border-gray-300 hover:border-primary/50"
                        )}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Size</Label>
                  <Select value={selectedSize} onValueChange={onSizeChange}>
                    <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border-white/30">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quantity</Label>
                <AnimatedQuantitySelector
                  quantity={quantity}
                  onQuantityChange={onQuantityChange}
                  maxQuantity={product.track_stock ? product.stock_quantity : 99}
                  disabled={isOutOfStock}
                />
              </div>

              {/* Add to Cart Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || !selectedSize}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </motion.div>

              {/* Product Guarantees */}
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Free shipping on orders over 300 AED</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Premium quality guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;