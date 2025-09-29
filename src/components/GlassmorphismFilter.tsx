import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  name: string;
  options: string[];
}

interface SelectedFilters {
  sizes: string[];
  colors: string[];
  features: string[];
  priceRange: string | null;
}

interface GlassmorphismFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: FilterOption[];
  selectedFilters: SelectedFilters;
  onToggleFilter: (filterGroupName: string, option: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const GlassmorphismFilter = ({
  isOpen,
  onClose,
  filterOptions,
  selectedFilters,
  onToggleFilter,
  onClearFilters,
  hasActiveFilters
}: GlassmorphismFilterProps) => {
  const getFilterKey = (filterGroupName: string) => {
    switch (filterGroupName.toLowerCase()) {
      case 'size': return 'sizes';
      case 'color': return 'colors';
      case 'features': return 'features';
      case 'price range': return 'priceRange';
      default: return filterGroupName.toLowerCase();
    }
  };

  const getActiveFilterCount = () => {
    return selectedFilters.sizes.length + 
           selectedFilters.colors.length + 
           selectedFilters.features.length + 
           (selectedFilters.priceRange ? 1 : 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.6
            }}
            className={cn(
              "fixed top-0 left-0 h-full w-80 z-50 lg:relative lg:w-full lg:h-auto",
              "bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl",
              "lg:bg-white/70 lg:backdrop-blur-md lg:border lg:border-white/30 lg:rounded-2xl lg:shadow-lg"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Filter className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <p className="text-sm text-muted-foreground">
                      {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Clear All Button */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </motion.div>
                )}
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              {filterOptions.map((filterGroup, groupIndex) => (
                <motion.div
                  key={filterGroup.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 + 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    {filterGroup.name}
                    {(() => {
                      const filterKey = getFilterKey(filterGroup.name);
                      const count = filterKey === 'priceRange' 
                        ? (selectedFilters.priceRange ? 1 : 0)
                        : (selectedFilters[filterKey as keyof SelectedFilters] as string[] || []).length;
                      return count > 0 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {count}
                        </Badge>
                      );
                    })()}
                  </h4>
                  
                  <div className="space-y-3">
                    {filterGroup.options.map((option, optionIndex) => {
                      const filterKey = getFilterKey(filterGroup.name);
                      const isSelected = filterKey === 'priceRange' 
                        ? selectedFilters.priceRange === option
                        : (selectedFilters[filterKey as keyof SelectedFilters] as string[] || []).includes(option);
                      
                      return (
                        <motion.div
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: groupIndex * 0.1 + optionIndex * 0.05 + 0.4 }}
                        >
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type={filterGroup.name === 'Price Range' ? 'radio' : 'checkbox'}
                                name={filterGroup.name === 'Price Range' ? 'priceRange' : undefined}
                                checked={isSelected}
                                onChange={() => onToggleFilter(filterGroup.name, option)}
                                className="sr-only"
                              />
                              <div className={cn(
                                "w-5 h-5 rounded-md border-2 transition-all duration-200",
                                "flex items-center justify-center",
                                isSelected
                                  ? "bg-primary border-primary shadow-md shadow-primary/20"
                                  : "border-gray-300 bg-white group-hover:border-primary/50"
                              )}>
                                {isSelected && (
                                  <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </motion.svg>
                                )}
                              </div>
                            </div>
                            
                            <span className={cn(
                              "text-sm transition-colors duration-200",
                              isSelected 
                                ? "text-primary font-medium" 
                                : "text-muted-foreground group-hover:text-foreground"
                            )}>
                              {option}
                            </span>
                            
                            {/* Color Preview for Color Filter */}
                            {filterGroup.name === 'Color' && (
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm ml-auto"
                                style={{ backgroundColor: option.toLowerCase() }}
                              />
                            )}
                          </label>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 border-t border-white/20"
              >
                <h5 className="text-sm font-medium text-foreground mb-3">Active Filters</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.sizes.map((size) => (
                    <Badge
                      key={`size-${size}`}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onToggleFilter('Size', size)}
                    >
                      {size} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  
                  {selectedFilters.colors.map((color) => (
                    <Badge
                      key={`color-${color}`}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onToggleFilter('Color', color)}
                    >
                      {color} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  
                  {selectedFilters.features.map((feature) => (
                    <Badge
                      key={`feature-${feature}`}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onToggleFilter('Features', feature)}
                    >
                      {feature} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  
                  {selectedFilters.priceRange && (
                    <Badge
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onToggleFilter('Price Range', selectedFilters.priceRange!)}
                    >
                      {selectedFilters.priceRange} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassmorphismFilter;