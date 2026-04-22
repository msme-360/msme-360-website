import { NextResponse } from "next/server";
import { getSchemes, getTenders, getAIServices, getGTMTemplates, getSOPTemplates } from "@/app/[locale]/dashboard/queries";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Parallel fetching from cached sources
    const [schemes, tenders, aiServices, gtmTemplates, sopTemplates] = await Promise.all([
      getSchemes(query),
      getTenders(),
      getAIServices(),
      getGTMTemplates(),
      getSOPTemplates()
    ]);

    const results: Array<{
      title: string;
      description: string;
      href: string;
      category: string;
      type: string;
    }> = [];

    // Filter and map dynamic results
    // 1. Schemes (already filtered by query in getSchemes)
    schemes.forEach((s) => {
      results.push({
        title: s.title,
        description: s.description,
        href: `/dashboard/connect?scheme=${s.id}`,
        category: "Scheme",
        type: "dynamic"
      });
    });

    // 2. Tenders
    tenders.filter((t) =>
      t.title.toLowerCase().includes(query) ||
      t.agency.toLowerCase().includes(query)
    ).forEach((t) => {
      results.push({
        title: t.title,
        description: `Agency: ${t.agency} | Value: ${t.value_text}`,
        href: `/dashboard/gtm#tender-${t.id}`,
        category: "Tender",
        type: "dynamic"
      });
    });

    // 3. AI Services
    aiServices.filter((a) =>
      a.title_key.toLowerCase().includes(query) ||
      a.description_key.toLowerCase().includes(query)
    ).forEach((a) => {
      results.push({
        title: a.title_key, // Assuming title_key is the display text for now
        description: a.description_key,
        href: `/dashboard/grow?service=${a.id}`,
        category: "AI Service",
        type: "dynamic"
      });
    });

    // 4. Templates
    [...gtmTemplates, ...sopTemplates].filter((tmp) =>
      (tmp.title || tmp.title_key || "").toLowerCase().includes(query)
    ).forEach((tmp) => {
      results.push({
        title: tmp.title || tmp.title_key,
        description: "Business template / SOP",
        href: `/dashboard/operate`,
        category: "Template",
        type: "dynamic"
      });
    });

    return NextResponse.json(results.slice(0, 8));
  } catch (error) {
    logger.error("Global search API error", "api/search", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
