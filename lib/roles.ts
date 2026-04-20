import { Layout, Database, Layers, CheckCircle, Brain, Database as DataIcon, FileText, Palette, Share2, Rocket } from "lucide-react";

export interface CareerRole {
  slug: string;
  title: string;
  department: string;
  icon: React.ElementType;
  requirements: string;
  responsibilities: string[];
  skills: string[];
  type: 'internship' | 'job';
}

export const CAREER_ROLES: CareerRole[] = [
  {
    slug: "frontend",
    title: "Frontend Developers - Intern",
    department: "Engineering",
    icon: Layout,
    requirements: "React.js/Next.js - should have working knowledge of building UI components and handling state",
    responsibilities: [
      "Building responsive UI components",
      "Managing application state with modern patterns",
      "Collaborating with designers to implement pixel-perfect layouts"
    ],
    skills: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
    type: 'internship'
  },
  {
    slug: "backend",
    title: "Backend Developers - Intern",
    department: "Engineering",
    icon: Database,
    requirements: "Node.js, SQL/MongoDB – should understand APIs, databases, and server-side logic",
    responsibilities: [
      "Designing and implementing RESTful APIs",
      "Database schema design and optimization",
      "Ensuring server-side security and performance"
    ],
    skills: ["Node.js", "PostgreSQL", "Supabase", "Express"],
    type: 'internship'
  },
  {
    slug: "fullstack",
    title: "Full Stack Developers - Intern",
    department: "Engineering",
    icon: Layers,
    requirements: "Should be comfortable working across both frontend and backend",
    responsibilities: [
      "End-to-end feature development",
      "Integrating frontend with complex backend services",
      "Maintaining architectural consistency"
    ],
    skills: ["Next.js", "PostgreSQL", "TypeScript", "Prisma/Drizzle"],
    type: 'internship'
  },
  {
    slug: "testers",
    title: "Testers - Intern",
    department: "Quality Assurance",
    icon: CheckCircle,
    requirements: "Should have basic understanding of testing workflows and identifying bugs",
    responsibilities: [
      "Developing test cases and execution plans",
      "Identifying, documenting, and tracking bugs",
      "Ensuring overall product quality and stability"
    ],
    skills: ["Playwright", "Jest", "Manual Testing", "Bug Tracking"],
    type: 'internship'
  },
  {
    slug: "ml",
    title: "ML Engineers - Intern",
    department: "AI & Innovation",
    icon: Brain,
    requirements: "Python – should have knowledge of building and working with models",
    responsibilities: [
      "Building and training ML models for MSME use cases",
      "Data preprocessing and feature engineering",
      "Deploying model endpoints"
    ],
    skills: ["Python", "PyTorch/TensorFlow", "Scikit-Learn", "FastAPI"],
    type: 'internship'
  },
  {
    slug: "data",
    title: "Data Engineers - Intern",
    department: "Data & Analytics",
    icon: DataIcon,
    requirements: "Should understand data handling, pipelines, and basic SQL operations",
    responsibilities: [
      "Building robust data pipelines",
      "Managing data storage and retrieval systems",
      "Ensuring data integrity and quality"
    ],
    skills: ["SQL", "Python", "Data Orchestration", "ETL Patterns"],
    type: 'internship'
  },
  {
    slug: "research",
    title: "Researchers & Documentation - Intern",
    department: "Product Strategy",
    icon: FileText,
    requirements: "Should have strong research ability and clear documentation skills",
    responsibilities: [
      "Conducting market and user research",
      "Writing clear technical and business documentation",
      "Analyzing policy changes affecting MSMEs"
    ],
    skills: ["Technical Writing", "Market Research", "Analysis", "Documentation"],
    type: 'internship'
  },
  {
    slug: "design",
    title: "UI/UX Designers - Intern",
    department: "Product Design",
    icon: Palette,
    requirements: "Figma/Canva - should be able to create intuitive designs, wireframes, and user-friendly interfaces",
    responsibilities: [
      "Creating user personas and flows",
      "Designing high-fidelity wireframes and prototypes",
      "Iterating based on user feedback"
    ],
    skills: ["Figma", "Canva", "User Research", "Prototyping"],
    type: 'internship'
  },
  {
    slug: "social-media",
    title: "Social Media Managers - Intern",
    department: "Marketing",
    icon: Share2,
    requirements: "Should be able to plan content, manage platforms, analyze engagement, and maintain brand consistency",
    responsibilities: [
      "Content strategy and scheduling",
      "Platform community management",
      "Analyzing growth and engagement metrics"
    ],
    skills: ["Content Strategy", "Copywriting", "Platform Management", "Analytics"],
    type: 'internship'
  },
  {
    slug: "general",
    title: "Open Application",
    department: "General",
    icon: Rocket,
    requirements: "A problem-solving mindset and a drive to build for Bharat's MSMEs.",
    responsibilities: [
      "Contributing where your skills are most needed",
      "Drafting and executing cross-functional tasks",
      "Collaborating on high-impact product features"
    ],
    skills: ["Problem Solving", "Adaptability", "Fast Learning", "Ownership"],
    type: 'internship'
  }
];

export const INTERN_ROLES = CAREER_ROLES;
