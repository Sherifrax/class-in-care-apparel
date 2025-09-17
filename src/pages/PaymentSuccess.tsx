import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      setSessionId(session_id);
      // Clear the cart after successful payment
      clearCart();
      // Process the payment and create order
      processPayment(session_id);
    }
  }, [searchParams, clearCart]);

  const processPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        console.error('Error processing payment:', error);
      } else {
        console.log('Payment processed successfully:', data);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase! Your order has been confirmed.
            </p>
            
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                Session ID: <span className="font-mono">{sessionId}</span>
              </p>
            )}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">
              What happens next?
            </p>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• Your order will be processed within 24 hours</li>
              <li>• We'll send you tracking information once shipped</li>
              <li>• Delivery typically takes 3-5 business days</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/products')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              Go Home
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;