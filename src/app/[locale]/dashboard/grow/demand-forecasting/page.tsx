"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemandForecastingPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/grow/demand-forecasting/upload");
  }, [router]);
  return null;
}
