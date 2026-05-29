import AdminSectionView from "@/components/dashboard/AdminSectionView";
import { getAdminSectionData } from "@/services/adminSectionData";
import { getDashboardData } from "@/services/dashboardData";

export default async function AdminFinanceiroPage() {
  const [dashboard, section] = await Promise.all([
    getDashboardData("admin"),
    getAdminSectionData("financeiro"),
  ]);

  return <AdminSectionView dashboard={dashboard} section={section} />;
}
