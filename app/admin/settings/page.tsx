import SettingsForm from '@/components/admin/SettingsForm';
import { getAdminSettings } from '@/app/actions/settings';

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  return <SettingsForm initialSettings={settings} />;
}

export const dynamic = 'force-dynamic';
