import GestorSectionView from "@/components/dashboard/GestorSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorSectionData } from "@/services/gestorSectionData";

export default async function GestorAgendaPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("gestor"),
    getGestorSectionData("agenda"),
  ]);

  return <GestorSectionView dashboard={dashboard} section={section} />;
}
