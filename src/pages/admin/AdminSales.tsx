import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Calendar, DollarSign, Package, Search, Filter, Download, Eye, TrendingUp, ShoppingCart, Users, BarChart3, RefreshCw, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ColorSwatch } from '@/components/ColorSwatch';
interface Order {
  id: string;
  session_id: string;
  order_reference?: string;
  payment_receipt_url?: string;
  total_amount: number;
  subtotal: number;
  delivery_cost: number;
  embroidery_requested?: boolean;
  embroidery_details?: string;
  embroidery_cost?: number;
  express_shipping?: boolean;
  currency: string;
  status: string;
  customer_email: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  payment_deadline?: string;
  order_items?: OrderItem[];
}
interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  color?: string;
  quantity: number;
  unit_price: number;
}
interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: {
    name: string;
    total_sold: number;
    revenue: number;
  }[];
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrders();
    setupRealtimeSubscription();
  }, []);
  const setupRealtimeSubscription = () => {
    const channel = supabase.channel('admin-sales-orders').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders'
    }, payload => {
      console.log('Order update in sales:', payload);
      fetchOrders();
      if (payload.eventType === 'INSERT') {
        toast({
          title: "New Order!",
          description: `New order received from ${payload.new.customer_email}`
        });
      } else if (payload.eventType === 'UPDATE') {
        // Check if payment receipt was just uploaded
        if (payload.new.payment_receipt_url && !payload.old.payment_receipt_url) {
          toast({
            title: "💰 Payment Receipt Uploaded!",
            description: `Customer uploaded proof for Order ${payload.new.order_reference || payload.new.id.slice(0, 8)}`,
            duration: 10000,
          });
        } else {
          toast({
            title: "Order Updated",
            description: `Order ${payload.new.id.slice(0, 8)} status changed to ${payload.new.status}`
          });
        }
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };
  const fetchOrders = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('orders').select(`
          *,
          order_items(*)
        `).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const ordersData = data || [];
      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
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
        const existing = productMap.get(item.product_name) || {
          total_sold: 0,
          revenue: 0
        };
        productMap.set(item.product_name, {
          name: item.product_name,
          total_sold: existing.total_sold + item.quantity,
          revenue: existing.revenue + item.unit_price * item.quantity
        });
      });
    });
    const topProducts = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
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
      filtered = filtered.filter(order => order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter]);
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('update-order-status', {
        body: {
          order_id: orderId,
          status: newStatus
        }
      });
      if (error) throw error;
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "default"
      });

      // Refresh orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending_payment: {
        variant: 'secondary' as const,
        label: 'Pending Payment',
        color: 'bg-amber-100 text-amber-800'
      },
      pending: {
        variant: 'secondary' as const,
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800'
      },
      processing: {
        variant: 'default' as const,
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800'
      },
      shipped: {
        variant: 'outline' as const,
        label: 'Shipped',
        color: 'bg-purple-100 text-purple-800'
      },
      delivered: {
        variant: 'default' as const,
        label: 'Delivered',
        color: 'bg-green-100 text-green-800'
      },
      cancelled: {
        variant: 'destructive' as const,
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800'
      }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant} className={`${statusInfo.color} border-0 font-medium`}>
        {statusInfo.label}
      </Badge>;
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="space-y-8 p-6">
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

      {/* Quick Filters for Pending Payments */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={statusFilter === 'pending_payment' ? 'default' : 'outline'}
          onClick={() => setStatusFilter(statusFilter === 'pending_payment' ? 'all' : 'pending_payment')}
          className={statusFilter === 'pending_payment' 
            ? 'bg-amber-600 hover:bg-amber-700' 
            : 'border-amber-300 hover:border-amber-500 hover:bg-amber-50'
          }
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Pending Payments
          {orders.filter(o => o.status === 'pending_payment').length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
              {orders.filter(o => o.status === 'pending_payment').length}
            </Badge>
          )}
        </Button>
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

      {/* Enhanced Filters */}
      <Card className="glass border-medical-blue/30 bg-gradient-to-r from-white/95 to-medical-blue/5 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-medical-blue/10 rounded-lg">
              <Filter className="w-5 h-5 text-medical-blue" />
            </div>
            <h3 className="text-lg font-semibold text-luxury-navy">Filter & Search Orders</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1 lg:flex-[8]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medical-blue/60 h-5 w-5" />
              <Input placeholder="Search by customer email, order ID, or any details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 h-12 bg-white/70 border-2 border-medical-blue/20 focus:border-medical-blue/50 focus:ring-4 focus:ring-medical-blue/10 backdrop-blur-sm text-base font-medium shadow-sm hover:shadow-md transition-all duration-200" />
            </div>
            
            <div className="lg:w-[180px] lg:flex-shrink-0">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-white/70 border-2 border-medical-blue/20 focus:border-medical-blue/50 focus:ring-4 focus:ring-medical-blue/10 backdrop-blur-sm text-base font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-medical-blue/50"></div>
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-medical-blue/20">
                  <SelectItem value="all" className="hover:bg-medical-blue/5">All Orders</SelectItem>
                  <SelectItem value="pending_payment" className="hover:bg-amber-50">🟠 Pending Payment</SelectItem>
                  <SelectItem value="pending" className="hover:bg-yellow-50">🟡 Pending</SelectItem>
                  <SelectItem value="processing" className="hover:bg-blue-50">🔵 Processing</SelectItem>
                  <SelectItem value="shipped" className="hover:bg-purple-50">🟣 Shipped</SelectItem>
                  <SelectItem value="delivered" className="hover:bg-green-50">🟢 Delivered</SelectItem>
                  <SelectItem value="cancelled" className="hover:bg-red-50">🔴 Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || statusFilter !== 'all') && <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-medical-blue/5 px-4 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Showing {filteredOrders.length} of {orders.length} orders
            </div>}
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? <Card className="text-center py-16 glass border-medical-blue/20 bg-gradient-to-b from-white/90 to-white/80">
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
          </Card> : (
            <>
              {filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => {
                const daysWaiting = Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24));
                
                return <Card key={order.id} className="glass border-medical-blue/20 bg-gradient-to-r from-white/90 to-white/80 hover:shadow-luxury transition-all duration-300 hover:scale-[1.01]">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                       <div>
                        <h3 className="font-bold text-lg text-luxury-navy">Order #{order.order_reference || order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_email} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        {order.status === 'pending_payment' && order.payment_deadline && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Payment deadline: {new Date(order.payment_deadline).toLocaleString()}
                            {new Date(order.payment_deadline) < new Date() && (
                              <Badge variant="destructive" className="ml-2 text-xs">EXPIRED</Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(order.status)}
                        
                        {/* Receipt Status Badges */}
                        {order.status === 'pending_payment' && !order.payment_receipt_url && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 whitespace-nowrap">
                            ⏳ Awaiting Receipt
                          </Badge>
                        )}
                        
                        {order.payment_receipt_url && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 whitespace-nowrap">
                            ✅ Receipt Submitted
                          </Badge>
                        )}
                        
                        {/* Days Waiting Warning */}
                        {order.status === 'pending_payment' && daysWaiting > 2 && (
                          <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded border border-red-200">
                            ⚠️ {daysWaiting} days waiting
                          </span>
                        )}
                      </div>
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
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center gap-2">
                        <Select value={order.status} onValueChange={newStatus => updateOrderStatus(order.id, newStatus)} disabled={updatingStatus === order.id}>
                          <SelectTrigger className="w-[140px] h-9 bg-white/70 border-medical-blue/20 hover:border-medical-blue/40 text-sm">
                            {updatingStatus === order.id ? <div className="flex items-center gap-2">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span className="text-xs">Updating...</span>
                              </div> : <SelectValue />}
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-md">
                            <SelectItem value="pending_payment" className="hover:bg-amber-50">🟠 Pending Payment</SelectItem>
                            <SelectItem value="pending" className="hover:bg-yellow-50">🟡 Pending</SelectItem>
                            <SelectItem value="processing" className="hover:bg-blue-50">🔵 Processing</SelectItem>
                            <SelectItem value="shipped" className="hover:bg-purple-50">🟣 Shipped</SelectItem>
                            <SelectItem value="delivered" className="hover:bg-green-50">🟢 Delivered</SelectItem>
                            <SelectItem value="cancelled" className="hover:bg-red-50">🔴 Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)} className="border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              })}
              
              {/* Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <Card className="glass border-medical-blue/20 bg-white/90 backdrop-blur-xl mt-6">
                  <CardContent className="p-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => i + 1).map((page) => {
                          const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
                          
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredOrders.length / itemsPerPage), prev + 1))}
                            className={currentPage === Math.ceil(filteredOrders.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    
                    <div className="text-center mt-4 text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border-medical-blue/20 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl animate-scale-in">
            <CardHeader className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-medical-blue/20">
              <CardTitle className="flex items-center justify-between text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                Order {selectedOrder.order_reference || `#${selectedOrder.id.slice(0, 8)}`}
                {getStatusBadge(selectedOrder.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-luxury-navy">Order Information</h4>
                  <div className="space-y-2 text-sm bg-medical-blue/5 p-4 rounded-xl">
                    <p><strong>Order Reference:</strong> {selectedOrder.order_reference || selectedOrder.id.slice(0, 8)}</p>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Customer:</strong> {selectedOrder.customer_email}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedOrder.updated_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-luxury-navy">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm bg-green-50 p-4 rounded-xl">
                    <p><strong>Subtotal:</strong> AED {selectedOrder.subtotal.toFixed(2)}</p>
                    <p><strong>Delivery {selectedOrder.express_shipping ? '(⚡ Express 3 days)' : '(Standard 5-7 days)'}:</strong> AED {selectedOrder.delivery_cost.toFixed(2)}</p>
                    {selectedOrder.embroidery_requested && (
                      <>
                        <p><strong>Custom Embroidery:</strong> AED {(selectedOrder.embroidery_cost || 0).toFixed(2)}</p>
                        {selectedOrder.embroidery_details && (
                          <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 mt-2">
                            <p className="text-xs font-semibold text-blue-800">Embroidery Text:</p>
                            <p className="text-sm font-medium text-blue-900">"{selectedOrder.embroidery_details}"</p>
                          </div>
                        )}
                      </>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <p className="text-lg font-bold text-luxury-navy">
                        <strong>Total:</strong> AED {selectedOrder.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Contact Information */}
              {selectedOrder.shipping_address && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-luxury-navy flex items-center gap-2">
                    <Users className="w-5 h-5 text-medical-blue" />
                    Customer Contact
                  </h4>
                  <div className="p-4 bg-medical-blue/5 rounded-xl text-sm border border-medical-blue/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedOrder.shipping_address.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="font-medium">
                          {selectedOrder.shipping_address.phone ? (
                            <a 
                              href={`https://wa.me/${selectedOrder.shipping_address.phone.replace(/[^0-9+]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              {selectedOrder.shipping_address.phone}
                              <span className="text-xs">📱 WhatsApp</span>
                            </a>
                          ) : 'Not provided'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedOrder.customer_email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shipping_address ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-luxury-navy flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-medical-teal" />
                    Delivery Address
                  </h4>
                  <div className="p-4 bg-medical-teal/5 rounded-xl text-sm border border-medical-teal/20">
                    {selectedOrder.shipping_address.full_name && (
                      <p className="font-semibold text-luxury-navy mb-1">{selectedOrder.shipping_address.full_name}</p>
                    )}
                    <p className="font-medium">{selectedOrder.shipping_address.street_address_1 || selectedOrder.shipping_address.line1}</p>
                    {(selectedOrder.shipping_address.street_address_2 || selectedOrder.shipping_address.line2) && (
                      <p className="text-muted-foreground">{selectedOrder.shipping_address.street_address_2 || selectedOrder.shipping_address.line2}</p>
                    )}
                    <p className="text-muted-foreground">
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.emirate || selectedOrder.shipping_address.state}
                      {selectedOrder.shipping_address.postal_code && ` ${selectedOrder.shipping_address.postal_code}`}
                    </p>
                    <p className="text-muted-foreground">{selectedOrder.shipping_address.country}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-luxury-navy flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    Delivery Address
                  </h4>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Shipping address not provided - Contact customer for delivery details
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Receipt */}
              {selectedOrder.payment_receipt_url && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-luxury-navy flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Payment Proof
                  </h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {selectedOrder.status === 'pending_payment' 
                        ? 'Payment receipt uploaded by customer' 
                        : 'Payment receipt verified'}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const receiptUrl = selectedOrder.payment_receipt_url!;
                            
                            // If it's already a public URL, open directly
                            if (receiptUrl.startsWith('http')) {
                              window.open(receiptUrl, '_blank');
                              return;
                            }
                            
                            // Otherwise, it's a private path - generate signed URL
                            const { data, error } = await supabase.storage
                              .from('payment-receipts')
                              .createSignedUrl(receiptUrl, 60 * 60);
                            
                            if (error || !data?.signedUrl) {
                              throw error || new Error('Unable to create signed URL');
                            }
                            
                            window.open(data.signedUrl, '_blank');
                          } catch (err) {
                            console.error('Receipt view error:', err);
                            toast({
                              title: 'Unable to open receipt',
                              description: 'The receipt could not be accessed. Please ask the customer to re-upload.',
                              variant: 'destructive',
                            });
                          }
                        }}
                        className="border-green-300 hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Receipt
                      </Button>
                      
                      {/* Only show "Mark as Paid" button if still pending payment */}
                      {selectedOrder.status === 'pending_payment' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                          disabled={updatingStatus === selectedOrder.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {updatingStatus === selectedOrder.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark as Paid
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {/* Show verification timestamp if already verified */}
                    {selectedOrder.payment_receipt_url && selectedOrder.status !== 'pending_payment' && (
                      <p className="text-xs text-muted-foreground mt-3">
                        ✅ Payment verified on {new Date(selectedOrder.updated_at).toLocaleDateString()} at {new Date(selectedOrder.updated_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )}


              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-luxury-navy">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map(item => <div key={item.id} className="flex justify-between items-center p-4 bg-white/50 rounded-xl border border-medical-blue/10">
                      <div className="flex-1">
                        <div className="font-medium text-luxury-navy">{item.product_name}</div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>Size: {item.size}</span>
                          {item.color && <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <ColorSwatch color={item.color} size="sm" />
                                <span>{item.color}</span>
                              </div>
                            </>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">x{item.quantity}</div>
                        <div className="text-sm text-muted-foreground">AED {item.unit_price.toFixed(2)} each</div>
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-medical-blue/20">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="border-medical-blue/30 hover:border-medical-blue">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>;
};
const AdminSales: React.FC = () => {
  return <AdminRoute>
      <AdminLayout>
        <AdminSalesContent />
      </AdminLayout>
    </AdminRoute>;
};
export default AdminSales;