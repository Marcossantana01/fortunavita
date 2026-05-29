import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GestorSectionTable from "@/components/dashboard/GestorSectionTable";
import GestorUserManagement from "@/components/dashboard/GestorUserManagement";
import { getDashboardData } from "@/services/dashboardData";
import { getGestorSectionData } from "@/services/gestorSectionData";
import { fetchSupabaseRows } from "@/services/supabaseClient";

function getString(row: Record<string, unknown>, key: string): string {
  const value = row[key];

  return value === undefined || value === null ? "" : String(value);
}

function isConsultor(row: Record<string, unknown>): boolean {
  return getString(row, "tipo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .includes("consultor");
}

export default async function GestorEquipePage() {
  const [dashboard, section, usersRows] = await Promise.all([
    getDashboardData("gestor"),
    getGestorSectionData("equipe"),
    fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
  ]);
  const users = usersRows
    .filter(isConsultor)
    .map((row) => ({
      ativo: getString(row, "ativo") === "true",
      email: getString(row, "email"),
      id: getString(row, "id"),
      modalidade: getString(row, "modalidade_atendimento"),
      nome: getString(row, "nome"),
      telefone: getString(row, "telefone"),
      tipo: getString(row, "tipo"),
    }));

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
          <GestorSectionTable maxRowsWhenIdle={10} section={section} />
        </section>
        <GestorUserManagement users={users} />
      </div>
    </DashboardLayout>
  );
}
