/**
 * MSME 360 Corporate Governance & Role System
 * Defined based on industry-standard startup hierarchies & L1-L6 Industrial Grades.
 * 
 * Access Levels (RoleLevel):
 * 0: Governance (Board/Owner) -> /admin/governance
 * 1: Executive (C-Suite/L6) -> /admin/executive
 * 2: Operations (Director/L5) -> /admin/operations
 * 3: Management (Manager/L4) -> /internal/manager
 * 4: Execution (Lead/Staff/L2-L3) -> /internal/staff
 * 5: Associate (Junior/Intern/L1) -> /internal/associate
 * 6: External (Founder/User) -> /dashboard
 */

export type RoleLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * MSME 360 Industrial Job Architecture (L1 - L6)
 * Standards based on Indeed & PHP HR Corporate Hierarchy models.
 */

export type CareerLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface LevelDefinition {
  level: CareerLevel;
  title: string;
  description: string;
  minYears: number;
}

export const JOB_LEVELS: Record<CareerLevel, LevelDefinition> = {
  L1: {
    level: 'L1',
    title: 'Individual Contributor / Junior Staff',
    description: 'Entry-level professionals, interns, and trainees focusing on execution.',
    minYears: 0,
  },
  L2: {
    level: 'L2',
    title: 'Associate / Senior Individual Contributor',
    description: 'Experienced professionals managing independent tasks and smaller projects.',
    minYears: 2,
  },
  L3: {
    level: 'L3',
    title: 'Senior / Lead / Senior Associate',
    description: 'Specialists leading specific technical areas or small project teams.',
    minYears: 4,
  },
  L4: {
    level: 'L4',
    title: 'Manager / Team Lead',
    description: 'Operational leadership focusing on people management and delivery.',
    minYears: 6,
  },
  L5: {
    level: 'L5',
    title: 'Director / Department Head',
    description: 'Strategic leadership focusing on department goals and resource allocation.',
    minYears: 8,
  },
  L6: {
    level: 'L6',
    title: 'Executive / C-Suite / Principal',
    description: 'Top-level governance and strategic direction (CEO, Managing Partner, CTO).',
    minYears: 12,
  }
};

export interface AppRole {
  id: string;
  label: string;
  level: RoleLevel;
  careerLevel?: CareerLevel;
  department?: 'Management' | 'Executive' | 'Operations' | 'Technical' | 'Product' | 'People' | 'External';
}

export const STARTUP_ROLES: Record<string, AppRole> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    level: 0,
    careerLevel: 'L6',
    department: 'Executive',
  },
  managing_partner: {
    id: 'managing_partner',
    label: 'Managing Partner',
    level: 1,
    careerLevel: 'L6',
    department: 'Management',
  },
  ceo: {
    id: 'ceo',
    label: 'CEO',
    level: 1,
    careerLevel: 'L6',
    department: 'Management',
  },
  cto: {
    id: 'cto',
    label: 'CTO',
    level: 1,
    careerLevel: 'L6',
    department: 'Technical',
  },
  cfo: {
    id: 'cfo',
    label: 'CFO',
    level: 1,
    careerLevel: 'L6',
    department: 'Operations',
  },
  coo: {
    id: 'coo',
    label: 'COO',
    level: 1,
    careerLevel: 'L6',
    department: 'Operations',
  },
  cmo: {
    id: 'cmo',
    label: 'CMO',
    level: 1,
    careerLevel: 'L6',
    department: 'Management',
  },
  
  // Level 2 (L5 - Directors)
  engineering_director: {
    id: 'engineering_director',
    label: 'Director of Engineering',
    level: 2,
    careerLevel: 'L5',
    department: 'Technical',
  },
  product_director: {
    id: 'product_director',
    label: 'Director of Product',
    level: 2,
    careerLevel: 'L5',
    department: 'Product',
  },
  
  // Level 3 (L4 - Managers)
  hr_manager: {
    id: 'hr_manager',
    label: 'HR Manager',
    level: 3,
    careerLevel: 'L4',
    department: 'People',
  },
  recruiter: {
    id: 'recruiter',
    label: 'Recruiter',
    level: 3,
    careerLevel: 'L4',
    department: 'People',
  },
  
  // Level 4 (L2/L3 - Senior Staff/Lead)
  staff: {
    id: 'staff',
    label: 'Employee',
    level: 4,
    careerLevel: 'L2',
    department: 'Operations',
  },
  analyst: {
    id: 'analyst',
    label: 'Analyst',
    level: 4,
    careerLevel: 'L3',
    department: 'Operations',
  },
  
  // Level 5 (L1 - Associate/Intern)
  intern: {
    id: 'intern',
    label: 'Intern',
    level: 5,
    careerLevel: 'L1',
    department: 'Operations',
  },
  associate: {
    id: 'associate',
    label: 'Associate',
    level: 5,
    careerLevel: 'L1',
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

export const getCareerLevelMetadata = (roleId: string) => {
  const role = getRoleById(roleId);
  if (!role.careerLevel) return null;
  return JOB_LEVELS[role.careerLevel];
};

export const getLevelTitle = (level: string) => {
  return JOB_LEVELS[level as CareerLevel]?.title || 'Member';
};
