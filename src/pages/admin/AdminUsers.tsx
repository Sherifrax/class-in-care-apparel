import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Users, Shield, UserCircle, Calendar, Copy, CheckCircle, Ban, Filter, Download, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { UserActionsMenu } from '@/components/admin/UserActionsMenu';
import { BanUserDialog } from '@/components/admin/BanUserDialog';
import { UnbanUserDialog } from '@/components/admin/UnbanUserDialog';
import { SendMagicLinkDialog } from '@/components/admin/SendMagicLinkDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

interface UserWithRole {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'customer';
  is_admin: boolean;
  banned?: boolean;
  ban_reason?: string;
  email_confirmed_at?: string;
}

interface UserStats {
  total_users: number;
  total_admins: number;
  total_customers: number;
  recent_signups: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
  // New dialog states
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [magicLinkDialogOpen, setMagicLinkDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase.functions.invoke('get-admin-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setUsers(data.users || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and search users
  useEffect(() => {
    let result = [...users];

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => 
        roleFilter === 'admin' ? user.is_admin : !user.is_admin
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchQuery, roleFilter]);

  const handleRoleToggle = (user: UserWithRole) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setDialogOpen(false);

      if (selectedUser.is_admin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id)
          .eq('role', 'admin');

        if (error) throw error;

        toast({
          title: '✓ Admin role removed',
          description: `${selectedUser.full_name} is now a customer`,
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: selectedUser.id,
            role: 'admin',
          });

        if (error) throw error;

        toast({
          title: '✓ Admin role granted',
          description: `${selectedUser.full_name} is now an admin`,
        });
      }

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const handleBanUser = async (reason: string, notifyUser: boolean) => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setBanDialogOpen(false);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data, error } = await supabase.functions.invoke('manage-user-account', {
        body: {
          action: 'ban-user',
          userId: selectedUser.id,
          reason,
          notifyUser
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: '✓ User banned',
        description: `${selectedUser.full_name} has been banned from the platform`,
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error banning user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to ban user',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const handleUnbanUser = async (notifyUser: boolean) => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setUnbanDialogOpen(false);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data, error } = await supabase.functions.invoke('manage-user-account', {
        body: {
          action: 'unban-user',
          userId: selectedUser.id,
          notifyUser
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: '✓ User unbanned',
        description: `${selectedUser.full_name} can now access the platform`,
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to unban user',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const handleSendMagicLink = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setMagicLinkDialogOpen(false);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data, error } = await supabase.functions.invoke('manage-user-account', {
        body: {
          action: 'send-magic-link',
          userId: selectedUser.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: '✓ Login link sent',
        description: `Login link sent successfully to ${selectedUser.email}`,
      });
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send magic link',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string, type: 'id' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedEmail(text);
        setTimeout(() => setCopiedEmail(null), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground">Manage user roles, permissions, and account access</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-medical-blue/30 hover:border-medical-blue">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass border-medical-blue/20 bg-gradient-to-br from-white/80 to-medical-blue/5 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-luxury-navy">{stats.total_users}</p>
                  </div>
                  <div className="p-3 bg-medical-blue/10 rounded-xl">
                    <Users className="w-6 h-6 text-medical-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-gradient-to-br from-white/80 to-green-50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admins</p>
                    <p className="text-3xl font-bold text-green-700">{stats.total_admins}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-purple-200 bg-gradient-to-br from-white/80 to-purple-50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customers</p>
                    <p className="text-3xl font-bold text-purple-700">{stats.total_customers}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <UserCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-gradient-to-br from-white/80 to-orange-50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent Signups</p>
                    <p className="text-3xl font-bold text-orange-700">{stats.recent_signups}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Search & Filter Section */}
        <Card className="glass border-medical-blue/30 bg-gradient-to-r from-white/95 to-medical-blue/5 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-medical-blue/10 rounded-lg">
                <Filter className="w-5 h-5 text-medical-blue" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-navy">Filter & Search Users</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Input - Takes up 8 parts */}
              <div className="relative flex-1 lg:flex-[8]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medical-blue/60 h-5 w-5" />
                <Input
                  placeholder="Search by name, email, phone, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/70 border-2 border-medical-blue/20 focus:border-medical-blue/50 focus:ring-4 focus:ring-medical-blue/10 backdrop-blur-sm text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
              
              {/* Role Filter - Fixed width */}
              <div className="lg:w-[180px] lg:flex-shrink-0">
                <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
                  <SelectTrigger className="h-12 bg-white/70 border-2 border-medical-blue/20 focus:border-medical-blue/50 focus:ring-4 focus:ring-medical-blue/10 backdrop-blur-sm text-base font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-medical-blue/50"></div>
                      <SelectValue placeholder="Filter by role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-medical-blue/20">
                    <SelectItem value="all" className="hover:bg-medical-blue/5">All Users</SelectItem>
                    <SelectItem value="admin" className="hover:bg-blue-50">🛡️ Admins Only</SelectItem>
                    <SelectItem value="customer" className="hover:bg-purple-50">👥 Customers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters Indicator */}
            {(searchQuery || roleFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-medical-blue/5 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-medical-blue/20 glass bg-gradient-to-r from-white/90 to-white/80 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <Card className="text-center py-16 glass border-medical-blue/20 bg-gradient-to-b from-white/90 to-white/80 m-4">
                          <CardContent className="space-y-4">
                            <div className="p-6 bg-medical-blue/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                              <Users className="w-12 h-12 text-medical-blue" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-luxury-navy">No users found</h3>
                              <p className="text-muted-foreground">
                                {searchQuery || roleFilter !== 'all' 
                                  ? 'Try adjusting your filters or search criteria' 
                                  : 'Users will appear here once they sign up'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((user) => (
                      <TableRow key={user.id} className="group hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                                <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                              </Avatar>
                              {user.banned && (
                                <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5">
                                  <Ban className="h-3 w-3 text-destructive-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.full_name || 'Unknown'}</div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="truncate max-w-[80px]" title={user.id}>
                                  {user.id.substring(0, 8)}...
                                </span>
                                <button
                                  onClick={() => copyToClipboard(user.id, 'id')}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Copy user ID"
                                >
                                  {copiedId === user.id ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[200px]" title={user.email}>
                              {user.email}
                            </span>
                            <button
                              onClick={() => copyToClipboard(user.email, 'email')}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy email"
                            >
                              {copiedEmail === user.email ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.phone || '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive" className="gap-1">
                              <Ban className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.is_admin ? 'default' : 'secondary'}
                            className="gap-1"
                          >
                            {user.is_admin && <Shield className="h-3 w-3" />}
                            {user.is_admin ? 'Admin' : 'Customer'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActionsMenu
                            user={user}
                            currentUserId={currentUser?.id || ''}
                            onToggleAdmin={() => handleRoleToggle(user)}
                            onBanUser={() => {
                              setSelectedUser(user);
                              setBanDialogOpen(true);
                            }}
                            onUnbanUser={() => {
                              setSelectedUser(user);
                              setUnbanDialogOpen(true);
                            }}
                            onSendMagicLink={() => {
                              setSelectedUser(user);
                              setMagicLinkDialogOpen(true);
                            }}
                            disabled={actionLoading}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Role Change Confirmation Dialog */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedUser && (
                  <>
                    Are you sure you want to {selectedUser.is_admin ? 'remove admin access from' : 'grant admin access to'}{' '}
                    <strong>{selectedUser.full_name}</strong>?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Ban User Dialog */}
        {selectedUser && (
          <BanUserDialog
            open={banDialogOpen}
            onOpenChange={setBanDialogOpen}
            userName={selectedUser.full_name}
            onConfirm={handleBanUser}
            loading={actionLoading}
          />
        )}

        {/* Unban User Dialog */}
        {selectedUser && (
          <UnbanUserDialog
            open={unbanDialogOpen}
            onOpenChange={setUnbanDialogOpen}
            userName={selectedUser.full_name}
            onConfirm={handleUnbanUser}
            loading={actionLoading}
          />
        )}

        {/* Send Magic Link Dialog */}
        {selectedUser && (
          <SendMagicLinkDialog
            open={magicLinkDialogOpen}
            onOpenChange={setMagicLinkDialogOpen}
            userName={selectedUser.full_name}
            userEmail={selectedUser.email}
            onConfirm={handleSendMagicLink}
            loading={actionLoading}
          />
        )}
      </div>
    </AdminLayout>
  );
}
