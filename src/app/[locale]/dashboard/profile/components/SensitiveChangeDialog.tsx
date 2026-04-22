"use client";

import { Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface SensitiveChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SensitiveChangeDialog({ open, onOpenChange, onConfirm }: SensitiveChangeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-border/50 backdrop-blur-xl bg-popover/95">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Confirm Sensitive Changes
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are changing core business details (Email, Business Category, or Company Name).
            Changes to these fields may affect your eligibility for certain government schemes and registrations.
            Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-xl bg-primary shadow-glow hover:bg-primary/90"
            onClick={onConfirm}
          >
            Confirm Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
