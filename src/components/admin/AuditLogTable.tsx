import React, { useState } from 'react';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { AuditLogEntry } from '@/data/usersData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const ITEMS_PER_PAGE = 15;

export const AuditLogTable: React.FC = () => {
  const { auditLog } = useUserManagement();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    let result = [...auditLog];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log =>
        log.actorName.toLowerCase().includes(query) ||
        log.targetName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter !== 'ALL') {
      result = result.filter(log => log.category === categoryFilter);
    }
    
    return result;
  }, [auditLog, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryBadge = (category: AuditLogEntry['category']) => {
    const variants: Record<AuditLogEntry['category'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      USER_MANAGEMENT: { variant: 'default', label: 'User Mgmt' },
      AUTHENTICATION: { variant: 'secondary', label: 'Auth' },
      ROLE_CHANGE: { variant: 'outline', label: 'Role' },
      STATUS_CHANGE: { variant: 'outline', label: 'Status' },
      IMPERSONATION: { variant: 'destructive', label: 'Impersonation' },
    };
    
    const config = variants[category];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('CREATED')) return '➕';
    if (action.includes('ACTIVATED')) return '✅';
    if (action.includes('DEACTIVATED')) return '⛔';
    if (action.includes('ROLE')) return '🔄';
    if (action.includes('SESSION')) return '🔐';
    if (action.includes('IMPERSONATION')) return '👤';
    return '📝';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        
        <Select 
          value={categoryFilter} 
          onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="USER_MANAGEMENT">User Management</SelectItem>
            <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
            <SelectItem value="ROLE_CHANGE">Role Change</SelectItem>
            <SelectItem value="STATUS_CHANGE">Status Change</SelectItem>
            <SelectItem value="IMPERSONATION">Impersonation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedLogs.length} of {filteredLogs.length} entries
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No audit entries found
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{format(new Date(log.timestamp), 'MMM d, HH:mm')}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <span>{getActionIcon(log.action)}</span>
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.actorName}</TableCell>
                  <TableCell className="text-muted-foreground">{log.targetName}</TableCell>
                  <TableCell>{getCategoryBadge(log.category)}</TableCell>
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
    </div>
  );
};
