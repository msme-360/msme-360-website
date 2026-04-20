"use server";

import { createClient } from "@/lib/supabase-server";
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
  attendance_confirmed: z.boolean().refine(v => v === true, "Must confirm attendance")
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
        attendance_confirmed: validatedData.attendance_confirmed
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
