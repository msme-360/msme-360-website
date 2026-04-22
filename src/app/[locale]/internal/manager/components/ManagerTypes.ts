export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to_profile?: { full_name: string; avatar_url?: string };
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
