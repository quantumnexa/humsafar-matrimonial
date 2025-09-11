'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Banknote,
  Shield,
  Eye
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  age?: number;
  city?: string;
  profile_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_at: string;
  updated_at: string;
  images?: UserImage[];
  completionPercentage?: number;
  user_subscriptions?: {
    profile_status: 'pending' | 'approved' | 'rejected' | 'flagged';
    subscription_status: string;
    created_at: string;
  }[];
}

interface UserImage {
  id: string;
  user_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export default function AdminProfiles() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();

  const fetchProfiles = async () => {
    try {
      // Fetch user profiles with subscription status
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_subscriptions!inner(
            profile_status,
            subscription_status,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Fetch user images for each profile
      const profilesWithImages = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: imagesData } = await supabase
            .from('user_images')
            .select('*')
            .eq('user_id', profile.user_id)
            .order('is_primary', { ascending: false });

          // Use subscription status as the primary status
          const actualStatus = profile.user_subscriptions?.[0]?.profile_status || profile.profile_status;
          
          return {
            ...profile,
            profile_status: actualStatus,
            images: imagesData || [],
            completionPercentage: calculateProfileCompletion(profile)
          };
        })
      );

      setProfiles(profilesWithImages);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const calculateProfileCompletion = (profile: any): number => {
    const fields = [
      'first_name', 'last_name', 'email', 'phone', 'gender', 
      'date_of_birth', 'city'
    ];
    
    const completedFields = fields.filter(field => 
      profile[field] && profile[field].toString().trim() !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleApproveProfile = async (profileId: string) => {
    try {
      // Find the profile to get user_id
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) return;

      // Update user_subscriptions table
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ profile_status: 'approved', updated_at: new Date().toISOString() })
        .eq('user_id', profile.user_id);

      if (error) {
        console.error('Error approving profile:', error);
        return;
      }

      // Update local state
      setProfiles(profiles.map(p => 
        p.id === profileId 
          ? { ...p, profile_status: 'approved' as const }
          : p
      ));
    } catch (error) {
      console.error('Error approving profile:', error);
    }
  };

  const handleRejectProfile = async (profileId: string) => {
    try {
      // Find the profile to get user_id
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) return;

      // Update user_subscriptions table
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ profile_status: 'rejected', updated_at: new Date().toISOString() })
        .eq('user_id', profile.user_id);

      if (error) {
        console.error('Error rejecting profile:', error);
        return;
      }

      // Update local state
      setProfiles(profiles.map(p => 
        p.id === profileId 
          ? { ...p, profile_status: 'rejected' as const }
          : p
      ));
    } catch (error) {
      console.error('Error rejecting profile:', error);
    }
  };

  const handleViewProfile = (userId: string) => {
    // Open profile in new tab
    window.open(`/profile/${userId}`, '_blank');
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const session = localStorage.getItem('admin_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setAdminSession(parsedSession);
          fetchProfiles();
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
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: false },
    { icon: Users, label: 'Profiles', href: '/admin/profiles', active: true },
    { icon: UserCheck, label: 'Users', href: '/admin/users' },
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Shield, label: 'Content', href: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Gift, label: 'Promo Codes', href: '/admin/promo-codes' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const filteredProfiles = profiles.filter(profile => {
    if (filterStatus === 'all') return true;
    return profile.profile_status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d] hover:bg-[#ee406d]/10"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'flagged':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><XCircle className="w-3 h-3 mr-1" />Flagged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-humsafar-500/30">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-humsafar-500/30"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-humsafar-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-humsafar-700">Profile Management</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back, {adminSession.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected', 'flagged'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All Profiles' : status}
                  {status !== 'all' && (
                    <Badge className="ml-2 bg-white text-humsafar-600">
                      {profiles.filter(p => p.profile_status === status).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-all duration-300 border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={profile.images?.find(img => img.is_primary)?.image_url || profile.images?.[0]?.image_url} 
                          alt={`${profile.first_name} ${profile.last_name}`}
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {profile.first_name} {profile.middle_name} {profile.last_name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          ID: {profile.user_id.slice(0, 8)}...
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(profile.profile_status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Profile Completion */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profile Completion</span>
                      <span className="font-medium">{profile.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-humsafar-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${profile.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.city && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.city}</span>
                      </div>
                    )}
                    {profile.age && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{profile.age} years old</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    {/* View Profile Button - Always visible */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewProfile(profile.user_id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    
                    {profile.profile_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveProfile(profile.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleRejectProfile(profile.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {profile.profile_status === 'approved' && (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approved
                      </Button>
                    )}
                    {profile.profile_status === 'rejected' && (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveProfile(profile.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Re-approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-500">
                {filterStatus === 'all' 
                  ? 'No user profiles available yet.' 
                  : `No profiles with ${filterStatus} status.`
                }
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}