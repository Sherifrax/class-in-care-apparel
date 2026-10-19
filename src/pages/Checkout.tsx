import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Truck, Zap, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSizeGuide } from '@/contexts/SizeGuideContext';
import PaymentMethodsInfo from '@/components/PaymentMethodsInfo';
import ProductImage from '@/components/ProductImage';

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
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  const [sizeGuideConfirmed, setSizeGuideConfirmed] = useState(false);
  const [embroideryRequested, setEmbroideryRequested] = useState(false);
  const [embroideryDetails, setEmbroideryDetails] = useState('');
  const [expressShipping, setExpressShipping] = useState(false);
  const { openSizeGuide } = useSizeGuide();

  const STANDARD_SHIPPING = 25;
  const EXPRESS_SHIPPING = 50;
  const EMBROIDERY_COST = 25;

  const shippingCost = expressShipping ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
  const embroideryCost = embroideryRequested ? EMBROIDERY_COST : 0;
  const finalTotal = getTotalPrice() + shippingCost + embroideryCost;
  
  const handleProceedToCheckout = async () => {
    if (embroideryRequested && !embroideryDetails.trim()) {
      toast({ title: "Embroidery Details Required", description: "Please enter the text you'd like embroidered.", variant: "destructive" });
      return;
    }

    if (!shippingConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm you will pay for shipping to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!sizeGuideConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm you have selected sizes according to our size guide.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      for (const item of items) {
        const { data: isAvailable, error: stockError } = await supabase.rpc('check_stock_availability', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (stockError) throw stockError;
        if (!isAvailable) {
          throw new Error(`${item.product.name} is out of stock or does not have enough quantity available.`);
        }
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          currency: 'AED',
          cart_items: items,
          shipping_cost: shippingCost,
          embroidery_requested: embroideryRequested,
          embroidery_details: embroideryRequested ? embroideryDetails.trim() : null,
          express_shipping: expressShipping
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || "Payment checkout could not be started.");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate checkout. Please try again.",
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
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-blue-900">
                    <CreditCard className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Secure Stripe Checkout (Sandbox)</h3>
                      <p className="text-sm text-blue-800 mt-1">You’ll complete your test payment on Stripe’s secure checkout page. Sandbox payments do not charge a real card.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pre-Checkout Confirmations */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Confirmations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Shipping Confirmation */}
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="shipping-confirm" 
                      checked={shippingConfirmed}
                      onCheckedChange={(checked) => setShippingConfirmed(checked as boolean)}
                    />
                    <label htmlFor="shipping-confirm" className="text-sm cursor-pointer">
                      I confirm I will pay for shipping (AED {shippingCost.toFixed(2)} {expressShipping ? 'express' : 'standard'})
                    </label>
                  </div>

                  {/* Size Guide Confirmation */}
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="size-confirm" 
                      checked={sizeGuideConfirmed}
                      onCheckedChange={(checked) => setSizeGuideConfirmed(checked as boolean)}
                    />
                    <label htmlFor="size-confirm" className="text-sm cursor-pointer">
                      I confirm I have selected my product according to the{' '}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openSizeGuide();
                        }}
                        className="text-primary underline hover:text-primary/80"
                      >
                        size guide
                      </button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping & Customization Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Express Shipping */}
                  <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="express-shipping" 
                        checked={expressShipping}
                        onCheckedChange={(checked) => setExpressShipping(checked as boolean)}
                      />
                      <div className="flex-1">
                        <label htmlFor="express-shipping" className="font-medium cursor-pointer flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          Express Shipping (+AED 50.00)
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get your order in 3 business days instead of 5-7 days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Embroidery */}
                  <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="embroidery" 
                        checked={embroideryRequested}
                        onCheckedChange={(checked) => {
                          setEmbroideryRequested(checked as boolean);
                          if (!checked) setEmbroideryDetails('');
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor="embroidery" className="font-medium cursor-pointer">
                          Custom Embroidery (+AED 25.00)
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add your name or custom text to your scrubs
                        </p>
                        
                        {embroideryRequested && (
                          <div className="mt-3">
                            <Input
                              placeholder="Enter text (max 20 characters)"
                              value={embroideryDetails}
                              onChange={(e) => setEmbroideryDetails(e.target.value)}
                              maxLength={20}
                              className="text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {embroideryDetails.length}/20 characters
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proceed to Checkout Button */}
              <Card>
                <CardContent className="p-6">
                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal" 
                    size="lg"
                    disabled={loading || !shippingConfirmed || !sizeGuideConfirmed}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Continue to Secure Payment
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Total: <strong>AED {finalTotal.toFixed(2)}</strong>
                  </div>
                  
                  {(!shippingConfirmed || !sizeGuideConfirmed) && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Please confirm all required items above to proceed
                    </p>
                  )}
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
                        <ProductImage
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
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        {expressShipping ? <Zap className="w-3 h-3 text-yellow-600" /> : <Truck className="w-3 h-3" />}
                        Delivery {expressShipping ? '(Express)' : '(Standard)'}:
                      </span>
                      <span>AED {shippingCost.toFixed(2)}</span>
                    </div>
                    {embroideryRequested && (
                      <div className="flex justify-between">
                        <span>Custom Embroidery:</span>
                        <span>AED {EMBROIDERY_COST.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>AED {finalTotal.toFixed(2)}</span>
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
