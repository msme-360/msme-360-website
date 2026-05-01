"use server";

import { createClient, createServiceClient } from "@/services/supabase/supabase-server";
import { z } from "zod";

const LinkSchema = z.object({
  label: z.string(),
  url: z.url("Please enter a valid URL")
});

const InternApplicationSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  experience_level: z.string().min(1, "Experience level is required"),
  university: z.string().min(2, "University name is required"),
  degree: z.string().min(2, "Degree/Major is required"),
  graduation_year: z.string().min(4, "Graduation year is required"),
  availability_date: z.string().min(1, "Availability date is required"),
  links: z.array(LinkSchema).min(1, "At least one link (Resume) is required"),
  commitment_confirmed: z.boolean().refine(v => v === true, "Must confirm commitment"),
  expectations_confirmed: z.boolean().refine(v => v === true, "Must confirm expectations"),
  attendance_confirmed: z.boolean().refine(v => v === true, "Must confirm attendance"),
  desired_role: z.string().optional()
});

export type InternApplicationInput = z.infer<typeof InternApplicationSchema>;

export async function submitInternApplication(data: InternApplicationInput) {
  try {
    const validatedData = InternApplicationSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase
      .from("intern_applications")
      .insert({
        full_name: validatedData.full_name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        experience_level: validatedData.experience_level,
        university: validatedData.university,
        degree: validatedData.degree,
        graduation_year: validatedData.graduation_year,
        availability_date: validatedData.availability_date,
        links: validatedData.links, // Stored as JSONB
        commitment_confirmed: validatedData.commitment_confirmed,
        expectations_confirmed: validatedData.expectations_confirmed,
        attendance_confirmed: validatedData.attendance_confirmed,
        desired_role: validatedData.desired_role
      });

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: "Failed to submit application. Please try again." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getTestimonials() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("career_testimonials")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Testimonials fetch failed:", error);
    return [];
  }
}

export async function getCareerRoles(type?: 'internship' | 'job') {
  // Now redirected to the shared admin actions for better governance
  const { getCareerRoles: getSharedRoles } = await import("@/app/[locale]/admin/actions");
  return getSharedRoles(type);
}

export async function getCareerRole(slug: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("career_roles")
      .select("*")
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching role:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Role fetch failed:", error);
    return null;
  }
}

export async function checkApplicationStatus(email: string, role: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("intern_applications")
      .select("status")
      .eq("email", email)
      .order("applied_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error checking application status:", error);
      return { allowed: true };
    }

    if (!data) return { allowed: true };

    // Allow re-application if rejected
    if (data.status === 'rejected') return { allowed: true };

    // Block if already hired, shortlisted, or pending
    const statusMessages: Record<string, string> = {
      pending: "Your application is currently being processed. Please wait for the results.",
      under_review: "Your application is under review. We will get back to you soon.",
      shortlisted: "Congratulations! You have been shortlisted. Check your email for next steps.",
      hired: "You are already part of the team! Welcome aboard."
    };

    return { 
      allowed: false, 
      message: statusMessages[data.status] || "You already have an active application with us."
    };
  } catch (error) {
    console.error("Status check failed:", error);
    return { allowed: true };
  }
}
