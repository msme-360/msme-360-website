
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date?: string;
  assigned_by_profile?: { full_name: string };
}

export interface AttendanceLog {
  id: string;
  check_in: string;
  check_out: string | null;
}

export interface OnboardingItem {
  id: string;
  item_text: string;
  is_completed: boolean;
  category: 'general' | 'technical' | 'administrative' | 'compliance';
}

export interface TaskComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}
