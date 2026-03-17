"use client";

import { Settings, Bell, Palette, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Settings className="w-3 h-3 mr-2" /> Global Preferences
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Settings</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">Manage your platform preferences and security with precision.</p>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Compliance Alerts</Label>
                  <p className="text-sm text-muted-foreground italic">Get notified about upcoming GST and filing deadlines.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-6">
                <div className="space-y-0.5">
                  <Label className="text-base">Growth Opportunities</Label>
                  <p className="text-sm text-muted-foreground">Alerts for new government schemes and subsidies.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> Appearance
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Unicorn Mode (Dark)</Label>
                  <p className="text-sm text-muted-foreground">Enable the premium high-contrast dark aesthetic.</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" /> Danger Zone
          </h2>
          <Card className="glass-card border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold">Delete Business Profile</p>
                <p className="text-sm text-muted-foreground italic">Permanently remove all data and progress.</p>
              </div>
              <Button variant="destructive" className="rounded-xl">Delete Account</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
