import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ConsultorSectionTable from "@/components/dashboard/ConsultorSectionTable";
import type { DashboardData } from "@/services/dashboardData";
import type { ConsultorSectionData } from "@/services/consultorData";

type ConsultorSectionViewProps = {
  dashboard: DashboardData;
  section: ConsultorSectionData;
};

export default function ConsultorSectionView({
  dashboard,
  section,
}: ConsultorSectionViewProps) {
  return (
    <DashboardLayout
      activeItem={section.activeItem}
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Consultor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card data-table-card consultor-section-card">
          <div className="dashboard-card-header">
            <div>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>
          </div>

          <ConsultorSectionTable section={section} />
        </section>
      </div>
    </DashboardLayout>
  );
}
