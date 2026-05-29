import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/services/dashboardData";

export default async function RecepcaoPage() {
  const data = await getDashboardData("recepcao");

  return <DashboardView data={data} />;
}
