import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Building2, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import BankTransferInfo from '@/components/BankTransferInfo';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string>('');
  const [expressShipping, setExpressShipping] = useState<boolean>(false);
  const paymentMethod = searchParams.get('payment_method');
  const isBankTransfer = paymentMethod === 'bank_transfer';

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const orderIdParam = searchParams.get('order_id');
    
    // Clear the cart on success
    clearCart();

    if (orderIdParam) {
      setOrderId(orderIdParam);
      // For bank transfer, fetch order details
      if (isBankTransfer) {
        fetchOrderDetails(orderIdParam);
      }
    }

    // Process the completed Stripe Checkout session.
    if (sessionId && !isBankTransfer) {
      processPayment(sessionId);
    }
  }, [searchParams, clearCart, isBankTransfer]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('express_shipping, order_reference')
        .eq('id', orderId)
        .single();

      if (!error && order) {
        setExpressShipping(order.express_shipping || false);
        setOrderReference(order.order_reference || '');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const processPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        console.error('Error processing payment:', error);
        return;
      }

      if (data?.expressShipping !== undefined) {
        setExpressShipping(data.expressShipping);
      }
      
      if (data?.order_id) {
        setOrderId(data.order_id);
        setOrderReference(data.orderReference || '');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full glass border-medical-blue/20 shadow-luxury animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-luxury animate-bounce-in">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
            {isBankTransfer ? "Order Placed Successfully!" : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderId && (
            <div className="bg-gradient-to-br from-medical-blue/5 to-medical-teal/5 rounded-2xl p-4 border border-medical-blue/20 text-center">
              <p className="text-sm text-muted-foreground">Order Reference</p>
              <p className="font-mono text-lg text-luxury-navy font-bold tracking-wider">
                {orderReference || orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          {isBankTransfer && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Complete Your Payment</h4>
                  <p className="text-sm text-amber-800">
                    Please transfer the total amount to complete your order. Your order will be processed once we receive the payment.
                  </p>
                </div>
              </div>
              <BankTransferInfo />
            </div>
          )}
          
          <div className="space-y-4 py-6 border-y border-medical-blue/20">
            <h3 className="text-xl font-semibold text-luxury-navy text-center">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-medical-blue/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-luxury-navy">
                    {isBankTransfer ? "Make Bank Transfer" : "Order Processing"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isBankTransfer 
                      ? "Transfer the amount using the bank details above. Include your order reference in the transfer notes."
                      : "We're preparing your order for shipment"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-medical-blue/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-luxury-navy">
                    {isBankTransfer ? "Payment Verification" : "Shipping Confirmation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isBankTransfer
                      ? "We'll verify your payment within 1-2 business days and send you a confirmation email"
                      : "You'll receive tracking details via email within 24 hours"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border border-medical-blue/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-luxury-navy">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {expressShipping 
                      ? "Express delivery: 2-3 business days (after payment confirmation)" 
                      : "Standard delivery: 5-7 business days (after payment confirmation)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-green-700" />
              <h4 className="font-semibold text-green-900">Questions about your order?</h4>
            </div>
            <p className="text-sm text-green-800 mb-4">
              Contact us on WhatsApp for instant support and order updates
            </p>
            <Button
              onClick={() => window.open(`https://wa.me/971568988436?text=Hello, I'd like to follow up on my order ${orderReference || (orderId ? orderId.slice(0, 8).toUpperCase() : '')}`, '_blank')}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp: +971 56 898 8436
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={() => navigate('/my-orders')}
              variant="outline"
              className="flex-1 h-12 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl"
            >
              <Clock className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="flex-1 h-12 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 rounded-xl"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
