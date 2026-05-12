export interface Applicant {
  id: string;
  full_name: string;
  email: string;
  role: string;
  bio?: string;
  university?: string;
  links?: { url: string; label: string }[];
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired' | 'onboarded';
  applied_at: string;
  is_archived: boolean;
  metadata?: Record<string, unknown>;
  reviewed_by?: string;
  reviewer_name?: string;
}

export interface HiringStats {
  total: number;
  shortlisted: number;
  pending: number;
  hired: number;
}

export interface Metric {
  id?: string;
  application_id: string;
  evaluator_role: string;
  evaluator_id: string;
  metric_name: string;
  score: number;
  comment: string;
  updated_at?: string;
}
