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
  RefreshCw,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      pending: { variant: 'secondary' as const, label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      processing: { variant: 'default' as const, label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800' },
      shipped: { variant: 'outline' as const, label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
      delivered: { variant: 'default' as const, label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge className={`flex items-center gap-1 ${statusInfo.color} border-0`}>
        <IconComponent className="w-3 h-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100';
      case 'processing': return 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100';
      case 'shipped': return 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100';
      case 'delivered': return 'border-green-200 bg-gradient-to-r from-green-50 to-green-100';
      case 'cancelled': return 'border-red-200 bg-gradient-to-r from-red-50 to-red-100';
      default: return 'border-medical-blue/20 bg-gradient-to-r from-white/90 to-white/80';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 pt-20 pb-12">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-1 justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-muted-foreground">Track and manage your order history</p>
            </div>
            <Button 
              onClick={fetchOrders} 
              variant="outline"
              className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-16 glass border-medical-blue/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in">
            <CardContent className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 p-5 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-medical-blue/60" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-luxury-navy">No orders yet</h3>
                <p className="text-muted-foreground">When you make your first purchase, it will appear here.</p>
              </div>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className={`glass ${getStatusColor(order.status)} border-2 hover:shadow-luxury transition-all duration-300 hover:scale-[1.01] overflow-hidden rounded-2xl backdrop-blur-xl`}>
                <CardContent className="p-8 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-2xl shadow-soft border border-medical-blue/20">
                              <Package className="w-7 h-7 text-medical-blue" />
                            </div>
                            <div>
                              <h3 className="font-bold text-2xl lg:text-xl text-luxury-navy">Order #{order.id.slice(0, 8)}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(order.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4" />
                                  {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1 bg-gradient-to-br from-white/60 to-white/40 rounded-2xl p-5 border border-medical-blue/10 shadow-soft">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Total Amount</div>
                          <div className="font-bold text-3xl lg:text-2xl bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                            AED {order.total_amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 space-y-1">
                            <div>Subtotal: AED {order.subtotal.toFixed(2)}</div>
                            <div>Delivery: AED {order.delivery_cost.toFixed(2)}</div>
                          </div>
                        </div>
                        
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="lg:col-span-2 bg-gradient-to-br from-white/60 to-white/40 rounded-2xl p-5 border border-medical-blue/10 shadow-soft">
                            <div className="text-sm font-medium text-muted-foreground mb-3">Order Items:</div>
                            <div className="space-y-2 max-h-24 overflow-y-auto">
                              {order.order_items.slice(0, 3).map((item) => (
                                <div key={item.id} className="text-sm flex justify-between items-center">
                                  <div>
                                    <span className="font-medium text-luxury-navy">{item.product_name}</span>
                                    <span className="text-muted-foreground ml-2 text-xs">
                                      Size: {item.size}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Qty: {item.quantity}
                                  </div>
                                </div>
                              ))}
                              {order.order_items.length > 3 && (
                                <div className="text-xs text-medical-blue font-medium">
                                  +{order.order_items.length - 3} more items
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {order.shipping_address && (
                        <div className="bg-gradient-to-br from-white/60 to-white/40 rounded-2xl p-5 border border-medical-blue/10 shadow-soft">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-medical-teal/10 rounded-lg">
                              <MapPin className="w-4 h-4 text-medical-teal" />
                            </div>
                            <span className="font-semibold text-sm text-luxury-navy">Shipping Address</span>
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {order.shipping_address.line1}
                            {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                            <br />
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                            <br />
                            {order.shipping_address.country}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 lg:w-48">
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        size="sm"
                        className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] text-sm px-6 py-2.5 h-10 w-full lg:w-auto rounded-xl font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <div className="text-xs text-muted-foreground text-center lg:text-right">
                        Updated: {new Date(order.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto glass border-2 border-medical-blue/30 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/95 to-white/90 animate-scale-in rounded-3xl">
              <CardHeader className="sticky top-0 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm z-10 border-b border-medical-blue/20 rounded-t-3xl">
                <CardTitle className="flex items-center justify-between text-3xl lg:text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 rounded-2xl">
                      <Package className="w-6 h-6 text-medical-blue" />
                    </div>
                    <div>
                      <div>Order Details - #{selectedOrder.id.slice(0, 8)}</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass border-medical-blue/20 bg-gradient-to-br from-white/80 to-medical-blue/5 shadow-soft rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-semibold text-xl text-luxury-navy flex items-center gap-2">
                        <div className="p-2 bg-medical-blue/10 rounded-lg">
                          <Calendar className="w-4 h-4 text-medical-blue" />
                        </div>
                        Order Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-medical-blue/10">
                          <span className="font-medium text-muted-foreground">Order ID:</span>
                          <span className="font-mono text-xs bg-medical-blue/5 px-2 py-1 rounded">{selectedOrder.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-medical-blue/10">
                          <span className="font-medium text-muted-foreground">Session ID:</span>
                          <span className="font-mono text-xs bg-medical-blue/5 px-2 py-1 rounded">{selectedOrder.session_id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-medical-blue/10">
                          <span className="font-medium text-muted-foreground">Order Date:</span>
                          <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-medium text-muted-foreground">Last Updated:</span>
                          <span>{new Date(selectedOrder.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass border-green-200 bg-gradient-to-br from-white/80 to-green-50 shadow-soft rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-semibold text-xl text-green-700 flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        Pricing Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 text-sm">
                          <span className="font-medium text-muted-foreground">Subtotal:</span>
                          <span className="text-lg font-semibold">AED {selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 text-sm">
                          <span className="font-medium text-muted-foreground">Delivery Fee:</span>
                          <span className="text-lg font-semibold">AED {selectedOrder.delivery_cost.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-green-200 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-700">Total Amount:</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                              AED {selectedOrder.total_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedOrder.shipping_address && (
                  <Card className="glass border-medical-teal/20 bg-gradient-to-br from-white/80 to-medical-teal/5 shadow-soft rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-semibold text-xl text-luxury-navy flex items-center gap-2">
                        <div className="p-2 bg-medical-teal/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-medical-teal" />
                        </div>
                        Shipping Address
                      </h4>
                      <div className="p-4 bg-white/50 rounded-xl text-sm leading-relaxed border border-medical-teal/10">
                        <div className="font-medium text-luxury-navy">
                          {selectedOrder.shipping_address.line1}
                          {selectedOrder.shipping_address.line2 && <>, {selectedOrder.shipping_address.line2}</>}
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                        </div>
                        <div className="text-muted-foreground">
                          {selectedOrder.shipping_address.country}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="glass border-purple-200 bg-gradient-to-br from-white/80 to-purple-50 shadow-soft rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-xl text-purple-700 flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                      </div>
                      Order Items ({selectedOrder.order_items?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.order_items?.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center p-5 bg-white/60 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                              <span className="font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-luxury-navy text-lg">{item.product_name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>Size: <span className="font-medium">{item.size}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-700">x{item.quantity}</div>
                            <div className="text-sm text-muted-foreground">AED {item.unit_price.toFixed(2)} each</div>
                            <div className="text-xs font-medium text-purple-600 mt-1">
                              Total: AED {(item.unit_price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-8 border-t-2 border-medical-blue/20">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedOrder(null)}
                    className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl text-base px-8 py-3 font-medium shadow-soft hover:shadow-medium transition-all duration-300"
                  >
                    Close Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const MyOrders: React.FC = () => {
  return (
    <ProtectedRoute>
      <MyOrdersContent />
    </ProtectedRoute>
  );
};

export default MyOrders;