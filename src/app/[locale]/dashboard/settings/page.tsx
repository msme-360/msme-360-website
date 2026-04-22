import { Metadata } from 'next';
import SettingsClient from './SettingsClient';
import { fetchUserSettings } from '../actions';

export const metadata: Metadata = {
  title: 'Account Settings | MSME 360',
  description: 'Manage your MSME 360 account preferences, notifications, and security settings. Customize your experience and safeguard your business profile.',
};

export default async function SettingsPage() {
  const initialSettings = await fetchUserSettings();

  return <SettingsClient initialSettings={initialSettings} />;
}
