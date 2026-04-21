export interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  completion_rate: number;
}

export interface AttendanceStats {
  total_days: number;
  consistency: number;
}

export interface TrendMetric {
  name: string;
  velocity: number;
  quality: number;
}

export interface PerformanceData {
  taskStats: TaskStats;
  attendanceStats: AttendanceStats;
}
