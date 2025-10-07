import React, { useEffect, useState } from 'react';
import { Bell, Package, TrendingUp, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'new_order' | 'low_stock' | 'status_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const cleanup = setupRealtimeNotifications();
    checkLowStock();
    
    return cleanup;
  }, []);

  const setupRealtimeNotifications = () => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          addNotification({
            type: 'new_order',
            title: 'New Order Received',
            message: `Order from ${payload.new.customer_email} - AED ${payload.new.total_amount}`,
            data: payload.new
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          // Check if stock quantity changed and is now low
          if (payload.new.stock_quantity <= payload.new.low_stock_threshold && 
              payload.new.track_stock) {
            addNotification({
              type: 'low_stock',
              title: 'Low Stock Alert',
              message: `${payload.new.name} is running low (${payload.new.stock_quantity} remaining)`,
              data: payload.new
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkLowStock = async () => {
    try {
      const { data: lowStockProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('track_stock', true);
      
      if (error) {
        console.error('Error fetching products for stock check:', error);
        return;
      }

      lowStockProducts?.forEach(product => {
        if (product.stock_quantity <= product.low_stock_threshold) {
          addNotification({
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is running low (${product.stock_quantity} remaining)`,
            data: product
          });
        }
      });
    } catch (error) {
      console.error('Error checking low stock:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
    setUnreadCount(prev => prev + 1);

    // Show toast for important notifications
    if (notification.type === 'new_order') {
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order': return Package;
      case 'low_stock': return AlertCircle;
      case 'status_update': return TrendingUp;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_order': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-red-600 bg-red-100';
      case 'status_update': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 p-0"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};