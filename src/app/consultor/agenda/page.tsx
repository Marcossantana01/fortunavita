import ConsultorSectionView from "@/components/dashboard/ConsultorSectionView";
import { getConsultorSectionData } from "@/services/consultorData";
import { getDashboardData } from "@/services/dashboardData";

export default async function ConsultorAgendaPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("consultor"),
    getConsultorSectionData("agenda"),
  ]);

  return <ConsultorSectionView dashboard={dashboard} section={section} />;
}
