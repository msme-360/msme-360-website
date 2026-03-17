"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ConditionalNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.split('/').includes("dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={!isDashboard ? "min-h-screen" : ""} aria-label="MSME 360 Content">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
