'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  UserPlus,
  MessageSquare,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Shield,
  Banknote,
  Clock
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalMatches: number;
  successfulMatches: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface DeviceStats {
  device: string;
  users: number;
  percentage: number;
  icon: any;
}

interface RevenueData {
  month: string;
  revenue: number;
  users: number;
}

interface ConversionFunnel {
  stage: string;
  users: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [timeRange, setTimeRange] = useState<string>('30d');

  useEffect(() => {
    checkAdminSession();
    fetchAnalyticsData();
  }, [timeRange]);

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

  const fetchAnalyticsData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockAnalytics: AnalyticsData = {
        totalUsers: 12450,
        activeUsers: 8920,
        newUsersToday: 156,
        totalMatches: 3240,
        successfulMatches: 892,
        totalRevenue: 2450000,
        monthlyRevenue: 185000,
        conversionRate: 12.5,
        pageViews: 45600,
        uniqueVisitors: 18900,
        bounceRate: 32.4,
        avgSessionDuration: 8.5
      };

      const mockTrafficSources: TrafficSource[] = [
        { source: 'Google Search', visitors: 7890, percentage: 42.1 },
        { source: 'Facebook', visitors: 4560, percentage: 24.3 },
        { source: 'Instagram', visitors: 3210, percentage: 17.1 },
        { source: 'Direct', visitors: 2100, percentage: 11.2 },
        { source: 'WhatsApp', visitors: 980, percentage: 5.3 }
      ];

      const mockDeviceStats: DeviceStats[] = [
        { device: 'Mobile', users: 11890, percentage: 63.2, icon: Smartphone },
        { device: 'Desktop', users: 5670, percentage: 30.1, icon: Monitor },
        { device: 'Tablet', users: 1260, percentage: 6.7, icon: Tablet }
      ];

      const mockRevenueData: RevenueData[] = [
        { month: 'Jan', revenue: 145000, users: 890 },
        { month: 'Feb', revenue: 162000, users: 1020 },
        { month: 'Mar', revenue: 178000, users: 1180 },
        { month: 'Apr', revenue: 195000, users: 1340 },
        { month: 'May', revenue: 210000, users: 1450 },
        { month: 'Jun', revenue: 185000, users: 1290 }
      ];

      const mockConversionFunnel: ConversionFunnel[] = [
        { stage: 'Visitors', users: 18900, percentage: 100 },
        { stage: 'Sign Ups', users: 4725, percentage: 25 },
        { stage: 'Profile Complete', users: 3780, percentage: 20 },
        { stage: 'Package Purchase', users: 2362, percentage: 12.5 },
        { stage: 'Active Users', users: 1890, percentage: 10 }
      ];

      setAnalyticsData(mockAnalytics);
      setTrafficSources(mockTrafficSources);
      setDeviceStats(mockDeviceStats);
      setRevenueData(mockRevenueData);
      setConversionFunnel(mockConversionFunnel);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-[#ee406d]'
    };
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
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: false },
    { icon: Users, label: 'Profiles', href: '/admin/profiles' },
    { icon: UserCheck, label: 'Users', href: '/admin/users' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Shield, label: 'Content', href: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', active: true },
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor traffic, revenue, and conversion metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {analyticsData && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                    <Users className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.monthlyRevenue)}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                    <Target className="h-5 w-5 text-humsafar-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.conversionRate)}</div>
                    <div className="flex items-center text-xs text-[#ee406d] mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                    <Activity className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.7% from last month
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
                    <Eye className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{analyticsData.pageViews.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">This month</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
                    <Globe className="h-5 w-5 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">This month</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
                    <TrendingDown className="h-5 w-5 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.bounceRate)}</div>
                    <p className="text-xs text-gray-500">Average</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg. Session</CardTitle>
                    <Clock className="h-5 w-5 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{analyticsData.avgSessionDuration}m</div>
                    <p className="text-xs text-gray-500">Duration</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue and user growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueData.map((data, index) => (
                        <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{data.month} 2024</div>
                            <div className="text-sm text-gray-500">{data.users} new users</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(data.revenue)}</div>
                            <div className="text-xs text-green-600">+{((data.revenue / 145000 - 1) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>User journey from visitor to customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversionFunnel.map((stage, index) => (
                        <div key={stage.stage} className="relative">
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-humsafar-50 to-humsafar-100 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-humsafar-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{stage.stage}</div>
                                <div className="text-sm text-gray-500">{formatPercentage(stage.percentage)} of visitors</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{stage.users.toLocaleString()}</div>
                              <div className="text-xs text-humsafar-600">users</div>
                            </div>
                          </div>
                          {index < conversionFunnel.length - 1 && (
                            <div className="flex justify-center py-2">
                              <TrendingDown className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Sources and Device Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors are coming from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficSources.map((source) => (
                        <div key={source.source} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-humsafar-600 rounded-full"></div>
                            <span className="font-medium text-gray-900">{source.source}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">{source.visitors.toLocaleString()}</span>
                            <Badge variant="outline">{formatPercentage(source.percentage)}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Device Stats */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Device Usage</CardTitle>
                    <CardDescription>User device preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deviceStats.map((device) => {
                        const Icon = device.icon;
                        return (
                          <div key={device.device} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{device.device}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">{device.users.toLocaleString()}</span>
                              <Badge variant="outline">{formatPercentage(device.percentage)}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}