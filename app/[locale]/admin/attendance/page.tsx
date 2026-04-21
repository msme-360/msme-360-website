import React from "react";
import { getAttendanceLogs } from "@/app/[locale]/internal/actions";
import { AttendanceLogClient } from "./AttendanceLogClient";

export default async function AttendancePage() {
  const attendance = await getAttendanceLogs();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AttendanceLogClient initialAttendance={attendance} />
    </div>
  );
}
