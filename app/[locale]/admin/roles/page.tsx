import React from "react";
import { getAllProfiles } from "../actions";
import { RoleManagerClient } from "./RoleManagerClient";

export default async function RoleManagerPage() {
  const profiles = await getAllProfiles();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RoleManagerClient initialProfiles={profiles} />
    </div>
  );
}
