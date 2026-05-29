import RecepcaoSectionView from "@/components/dashboard/RecepcaoSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getRecepcaoSectionData } from "@/services/recepcaoSectionData";

export default async function RecepcaoClientesPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("recepcao"),
    getRecepcaoSectionData("contatos"),
  ]);

  return <RecepcaoSectionView dashboard={dashboard} section={section} />;
}
