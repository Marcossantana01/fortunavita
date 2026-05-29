import RecepcaoSectionView from "@/components/dashboard/RecepcaoSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getRecepcaoSectionData } from "@/services/recepcaoSectionData";

export default async function RecepcaoRecadosPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("recepcao"),
    getRecepcaoSectionData("recados"),
  ]);

  return <RecepcaoSectionView dashboard={dashboard} section={section} />;
}
