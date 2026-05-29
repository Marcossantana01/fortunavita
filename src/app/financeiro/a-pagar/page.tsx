import FinanceiroSectionView from "@/components/dashboard/FinanceiroSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getFinanceiroSectionData } from "@/services/financeiroSectionData";

export default async function FinanceiroAPagarPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("financeiro"),
    getFinanceiroSectionData("a-pagar"),
  ]);

  return <FinanceiroSectionView dashboard={dashboard} section={section} />;
}
