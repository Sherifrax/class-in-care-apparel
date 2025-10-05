import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart, Heart, LogIn, LogOut, UserPlus } from 'lucide-react';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cart' | 'favorites' | 'login' | 'logout' | 'signup';
  title: string;
  description?: string;
  action?: any;
}

const getIcon = (type: EnhancedToastProps['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertCircle;
    case 'info':
      return Info;
    case 'cart':
      return ShoppingCart;
    case 'favorites':
      return Heart;
    case 'login':
      return LogIn;
    case 'logout':
      return LogOut;
    case 'signup':
      return UserPlus;
    default:
      return Info;
  }
};

const getVariant = (type: EnhancedToastProps['type']) => {
  switch (type) {
    case 'success':
    case 'cart':
    case 'favorites':
    case 'login':
    case 'signup':
      return 'default';
    case 'error':
      return 'destructive';
    case 'warning':
    case 'info':
    case 'logout':
      return 'default';
    default:
      return 'default';
  }
};

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showToast = ({ type, title, description, action }: EnhancedToastProps) => {
    const Icon = getIcon(type);
    const variant = getVariant(type);

    toast({
      variant: variant as "default" | "destructive",
      title: (
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </div>
      ) as any,
      description,
      action,
      duration: type === 'error' ? 3000 : 2000,
    });
  };

  return {
    success: (title: string, description?: string, action?: any) =>
      showToast({ type: 'success', title, description, action }),
    error: (title: string, description?: string, action?: any) =>
      showToast({ type: 'error', title, description, action }),
    warning: (title: string, description?: string, action?: any) =>
      showToast({ type: 'warning', title, description, action }),
    info: (title: string, description?: string, action?: any) =>
      showToast({ type: 'info', title, description, action }),
    cart: (title: string, description?: string, action?: any) =>
      showToast({ type: 'cart', title, description, action }),
    favorites: (title: string, description?: string, action?: any) =>
      showToast({ type: 'favorites', title, description, action }),
    login: (title: string, description?: string, action?: any) =>
      showToast({ type: 'login', title, description, action }),
    logout: (title: string, description?: string, action?: any) =>
      showToast({ type: 'logout', title, description, action }),
    signup: (title: string, description?: string, action?: any) =>
      showToast({ type: 'signup', title, description, action }),
  };
};