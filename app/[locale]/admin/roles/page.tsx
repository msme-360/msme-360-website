import React from "react";
import { getAllProfiles } from "../actions";
import { RoleManagerClient } from "./RoleManagerClient";
import { getAttendanceLogs } from "@/app/[locale]/internal/actions";

export default async function RoleManagerPage() {
  const [profiles, attendance] = await Promise.all([
    getAllProfiles(),
    getAttendanceLogs()
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RoleManagerClient initialProfiles={profiles} initialAttendance={attendance} />
    </div>
  );
}
