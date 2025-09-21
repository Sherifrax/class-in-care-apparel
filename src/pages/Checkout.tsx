import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodsInfo from '@/components/PaymentMethodsInfo';

const CheckoutContent = () => {
  const { items, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-4">
              Add some items to your cart first
            </p>
            <Button onClick={() => navigate('/products')}>
              Shop Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  
  const handleProceedToCheckout = async () => {
    setLoading(true);

    try {
      // Check stock availability before redirecting to payment
      for (const item of items) {
        const { data: product, error } = await supabase
          .from('products')
          .select('stock_quantity, track_stock, name')
          .eq('id', item.product_id || item.id)
          .single();

        if (error) {
          throw new Error(`Failed to check stock for ${item.product.name}`);
        }

        if (product?.track_stock && product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock_quantity} items available.`);
        }
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          currency: 'aed',
          cart_items: items
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Open Stripe checkout in the same window
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Info */}
            <div className="space-y-6">
              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-green-800">
                    <ShieldCheck className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Secure Payment Processing</h3>
                      <p className="text-sm text-green-700 mt-1">
                        You'll be redirected to Stripe's secure checkout where you can enter your payment and shipping details safely.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proceed to Checkout Button */}
              <Card>
                <CardContent className="p-6">
                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Checking availability...
                      </>
                    ) : (
                      <>
                        Proceed to Secure Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Total: <strong>AED {(getTotalPrice() + 25).toFixed(2)}</strong> (including AED 25.00 delivery)
                  </div>
                </CardContent>
              </Card>
              
              <PaymentMethodsInfo />
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          AED {(parseFloat(item.product.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>AED {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>AED 25.00</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>AED {(getTotalPrice() + 25).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
};

export default Checkout;