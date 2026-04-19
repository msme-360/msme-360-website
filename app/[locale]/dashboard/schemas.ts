import { z } from "zod";

// --- Validations ---

export const profileSchema = z.object({
  company_name: z.string().min(2).optional(),
  category: z.string().optional(),
  udyam_number: z.string().optional(),
  email: z.email().optional(),
  location: z.string().optional(),
  website: z.url().or(z.literal("")).optional(),
});

export const ticketSchema = z.object({
  subject: z.string().min(5),
  message: z.string().min(10),
  category: z.string(),
});

export const teamMemberSchema = z.object({
  full_name: z.string().min(2),
  role_key: z.string().min(1),
});

export const progressSchema = z.object({
  stepId: z.string(),
  completed: z.boolean(),
});

export const microAISchema = z.object({
  revenue_band: z.string(),
  data_readiness: z.string(),
  capabilities: z.array(z.string()),
  comments: z.string(),
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notification_prefs: z.object({
    compliance: z.boolean(),
    growth: z.boolean(),
    community: z.boolean(),
    security: z.boolean(),
  }).optional(),
});

export const communityPostSchema = z.object({
  founder_name: z.string().min(2),
  company_name: z.string().min(2),
  content: z.string().min(5).max(500),
  category: z.string().min(1),
  type: z.string().optional(),
});

export const mentorshipBookingSchema = z.object({
  mentor_name: z.string(),
  expertise: z.string(),
  scheduled_at: z.string(), // ISO string from client
});

// --- Types ---

export type ProgressStep = {
  id: string;
  label: string;
  completed: boolean;
};
