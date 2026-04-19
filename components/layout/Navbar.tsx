"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LocaleSwitcher from "./LocaleSwitcher";

export function Navbar() {
  const t = useTranslations("Navigation");
  const tNav = useTranslations("Navbar");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = useMemo(() => [
    { name: t("formalize"), href: `/#formalize` },
    { name: t("operate"), href: `/#operate` },
    { name: t("grow"), href: `/#grow` },
    { name: t("profile"), href: `/#story` },
  ], [t]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4",
        scrolled ? "top-2" : "top-6"
      )}
    >
      <nav
        className={cn(
          "glass rounded-full px-6 py-2 flex items-center justify-between w-full max-w-5xl transition-all duration-500",
          scrolled ? "px-4 py-1.5 border-primary/20 bg-background/80" : "border-white/5 bg-background/40"
        )}
      >
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-base tracking-tight selection:bg-transparent">
              MSME <span className="text-primary">360</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {tNav("links.login")}
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="sm" className="rounded-full px-6 font-semibold shadow-glow">
                {tNav("links.join")}
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 hover:bg-white/5"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-20 left-4 right-4 md:hidden glass rounded-3xl p-6 flex flex-col gap-4 border-primary/10 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2 border-b border-white/5 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm font-medium text-muted-foreground">Language / भाषा</span>
              <LocaleSwitcher />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Link
                href={`/${locale}/login`}
                onClick={() => setIsOpen(false)}
                className="text-center py-2 text-muted-foreground"
              >
                {tNav("links.login")}
              </Link>
              <Button className="w-full rounded-2xl h-12 text-base font-bold">
                {tNav("links.join")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
