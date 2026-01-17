// ============================================
// ENTERPRISE USER MANAGEMENT - DATA LAYER
// ============================================

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
  linkedEntityId: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  targetId: string;
  targetName: string;
  details: string;
  category: 'USER_MANAGEMENT' | 'AUTHENTICATION' | 'ROLE_CHANGE' | 'STATUS_CHANGE' | 'IMPERSONATION';
}

// ============================================
// REALISTIC NAME DATA
// ============================================

const doctorFirstNames = [
  'Emily', 'James', 'Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert',
  'Amanda', 'Christopher', 'Jessica', 'Daniel', 'Megan', 'Andrew', 'Rachel',
  'William', 'Nicole', 'Thomas', 'Stephanie', 'Matthew'
];

const doctorLastNames = [
  'Carter', 'Wilson', 'Chen', 'Rodriguez', 'Patel', 'Kim', 'Thompson', 'Garcia',
  'Martinez', 'Brown', 'Anderson', 'Taylor', 'Lee', 'Johnson', 'Williams',
  'Miller', 'Davis', 'Moore', 'Jackson', 'White'
];

const patientFirstNames = [
  'Michael', 'John', 'Patricia', 'Mary', 'Robert', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Charles', 'Karen',
  'Thomas', 'Nancy', 'Christopher', 'Lisa', 'Daniel', 'Betty', 'Matthew', 'Margaret',
  'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Kimberly', 'Steven', 'Emily',
  'Paul', 'Donna', 'Andrew', 'Michelle', 'Joshua', 'Dorothy', 'Kenneth', 'Carol',
  'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie',
  'Ronald', 'Rebecca'
];

const patientLastNames = [
  'Thompson', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

// ============================================
// GENERATE DUMMY USERS
// ============================================

const generateRandomDate = (startYear: number, endYear: number): string => {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
};

const generateRecentDate = (): string | null => {
  if (Math.random() < 0.15) return null; // 15% never logged in
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Generate 3 Admins
const generateAdmins = (): SystemUser[] => [
  {
    id: 'usr_admin_001',
    email: 'admin@healthapp.demo',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2020-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    linkedEntityId: null,
  },
  {
    id: 'usr_admin_002',
    email: 'admin.support@healthapp.demo',
    firstName: 'Helen',
    lastName: 'Morrison',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2021-03-15T08:30:00Z',
    lastLoginAt: generateRecentDate(),
    linkedEntityId: null,
  },
  {
    id: 'usr_admin_003',
    email: 'admin.ops@healthapp.demo',
    firstName: 'Marcus',
    lastName: 'Chen',
    role: 'ADMIN',
    status: 'INACTIVE',
    createdAt: '2022-06-20T14:00:00Z',
    lastLoginAt: '2023-12-01T09:00:00Z',
    linkedEntityId: null,
  },
];

// Generate 20 Doctors
const generateDoctors = (): SystemUser[] => {
  const doctors: SystemUser[] = [];
  
  for (let i = 0; i < 20; i++) {
    const firstName = doctorFirstNames[i];
    const lastName = doctorLastNames[i];
    const docId = `doc_${String(i + 1).padStart(3, '0')}`;
    
    doctors.push({
      id: `usr_doc_${String(i + 1).padStart(3, '0')}`,
      email: `doctor${String(i + 1).padStart(2, '0')}@healthapp.demo`,
      firstName,
      lastName,
      role: 'DOCTOR',
      status: i < 17 ? 'ACTIVE' : 'INACTIVE', // 3 inactive doctors
      createdAt: generateRandomDate(2019, 2023),
      lastLoginAt: generateRecentDate(),
      linkedEntityId: docId,
    });
  }
  
  return doctors;
};

// Generate 50 Patients
const generatePatients = (): SystemUser[] => {
  const patients: SystemUser[] = [];
  
  for (let i = 0; i < 50; i++) {
    const firstName = patientFirstNames[i];
    const lastName = patientLastNames[i];
    const patId = `pat_${String(i + 100).padStart(3, '0')}`;
    
    patients.push({
      id: `usr_pat_${String(i + 1).padStart(3, '0')}`,
      email: `patient${String(i + 1).padStart(2, '0')}@healthapp.demo`,
      firstName,
      lastName,
      role: 'PATIENT',
      status: i < 45 ? 'ACTIVE' : 'INACTIVE', // 5 inactive patients
      createdAt: generateRandomDate(2020, 2024),
      lastLoginAt: generateRecentDate(),
      linkedEntityId: patId,
    });
  }
  
  // Override first patient to match existing demo data
  patients[0] = {
    ...patients[0],
    id: 'usr_pat_001',
    email: 'michael.thompson@email.com',
    firstName: 'Michael',
    lastName: 'Thompson',
    linkedEntityId: 'pat_042',
  };
  
  return patients;
};

// ============================================
// EXPORTED DATA
// ============================================

export const systemUsers: SystemUser[] = [
  ...generateAdmins(),
  ...generateDoctors(),
  ...generatePatients(),
];

// Initial audit log (mock historical data)
export const initialAuditLog: AuditLogEntry[] = [
  {
    id: 'audit_001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actorId: 'usr_admin_001',
    actorName: 'System Administrator',
    action: 'USER_ACTIVATED',
    targetId: 'usr_doc_015',
    targetName: 'Dr. William Miller',
    details: 'User account was activated',
    category: 'STATUS_CHANGE',
  },
  {
    id: 'audit_002',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actorId: 'usr_admin_002',
    actorName: 'Helen Morrison',
    action: 'ROLE_CHANGED',
    targetId: 'usr_pat_025',
    targetName: 'Mark Sanchez',
    details: 'Role changed from PATIENT to DOCTOR',
    category: 'ROLE_CHANGE',
  },
  {
    id: 'audit_003',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actorId: 'usr_admin_001',
    actorName: 'System Administrator',
    action: 'USER_CREATED',
    targetId: 'usr_pat_048',
    targetName: 'Timothy Nelson',
    details: 'New user account created with role PATIENT',
    category: 'USER_MANAGEMENT',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getUserById = (id: string): SystemUser | undefined => {
  return systemUsers.find(u => u.id === id);
};

export const getUserByEmail = (email: string): SystemUser | undefined => {
  return systemUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getUsersByRole = (role: UserRole): SystemUser[] => {
  return systemUsers.filter(u => u.role === role);
};

export const getActiveUsers = (): SystemUser[] => {
  return systemUsers.filter(u => u.status === 'ACTIVE');
};

export const formatUserFullName = (user: SystemUser): string => {
  if (user.role === 'DOCTOR') {
    return `Dr. ${user.firstName} ${user.lastName}`;
  }
  return `${user.firstName} ${user.lastName}`;
};

// Map old roles to new roles for compatibility
export const mapLegacyRole = (role: string): UserRole => {
  const mapping: Record<string, UserRole> = {
    'patient': 'PATIENT',
    'doctor': 'DOCTOR',
    'admin': 'ADMIN',
  };
  return mapping[role.toLowerCase()] || 'PATIENT';
};

export const mapRoleToLegacy = (role: UserRole): 'patient' | 'doctor' | 'admin' => {
  const mapping: Record<UserRole, 'patient' | 'doctor' | 'admin'> = {
    'PATIENT': 'patient',
    'DOCTOR': 'doctor',
    'ADMIN': 'admin',
  };
  return mapping[role];
};
