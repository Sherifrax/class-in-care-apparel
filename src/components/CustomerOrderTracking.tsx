import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  MapPin
} from 'lucide-react';

interface OrderTrackingProps {
  status: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export const CustomerOrderTracking: React.FC<OrderTrackingProps> = ({
  status,
  createdAt,
  updatedAt,
  estimatedDelivery
}) => {
  const [progress, setProgress] = useState(0);

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getStatusIndex(status);

  useEffect(() => {
    const progressPercentage = status === 'cancelled' ? 0 : ((currentStep + 1) / statusSteps.length) * 100;
    setProgress(progressPercentage);
  }, [status, currentStep]);

  if (status === 'cancelled') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Order Cancelled</h3>
              <p className="text-sm">This order was cancelled on {new Date(updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status Steps */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;
            const IconComponent = step.icon;

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div className={`
                  p-2 rounded-full transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                  ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </div>
                  {isCurrent && (
                    <div className="text-sm text-muted-foreground">
                      Current status • Updated {new Date(updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {isActive && (
                  <Badge variant={isCurrent ? 'default' : 'secondary'}>
                    {isCurrent ? 'Current' : 'Complete'}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery */}
        {estimatedDelivery && status !== 'delivered' && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Estimated Delivery:</span>
              <span>{estimatedDelivery}</span>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Timeline</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Order placed: {new Date(createdAt).toLocaleString()}</div>
            <div>Last updated: {new Date(updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};