"use client";

import { useParams } from "next/navigation";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <AuthLayout>
      <ResetPasswordForm locale={locale} />
    </AuthLayout>
  );
}
