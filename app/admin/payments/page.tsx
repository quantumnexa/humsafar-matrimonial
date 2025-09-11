'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Heart, 
  Settings, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Gift,
  Menu,
  Home,
  LogOut,
  CreditCard,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Banknote
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface Payment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  package_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

interface RefundRequest {
  id: string;
  payment_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  processed_at?: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'refunds'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    checkAdminSession();
    fetchPayments();
    fetchRefundRequests();
  }, []);

  const checkAdminSession = async () => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setAdminSession(session);
      } else {
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockPayments: Payment[] = [
        {
          id: '1',
          user_id: 'u1',
          user_name: 'Ahmed Ali',
          user_email: 'ahmed@example.com',
          package_name: 'Premium Package',
          amount: 15000,
          currency: 'PKR',
          payment_method: 'Credit Card',
          transaction_id: 'TXN_001',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:35:00Z'
        },
        {
          id: '2',
          user_id: 'u2',
          user_name: 'Zara Khan',
          user_email: 'zara@example.com',
          package_name: 'Standard Package',
          amount: 8000,
          currency: 'PKR',
          payment_method: 'Bank Transfer',
          transaction_id: 'TXN_002',
          status: 'pending',
          created_at: '2024-01-16T14:20:00Z',
          updated_at: '2024-01-16T14:20:00Z'
        },
        {
          id: '3',
          user_id: 'u3',
          user_name: 'Hassan Sheikh',
          user_email: 'hassan@example.com',
          package_name: 'Basic Package',
          amount: 5000,
          currency: 'PKR',
          payment_method: 'JazzCash',
          transaction_id: 'TXN_003',
          status: 'failed',
          created_at: '2024-01-17T09:15:00Z',
          updated_at: '2024-01-17T09:20:00Z'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchRefundRequests = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockRefunds: RefundRequest[] = [
        {
          id: '1',
          payment_id: '1',
          user_id: 'u1',
          user_name: 'Ahmed Ali',
          user_email: 'ahmed@example.com',
          amount: 15000,
          reason: 'Service not as expected. Did not receive promised matches.',
          status: 'pending',
          created_at: '2024-01-20T11:00:00Z'
        },
        {
          id: '2',
          payment_id: '2',
          user_id: 'u4',
          user_name: 'Fatima Malik',
          user_email: 'fatima@example.com',
          amount: 8000,
          reason: 'Technical issues with the platform.',
          status: 'approved',
          admin_notes: 'Valid complaint. Refund processed.',
          created_at: '2024-01-18T16:30:00Z',
          processed_at: '2024-01-19T10:00:00Z'
        }
      ];
      setRefundRequests(mockRefunds);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const handleRefundAction = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      // Mock implementation - replace with actual Supabase update
      setRefundRequests(prev => prev.map(refund => 
        refund.id === refundId 
          ? { 
              ...refund, 
              status: action === 'approve' ? 'approved' : 'rejected',
              admin_notes: adminNotes,
              processed_at: new Date().toISOString()
            }
          : refund
      ));
      setIsRefundDialogOpen(false);
      setSelectedRefund(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d]">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRefundStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d]">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = refund.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: false },
    { icon: Users, label: 'Profiles', href: '/admin/profiles' },
    { icon: UserCheck, label: 'Users', href: '/admin/users' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments', active: true },
    { icon: Shield, label: 'Content', href: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Gift, label: 'Promo Codes', href: '/admin/promo-codes' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const pendingRefunds = refundRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-humsafar-500 shadow-xl transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-humsafar-500/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <Menu className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={`w-full justify-start text-white hover:bg-humsafar-500/30 ${
                      item.active ? 'bg-humsafar-500/50' : ''
                    }`}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">{item.label}</span>}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-humsafar-500/30">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-200 hover:text-white hover:bg-[#ee406d]/20"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600">Manage payments and refund requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$45,231.89</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2,350</div>
                <p className="text-xs text-gray-500">+180.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-500">+19% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Refunds</CardTitle>
                <RefreshCw className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <p className="text-xs text-gray-500">-2% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === 'payments' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('payments')}
                className={activeTab === 'payments' ? 'bg-white shadow-sm' : ''}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
              </Button>
              <Button
                variant={activeTab === 'refunds' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('refunds')}
                className={activeTab === 'refunds' ? 'bg-white shadow-sm' : ''}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund Requests
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {activeTab === 'payments' ? (
                  <>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'payments' ? (
            <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-humsafar-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-humsafar-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.user_name}</h3>
                          <p className="text-sm text-gray-500">{payment.user_email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{payment.package_name}</Badge>
                            <span className="text-xs text-gray-500">{payment.payment_method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{payment.transaction_id}</div>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Review and process refund requests</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  {filteredRefunds.map((refund) => (
                    <div key={refund.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#ee406d]/10 rounded-full flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-[#ee406d]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{refund.user_name}</h3>
                          <p className="text-sm text-gray-500">{refund.user_email}</p>
                          <p className="text-sm text-gray-700 mt-1 max-w-md">{refund.reason}</p>
                          {refund.admin_notes && (
                            <p className="text-xs text-blue-600 mt-1">Admin: {refund.admin_notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          PKR {refund.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(refund.created_at).toLocaleDateString()}
                        </div>
                        {getRefundStatusBadge(refund.status)}
                      </div>
                      {refund.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Dialog open={isRefundDialogOpen && selectedRefund?.id === refund.id} onOpenChange={(open) => {
                            setIsRefundDialogOpen(open);
                            if (!open) {
                              setSelectedRefund(null);
                              setAdminNotes('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRefund(refund)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Refund Request</DialogTitle>
                                <DialogDescription>
                                  Review and process the refund request from {refund.user_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>User</Label>
                                  <p className="text-sm text-gray-600">{refund.user_name} ({refund.user_email})</p>
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <p className="text-sm text-gray-600">PKR {refund.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Reason</Label>
                                  <p className="text-sm text-gray-600">{refund.reason}</p>
                                </div>
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add notes about your decision..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleRefundAction(refund.id, 'reject')}
                                  className="text-[#ee406d] hover:text-[#ee406d]"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button onClick={() => handleRefundAction(refund.id, 'approve')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}