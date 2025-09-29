import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMagneticHover } from '@/hooks/useAppleScrollAnimation';

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

interface EnhancedProductCardProps {
  product: Product;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const EnhancedProductCard = ({
  product,
  index,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onAddToCart
}: EnhancedProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticHover();

  const getStockStatus = () => {
    if (!product.track_stock) return { status: 'In Stock', className: 'bg-green-500' };
    if (product.stock_quantity === 0) return { status: 'Out of Stock', className: 'bg-red-500' };
    if (product.stock_quantity <= product.low_stock_threshold) return { status: 'Low Stock', className: 'bg-yellow-500' };
    return { status: 'In Stock', className: 'bg-green-500' };
  };

  const stockInfo = getStockStatus();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, amount: 0.1 }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/30">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        
        {/* Badge */}
        {product.badge && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="absolute top-4 left-4 z-20"
          >
            <Badge 
              className={cn(
                "px-3 py-1 text-xs font-medium shadow-lg backdrop-blur-sm",
                product.badge === "Best Seller" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300" 
                  : "bg-white/90 text-primary border-white/50"
              )}
            >
              {product.badge}
            </Badge>
          </motion.div>
        )}

        {/* Stock Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="absolute top-4 right-16 z-20"
        >
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <div className={cn("w-2 h-2 rounded-full", stockInfo.className)} />
            <span className="text-xs font-medium text-gray-700">{stockInfo.status}</span>
          </div>
        </motion.div>

        {/* Wishlist Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-20"
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white",
              isFavorite && "opacity-100 text-red-500"
            )}
            onClick={(e) => onToggleFavorite(product.id, e)}
          >
            <Heart className={cn("w-4 h-4 transition-all", isFavorite && "fill-current scale-110")} />
          </Button>
        </motion.div>

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-64 relative"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
            <img
              src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Action Buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  className="rounded-full bg-white/90 backdrop-blur-sm text-primary hover:bg-white shadow-lg"
                  onClick={() => onQuickView(product)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  onClick={() => onAddToCart(product)}
                  disabled={stockInfo.status === 'Out of Stock'}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
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
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.features.slice(0, 2).map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.features.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="text-xs text-muted-foreground">
                    +{product.colors.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 5).map((size, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                    {size}
                  </Badge>
                ))}
                {product.sizes.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.sizes.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                {product.price} AED
              </span>
              {product.original_price && (
                <span className="text-sm line-through text-muted-foreground">
                  {product.original_price} AED
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedProductCard;