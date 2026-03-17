import React, { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ProgressProvider } from "@/components/dashboard/ProgressProvider";
import { DashboardClientLayer } from "./DashboardClientLayer";
import DashboardLoading from "./loading";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Important for static generation of dashboard routes
  setRequestLocale(locale);

  return (
    <ProgressProvider>
      <DashboardClientLayer>
        <Suspense fallback={<DashboardLoading />}>
          {children}
        </Suspense>
      </DashboardClientLayer>
    </ProgressProvider>
  );
}
