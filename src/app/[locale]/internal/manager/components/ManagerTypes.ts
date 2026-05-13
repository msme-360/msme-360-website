export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  assigned_to_profile?: { full_name: string; avatar_url?: string };
  verification_status?: 'pending' | 'verified' | 'rejected';
  mentor_feedback?: string;
  verified_at?: string;
  verified_by?: string;
  proof_of_work?: string;
}

export interface AttendanceLog {
  user_id: string;
  check_in: string;
  check_out?: string;
  profiles?: { full_name: string; role: string };
}

export interface TaskComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}
