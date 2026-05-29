import RecepcaoSectionView from "@/components/dashboard/RecepcaoSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getRecepcaoSectionData } from "@/services/recepcaoSectionData";

export default async function RecepcaoReunioesPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("recepcao"),
    getRecepcaoSectionData("reunioes"),
  ]);

  return <RecepcaoSectionView dashboard={dashboard} section={section} />;
}
