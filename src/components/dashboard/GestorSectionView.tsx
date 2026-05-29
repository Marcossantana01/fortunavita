import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GestorSectionTable from "@/components/dashboard/GestorSectionTable";
import type { DashboardData } from "@/services/dashboardData";
import type { GestorSectionData } from "@/services/gestorSectionData";

type GestorSectionViewProps = {
  dashboard: DashboardData;
  section: GestorSectionData;
};

export default function GestorSectionView({ dashboard, section }: GestorSectionViewProps) {
  return (
    <DashboardLayout
      activeItem={section.activeItem}
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Gestor"
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
          </div>

          <GestorSectionTable section={section} />
        </section>
      </div>
    </DashboardLayout>
  );
}
