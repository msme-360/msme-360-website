"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Plus, Trash2, Loader2, Info, Rocket } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitInternApplication, type InternApplicationInput } from "../../actions";

type LinkEntry = { label: string; url: string };

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
    
    // Auto-add next slot if we just picked a type in the last slot
    if (index === links.length - 1 && links.length < 5 && value !== "") {
      newLinks.push({ label: "", url: "" });
    }
    
    setLinks(newLinks);
  };

  const updateLinkUrl = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index].url = value;
    
    // Auto-add next slot if we started typing URL in the last slot and type is selected
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
      commitment_confirmed: formData.get("commitment") === "on",
      expectations_confirmed: formData.get("expectations") === "on",
      attendance_confirmed: formData.get("attendance") === "on",
    };

    const result = await submitInternApplication(data as InternApplicationInput);


    if (result.success) {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md border-primary/20"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Application Sent!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for applying for the <strong>{role.title}</strong> role. Our team will review your profile and reach out if there&apos;s a match.
          </p>

          <Link href={`/${locale}/careers`} className="block w-full">
            <Button className="w-full font-bold">Return to Careers</Button>
          </Link>
        </motion.div>
      </div>
    );
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                  ? "Don&apos;t see a role? Join our talent pool to stay updated on future opportunities."
                  : "Join MSME 360 and build products that empower millions of businesses."}
              </CardDescription>

            </CardHeader>

            <CardContent className="pt-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                    <h3 className="font-bold text-lg">Personal Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-muted-foreground flex items-center">
                        Full Name <span className="text-primary ml-1">*</span>
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        placeholder="e.g. Jane Doe"
                        required
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground flex items-center">
                        Email Address <span className="text-primary ml-1">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. jane.doe@example.com"
                        required
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-muted-foreground">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="e.g. +91 9876543210"
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_level" className="text-muted-foreground flex items-center">
                        Current Status <span className="text-primary ml-1">*</span>
                      </Label>
                      <Input
                        id="experience_level"
                        name="experience_level"
                        placeholder="e.g. 3rd Year CS Student / Pre-final Year"
                        required
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Educational Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                    <h3 className="font-bold text-lg">Educational Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="university" className="text-muted-foreground flex items-center">
                        University / College Name <span className="text-primary ml-1">*</span>
                      </Label>
                      <Input
                        id="university"
                        name="university"
                        placeholder="e.g. Indian Institute of Technology (IIT), Delhi"
                        required
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree" className="text-muted-foreground flex items-center">
                        Degree / Major <span className="text-primary ml-1">*</span>
                      </Label>
                      <Input
                        id="degree"
                        name="degree"
                        placeholder="e.g. B.Tech in Computer Science"
                        required
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduation_year" className="text-muted-foreground flex items-center">
                        Expected Graduation Year <span className="text-primary ml-1">*</span>
                      </Label>
                      <Select name="graduation_year" required>
                        <SelectTrigger className="bg-white/5 border-white/10 data-[size=default]:h-11 rounded-xl" size="default">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          {["2025", "2026", "2027", "2028"].map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                    <h3 className="font-bold text-lg">Availability</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center">
                        Earliest Start Date <span className="text-primary ml-1">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal bg-white/5 border-white/10 rounded-xl",
                              !availabilityDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {availabilityDate ? format(availabilityDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-white/10 bg-slate-900" align="start">
                          <Calendar
                            mode="single"
                            selected={availabilityDate}
                            onSelect={setAvailabilityDate}
                            autoFocus
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                      <h3 className="font-bold text-lg">Professional Links</h3>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addLink}
                      disabled={links.length >= 5}
                      className="text-primary hover:text-primary/80 hover:bg-primary/5 text-xs font-bold gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Link
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {links.map((link, i) => (
                      <div key={i} className="flex gap-3 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="w-32">
                          {i === 0 && (
                            <Label className="text-[10px] uppercase text-muted-foreground mb-2 flex items-center">
                              Type <span className="text-primary ml-1">*</span>
                            </Label>
                          )}
                          <Select
                            value={link.label}
                            onValueChange={(val) => updateLinkLabel(i, val)}
                            disabled={i === 0}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 data-[size=default]:h-11 w-full px-3 rounded-xl" size="default">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="Resume">Resume</SelectItem>
                              <SelectItem value="GitHub">GitHub</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Portfolio">Portfolio</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          {i === 0 && (
                            <Label className="text-[10px] uppercase text-muted-foreground mb-2 flex items-center">
                              URL <span className="text-primary ml-1">*</span>
                            </Label>
                          )}
                          <Input
                            value={link.url}
                            onChange={(e) => updateLinkUrl(i, e.target.value)}
                            placeholder={link.label === "Resume" ? "GDrive Link (Anyone with access)" : "e.g. https://github.com/username"}
                            className="bg-white/5 border-white/10 h-11 rounded-xl"
                            required={i === 0}
                          />

                        </div>
                        {links.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink(i)}
                            className="h-11 w-11 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4">
                    <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-orange-200/90">Resume Handling</p>
                      <p className="text-[11px] text-orange-200/70 leading-relaxed">
                        Please upload your resume to Google Drive, set the sharing permissions to <strong>&quot;Anyone with the link can access&quot;</strong>, and paste the URL here. This ensures our team can review your profile immediately.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Final Agreements */}
                <div className="space-y-6 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                    <h3 className="font-bold text-lg">Terms & Commitment</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                      <Checkbox
                        id="commitment"
                        name="commitment"
                        required
                        className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                      />
                      <Label htmlFor="commitment" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
                        I commit to a minimum of <strong>2 months</strong> for this internship and will give my best to build real products. <span className="text-primary ml-1">*</span>
                      </Label>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                      <Checkbox
                        id="expectations"
                        name="expectations"
                        required
                        className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                      />
                      <Label htmlFor="expectations" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
                        I am aware that this is a <strong>self-driven program</strong>. I will self-learn where needed and communicate my progress daily. <span className="text-primary ml-1">*</span>
                      </Label>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                      <Checkbox
                        id="attendance"
                        name="attendance"
                        required
                        className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                      />
                      <Label htmlFor="attendance" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
                        I understand that a certificate will only be awarded if I maintain <strong>85%+ attendance</strong> and complete assigned milestones. <span className="text-primary ml-1">*</span>
                      </Label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-3">
                    <Info className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold shadow-glow h-14 text-lg"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Application...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Complete Application <Rocket className="w-5 h-5 ml-2" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
