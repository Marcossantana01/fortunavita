import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/services/dashboardData";

export default async function AdminPage() {
  const data = await getDashboardData("admin");

  return <DashboardView data={data} />;
}
