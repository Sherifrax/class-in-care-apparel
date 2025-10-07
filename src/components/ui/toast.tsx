import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[9999] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border backdrop-blur-md p-6 pr-8 shadow-luxury transition-all duration-500 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=open]:animate-bounce-in",
  {
    variants: {
      variant: {
        default: "border-white/20 bg-gradient-to-r from-white/95 to-white/85 text-foreground shadow-glow backdrop-blur-xl hover:shadow-2xl",
        destructive: "destructive group border-red-200/50 bg-gradient-to-r from-red-50/95 to-red-100/85 text-red-800 shadow-lg backdrop-blur-xl hover:shadow-red-200/50",
        success: "border-green-200/50 bg-gradient-to-r from-green-50/95 to-green-100/85 text-green-800 shadow-lg backdrop-blur-xl hover:shadow-green-200/50",
        info: "border-blue-200/50 bg-gradient-to-r from-blue-50/95 to-blue-100/85 text-blue-800 shadow-lg backdrop-blur-xl hover:shadow-blue-200/50",
        cart: "border-medical-blue/30 bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 text-medical-blue shadow-lg backdrop-blur-xl hover:shadow-medical-blue/20",
        favorites: "border-pink-200/50 bg-gradient-to-r from-pink-50/95 to-rose-100/85 text-pink-800 shadow-lg backdrop-blur-xl hover:shadow-pink-200/50",
        login: "border-green-200/50 bg-gradient-to-r from-green-50/95 to-emerald-100/85 text-green-800 shadow-lg backdrop-blur-xl hover:shadow-green-200/50",
        logout: "border-orange-200/50 bg-gradient-to-r from-orange-50/95 to-amber-100/85 text-orange-800 shadow-lg backdrop-blur-xl hover:shadow-orange-200/50",
        signup: "border-purple-200/50 bg-gradient-to-r from-purple-50/95 to-violet-100/85 text-purple-800 shadow-lg backdrop-blur-xl hover:shadow-purple-200/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-2 text-foreground/60 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white/20 hover:text-foreground group-[.destructive]:text-red-600 hover:text-foreground group-[.destructive]:hover:text-red-700 group-[.destructive]:hover:bg-red-100/30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-medical-blue/20 hover:scale-110",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-base font-bold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-80 mt-1", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};