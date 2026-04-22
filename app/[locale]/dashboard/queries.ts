import "server-only";
import { createServiceClient } from "@/lib/supabase-server";
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
  return [
    { id: 's1', mentor: 'Anjali Sharma', expertise: 'Retail Export & GTM', time: '14:00 - 14:45', date: 'Tomorrow' },
    { id: 's2', mentor: 'Vikram Mehta', expertise: 'Venture Debt & Equity', time: '11:00 - 11:30', date: 'Oct 22' },
    { id: 's3', mentor: 'Deepak Rao', expertise: 'Legal & Intellectual Property', time: '17:30 - 18:15', date: 'Oct 23' },
  ];
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
      company_name: "Amet Innovations Pvt Ltd",
      legalName: "Amet Innovations Private Limited",
      establishedDate: "2024-01-15",
      category: "Technology / Software",
      udyam_number: "UDYAM-MH-01-0012345",
      email: userEmail || "founder@ametinn.com",
      location: "Bangalore, Karnataka, India",
      website: "https://ametinn.com",
      role: 'user',
      manager_id: undefined
    };

    if (!data) return defaults;
    
    return { ...defaults, ...data } as DashboardProfile;
  } catch (error) {
    logger.error("getProfile error", "queries.ts", error);
    return {
      id: userId,
      company_name: "Amet Innovations Pvt Ltd",
      legalName: "Amet Innovations Private Limited",
      establishedDate: "2024-01-15",
      category: "Technology / Software",
      udyam_number: "UDYAM-MH-01-0012345",
      email: userEmail || "founder@ametinn.com",
      location: "Bangalore, Karnataka, India",
      website: "https://ametinn.com",
      role: 'user',
      manager_id: undefined
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
    return [
      { id: '1', full_name: "Rahul Sharma", role_key: "proprietor", status: "active" },
      { id: '2', full_name: "Ananya Iyer", role_key: "accountsManager", status: "active" }
    ];
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
    return [
      { id: "gst", task_name: "GSTR-1 (Monthly)", due_date: "11-Oct", status: "pending" },
      { id: "tds", task_name: "TDS Quarterly", due_date: "31-Oct", status: "pending" },
      { id: "pf", task_name: "EPF/ESI Filing", due_date: "15-Oct", status: "filed" }
    ];
  }
}
