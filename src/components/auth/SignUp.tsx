import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpProps {
  onToggleMode: () => void;
  onClose: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onToggleMode, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    setAnimateLogo(true);
  }, []);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose(); // Close the dialog after successful sign up
      }, 3000);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent relative overflow-hidden">
      {/* Custom close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 rounded-full opacity-70 ring-offset-background transition-all duration-300 hover:opacity-100 hover:bg-medical-teal/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-medical-teal focus:ring-offset-2 disabled:pointer-events-none p-2"
        aria-label="Close"
      >
        <svg className="h-5 w-5 text-luxury-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Enhanced animated background with mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-teal/10 via-accent-purple/5 to-medical-blue/10 opacity-50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(var(--medical-teal),0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(var(--accent-purple),0.08),transparent_50%)]"></div>
      
      {/* Enhanced floating particles with glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 right-12 w-3 h-3 bg-medical-teal/30 rounded-full blur-sm animate-bounce shadow-[0_0_15px_rgba(var(--medical-teal),0.5)]" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-16 left-12 w-2 h-2 bg-accent-purple/40 rounded-full blur-sm animate-bounce shadow-[0_0_10px_rgba(var(--accent-purple),0.5)]" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-16 right-8 w-2.5 h-2.5 bg-medical-blue/30 rounded-full blur-sm animate-bounce shadow-[0_0_12px_rgba(var(--medical-blue),0.5)]" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-24 left-8 w-1.5 h-1.5 bg-medical-teal/25 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
      </div>

      <CardHeader className="space-y-4 text-center px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(var(--medical-teal),0.3)] ring-4 ring-white/50 transition-all duration-1000 ${animateLogo ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
          <img 
            src="/images/aura-logo.jpg" 
            alt="AURA Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 sm:space-y-3">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-medical-teal via-accent-purple to-medical-blue bg-clip-text text-transparent animate-fade-in flex items-center justify-center gap-2">
            Join AURA
            <Sparkles className="inline-block w-6 h-6 text-medical-teal animate-pulse" />
          </CardTitle>
          <CardDescription className="text-sm sm:text-base lg:text-lg text-luxury-navy/70 font-medium animate-fade-in-delay">
            Create your account and discover premium medical apparel
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-teal/60 group-focus-within:text-medical-teal transition-colors" />
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="pl-12 h-10 sm:h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60 text-sm sm:text-base"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-teal/60 group-focus-within:text-medical-teal transition-colors" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-12 h-10 sm:h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60 text-sm sm:text-base"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-teal/60 group-focus-within:text-medical-teal transition-colors" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        className="pl-12 pr-12 h-10 sm:h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60 text-sm sm:text-base"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-medical-teal/10 rounded-lg transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-medical-teal/70" />
                        ) : (
                          <Eye className="h-4 w-4 text-medical-teal/70" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-teal/60 group-focus-within:text-medical-teal transition-colors" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-12 pr-12 h-10 sm:h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60 text-sm sm:text-base"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-medical-teal/10 rounded-lg transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-medical-teal/70" />
                        ) : (
                          <Eye className="h-4 w-4 text-medical-teal/70" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                className={`w-full h-12 sm:h-14 bg-gradient-to-r from-medical-teal via-accent-purple to-medical-blue hover:from-medical-teal-light hover:via-accent-purple-light hover:to-medical-blue-light text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(var(--medical-teal),0.4)] hover:shadow-[0_8px_30px_rgba(var(--accent-purple),0.5)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 text-sm sm:text-base relative overflow-hidden ${isSuccess ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <CheckCircle className="w-5 h-5" />
                    <Star className="w-4 h-4" />
                    Welcome to AURA!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
                
                {/* Success animation overlay */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 animate-ping"></div>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-medical-teal/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-muted-foreground font-medium">
              Already have an account?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-10 sm:h-12 border-2 border-medical-teal/30 hover:border-medical-teal hover:bg-medical-teal/5 text-medical-teal font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
          onClick={onToggleMode}
          disabled={loading}
        >
          Sign in instead
        </Button>
      </CardContent>
    </Card>
  );
}; 