import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Copy, CheckCircle2, CreditCard, Hash, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BankTransferInfo = () => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    cardholderName: "Bayan Hares",
    accountName: "ADIB",
    cardNumber: "4333 6776 0854 5914",
    accountNumber: "28645581",
    iban: "AE510500000000028645581"
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="border-2 border-medical-blue/30 shadow-luxury">
      <CardHeader className="bg-gradient-to-r from-medical-blue/10 to-medical-teal/10">
        <CardTitle className="flex items-center gap-2 text-luxury-navy">
          <Building2 className="w-5 h-5 text-medical-blue" />
          Bank Transfer Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">
            Please transfer the total amount to the following bank account:
          </p>
        </div>

        <div className="space-y-3">
          {/* Cardholder Name */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 flex-1">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Cardholder Name</p>
                <p className="font-semibold text-luxury-navy">{bankDetails.cardholderName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankDetails.cardholderName, "Cardholder Name")}
              className="hover:bg-medical-blue/10"
            >
              {copiedField === "Cardholder Name" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 flex-1">
              <Building2 className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Account Name (Bank)</p>
                <p className="font-semibold text-luxury-navy">{bankDetails.accountName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankDetails.accountName, "Account Name")}
              className="hover:bg-medical-blue/10"
            >
              {copiedField === "Account Name" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Card Number */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 flex-1">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Card Number</p>
                <p className="font-semibold text-luxury-navy font-mono">{bankDetails.cardNumber}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankDetails.cardNumber.replace(/\s/g, ''), "Card Number")}
              className="hover:bg-medical-blue/10"
            >
              {copiedField === "Card Number" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 flex-1">
              <Hash className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Account Number</p>
                <p className="font-semibold text-luxury-navy font-mono">{bankDetails.accountNumber}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")}
              className="hover:bg-medical-blue/10"
            >
              {copiedField === "Account Number" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* IBAN */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-lg border-2 border-medical-blue/30">
            <div className="flex items-center gap-3 flex-1">
              <DollarSign className="w-4 h-4 text-medical-blue" />
              <div>
                <p className="text-xs text-medical-blue font-semibold">IBAN (Recommended)</p>
                <p className="font-bold text-luxury-navy font-mono">{bankDetails.iban}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankDetails.iban, "IBAN")}
              className="hover:bg-medical-blue/10"
            >
              {copiedField === "IBAN" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> After making the transfer, please keep your transaction receipt. Your order will be processed once we confirm the payment.
          </p>
        </div>

        <div className="text-xs text-muted-foreground mt-4">
          Please include your order number in the transfer reference for faster processing.
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferInfo;
