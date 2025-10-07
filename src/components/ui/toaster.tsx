import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart, Heart, LogIn, LogOut, UserPlus, Sparkles } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  const getIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('cart') || titleLower.includes('added') || titleLower.includes('removed')) {
      return <ShoppingCart className="w-5 h-5 text-medical-blue" />;
    }
    if (titleLower.includes('favorite') || titleLower.includes('heart')) {
      return <Heart className="w-5 h-5 text-pink-600" />;
    }
    if (titleLower.includes('sign in') || titleLower.includes('welcome') || titleLower.includes('login')) {
      return <LogIn className="w-5 h-5 text-green-600" />;
    }
    if (titleLower.includes('sign out') || titleLower.includes('goodbye') || titleLower.includes('logout')) {
      return <LogOut className="w-5 h-5 text-orange-600" />;
    }
    if (titleLower.includes('sign up') || titleLower.includes('account') || titleLower.includes('register')) {
      return <UserPlus className="w-5 h-5 text-purple-600" />;
    }
    if (titleLower.includes('success') || titleLower.includes('successfully')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (titleLower.includes('error') || titleLower.includes('failed')) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    if (titleLower.includes('warning') || titleLower.includes('alert')) {
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
    return <Info className="w-5 h-5 text-blue-600" />;
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="group">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(title as string)}
              </div>
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
