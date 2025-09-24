import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

export const Auth: React.FC<AuthProps> = ({ isOpen, onClose, defaultMode = 'signin' }) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleForgotPassword = () => {
    setMode('forgot-password');
  };

  const handleBackToSignIn = () => {
    setMode('signin');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:w-full border-0 p-0 max-h-[95vh] overflow-y-auto">
        {mode === 'signin' && (
          <SignIn 
            onToggleMode={handleToggleMode} 
            onForgotPassword={handleForgotPassword}
          />
        )}
        {mode === 'signup' && (
          <SignUp onToggleMode={handleToggleMode} />
        )}
        {mode === 'forgot-password' && (
          <ForgotPassword onBack={handleBackToSignIn} />
        )}
      </DialogContent>
    </Dialog>
  );
}; 