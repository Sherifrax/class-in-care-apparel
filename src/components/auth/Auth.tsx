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
      <DialogContent className="w-[95vw] max-w-md sm:w-full border-0 p-0 max-h-[95vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl shadow-[0_8px_40px_rgb(0,0,0,0.12)] border border-medical-blue/20" showCloseButton={false}>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-medical-blue/5 via-transparent to-medical-teal/5 pointer-events-none" />
        <div className="relative z-10">
          {mode === 'signin' && (
            <SignIn 
              onToggleMode={handleToggleMode} 
              onForgotPassword={handleForgotPassword}
              onClose={onClose}
            />
          )}
          {mode === 'signup' && (
            <SignUp onToggleMode={handleToggleMode} onClose={onClose} />
          )}
          {mode === 'forgot-password' && (
            <ForgotPassword onBack={handleBackToSignIn} onClose={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 