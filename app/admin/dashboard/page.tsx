'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Heart, 
  DollarSign, 
  Settings, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Gift,
  Menu,
  Home,
  LogOut,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Shield
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

export default function AdminDashboard() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalProfiles: 0,
    pendingVerifications: 0,
    revenue: 0,
    flaggedContent: 0,
    conversions: 0,
    activePromos: 0
  });
  const router = useRouter();

  const fetchDashboardStats = async () => {
    try {
      // Fetch total profiles from user_subscriptions table
      const { count: totalProfilesCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true });

      // Fetch pending verifications (profile_status = 'pending')
      const { count: pendingCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('profile_status', 'pending');

      // Fetch revenue from payments table (current month)
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-32`);

      const monthlyRevenue = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Fetch flagged content (profile_status = 'flagged')
      const { count: flaggedCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('profile_status', 'flagged');

      // Update stats
      setStats({
        totalProfiles: totalProfilesCount || 0,
        pendingVerifications: pendingCount || 0,
        revenue: monthlyRevenue,
        flaggedContent: flaggedCount || 0,
        conversions: 0, // Can be calculated based on subscription upgrades
        activePromos: 0 // Can be fetched from promo codes table
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const session = localStorage.getItem('admin_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setAdminSession(parsedSession);
          // Fetch dashboard stats after authentication
          fetchDashboardStats();
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  };

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
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: true },
    { icon: Users, label: 'Profiles', href: '/admin/profiles' },
    { icon: UserCheck, label: 'Users', href: '/admin/users' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Shield, label: 'Content', href: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Gift, label: 'Promo Codes', href: '/admin/promo-codes' },
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
                  <a
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-humsafar-500/20 text-white border border-humsafar-400/30'
                        : 'text-humsafar-100 hover:bg-humsafar-500/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-humsafar-500/30">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-200 hover:text-white hover:bg-[#ee406d]/20"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-humsafar-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-humsafar-500">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back, {adminSession.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Profiles</CardTitle>
                <Users className="h-5 w-5 text-humsafar-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.totalProfiles}</div>
                <p className="text-xs text-gray-500">
                  Active user profiles
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
                <UserCheck className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.pendingVerifications}</div>
                <p className="text-xs text-gray-500">
                  Awaiting approval • Click to manage
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <Banknote className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">₨{stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-gray-500">
                  This month
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Flagged Content</CardTitle>
                <AlertTriangle className="h-5 w-5 text-[#ee406d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.flaggedContent}</div>
                <p className="text-xs text-gray-500">
                  Needs review
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
                <TrendingUp className="h-5 w-5 text-humsafar-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.conversions}%</div>
                <p className="text-xs text-gray-500">
                  Success rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Promos</CardTitle>
                <Gift className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.activePromos}</div>
                <p className="text-xs text-gray-500">
                  Running campaigns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-humsafar-50/30 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Manage Profiles</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage user profiles, verify accounts, and handle profile issues.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Heart className="h-5 w-5 text-[#ee406d]" />
                  <span>Matchmaking</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Oversee matchmaking process, review matches, and manage matchmaker accounts.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span>Payments</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Monitor payment transactions, manage subscriptions, and handle billing issues.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View detailed analytics, user engagement metrics, and platform performance.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <span>Reports</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate reports, export data, and view system logs and user activity.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Gift className="h-5 w-5 text-pink-500" />
                  <span>Promo Codes</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create and manage promotional codes, discounts, and special offers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}