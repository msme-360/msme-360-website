"use client";

import { useState, useEffect } from "react";
import { 
  addTeamMember as addMemberAction, 
  updateComplianceTaskStatus,
  fetchTeamMembers,
  fetchComplianceTasks
} from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ComplianceItem, TeamMember } from "../OperationsTools";

export function useOperations() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [teamData, complianceData] = await Promise.all([
          fetchTeamMembers(),
          fetchComplianceTasks()
        ]);
        setTeam(teamData);
        setCompliance(complianceData);
      } catch (error) {
        logger.error("Failed to initialize Operations logic", "useOperations", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const markFiled = async (id: string) => {
    try {
      const result = await updateComplianceTaskStatus(id, 'filed');
      if (result.success) {
        setCompliance(prev => prev.map(item => 
          item.id === id ? { ...item, status: "filed" } : item
        ));
        toast.success("Task marked as filed");
        return true;
      } else {
        toast.error(result.error || "Failed to update task");
        return false;
      }
    } catch (error) {
      logger.error("markFiled failed", "useOperations", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  const handleAddTeamMember = async () => {
    setIsAddingMember(true);
    const names = ["Sameer Khan", "Priya Das", "Vikram Singh"];
    const roles = ["salesExecutive", "supportStar", "leadDeveloper"];
    const random = Math.floor(Math.random() * 3);
    const newMemberName = names[random];
    const newMemberRole = roles[random];
    
    try {
      const result = await addMemberAction({ full_name: newMemberName, role_key: newMemberRole });
      if (result.success) {
        const updatedTeam = await fetchTeamMembers();
        setTeam(updatedTeam);
        toast.success(`Welcome ${newMemberName} to the team!`);
        return true;
      } else {
        toast.error(result.error || "Failed to add team member");
        return false;
      }
    } catch (error) {
      logger.error("handleAddTeamMember failed", "useOperations", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsAddingMember(false);
    }
  };

  return {
    team,
    compliance,
    isLoading,
    isAddingMember,
    markFiled,
    handleAddTeamMember
  };
}
