import React, { useState, useMemo } from 'react';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { useEnterpriseAuthSafe } from '@/contexts/EnterpriseAuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { SystemUser, UserRole, UserStatus, formatUserFullName } from '@/data/usersData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  MoreHorizontal,
  UserCog,
  Power,
  RefreshCw,
  LogIn,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
} from 'lucide-react';
import { RoleChangeDialog } from './RoleChangeDialog';
import { StatusChangeDialog } from './StatusChangeDialog';
import { UserAvatar } from '@/components/UserAvatar';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt' | 'lastLoginAt';
type SortDirection = 'asc' | 'desc';

export const UserManagementTable: React.FC = () => {
  const { users, addAuditEntry, resetUserSession } = useUserManagement();
  const { currentUser: enterpriseUser, impersonate } = useEnterpriseAuthSafe();
  const { user: authUser } = useAuth();
  
  // Bridge between old auth and enterprise auth - create a compatible current user object
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
  
  // Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog state
  const [roleDialogUser, setRoleDialogUser] = useState<SystemUser | null>(null);
  const [statusDialogUser, setStatusDialogUser] = useState<SystemUser | null>(null);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.email.toLowerCase().includes(query) ||
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'ALL') {
      result = result.filter(u => u.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(u => u.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'lastLoginAt':
          const aTime = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
          const bTime = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
          comparison = aTime - bTime;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetSession = (user: SystemUser) => {
    if (!currentUser) return;
    
    resetUserSession(user.id);
    addAuditEntry({
      actorId: currentUser.id,
      actorName: formatUserFullName(currentUser),
      action: 'SESSION_RESET',
      targetId: user.id,
      targetName: formatUserFullName(user),
      details: 'User session was reset (simulated)',
      category: 'USER_MANAGEMENT',
    });
  };

  const handleImpersonate = (user: SystemUser) => {
    if (!currentUser) return;
    
    addAuditEntry({
      actorId: currentUser.id,
      actorName: formatUserFullName(currentUser),
      action: 'IMPERSONATION_STARTED',
      targetId: user.id,
      targetName: formatUserFullName(user),
      details: `Admin started impersonating ${formatUserFullName(user)}`,
      category: 'IMPERSONATION',
    });
    
    impersonate(user);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DOCTOR': return 'default';
      case 'PATIENT': return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    return status === 'ACTIVE' ? 'outline' : 'secondary';
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v as UserRole | 'ALL'); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
            <SelectItem value="PATIENT">Patient</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as UserStatus | 'ALL'); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedUsers.length} of {filteredUsers.length} users
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <SortableHeader field="name">Name</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="email">Email</SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader field="role">Role</SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader field="status">Status</SortableHeader>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <SortableHeader field="createdAt">Created</SortableHeader>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <SortableHeader field="lastLoginAt">Last Login</SortableHeader>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className={user.id === currentUser?.id ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        userId={user.id}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{formatUserFullName(user)}</p>
                        {user.id === currentUser?.id && (
                          <span className="text-xs text-primary">(You)</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(user.status)}
                      className={user.status === 'ACTIVE' ? 'text-green-600 border-green-600' : ''}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {user.lastLoginAt 
                      ? format(new Date(user.lastLoginAt), 'MMM d, yyyy HH:mm')
                      : <span className="text-muted-foreground/50">Never</span>
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => setRoleDialogUser(user)}>
                          <UserCog className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => setStatusDialogUser(user)}>
                          <Power className="w-4 h-4 mr-2" />
                          {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleResetSession(user)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset Session
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => handleImpersonate(user)}
                          disabled={user.id === currentUser?.id || user.status === 'INACTIVE'}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Impersonate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {roleDialogUser && (
        <RoleChangeDialog
          user={roleDialogUser}
          open={!!roleDialogUser}
          onOpenChange={(open) => !open && setRoleDialogUser(null)}
        />
      )}
      
      {statusDialogUser && (
        <StatusChangeDialog
          user={statusDialogUser}
          open={!!statusDialogUser}
          onOpenChange={(open) => !open && setStatusDialogUser(null)}
        />
      )}
    </div>
  );
};
