"use server";

/**
 * MSME 360 ADMINISTRATIVE ACTIONS HUB
 * This file serves as a barrel for modularized server actions.
 * Refactored for better maintainability and reduced monolith size.
 */

import * as shared from "./actions-modules/shared";
import * as hiring from "./actions-modules/hiring";
import * as governance from "./actions-modules/governance";
import * as rbac from "./actions-modules/rbac";
import * as policy from "./actions-modules/policy";
import * as executive from "./actions-modules/executive";
import * as googleAuth from "./actions-modules/google-auth";
import * as support from "./actions-modules/support";
import * as audit from "./actions-modules/audit";
import * as tech from "./actions-modules/tech";

// --- SHARED ACTIONS ---
export async function logSystemAction(...args: Parameters<typeof shared.logSystemAction>) {
  return shared.logSystemAction(...args);
}

// --- HIRING ACTIONS ---
export async function getApplicants(...args: Parameters<typeof hiring.getApplicants>) {
  return hiring.getApplicants(...args);
}
export async function updateApplicationStatus(...args: Parameters<typeof hiring.updateApplicationStatus>) {
  return hiring.updateApplicationStatus(...args);
}
export async function onboardIntern(...args: Parameters<typeof hiring.onboardIntern>) {
  return hiring.onboardIntern(...args);
}
export async function scheduleInterview(...args: Parameters<typeof hiring.scheduleInterview>) {
  return hiring.scheduleInterview(...args);
}
export async function archiveApplication(...args: Parameters<typeof hiring.archiveApplication>) {
  return hiring.archiveApplication(...args);
}
export async function restoreApplication(...args: Parameters<typeof hiring.restoreApplication>) {
  return hiring.restoreApplication(...args);
}
export async function getCareerRoles(...args: Parameters<typeof hiring.getCareerRoles>) {
  return hiring.getCareerRoles(...args);
}
export async function saveCareerRole(...args: Parameters<typeof hiring.saveCareerRole>) {
  return hiring.saveCareerRole(...args);
}
export async function deleteCareerRole(...args: Parameters<typeof hiring.deleteCareerRole>) {
  return hiring.deleteCareerRole(...args);
}
export async function getApplicationMetrics(...args: Parameters<typeof hiring.getApplicationMetrics>) {
  return hiring.getApplicationMetrics(...args);
}
export async function saveApplicationMetric(...args: Parameters<typeof hiring.saveApplicationMetric>) {
  return hiring.saveApplicationMetric(...args);
}
export async function deleteApplicationMetric(...args: Parameters<typeof hiring.deleteApplicationMetric>) {
  return hiring.deleteApplicationMetric(...args);
}
export async function updateApplicationRole(...args: Parameters<typeof hiring.updateApplicationRole>) {
  return hiring.updateApplicationRole(...args);
}

// --- ONBOARDING & MENTORSHIP ---
export async function getMentorProfiles(...args: Parameters<typeof hiring.getMentorProfiles>) {
  return hiring.getMentorProfiles(...args);
}
export async function updateOnboardingProgress(...args: Parameters<typeof hiring.updateOnboardingProgress>) {
  return hiring.updateOnboardingProgress(...args);
}
export async function updateOnboardingDetails(...args: Parameters<typeof hiring.updateOnboardingDetails>) {
  return hiring.updateOnboardingDetails(...args);
}

// --- GOVERNANCE ACTIONS ---
export async function voteOnResolution(...args: Parameters<typeof governance.voteOnResolution>) {
  return governance.voteOnResolution(...args);
}
export async function getBoardProposals(...args: Parameters<typeof governance.getBoardProposals>) {
  return governance.getBoardProposals(...args);
}
export async function executeStrategicExit(...args: Parameters<typeof governance.executeStrategicExit>) {
  return governance.executeStrategicExit(...args);
}
export async function getGovernanceData(...args: Parameters<typeof governance.getGovernanceData>) {
  return governance.getGovernanceData(...args);
}
export async function getOffboardingTargets(...args: Parameters<typeof governance.getOffboardingTargets>) {
  return governance.getOffboardingTargets(...args);
}
export async function toggleSystemMode(...args: Parameters<typeof governance.toggleSystemMode>) {
  return governance.toggleSystemMode(...args);
}
export async function executeProtocolZero(...args: Parameters<typeof governance.executeProtocolZero>) {
  return governance.executeProtocolZero(...args);
}
export async function initiateSystemReIndex(...args: Parameters<typeof governance.initiateSystemReIndex>) {
  return governance.initiateSystemReIndex(...args);
}
export async function overrideSystemAction(...args: Parameters<typeof governance.overrideSystemAction>) {
  return governance.overrideSystemAction(...args);
}
export async function runPolicyAudit(...args: Parameters<typeof governance.runPolicyAudit>) {
  return governance.runPolicyAudit(...args);
}
export async function getRecruitmentMeetings(...args: Parameters<typeof governance.getRecruitmentMeetings>) {
  return governance.getRecruitmentMeetings(...args);
}
export async function getInternalMeetings(...args: Parameters<typeof governance.getInternalMeetings>) {
  return governance.getInternalMeetings(...args);
}

// --- AUDIT ACTIONS ---
export async function getAuditLogs(...args: Parameters<typeof audit.getAuditLogs>) {
  return audit.getAuditLogs(...args);
}

// --- RBAC ACTIONS ---
export async function updateUserRole(...args: Parameters<typeof rbac.updateUserRole>) {
  return rbac.updateUserRole(...args);
}
export async function updateUserProfile(...args: Parameters<typeof rbac.updateUserProfile>) {
  return rbac.updateUserProfile(...args);
}
export async function inviteUser(...args: Parameters<typeof rbac.inviteUser>) {
  return rbac.inviteUser(...args);
}
export async function inviteNewUser(...args: Parameters<typeof rbac.inviteNewUser>) {
  return rbac.inviteNewUser(...args);
}
export async function requestAccessElevation(...args: Parameters<typeof rbac.requestAccessElevation>) {
  return rbac.requestAccessElevation(...args);
}
export async function updateUserMapping(...args: Parameters<typeof rbac.updateUserMapping>) {
  return rbac.updateUserMapping(...args);
}
export async function deleteUserProfile(...args: Parameters<typeof rbac.deleteUserProfile>) {
  return rbac.deleteUserProfile(...args);
}

// --- POLICY ACTIONS ---
export async function getPolicyData(...args: Parameters<typeof policy.getPolicyData>) {
  return policy.getPolicyData(...args);
}
export async function updatePolicyStatus(...args: Parameters<typeof policy.updatePolicyStatus>) {
  return policy.updatePolicyStatus(...args);
}
export async function createPolicy(...args: Parameters<typeof policy.createPolicy>) {
  return policy.createPolicy(...args);
}
export async function getPolicies(...args: Parameters<typeof policy.getPolicies>) {
  return policy.getPolicies(...args);
}
export async function upsertPolicy(...args: Parameters<typeof policy.upsertPolicy>) {
  return policy.upsertPolicy(...args);
}

// --- EXECUTIVE ACTIONS ---
export async function getExecutiveAnalytics(...args: Parameters<typeof executive.getExecutiveAnalytics>) {
  return executive.getExecutiveAnalytics(...args);
}
export async function promoteUser(...args: Parameters<typeof executive.promoteUser>) {
  return executive.promoteUser(...args);
}
export async function getTeamPerformanceStats(...args: Parameters<typeof executive.getTeamPerformanceStats>) {
  return executive.getTeamPerformanceStats(...args);
}
export type { ExecutiveAnalytics } from "./actions-modules/executive";

// --- GOOGLE AUTH ACTIONS ---
export async function getGoogleConnectionUrl(...args: Parameters<typeof googleAuth.getGoogleConnectionUrl>) {
  return googleAuth.getGoogleConnectionUrl(...args);
}
export async function linkGoogleAccount(...args: Parameters<typeof googleAuth.linkGoogleAccount>) {
  return googleAuth.linkGoogleAccount(...args);
}
export async function disconnectGoogleAccount(...args: Parameters<typeof googleAuth.disconnectGoogleAccount>) {
  return googleAuth.disconnectGoogleAccount(...args);
}

// --- SUPPORT ACTIONS ---
export async function getSupportTickets(...args: Parameters<typeof support.getSupportTickets>) {
  return support.getSupportTickets(...args);
}
export async function createSupportTicket(...args: Parameters<typeof support.createSupportTicket>) {
  return support.createSupportTicket(...args);
}
export async function resolveSupportTicket(...args: Parameters<typeof support.resolveSupportTicket>) {
  return support.resolveSupportTicket(...args);
}

// --- TECH ACTIONS ---
export async function getTechnicalHealthMetrics(...args: Parameters<typeof tech.getTechnicalHealthMetrics>) {
  return tech.getTechnicalHealthMetrics(...args);
}

// --- DEPRECATED / COMPATIBILITY ---
export async function getPlatformMetrics(category: string) {
  const { createServiceClient } = await import("@/services/supabase/supabase-server");
  const supabase = await createServiceClient();
  const { data } = await supabase.from('platform_metrics').select('*').eq('category', category);
  return data || [];
}
