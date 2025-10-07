import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useEnhancedToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        toast.error(
          "Session Error",
          "Failed to get session"
        );
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Only show sign out message, as sign in messages will be handled by the sign in functions
      if (event === 'SIGNED_OUT') {
        toast.logout(
          "See you soon!",
          "You've been signed out successfully."
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://auramedical.store/',
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(
        "Sign Up Failed",
        error.message
      );
      throw error;
    }

    if (data.user && !data.session) {
      toast.signup(
        "Welcome to AURA!",
        "We've sent you a confirmation link to complete your registration."
      );
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(
        "Sign In Failed",
        error.message
      );
      throw error;
    }

    // Show success message only for actual sign in actions
    toast.login(
      "Welcome back!",
      "You've successfully signed in to AURA."
    );
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(
        "Sign Out Failed",
        error.message
      );
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    // Always send users to the live domain reset page to avoid preview URL redirects
    const redirectUrl = 'https://auramedical.store/reset-password';
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast.error(
        "Reset Password Failed",
        error.message
      );
      throw error;
    }

    toast.info(
      "Check your email",
      "We've sent you a password reset link."
    );
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 