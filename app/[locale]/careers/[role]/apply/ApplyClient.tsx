"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Info, Rocket } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitInternApplication, type InternApplicationInput } from "../../actions";
import { LinkEntry } from "./components/ApplyTypes";
import SuccessState from "./components/SuccessState";
import LinkFormSection from "./components/LinkFormSection";
import TermsSection from "./components/TermsSection";
import PersonalInfoSection from "./components/PersonalInfoSection";
import EducationSection from "./components/EducationSection";
import AvailabilitySection from "./components/AvailabilitySection";

export default function ApplyClient({ roleSlug }: { roleSlug: string }) {
  const params = useParams();
  const locale = params?.locale as string || "en";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkEntry[]>([{ label: "Resume", url: "" }]);
  const [availabilityDate, setAvailabilityDate] = useState<Date>();

  const role = CAREER_ROLES.find(r => r.slug === roleSlug);
  
  if (!role) return null;

  const addLink = () => {
    if (links.length < 5) {
      setLinks([...links, { label: "", url: "" }]);
    }
  };

  const removeLink = (index: number) => {
    if (index === 0) return; // Cannot remove resume
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLinkLabel = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index].label = value;
    if (index === links.length - 1 && links.length < 5 && value !== "") {
      newLinks.push({ label: "", url: "" });
    }
    setLinks(newLinks);
  };

  const updateLinkUrl = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index].url = value;
    if (index === links.length - 1 && links.length < 5 && value.length > 0 && newLinks[index].label !== "") {
      newLinks.push({ label: "", url: "" });
    }
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) return;

    const formData = new FormData(e.currentTarget);
    const experience_level = formData.get("experience_level") as string;
    const university = formData.get("university") as string;
    const degree = formData.get("degree") as string;
    const graduation_year = formData.get("graduation_year") as string;

    const commitment = formData.get("commitment") === "on";
    const expectations = formData.get("expectations") === "on";
    const attendance = formData.get("attendance") === "on";

    if (!commitment || !expectations || !attendance) {
      setError("Please agree to all terms and commitment points");
      return;
    }

    const resumeLink = links.find(l => l.label === "Resume");
    if (!resumeLink?.url) {
      setError("Resume link is mandatory");
      return;
    }

    if (!availabilityDate) {
      setError("Earliest start date is mandatory");
      return;
    }

    setLoading(true);
    setError(null);
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: role.title,
      experience_level,
      university,
      degree,
      graduation_year,
      availability_date: availabilityDate.toISOString(),
      links: links.filter(l => l.url.trim() !== ""),
      commitment_confirmed: true,
      expectations_confirmed: true,
      attendance_confirmed: true,
    };

    const result = await submitInternApplication(data as InternApplicationInput);

    if (result.success) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  };

  if (success) {
    return <SuccessState roleTitle={role.title} locale={locale} />;
  }

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />

      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/careers/${role.slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Role Details
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Rocket className="w-32 h-32 text-primary" />
            </div>
            <CardHeader className="pb-8 border-b border-white/5">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary mb-4 uppercase tracking-widest">
                {role.slug === 'general' ? 'Talent Pool' : 'Internship Application'}
              </div>
              <CardTitle className="text-3xl font-display font-bold">Apply for {role.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                {role.slug === 'general'
                  ? "Don't see a role? Join our talent pool to stay updated on future opportunities."
                  : "Join MSME 360 and build products that empower millions of businesses."}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <PersonalInfoSection />
                <EducationSection />
                <AvailabilitySection date={availabilityDate} setDate={setAvailabilityDate} />

                <LinkFormSection 
                  links={links} 
                  addLink={addLink} 
                  removeLink={removeLink} 
                  updateLinkLabel={updateLinkLabel} 
                  updateLinkUrl={updateLinkUrl} 
                />

                <TermsSection />

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-3">
                    <Info className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full font-bold shadow-glow h-14 text-lg">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Complete Application <Rocket className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
