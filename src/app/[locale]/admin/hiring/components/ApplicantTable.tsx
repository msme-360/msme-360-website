"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Filter, Loader2, Star, Check, X, MoreVertical, Mail, Linkedin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Applicant } from "./HiringTypes";
import { useTranslations } from "next-intl";

interface ApplicantTableProps {
  applicants: Applicant[];
  loadingId: string | null;
  onStatusUpdate: (id: string, status: string) => void;
  onHire: (id: string) => void;
}

export default function ApplicantTable({
  applicants,
  loadingId,
  onStatusUpdate,
  onHire
}: ApplicantTableProps) {
  const t = useTranslations("Hiring.table");
  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{t('title')}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-2">
          <Filter className="w-3 h-3" /> {t('filter')}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('candidate')}</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('position')}</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('status')}</th>
                <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('applied')}</th>
                <th className="py-4 px-6 text-right font-bold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {applicants.map((app) => (
                  <motion.tr
                    key={app.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                          {app.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold">{app.full_name}</p>
                          <p className="text-[10px] text-muted-foreground">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className="bg-white/5 text-[10px]">{app.role}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'pending' ? 'bg-blue-500' :
                          app.status === 'shortlisted' ? 'bg-yellow-500' :
                            app.status === 'hired' ? 'bg-green-500' :
                              'bg-red-500'
                          }`} />
                        <span className="text-xs font-medium capitalize">{app.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loadingId === app.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            {app.status === 'pending' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                onClick={() => onStatusUpdate(app.id, 'shortlisted')}
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            )}
                            {app.status === 'shortlisted' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                onClick={() => onHire(app.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {app.status !== 'hired' && app.status !== 'rejected' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => onStatusUpdate(app.id, 'rejected')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass-card border-white/10">
                                <DropdownMenuItem className="text-xs gap-2">
                                  <Mail className="w-3.5 h-3.5" /> {t('email')}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs gap-2">
                                  <Linkedin className="w-3.5 h-3.5" /> {t('linkedin')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem className="text-xs text-red-500 gap-2">
                                  <X className="w-3.5 h-3.5" /> {t('archive')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {applicants.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">{t('noResults')}</p>
          </div>
        )}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t('end')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
