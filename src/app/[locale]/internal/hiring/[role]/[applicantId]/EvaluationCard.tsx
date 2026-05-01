"use client";

import { useState, useEffect, useCallback } from "react";
import { Metric } from "../../../../admin/hiring/components/HiringTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Plus, UserCheck, ShieldAlert, Star, Loader2, Trash2 } from "lucide-react";
import { saveApplicationMetric, deleteApplicationMetric } from "@/app/[locale]/admin/actions";
import { toast } from "sonner";

interface EvaluationCardProps {
  title: string;
  role: 'recruiter' | 'hr_manager';
  canEdit: boolean;
  metrics: Metric[];
  applicantId: string;
  userId: string;
  applicantStatus: string;
  onUpdate: (metric: Metric) => void;
  onDelete?: (name: string) => void;
}

// Sub-component for individual metric to manage its own debouncing
function EvaluationItem({ 
  name, 
  initialMetric, 
  canEdit, 
  applicantStatus, 
  onSave,
  onDelete,
  savingId,
  isCustom
}: { 
  name: string, 
  initialMetric?: Metric, 
  canEdit: boolean, 
  applicantStatus: string,
  onSave: (name: string, score: number, comment: string) => Promise<void>,
  onDelete: (name: string) => Promise<void>,
  savingId: string | null,
  isCustom: boolean
}) {
  const [score, setScore] = useState<number>(initialMetric?.score ?? 5);
  const [scoreInput, setScoreInput] = useState<string>((initialMetric?.score ?? 5).toString());
  const [comment, setComment] = useState<string>(initialMetric?.comment ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [prevMetric, setPrevMetric] = useState(initialMetric);
  if (initialMetric !== prevMetric) {
    setPrevMetric(initialMetric);
    if (initialMetric) {
      setScore(initialMetric.score);
      setScoreInput(initialMetric.score.toString());
      setComment(initialMetric.comment || "");
    }
  }

  // Debounced save
  useEffect(() => {
    const isDifferent = score !== (initialMetric?.score ?? -1) || comment !== (initialMetric?.comment ?? "");
    if (!isDifferent || !canEdit || ['rejected', 'hired'].includes(applicantStatus) || !initialMetric) return;

    const timer = setTimeout(async () => {
      setIsPending(true);
      await onSave(name, score, comment);
      setIsPending(false);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [score, comment, name, initialMetric, onSave, canEdit, applicantStatus]);

  const handleScoreChange = (val: number) => {
    setScore(val);
    setScoreInput(val.toString());
  };

  const handleInputChange = (val: string) => {
    setScoreInput(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      setScore(parsed);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    await onDelete(name);
    setIsDeleting(false);
    setShowConfirmDelete(false);
  };

  return (
    <div className={`space-y-4 transition-all duration-300 ${isDeleting ? 'opacity-30 scale-95 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-white/80">{name}</label>
              {isCustom && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest">Custom</span>
              )}
            </div>
          </div>
          {(isPending || savingId === name) && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-4">
          {isCustom && canEdit && applicantStatus !== 'rejected' && (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
              {showConfirmDelete ? (
                <div className="flex items-center gap-2 bg-rose-500/10 p-1 rounded-lg border border-rose-500/20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowConfirmDelete(false)}
                    className="h-6 px-2 text-[10px] font-bold uppercase text-muted-foreground hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteConfirmed}
                    className="h-6 px-2 text-[10px] font-bold uppercase bg-rose-500 hover:bg-rose-600"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowConfirmDelete(true)}
                  className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
          <span className={`text-xl font-black ${score >= 7 ? 'text-emerald-400' : score >= 4 ? 'text-primary' : 'text-amber-400'}`}>
            {score}/10
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          disabled={!canEdit || ['rejected', 'hired'].includes(applicantStatus)}
          value={[score]}
          max={10}
          step={1}
          onValueChange={(val) => handleScoreChange(val[0])}
          className="flex-1"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Score</span>
          <Input
            type="text"
            disabled={!canEdit || ['rejected', 'hired'].includes(applicantStatus)}
            value={scoreInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-14 h-8 text-center font-bold bg-white/5 border-white/10 rounded-lg text-xs"
          />
        </div>
      </div>
      {canEdit ? (
        <Input 
          placeholder="Add optional notes..."
          disabled={['rejected', 'hired'].includes(applicantStatus)}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-8 text-xs bg-white/[0.02] border-white/5 focus:border-primary/30"
        />
      ) : (
        comment && (
          <p className="text-xs text-muted-foreground bg-white/5 p-3 rounded-xl border border-white/5 italic">
            &quot;{comment}&quot;
          </p>
        )
      )}
    </div>
  );
}

export function EvaluationCard({ 
  title, 
  role, 
  canEdit, 
  metrics, 
  applicantId, 
  userId,
  applicantStatus,
  onUpdate, 
  onDelete
}: EvaluationCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const defaultMetrics = role === 'recruiter' 
    ? ["Communication", "Basic Skills", "Cultural Alignment"]
    : ["Strategic Value", "Leadership Potential", "Final Decision"];

  const handleSave = useCallback(async (name: string, score: number, comment: string) => {
    if (['rejected', 'hired'].includes(applicantStatus)) return;

    setSavingId(name);
    const metricData = {
      application_id: applicantId,
      evaluator_id: userId,
      evaluator_role: role,
      metric_name: name,
      score: score,
      comment: comment
    };

    const res = await saveApplicationMetric(metricData);
    if (res.success) {
      onUpdate(metricData as Metric);
    }
    setSavingId(null);
  }, [applicantId, userId, role, applicantStatus, onUpdate]);

  const handleDelete = useCallback(async (name: string) => {
    const res = await deleteApplicationMetric(applicantId, role, name);
    if (res.success) {
      toast.success(`${name} removed`);
      if (onDelete) onDelete(name);
    } else {
      toast.error("Failed to remove metric");
    }
  }, [applicantId, role, onDelete]);

  const handleAddNew = async () => {
    if (!newMetricName.trim()) return;
    await handleSave(newMetricName, 5, "");
    setNewMetricName("");
    setIsAdding(false);
  };

  const existingNames = metrics.map(m => m.metric_name);
  const allMetricNames = Array.from(new Set([...defaultMetrics, ...existingNames]));

  return (
    <Card className={`glass-card border-white/10 transition-all duration-500 ${!canEdit ? 'opacity-70 grayscale-[0.5]' : 'ring-1 ring-primary/10 hover:ring-primary/20'}`}>
      <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${role === 'recruiter' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-primary/10 text-primary'}`}>
            {role === 'recruiter' ? <UserCheck className="w-4 h-4" /> : <Star className="w-4 h-4" />}
          </div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </div>
        {!canEdit && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
            <ShieldAlert className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Read Only</span>
          </div>
        )}
        {canEdit && applicantStatus === 'rejected' && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Updates Disabled</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="space-y-10">
          {allMetricNames.map((name) => (
            <EvaluationItem
              key={name}
              name={name}
              initialMetric={metrics.find(metric => metric.metric_name === name)}
              canEdit={canEdit}
              applicantStatus={applicantStatus}
              onSave={handleSave}
              onDelete={handleDelete}
              savingId={savingId}
              isCustom={!defaultMetrics.includes(name)}
            />
          ))}
        </div>

        {canEdit && (
          <div className="pt-4">
            {isAdding ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input 
                  placeholder="Metric name (e.g. Logic)" 
                  value={newMetricName}
                  onChange={(e) => setNewMetricName(e.target.value)}
                  className="h-10 bg-white/5 border-white/10 rounded-xl"
                  autoFocus
                />
                <Button onClick={handleAddNew} size="icon" className="h-10 w-10 rounded-xl">
                  {savingId === newMetricName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => setIsAdding(true)}
                disabled={['rejected', 'hired'].includes(applicantStatus)}
                className="w-full h-12 border-2 border-dashed border-white/5 hover:border-primary/30 rounded-2xl text-muted-foreground hover:text-primary transition-all group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                Add Custom Metric
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
