import ConsultorSectionView from "@/components/dashboard/ConsultorSectionView";
import { getConsultorSectionData } from "@/services/consultorData";
import { getDashboardData } from "@/services/dashboardData";

export default async function ConsultorLeadsPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("consultor"),
    getConsultorSectionData("leads"),
  ]);

  return <ConsultorSectionView dashboard={dashboard} section={section} />;
}
