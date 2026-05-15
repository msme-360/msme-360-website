export interface Meeting {
  id: string;
  title: string;
  mentor_name: string;
  scheduled_at: string;
  link: string;
  status: string;
  type: string;
  // Optional fields for internal use if needed
  userId?: string;
  userName?: string;
  role?: string;
  reviewerName?: string;
  date?: string;
  time?: string;
}
