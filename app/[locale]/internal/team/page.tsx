import { TeamClient } from "./TeamClient";
import { getTeamMembers } from "../actions";

export default async function TeamIntrosPage() {
  const team = await getTeamMembers();
  return <TeamClient initialTeam={team} />;
}
