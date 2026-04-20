"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ConditionalNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.split('/').includes("dashboard");
  const isAdmin = pathname?.split('/').includes("admin");
  const isInternal = pathname?.split('/').includes("internal");
  
  const shouldHideNav = isDashboard || isAdmin || isInternal;

  return (
    <>
      {!shouldHideNav && <Navbar />}
      <main className={!shouldHideNav ? "min-h-screen" : ""} aria-label="MSME 360 Content">
        {children}
      </main>
      {!shouldHideNav && <Footer />}
    </>
  );
}
