import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cart' | 'favorites' | 'login' | 'logout' | 'signup' | 'order' | 'update' | 'delete' | 'create';
  title: string;
  description?: string;
  action?: any;
}

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showToast = useCallback(({ type, title, description, action }: EnhancedToastProps) => {
    toast({
      title,
      description,
      variant: type === 'error' || type === 'delete' ? 'destructive' : 'default',
      action,
      duration: 4000,
    });
  }, [toast]);

  return {
    success: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'success', title, description, action }), [showToast]),
    error: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'error', title, description, action }), [showToast]),
    warning: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'warning', title, description, action }), [showToast]),
    info: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'info', title, description, action }), [showToast]),
    cart: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'cart', title, description, action }), [showToast]),
    favorites: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'favorites', title, description, action }), [showToast]),
    login: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'login', title, description, action }), [showToast]),
    logout: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'logout', title, description, action }), [showToast]),
    signup: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'signup', title, description, action }), [showToast]),
    order: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'order', title, description, action }), [showToast]),
    update: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'update', title, description, action }), [showToast]),
    delete: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'delete', title, description, action }), [showToast]),
    create: useCallback((title: string, description?: string, action?: any) =>
      showToast({ type: 'create', title, description, action }), [showToast]),
  };
};
