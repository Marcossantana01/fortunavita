import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/services/dashboardData";

export default async function GestorPage() {
  const data = await getDashboardData("gestor");

  return <DashboardView data={data} />;
}
