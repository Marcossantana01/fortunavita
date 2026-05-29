import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/services/dashboardData";

export default async function FinanceiroPage() {
  const data = await getDashboardData("financeiro");

  return <DashboardView data={data} />;
}
