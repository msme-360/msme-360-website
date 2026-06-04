"use client";

import { useState, useMemo } from "react";
import { type DateRange } from "react-day-picker";
import { isSameDay, isWithinInterval, startOfDay, endOfDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { handlePoWReview } from "../actions";
import { CheckCircle2, XCircle, Clock, User, ExternalLink, Award, Target, CalendarDays, MessageSquare, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommendationDialog } from "./components/CommendationDialog";
import { TaskCommentSection } from "./components/TaskCommentSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateMissionDialog from "./components/CreateMissionDialog";

interface ReviewTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  proof_of_work: string;
  assigned_to: string;
  updated_at: string;
  created_at: string;
  due_date: string | null;
  assigned_to_profile?: {
    full_name: string;
    role: string;
  };
}

export function MissionReviewClient({ initialTasks = [], initialActiveTasks = [], mentorId, teamMembers = [] }: { initialTasks: ReviewTask[], initialActiveTasks?: ReviewTask[], mentorId: string, teamMembers?: { id: string, full_name: string | null }[] }) {
  const [tasks, setTasks] = useState<ReviewTask[]>(initialTasks);
  const [activeTasks] = useState<ReviewTask[]>(initialActiveTasks);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [commendationTarget, setCommendationTarget] = useState<{ id: string, name: string } | null>(null);

  // Active Deployments state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string | null>(null);
  const [selectedPersonnelTaskId, setSelectedPersonnelTaskId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'tasks' | 'chat'>('tasks');
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');

  // Calendar dot indicators
  const startDates = useMemo(() =>
    activeTasks.map(t => new Date(t.created_at)),
  [activeTasks]);

  const dueDates = useMemo(() =>
    activeTasks.filter(t => t.due_date).map(t => new Date(t.due_date!)),
  [activeTasks]);

  // Filter active tasks by selected date range (using due_date)
  const filteredActiveTasks = useMemo(() => {
    if (!dateRange?.from) return activeTasks;
    const from = startOfDay(dateRange.from);
    const to = endOfDay(dateRange.to ?? dateRange.from);
    return activeTasks.filter(t => {
      const due = t.due_date ? new Date(t.due_date) : undefined;
      const start = new Date(t.created_at);
      const matchesDue = due ? isWithinInterval(due, { start: from, end: to }) : false;
      const matchesStart = isWithinInterval(start, { start: from, end: to });
      return matchesDue || matchesStart;
    });
  }, [activeTasks, dateRange]);

  const groupedActiveTasks = useMemo(() => {
    const groups: Record<string, ReviewTask[]> = {};
    filteredActiveTasks.forEach(task => {
      if (!groups[task.title]) groups[task.title] = [];
      groups[task.title].push(task);
    });
    return Object.entries(groups).map(([title, groupedTasks]) => ({
      title,
      tasks: groupedTasks,
      description: groupedTasks[0].description,
      priority: groupedTasks[0].priority,
      created_at: groupedTasks[0].created_at,
      due_date: groupedTasks[0].due_date,
    }));
  }, [filteredActiveTasks]);

  const selectedGroup = groupedActiveTasks.find(g => g.title === selectedTaskTitle);
  const selectedPersonnelTask = activeTasks.find(t => t.id === selectedPersonnelTaskId);

  const handleVerify = async (taskId: string, decision: 'completed' | 'in_progress') => {
    setIsSubmitting(taskId);
    // Map internal UI decisions to backend action types
    const backendDecision = decision === 'completed' ? 'verified' : 'rejected';
    const res = await handlePoWReview(taskId, backendDecision, reviewNote[taskId] || "", mentorId);
    
    if (res.success) {
      toast.success(decision === 'completed' ? "Mission finalized." : "Task returned for correction.");
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      toast.error("Protocol failure. Unable to verify mission.");
    }
    setIsSubmitting(null);
  };

  return (
    <AdminViewWrapper
      title="Mission Control"
      subtitle="Review tactical output and manage active deployments."
      badgeLabel="GOVERNANCE"
      authorityLevel="Mentor/Lead Review"
      actions={
        <CreateMissionDialog
          mentorId={mentorId}
          teamMembers={teamMembers}
          trigger={
            <Button className="flex items-center gap-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
              <span className="text-base leading-none mb-0.5">+</span> New Mission
            </Button>
          }
        />
      }
    >
      <Tabs defaultValue="verification" className="w-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <TabsList className="bg-white/5 border border-white/10 w-full justify-start h-14 p-1 rounded-2xl">
          <TabsTrigger value="verification" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold uppercase tracking-widest px-8">
            Verification Queue
            {tasks.length > 0 && (
              <span className="ml-2 bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px]">{tasks.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold uppercase tracking-widest px-8">
            Active Deployments
            {activeTasks.length > 0 && (
              <span className="ml-2 bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px]">{activeTasks.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="m-0 border-none p-0 outline-none">
          {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">Queue Clear</h3>
            <p className="text-muted-foreground text-sm">No pending mission verifications detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-2">Pending Review</Badge>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Index: {task.id.slice(0, 8)}</span>
                      </div>
                      <CardTitle className="text-2xl font-display font-bold tracking-tight mt-2">{task.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                       <div className="text-right">
                          <p className="text-sm font-bold text-white">{task.assigned_to_profile?.full_name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{task.assigned_to_profile?.role || "Associate"}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <User className="w-5 h-5 text-primary" />
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission Brief</h4>
                      <p className="text-sm text-indigo-100/60 leading-relaxed">{task.description || "No description provided."}</p>
                      
                      <div className="pt-4 flex items-center gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Submitted</p>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {formatDistanceToNow(new Date(task.updated_at || task.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Priority</p>
                          <Badge variant="outline" className="border-white/10 text-[10px] font-bold">{task.priority}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Proof of Work (PoW)</h4>
                           <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-400/40 hover:text-emerald-400">
                             <ExternalLink className="w-3 h-3" />
                           </Button>
                        </div>
                        <div className="text-sm text-emerald-50/80 font-mono bg-black/40 p-4 rounded-xl border border-emerald-500/10 min-h-[100px]">
                          {task.proof_of_work || "No proof of work artifacts submitted."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <TaskCommentSection taskId={task.id} currentUserId={mentorId} />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">

                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Mentor Resolution Note</h4>
                    <Textarea 
                      placeholder="Provide feedback or instructions for mission finalization..."
                      className="bg-black/40 border-white/10 rounded-2xl min-h-[100px] text-sm focus:ring-primary/20"
                      value={reviewNote[task.id] || ""}
                      onChange={(e) => setReviewNote(prev => ({ ...prev, [task.id]: e.target.value }))}
                    />
                    
                    <div className="flex items-center justify-end gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        disabled={isSubmitting === task.id}
                        onClick={() => handleVerify(task.id, 'in_progress')}
                        className="h-12 px-8 rounded-2xl border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Return for Correction
                      </Button>
                      <Button 
                        variant="outline"
                        disabled={isSubmitting === task.id}
                        onClick={() => setCommendationTarget({ id: task.assigned_to, name: task.assigned_to_profile?.full_name || "Associate" })}
                        className="h-12 px-8 rounded-2xl border-primary/20 text-primary hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Commend Associate
                      </Button>
                      <Button 
                        disabled={isSubmitting === task.id}
                        onClick={() => handleVerify(task.id, 'completed')}
                        className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalize & Close Mission
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </TabsContent>

        <TabsContent value="active" className="m-0 border-none p-0 outline-none">
          {/* === DESKTOP: 4-quadrant grid === */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4" style={{ gridTemplateRows: '520px 460px' }}>
            {/* TOP-LEFT: Calendar */}
            <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-white/5 p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Mission Calendar</CardTitle>
                </div>
                {dateRange?.from && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {dateRange.to && !isSameDay(dateRange.from, dateRange.to)
                      ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`
                      : format(dateRange.from, 'MMM d, yyyy')}
                    {' '}· {groupedActiveTasks.length} mission{groupedActiveTasks.length !== 1 ? 's' : ''}
                    {filteredActiveTasks.length !== groupedActiveTasks.length && ` (${filteredActiveTasks.length} assignees)`}
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden flex items-center justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setSelectedTaskTitle(null);
                    setSelectedPersonnelTaskId(null);
                  }}
                  modifiers={{ startDate: startDates, dueDate: dueDates }}
                  modifiersClassNames={{
                    startDate: '[&_button]:after:absolute [&_button]:after:bottom-0.5 [&_button]:after:left-2 [&_button]:after:w-1.5 [&_button]:after:h-1.5 [&_button]:after:rounded-full [&_button]:after:bg-emerald-400 [&_button]:after:content-[\'\']',
                    dueDate: '[&_button]:after:absolute [&_button]:after:bottom-0.5 [&_button]:after:right-2 [&_button]:after:w-1.5 [&_button]:after:h-1.5 [&_button]:after:rounded-full [&_button]:after:bg-red-400 [&_button]:after:content-[\'\']',
                  }}
                  classNames={{ root: "w-full" }}
                  className="p-10 pb-0 mt-8"
                />
              </CardContent>
            </Card>

            {/* TOP-RIGHT: Mission List */}
            <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-white/5 p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Deployed Missions</CardTitle>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold">{groupedActiveTasks.length}</Badge>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-2">
                  {groupedActiveTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                      <Target className="w-8 h-8 text-white/10 mb-3" />
                      <p className="text-sm font-bold text-white/40">{dateRange?.from ? 'No missions in this range' : 'Select a date range to filter'}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{dateRange?.from ? 'Try a wider date range' : 'Or view all active missions below'}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {groupedActiveTasks.map(group => (
                        <button
                          key={group.title}
                          onClick={() => { setSelectedTaskTitle(group.title); setSelectedPersonnelTaskId(null); }}
                          className={`w-full text-left p-4 hover:bg-white/5 transition-all flex items-start justify-between gap-4 ${
                            selectedTaskTitle === group.title ? 'bg-primary/10 border-l-2 border-primary' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{group.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{group.description || 'No description'}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-bold text-white/40 uppercase">{group.tasks.length} personnel</span>
                              {group.due_date && (
                                <span className="text-[9px] font-bold text-indigo-400 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" /> Due {format(new Date(group.due_date), 'MMM d')}
                                </span>
                              )}
                              <Badge variant="outline" className="border-white/10 text-[8px] font-bold px-1 py-0">{group.priority}</Badge>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${selectedTaskTitle === group.title ? 'text-primary' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </Card>

            {/* BOTTOM-LEFT: Personnel */}
            <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-white/5 p-4 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest">
                    {selectedGroup ? `Personnel · ${selectedGroup.title}` : 'Personnel'}
                  </CardTitle>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {!selectedGroup ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <User className="w-8 h-8 text-white/10 mb-3" />
                      <p className="text-sm font-bold text-white/40">Select a mission</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Choose a mission to see its assigned personnel</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {selectedGroup.tasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedPersonnelTaskId(task.id)}
                          className={`w-full text-left p-4 hover:bg-white/5 transition-all flex items-center justify-between gap-4 ${
                            selectedPersonnelTaskId === task.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{task.assigned_to_profile?.full_name || 'Assigned'}</p>
                              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{task.assigned_to_profile?.role || 'Associate'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[9px] font-bold px-1.5 py-0 ${
                              task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-white/10 text-white/60 border-white/20'
                            }`}>{task.status}</Badge>
                            <MessageSquare className={`w-4 h-4 shrink-0 ${selectedPersonnelTaskId === task.id ? 'text-primary' : 'text-white/20'}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </Card>

            {/* BOTTOM-RIGHT: Chat Relay */}
            <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-white/5 p-4 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest">
                    {selectedPersonnelTask
                      ? `Comms · ${selectedPersonnelTask.assigned_to_profile?.full_name || 'Associate'}`
                      : 'Communications Relay'}
                  </CardTitle>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-auto p-4">
                {!selectedPersonnelTask ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-8 h-8 text-white/10 mb-3" />
                    <p className="text-sm font-bold text-white/40">No channel selected</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Select a team member to open their comms channel</p>
                  </div>
                ) : (
                  <TaskCommentSection taskId={selectedPersonnelTask.id} currentUserId={mentorId} />
                )}
              </div>
            </Card>
          </div>

          {/* === MOBILE: Date popover + member filter + task list → chat === */}
          <div className="lg:hidden">
            {mobileView === 'tasks' ? (
              <div className="space-y-4">
                {/* Filter Row */}
                <div className="flex items-center gap-2">
                  {/* Date Picker */}
                  <Popover open={mobileCalendarOpen} onOpenChange={setMobileCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button className={`flex items-center gap-2 h-9 px-3 rounded-xl border text-[11px] font-bold flex-1 min-w-0 transition-all ${
                        dateRange?.from
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/5 text-muted-foreground'
                      }`}>
                        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {dateRange?.from
                            ? dateRange.to && !isSameDay(dateRange.from, dateRange.to)
                              ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d')}`
                              : format(dateRange.from, 'MMM d, yyyy')
                            : 'Select dates'}
                        </span>
                        {dateRange?.from && (
                          <span
                            role="button"
                            onClick={(e) => { e.stopPropagation(); setDateRange(undefined); setSelectedTaskTitle(null); setSelectedPersonnelTaskId(null); }}
                            className="ml-auto text-white/40 hover:text-white shrink-0"
                          >×</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border border-white/10" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          setSelectedTaskTitle(null);
                          setSelectedPersonnelTaskId(null);
                          if (range?.to) setMobileCalendarOpen(false);
                        }}
                        modifiers={{ startDate: startDates, dueDate: dueDates }}
                        modifiersClassNames={{
                          startDate: '[&_button]:after:absolute [&_button]:after:bottom-0.5 [&_button]:after:left-2 [&_button]:after:w-1.5 [&_button]:after:h-1.5 [&_button]:after:rounded-full [&_button]:after:bg-emerald-400 [&_button]:after:content-[\'\']',
                          dueDate: '[&_button]:after:absolute [&_button]:after:bottom-0.5 [&_button]:after:right-2 [&_button]:after:w-1.5 [&_button]:after:h-1.5 [&_button]:after:rounded-full [&_button]:after:bg-red-400 [&_button]:after:content-[\'\']',
                        }}
                        classNames={{ root: "w-full" }}
                        className="[--cell-size:--spacing(9)]"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Member Filter */}
                  <Select value={selectedMemberFilter} onValueChange={setSelectedMemberFilter}>
                    <SelectTrigger className="h-9 w-[140px] shrink-0 rounded-xl border-white/10 bg-white/5 text-[11px] font-bold text-muted-foreground">
                      <SelectValue placeholder="All members" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-white/10">
                      <SelectItem value="all" className="text-xs">All members</SelectItem>
                      {teamMembers.map(m => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">
                          {m.full_name || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Task list */}
                {(() => {
                  const mobileTasks = filteredActiveTasks.filter(t =>
                    selectedMemberFilter === 'all' || t.assigned_to === selectedMemberFilter
                  );
                  if (mobileTasks.length === 0) return (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                      <Target className="w-10 h-10 text-white/10 mb-3" />
                      <p className="text-sm font-bold text-white/40">
                        {dateRange?.from || selectedMemberFilter !== 'all' ? 'No missions match filters' : 'No active missions'}
                      </p>
                    </div>
                  );
                  return (
                    <div className="space-y-2">
                      {mobileTasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => { setSelectedPersonnelTaskId(task.id); setMobileView('chat'); }}
                          className="w-full text-left p-4 glass-card border border-white/5 rounded-2xl hover:border-primary/30 transition-all flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{task.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{task.assigned_to_profile?.full_name || 'Assigned'}</p>
                              {task.due_date && (
                                <p className="text-[9px] text-red-400/80 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-2.5 h-2.5" /> Due {format(new Date(task.due_date), 'MMM d')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={`text-[9px] font-bold px-1.5 py-0 ${
                              task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/10 text-white/60 border-white/20'
                            }`}>{task.status}</Badge>
                            <ChevronRight className="w-4 h-4 text-white/30" />
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              // Mobile Chat View
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setMobileView('tasks')}
                  className="text-[11px] font-bold text-muted-foreground hover:text-white -ml-2">
                  ← Back to missions
                </Button>
                {selectedPersonnelTask && (
                  <div className="glass-card border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selectedPersonnelTask.assigned_to_profile?.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{selectedPersonnelTask.title}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPersonnelTask
                  ? <TaskCommentSection taskId={selectedPersonnelTask.id} currentUserId={mentorId} />
                  : <p className="text-sm text-muted-foreground">No channel selected.</p>
                }
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CommendationDialog 
        isOpen={!!commendationTarget}
        onOpenChange={(open) => !open && setCommendationTarget(null)}
        userId={commendationTarget?.id || ""}
        userName={commendationTarget?.name || ""}
        mentorId={mentorId}
      />
    </AdminViewWrapper>
  );
}