'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  TrendingUp,
  Users2,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Banknote
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  applicablePackages: string[];
}

interface PromoCodeUsage {
  id: string;
  promoCodeId: string;
  userId: string;
  userEmail: string;
  orderValue: number;
  discountAmount: number;
  usedAt: string;
}

export default function PromoCodesPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoUsages, setPromoUsages] = useState<PromoCodeUsage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [activeTab, setActiveTab] = useState('codes');

  // Form state for creating/editing promo codes
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 1,
    validFrom: '',
    validUntil: '',
    applicablePackages: [] as string[]
  });

  useEffect(() => {
    checkAdminSession();
    fetchPromoCodes();
    fetchPromoUsages();
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

  const fetchPromoCodes = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockPromoCodes: PromoCode[] = [
        {
          id: '1',
          code: 'WELCOME20',
          description: 'Welcome discount for new users',
          type: 'percentage',
          value: 20,
          minOrderValue: 5000,
          maxDiscount: 2000,
          usageLimit: 1000,
          usedCount: 245,
          validFrom: '2024-01-01',
          validUntil: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin@humsafar.com',
          applicablePackages: ['basic', 'premium']
        },
        {
          id: '2',
          code: 'VALENTINE50',
          description: 'Valentine\'s Day special offer',
          type: 'fixed',
          value: 1500,
          minOrderValue: 10000,
          usageLimit: 500,
          usedCount: 89,
          validFrom: '2024-02-10',
          validUntil: '2024-02-20',
          isActive: false,
          createdAt: '2024-02-01T00:00:00Z',
          createdBy: 'admin@humsafar.com',
          applicablePackages: ['premium', 'platinum']
        },
        {
          id: '3',
          code: 'SUMMER30',
          description: 'Summer season discount',
          type: 'percentage',
          value: 30,
          minOrderValue: 8000,
          maxDiscount: 3000,
          usageLimit: 200,
          usedCount: 156,
          validFrom: '2024-06-01',
          validUntil: '2024-08-31',
          isActive: true,
          createdAt: '2024-05-15T00:00:00Z',
          createdBy: 'admin@humsafar.com',
          applicablePackages: ['basic', 'premium', 'platinum']
        }
      ];

      setPromoCodes(mockPromoCodes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const fetchPromoUsages = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockUsages: PromoCodeUsage[] = [
        {
          id: '1',
          promoCodeId: '1',
          userId: 'user1',
          userEmail: 'user1@example.com',
          orderValue: 8000,
          discountAmount: 1600,
          usedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          promoCodeId: '1',
          userId: 'user2',
          userEmail: 'user2@example.com',
          orderValue: 12000,
          discountAmount: 2000,
          usedAt: '2024-01-16T14:20:00Z'
        },
        {
          id: '3',
          promoCodeId: '2',
          userId: 'user3',
          userEmail: 'user3@example.com',
          orderValue: 15000,
          discountAmount: 1500,
          usedAt: '2024-02-14T09:15:00Z'
        }
      ];

      setPromoUsages(mockUsages);
    } catch (error) {
      console.error('Error fetching promo usages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleCreatePromo = async () => {
    try {
      // Here you would create the promo code in Supabase
      console.log('Creating promo code:', formData);
      
      // Reset form and close dialog
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 1,
        validFrom: '',
        validUntil: '',
        applicablePackages: []
      });
      setIsCreateDialogOpen(false);
      
      // Refresh the list
      await fetchPromoCodes();
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  const handleEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description,
      type: promo.type,
      value: promo.value,
      minOrderValue: promo.minOrderValue || 0,
      maxDiscount: promo.maxDiscount || 0,
      usageLimit: promo.usageLimit,
      validFrom: promo.validFrom,
      validUntil: promo.validUntil,
      applicablePackages: promo.applicablePackages
    });
    setIsCreateDialogOpen(true);
  };

  const handleToggleStatus = async (promoId: string) => {
    try {
      // Here you would update the promo code status in Supabase
      console.log('Toggling promo status:', promoId);
      await fetchPromoCodes();
    } catch (error) {
      console.error('Error toggling promo status:', error);
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    try {
      // Here you would delete the promo code from Supabase
      console.log('Deleting promo code:', promoId);
      await fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && promo.isActive) ||
                         (filterStatus === 'inactive' && !promo.isActive) ||
                         (filterStatus === 'expired' && new Date(promo.validUntil) < new Date());
    
    return matchesSearch && matchesFilter;
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
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Shield, label: 'Content', href: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Gift, label: 'Promo Codes', href: '/admin/promo-codes', active: true },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
              <p className="text-gray-600">Create and manage promotional discount codes</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-humsafar-600 hover:bg-humsafar-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promo Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}</DialogTitle>
                  <DialogDescription>
                    {editingPromo ? 'Update the promo code details below.' : 'Fill in the details to create a new promotional code.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">Code</Label>
                    <div className="col-span-3 flex space-x-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="Enter promo code"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={generateRandomCode}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Discount Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (PKR)'}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      placeholder={formData.type === 'percentage' ? '10' : '1000'}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minOrderValue" className="text-right">Min Order Value</Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                      placeholder="5000"
                      className="col-span-3"
                    />
                  </div>
                  {formData.type === 'percentage' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="maxDiscount" className="text-right">Max Discount</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                        placeholder="2000"
                        className="col-span-3"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usageLimit" className="text-right">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      placeholder="100"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="validFrom" className="text-right">Valid From</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="validUntil" className="text-right">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingPromo(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleCreatePromo}>
                    {editingPromo ? 'Update' : 'Create'} Promo Code
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="codes">Promo Codes</TabsTrigger>
              <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="codes" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Codes</CardTitle>
                    <Gift className="h-5 w-5 text-humsafar-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{promoCodes.length}</div>
                    <p className="text-xs text-gray-500">Active & Inactive</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Codes</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {promoCodes.filter(p => p.isActive).length}
                    </div>
                    <p className="text-xs text-gray-500">Currently available</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Usage</CardTitle>
                    <Users2 className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {promoCodes.reduce((sum, p) => sum + p.usedCount, 0)}
                    </div>
                    <p className="text-xs text-gray-500">Times used</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg. Usage Rate</CardTitle>
                    <Target className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {promoCodes.length > 0 ? 
                        Math.round((promoCodes.reduce((sum, p) => sum + (p.usedCount / p.usageLimit * 100), 0) / promoCodes.length)) 
                        : 0}%
                    </div>
                    <p className="text-xs text-gray-500">Of usage limit</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search promo codes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Codes</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Codes List */}
              <div className="grid gap-4">
                {filteredPromoCodes.map((promo) => {
                  const isExpired = new Date(promo.validUntil) < new Date();
                  const usagePercentage = (promo.usedCount / promo.usageLimit) * 100;
                  
                  return (
                    <Card key={promo.id} className={`border-0 shadow-sm ${!promo.isActive || isExpired ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center space-x-2">
                                <code className="bg-gray-100 px-3 py-1 rounded-md font-mono text-lg font-bold text-humsafar-600">
                                  {promo.code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(promo.code)}
                                  className="p-1"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex space-x-2">
                                {promo.isActive && !isExpired ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : isExpired ? (
                                  <Badge className="bg-gray-100 text-gray-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Expired
                                  </Badge>
                                ) : (
                                  <Badge className="bg-[#ee406d]/10 text-[#ee406d]">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  {promo.type === 'percentage' ? (
                                    <><Percent className="h-3 w-3 mr-1" />{promo.value}%</>
                                  ) : (
                                    <><DollarSign className="h-3 w-3 mr-1" />{formatCurrency(promo.value)}</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3">{promo.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Valid Period:</span>
                                <div className="font-medium">
                                  {formatDate(promo.validFrom)} - {formatDate(promo.validUntil)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Usage:</span>
                                <div className="font-medium">
                                  {promo.usedCount} / {promo.usageLimit} ({usagePercentage.toFixed(1)}%)
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Min Order:</span>
                                <div className="font-medium">
                                  {promo.minOrderValue ? formatCurrency(promo.minOrderValue) : 'No minimum'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Max Discount:</span>
                                <div className="font-medium">
                                  {promo.maxDiscount ? formatCurrency(promo.maxDiscount) : 'No limit'}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                                <span>Usage Progress</span>
                                <span>{usagePercentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-humsafar-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPromo(promo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(promo.id)}
                            >
                              {promo.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePromo(promo.id)}
                              className="text-[#ee406d] hover:text-[#ee406d] hover:bg-[#ee406d]/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              {/* Usage Analytics */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Promo Code Usage Analytics</CardTitle>
                  <CardDescription>Recent usage history and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {promoUsages.map((usage) => {
                      const promo = promoCodes.find(p => p.id === usage.promoCodeId);
                      return (
                        <div key={usage.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-humsafar-100 rounded-full flex items-center justify-center">
                              <Gift className="h-5 w-5 text-humsafar-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{promo?.code}</div>
                              <div className="text-sm text-gray-500">{usage.userEmail}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(usage.discountAmount)} saved
                            </div>
                            <div className="text-sm text-gray-500">
                              on {formatCurrency(usage.orderValue)} order
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(usage.usedAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}