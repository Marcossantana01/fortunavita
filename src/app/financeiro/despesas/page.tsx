import FinanceiroExpenseForm from "@/components/dashboard/FinanceiroExpenseForm";
import FinanceiroSectionView from "@/components/dashboard/FinanceiroSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getFinanceiroSectionData } from "@/services/financeiroSectionData";

export default async function FinanceiroDespesasPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("financeiro"),
    getFinanceiroSectionData("despesas"),
  ]);

  return <FinanceiroSectionView action={<FinanceiroExpenseForm />} dashboard={dashboard} section={section} />;
}
