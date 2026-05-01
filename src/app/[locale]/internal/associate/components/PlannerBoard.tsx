"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, Calendar, 
  MoreVertical, CheckCircle2, 
  Clock, AlertCircle, Grab} from "lucide-react";
import { Task } from "./AssociateTypes";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DashboardProfile } from "@/types/dashboard";

interface PlannerBoardProps {
  tasks: Task[];
  profile: DashboardProfile;
  onTaskStatus: (taskId: string, status: Task['status']) => void;
  onTaskSelect: (task: Task) => void;
}

export default function PlannerBoard({ tasks, profile, onTaskStatus, onTaskSelect }: PlannerBoardProps) {
  const tAssociate = useTranslations("Associate");
  const tPlanner = useTranslations("Planner");
  const router = useRouter();

  const columns: { id: Task['status']; label: string; color: string; icon: any }[] = [
    { id: 'pending', label: "Objectives", color: "text-muted-foreground", icon: Clock },
    { id: 'in_progress', label: "Active Ops", color: "text-indigo-400", icon: Zap },
    { id: 'completed', label: "Success", color: "text-emerald-400", icon: CheckCircle2 },
    { id: 'blocked', label: "Impediments", color: "text-rose-400", icon: AlertCircle },
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Trigger status update
    onTaskStatus(draggableId, destination.droppableId as Task['status']);
  };

  return (
    <div className="space-y-8 h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
          {columns.map(col => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-col gap-4 transition-colors rounded-3xl p-2 ${
                    snapshot.isDraggingOver ? 'bg-white/[0.05]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-2">
                      <col.icon className={`w-4 h-4 ${col.color}`} />
                      <h3 className="text-xs font-black uppercase tracking-widest text-white/70">{col.label}</h3>
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] py-0 px-1.5 opacity-50">
                        {tasks.filter(t => t.status === col.id).length}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 min-h-[200px]">
                    <AnimatePresence mode="popLayout">
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={`mb-3 outline-none ${snapshot.isDragging ? 'z-50' : ''}`}
                            >
                              <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card 
                                  onClick={() => onTaskSelect(task)}
                                  className={`glass-card border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden shadow-lg ${
                                    snapshot.isDragging ? 'border-indigo-500/50 shadow-indigo-500/20' : 'hover:shadow-indigo-500/10'
                                  }`}
                                >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                      <Grab className="w-3 h-3 text-white/20" />
                                      <Badge 
                                        variant="outline" 
                                        className={`text-[8px] uppercase tracking-tighter ${
                                          task.priority === 'Urgent' ? 'border-rose-500 text-rose-400 bg-rose-500/5' :
                                          task.priority === 'High' ? 'border-orange-500 text-orange-400 bg-orange-500/5' :
                                          'border-white/10 text-muted-foreground'
                                        }`}
                                      >
                                        {task.priority}
                                      </Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreVertical className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                  </div>

                                  <p className="text-sm font-bold text-white line-clamp-2 leading-snug">
                                    {task.title}
                                  </p>

                                  {task.description && (
                                    <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed italic">
                                      {task.description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <Calendar className="w-3 h-3" />
                                      <span className="text-[9px] font-medium">
                                        {task.due_date ? format(new Date(task.due_date), "MMM d") : "No date"}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    
                    {tasks.filter(t => t.status === col.id).length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-24 rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center">
                        <p className="text-[10px] text-white/10 uppercase font-black tracking-widest">{tPlanner("clearSector")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
