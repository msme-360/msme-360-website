/**
 * MSME 360 Corporate Governance & Role System
 * Defined based on industry-standard startup hierarchies & L1-L6 Industrial Grades.
 * 
 * Levels:
 * 0: Governance (Board/Owner) -> /admin/governance
 * 1: Executive (C-Suite/L6) -> /admin/executive
 * 2: Operations (Director/L5) -> /admin/operations
 * 3: Management (Manager/L4) -> /internal/manager
 * 4: Execution (Lead/Staff/L2-L3) -> /internal/staff
 * 5: Associate (Junior/Intern/L1) -> /internal/associate
 * 6: External (Founder/User) -> /dashboard
 */

export type RoleLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AppRole {
  id: string;
  label: string;
  level: RoleLevel;
  department?: 'Management' | 'Executive' | 'Operations' | 'Technical' | 'Product' | 'People' | 'External';
}

export const STARTUP_ROLES: Record<string, AppRole> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    level: 0,
    department: 'Executive',
  },
  managing_partner: {
    id: 'managing_partner',
    label: 'Managing Partner',
    level: 1,
    department: 'Management',
  },
  ceo: {
    id: 'ceo',
    label: 'CEO',
    level: 1,
    department: 'Management',
  },
  cto: {
    id: 'cto',
    label: 'CTO',
    level: 1,
    department: 'Technical',
  },
  cfo: {
    id: 'cfo',
    label: 'CFO',
    level: 1,
    department: 'Operations',
  },
  coo: {
    id: 'coo',
    label: 'COO',
    level: 1,
    department: 'Operations',
  },
  cmo: {
    id: 'cmo',
    label: 'CMO',
    level: 1,
    department: 'Management',
  },
  
  // Level 2 (L5 - Directors)
  engineering_director: {
    id: 'engineering_director',
    label: 'Director of Engineering',
    level: 2,
    department: 'Technical',
  },
  product_director: {
    id: 'product_director',
    label: 'Director of Product',
    level: 2,
    department: 'Product',
  },
  
  // Level 3 (L4 - Managers)
  hr_manager: {
    id: 'hr_manager',
    label: 'HR Manager',
    level: 3,
    department: 'People',
  },
  recruiter: {
    id: 'recruiter',
    label: 'Recruiter',
    level: 3,
    department: 'People',
  },
  
  // Level 4 (L2/L3 - Senior Staff/Lead)
  staff: {
    id: 'staff',
    label: 'Employee',
    level: 4,
    department: 'Operations',
  },
  analyst: {
    id: 'analyst',
    label: 'Analyst',
    level: 4,
    department: 'Operations',
  },
  
  // Level 5 (L1 - Associate/Intern)
  intern: {
    id: 'intern',
    label: 'Intern',
    level: 5,
    department: 'Operations',
  },
  associate: {
    id: 'associate',
    label: 'Associate',
    level: 5,
    department: 'Operations',
  },
  
  // Level 6 (External)
  user: {
    id: 'user',
    label: 'User',
    level: 6,
    department: 'External',
  },
};

export const getRoleById = (id: string): AppRole => {
  return STARTUP_ROLES[id] || STARTUP_ROLES.user;
};

export const hasPermission = (userRole: string, requiredLevel: RoleLevel): boolean => {
  const role = getRoleById(userRole);
  return role.level <= requiredLevel;
};
