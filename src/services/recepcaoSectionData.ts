import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";
import type { GestorSectionData } from "@/services/gestorSectionData";

export type RecepcaoSection = "agenda" | "contatos" | "encaminhamentos" | "recados" | "reunioes";

export type RecepcaoConsultorOption = {
  email: string;
  id: string;
  nome: string;
};

function getString(row: SupabaseRow, key: string, fallback = "-"): string {
  const value = row[key];

  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(value: string): string {
  if (!value || value === "-") {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR").format(date);
}

function isMeeting(row: SupabaseRow): boolean {
  const text = normalizeText(`${getString(row, "tipo", "")} ${getString(row, "titulo", "")}`);

  return text.includes("reuniao") || text.includes("reunioes");
}

function isConsultor(row: SupabaseRow): boolean {
  return normalizeText(getString(row, "tipo", "")).includes("consultor");
}

export async function getRecepcaoConsultores(): Promise<RecepcaoConsultorOption[]> {
  const rows = await fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" });

  return rows
    .filter(isConsultor)
    .filter((row) => getString(row, "ativo", "true") !== "false")
    .map((row) => ({
      email: getString(row, "email"),
      id: getString(row, "id", ""),
      nome: getString(row, "nome", "Consultor"),
    }))
    .filter((consultor) => consultor.id);
}

export async function getRecepcaoSectionData(section: RecepcaoSection): Promise<GestorSectionData> {
  if (section === "agenda") {
    const agendamentos = await fetchSupabaseRows("agendamentos", { limit: 200, order: "data_agendamento.asc" });

    return {
      activeItem: "Agenda",
      emptyMessage: "Nenhum compromisso na agenda.",
      headers: ["Data", "Horario", "Compromisso", "Pessoa", "Contato ou local", "Tipo", "Status"],
      rows: agendamentos.map((row) => [
        formatDate(getString(row, "data_agendamento")),
        getString(row, "hora_inicio"),
        getString(row, "titulo", "Compromisso"),
        getString(row, "cliente_nome", getString(row, "nome", "-")),
        getString(row, "local", getString(row, "telefone", "-")),
        getString(row, "tipo"),
        getString(row, "status"),
      ]),
      subtitle: "Compromissos, retornos e atendimentos que a recepcao precisa acompanhar.",
      title: "Agenda da recepcao",
    };
  }

  if (section === "contatos") {
    const leads = await fetchSupabaseRows("leads", { limit: 200, order: "created_at.desc" });

    return {
      activeItem: "Contatos",
      emptyMessage: "Nenhum contato encontrado.",
      headers: ["Contato", "Telefone", "E-mail", "Assunto", "Origem", "Status"],
      rows: leads.map((row) => [
        getString(row, "nome", "Contato"),
        getString(row, "telefone"),
        getString(row, "email"),
        getString(row, "interesse", "Atendimento"),
        getString(row, "origem"),
        getString(row, "status"),
      ]),
      subtitle: "Dados minimos para contato, confirmacao de agenda e encaminhamento.",
      title: "Contatos da recepcao",
    };
  }

  if (section === "reunioes") {
    const agendamentos = await fetchSupabaseRows("agendamentos", { limit: 200, order: "data_agendamento.asc" });
    const meetings = agendamentos.filter(isMeeting);

    return {
      activeItem: "Reunioes",
      emptyMessage: "Nenhuma reuniao encontrada.",
      headers: ["Data", "Horario", "Reuniao", "Pessoa", "Local", "Status"],
      rows: meetings.map((row) => [
        formatDate(getString(row, "data_agendamento")),
        getString(row, "hora_inicio"),
        getString(row, "titulo", "Reuniao"),
        getString(row, "cliente_nome", getString(row, "nome", "-")),
        getString(row, "local"),
        getString(row, "status"),
      ]),
      subtitle: "Reunioes marcadas para confirmar presenca, horario e local.",
      title: "Reunioes",
    };
  }

  if (section === "recados") {
    const [tarefas, usuarios] = await Promise.all([
      fetchSupabaseRows("tarefas", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
    ]);
    const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Recados",
      emptyMessage: "Nenhum recado encontrado.",
      headers: ["Recado", "Pessoa", "Prioridade", "Responsavel", "Status", "Criado em"],
      rows: tarefas.map((row) => [
        getString(row, "titulo", getString(row, "descricao", "Recado")),
        getString(row, "cliente_nome", getString(row, "contato", "-")),
        getString(row, "prioridade"),
        consultorNames.get(getString(row, "consultor_id", "")) ?? getString(row, "responsavel", "-"),
        getString(row, "status"),
        formatDate(getString(row, "created_at")),
      ]),
      subtitle: "Recados e pendencias operacionais para acompanhar ate a conclusao.",
      title: "Recados",
    };
  }

  const [leads, usuarios] = await Promise.all([
    fetchSupabaseRows("leads", { limit: 200, order: "created_at.desc" }),
    fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
  ]);
  const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

  return {
    activeItem: "Encaminhamentos",
    emptyMessage: "Nenhum encaminhamento encontrado.",
    headers: ["Pessoa", "Contato", "Assunto", "Encaminhado para", "Status", "Origem"],
    rows: leads
      .filter((row) => getString(row, "consultor_id", ""))
      .map((row) => [
        getString(row, "nome", "Contato"),
        getString(row, "telefone"),
        getString(row, "interesse", "Atendimento"),
        consultorNames.get(getString(row, "consultor_id", "")) ?? "Consultor nao encontrado",
        getString(row, "status"),
        getString(row, "origem"),
      ]),
    subtitle: "Contatos ja direcionados para consultores e status do atendimento.",
    title: "Encaminhamentos",
  };
}
