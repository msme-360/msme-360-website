import "server-only";
import { createServiceClient } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";
import { DashboardProfile } from "@/types/dashboard";

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
    
    return data.map((post: { id: string; founder_name: string; company_name: string; content: string; type: string; category: string }) => ({
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
    return [
      { id: 'm1', founder: 'Omkar G.', company: 'Amet Innovations', update: 'Just crossed 100+ daily active users on the MicroAI beta!', type: 'Trophy', category: 'Growth', time: '2m' },
      { id: 'm2', founder: 'Priya S.', company: 'SolarScale', update: 'Our first GTM campaign using MSME 360 filters converted at 12%!', type: 'Sparkles', category: 'Sales', time: '15m' },
      { id: 'm3', founder: 'Rahul K.', company: 'EcoBags', update: 'Finally filed GST with zero errors using the Compliance checklist.', type: 'Zap', category: 'Compliance', time: '1h' },
    ];
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
  return [
    {
      id: "gst-filing",
      title: "GST Monthly Filing SOP",
      content: "Step 1: Reconcile invoices with GSTR-2B. Step 2: Extract sales data for GSTR-1...",
      category: "Compliance",
      lastUpdated: "2024-03-15"
    },
    {
      id: "udyam-update",
      title: "Udyam Renewal SOP",
      content: "Step 1: Check NIC codes for activity changes. Step 2: Update investment & turnover details...",
      category: "Registration",
      lastUpdated: "2024-03-10"
    },
    {
      id: "hiring-flow",
      title: "New Employee Onboarding",
      content: "Step 1: Collect Aadhaar/PAN. Step 2: Issue appointment letter. Step 3: Setup bank account...",
      category: "HR",
      lastUpdated: "2024-03-20"
    },
    {
      id: "sales-outreach",
      title: "B2B Sales Outreach",
      content: "Step 1: Identify targets. Step 2: Send WhatsApp intro script. Step 3: Follow up in 48 hours...",
      category: "Sales",
      lastUpdated: "2024-03-25"
    }
  ];
}

export async function getSchemes(query?: string) {
  const allSchemes = [
    { id: "pmegp", title: "PMEGP Loans", description: "Credit linked subsidy program for setting up new micro-enterprises.", subsidy: "15% - 35%", category: "Manufacturing", url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp" },
    { id: "cgtsme", title: "CGTMSE Coverage", description: "Collateral free credit for MSMEs up to ₹5 Cr with government guarantee.", subsidy: "Credit Guarantee", category: "Service", url: "https://www.cgtmse.in/" },
    { id: "clcss", title: "CLCSS Subsidy", description: "Technology Upgradation subsidy for plant & machinery.", subsidy: "15% Upfront", category: "Technology", url: "https://msme.gov.in/technology-upgradation-and-quality-certification" },
    { id: "mudra", title: "MUDRA Yojana", description: "Micro-finance for non-corporate enterprises up to ₹10 Lakhs.", subsidy: "Low Interest", category: "General", url: "https://www.mudra.org.in/" }
  ];

  if (!query) return allSchemes;
  const q = query.toLowerCase();
  return allSchemes.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
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
