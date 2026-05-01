export interface TemplateTask {
  name: string;
  owner: 'hr' | 'intern';
}

export interface OnboardingTemplate {
  id: string;
  label: string;
  description: string;
  tasks: TemplateTask[];
}

export const ONBOARDING_TEMPLATES: OnboardingTemplate[] = [
  {
    id: 'engineering_core',
    label: 'Engineering Core Orientation',
    description: 'Standard orientation for software, backend, and frontend interns.',
    tasks: [
      { name: "ACCOUNT: ID Badge Verification", owner: 'hr' },
      { name: "ACCOUNT: Biometric Registration", owner: 'hr' },
      { name: "LEGAL: NDA Agreement Verification", owner: 'hr' },
      { name: "DEPT: Tool Access Provisioning", owner: 'hr' },
      { name: "ACCOUNT: Profile Setup", owner: 'intern' },
      { name: "LEGAL: Terms of Service Acceptance", owner: 'intern' },
      { name: "LEGAL: Conduct Policy Acknowledgement", owner: 'intern' },
      { name: "DEPT: Git & CI/CD Access", owner: 'hr' },
      { name: "DEPT: Repository Overview", owner: 'intern' },
      { name: "DEPT: First PR/Commit", owner: 'intern' },
      { name: "DEPT: Development Environment Setup", owner: 'intern' }
    ]
  },
  {
    id: 'product_design',
    label: 'Product & Design Milestone',
    description: 'Specialized track for UI/UX, Product, and Strategy interns.',
    tasks: [
      { name: "ACCOUNT: ID Badge Verification", owner: 'hr' },
      { name: "ACCOUNT: Biometric Registration", owner: 'hr' },
      { name: "LEGAL: NDA Agreement Verification", owner: 'hr' },
      { name: "DEPT: Figma/Canva Access", owner: 'hr' },
      { name: "ACCOUNT: Profile Setup", owner: 'intern' },
      { name: "LEGAL: Conduct Policy Acknowledgement", owner: 'intern' },
      { name: "DEPT: Brand Guidelines Review", owner: 'intern' },
      { name: "DEPT: Design System Intro", owner: 'intern' },
      { name: "DEPT: Product Vision Briefing", owner: 'hr' }
    ]
  },
  {
    id: 'operations_general',
    label: 'Operations & Support General',
    description: 'General orientation for administrative, HR, and marketing interns.',
    tasks: [
      { name: "ACCOUNT: ID Badge Verification", owner: 'hr' },
      { name: "ACCOUNT: Biometric Registration", owner: 'hr' },
      { name: "LEGAL: NDA Agreement Verification", owner: 'hr' },
      { name: "ACCOUNT: Profile Setup", owner: 'intern' },
      { name: "LEGAL: Conduct Policy Acknowledgement", owner: 'intern' },
      { name: "DEPT: Workspace Configuration", owner: 'intern' },
      { name: "DEPT: Team Communication (Teams/Slack)", owner: 'intern' },
      { name: "DEPT: Internal Policy Briefing", owner: 'hr' }
    ]
  }
];

export function getRecommendedTemplate(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('engineer') || r.includes('developer') || r.includes('tech') || r.includes('backend') || r.includes('frontend')) {
    return 'engineering_core';
  }
  if (r.includes('design') || r.includes('ui') || r.includes('ux') || r.includes('product')) {
    return 'product_design';
  }
  return 'operations_general';
}
