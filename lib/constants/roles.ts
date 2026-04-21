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

export type RoleLevel = 0 | 1 | 1.5 | 2 | 3 | 3.5 | 4 | 5 | 6;

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

export const JOB_LEVELS: Record<CareerLevel | string, LevelDefinition> = {
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
  department?: 'Management' | 'Executive' | 'Operations' | 'Technical' | 'Product' | 'People' | 'External' | 'Finance' | 'Marketing' | 'Governance';
}

export const STARTUP_ROLES: Record<string, AppRole> = {
  // Level 0: Governance
  super_admin: { id: 'super_admin', label: 'Super Admin', level: 0, careerLevel: 'L6', department: 'Governance' },
  managing_partner: { id: 'managing_partner', label: 'Managing Partner', level: 0, careerLevel: 'L6', department: 'Governance' },
  board_member: { id: 'board_member', label: 'Board of Directors', level: 0, careerLevel: 'L6', department: 'Governance' },

  // Level 1: Executive (C-Suite)
  ceo: { id: 'ceo', label: 'CEO', level: 1, careerLevel: 'L6', department: 'Management' },
  cto: { id: 'cto', label: 'CTO', level: 1, careerLevel: 'L6', department: 'Technical' },
  cfo: { id: 'cfo', label: 'CFO', level: 1, careerLevel: 'L6', department: 'Finance' },
  coo: { id: 'coo', label: 'COO', level: 1, careerLevel: 'L6', department: 'Operations' },
  cmo: { id: 'cmo', label: 'CMO', level: 1, careerLevel: 'L6', department: 'Marketing' },
  chro: { id: 'chro', label: 'CHRO', level: 1, careerLevel: 'L6', department: 'People' },
  cio: { id: 'cio', label: 'CIO', level: 1, careerLevel: 'L6', department: 'Technical' },

  // Level 1.5: Senior Management (VPs)
  vp_engineering: { id: 'vp_engineering', label: 'VP of Engineering', level: 1.5, careerLevel: 'L6', department: 'Technical' },
  vp_product: { id: 'vp_product', label: 'VP of Product', level: 1.5, careerLevel: 'L6', department: 'Product' },
  vp_operations: { id: 'vp_operations', label: 'VP of Operations', level: 1.5, careerLevel: 'L6', department: 'Operations' },
  vp_marketing: { id: 'vp_marketing', label: 'VP of Marketing', level: 1.5, careerLevel: 'L6', department: 'Marketing' },
  vp_finance: { id: 'vp_finance', label: 'VP of Finance', level: 1.5, careerLevel: 'L6', department: 'Finance' },

  // Level 2: Operations (Directors)
  director_engineering: { id: 'director_engineering', label: 'Director of Engineering', level: 2, careerLevel: 'L5', department: 'Technical' },
  director_product: { id: 'director_product', label: 'Director of Product', level: 2, careerLevel: 'L5', department: 'Product' },
  director_operations: { id: 'director_operations', label: 'Director of Operations', level: 2, careerLevel: 'L5', department: 'Operations' },
  director_marketing: { id: 'director_marketing', label: 'Director of Marketing', level: 2, careerLevel: 'L5', department: 'Marketing' },
  director_finance: { id: 'director_finance', label: 'Director of Finance', level: 2, careerLevel: 'L5', department: 'Finance' },

  // Level 3: Management
  hr_manager: { id: 'hr_manager', label: 'HR Manager', level: 3, careerLevel: 'L4', department: 'People' },
  recruiter: { id: 'recruiter', label: 'Recruiter', level: 3, careerLevel: 'L4', department: 'People' },
  engineering_manager: { id: 'engineering_manager', label: 'Engineering Manager', level: 3, careerLevel: 'L4', department: 'Technical' },
  product_manager: { id: 'product_manager', label: 'Product Manager', level: 3, careerLevel: 'L4', department: 'Product' },
  operations_manager: { id: 'operations_manager', label: 'Operations Manager', level: 3, careerLevel: 'L4', department: 'Operations' },

  // Level 3.5: Supervisory (NEW)
  team_lead: { id: 'team_lead', label: 'Team Lead', level: 3.5, careerLevel: 'L4', department: 'Technical' },
  project_lead: { id: 'project_lead', label: 'Project Lead', level: 3.5, careerLevel: 'L4', department: 'Management' },
  supervisor: { id: 'supervisor', label: 'Shift Supervisor', level: 3.5, careerLevel: 'L4', department: 'Operations' },
  coordinator: { id: 'coordinator', label: 'Department Coordinator', level: 3.5, careerLevel: 'L4', department: 'Operations' },

  // Level 4: Staff
  employee: { id: 'employee', label: 'Employee', level: 4, careerLevel: 'L2', department: 'Operations' },
  analyst: { id: 'analyst', label: 'Analyst', level: 4, careerLevel: 'L3', department: 'Operations' },
  software_engineer: { id: 'software_engineer', label: 'Software Engineer', level: 4, careerLevel: 'L3', department: 'Technical' },
  marketing_specialist: { id: 'marketing_specialist', label: 'Marketing Specialist', level: 4, careerLevel: 'L3', department: 'Marketing' },
  financial_analyst: { id: 'financial_analyst', label: 'Financial Analyst', level: 4, careerLevel: 'L3', department: 'Finance' },

  // Level 5: Associate
  intern: { id: 'intern', label: 'Intern', level: 5, careerLevel: 'L1', department: 'Operations' },
  associate: { id: 'associate', label: 'Associate', level: 5, careerLevel: 'L1', department: 'Operations' },
  jr_developer: { id: 'jr_developer', label: 'Junior Developer', level: 5, careerLevel: 'L1', department: 'Technical' },
  trainee: { id: 'trainee', label: 'Trainee', level: 5, careerLevel: 'L1', department: 'Operations' },

  // Level 6: External
  founder: { id: 'founder', label: 'Founder', level: 6, department: 'External' },
  customer: { id: 'customer', label: 'Customer', level: 6, department: 'External' },
  user: { id: 'user', label: 'User', level: 6, department: 'External' },
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
