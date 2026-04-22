"use client";

import { useState, useMemo, useCallback } from "react";
import { fetchSupportTickets } from "@/app/[locale]/dashboard/actions";
import { logger } from "@/lib/logger";

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  category: string;
  created_at: string;
}

export function useHelpCenter(
  rawFaqs: { question: string, answer: string }[],
  searchQuery: string,
  initialTickets: SupportTicket[] = []
) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"faqs" | "tickets">("faqs");

  const loadTickets = useCallback(async (showLoading = true) => {
    if (showLoading) setTicketsLoading(true);
    try {
      const res = await fetchSupportTickets();
      setTickets(res);
    } catch (error) {
      logger.error("Failed to fetch tickets", "useHelpCenter", error);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  // No effect needed for initial load anymore as tickets come from props


  const filteredFaqs = useMemo(() => rawFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ), [rawFaqs, searchQuery]);

  const handleTicketSuccess = () => {
    loadTickets();
    setActiveTab("tickets");
  };

  return {
    tickets,
    ticketsLoading,
    activeTab,
    setActiveTab,
    filteredFaqs,
    handleTicketSuccess,
    refreshTickets: loadTickets
  };
}
