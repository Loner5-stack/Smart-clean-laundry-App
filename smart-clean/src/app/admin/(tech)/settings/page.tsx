import { getTiers } from "@/app/actions/tier";
import AdminSettingsClient from "./admin-settings-client";

export default async function AdminSettingsPage() {
  const tiers = await getTiers();
  
  return <AdminSettingsClient dbTiers={tiers} />;
}
