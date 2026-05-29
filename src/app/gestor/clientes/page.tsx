import GestorSectionView from "@/components/dashboard/GestorSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorSectionData } from "@/services/gestorSectionData";

export default async function GestorClientesPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("gestor"),
    getGestorSectionData("clientes"),
  ]);

  return <GestorSectionView dashboard={dashboard} section={section} />;
}
