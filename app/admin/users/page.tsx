'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Settings, 
  Menu,
  Home,
  LogOut,
  UserCheck,
  Mail,
  Phone,
  Eye,
  Plus,
  Minus,
  Search,
  Filter,
  Banknote,
  Shield,
  BarChart3,
  Gift
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_views_used: number;
  profile_views_limit: number;
  subscription_status: string;
  created_at: string;
  last_login?: string;
}

export default function AdminUsers() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      // Fetch users with their subscription and usage data
      const { data: usersData, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          user_profiles(
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Transform data to match our interface
      const transformedUsers: UserData[] = usersData?.map(user => ({
        id: user.user_id,
        email: user.email,
        first_name: user.user_profiles?.first_name || '',
        last_name: user.user_profiles?.last_name || '',
        phone: user.user_profiles?.phone || '',
        profile_views_used: user.profile_views_used || 0,
        profile_views_limit: user.profile_views_limit || 10,
        subscription_status: user.subscription_status || 'free',
        created_at: user.created_at,
        last_login: user.last_login
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserLimit = async (userId: string, newLimit: number) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ profile_views_limit: newLimit })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user limit:', error);
        return;
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, profile_views_limit: newLimit }
          : user
      ));
    } catch (error) {
      console.error('Error updating user limit:', error);
    }
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const session = localStorage.getItem('admin_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setAdminSession(parsedSession);
          fetchUsers();
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.subscription_status === filterStatus;
    
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
    { icon: UserCheck, label: 'Users', href: '/admin/users', active: true },
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
              <h1 className="text-2xl font-bold text-humsafar-500">User Management</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back, {adminSession.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All Users
              </Button>
              <Button
                variant={filterStatus === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('premium')}
                size="sm"
              >
                Premium
              </Button>
              <Button
                variant={filterStatus === 'free' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('free')}
                size="sm"
              >
                Free
              </Button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-humsafar-100 text-humsafar-700">
                          {user.first_name?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.email
                          }
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {user.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={user.subscription_status === 'premium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.subscription_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Usage Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Profile Views</span>
                      <span className="font-medium">
                        {user.profile_views_used} / {user.profile_views_limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-humsafar-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((user.profile_views_used / user.profile_views_limit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {/* Limit Controls */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">View Limit</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserLimit(user.id, Math.max(0, user.profile_views_limit - 5))}
                        disabled={user.profile_views_limit <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {user.profile_views_limit}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserLimit(user.id, user.profile_views_limit + 5)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="text-xs text-gray-500 pt-2">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}