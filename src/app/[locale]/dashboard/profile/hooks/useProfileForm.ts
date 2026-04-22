"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { updateProfile } from "@/app/[locale]/dashboard/actions";
import { type DashboardProfile } from "@/types/dashboard";

export const profileFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  email: z.email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  website: z.url("Invalid website URL").or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function useProfileForm(initialProfile: DashboardProfile) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProfileFormValues | null>(null);

  const executeUpdate = async (value: ProfileFormValues) => {
    try {
      const result = await updateProfile(value);
      if (result.success) {
        logger.info("Profile updated", "useProfileForm", { company: value.company_name });
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setShowConfirmDialog(false);
        return true;
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error) {
      logger.error("Profile update failed", "useProfileForm", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  const form = useForm({
    defaultValues: {
      company_name: initialProfile.company_name ?? "",
      category: initialProfile.category ?? "",
      email: initialProfile.email ?? "",
      location: initialProfile.location ?? "",
      website: initialProfile.website ?? "",
    } as ProfileFormValues,
    validators: {
      onChange: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      const isSensitiveChange =
        value.email !== (initialProfile.email ?? "") ||
        value.category !== (initialProfile.category ?? "") ||
        value.company_name !== (initialProfile.company_name ?? "");

      if (isSensitiveChange) {
        setPendingValues(value);
        setShowConfirmDialog(true);
      } else {
        await executeUpdate(value);
      }
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const confirmUpdate = async () => {
    if (pendingValues) {
      await executeUpdate(pendingValues);
    }
  };

  return {
    form,
    isEditing,
    setIsEditing,
    showConfirmDialog,
    setShowConfirmDialog,
    handleCancel,
    confirmUpdate
  };
}
