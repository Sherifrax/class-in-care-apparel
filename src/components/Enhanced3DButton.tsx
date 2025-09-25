import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Enhanced3DButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  variant3d?: 'magnetic' | 'tilt' | 'glow';
}

const Enhanced3DButton: React.FC<Enhanced3DButtonProps> = ({ 
  children, 
  className, 
  variant3d = 'magnetic',
  ...props 
}) => {
  const get3DClass = () => {
    switch (variant3d) {
      case 'tilt':
        return 'hover-tilt';
      case 'glow':
        return 'hover-glow';
      default:
        return 'magnetic-hover';
    }
  };

  return (
    <Button 
      className={cn(
        get3DClass(),
        "transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Enhanced3DButton;