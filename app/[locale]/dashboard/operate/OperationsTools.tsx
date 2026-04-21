"use client";

import { ComplianceTracker } from "./components/ComplianceTracker";
import { TeamLedger } from "./components/TeamLedger";
import { useOperations } from "./hooks/useOperations";

export interface ComplianceItem {
  id: string;
  task_name: string;
  due_date: string;
  status: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  role_key: string;
  status: string;
}

export function OperationsTools() {
  const {
    team,
    compliance,
    isLoading,
    isAddingMember,
    markFiled,
    handleAddTeamMember
  } = useOperations();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ComplianceTracker 
        compliance={compliance} 
        isLoading={isLoading} 
        onMarkFiled={markFiled} 
      />
      <TeamLedger 
        team={team} 
        isLoading={isLoading} 
        isAddingMember={isAddingMember} 
        onAddMember={handleAddTeamMember} 
      />
    </div>
  );
}
