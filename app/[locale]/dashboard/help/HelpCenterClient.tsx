"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import HelpHeader from "./components/HelpHeader";
import FAQSection from "./components/FAQSection";
import TicketHistory from "./components/TicketHistory";
import SupportTicketForm from "./components/SupportTicketForm";
import MentorshipTeaser from "./components/MentorshipTeaser";
import { useHelpCenter, type SupportTicket } from "./hooks/useHelpCenter";

export default function HelpCenterClient({ initialTickets }: { initialTickets: SupportTicket[] }) {
  const t = useTranslations("HelpCenter");
  const [searchQuery, setSearchQuery] = useState("");
  
  const rawFaqs = useMemo(() => t.raw("faqs") as { question: string, answer: string }[], [t]);
  
  const {
    tickets,
    ticketsLoading,
    activeTab,
    setActiveTab,
    filteredFaqs,
    handleTicketSuccess,
    refreshTickets
  } = useHelpCenter(rawFaqs, searchQuery, initialTickets);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HelpHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        ticketsCount={tickets.length} 
      />

      {activeTab === "faqs" ? (
        <FAQSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredFaqs={filteredFaqs}
        />
      ) : (
        <TicketHistory 
          tickets={tickets}
          ticketsLoading={ticketsLoading}
          onRefresh={refreshTickets}
        />
      )}

      <SupportTicketForm onSuccess={handleTicketSuccess} />
      <MentorshipTeaser />
    </div>
  );
}
