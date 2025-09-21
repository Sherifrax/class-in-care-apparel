import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  session_id: string;
  total_amount: number;
  subtotal: number;
  delivery_cost: number;
  currency: string;
  status: string;
  customer_email: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number;
}

const MyOrdersContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('user-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders();
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Order Updated",
              description: `Your order status has been updated to ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, label: 'Pending', icon: Clock },
      processing: { variant: 'default' as const, label: 'Processing', icon: Package },
      shipped: { variant: 'outline' as const, label: 'Shipped', icon: Truck },
      delivered: { variant: 'default' as const, label: 'Delivered', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', icon: XCircle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'processing': return 'bg-blue-50 border-blue-200';
      case 'shipped': return 'bg-purple-50 border-purple-200';
      case 'delivered': return 'bg-green-50 border-green-200';
      case 'cancelled': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your order history</p>
        </div>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="p-6 bg-muted/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground">When you make your first purchase, it will appear here.</p>
            </div>
            <Button onClick={() => window.location.href = '/products'}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className={`${getStatusColor(order.status)} transition-all hover:shadow-md`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.order_items?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">AED {order.total_amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        Subtotal: AED {order.subtotal.toFixed(2)} + Delivery: AED {order.delivery_cost.toFixed(2)}
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4 p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.product_name}</span>
                          <span className="text-muted-foreground">
                            Size: {item.size} • Qty: {item.quantity} • AED {item.unit_price.toFixed(2)} each
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.shipping_address && (
                  <div className="mb-4 p-4 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Shipping Address:</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.shipping_address.line1}
                      {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      <br />
                      {order.shipping_address.country}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(order.updated_at).toLocaleString()}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-card z-10 border-b">
              <CardTitle className="flex items-center justify-between">
                Order Details - #{selectedOrder.id.slice(0, 8)}
                {getStatusBadge(selectedOrder.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Order Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Session ID:</strong> {selectedOrder.session_id}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedOrder.updated_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Pricing</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Subtotal:</strong> AED {selectedOrder.subtotal.toFixed(2)}</p>
                    <p><strong>Delivery:</strong> AED {selectedOrder.delivery_cost.toFixed(2)}</p>
                    <p className="text-lg font-bold"><strong>Total:</strong> AED {selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h4>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {selectedOrder.shipping_address.line1}
                    {selectedOrder.shipping_address.line2 && <>, {selectedOrder.shipping_address.line2}</>}
                    <br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                    <br />
                    {selectedOrder.shipping_address.country}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">Size: {item.size}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">x{item.quantity}</div>
                        <div className="text-sm text-muted-foreground">AED {item.unit_price.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const MyOrders: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-background to-muted/20">
        <MyOrdersContent />
      </div>
    </ProtectedRoute>
  );
};

export default MyOrders;