import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const toast = useEnhancedToast();
  const queryClient = useQueryClient();

  // Fetch favorites
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Add to favorites mutation
  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, product_id: productId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast.favorites("Added to Favorites", "Product has been added to your favorites.");
    },
    onError: (error: any) => {
      console.error('Error adding to favorites:', error);
      toast.error("Error", "Failed to add product to favorites.");
    },
  });

  // Remove from favorites mutation
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast.favorites("Removed from Favorites", "Product has been removed from your favorites.");
    },
    onError: (error: any) => {
      console.error('Error removing from favorites:', error);
      toast.error("Error", "Failed to remove product from favorites.");
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const addToFavorites = async (productId: string) => {
    if (!user) {
      toast.error("Authentication Required", "Please sign in to add items to favorites.");
      return;
    }
    await addMutation.mutateAsync(productId);
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;
    await removeMutation.mutateAsync(productId);
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId);
  };

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};