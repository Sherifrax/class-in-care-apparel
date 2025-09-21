import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, ShoppingBag, Clock } from 'lucide-react';

const PaymentMethodsInfo = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Accepted Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Visa, Mastercard, Amex</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Apple Pay & Google Pay</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm">Stripe Link (One-click checkout)</span>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>UAE Customers:</strong> All major cards accepted with instant mobile payments through Apple Pay & Google Pay.
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground">
          All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsInfo;