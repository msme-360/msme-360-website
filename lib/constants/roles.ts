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
  homePath: string;
  careerLevel?: CareerLevel;
  department?: 'Management' | 'Executive' | 'Operations' | 'Technical' | 'Product' | 'People' | 'External' | 'Finance' | 'Marketing' | 'Governance';
}

export const STARTUP_ROLES: Record<string, AppRole> = {
  // Level 0: Governance
  super_admin: { id: 'super_admin', label: 'Super Admin', level: 0, careerLevel: 'L6', department: 'Governance', homePath: '/admin/governance/super_admin' },
  managing_partner: { id: 'managing_partner', label: 'Managing Partner', level: 0, careerLevel: 'L6', department: 'Governance', homePath: '/admin/governance/managing_partner' },
  board_member: { id: 'board_member', label: 'Board of Directors', level: 0, careerLevel: 'L6', department: 'Governance', homePath: '/admin/governance/board_member' },

  // Level 1: Executive (C-Suite)
  ceo: { id: 'ceo', label: 'CEO', level: 1, careerLevel: 'L6', department: 'Management', homePath: '/admin/executive/ceo' },
  cto: { id: 'cto', label: 'CTO', level: 1, careerLevel: 'L6', department: 'Technical', homePath: '/admin/executive/cto' },
  cfo: { id: 'cfo', label: 'CFO', level: 1, careerLevel: 'L6', department: 'Finance', homePath: '/admin/executive/cfo' },
  coo: { id: 'coo', label: 'COO', level: 1, careerLevel: 'L6', department: 'Operations', homePath: '/admin/executive/coo' },
  cmo: { id: 'cmo', label: 'CMO', level: 1, careerLevel: 'L6', department: 'Marketing', homePath: '/admin/executive/cmo' },
  chro: { id: 'chro', label: 'CHRO', level: 1, careerLevel: 'L6', department: 'People', homePath: '/admin/executive/chro' },
  cio: { id: 'cio', label: 'CIO', level: 1, careerLevel: 'L6', department: 'Technical', homePath: '/admin/executive/cio' },

  // Level 1.5: Senior Management (VPs)
  vp_engineering: { id: 'vp_engineering', label: 'VP of Engineering', level: 1.5, careerLevel: 'L6', department: 'Technical', homePath: '/admin/executive/vp_engineering' },
  vp_product: { id: 'vp_product', label: 'VP of Product', level: 1.5, careerLevel: 'L6', department: 'Product', homePath: '/admin/executive/vp_product' },
  vp_operations: { id: 'vp_operations', label: 'VP of Operations', level: 1.5, careerLevel: 'L6', department: 'Operations', homePath: '/admin/executive/vp_operations' },
  vp_marketing: { id: 'vp_marketing', label: 'VP of Marketing', level: 1.5, careerLevel: 'L6', department: 'Marketing', homePath: '/admin/executive/vp_marketing' },
  vp_finance: { id: 'vp_finance', label: 'VP of Finance', level: 1.5, careerLevel: 'L6', department: 'Finance', homePath: '/admin/executive/vp_finance' },

  // Level 2: Operations (Directors)
  director_engineering: { id: 'director_engineering', label: 'Director of Engineering', level: 2, careerLevel: 'L5', department: 'Technical', homePath: '/admin/operations/director_engineering' },
  director_product: { id: 'director_product', label: 'Director of Product', level: 2, careerLevel: 'L5', department: 'Product', homePath: '/admin/operations/director_product' },
  director_operations: { id: 'director_operations', label: 'Director of Operations', level: 2, careerLevel: 'L5', department: 'Operations', homePath: '/admin/operations/director_operations' },
  director_marketing: { id: 'director_marketing', label: 'Director of Marketing', level: 2, careerLevel: 'L5', department: 'Marketing', homePath: '/admin/operations/director_marketing' },
  director_finance: { id: 'director_finance', label: 'Director of Finance', level: 2, careerLevel: 'L5', department: 'Finance', homePath: '/admin/operations/director_finance' },

  // Level 3: Management
  hr_manager: { id: 'hr_manager', label: 'HR Manager', level: 3, careerLevel: 'L4', department: 'People', homePath: '/internal/manager' },
  recruiter: { id: 'recruiter', label: 'Recruiter', level: 3, careerLevel: 'L4', department: 'People', homePath: '/internal/manager' },
  engineering_manager: { id: 'engineering_manager', label: 'Engineering Manager', level: 3, careerLevel: 'L4', department: 'Technical', homePath: '/internal/manager' },
  product_manager: { id: 'product_manager', label: 'Product Manager', level: 3, careerLevel: 'L4', department: 'Product', homePath: '/internal/manager' },
  operations_manager: { id: 'operations_manager', label: 'Operations Manager', level: 3, careerLevel: 'L4', department: 'Operations', homePath: '/internal/manager' },

  // Level 3.5: Supervisory
  team_lead: { id: 'team_lead', label: 'Team Lead', level: 3.5, careerLevel: 'L4', department: 'Technical', homePath: '/internal/manager' },
  project_lead: { id: 'project_lead', label: 'Project Lead', level: 3.5, careerLevel: 'L4', department: 'Management', homePath: '/internal/manager' },
  supervisor: { id: 'supervisor', label: 'Shift Supervisor', level: 3.5, careerLevel: 'L4', department: 'Operations', homePath: '/internal/manager' },
  coordinator: { id: 'coordinator', label: 'Department Coordinator', level: 3.5, careerLevel: 'L4', department: 'Operations', homePath: '/internal/manager' },

  // Level 4: Staff
  employee: { id: 'employee', label: 'Employee', level: 4, careerLevel: 'L2', department: 'Operations', homePath: '/internal/staff' },
  analyst: { id: 'analyst', label: 'Analyst', level: 4, careerLevel: 'L3', department: 'Operations', homePath: '/internal/staff' },
  software_engineer: { id: 'software_engineer', label: 'Software Engineer', level: 4, careerLevel: 'L3', department: 'Technical', homePath: '/internal/staff' },
  marketing_specialist: { id: 'marketing_specialist', label: 'Marketing Specialist', level: 4, careerLevel: 'L3', department: 'Marketing', homePath: '/internal/staff' },
  financial_analyst: { id: 'financial_analyst', label: 'Financial Analyst', level: 4, careerLevel: 'L3', department: 'Finance', homePath: '/internal/staff' },

  // Level 5: Associate
  intern: { id: 'intern', label: 'Intern', level: 5, careerLevel: 'L1', department: 'Operations', homePath: '/internal/associate' },
  associate: { id: 'associate', label: 'Associate', level: 5, careerLevel: 'L1', department: 'Operations', homePath: '/internal/associate' },
  jr_developer: { id: 'jr_developer', label: 'Junior Developer', level: 5, careerLevel: 'L1', department: 'Technical', homePath: '/internal/associate' },
  trainee: { id: 'trainee', label: 'Trainee', level: 5, careerLevel: 'L1', department: 'Operations', homePath: '/internal/associate' },

  // Level 6: External
  founder: { id: 'founder', label: 'Founder', level: 6, department: 'External', homePath: '/dashboard' },
  customer: { id: 'customer', label: 'Customer', level: 6, department: 'External', homePath: '/dashboard' },
  user: { id: 'user', label: 'User', level: 6, department: 'External', homePath: '/dashboard' },
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
