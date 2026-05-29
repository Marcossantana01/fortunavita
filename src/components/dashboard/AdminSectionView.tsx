import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GestorSectionTable from "@/components/dashboard/GestorSectionTable";
import type { AdminSectionData } from "@/services/adminSectionData";
import type { DashboardData } from "@/services/dashboardData";

type AdminSectionViewProps = {
  dashboard: DashboardData;
  section: AdminSectionData;
};

export default function AdminSectionView({ dashboard, section }: AdminSectionViewProps) {
  return (
    <DashboardLayout
      activeItem={section.activeItem}
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel Administrativo"
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

        <section className="dashboard-card admin-fields-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Campos do cadastro</h2>
              <p>Estrutura principal para criar e revisar registros desta area.</p>
            </div>
          </div>

          <div className="admin-fields-grid">
            {section.fields.map((field) => (
              <div className="admin-field-item" key={field.label}>
                <strong>{field.label}</strong>
                <span>{field.type}</span>
                {field.required && <em>Obrigatorio</em>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
