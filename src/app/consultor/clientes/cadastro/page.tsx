import ClientRegisterForm from "@/components/dashboard/ClientRegisterForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardData } from "@/services/dashboardData";
import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

type ClienteCadastroPageProps = {
  searchParams: Promise<{
    clienteId?: string;
    leadId?: string;
  }>;
};

function getString(row: SupabaseRow, key: string): string {
  const value = row[key];

  return value === undefined || value === null ? "" : String(value);
}

function cleanObservation(value: string): string {
  const withoutTestData = value.replace(/\bdado_teste_consultor\b/gi, "").trim();
  const documentIndex = withoutTestData.indexOf("Documentos:");

  return (documentIndex >= 0 ? withoutTestData.slice(0, documentIndex) : withoutTestData).trim();
}

function getDocuments(value: string): string {
  const documentIndex = value.indexOf("Documentos:");

  return documentIndex >= 0 ? value.slice(documentIndex + "Documentos:".length).trim() : "";
}

function formatDateInput(value: string): string {
  if (!value) {
    return "";
  }

  return value.includes("T") ? value.slice(0, 10) : value;
}

export default async function ClienteCadastroPage({ searchParams }: ClienteCadastroPageProps) {
  const { clienteId = "", leadId = "" } = await searchParams;
  const dashboard = await getDashboardData("consultor");
  const clientRows = clienteId
    ? await fetchSupabaseRows("clientes", { filters: { id: clienteId }, limit: 1 })
    : [];
  const leadRows = !clienteId && leadId
    ? await fetchSupabaseRows("leads", { filters: { id: leadId }, limit: 1 })
    : [];
  const client = clientRows[0] ?? {};
  const lead = leadRows[0] ?? {};
  const source = clienteId ? client : lead;
  const sourceObservations = getString(source, clienteId ? "observacoes" : "mensagem");

  return (
    <DashboardLayout
      activeItem="Meus Clientes"
      dateLabel="24 Maio, 2026"
      menuItems={dashboard.menuItems}
      panelTitle="Painel do Consultor"
      userAvatar={dashboard.user.avatar}
      userName={dashboard.user.name}
      userRole={dashboard.user.role}
    >
      <div className="dashboard-content">
        <section className="dashboard-card client-register-card">
          <div className="dashboard-card-header">
            <div>
              <h2>{clienteId ? "Editar cliente" : "Cadastrar cliente"}</h2>
              <p>{clienteId ? "Atualize os dados do cliente." : "Complete os dados para converter o lead em cliente."}</p>
            </div>
          </div>

          <ClientRegisterForm
            initialValues={{
              clienteId,
              consultor_id: getString(source, "consultor_id"),
              cpf: getString(client, "cpf"),
              data_nascimento: formatDateInput(getString(client, "data_nascimento")),
              documentos: getDocuments(sourceObservations),
              email: getString(source, "email"),
              estado_civil: getString(client, "estado_civil"),
              leadId,
              nome: getString(source, "nome"),
              objetivo: getString(source, clienteId ? "objetivo" : "interesse"),
              observacoes: cleanObservation(sourceObservations),
              patrimonio: getString(client, "patrimonio"),
              profissao: getString(client, "profissao"),
              renda_mensal: getString(client, "renda_mensal"),
              telefone: getString(source, "telefone"),
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
