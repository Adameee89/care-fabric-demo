import React, { useState } from 'react';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { useEnterpriseAuthSafe } from '@/contexts/EnterpriseAuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { SystemUser, UserRole, formatUserFullName } from '@/data/usersData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield, Stethoscope, User } from 'lucide-react';
import { toast } from 'sonner';

interface RoleChangeDialogProps {
  user: SystemUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  const { updateUserRole, canChangeRole, addAuditEntry } = useUserManagement();
  const { currentUser: enterpriseUser } = useEnterpriseAuthSafe();
  const { user: authUser } = useAuth();
  
  // Bridge between old auth and enterprise auth
  const currentUser = enterpriseUser || (authUser ? {
    id: authUser.id,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    role: authUser.role.toUpperCase() as 'ADMIN' | 'DOCTOR' | 'PATIENT',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    linkedEntityId: null,
  } : null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const validation = canChangeRole(user.id, selectedRole);
  const isDowngradingAdmin = user.role === 'ADMIN' && selectedRole !== 'ADMIN';
  const isSelfDemotion = user.id === currentUser?.id && selectedRole !== 'ADMIN';

  const handleConfirm = () => {
    if (!currentUser) return;
    
    const success = updateUserRole(user.id, selectedRole);
    
    if (success) {
      addAuditEntry({
        actorId: currentUser.id,
        actorName: formatUserFullName(currentUser),
        action: 'ROLE_CHANGED',
        targetId: user.id,
        targetName: formatUserFullName(user),
        details: `Role changed from ${user.role} to ${selectedRole}`,
        category: 'ROLE_CHANGE',
      });
      
      toast.success(`Role updated for ${formatUserFullName(user)}`);
      onOpenChange(false);
    } else {
      toast.error(validation.reason || 'Failed to update role');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4" />;
      case 'DOCTOR': return <Stethoscope className="w-4 h-4" />;
      case 'PATIENT': return <User className="w-4 h-4" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Role</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Change the role for <strong>{formatUserFullName(user)}</strong> ({user.email})
              </p>
              
              <div className="space-y-2">
                <Label>New Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Administrator
                      </div>
                    </SelectItem>
                    <SelectItem value="DOCTOR">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Doctor
                      </div>
                    </SelectItem>
                    <SelectItem value="PATIENT">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Patient
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Warnings */}
              {isDowngradingAdmin && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Warning: Demoting Admin</p>
                    <p className="text-muted-foreground">
                      This user will lose all administrative privileges.
                    </p>
                  </div>
                </div>
              )}

              {isSelfDemotion && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Warning: Self-Demotion</p>
                    <p className="text-muted-foreground">
                      You are about to demote yourself. You will lose access to admin features.
                    </p>
                  </div>
                </div>
              )}

              {!validation.allowed && selectedRole !== user.role && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm text-destructive">
                    {validation.reason}
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={selectedRole === user.role || !validation.allowed}
            className={isDowngradingAdmin ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            Change Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
