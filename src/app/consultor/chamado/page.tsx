import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardData } from "@/services/dashboardData";

export default async function ConsultorChamadoPage() {
  const dashboard = await getDashboardData("consultor");

  return (
    <DashboardLayout
      activeItem=""
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Consultor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card support-ticket-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Suporte externo</h2>
              <p>Os chamados sao acompanhados pela empresa parceira responsavel pelo suporte.</p>
            </div>
            <a className="dashboard-card-action" href="mailto:suporte@seopartners.com.br">
              Acionar suporte
            </a>
          </div>

          <p className="section-helper-text">
            Para problemas de acesso, falhas no sistema ou duvidas tecnicas, envie a solicitacao pelo canal externo.
            O acompanhamento nao fica mais dentro do painel da Fortuna Vita.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
