import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onToggleMode, onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-blue to-medical-teal p-4 shadow-glow">
          <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-white/80"></div>
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Sign in to access your AURA account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-blue/60 group-focus-within:text-medical-blue transition-colors" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-12 h-12 border-2 border-medical-blue/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 transition-all duration-300 placeholder:text-muted-foreground/60"
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-blue/60 group-focus-within:text-medical-blue transition-colors" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-12 border-2 border-medical-blue/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 transition-all duration-300 placeholder:text-muted-foreground/60"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-medical-blue/10 rounded-lg transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-medical-blue/70" />
                        ) : (
                          <Eye className="h-4 w-4 text-medical-blue/70" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 font-medium text-medical-blue hover:text-medical-blue-light transition-colors"
                onClick={onForgotPassword}
                disabled={loading}
              >
                Forgot your password?
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-medical-blue/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-muted-foreground font-medium">
              New to AURA?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-medical-blue font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={onToggleMode}
          disabled={loading}
        >
          Create an account
        </Button>
      </CardContent>
    </Card>
  );
}; 