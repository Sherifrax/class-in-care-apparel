import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
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
}

export const SignUp: React.FC<SignUpProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

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
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in sm:mx-4 mx-2 max-h-[90vh] overflow-y-auto">
      <CardHeader className="space-y-3 text-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-medical-teal to-medical-blue p-3 sm:p-4 shadow-glow">
          <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white to-white/80"></div>
          </div>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">
          Join AURA
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Create your account and discover premium medical apparel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        className="pl-12 h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60"
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
                        className="pl-12 h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60"
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
                        className="pl-12 pr-12 h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60"
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
                        className="pl-12 pr-12 h-12 border-2 border-medical-teal/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 transition-all duration-300 placeholder:text-muted-foreground/60"
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
                className="w-full h-12 bg-gradient-to-r from-medical-teal to-medical-blue hover:from-medical-teal-light hover:to-medical-blue-light text-white font-semibold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
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
          className="w-full h-12 border-2 border-medical-teal/30 hover:border-medical-teal hover:bg-medical-teal/5 text-medical-teal font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={onToggleMode}
          disabled={loading}
        >
          Sign in instead
        </Button>
      </CardContent>
    </Card>
  );
}; 