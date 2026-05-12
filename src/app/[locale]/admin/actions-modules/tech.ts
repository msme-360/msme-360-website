"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";

/**
 * TECHNICAL HEALTH & INFRASTRUCTURE ACTIONS
 */

export async function getTechnicalHealthMetrics() {
  const supabase = await createServiceClient();
  
  const [healthData, metricsData] = await Promise.all([
    supabase.from("service_health").select("*"),
    supabase.from("platform_metrics").select("*").eq("category", "technical")
  ]);

  const services = (healthData.data || []).map(s => ({
    name: s.name,
    status: s.status,
    load: `${s.load_percentage}%`,
    uptime: `${s.uptime_percentage}%`
  }));

  const sysStats = (metricsData.data || []).map(m => ({
    label: m.label,
    value: m.value,
    status: m.status,
    color: m.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'
  }));

  return { 
    sysStats,
    services,
    lastUpdated: new Date().toISOString() 
  };
}
