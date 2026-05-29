import FinanceiroSectionView from "@/components/dashboard/FinanceiroSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getFinanceiroSectionData } from "@/services/financeiroSectionData";

export default async function FinanceiroReceitasPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("financeiro"),
    getFinanceiroSectionData("receitas"),
  ]);

  return <FinanceiroSectionView dashboard={dashboard} section={section} />;
}
