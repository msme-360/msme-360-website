export interface Application {
  id: string;
  full_name: string;
  email: string;
  role: string;
  university: string;
  experience_level: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
  designation?: string;
  bio?: string;
  phone?: string;
}
