export interface Applicant {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
}

export interface HiringStats {
  total: number;
  shortlisted: number;
  pending: number;
  hired: number;
}
