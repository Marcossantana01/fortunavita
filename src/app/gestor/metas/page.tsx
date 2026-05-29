import GestorSectionView from "@/components/dashboard/GestorSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorSectionData } from "@/services/gestorSectionData";

export default async function GestorMetasPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("gestor"),
    getGestorSectionData("metas"),
  ]);

  return <GestorSectionView dashboard={dashboard} section={section} />;
}
