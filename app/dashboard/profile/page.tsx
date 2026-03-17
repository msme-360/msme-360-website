"use client";

import { UserCircle, Building2, MapPin, Mail, Globe, Edit3, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <UserCircle className="w-3 h-3 mr-2" /> Account Management
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Business Profile</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">Manage your MSME information and brand identity with precision.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <Card className="glass-card overflow-hidden">
          <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-accent/20 border-b border-border/50" />
          <CardContent className="p-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="w-32 h-32 rounded-[2.5rem] bg-background p-1 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] bg-secondary flex items-center justify-center border border-border/50">
                    <Building2 className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                <div className="pb-2">
                  <h2 className="text-2xl font-bold">Amet Innovations Pvt Ltd</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Verified MSME
                  </p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl gap-2 w-full md:w-fit">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Company Name</Label>
                  <Input disabled value="Amet Innovations Pvt Ltd" className="bg-secondary/30 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Business Category</Label>
                  <Input disabled value="Technology / Software" className="bg-secondary/30 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Udyam Registration #</Label>
                  <Input disabled value="UDYAM-MH-01-XXXXXXX" className="bg-secondary/30 rounded-xl font-mono" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Email Address</p>
                    <p className="font-medium">founder@ametinn.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">HQ Location</p>
                    <p className="font-medium">Bangalore, Karnataka, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Website</p>
                    <p className="font-medium">www.ametinn.com</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="glass-card p-8 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">DPIIT Recognition Ready</h3>
              <p className="text-muted-foreground text-sm">
                Your profile information is 85% complete. Complete your founders details to apply for Startup India recognition.
              </p>
            </div>
            <Button className="ml-auto rounded-full px-6">Apply Now</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
