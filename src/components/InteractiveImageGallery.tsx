import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InteractiveImageGalleryProps {
  images: string[];
  productName: string;
}

const InteractiveImageGallery = ({ images, productName }: InteractiveImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {!imageLoaded[currentImageIndex] && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
            <img
              src={images[currentImageIndex]}
              alt={`${productName} - Image ${currentImageIndex + 1}`}
              className={cn(
                "w-full h-full object-cover transition-all duration-700 cursor-zoom-in",
                imageLoaded[currentImageIndex] ? "opacity-100 blur-0" : "opacity-0 blur-lg",
                isZoomed && "scale-150 cursor-zoom-out"
              )}
              onLoad={() => handleImageLoad(currentImageIndex)}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-600">
            <ZoomIn className="w-3 h-3" />
            Click to zoom
          </div>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                currentImageIndex === index
                  ? "border-primary shadow-lg"
                  : "border-gray-200 hover:border-primary/50"
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {currentImageIndex === index && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Image Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentImageIndex === index
                  ? "bg-primary scale-125"
                  : "bg-gray-300 hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveImageGallery;