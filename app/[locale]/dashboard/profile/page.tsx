import { Metadata } from "next";
import { Suspense } from "react";
import { UserCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { getUser } from "@/lib/supabase-server";
import { ProfileForm } from "./ProfileForm";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Business Profile | MSME 360",
  description: "Manage your official MSME business identity, brand details, and formalization status.",
};

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  // Opting into dynamic rendering to avoid Supabase errors during build
  await headers();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Profile" });
  const user = await getUser();
  const profile = await getProfile(user?.id || "", user?.email);

  if (!profile) {
    // This handles the null case if user is not found, though middleware should prevent this
    return <div>User not found. Please log in.</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": profile.company_name || "MSME 360 Founder",
    "legalName": profile.legalName,
    "foundingDate": profile.establishedDate,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location?.split(',')[0]?.trim(),
      "addressRegion": profile.location?.split(',')[1]?.trim(),
      "addressCountry": "IN"
    },
    "brand": {
      "@type": "Brand",
      "name": "MSME 360"
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <UserCircle className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{t("description")}</p>
      </div>

      <div className="grid gap-8">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileForm initialProfile={profile} />
        </Suspense>

        <Card className="glass-card p-8 border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{t("recognitionCard.title")}</h3>
              <p className="text-muted-foreground text-sm">
                {t("recognitionCard.description", { percentage: 85 })}
              </p>
            </div>
            <Button className="rounded-full px-8 shadow-glow w-full md:w-auto">{t("recognitionCard.cta")}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

