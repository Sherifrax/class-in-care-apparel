import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'text-green-600',
  error: 'text-red-600', 
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showToast = ({ type = 'info', title, description }: Omit<EnhancedToastProps, 'action'>) => {
    const Icon = iconMap[type];
    
    toast({
      title: (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-full",
            type === 'success' && "bg-green-100",
            type === 'error' && "bg-red-100",
            type === 'warning' && "bg-yellow-100", 
            type === 'info' && "bg-blue-100"
          )}>
            <Icon className={cn("h-5 w-5", colorMap[type])} />
          </div>
          <span className="font-bold text-foreground">{title}</span>
        </div>
      ) as any,
      description: description && (
        <div className="mt-2 ml-11 text-sm text-muted-foreground">
          {description}
        </div>
      ) as any,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  return {
    success: (title: string, description?: string) => 
      showToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => 
      showToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) => 
      showToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) => 
      showToast({ type: 'info', title, description }),
  };
};