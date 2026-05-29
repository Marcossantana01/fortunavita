import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/services/dashboardData";

export default async function ConsultorPage() {
  const data = await getDashboardData("consultor");

  return <DashboardView data={data} />;
}
