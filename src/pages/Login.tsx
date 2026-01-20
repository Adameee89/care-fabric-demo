import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Heart, User, Stethoscope, Shield, ArrowLeft, Smartphone, CheckCircle2, Loader2, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { UserRole } from '@/data/mockData';
import { SystemUser } from '@/data/usersData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithUser, isAuthenticated } = useAuth();
  const { users } = useUserManagement();
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [step, setStep] = useState<'role' | 'user-select' | 'mfa'>('role');
  const [isLoading, setIsLoading] = useState(false);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check for role in URL params
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole | null;
    if (roleParam && ['patient', 'doctor', 'admin'].includes(roleParam)) {
      setSelectedRole(roleParam);
      setStep('user-select');
    }
  }, [searchParams]);

  // Filter users by selected role and search query
  const filteredUsers = useMemo(() => {
    if (!selectedRole) return [];
    
    const roleMap: Record<UserRole, 'ADMIN' | 'DOCTOR' | 'PATIENT'> = {
      'admin': 'ADMIN',
      'doctor': 'DOCTOR',
      'patient': 'PATIENT',
    };
    
    let roleUsers = users.filter(u => u.role === roleMap[selectedRole] && u.status === 'ACTIVE');
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      roleUsers = roleUsers.filter(u => 
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    }
    
    return roleUsers;
  }, [users, selectedRole, searchQuery]);

  const roles = [
    {
      id: 'patient' as UserRole,
      label: 'Patient',
      description: 'Access your health records, appointments, and communicate with your doctors.',
      icon: User,
      color: 'primary',
    },
    {
      id: 'doctor' as UserRole,
      label: 'Doctor',
      description: 'Manage patients, appointments, prescriptions, and access clinical tools.',
      icon: Stethoscope,
      color: 'info',
    },
    {
      id: 'admin' as UserRole,
      label: 'Administrator',
      description: 'Full system access for user management, analytics, and configuration.',
      icon: Shield,
      color: 'secondary',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedUser(null);
    setSearchQuery('');
    setStep('user-select');
  };

  const handleUserSelect = (user: SystemUser) => {
    setSelectedUser(user);
    setStep('mfa');
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all digits are entered
    if (index === 5 && value) {
      handleMfaSubmit();
    }
  };

  const handleMfaSubmit = () => {
    setIsLoading(true);
    // Simulate MFA verification
    setTimeout(() => {
      if (selectedUser) {
        loginWithUser(selectedUser);
        navigate('/dashboard');
      }
    }, 1500);
  };

  const handleBack = () => {
    if (step === 'mfa') {
      setStep('user-select');
      setMfaCode(['', '', '', '', '', '']);
    } else if (step === 'user-select') {
      setStep('role');
      setSelectedRole(null);
      setSelectedUser(null);
      setSearchQuery('');
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, string> = {
      primary: isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
      info: isSelected ? 'border-info bg-info/5' : 'border-border hover:border-info/50',
      secondary: isSelected ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50',
    };
    return colors[color] || colors.primary;
  };

  const getRoleBadgeColor = (role: 'ADMIN' | 'DOCTOR' | 'PATIENT') => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'DOCTOR': return 'default';
      case 'PATIENT': return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">
              Medi<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-display font-bold text-white leading-tight">
              Your Health Journey,<br />
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md">
              Access your complete healthcare experience in one secure platform. 
              Connect with providers, manage records, and take control of your health.
            </p>
          </div>

          {/* Demo Notice */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Demo Mode Active</h3>
                <p className="text-white/60 text-sm">
                  This is a demonstration environment with simulated data. 
                  No real medical information is used or stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">
              Medi<span className="gradient-text">Connect</span>
            </span>
          </Link>

          {/* Back Button */}
          {step !== 'role' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">Welcome to MediConnect</h2>
                <p className="text-muted-foreground">Select your role to continue to the demo.</p>
              </div>

              <div className="space-y-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${getColorClasses(role.color, selectedRole === role.id)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${role.color}/10 flex items-center justify-center flex-shrink-0`}>
                        <role.icon className={`w-6 h-6 text-${role.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Login as {role.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: User Selection */}
          {step === 'user-select' && selectedRole && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Select {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account
                </h2>
                <p className="text-muted-foreground">
                  Choose an account to log in with. You can search by name or email.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* User List */}
              <ScrollArea className="h-[320px] rounded-xl border border-border">
                <div className="p-2 space-y-1">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found matching your search.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="w-full p-3 rounded-lg hover:bg-muted text-left transition-colors flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {user.role === 'DOCTOR' ? 'Dr. ' : ''}{user.firstName} {user.lastName}
                            </p>
                            <Badge variant={getRoleBadgeColor(user.role)} className="text-[10px] px-1.5 py-0">
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>

              <p className="text-xs text-muted-foreground text-center">
                Showing {filteredUsers.length} active {selectedRole}(s)
              </p>
            </div>
          )}

          {/* Step 3: MFA */}
          {step === 'mfa' && selectedUser && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-muted-foreground mb-4">
                  Logging in as <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app.
                  <br />
                  <span className="text-xs">(Demo: Enter any 6 digits)</span>
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {mfaCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`mfa-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>

              <Button 
                onClick={handleMfaSubmit}
                variant="hero" 
                className="w-full" 
                size="lg"
                disabled={isLoading || mfaCode.some(d => !d)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Verify & Login
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn't receive a code?{' '}
                <a href="#" className="text-primary hover:underline">Resend</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
