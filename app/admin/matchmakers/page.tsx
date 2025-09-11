'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Banknote
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface Matchmaker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience_years?: number;
  assigned_clients: number;
  success_rate?: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  matchmaker_id?: string;
}

export default function MatchmakersPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [matchmakers, setMatchmakers] = useState<Matchmaker[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedMatchmaker, setSelectedMatchmaker] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newMatchmaker, setNewMatchmaker] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: 0
  });

  useEffect(() => {
    checkAdminSession();
    fetchMatchmakers();
    fetchUsers();
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

  const fetchMatchmakers = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockMatchmakers: Matchmaker[] = [
        {
          id: '1',
          name: 'Sarah Ahmed',
          email: 'sarah@humsafar.com',
          phone: '+92 300 1234567',
          specialization: 'Cross-cultural matches',
          experience_years: 5,
          assigned_clients: 25,
          success_rate: 85,
          status: 'active',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Ali Hassan',
          email: 'ali@humsafar.com',
          phone: '+92 300 2345678',
          specialization: 'Professional matches',
          experience_years: 8,
          assigned_clients: 32,
          success_rate: 92,
          status: 'active',
          created_at: '2023-08-20'
        },
        {
          id: '3',
          name: 'Fatima Khan',
          email: 'fatima@humsafar.com',
          phone: '+92 300 3456789',
          specialization: 'Traditional families',
          experience_years: 3,
          assigned_clients: 18,
          success_rate: 78,
          status: 'inactive',
          created_at: '2024-03-10'
        }
      ];
      setMatchmakers(mockMatchmakers);
    } catch (error) {
      console.error('Error fetching matchmakers:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockUsers: UserProfile[] = [
        { id: '1', first_name: 'Ahmed', last_name: 'Ali', email: 'ahmed@example.com' },
        { id: '2', first_name: 'Zara', last_name: 'Khan', email: 'zara@example.com' },
        { id: '3', first_name: 'Hassan', last_name: 'Sheikh', email: 'hassan@example.com' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const handleAddMatchmaker = async () => {
    try {
      // Mock implementation - replace with actual Supabase insert
      const newId = (matchmakers.length + 1).toString();
      const matchmaker: Matchmaker = {
        ...newMatchmaker,
        id: newId,
        assigned_clients: 0,
        success_rate: 0,
        status: 'active',
        created_at: new Date().toISOString().split('T')[0]
      };
      setMatchmakers([...matchmakers, matchmaker]);
      setNewMatchmaker({ name: '', email: '', phone: '', specialization: '', experience_years: 0 });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding matchmaker:', error);
    }
  };

  const handleAssignMatchmaker = async () => {
    try {
      // Mock implementation - replace with actual Supabase update
      console.log(`Assigning matchmaker ${selectedMatchmaker} to user ${selectedUser}`);
      setIsAssignDialogOpen(false);
      setSelectedMatchmaker('');
      setSelectedUser('');
    } catch (error) {
      console.error('Error assigning matchmaker:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
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
              <h1 className="text-2xl font-bold text-gray-900">Matchmaker Management</h1>
              <p className="text-gray-600">Assign and manage human matchmakers</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-humsafar-600 hover:bg-humsafar-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Matchmaker
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Matchmaker</DialogTitle>
                    <DialogDescription>
                      Add a new human matchmaker to the team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input
                        id="name"
                        value={newMatchmaker.name}
                        onChange={(e) => setNewMatchmaker({...newMatchmaker, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMatchmaker.email}
                        onChange={(e) => setNewMatchmaker({...newMatchmaker, email: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone</Label>
                      <Input
                        id="phone"
                        value={newMatchmaker.phone}
                        onChange={(e) => setNewMatchmaker({...newMatchmaker, phone: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="specialization" className="text-right">Specialization</Label>
                      <Input
                        id="specialization"
                        value={newMatchmaker.specialization}
                        onChange={(e) => setNewMatchmaker({...newMatchmaker, specialization: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="experience" className="text-right">Experience (Years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={newMatchmaker.experience_years}
                        onChange={(e) => setNewMatchmaker({...newMatchmaker, experience_years: parseInt(e.target.value) || 0})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddMatchmaker}>Add Matchmaker</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign to User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Matchmaker</DialogTitle>
                    <DialogDescription>
                      Assign a matchmaker to a specific user.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="matchmaker" className="text-right">Matchmaker</Label>
                      <Select value={selectedMatchmaker} onValueChange={setSelectedMatchmaker}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select matchmaker" />
                        </SelectTrigger>
                        <SelectContent>
                          {matchmakers.filter(m => m.status === 'active').map((matchmaker) => (
                            <SelectItem key={matchmaker.id} value={matchmaker.id}>
                              {matchmaker.name} - {matchmaker.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user" className="text-right">User</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name} - {user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAssignMatchmaker}>Assign Matchmaker</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Matchmakers</CardTitle>
                <Users className="h-5 w-5 text-humsafar-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{matchmakers.length}</div>
                <p className="text-xs text-gray-500">Active professionals</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Matchmakers</CardTitle>
                <UserCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {matchmakers.filter(m => m.status === 'active').length}
                </div>
                <p className="text-xs text-gray-500">Currently working</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Assignments</CardTitle>
                <Heart className="h-5 w-5 text-[#ee406d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {matchmakers.reduce((sum, m) => sum + m.assigned_clients, 0)}
                </div>
                <p className="text-xs text-gray-500">Client assignments</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Success Rate</CardTitle>
                <Star className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(matchmakers.reduce((sum, m) => sum + (m.success_rate || 0), 0) / matchmakers.length)}%
                </div>
                <p className="text-xs text-gray-500">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Matchmakers List */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Matchmakers</CardTitle>
              <CardDescription>Manage your team of human matchmakers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {matchmakers.map((matchmaker) => (
                  <div key={matchmaker.id} className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${matchmaker.name}`} />
                        <AvatarFallback>{matchmaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{matchmaker.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{matchmaker.email}</span>
                          {matchmaker.phone && (
                            <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{matchmaker.phone}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{matchmaker.specialization}</Badge>
                          <span className="text-xs text-gray-500">{matchmaker.experience_years} years exp.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{matchmaker.assigned_clients} clients</div>
                        <div className="text-sm text-gray-500">{matchmaker.success_rate}% success rate</div>
                      </div>
                      {getStatusBadge(matchmaker.status)}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-[#ee406d] hover:text-[#ee406d]">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}