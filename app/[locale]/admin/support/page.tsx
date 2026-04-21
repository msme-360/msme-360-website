import { SupportClient } from "./SupportClient";
import { getSupportTickets } from "../actions";

export default async function SupportQueuePage() {
  const tickets = await getSupportTickets();
  return <SupportClient initialTickets={tickets} />;
}
