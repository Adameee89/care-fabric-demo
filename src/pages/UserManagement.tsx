import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEnterpriseAuth } from '@/contexts/EnterpriseAuthContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { AuditLogTable } from '@/components/admin/AuditLogTable';
import { CreateUserDialog } from '@/components/admin/CreateUserDialog';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Heart,
  Users,
  UserPlus,
  Shield,
  Stethoscope,
  User,
  ClipboardList,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser, isAuthenticated, hasRole, logout, isImpersonating } = useEnterpriseAuth();
  const { getUserStats } = useUserManagement();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!hasRole('ADMIN')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, hasRole, navigate]);

  if (!currentUser || !hasRole('ADMIN')) {
    return null;
  }

  const stats = getUserStats();

  return (
    <div className={`min-h-screen bg-background ${isImpersonating ? 'pt-12' : ''}`}>
      <ImpersonationBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">{t('common.appName')}</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <span>/</span>
              <span className="font-medium text-foreground">User Management</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <UserAvatar
                userId={currentUser.linkedEntityId || currentUser.id}
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                size="md"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and access control for your healthcare platform
            </p>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{stats.active}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-destructive" />
                <span className="text-2xl font-bold">{stats.byRole.ADMIN}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-info" />
                <span className="text-2xl font-bold">{stats.byRole.DOCTOR}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold">{stats.byRole.PATIENT}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Log</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  View and manage all users in the system. Use filters to narrow down results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Track all user management actions and system events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditLogTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo Mode Notice */}
        <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
          <p className="text-sm text-warning">
            <strong>Demo Mode:</strong> All changes are stored locally and will persist across browser sessions.
          </p>
        </div>
      </main>

      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};

export default UserManagement;
