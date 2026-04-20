"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { isExcludedPath } from "@/lib/constants/navigation";

/**
 * Conditionally renders the global Navbar and Footer based on the current route.
 * Admin and Dashboard routes are excluded to maintain a focused workspace layout.
 */
export function ConditionalNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHideNav = isExcludedPath(pathname || "");

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
