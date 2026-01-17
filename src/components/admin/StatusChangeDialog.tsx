import React from 'react';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { useEnterpriseAuth } from '@/contexts/EnterpriseAuthContext';
import { SystemUser, formatUserFullName } from '@/data/usersData';
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
import { AlertTriangle, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

interface StatusChangeDialogProps {
  user: SystemUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  const { updateUserStatus, canDeactivateUser, addAuditEntry } = useUserManagement();
  const { currentUser } = useEnterpriseAuth();

  const isActivating = user.status === 'INACTIVE';
  const newStatus = isActivating ? 'ACTIVE' : 'INACTIVE';
  const validation = isActivating ? { allowed: true } : canDeactivateUser(user.id);
  const isDeactivatingSelf = user.id === currentUser?.id && !isActivating;

  const handleConfirm = () => {
    if (!currentUser) return;
    
    const success = updateUserStatus(user.id, newStatus);
    
    if (success) {
      addAuditEntry({
        actorId: currentUser.id,
        actorName: formatUserFullName(currentUser),
        action: isActivating ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        targetId: user.id,
        targetName: formatUserFullName(user),
        details: `User status changed to ${newStatus}`,
        category: 'STATUS_CHANGE',
      });
      
      toast.success(`${formatUserFullName(user)} has been ${isActivating ? 'activated' : 'deactivated'}`);
      onOpenChange(false);
    } else {
      toast.error(validation.reason || 'Failed to update status');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isActivating ? (
              <>
                <Power className="w-5 h-5 text-green-500" />
                Activate User
              </>
            ) : (
              <>
                <PowerOff className="w-5 h-5 text-destructive" />
                Deactivate User
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to {isActivating ? 'activate' : 'deactivate'}{' '}
                <strong>{formatUserFullName(user)}</strong>?
              </p>

              {!isActivating && (
                <div className="text-sm text-muted-foreground">
                  <p>Deactivating this user will:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Prevent them from logging in</li>
                    <li>Terminate any active sessions</li>
                    <li>Preserve their data for potential reactivation</li>
                  </ul>
                </div>
              )}

              {isActivating && (
                <div className="text-sm text-muted-foreground">
                  <p>Activating this user will:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Allow them to log in again</li>
                    <li>Restore their access based on their role</li>
                  </ul>
                </div>
              )}

              {isDeactivatingSelf && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Warning: Self-Deactivation</p>
                    <p className="text-muted-foreground">
                      You are about to deactivate your own account. You will be logged out immediately.
                    </p>
                  </div>
                </div>
              )}

              {!validation.allowed && (
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
            disabled={!validation.allowed}
            className={!isActivating ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}
          >
            {isActivating ? 'Activate User' : 'Deactivate User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
