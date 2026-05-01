"use client";

import { useParams } from "next/navigation";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <AuthLayout>
      <ForgotPasswordForm locale={locale} />
    </AuthLayout>
  );
}
