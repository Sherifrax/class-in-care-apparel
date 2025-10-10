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
    <Card className="w-full border-0 shadow-none bg-transparent relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-medical-blue/5 to-medical-teal/10 opacity-50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08),transparent_50%)]"></div>
      
      <CardHeader className="space-y-4 text-center px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(34,197,94,0.3)] ring-4 ring-white/50 animate-scale-in">
          <img 
            src="/images/aura-logo.jpg" 
            alt="AURA Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 sm:space-y-3">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-medical-teal bg-clip-text text-transparent animate-fade-in">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-sm sm:text-base lg:text-lg text-luxury-navy/70 font-medium animate-fade-in-delay">
            We've sent a password reset link to your email address
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8 relative z-10">
          <Button
            variant="outline"
            className="w-full h-12 sm:h-14 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-medical-blue font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none bg-transparent relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/10 via-medical-teal/5 to-accent-purple/10 opacity-50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--medical-blue),0.08),transparent_50%)]"></div>
      
      <CardHeader className="space-y-4 text-center px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(var(--medical-blue),0.3)] ring-4 ring-white/50">
          <img 
            src="/images/aura-logo.jpg" 
            alt="AURA Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 sm:space-y-3">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-accent-purple bg-clip-text text-transparent">Reset Your Password</CardTitle>
          <CardDescription className="text-sm sm:text-base lg:text-lg text-luxury-navy/70 font-medium">
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
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-medical-blue via-medical-teal to-accent-purple hover:from-medical-blue-light hover:via-medical-teal hover:to-accent-purple-light text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(var(--medical-blue),0.4)] hover:shadow-[0_8px_30px_rgba(var(--medical-teal),0.5)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0" 
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