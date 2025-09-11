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
  Shield,
  AlertTriangle,
  Flag,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MessageSquare,
  Image,
  User,
  Banknote
} from 'lucide-react';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface ContentReport {
  id: string;
  reported_user_id: string;
  reported_user_name: string;
  reported_user_email: string;
  reporter_id: string;
  reporter_name: string;
  content_type: 'profile' | 'message' | 'photo';
  content_id: string;
  content_preview: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  admin_notes?: string;
  action_taken?: string;
  created_at: string;
  reviewed_at?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  reports_count: number;
  last_active: string;
}

export default function ContentModerationPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  useEffect(() => {
    checkAdminSession();
    fetchReports();
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

  const fetchReports = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockReports: ContentReport[] = [
        {
          id: '1',
          reported_user_id: 'u1',
          reported_user_name: 'Ahmed Ali',
          reported_user_email: 'ahmed@example.com',
          reporter_id: 'u2',
          reporter_name: 'Zara Khan',
          content_type: 'profile',
          content_id: 'p1',
          content_preview: 'Inappropriate profile description with offensive language',
          reason: 'Inappropriate Content',
          description: 'User has used offensive language in their profile description and uploaded inappropriate photos.',
          status: 'pending',
          severity: 'high',
          created_at: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          reported_user_id: 'u3',
          reported_user_name: 'Hassan Sheikh',
          reported_user_email: 'hassan@example.com',
          reporter_id: 'u4',
          reporter_name: 'Fatima Malik',
          content_type: 'message',
          content_id: 'm1',
          content_preview: 'Sending spam messages asking for money',
          reason: 'Spam/Scam',
          description: 'This user is sending messages asking for money and financial information.',
          status: 'reviewed',
          severity: 'critical',
          admin_notes: 'Confirmed spam behavior. User suspended.',
          action_taken: 'Account suspended for 30 days',
          created_at: '2024-01-19T14:20:00Z',
          reviewed_at: '2024-01-19T16:00:00Z'
        },
        {
          id: '3',
          reported_user_id: 'u5',
          reported_user_name: 'Sara Ahmed',
          reported_user_email: 'sara@example.com',
          reporter_id: 'u6',
          reporter_name: 'Ali Khan',
          content_type: 'photo',
          content_id: 'ph1',
          content_preview: 'Fake profile photos',
          reason: 'Fake Profile',
          description: 'Using someone else\'s photos. This is not the real person.',
          status: 'dismissed',
          severity: 'medium',
          admin_notes: 'Investigated - photos are legitimate.',
          created_at: '2024-01-18T09:15:00Z',
          reviewed_at: '2024-01-18T11:30:00Z'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockUsers: UserProfile[] = [
        {
          id: 'u1',
          name: 'Ahmed Ali',
          email: 'ahmed@example.com',
          status: 'active',
          reports_count: 2,
          last_active: '2024-01-20T08:00:00Z'
        },
        {
          id: 'u3',
          name: 'Hassan Sheikh',
          email: 'hassan@example.com',
          status: 'suspended',
          reports_count: 5,
          last_active: '2024-01-19T12:00:00Z'
        },
        {
          id: 'u7',
          name: 'Suspicious User',
          email: 'suspicious@example.com',
          status: 'banned',
          reports_count: 10,
          last_active: '2024-01-15T10:00:00Z'
        }
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

  const handleReportAction = async (reportId: string, action: 'dismiss' | 'take_action') => {
    try {
      // Mock implementation - replace with actual Supabase update
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: action === 'dismiss' ? 'dismissed' : 'action_taken',
              admin_notes: adminNotes,
              action_taken: action === 'take_action' ? actionTaken : undefined,
              reviewed_at: new Date().toISOString()
            }
          : report
      ));
      setIsReportDialogOpen(false);
      setSelectedReport(null);
      setAdminNotes('');
      setActionTaken('');
    } catch (error) {
      console.error('Error processing report:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    try {
      // Mock implementation - replace with actual Supabase update
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'banned' }
          : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'critical':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d]">Critical</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      case 'action_taken':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d]">Action Taken</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800">Dismissed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-[#ee406d]/10 text-[#ee406d]">Banned</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return <User className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'photo':
        return <Image className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reported_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
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
    { icon: Banknote, label: 'Payments', href: '/admin/payments' },
    { icon: Shield, label: 'Content', href: '/admin/content', active: true },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Gift, label: 'Promo Codes', href: '/admin/promo-codes' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const criticalReports = reports.filter(r => r.severity === 'critical').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-humsafar-600 to-humsafar-700 shadow-xl transition-all duration-300 flex flex-col`}>
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
              <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600">Monitor and manage reported content and user behavior</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Flag Content
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
                <CardTitle className="text-sm font-medium text-gray-600">Pending Reports</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{pendingReports}</div>
                <p className="text-xs text-gray-500">Awaiting review</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Reports</CardTitle>
                <AlertTriangle className="h-5 w-5 text-[#ee406d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{criticalReports}</div>
                <p className="text-xs text-gray-500">High priority issues</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Suspended Users</CardTitle>
                <EyeOff className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{suspendedUsers}</div>
                <p className="text-xs text-gray-500">Temporarily restricted</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Banned Users</CardTitle>
                <Ban className="h-5 w-5 text-[#ee406d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{bannedUsers}</div>
                <p className="text-xs text-gray-500">Permanently banned</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === 'reports' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('reports')}
                className={activeTab === 'reports' ? 'bg-white shadow-sm' : ''}
              >
                <Flag className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('users')}
                className={activeTab === 'users' ? 'bg-white shadow-sm' : ''}
              >
                <Users className="h-4 w-4 mr-2" />
                Flagged Users
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={activeTab === 'reports' ? "Search reports..." : "Search users..."}
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
                {activeTab === 'reports' ? (
                  <>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="action_taken">Action Taken</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {activeTab === 'reports' && (
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'reports' ? (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                <CardDescription>Review and manage reported content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex items-start justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-[#ee406d]/10 rounded-full flex items-center justify-center">
                          {getContentTypeIcon(report.content_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{report.reported_user_name}</h3>
                            {getSeverityBadge(report.severity)}
                            {getStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Reported by:</span> {report.reporter_name}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Reason:</span> {report.reason}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            <span className="font-medium">Content:</span> {report.content_preview}
                          </p>
                          {report.admin_notes && (
                            <p className="text-xs text-blue-600 mb-1">
                              <span className="font-medium">Admin Notes:</span> {report.admin_notes}
                            </p>
                          )}
                          {report.action_taken && (
                            <p className="text-xs text-green-600">
                              <span className="font-medium">Action:</span> {report.action_taken}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                        {report.status === 'pending' && (
                          <Dialog open={isReportDialogOpen && selectedReport?.id === report.id} onOpenChange={(open) => {
                            setIsReportDialogOpen(open);
                            if (!open) {
                              setSelectedReport(null);
                              setAdminNotes('');
                              setActionTaken('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Content Report</DialogTitle>
                                <DialogDescription>
                                  Review and take action on the report against {report.reported_user_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Reported User</Label>
                                    <p className="text-sm text-gray-600">{report.reported_user_name}</p>
                                    <p className="text-xs text-gray-500">{report.reported_user_email}</p>
                                  </div>
                                  <div>
                                    <Label>Reporter</Label>
                                    <p className="text-sm text-gray-600">{report.reporter_name}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Content Type & Reason</Label>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline">{report.content_type}</Badge>
                                    <Badge variant="outline">{report.reason}</Badge>
                                    {getSeverityBadge(report.severity)}
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm text-gray-600">{report.description}</p>
                                </div>
                                <div>
                                  <Label>Content Preview</Label>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{report.content_preview}</p>
                                </div>
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add your review notes..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="action-taken">Action Taken (if any)</Label>
                                  <Input
                                    id="action-taken"
                                    placeholder="e.g., Account suspended for 7 days"
                                    value={actionTaken}
                                    onChange={(e) => setActionTaken(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleReportAction(report.id, 'dismiss')}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss
                                </Button>
                                <Button 
                                  onClick={() => handleReportAction(report.id, 'take_action')}
                                  className="bg-[#ee406d] hover:bg-[#ee406d]/90"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Take Action
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Flagged Users</CardTitle>
                <CardDescription>Manage users with multiple reports or violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {user.reports_count} reports
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              Last active: {new Date(user.last_active).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getUserStatusBadge(user.status)}
                        <div className="flex items-center space-x-2">
                          {user.status === 'active' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                              >
                                <EyeOff className="h-3 w-3 mr-1" />
                                Suspend
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="text-[#ee406d] hover:text-[#ee406d]"
                              >
                                <Ban className="h-3 w-3 mr-1" />
                                Ban
                              </Button>
                            </>
                          )}
                          {user.status === 'suspended' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'activate')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activate
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="text-[#ee406d] hover:text-[#ee406d]"
                              >
                                <Ban className="h-3 w-3 mr-1" />
                                Ban
                              </Button>
                            </>
                          )}
                          {user.status === 'banned' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'activate')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Unban
                            </Button>
                          )}
                        </div>
                      </div>
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