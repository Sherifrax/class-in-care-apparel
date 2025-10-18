import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, Shield, AlertCircle } from 'lucide-react';

const PaymentMethodsInfo = () => {
  return (
    <Card className="mt-6 border-2 border-amber-200 bg-amber-50/50">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Building2 className="w-5 h-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Stripe Temporarily Unavailable Notice */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Card Payments Temporarily Unavailable
              </p>
              <p className="text-sm text-amber-800">
                We're currently processing our payment gateway documentation. Online card payments will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Current Payment Method */}
        <div className="bg-white border-2 border-medical-blue/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-5 h-5 text-medical-blue" />
            <h4 className="font-semibold text-luxury-navy">Bank Transfer (Current Method)</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Please transfer payment to our ADIB bank account. Your order will be processed once payment is confirmed.
          </p>
          <div className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-800">Processing time: 1-2 business days after payment confirmation</span>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Secure Banking:</strong> All bank transfers are processed through ADIB's secure banking system. We'll send you confirmation once payment is received.
            </p>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Card payments (Visa, Mastercard, Apple Pay, Google Pay) will be available once our Stripe integration is fully activated.
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsInfo;