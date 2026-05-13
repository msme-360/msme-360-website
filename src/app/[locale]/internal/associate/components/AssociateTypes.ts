
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'pending_verification';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date?: string;
  proof_of_work?: string;
  blocker_reason?: string;
  resolution_note?: string;
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
  category: 'general' | 'technical' | 'administrative' | 'compliance' | 'ACCOUNT' | 'LEGAL' | 'INFRASTRUCTURE' | 'TECHNICAL';
}

export interface TaskComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}

export interface Commendation {
  id: string;
  user_id: string;
  mentor_id: string;
  category: 'Tactical' | 'Innovation' | 'Culture' | 'Reliability';
  reason: string;
  points: number;
  created_at: string;
  mentor?: { full_name: string };
}
