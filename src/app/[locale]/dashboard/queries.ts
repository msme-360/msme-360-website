import "server-only";
import { createServiceClient } from "@/services/supabase/supabase-server";
import { logger } from "@/lib/logger";
import { DashboardProfile } from "@/types/dashboard";
import { FounderUpdate, PostDB } from "@/types/community";

// --- Queries ---
// These are "pure" queries that don't read cookies.
// They receive userId and context as arguments.

export async function getProgress(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('user_progress')
      .select('step_index, is_completed')
      .eq('user_id', userId);

    if (error) {
      logger.warn("Supabase user_progress table might be missing or non-accessible. Using PRD defaults.", "queries.ts", { error });
      throw error;
    }

    const defaults = [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];

    if (!data || data.length === 0) return defaults;

    return defaults.map((d, index) => ({
      ...d,
      completed: data.find(r => r.step_index === index)?.is_completed ?? false
    }));
  } catch (error) {
    logger.error("Error in getProgress", "queries.ts", error);
    return [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];
  }
}

export async function getUserSettings(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const defaults = {
      theme: 'system',
      notification_prefs: {
        compliance: true,
        growth: true,
        community: true,
        security: true
      }
    };

    if (!data) return defaults;
    return { ...defaults, ...data };
  } catch (error) {
    logger.error("getUserSettings error", "queries.ts", error);
    return null;
  }
}

export async function getSupportTickets(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("getSupportTickets error", "queries.ts", error);
    return [];
  }
}

export async function getFounderUpdates() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map((post: PostDB): FounderUpdate => ({
      id: post.id,
      founder: post.founder_name,
      company: post.company_name,
      update: post.content,
      type: post.type || 'Sparkles',
      category: post.category,
      time: 'Just now'
    }));
  } catch (error) {
    logger.error("getFounderUpdates error", "queries.ts", error);
    return [];
  }
}

export async function getAvailableMentorshipSlots() {
  return [];
}

export async function getProfile(userId: string, userEmail?: string): Promise<DashboardProfile> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const defaults: DashboardProfile = {
      id: userId,
      email: userEmail,
      role: 'user'
    };

    if (!data) return defaults;
    
    // Normalize role to lowercase for consistent matching
    if (data.role) {
      data.role = data.role.toLowerCase();
    }

    return { ...defaults, ...data } as DashboardProfile;
  } catch (error) {
    logger.error("getProfile error", "queries.ts", error);
    return {
      id: userId,
      email: userEmail,
      role: 'user'
    } as DashboardProfile;
  }
}

export async function getSOPTemplates() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('gtm_templates')
      .select('*')
      .eq('type', 'SOP');

    if (error) throw error;
    return data.map(tmp => ({
      id: tmp.id,
      title: tmp.title_key,
      content: tmp.content_template,
      category: "SOP",
      lastUpdated: tmp.created_at
    }));
  } catch (error) {
    logger.error("getSOPTemplates error", "queries.ts", error);
    return [];
  }
}

export async function getSchemes(query?: string) {
  try {
    const supabase = await createServiceClient();
    let q = supabase.from('schemes').select('*');

    if (query) {
      q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await q.order('title', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("getSchemes error", "queries.ts", error);
    return [];
  }
}

export async function getNicCodes() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("nic_codes").select("*").order("code", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching NIC codes:", "queries.ts", error);
    return [];
  }
}

export async function getAIServices() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("ai_services").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching AI services:", "queries.ts", error);
    return [];
  }
}

export async function getTenders() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching tenders:", "queries.ts", error);
    return [];
  }
}

export async function getGTMTemplates() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("gtm_templates").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching GTM templates:", "queries.ts", error);
    return [];
  }
}

export async function getGTMCampaigns(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("gtm_campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("getGTMCampaigns error", "queries.ts", error);
    return [];
  }
}

export async function getTeamMembers(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.warn("Falling back to mock team members", "queries.ts", { error });
    return [];
  }
}

export async function getComplianceTasks(userId: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('compliance_tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.warn("Falling back to mock compliance tasks", "queries.ts", { error });
    return [];
  }
}

export async function getPlatformMetrics(category?: string) {
  try {
    const supabase = await createServiceClient();
    let query = supabase.from('platform_metrics').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('label', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("getPlatformMetrics error", "queries.ts", error);
    return [];
  }
}

export async function getRecruitmentMetrics() {
  try {
    const supabase = await createServiceClient();
    const { data: apps, error } = await supabase
      .from('intern_applications')
      .select('status');

    if (error) throw error;

    const counts = (apps || []).reduce((acc: Record<string, number>, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'total', label: 'Total Applicants', value: (apps?.length || 0).toString(), change: 'Real-time', status: 'Optimal' },
      { id: 'shortlisted', label: 'Shortlisted', value: (counts['shortlisted'] || 0).toString(), change: 'Active', status: 'Optimal' },
      { id: 'review', label: 'Under Review', value: (counts['under_review'] || 0).toString(), change: 'Pending', status: 'Optimal' },
      { id: 'hired', label: 'Hired Interns', value: (counts['hired'] || 0).toString(), change: 'Finalized', status: 'Optimal' }
    ];
  } catch (error) {
    logger.error("getRecruitmentMetrics error", "queries.ts", error);
    return [];
  }
}

export async function getRecruitmentTrends() {
  try {
    const supabase = await createServiceClient();
    const { data: apps, error } = await supabase
      .from('intern_applications')
      .select('applied_at, status');

    if (error) throw error;

    const dailyData = (apps || []).reduce((acc: Record<string, any>, app: any) => {
      const date = new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = { name: date, applicants: 0, shortlisted: 0 };
      acc[date].applicants++;
      if (app.status === 'shortlisted' || app.status === 'hired') acc[date].shortlisted++;
      return acc;
    }, {});

    return Object.values(dailyData).slice(-7); // Last 7 days with data
  } catch (error) {
    logger.error("getRecruitmentTrends error", "queries.ts", error);
    return [];
  }
}
