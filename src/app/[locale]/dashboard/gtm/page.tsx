import { Metadata } from 'next';
import GTMHubClient from './GTMHubClient';
import { fetchTenders, fetchGTMTemplates } from '../actions';
import { Tender, GTMTemplate } from './hooks/useGTM';

export const metadata: Metadata = {
  title: 'GTM Hub | MSME 360',
  description: 'Scale your business with Go-To-Market strategy, competitive analysis, and industrial tender alerts. Access outreach templates and distribution insights.',
};

export default async function GoToMarketHub() {
  const [initialTenders, initialTemplates] = await Promise.all([
    fetchTenders() as Promise<Tender[]>,
    fetchGTMTemplates() as Promise<GTMTemplate[]>
  ]);

  return <GTMHubClient initialTenders={initialTenders} initialTemplates={initialTemplates} />;
}
