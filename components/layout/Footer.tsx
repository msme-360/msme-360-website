import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Rocket, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const [currentYear, setCurrentYear] = useState<number | string>("...");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t border-white/5 py-12 px-4 selection:bg-primary/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                MSME <span className="text-primary">360</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-foreground/50">{t("links.platform")}</h4>
            <ul className="space-y-4">
              {["formalize", "operations", "aiHub", "pricing"].map((key) => (
                <li key={key}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(`links.items.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-foreground/50">{t("links.connect")}</h4>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              {t("contact.label")} support@msme360.in
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">{t("links.items.privacy")}</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">{t("links.items.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
