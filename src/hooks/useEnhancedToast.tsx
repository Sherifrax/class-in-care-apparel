import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart, Heart, LogIn, LogOut, UserPlus, Package, TrendingUp, Trash2, Edit, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cart' | 'favorites' | 'login' | 'logout' | 'signup' | 'order' | 'update' | 'delete' | 'create';
  title: string;
  description?: string;
  action?: any;
}

const getIcon = (type: EnhancedToastProps['type']) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return XCircle;
    case 'warning': return AlertCircle;
    case 'info': return Info;
    case 'cart': return ShoppingCart;
    case 'favorites': return Heart;
    case 'login': return LogIn;
    case 'logout': return LogOut;
    case 'signup': return UserPlus;
    case 'order': return Package;
    case 'update': return Edit;
    case 'delete': return Trash2;
    case 'create': return Plus;
    default: return Info;
  }
};

const getColorClasses = (type: EnhancedToastProps['type']) => {
  switch (type) {
    case 'success':
    case 'login':
    case 'signup':
    case 'create':
      return {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/30',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
      };
    case 'error':
    case 'delete':
      return {
        bg: 'bg-gradient-to-br from-rose-500/10 to-red-500/10',
        border: 'border-rose-500/30',
        iconBg: 'bg-gradient-to-br from-rose-500 to-red-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]'
      };
    case 'warning':
      return {
        bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/30',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
      };
    case 'cart':
    case 'favorites':
      return {
        bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/30',
        iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
      };
    case 'order':
    case 'update':
      return {
        bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
        border: 'border-blue-500/30',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-500/10 to-slate-500/10',
        border: 'border-gray-500/30',
        iconBg: 'bg-gradient-to-br from-gray-500 to-slate-500',
        iconColor: 'text-white',
        glow: 'shadow-[0_0_20px_rgba(107,114,128,0.3)]'
      };
  }
};

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showToast = ({ type, title, description, action }: EnhancedToastProps) => {
    const Icon = getIcon(type);
    const colors = getColorClasses(type);

    toast({
      title: (
        <div className={cn(
          "flex items-center gap-4 p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300",
          colors.bg,
          colors.border,
          colors.glow,
          "animate-in slide-in-from-top-4 fade-in-0"
        )}>
          <div className={cn(
            "flex-shrink-0 p-2.5 rounded-lg",
            colors.iconBg,
            "animate-in zoom-in-50 duration-500"
          )}>
            <Icon className={cn("h-5 w-5", colors.iconColor)} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-base tracking-tight">{title}</div>
            {description && (
              <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</div>
            )}
          </div>
        </div>
      ) as any,
      variant: type === 'error' || type === 'delete' ? 'destructive' : 'default',
      action,
      duration: 4000,
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
    order: (title: string, description?: string, action?: any) =>
      showToast({ type: 'order', title, description, action }),
    update: (title: string, description?: string, action?: any) =>
      showToast({ type: 'update', title, description, action }),
    delete: (title: string, description?: string, action?: any) =>
      showToast({ type: 'delete', title, description, action }),
    create: (title: string, description?: string, action?: any) =>
      showToast({ type: 'create', title, description, action }),
  };
};