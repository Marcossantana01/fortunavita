import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardData } from "@/services/dashboardData";

export default async function GestorChamadosPage() {
  const dashboard = await getDashboardData("gestor");

  return (
    <DashboardLayout
      activeItem=""
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Gestor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card support-ticket-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Suporte externo</h2>
              <p>Os chamados sao tratados pela empresa parceira responsavel pelo suporte.</p>
            </div>
            <a className="dashboard-card-action" href="mailto:suporte@seopartners.com.br">
              Acionar suporte
            </a>
          </div>

          <p className="section-helper-text">
            Este painel nao gerencia mais chamados internamente. Para demandas de acesso, falhas ou suporte tecnico,
            use o canal externo definido para a operacao.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
