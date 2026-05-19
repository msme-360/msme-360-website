import {
  LayoutDashboard, Settings, Users, ShieldCheck, BarChart3, FileText, Globe,
  Wallet, Zap, Cpu, Lock, Network, Megaphone, PieChart, HardDrive,
  Target, Gauge, Briefcase, Building2, Clock, UserPlus, ClipboardCheck,
  type LucideIcon, History, UserCircle, LineChart, TrendingUp,
  Activity, Calendar
} from "lucide-react";
import { STARTUP_ROLES } from "@/lib/constants/roles";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  url: string;
  visible?: boolean;
  subItems?: {
    title: string;
    url: string;
    icon: LucideIcon;
    id: string;
  }[];
}

export interface NavGroup {
  label: string;
  visible: boolean;
  items: NavItem[];
}

const CORE_INTELLIGENCE = (l: string, roleId: string): NavGroup => ({
  label: "Core Intelligence",
  visible: true,
  items: [
    { title: "Strategic Performance", icon: BarChart3, url: `/${l}/admin/performance/${roleId}` },
    { title: "Company Registry", icon: Globe, url: `/${l}/admin/company/${roleId}` },
    { title: "Workforce Attendance", icon: Clock, url: `/${l}/admin/attendance/${roleId}` },
  ]
});

/**
 * Modular Role Navigation Registry
 * Defines unique sidebars for 41 distinct entities.
 */
export const ROLE_NAV_CONFIG: Record<string, (locale: string) => NavGroup[]> = {
  // --- GOVERNANCE (Level 0) ---
  super_admin: (l) => [
    CORE_INTELLIGENCE(l, 'super_admin'),
    {
      label: "System Governance",
      visible: true,
      items: [
        { title: "Control Center", icon: ShieldCheck, url: `/${l}/admin/governance/super_admin` },
        { title: "Global RBAC", icon: Lock, url: `/${l}/admin/roles` },
        { title: "Network Health", icon: Zap, url: `/${l}/admin/tech/super_admin` },
        { title: "Security Audit", icon: History, url: `/${l}/admin/audit/super_admin` },
        { title: "All Org Meetings", icon: Users, url: `/${l}/admin/governance/super_admin/meetings` },
      ]
    }
  ],
  managing_partner: (l) => [
    CORE_INTELLIGENCE(l, 'managing_partner'),
    {
      label: "Firm Management",
      visible: true,
      items: [
        { title: "Partner Dashboard", icon: Briefcase, url: `/${l}/admin/governance/managing_partner` },
        { title: "Strategic P&L", icon: Wallet, url: `/${l}/admin/governance/managing_partner/finances` },
        { title: "Equity Cap Table", icon: PieChart, url: `/${l}/admin/governance/managing_partner/equity` },
      ]
    }
  ],
  board_member: (l) => [
    CORE_INTELLIGENCE(l, 'board_member'),
    {
      label: "Board Oversight",
      visible: true,
      items: [
        { title: "Governance Portal", icon: Building2, url: `/${l}/admin/governance/board_member` },
        { title: "Performance Alpha", icon: PieChart, url: `/${l}/admin/executive/board_member/performance` },
        { title: "Audit & Compliance", icon: ShieldCheck, url: `/${l}/admin/audit/board_member` },
      ]
    }
  ],

  // --- EXECUTIVE (Level 1) ---
  ceo: (l) => [
    CORE_INTELLIGENCE(l, 'ceo'),
    {
      label: "Presidential Suite",
      visible: true,
      items: [
        { title: "CEO Strategy", icon: Target, url: `/${l}/admin/executive/ceo` },
        { title: "Growth Engine", icon: Zap, url: `/${l}/admin/executive/ceo/performance` },
        { title: "Public Relations", icon: Globe, url: `/${l}/admin/executive/ceo/pr` },
      ]
    }
  ],
  cto: (l) => [
    CORE_INTELLIGENCE(l, 'cto'),
    {
      label: "Tech Oversight",
      visible: true,
      items: [
        { title: "Tech Strategy", icon: Cpu, url: `/${l}/admin/executive/cto` },
        { title: "System Resilience", icon: Zap, url: `/${l}/admin/tech/cto` },
        { title: "Patent Portfolio", icon: FileText, url: `/${l}/admin/tech/cto/ip` },
      ]
    }
  ],
  cfo: (l) => [
    CORE_INTELLIGENCE(l, 'cfo'),
    {
      label: "Financial Fortress",
      visible: true,
      items: [
        { title: "Treasury Hub", icon: Wallet, url: `/${l}/admin/executive/cfo` },
        { title: "Fiscal Performance", icon: BarChart3, url: `/${l}/admin/executive/cfo/performance` },
        { title: "Tax Compliance", icon: ShieldCheck, url: `/${l}/admin/audit/cfo` },
      ]
    }
  ],
  cmo: (l) => [
    {
      label: "Marketing Center",
      visible: true,
      items: [
        { title: "Brand Strategy", icon: Megaphone, url: `/${l}/admin/executive/cmo` },
        { title: "Market Growth", icon: Globe, url: `/${l}/admin/executive/cmo/growth` },
      ]
    }
  ],
  chro: (l) => [
    CORE_INTELLIGENCE(l, 'chro'),
    {
      label: "Human Capital",
      visible: true,
      items: [
        { title: "Culture Board", icon: Users, url: `/${l}/admin/executive/chro` },
        { title: "Talent Intel", icon: PieChart, url: `/${l}/admin/executive/chro/workforce` },
        { title: "Policy Manager", icon: FileText, url: `/${l}/admin/executive/chro/policy` },
      ]
    }
  ],
  cio: (l) => [
    CORE_INTELLIGENCE(l, 'cio'),
    {
      label: "Information Bureau",
      visible: true,
      items: [
        { title: "Data Strategy", icon: HardDrive, url: `/${l}/admin/executive/cio` },
        { title: "Cybersecurity", icon: Lock, url: `/${l}/admin/tech/cio/security` },
        { title: "Enterprise Systems", icon: Network, url: `/${l}/admin/tech/cio` },
      ]
    }
  ],
  coo: (l) => [
    CORE_INTELLIGENCE(l, 'coo'),
    {
      label: "Operations Hub",
      visible: true,
      items: [
        { title: "Ops Strategy", icon: Target, url: `/${l}/admin/executive/coo` },
        { title: "Efficiency Hub", icon: Gauge, url: `/${l}/admin/executive/coo/ops` },
      ]
    }
  ],

  // --- SENIOR MANAGEMENT (Level 1.5) ---
  vp_engineering: (l) => [
    CORE_INTELLIGENCE(l, 'vp_engineering'),
    {
      label: "Engineering Bureau",
      visible: true,
      items: [
        { title: "R&D Strategy", icon: Cpu, url: `/${l}/admin/executive/vp_engineering` },
        { title: "Delivery Velocity", icon: Gauge, url: `/${l}/admin/tech/vp_engineering/velocity` },
        { title: "Asset Lifecycle", icon: HardDrive, url: `/${l}/admin/tech/vp_engineering` },
      ]
    }
  ],
  vp_product: (l) => [
    CORE_INTELLIGENCE(l, 'vp_product'),
    {
      label: "Product Bureau",
      visible: true,
      items: [
        { title: "Product Strategy", icon: Target, url: `/${l}/admin/executive/vp_product` },
        { title: "Market Adoption", icon: Globe, url: `/${l}/admin/executive/vp_product/adoption` },
      ]
    }
  ],
  vp_operations: (l) => [
    CORE_INTELLIGENCE(l, 'vp_operations'),
    {
      label: "Operations Bureau",
      visible: true,
      items: [
        { title: "Ops Oversight", icon: Gauge, url: `/${l}/admin/executive/vp_operations` },
        { title: "Process Flow", icon: Network, url: `/${l}/admin/executive/vp_operations/flows` },
      ]
    }
  ],
  vp_marketing: (l) => [
    CORE_INTELLIGENCE(l, 'vp_marketing'),
    {
      label: "Marketing Bureau",
      visible: true,
      items: [
        { title: "Growth Hub", icon: Megaphone, url: `/${l}/admin/executive/vp_marketing` },
        { title: "Campaign Intel", icon: BarChart3, url: `/${l}/admin/executive/vp_marketing/campaigns` },
      ]
    }
  ],
  vp_finance: (l) => [
    CORE_INTELLIGENCE(l, 'vp_finance'),
    {
      label: "Financial Bureau",
      visible: true,
      items: [
        { title: "Controller Hub", icon: Wallet, url: `/${l}/admin/executive/vp_finance` },
        { title: "Fiscal Review", icon: FileText, url: `/${l}/admin/executive/vp_finance/fiscal` },
      ]
    }
  ],

  // --- OPERATIONS / DIRECTORS (Level 2) ---
  director_engineering: (l) => [
    {
      label: "Engineering Ops",
      visible: true,
      items: [
        { title: "Dev Ops Hub", icon: Target, url: `/${l}/admin/operations/director_engineering` },
        { title: "Infra Controls", icon: Cpu, url: `/${l}/admin/tech/director_engineering` },
      ]
    }
  ],
  director_product: (l) => [
    {
      label: "Product Ops",
      visible: true,
      items: [
        { title: "Feature Hub", icon: LayoutDashboard, url: `/${l}/admin/operations/director_product` },
        { title: "Roadmap Alignment", icon: Target, url: `/${l}/admin/operations/director_product/product` },
      ]
    }
  ],
  director_operations: (l) => [
    {
      label: "Strategic Ops",
      visible: true,
      items: [
        { title: "Process Hub", icon: Gauge, url: `/${l}/admin/operations/director_operations` },
        { title: "Resource Planning", icon: BarChart3, url: `/${l}/admin/operations/director_operations/resources` },
      ]
    }
  ],
  director_marketing: (l) => [
    {
      label: "Marketing Ops",
      visible: true,
      items: [
        { title: "Brand Hub", icon: Megaphone, url: `/${l}/admin/operations/director_marketing` },
        { title: "Campaign ROI", icon: BarChart3, url: `/${l}/admin/operations/director_marketing/roi` },
      ]
    }
  ],
  director_finance: (l) => [
    {
      label: "Finance Ops",
      visible: true,
      items: [
        { title: "Audit Hub", icon: ShieldCheck, url: `/${l}/admin/operations/director_finance` },
        { title: "Cash Flow", icon: Wallet, url: `/${l}/admin/operations/director_finance/finance` },
      ]
    }
  ],

  // --- MANAGEMENT (Level 3) ---
  hr_manager: (l) => [
    {
      label: "People Ops",
      visible: true,
      items: [
        { title: "Personnel Hub", icon: Users, url: `/${l}/internal/manager/hr_manager` },
        { title: "Recruit Pipeline", icon: UserPlus, url: `/${l}/internal/hiring/hr_manager` },
        { title: "Mission Reviews", icon: ClipboardCheck, url: `/${l}/internal/team/hr_manager/reviews` },
        { title: "Team Attendance", icon: Clock, url: `/${l}/internal/team/hr_manager/attendance` },
        { title: "Performance Metrics", icon: Zap, url: `/${l}/internal/team/hr_manager/performance` },
        { title: "Onboarding Registry", icon: ClipboardCheck, url: `/${l}/internal/hiring/hr_manager/onboarding` },
        { title: "Policy Hub", icon: ShieldCheck, url: `/${l}/internal/policy/hr_manager` },
      ]
    }
  ],
  recruiter: (l) => [
    {
      label: "Talent Acquisition",
      visible: true,
      items: [
        { title: "Personnel Hub", icon: Users, url: `/${l}/internal/manager/recruiter` },
        { title: "Recruit Pipeline", icon: UserPlus, url: `/${l}/internal/hiring/recruiter` },
      ]
    }
  ],
  engineering_manager: (l) => [
    {
      label: "Team Operations",
      visible: true,
      items: [
        { title: "Dev Team Port", icon: Users, url: `/${l}/internal/manager/engineering_manager` },
        { title: "Commit Analytics", icon: LineChart, url: `/${l}/internal/analytics/engineering_manager` },
      ]
    }
  ],
  product_manager: (l) => [
    {
      label: "Product Delivery",
      visible: true,
      items: [
        { title: "Feature Board", icon: LayoutDashboard, url: `/${l}/internal/manager/product_manager` },
        { title: "Spec Docs", icon: FileText, url: `/${l}/internal/manager/product_manager/docs` },
      ]
    }
  ],
  operations_manager: (l) => [
    {
      label: "Ops Management",
      visible: true,
      items: [
        { title: "Workflow Hub", icon: Gauge, url: `/${l}/internal/manager/operations_manager` },
        { title: "SLA Tracker", icon: Clock, url: `/${l}/internal/manager/operations_manager/sla` },
      ]
    }
  ],

  // --- SUPERVISORY (Level 3.5) ---
  team_lead: (l) => [
    {
      label: "Squad Coordination",
      visible: true,
      items: [
        { title: "Sprint Hub", icon: Target, url: `/${l}/internal/manager/team_lead` },
        { title: "Mission Reviews", icon: ClipboardCheck, url: `/${l}/internal/team/team_lead/reviews` },
        { title: "Personnel Registry", icon: Users, url: `/${l}/internal/team/team_lead/directory` },
        { title: "Team Reflections", icon: Activity, url: `/${l}/internal/team/team_lead/reflections` },
        { title: "Leave Management", icon: Clock, url: `/${l}/internal/team/team_lead/leaves` },
        { title: "Daily Sync", icon: Clock, url: `/${l}/internal/manager/team_lead/sync` },
      ]
    }
  ],
  project_lead: (l) => [
    {
      label: "Project Control",
      visible: true,
      items: [
        { title: "Delivery Board", icon: Target, url: `/${l}/internal/manager/project_lead` },
        { title: "Milestones", icon: BarChart3, url: `/${l}/internal/manager/project_lead/milestones` },
      ]
    }
  ],
  supervisor: (l) => [
    {
      label: "Operations Control",
      visible: true,
      items: [
        { title: "Shift Hub", icon: Clock, url: `/${l}/internal/manager/supervisor` },
        { title: "Logistics", icon: Network, url: `/${l}/internal/manager/supervisor/logistics` },
      ]
    }
  ],
  coordinator: (l) => [
    {
      label: "Dept Coordination",
      visible: true,
      items: [
        { title: "Schedule Hub", icon: Clock, url: `/${l}/internal/manager/coordinator` },
        { title: "Task Routing", icon: Network, url: `/${l}/internal/manager/coordinator/routing` },
      ]
    }
  ],

  // --- STAFF / EXECUTION (Level 4) ---
  employee: (l) => [
    {
      label: "Workspace",
      visible: true,
      items: [
        { title: "Dashboard", icon: LayoutDashboard, url: `/${l}/internal/staff/employee` },
        { title: "My Tasks", icon: FileText, url: `/${l}/internal/staff/employee/tasks` },
      ]
    }
  ],
  software_engineer: (l) => [
    {
      label: "Dev Workspace",
      visible: true,
      items: [
        { title: "Task Board", icon: LayoutDashboard, url: `/${l}/internal/staff/software_engineer` },
        { title: "API Docs", icon: FileText, url: `/${l}/internal/staff/software_engineer/docs` },
      ]
    }
  ],
  analyst: (l) => [
    {
      label: "Data Studio",
      visible: true,
      items: [
        { title: "Reports", icon: BarChart3, url: `/${l}/internal/staff/analyst` },
        { title: "Source Data", icon: HardDrive, url: `/${l}/internal/staff/analyst/data` },
      ]
    }
  ],
  marketing_specialist: (l) => [
    {
      label: "Marketing Studio",
      visible: true,
      items: [
        { title: "Asset Board", icon: Megaphone, url: `/${l}/internal/staff/marketing_specialist` },
        { title: "Campaigns", icon: Globe, url: `/${l}/internal/staff/marketing_specialist/campaigns` },
      ]
    }
  ],
  financial_analyst: (l) => [
    {
      label: "Finance Studio",
      visible: true,
      items: [
        { title: "Fiscal Audit", icon: Wallet, url: `/${l}/internal/staff/financial_analyst` },
        { title: "Ledger", icon: FileText, url: `/${l}/internal/staff/financial_analyst/ledger` },
      ]
    }
  ],

  // --- ASSOCIATE / INTERN ---
  associate: (l) => [
    {
      label: "Associate Lab",
      visible: true,
      items: [
        { title: "Training", icon: Target, url: `/${l}/internal/associate/associate` },
        { title: "Attendance", icon: Clock, url: `/${l}/internal/associate/associate/attendance` },
        { title: "Tasks", icon: FileText, url: `/${l}/internal/associate/associate/tasks` },
      ]
    }
  ],
  intern: (l) => [
    {
      label: "Associate Lab",
      visible: true,
      items: [
        { title: "Mission Control", icon: Target, url: `/${l}/internal/associate/intern` },
        { title: "Attendance", icon: Clock, url: `/${l}/internal/associate/intern/attendance` },
        { title: "Growth Roadmap", icon: TrendingUp, url: `/${l}/internal/associate/intern/roadmap` },
        { title: "Tactical Hub", icon: LayoutDashboard, url: `/${l}/internal/associate/intern/hub` },
      ]
    }
  ],
  jr_developer: (l) => [
    {
      label: "Junior Console",
      visible: true,
      items: [
        { title: "Code Lab", icon: Cpu, url: `/${l}/internal/associate/jr_developer` },
        { title: "PR Reviews", icon: FileText, url: `/${l}/internal/associate/jr_developer/reviews` },
      ]
    }
  ],
  trainee: (l) => [
    {
      label: "Trainee Hub",
      visible: true,
      items: [
        { title: "Skill Path", icon: Target, url: `/${l}/internal/associate/trainee` },
        { title: "Attendance", icon: Clock, url: `/${l}/internal/associate/trainee/attendance` },
      ]
    }
  ],

  // --- EXTERNAL (Level 6) ---
  founder: (l) => [
    {
      label: "Founder Suite",
      visible: true,
      items: [
        { title: "Venture Pulse", icon: Zap, url: `/${l}/dashboard/operate` },
        { title: "Investor Relations", icon: Users, url: `/${l}/dashboard/connect` },
      ]
    }
  ],
  customer: (l) => [
    {
      label: "Client Portal",
      visible: true,
      items: [
        { title: "My Projects", icon: Briefcase, url: `/${l}/dashboard/customer` },
        { title: "Billing Hub", icon: Wallet, url: `/${l}/dashboard/customer/billing` },
      ]
    }
  ],
  user: (l) => [
    {
      label: "Community Hub",
      visible: true,
      items: [
        { title: "Overview", icon: LayoutDashboard, url: `/${l}/dashboard/user` },
        { title: "Settings", icon: Settings, url: `/${l}/dashboard/user/settings` },
      ]
    }
  ],
};

/**
 * Gets the unique navigation groups for a specific role.
 */
export function getNavForRole(roleId: string, locale: string): NavGroup[] {
  const config = ROLE_NAV_CONFIG[roleId];
  if (config) return config(locale);

  // Default to basic user view if role not found
  return ROLE_NAV_CONFIG.user(locale);
}

/**
 * Gets the shared navigation groups (Profile, Settings, Notifications)
 */
export function getSharedGroups(roleId: string, locale: string): NavGroup[] {
  const role = STARTUP_ROLES[roleId] || STARTUP_ROLES.user;
  const level = role.level;

  // Industry Grade: Dynamic Portal Context
  let prefix = 'admin';
  let identityPath = `identity/${roleId}`;
  // let notifyPath = 'notifications';

  if (level >= 3 && level <= 5) {
    prefix = 'internal';
  } else if (level >= 6) {
    prefix = 'dashboard';
    identityPath = 'profile';
    // notifyPath = 'settings'; // Fallback for user tier
  }

  return [
    {
      label: "Collaboration",
      visible: level >= 0 && level <= 5,
      items: [
        { title: "My 1-on-1 Syncs", icon: Calendar, url: `/${locale}/internal/meetings` },
      ]
    },
    {
      label: "Profile & Identity",
      visible: true,
      items: [
        { title: "Business Identity", icon: UserCircle, url: `/${locale}/${prefix}/${identityPath}` },
        { title: "Help & Support", icon: FileText, url: `/${locale}/${prefix}/support` },
      ]
    }
  ];
}

/**
 * Gets the home path for a specific role
 */
export function getHomePath(roleId: string, locale: string): string {
  const role = STARTUP_ROLES[roleId] || STARTUP_ROLES.user;
  const path = role.homePath.replace(/^\/+/, '');

  // Follow "as-needed" logic: skip prefix for default locale (en)
  if (locale === 'en') return `/${path}`;
  return `/${locale}/${path}`;
}
