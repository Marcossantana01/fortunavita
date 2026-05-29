import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GestorSectionTable from "@/components/dashboard/GestorSectionTable";
import type { ReactNode } from "react";
import type { DashboardData } from "@/services/dashboardData";
import type { GestorSectionData } from "@/services/gestorSectionData";

type FinanceiroSectionViewProps = {
  action?: ReactNode;
  dashboard: DashboardData;
  section: GestorSectionData;
};

export default function FinanceiroSectionView({ action, dashboard, section }: FinanceiroSectionViewProps) {
  return (
    <DashboardLayout
      activeItem={section.activeItem}
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel Financeiro"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card data-table-card gestor-section-card">
          <div className="dashboard-card-header">
            <div>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>
            {action}
          </div>

          <GestorSectionTable section={section} />
        </section>
      </div>
    </DashboardLayout>
  );
}
