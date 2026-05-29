import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GestorLeadAssignment from "@/components/dashboard/GestorLeadAssignment";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorLeadsData } from "@/services/gestorLeadsData";

export default async function GestorLeadsPage() {
  const [dashboard, leadsData] = await Promise.all([
    getDashboardData("gestor"),
    getGestorLeadsData(),
  ]);

  return (
    <DashboardLayout
      activeItem="Leads"
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Gestor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <GestorLeadAssignment {...leadsData} />
      </div>
    </DashboardLayout>
  );
}
