import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBack: () => void;
  onClose: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-3 text-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-glow">
          <img 
            src="/images/aura-logo.jpg" 
            alt="AURA Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm lg:text-base text-muted-foreground">
            {emailSent 
              ? "If an account exists for that email, you'll receive a password reset link shortly. If you didn't request this, you can safely ignore this email."
              : "Enter your email address. If it matches an existing account, we'll send you a reset link."
            }
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="outline"
            className="w-full h-10 sm:h-12 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-medical-blue font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-3 text-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-glow">
          <img 
            src="/images/aura-logo.jpg" 
            alt="AURA Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Reset your password</CardTitle>
          <CardDescription className="text-xs sm:text-sm lg:text-base text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-luxury-navy">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-medical-blue/60 group-focus-within:text-medical-blue transition-colors" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-12 h-10 sm:h-12 border-2 border-medical-blue/20 bg-white/50 backdrop-blur-sm rounded-xl focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 transition-all duration-300 placeholder:text-muted-foreground/60"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </Form>

        <Button
          variant="outline"
          className="w-full h-10 sm:h-12 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-medical-blue font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Button>
      </CardContent>
    </Card>
  );
};