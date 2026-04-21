"use client";

import { useParams } from "next/navigation";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <AuthLayout>
      <LoginForm locale={locale} />
    </AuthLayout>
  );
}
