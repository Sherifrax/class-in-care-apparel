import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onQuickView: (product: Product) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  index,
  isFavorite,
  onToggleFavorite,
  onQuickView
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "scroll-fade-in group",
        isVisible && "visible"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden interactive-card">
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
          onClick={(e) => onToggleFavorite(product.id, e)}
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
              onClick={() => onQuickView(product)}
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
            onClick={() => onQuickView(product)}
            disabled={product.track_stock && product.stock_quantity === 0}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.track_stock && product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedProductCard;