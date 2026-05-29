import GestorSectionView from "@/components/dashboard/GestorSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorSectionData } from "@/services/gestorSectionData";

export default async function GestorRelatoriosPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("gestor"),
    getGestorSectionData("relatorios"),
  ]);

  return <GestorSectionView dashboard={dashboard} section={section} />;
}
