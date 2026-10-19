import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ShieldCheck } from 'lucide-react';

const PaymentMethodsInfo = () => {
  return (
    <Card className="mt-6 border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
        <CardTitle className="flex items-center gap-2 text-blue-950">
          <CreditCard className="w-5 h-5" />
          Secure card payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              Test checkout is powered by Stripe Sandbox. Use Stripe’s test card details to demonstrate payment; no real charge is made. Bank transfer is currently unavailable.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsInfo;
