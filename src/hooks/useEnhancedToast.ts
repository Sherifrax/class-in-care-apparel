import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart, LogIn, LogOut, Heart, Package, CreditCard } from "lucide-react";
import React from 'react';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cart' | 'login' | 'logout' | 'favorite' | 'order' | 'payment';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getIcon = (type: EnhancedToastProps['type']) => {
  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    cart: ShoppingCart,
    login: LogIn,
    logout: LogOut,
    favorite: Heart,
    order: Package,
    payment: CreditCard,
  };
  return iconMap[type];
};

export const useEnhancedToast = () => {
  const showToast = ({ type, title, description, action }: EnhancedToastProps) => {
    const Icon = getIcon(type);
    
    const toastOptions: any = {
      description,
      duration: type === 'error' ? 3000 : 2000,
      icon: React.createElement(Icon, { className: "h-5 w-5" }),
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    };

    if (type === 'error') {
      toast.error(title, toastOptions);
    } else if (type === 'success') {
      toast.success(title, toastOptions);
    } else if (type === 'warning') {
      toast.warning(title, toastOptions);
    } else {
      toast(title, toastOptions);
    }
  };

  return {
    success: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'success', title, description, action }),
    error: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'error', title, description, action }),
    info: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'info', title, description, action }),
    warning: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'warning', title, description, action }),
    cart: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'cart', title, description, action }),
    login: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'login', title, description, action }),
    logout: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'logout', title, description, action }),
    favorite: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'favorite', title, description, action }),
    order: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'order', title, description, action }),
    payment: (title: string, description?: string, action?: EnhancedToastProps['action']) => 
      showToast({ type: 'payment', title, description, action }),
  };
};
