import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowRight, Truck, Zap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSizeGuide } from '@/contexts/SizeGuideContext';
import PaymentMethodsInfo from '@/components/PaymentMethodsInfo';
import BankTransferInfo from '@/components/BankTransferInfo';

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

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street1: '',
    street2: '',
    city: '',
    emirate: '',
    country: 'United Arab Emirates'
  });

  const STANDARD_SHIPPING = 25;
  const EXPRESS_SHIPPING = 50;
  const EMBROIDERY_COST = 25;

  const shippingCost = expressShipping ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
  const embroideryCost = embroideryRequested ? EMBROIDERY_COST : 0;
  const finalTotal = getTotalPrice() + shippingCost + embroideryCost;
  
  // STRIPE PAYMENT - TEMPORARILY DISABLED
  // Keeping this code intact for easy re-enablement once Stripe documents are approved
  /*
  const handleProceedToCheckout = async () => {
    if (!shippingConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that your shipping address is correct.",
        variant: "destructive",
      });
      return;
    }

    if (!sizeGuideConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you have reviewed the size guide.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      for (const item of items) {
        const { data: isAvailable } = await supabase.rpc('check_stock_availability', {
          p_product_id: item.product_id,
          p_quantity: item.quantity
        });

        if (!isAvailable) {
          throw new Error(`${item.name} is currently out of stock or doesn't have sufficient quantity available.`);
        }
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          currency: 'AED',
          cartItems: items,
          subtotal: getTotalPrice(),
          deliveryCost: shippingCost,
          embroideryCost: embroideryCost,
          embroideryRequested,
          embroideryDetails,
          expressShipping,
          totalAmount: finalTotal
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
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
  */

  // BANK TRANSFER PAYMENT - TEMPORARY IMPLEMENTATION
  const handleProceedToCheckout = async () => {
    // Validate shipping address
    if (!shippingAddress.fullName.trim()) {
      toast({
        title: "Shipping Address Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.phone.trim()) {
      toast({
        title: "Contact Number Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    // Validate UAE phone format
    const phoneRegex = /^(\+971|00971|0)?[1-9][0-9]{7,8}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/[\s-]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid UAE phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.street1.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your street address.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter your city.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.emirate.trim()) {
      toast({
        title: "Emirate Required",
        description: "Please select your emirate.",
        variant: "destructive",
      });
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

    if (embroideryRequested && embroideryDetails.trim().length === 0) {
      toast({
        title: "Embroidery Details Required",
        description: "Please enter the text you'd like embroidered.",
        variant: "destructive",
      });
      return;
    }

    if (embroideryRequested && embroideryDetails.trim().length > 20) {
      toast({
        title: "Embroidery Text Too Long",
        description: "Embroidery text must be 20 characters or less.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check stock availability
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

      // Create bank transfer order
      const { data, error } = await supabase.functions.invoke('create-bank-transfer-order', {
        body: {
          cartItems: items.map(item => ({
            product_id: item.product_id || item.id,
            name: item.product.name,
            price: item.product.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          })),
          subtotal: getTotalPrice(),
          deliveryCost: shippingCost,
          embroideryCost: embroideryCost,
          embroideryRequested,
          embroideryDetails: embroideryRequested ? embroideryDetails.trim() : null,
          expressShipping,
          totalAmount: finalTotal,
          currency: 'AED',
          shippingAddress: {
            full_name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            street_address_1: shippingAddress.street1,
            street_address_2: shippingAddress.street2,
            city: shippingAddress.city,
            emirate: shippingAddress.emirate,
            country: shippingAddress.country
          }
        }
      });

      if (error) throw error;

      // Navigate to success page with order details
      navigate(`/payment-success?order_id=${data.order_id}&payment_method=bank_transfer`);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create order. Please try again.",
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
              {/* Shipping Address Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        placeholder="+971 XX XXX XXXX"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="street1" className="text-sm font-medium mb-2 block">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="street1"
                      placeholder="House/Flat number, Street name"
                      value={shippingAddress.street1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street1: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="street2" className="text-sm font-medium mb-2 block">
                      Apartment, suite, etc. (optional)
                    </label>
                    <Input
                      id="street2"
                      placeholder="Additional address details"
                      value={shippingAddress.street2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street2: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="text-sm font-medium mb-2 block">
                        City <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="city"
                        placeholder="e.g., Dubai, Abu Dhabi"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="emirate" className="text-sm font-medium mb-2 block">
                        Emirate <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="emirate"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={shippingAddress.emirate}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, emirate: e.target.value })}
                        required
                      >
                        <option value="">Select Emirate</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Umm Al Quwain">Umm Al Quwain</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                        <option value="Fujairah">Fujairah</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="text-sm font-medium mb-2 block">
                      Country
                    </label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bank Transfer Notice */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-amber-800">
                    <Building2 className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Bank Transfer Payment</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        After placing your order, you'll receive bank account details to complete your payment. Your order will be processed once we confirm the transfer.
                      </p>
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
                        <Building2 className="w-4 h-4 mr-2" />
                        Place Order (Bank Transfer)
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
              
              {/* Bank Transfer Details Preview */}
              <BankTransferInfo />
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