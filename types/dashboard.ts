export interface DashboardProfile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
  company_name?: string;
  location?: string;
  avatar_url?: string;
  locale?: string;
  
  // Restored business fields
  category?: string;
  udyam_number?: string;
  website?: string;
  legalName?: string;
  establishedDate?: string;
}
