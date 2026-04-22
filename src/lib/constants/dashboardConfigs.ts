import { LucideIcon, PieChart, Heart, UserPlus, Clock, TrendingUp, Bell, Briefcase, Settings } from "lucide-react";

export interface DashboardMetric {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

export interface DashboardFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: string;
  progress?: number;
}

export interface RoleDashboardConfig {
  title: string;
  subtitle: string;
  badgeLabel: string;
  authorityLevel: string;
  metrics: DashboardMetric[];
  features: DashboardFeature[];
  accentColor: string;
}

import {
  Building2, Users, Zap, ShieldCheck, Target, BarChart3,
  Cpu, Wallet, Network, HardDrive, Megaphone, Gauge,
  MessageSquare, FileText, LayoutDashboard, Globe, History, Lock
} from "lucide-react";

export const ROLE_DASHBOARD_CONFIGS: Record<string, RoleDashboardConfig> = {
  // --- LEVEL 0: GOVERNANCE ---
  super_admin: {
    title: "Global Control Center",
    subtitle: "Absolute oversight of MSME 360 platform infrastructure and security.",
    badgeLabel: "SYSTEM ARCHITECT",
    authorityLevel: "Omnipotent Access",
    accentColor: "primary",
    metrics: [
      { label: "Active Nodes", value: "1,204", icon: Cpu },
      { label: "Security Events", value: "0", icon: ShieldCheck },
      { label: "Platform Load", value: "12%", icon: Zap },
      { label: "Database Health", value: "100%", icon: HardDrive },
    ],
    features: [
      { title: "RBAC Firewall", description: "Manage global role permissions and isolation.", icon: Lock },
      { title: "System Logs", description: "Real-time audit of every system transaction.", icon: History },
    ]
  },
  managing_partner: {
    title: "Partner Command",
    subtitle: "Strategic firm management and equity oversight.",
    badgeLabel: "MANAGING PARTNER",
    authorityLevel: "Firm Governance",
    accentColor: "accent",
    metrics: [
      { label: "Firm Valuation", value: "$4.2M", icon: Wallet },
      { label: "Partner Equity", value: "32%", icon: PieChart },
      { label: "Strategic Projects", value: "12", icon: Target },
    ],
    features: [
      { title: "Fiscal Summary", description: "Quarterly profit and loss statement.", icon: FileText },
    ]
  },
  board_member: {
    title: "Board Portal",
    subtitle: "Strategic oversight, fiduciary responsibility and governance alpha.",
    badgeLabel: "BOARD MEMBER",
    authorityLevel: "L0 Board Oversight",
    accentColor: "slate-500",
    metrics: [
      { label: "ROE", value: "24%", icon: BarChart3 },
      { label: "Market Cap", value: "$140M", icon: Building2 },
      { label: "Quarterly Dividend", value: "$1.20", icon: Wallet },
    ],
    features: [
      { title: "Governance Audit", description: "Regulatory compliance and policy oversight.", icon: ShieldCheck },
    ]
  },

  // --- LEVEL 1: EXECUTIVE ---
  ceo: {
    title: "Executive Intelligence",
    subtitle: "High-level strategic vision and company-wide KPI monitoring.",
    badgeLabel: "CHIEF EXECUTIVE",
    authorityLevel: "Strategic Control",
    accentColor: "primary",
    metrics: [
      { label: "Market Share", value: "24.5%", icon: Globe },
      { label: "EBITDA Growth", value: "+18%", icon: BarChart3 },
      { label: "Total Workforce", value: "852", icon: Users },
    ],
    features: [
      { title: "Annual Roadmap", description: "Overall business trajectory for FY26.", icon: Target },
    ]
  },
  cto: {
    title: "Technical Strategy",
    subtitle: "R&D direction and enterprise architecture oversight.",
    badgeLabel: "CHIEF TECHNOLOGY",
    authorityLevel: "Tech Governance",
    accentColor: "blue-500",
    metrics: [
      { label: "API Uptime", value: "99.99%", icon: Zap },
      { label: "Engineering Velocity", value: "84 pts", icon: Gauge },
      { label: "Cloud Spend", value: "$12k", icon: Wallet },
    ],
    features: [
      { title: "Patent Pipeline", description: "Proprietary AI microservices development.", icon: Cpu },
    ]
  },
  cfo: {
    title: "Financial Intelligence",
    subtitle: "Treasury management, fiscal policy, and capital allocation.",
    badgeLabel: "CHIEF FINANCIAL",
    authorityLevel: "Financial Control",
    accentColor: "primary",
    metrics: [
      { label: "Cash on Hand", value: "$1.4M", icon: Wallet },
      { label: "Burn Rate", value: "$120k", icon: BarChart3 },
      { label: "Runway", value: "11.2m", icon: Target },
    ],
    features: [
      { title: "Tax Compliance", description: "Global tax filings and fiscal audit.", icon: ShieldCheck },
    ]
  },
  coo: {
    title: "Operational Excellence",
    subtitle: "Enterprise-wide efficiency and strategic resource planning.",
    badgeLabel: "CHIEF OPERATING",
    authorityLevel: "Operations Excellence",
    accentColor: "amber-500",
    metrics: [
      { label: "Unit Economics", value: "+$42", icon: BarChart3 },
      { label: "Op-Ex Efficiency", value: "92%", icon: Gauge },
      { label: "Supply Health", value: "94%", icon: Network },
    ],
    features: [
      { title: "Process Audit", description: "Evaluating organizational throughput.", icon: ShieldCheck },
    ]
  },
  cmo: {
    title: "Marketing Intelligence",
    subtitle: "Brand equity, customer acquisition, and growth strategy.",
    badgeLabel: "CHIEF MARKETING",
    authorityLevel: "Growth Master",
    accentColor: "rose-500",
    metrics: [
      { label: "Customer LTV", value: "$1,402", icon: Users },
      { label: "CAC ratio", value: "3.4x", icon: BarChart3 },
      { label: "Organic Reach", value: "2M", icon: Globe },
    ],
    features: [
      { title: "Growth Engine", description: "Next-gen referral and acquisition loop.", icon: Zap },
    ]
  },
  chro: {
    title: "Talent Strategy",
    subtitle: "Culture architecture, workforce planning, and people ops.",
    badgeLabel: "CHIEF PEOPLE",
    authorityLevel: "Human Capital",
    accentColor: "indigo-500",
    metrics: [
      { label: "Retention rate", value: "94%", icon: Heart },
      { label: "eNPS Score", value: "78", icon: MessageSquare },
      { label: "Hiring Pipeline", value: "142", icon: UserPlus },
    ],
    features: [
      { title: "Culture Board", description: "Monitoring internal morale and trends.", icon: Users },
    ]
  },
  cio: {
    title: "Data Intelligence",
    subtitle: "Information strategy, cybersecurity, and data sovereignty.",
    badgeLabel: "CHIEF INFORMATION",
    authorityLevel: "Data Sovereignty",
    accentColor: "sky-500",
    metrics: [
      { label: "Threats Blocked", value: "4.2k", icon: ShieldCheck },
      { label: "Data Uptime", value: "99.98%", icon: HardDrive },
      { label: "System Latency", value: "42ms", icon: Zap },
    ],
    features: [
      { title: "Cybersecurity Audit", description: "Enterprise-wide security protocols.", icon: Lock },
    ]
  },

  // --- LEVEL 1.5: SENIOR MANAGEMENT ---
  vp_engineering: {
    title: "Engineering Leadership",
    subtitle: "Leading the technology organization and delivery cycles.",
    badgeLabel: "VP ENGINEERING",
    authorityLevel: "L6 Senior Management",
    accentColor: "cyan-500",
    metrics: [
      { label: "Active Sprints", value: "14", icon: Target },
      { label: "Deployment Freq", value: "12/day", icon: Zap },
      { label: "Unit Test Coverage", value: "94%", icon: ShieldCheck },
    ],
    features: [
      { title: "Department Goals", description: "Roadmap for Technical Org.", icon: Target },
    ]
  },
  vp_product: {
    title: "Product Vision",
    subtitle: "Overall product strategy, lifecycle management, and user delight.",
    badgeLabel: "VP PRODUCT",
    authorityLevel: "L6 Senior Management",
    accentColor: "violet-500",
    metrics: [
      { label: "Active Users", value: "42k", icon: Users },
      { label: "MAU Growth", value: "+12%", icon: BarChart3 },
      { label: "Feature Adoption", value: "68%", icon: Zap },
    ],
    features: [
      { title: "Product Roadmap", description: "Feature pipeline for high-growth q3.", icon: Target },
    ]
  },
  vp_operations: {
    title: "Operations Strategy",
    subtitle: "Leading cross-functional efficiency and departmental scaling.",
    badgeLabel: "VP OPERATIONS",
    authorityLevel: "L6 Senior Management",
    accentColor: "orange-500",
    metrics: [
      { label: "Opex Burnout", value: "Low", icon: Gauge },
      { label: "Process Health", value: "98%", icon: ShieldCheck },
      { label: "Delivery Speed", value: "92%", icon: Zap },
    ],
    features: [
      { title: "Ops Optimization", description: "Removing departmental bottlenecks.", icon: Gauge },
    ]
  },
  vp_marketing: {
    title: "Growth Strategy",
    subtitle: "Leading the marketing engine and brand positioning at scale.",
    badgeLabel: "VP MARKETING",
    authorityLevel: "L6 Senior Management",
    accentColor: "pink-500",
    metrics: [
      { label: "Ad-Spend Efficiency", value: "88%", icon: BarChart3 },
      { label: "Traffic Volume", value: "400k", icon: Globe },
      { label: "Brand Equity", value: "High", icon: Megaphone },
    ],
    features: [
      { title: "Marketing Campaign", description: "Annual growth trajectory and PR.", icon: Megaphone },
    ]
  },
  vp_finance: {
    title: "Financial Governance",
    subtitle: "Controller-level financial management and organizational fiscal oversight.",
    badgeLabel: "VP FINANCE",
    authorityLevel: "L6 Senior Management",
    accentColor: "emerald-500",
    metrics: [
      { label: "Ledger Health", value: "100%", icon: FileText },
      { label: "Budgeting Delta", value: "2%", icon: BarChart3 },
      { label: "Audit Readiness", value: "High", icon: ShieldCheck },
    ],
    features: [
      { title: "Fiscal Controls", description: "Corporate expense and tax management.", icon: Wallet },
    ]
  },

  // --- LEVEL 2: OPERATIONS / DIRECTORS ---
  director_engineering: {
    title: "Engineering Operations",
    subtitle: "R&D efficiency, infrastructure stability, and technical delivery.",
    badgeLabel: "DIRECTOR ENGINEERING",
    authorityLevel: "L5 Strategic Lead",
    accentColor: "blue-600",
    metrics: [
      { label: "Infra Health", value: "99.9%", icon: Zap },
      { label: "Cost Per Task", value: "$4.1", icon: Wallet },
      { label: "Engineering ROI", value: "3.2x", icon: BarChart3 },
    ],
    features: [
      { title: "Technical Debt", description: "Monitoring and managing refactor cycles.", icon: Gauge },
    ]
  },
  director_product: {
    title: "Product Excellence",
    subtitle: "Product-market fit, user research, and feature prioritization.",
    badgeLabel: "DIRECTOR PRODUCT",
    authorityLevel: "L5 Strategic Lead",
    accentColor: "purple-600",
    metrics: [
      { label: "NPS Score", value: "72", icon: MessageSquare },
      { label: "Churn Rate", value: "2.1%", icon: BarChart3 },
      { label: "Feature Velocity", value: "High", icon: Zap },
    ],
    features: [
      { title: "User Feedback", description: "Aggregating sentiment analysis from beta.", icon: MessageSquare },
    ]
  },
  director_operations: {
    title: "Operational Strategy",
    subtitle: "Strategic scaling, resource management, and process efficiency.",
    badgeLabel: "DIRECTOR OPERATIONS",
    authorityLevel: "L5 Strategic Lead",
    accentColor: "orange-600",
    metrics: [
      { label: "Dept Efficiency", value: "94%", icon: Gauge },
      { label: "Resource Cap", value: "88%", icon: Users },
      { label: "Procurement Health", value: "High", icon: Network },
    ],
    features: [
      { title: "Process Mapping", description: "Analyzing departmental bottlenecks.", icon: Network },
    ]
  },
  director_marketing: {
    title: "Marketing Operations",
    subtitle: "Campaign execution, brand awareness, and lead generation analytics.",
    badgeLabel: "DIRECTOR MARKETING",
    authorityLevel: "L5 Strategic Lead",
    accentColor: "rose-600",
    metrics: [
      { label: "MQL Volume", value: "1.2k", icon: Users },
      { label: "Cost per Lead", value: "$4.2", icon: Wallet },
      { label: "Conv Rate", value: "12.4%", icon: BarChart3 },
    ],
    features: [
      { title: "Campaign ROI", description: "Evaluating performance across channels.", icon: BarChart3 },
    ]
  },
  director_finance: {
    title: "Finance Operations",
    subtitle: "Financial reporting, audit readiness, and cash management.",
    badgeLabel: "DIRECTOR FINANCE",
    authorityLevel: "L5 Strategic Lead",
    accentColor: "emerald-600",
    metrics: [
      { label: "Audit Health", value: "Verified", icon: ShieldCheck },
      { label: "Cash Reserve", value: "$400k", icon: Wallet },
      { label: "Accounts Rec", value: "$120k", icon: FileText },
    ],
    features: [
      { title: "Fiscal Audit", description: "Ensuring compliance and accuracy.", icon: ShieldCheck },
    ]
  },

  // --- LEVEL 3: MANAGEMENT ---
  hr_manager: {
    title: "People Management",
    subtitle: "Employee relations, benefits, and workplace culture.",
    badgeLabel: "HR MANAGER",
    authorityLevel: "L4 Operational Lead",
    accentColor: "indigo-400",
    metrics: [
      { label: "Headcount", value: "482", icon: Users },
      { label: "Open Roles", value: "14", icon: UserPlus },
      { label: "Incident Rate", value: "Low", icon: ShieldCheck },
    ],
    features: [
      { title: "Employee Wellness", description: "Programs and engagement trackers.", icon: Heart },
    ]
  },
  recruiter: {
    title: "Talent Acquisition",
    subtitle: "Sourcing, interviewing, and onboarding new talent.",
    badgeLabel: "RECRUITER",
    authorityLevel: "L4 Talent Sourcer",
    accentColor: "blue-400",
    metrics: [
      { label: "Time to Hire", value: "24d", icon: Clock },
      { label: "Offer Accept", value: "92%", icon: Target },
      { label: "Applied", value: "1.4k", icon: Users },
    ],
    features: [
      { title: "Hiring Pipeline", description: "Tracking candidates through stages.", icon: UserPlus },
    ]
  },
  engineering_manager: {
    title: "Engineering Team",
    subtitle: "Managing developer teams, code quality, and delivery speed.",
    badgeLabel: "ENGINEERING MANAGER",
    authorityLevel: "L4 Technical Lead",
    accentColor: "cyan-600",
    metrics: [
      { label: "Commits / Week", value: "402", icon: Zap },
      { label: "PR Cycle Time", value: "3h", icon: Clock },
      { label: "Team Velocity", value: "84%", icon: Gauge },
    ],
    features: [
      { title: "Code Lab", description: "Reviewing code quality and standards.", icon: FileText },
    ]
  },
  product_manager: {
    title: "Product Execution",
    subtitle: "Feature delivery, user stories, and backlog management.",
    badgeLabel: "PRODUCT MANAGER",
    authorityLevel: "L4 Product Lead",
    accentColor: "violet-400",
    metrics: [
      { label: "Active Epics", value: "8", icon: Target },
      { label: "Story Progress", value: "92%", icon: Gauge },
      { label: "Blockers", value: "2", icon: ShieldCheck },
    ],
    features: [
      { title: "Backlog Hub", description: "Managing feature prioritization.", icon: LayoutDashboard },
    ]
  },
  operations_manager: {
    title: "Operations Hub",
    subtitle: "Daily process management and logistical coordination.",
    badgeLabel: "OPERATIONS MANAGER",
    authorityLevel: "L4 Ops Lead",
    accentColor: "orange-400",
    metrics: [
      { label: "Daily Throughput", value: "1.2k", icon: Zap },
      { label: "Error Rate", value: "0.2%", icon: ShieldCheck },
      { label: "SLA Compl.", value: "99.2%", icon: Clock },
    ],
    features: [
      { title: "Process Map", description: "Visualizing operational flow.", icon: Network },
    ]
  },
  team_lead: {
    title: "Squad Dashboard",
    subtitle: "Immediate team delivery and project coordination.",
    badgeLabel: "TEAM LEAD",
    authorityLevel: "L4 Operational Lead",
    accentColor: "emerald-500",
    metrics: [
      { label: "Sprint Progress", value: "72%", icon: Target },
      { label: "Team Morale", value: "High", icon: MessageSquare },
      { label: "Blockers", value: "2", icon: ShieldCheck },
    ],
    features: [
      { title: "Daily Objectives", description: "Focus items for the next 24 hours.", icon: LayoutDashboard },
    ]
  },
  project_lead: {
    title: "Project Command",
    subtitle: "Milestone tracking, project health, and delivery timelines.",
    badgeLabel: "PROJECT LEAD",
    authorityLevel: "L4 Delivery Lead",
    accentColor: "teal-500",
    metrics: [
      { label: "Phase Delta", value: "+2d", icon: Clock },
      { label: "Risk Factor", value: "Low", icon: ShieldCheck },
      { label: "Resource Use", value: "92%", icon: Users },
    ],
    features: [
      { title: "Milestone Map", description: "Visualizing key delivery dates.", icon: Target },
    ]
  },
  supervisor: {
    title: "Operational Control",
    subtitle: "Shift management, logistical oversight, and floor-level ops.",
    badgeLabel: "SUPERVISOR",
    authorityLevel: "L4 Operational Supervisor",
    accentColor: "yellow-500",
    metrics: [
      { label: "Shift Health", value: "Active", icon: Zap },
      { label: "Incident Count", value: "0", icon: ShieldCheck },
      { label: "Throughput", value: "120/hr", icon: Gauge },
    ],
    features: [
      { title: "Logistics Hub", description: "Tracking physical and digital flow.", icon: Network },
    ]
  },
  coordinator: {
    title: "Department Hub",
    subtitle: "Cross-functional scheduling and resource routing.",
    badgeLabel: "COORDINATOR",
    authorityLevel: "L4 Department Coord",
    accentColor: "sky-500",
    metrics: [
      { label: "Active Requests", value: "42", icon: MessageSquare },
      { label: "Router Efficiency", value: "98%", icon: Network },
      { label: "Response Time", value: "4m", icon: Clock },
    ],
    features: [
      { title: "Schedule Hub", description: "Managing departmental timelines.", icon: Clock },
    ]
  },
  // --- LEVEL 4: STAFF ---
  employee: {
    title: "Member Workspace",
    subtitle: "Personal task management, performance tracking, and company updates.",
    badgeLabel: "STAFF MEMBER",
    authorityLevel: "L3 Individual Contributor",
    accentColor: "slate-400",
    metrics: [
      { label: "Task completion", value: "92%", icon: Gauge },
      { label: "Active Project", value: "3", icon: Target },
      { label: "Morale", value: "Stable", icon: MessageSquare },
    ],
    features: [
      { title: "My Roadmap", description: "Your personal growth and delivery path.", icon: Target },
    ]
  },
  analyst: {
    title: "Data Studio",
    subtitle: "Statistical modeling, data visualization, and insight generation.",
    badgeLabel: "DATA ANALYST",
    authorityLevel: "L3 Data Science",
    accentColor: "cyan-400",
    metrics: [
      { label: "Queries / Day", value: "42", icon: Zap },
      { label: "Data Quality", value: "94%", icon: ShieldCheck },
      { label: "Insights", value: "12", icon: PieChart },
    ],
    features: [
      { title: "Source Data", description: "Accessing raw data streams and lakes.", icon: HardDrive },
    ]
  },
  software_engineer: {
    title: "Developer Console",
    subtitle: "Full-stack development, system architecture, and code execution.",
    badgeLabel: "SOFTWARE ENGINEER",
    authorityLevel: "L3 Technical",
    accentColor: "blue-600",
    metrics: [
      { label: "Uptime Health", value: "Healthy", icon: Zap },
      { label: "Open PRs", value: "2", icon: FileText },
      { label: "Lints / Error", value: "0", icon: ShieldCheck },
    ],
    features: [
      { title: "API Playground", description: "Testing and documenting technical interfaces.", icon: Cpu },
    ]
  },
  marketing_specialist: {
    title: "Marketing Studio",
    subtitle: "Creative direction, campaign management, and growth analytics.",
    badgeLabel: "MARKETING SPECIALIST",
    authorityLevel: "L3 Growth",
    accentColor: "orange-500",
    metrics: [
      { label: "Engagement", value: "8.4%", icon: BarChart3 },
      { label: "Click rate", value: "2.1k", icon: Globe },
      { label: "Lead Gen", value: "48", icon: Users },
    ],
    features: [
      { title: "Asset Board", description: "Managing creative media and copy.", icon: Megaphone },
    ]
  },
  financial_analyst: {
    title: "Finance Studio",
    subtitle: "Financial modeling, ledger auditing, and fiscal reporting.",
    badgeLabel: "FINANCIAL ANALYST",
    authorityLevel: "L3 Fiscal",
    accentColor: "emerald-500",
    metrics: [
      { label: "Ledger Audit", value: "Clean", icon: ShieldCheck },
      { label: "Variance", value: "-0.4%", icon: BarChart3 },
      { label: "Reporting", value: "Ready", icon: FileText },
    ],
    features: [
      { title: "Audit Trail", description: "Historical data and transaction logs.", icon: History },
    ]
  },

  // --- LEVEL 5: ASSOCIATE ---
  associate: {
    title: "Associate Hub",
    subtitle: "Execution-level support and professional skill development.",
    badgeLabel: "ASSOCIATE",
    authorityLevel: "L2 Associate",
    accentColor: "slate-300",
    metrics: [
      { label: "Task Accuracy", value: "98%", icon: ShieldCheck },
      { label: "Hours logged", value: "40/wk", icon: Clock },
      { label: "KPI Progress", value: "84%", icon: Gauge },
    ],
    features: [
      { title: "Learning Path", description: "Advancing to senior individual contributor.", icon: Target },
    ]
  },
  intern: {
    title: "Intern Learning Center",
    subtitle: "Hands-on experience, mentorship, and foundational training.",
    badgeLabel: "INTERN",
    authorityLevel: "L1 Trainee",
    accentColor: "teal-400",
    metrics: [
      { label: "Course Compl.", value: "72%", icon: Target },
      { label: "Mentor Sync", value: "Weekly", icon: Users },
      { label: "Project Load", value: "Junior", icon: Zap },
    ],
    features: [
      { title: "Skill Matrix", description: "Tracking your growth and core competencies.", icon: TrendingUp },
    ]
  },
  jr_developer: {
    title: "Junior Dev Console",
    subtitle: "Learning system architecture and contributing to core code.",
    badgeLabel: "JUNIOR DEVELOPER",
    authorityLevel: "L1 Junior Developer",
    accentColor: "blue-300",
    metrics: [
      { label: "Commits", value: "14", icon: FileText },
      { label: "Reviews Reqd", value: "2", icon: ShieldCheck },
      { label: "System Know.", value: "Moderate", icon: Cpu },
    ],
    features: [
      { title: "Code Reviews", description: "Participating in pair-programming and feedback.", icon: MessageSquare },
    ]
  },
  trainee: {
    title: "Trainee Portal",
    subtitle: "Foundational skill-building and organizational onboarding.",
    badgeLabel: "TRAINEE",
    authorityLevel: "L1 Trainee",
    accentColor: "amber-300",
    metrics: [
      { label: "Onboarding", value: "92%", icon: Target },
      { label: "Attendance", value: "100%", icon: Clock },
      { label: "Modules", value: "8/12", icon: Gauge },
    ],
    features: [
      { title: "Onboarding Flow", description: "Navigating your first 90 days.", icon: Target },
    ]
  },

  // --- LEVEL 6: EXTERNAL ---
  founder: {
    title: "Founder Suite",
    subtitle: "Visionary oversight, investor relations, and venture pulse.",
    badgeLabel: "FOUNDER",
    authorityLevel: "External Principal",
    accentColor: "primary",
    metrics: [
      { label: "Runway", value: "Infinite", icon: Target },
      { label: "Burn Rate", value: "Optimized", icon: BarChart3 },
      { label: "Equity Value", value: "$4.2M", icon: Wallet },
    ],
    features: [
      { title: "Investor Relations", description: "Managing stakeholder confidence and funding.", icon: Users },
    ]
  },
  customer: {
    title: "Client Portal",
    subtitle: "Managing your projects, billing, and collaboration history.",
    badgeLabel: "CUSTOMER",
    authorityLevel: "External Partner",
    accentColor: "blue-500",
    metrics: [
      { label: "Active Project", value: "2", icon: Briefcase },
      { label: "Payment Status", value: "Current", icon: Wallet },
      { label: "Support Ticket", value: "0", icon: MessageSquare },
    ],
    features: [
      { title: "Account Hub", description: "Billing and subscription management.", icon: Settings },
    ]
  },
  user: {
    title: "User Hub",
    subtitle: "Platform overview, personal settings, and community access.",
    badgeLabel: "USER",
    authorityLevel: "Platform User",
    accentColor: "slate-500",
    metrics: [
      { label: "Community Rep", value: "High", icon: Heart },
      { label: "Points Earned", value: "1.2k", icon: Zap },
      { label: "Notifications", value: "4", icon: Bell },
    ],
    features: [
      { title: "Profile Studio", description: "Manage your presence and visibility.", icon: Users },
    ]
  },
}