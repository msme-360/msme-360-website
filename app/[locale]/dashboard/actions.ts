"use server";

import { supabase } from "@/lib/supabase";
import { revalidateTag, cacheTag, cacheLife } from "next/cache";

export type ProgressStep = {
  id: string;
  label: string;
  completed: boolean;
};

export async function getProgress(userId: string) {
  "use cache";
  cacheTag(`progress-${userId}`);
  cacheLife("minutes");
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('step_id, completed')
      .eq('user_id', userId);

    if (error) {
      console.warn("Supabase user_progress table might be missing or non-accessible. Using PRD defaults.");
      throw error;
    }

    const defaults = [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];

    if (!data || data.length === 0) return defaults;

    return defaults.map(d => ({
      ...d,
      completed: data.find(r => r.step_id === d.id)?.completed ?? false
    }));
  } catch (error) {
    // Fail gracefully for MVP if table doesn't exist
    return [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];
  }
}

export async function updateProgress(userId: string, stepId: string, completed: boolean) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        step_id: stepId, 
        completed,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,step_id' });

    if (error) throw error;
    
    // Invalidate the cache for this user's progress using recommended "max" profile
    revalidateTag(`progress-${userId}`, "max");
    return { success: true };
  } catch (error) {
    console.error("Supabase updateProgress error:", error);
    return { success: false, error };
  }
}

export async function getProfile(userId: string) {
  "use cache";
  cacheTag(`profile-${userId}`);
  cacheLife("weeks");
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const defaults = {
      company_name: "Amet Innovations Pvt Ltd",
      category: "Technology / Software",
      udyam_number: "UDYAM-MH-01-XXXXXXX",
      email: "founder@ametinn.com",
      location: "Bangalore, Karnataka, India",
      website: "www.ametinn.com"
    };

    if (!data) return defaults;
    return { ...defaults, ...data };
  } catch (error) {
    console.error("Supabase getProfile error:", error);
    return {
      company_name: "Amet Innovations Pvt Ltd",
      category: "Technology / Software",
      udyam_number: "UDYAM-MH-01-XXXXXXX",
      email: "founder@ametinn.com",
      location: "Bangalore, Karnataka, India",
      website: "www.ametinn.com"
    };
  }
}

export async function updateProfile(userId: string, profileData: any) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: userId, 
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
    
    // Invalidate profile cache using recommended "max" profile
    revalidateTag(`profile-${userId}`, "max");
    return { success: true };
  } catch (error) {
    console.error("Supabase updateProfile error:", error);
    return { success: false, error };
  }
}

export async function getSOPTemplates() {
  "use cache";
  cacheTag("sop-templates");
  cacheLife("weeks");
  
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
  "use cache";
  cacheTag("government-schemes");
  cacheLife("weeks");

  const allSchemes = [
    {
      id: "pmegp",
      title: "PMEGP Loans",
      description: "Credit linked subsidy program for setting up new micro-enterprises. Up to ₹50 Lakhs for manufacturing.",
      subsidy: "15% - 35%",
      category: "Manufacturing",
      url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
    },
    {
      id: "cgtsme",
      title: "CGTMSE Coverage",
      description: "Collateral free credit for MSMEs up to ₹5 Cr with government guarantee.",
      subsidy: "Credit Guarantee",
      category: "Service",
      url: "https://www.cgtmse.in/"
    },
    {
      id: "clcss",
      title: "CLCSS Subsidy",
      description: "Technology Upgradation subsidy for plant & machinery in specified sectors.",
      subsidy: "15% Upfront",
      category: "Technology",
      url: "https://msme.gov.in/technology-upgradation-and-quality-certification"
    },
    {
      id: "mudra",
      title: "MUDRA Yojana",
      description: "Micro-finance for non-corporate, non-farm small/micro enterprises up to ₹10 Lakhs.",
      subsidy: "Low Interest",
      category: "General",
      url: "https://www.mudra.org.in/"
    }
  ];

  if (!query) return allSchemes;
  const q = query.toLowerCase();
  return allSchemes.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  );
}

export async function getFounderUpdates() {
  "use cache";
  cacheTag("community-updates");
  cacheLife("minutes");

  // In a real app, this would fetch from Supabase 'community_posts' table
  return [
    {
      id: "update-1",
      founder: "Rajesh Kumar",
      company: "Kumar Tex-Solutions",
      update: "Just secured first institutional loan via MSME360 simulator! 🚀",
      time: "2h ago",
      category: "Milestone",
      type: "Trophy"
    },
    {
      id: "update-2",
      founder: "Priya Sharma",
      company: "EcoPack India",
      update: "DPIIT Recognition approved today. The checklist guide was a life-saver.",
      time: "5h ago",
      category: "Success",
      type: "Sparkles"
    },
    {
      id: "update-3",
      founder: "Amit Singh",
      company: "TechGear MSME",
      update: "Optimized inventory by 30% using the Operations Toolkit. Highly recommend!",
      time: "Yesterday",
      category: "Growth",
      type: "Zap"
    }
  ];
}

export async function submitSupportTicket(userId: string, data: { subject: string, message: string, category: string }) {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject: data.subject,
        message: data.message,
        category: data.category,
        status: 'open',
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("submitSupportTicket error:", error);
    // Fallback for demonstration if table doesn't exist yet
    return { success: true, mock: true };
  }
}

export async function getAvailableMentorshipSlots() {
  "use cache";
  cacheTag("mentorship-slots");
  cacheLife("minutes");

  // Mock slots for the next 3 days
  const now = new Date();
  const slots = [];
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    slots.push(
      { id: `${dateStr}-10`, date: dateStr, time: "10:00 AM", mentor: "Anil Sharma", expertise: "Compliance" },
      { id: `${dateStr}-14`, date: dateStr, time: "02:00 PM", mentor: "Sunita Rao", expertise: "Growth" }
    );
  }
  return slots;
}

export async function submitMicroAIInterest(userId: string, data: { revenue_band: string, data_readiness: string, capabilities: string[], comments: string }) {
  try {
    const { error } = await supabase
      .from('microai_interest')
      .insert({
        user_id: userId,
        revenue_band: data.revenue_band,
        data_readiness: data.data_readiness,
        interested_capabilities: data.capabilities,
        comments: data.comments,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("submitMicroAIInterest error:", error);
    // Return mock success for MVP if table not ready
    return { success: true, mock: true };
  }
}
