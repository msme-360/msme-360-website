import { Metadata } from "next";
import CommunityClient, { type FounderUpdate } from "./CommunityClient";
import { getFounderUpdates } from "@/app/[locale]/dashboard/queries";
import { Suspense } from "react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Founder Community Hub | MSME 360",
  description: "Connect with 50,000+ verified MSME founders. Share insights, build partnerships, and access exclusive growth circles.",
};

export default async function CommunityPage() {
  // Opting into dynamic rendering because of new Date() usages
  await headers();
  const initialUpdates = await getFounderUpdates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MSME Founder Updates",
    "description": "Latest updates from the MSME 360 founder community.",
    "numberOfItems": initialUpdates.length,
    "itemListElement": initialUpdates.map((update: FounderUpdate, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SocialMediaPosting",
        "author": {
          "@type": "Person",
          "name": update.founder,
          "worksFor": {
            "@type": "Organization",
            "name": update.company
          }
        },
        "headline": update.update,
        "datePublished": new Date().toISOString() // Fallback as mock data doesn't have exact dates
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="py-20 text-center opacity-50 italic">Syncing with Founder Network...</div>}>
        <CommunityClient initialUpdates={initialUpdates} />
      </Suspense>
    </>
  );
}
