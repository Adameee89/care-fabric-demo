import React from 'react';
import { useEnterpriseAuth } from '@/contexts/EnterpriseAuthContext';
import { formatUserFullName } from '@/data/usersData';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { isImpersonating, currentUser, originalUser, stopImpersonation } = useEnterpriseAuth();

  if (!isImpersonating || !currentUser || !originalUser) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-warning text-warning-foreground">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Impersonating: <strong>{formatUserFullName(currentUser)}</strong>
            <span className="hidden sm:inline"> ({currentUser.email})</span>
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={stopImpersonation}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Return to</span> {originalUser.firstName}
        </Button>
      </div>
    </div>
  );
};
