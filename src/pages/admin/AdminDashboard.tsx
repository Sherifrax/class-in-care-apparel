import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminNotifications } from '@/components/admin/AdminNotifications';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  monthlyRevenue: { month: string; revenue: number }[];
}

const AdminDashboardContent: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order update:', payload);
          fetchDashboardStats();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order Received!",
              description: `Order from ${payload.new.customer_email} - AED ${payload.new.total_amount}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch orders stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch customers count
      const { data: customers, error: customersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'customer');

      if (customersError) throw customersError;

      // Fetch products count
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id');

      if (productsError) throw productsError;

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      // Calculate monthly revenue
      const monthlyStats = new Map();
      orders?.forEach(order => {
        const month = new Date(order.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyStats.set(month, (monthlyStats.get(month) || 0) + Number(order.total_amount));
      });

      const monthlyRevenue = Array.from(monthlyStats.entries()).map(([month, revenue]) => ({
        month,
        revenue
      }));

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalCustomers: customers?.length || 0,
        totalProducts: products?.length || 0,
        recentOrders,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'outline' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-white to-medical-teal/5">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header with Glass Morphism */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 glass rounded-2xl border border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-r from-white/80 to-white/60">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-lg text-muted-foreground">Monitor your business performance and growth</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <AdminNotifications />
            <Button 
              onClick={() => navigate('/admin/products')} 
              variant="outline"
              className="glass border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/10 transition-all duration-300 hover:scale-105"
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
            <Button 
              onClick={() => navigate('/admin/sales')}
              className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Sales
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-br from-medical-blue/10 via-white/80 to-medical-blue/5 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-medical-blue">Total Orders</CardTitle>
              <div className="p-3 bg-gradient-to-br from-medical-blue to-medical-blue-light rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-blue-light bg-clip-text text-transparent">
                {stats.totalOrders}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100/80 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700 font-semibold">+12%</span>
                </div>
                <span className="text-xs text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-br from-medical-teal/10 via-white/80 to-medical-teal/5 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-medical-teal">Total Revenue</CardTitle>
              <div className="p-3 bg-gradient-to-br from-medical-teal to-medical-teal-light rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-medical-teal to-medical-teal-light bg-clip-text text-transparent">
                AED {stats.totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100/80 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700 font-semibold">+8%</span>
                </div>
                <span className="text-xs text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-br from-luxury-navy/10 via-white/80 to-luxury-navy/5 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-luxury-navy">Total Customers</CardTitle>
              <div className="p-3 bg-gradient-to-br from-luxury-navy to-medical-blue rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
                {stats.totalCustomers}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100/80 rounded-full">
                  <Activity className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700 font-semibold">Active</span>
                </div>
                <span className="text-xs text-muted-foreground">users</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-br from-medical-blue/10 via-white/80 to-medical-teal/5 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-medical-blue">Total Products</CardTitle>
              <div className="p-3 bg-gradient-to-br from-medical-blue to-medical-teal rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                {stats.totalProducts}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100/80 rounded-full">
                  <Package className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-700 font-semibold">In stock</span>
                </div>
                <span className="text-xs text-muted-foreground">inventory</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Orders */}
        <Card className="glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 animate-fade-in-up">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-medical-blue to-medical-teal rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent font-bold">
                Recent Orders
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-medical-blue/60" />
                </div>
                <h3 className="text-lg font-semibold text-luxury-navy mb-2">No orders yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Orders will appear here once customers start purchasing from your store
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="group flex items-center justify-between p-5 glass rounded-xl border border-white/20 hover:shadow-medium transition-all duration-300 hover:scale-[1.02] animate-slide-in-left"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-medical-blue/20 to-medical-teal/20 rounded-xl group-hover:from-medical-blue/30 group-hover:to-medical-teal/30 transition-all duration-300">
                        <ShoppingBag className="w-5 h-5 text-medical-blue" />
                      </div>
                      <div>
                        <p className="font-semibold text-luxury-navy">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_email} • {new Date(order.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        AED {Number(order.total_amount).toFixed(2)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminRoute>
      <AdminLayout>
        <AdminDashboardContent />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;