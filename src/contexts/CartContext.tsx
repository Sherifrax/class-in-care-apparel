import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

interface CartItem {
  id: string;
  product_id: string;
  size: string;
  color?: string;
  quantity: number;
  product: {
    name: string;
    price: string;
    image: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, size: string, color?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useEnhancedToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(name, price, image)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error("Error", "Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, size: string, color?: string, quantity = 1) => {
    if (!user) {
      toast.error("Sign in required", "Please sign in to add items to your cart");
      return;
    }

    try {
      // Check stock availability before adding to cart
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock_quantity, track_stock, name')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      if (product?.track_stock && product.stock_quantity < quantity) {
        toast.warning("Insufficient stock", `Only ${product.stock_quantity} items available for ${product.name}`);
        return;
      }

      // Normalize color values to null if not provided
      const normalizedColor = color || null;
      
      // Check if item already exists (matching size and color)
      const existingItem = items.find(
        item => item.product_id === productId && item.size === size && (item.color || null) === normalizedColor
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product?.track_stock && product.stock_quantity < newQuantity) {
          toast.warning("Insufficient stock", `Only ${product.stock_quantity} items available for ${product.name}`);
          return;
        }
        await updateQuantity(existingItem.id, newQuantity);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            size,
            color: normalizedColor,
            quantity,
          });

        if (error) throw error;

        toast.cart("Added to cart", "Item added to your cart successfully");

        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Error", "Failed to add item to cart");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error("Error", "Failed to update item quantity");
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.info("Removed from cart", "Item removed from your cart");

      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error("Error", "Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error("Error", "Failed to clear cart");
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Parse price string, removing any non-numeric characters except decimal points
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};