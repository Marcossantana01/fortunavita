import ConsultantRegisterForm from "@/components/dashboard/ConsultantRegisterForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardData } from "@/services/dashboardData";

export default async function NovoConsultorPage() {
  const dashboard = await getDashboardData("gestor");

  return (
    <DashboardLayout
      activeItem="Equipe"
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Gestor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card client-register-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Cadastrar consultor</h2>
              <p>Informe os dados de acesso e modalidade de atendimento.</p>
            </div>
          </div>

          <ConsultantRegisterForm />
        </section>
      </div>
    </DashboardLayout>
  );
}
