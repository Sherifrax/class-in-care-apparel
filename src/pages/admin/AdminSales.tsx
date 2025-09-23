import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  DollarSign,
  Package,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
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

interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; total_sold: number; revenue: number }[];
}

const AdminSalesContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin-sales-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order update in sales:', payload);
          fetchOrders();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order!",
              description: `New order received from ${payload.new.customer_email}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Order Updated",
              description: `Order ${payload.new.id.slice(0, 8)} status changed to ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = data || [];
      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = ordersData.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate top products
    const productMap = new Map();
    ordersData.forEach(order => {
      order.order_items?.forEach(item => {
        const existing = productMap.get(item.product_name) || { total_sold: 0, revenue: 0 };
        productMap.set(item.product_name, {
          name: item.product_name,
          total_sold: existing.total_sold + item.quantity,
          revenue: existing.revenue + (item.unit_price * item.quantity)
        });
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setStats({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts
    });
  };

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'outline' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
            Sales Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor your sales performance and order management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-medical-blue/30 hover:border-medical-blue">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-medical-blue/20 bg-gradient-to-br from-white/80 to-medical-blue/5 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-luxury-navy">AED {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-medical-blue/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-200 bg-gradient-to-br from-white/80 to-green-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-green-700">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-200 bg-gradient-to-br from-white/80 to-purple-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-700">AED {stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-orange-200 bg-gradient-to-br from-white/80 to-orange-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Products</p>
                <p className="text-3xl font-bold text-orange-700">{stats.topProducts.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass border-medical-blue/20 bg-gradient-to-r from-white/90 to-white/80">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-blue/60 w-4 h-4" />
              <Input
                placeholder="Search by order ID or customer email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-16 glass border-medical-blue/20 bg-gradient-to-b from-white/90 to-white/80">
            <CardContent className="space-y-4">
              <div className="p-6 bg-medical-blue/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                <Package className="w-12 h-12 text-medical-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-luxury-navy">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here once customers start purchasing'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="glass border-medical-blue/20 bg-gradient-to-r from-white/90 to-white/80 hover:shadow-luxury transition-all duration-300 hover:scale-[1.01]">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-luxury-navy">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_email} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Items:</span>
                        <span className="ml-2 text-foreground">{order.order_items?.length || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Subtotal:</span>
                        <span className="ml-2 text-foreground">AED {order.subtotal.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Total:</span>
                        <span className="ml-2 font-bold text-luxury-navy text-lg">AED {order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border-medical-blue/20 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl animate-scale-in">
            <CardHeader className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-medical-blue/20">
              <CardTitle className="flex items-center justify-between text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                Order Details - #{selectedOrder.id.slice(0, 8)}
                {getStatusBadge(selectedOrder.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-luxury-navy">Order Information</h4>
                  <div className="space-y-2 text-sm bg-medical-blue/5 p-4 rounded-xl">
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Session ID:</strong> {selectedOrder.session_id}</p>
                    <p><strong>Customer:</strong> {selectedOrder.customer_email}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedOrder.updated_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-luxury-navy">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm bg-green-50 p-4 rounded-xl">
                    <p><strong>Subtotal:</strong> AED {selectedOrder.subtotal.toFixed(2)}</p>
                    <p><strong>Delivery:</strong> AED {selectedOrder.delivery_cost.toFixed(2)}</p>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-lg font-bold text-luxury-navy">
                        <strong>Total:</strong> AED {selectedOrder.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-luxury-navy">Shipping Address</h4>
                  <div className="p-4 bg-medical-teal/5 rounded-xl text-sm">
                    <p>{selectedOrder.shipping_address.line1}</p>
                    {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</p>
                    <p>{selectedOrder.shipping_address.country}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-luxury-navy">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-white/50 rounded-xl border border-medical-blue/10">
                      <div>
                        <div className="font-medium text-luxury-navy">{item.product_name}</div>
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

              <div className="flex justify-end gap-3 pt-6 border-t border-medical-blue/20">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                  className="border-medical-blue/30 hover:border-medical-blue"
                >
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

const AdminSales: React.FC = () => {
  return (
    <AdminRoute>
      <AdminLayout>
        <AdminSalesContent />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminSales;