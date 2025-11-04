import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
  const { toast } = useToast();
  const enhancedToast = useEnhancedToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Error",
          description: "Failed to get session",
          variant: "destructive",
        });
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
        enhancedToast.logout("Goodbye!", "You have been signed out successfully.");
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
      enhancedToast.error("Sign Up Failed", error.message);
      throw error;
    }

    if (data.user && !data.session) {
      enhancedToast.signup("Check your email", "We've sent you a confirmation link to complete your registration.");
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      enhancedToast.error("Sign In Failed", error.message);
      throw error;
    }

    // Show success message only for actual sign in actions
    enhancedToast.login("Welcome!", "You have been signed in successfully.");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      enhancedToast.error("Sign Out Failed", error.message);
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
      enhancedToast.error("Reset Password Failed", error.message);
      throw error;
    }

    enhancedToast.info("Check your email", "We've sent you a password reset link.");
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) {
      enhancedToast.error("Error", "You must be logged in to change your password");
      throw new Error("User not authenticated");
    }

    // First verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      enhancedToast.error("Incorrect Password", "The current password you entered is incorrect");
      throw signInError;
    }

    // If current password is correct, update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      enhancedToast.error("Password Update Failed", updateError.message);
      throw updateError;
    }

    // Log the password change in audit log
    try {
      await supabase.rpc('log_profile_access', {
        p_user_id: user.id,
        p_action: 'password_changed',
      });
    } catch (logError) {
      console.error('Failed to log password change:', logError);
    }

    enhancedToast.success("Password Updated", "Your password has been changed successfully");
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};