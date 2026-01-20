import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { UserManagementTable } from './UserManagementTable';
import { AuditLogTable } from './AuditLogTable';
import { CreateUserDialog } from './CreateUserDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserPlus,
  Shield,
  Stethoscope,
  User,
  ClipboardList,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardTabs: React.FC = () => {
  const { t } = useTranslation();
  const { getUserStats } = useUserManagement();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="statistics" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
        
        <TabsContent value="statistics" className="space-y-6">
          <AdminAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          {/* User Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

          {/* Users & Audit Tabs */}
          <Tabs defaultValue="all-users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-users" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">All Users</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Audit Log</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-users">
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
        </TabsContent>
      </Tabs>

      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};
