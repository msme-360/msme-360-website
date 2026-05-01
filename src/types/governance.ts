export interface SystemHealth {
  id?: string;
  name: string;
  status: string;
  load_percentage: number;
  uptime_percentage: number;
  last_ping?: string;
}

export interface GovernanceMetric {
  label: string;
  value: string;
  change: string;
  status: string;
}

export interface BoardResolution {
  id: string;
  title: string;
  level: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

// Ensure the SysStat and ServiceStatus from TechnicalClient are aligned or replaced if possible, but keep these for now if used heavily.
export interface SysStat {
   label: string;
   value: string;
   status: string;
   color: string;
}

export interface ServiceStatus {
   name: string;
   status: string;
   load: string;
   uptime: string;
}

export interface NICCode {
  id: string;
  code: string;
  category: string;
  description: string;
  subtext: string | null;
  created_at: string;
}
