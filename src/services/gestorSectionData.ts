import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

export type GestorSection = "agenda" | "chamados" | "clientes" | "equipe" | "metas" | "relatorios";

export type GestorSectionData = {
  activeItem: string;
  emptyMessage: string;
  headers: string[];
  rows: string[][];
  subtitle: string;
  title: string;
};

function getString(row: SupabaseRow, key: string, fallback = "-"): string {
  const value = row[key];

  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function getNumber(row: SupabaseRow, key: string): number {
  const value = row[key];
  const numberValue = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d,-]/g, "").replace(",", "."));

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value: string): string {
  if (!value || value === "-") {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatMonth(value: string): string {
  if (!value || value === "-") {
    return "-";
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function isConsultor(row: SupabaseRow): boolean {
  return normalizeText(getString(row, "tipo", "")).includes("consultor");
}

function sumByConsultor(rows: SupabaseRow[], consultorId: string, key: string): number {
  return rows
    .filter((row) => getString(row, "consultor_id", "") === consultorId)
    .reduce((total, row) => total + getNumber(row, key), 0);
}

function countByConsultor(rows: SupabaseRow[], consultorId: string): number {
  return rows.filter((row) => getString(row, "consultor_id", "") === consultorId).length;
}

function isToday(value: string): boolean {
  if (!value || value === "-") {
    return false;
  }

  const date = new Date(value);
  const now = new Date();

  return !Number.isNaN(date.getTime())
    && date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

function countTodayByConsultor(rows: SupabaseRow[], consultorId: string, dateKey: string): number {
  return rows.filter((row) => (
    getString(row, "consultor_id", "") === consultorId
    && isToday(getString(row, dateKey, ""))
  )).length;
}

function sumTodayByConsultor(rows: SupabaseRow[], consultorId: string, valueKey: string, dateKey: string): number {
  return rows
    .filter((row) => (
      getString(row, "consultor_id", "") === consultorId
      && isToday(getString(row, dateKey, ""))
    ))
    .reduce((total, row) => total + getNumber(row, valueKey), 0);
}

export async function getGestorSectionData(section: GestorSection): Promise<GestorSectionData> {
  if (section === "equipe") {
    const [usuarios, leads, clientes, financeiro] = await Promise.all([
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
      fetchSupabaseRows("leads", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("clientes", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("financeiro", { limit: 200, order: "created_at.desc" }),
    ]);
    const consultores = usuarios.filter(isConsultor);

    return {
      activeItem: "Equipe",
      emptyMessage: "Nenhum consultor encontrado.",
      headers: ["Consultor", "E-mail", "Telefone", "Modalidade", "Status", "Leads", "Clientes", "Comissao prevista"],
      rows: consultores.map((consultor) => {
        const consultorId = getString(consultor, "id", "");

        return [
          getString(consultor, "nome", "Consultor"),
          getString(consultor, "email"),
          getString(consultor, "telefone"),
          getString(consultor, "modalidade_atendimento", "Nao informado"),
          getString(consultor, "ativo") === "true" ? "Ativo" : "Inativo",
          String(countByConsultor(leads, consultorId)),
          String(countByConsultor(clientes, consultorId)),
          formatCurrency(sumByConsultor(financeiro, consultorId, "comissao")),
        ];
      }),
      subtitle: "Consultores, carteira atribuida e producao prevista.",
      title: "Equipe comercial",
    };
  }

  if (section === "chamados") {
    const [chamados, usuarios] = await Promise.all([
      fetchSupabaseRows("chamados", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
    ]);
    const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Chamados",
      emptyMessage: "Nenhum chamado encontrado.",
      headers: ["Assunto", "Categoria", "Prioridade", "Status", "Solicitante", "Criado em", "Descricao"],
      rows: chamados.map((ticket) => [
        getString(ticket, "assunto"),
        getString(ticket, "categoria"),
        getString(ticket, "prioridade"),
        getString(ticket, "status"),
        consultorNames.get(getString(ticket, "usuario_id", "")) ?? getString(ticket, "solicitante_nome", "-"),
        formatDate(getString(ticket, "created_at")),
        getString(ticket, "descricao"),
      ]),
      subtitle: "Chamados abertos pela equipe e acompanhamento operacional.",
      title: "Chamados da equipe",
    };
  }

  if (section === "clientes") {
    const [clientes, usuarios] = await Promise.all([
      fetchSupabaseRows("clientes", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
    ]);
    const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Clientes",
      emptyMessage: "Nenhum cliente encontrado.",
      headers: ["Cliente", "Telefone", "E-mail", "Objetivo", "Consultor", "Renda", "Patrimonio", "Status"],
      rows: clientes.map((cliente) => [
        getString(cliente, "nome", "Cliente"),
        getString(cliente, "telefone"),
        getString(cliente, "email"),
        getString(cliente, "objetivo"),
        consultorNames.get(getString(cliente, "consultor_id", "")) ?? "Nao atribuido",
        formatCurrency(getNumber(cliente, "renda_mensal")),
        formatCurrency(getNumber(cliente, "patrimonio")),
        getString(cliente, "status"),
      ]),
      subtitle: "Clientes ativos, consultor responsavel e perfil financeiro.",
      title: "Clientes da equipe",
    };
  }

  if (section === "metas") {
    const [metas, financeiro, usuarios] = await Promise.all([
      fetchSupabaseRows("metas_consultores", { limit: 100, order: "mes.desc" }),
      fetchSupabaseRows("financeiro", { limit: 200, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
    ]);
    const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Metas",
      emptyMessage: "Nenhuma meta cadastrada.",
      headers: ["Consultor", "Mes", "Meta comissao", "Comissao prevista", "Atingimento"],
      rows: metas.map((meta) => {
        const consultorId = getString(meta, "consultor_id", "");
        const goal = getNumber(meta, "meta_comissao");
        const commission = sumByConsultor(financeiro, consultorId, "comissao");
        const progress = goal > 0 ? `${Math.round((commission / goal) * 100)}%` : "0%";

        return [
          consultorNames.get(consultorId) ?? "Consultor",
          formatMonth(getString(meta, "mes")),
          formatCurrency(goal),
          formatCurrency(commission),
          progress,
        ];
      }),
      subtitle: "Metas mensais, comissao prevista e percentual atingido.",
      title: "Metas da equipe",
    };
  }

  if (section === "agenda") {
    const [agendamentos, usuarios, clientes] = await Promise.all([
      fetchSupabaseRows("agendamentos", { limit: 200, order: "data_agendamento.asc" }),
      fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
      fetchSupabaseRows("clientes", { limit: 200, order: "created_at.desc" }),
    ]);
    const consultorNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));
    const clientNames = new Map(clientes.map((row) => [getString(row, "id", ""), getString(row, "nome", "Cliente")]));

    return {
      activeItem: "Agenda",
      emptyMessage: "Nenhum compromisso encontrado.",
      headers: ["Data", "Horario", "Compromisso", "Cliente", "Consultor", "Tipo", "Status", "Local"],
      rows: agendamentos.map((appointment) => [
        formatDate(getString(appointment, "data_agendamento")),
        getString(appointment, "hora_inicio"),
        getString(appointment, "titulo", "Compromisso"),
        clientNames.get(getString(appointment, "cliente_id", "")) ?? "-",
        consultorNames.get(getString(appointment, "consultor_id", "")) ?? "Nao atribuido",
        getString(appointment, "tipo"),
        getString(appointment, "status"),
        getString(appointment, "local"),
      ]),
      subtitle: "Agenda compartilhada da equipe comercial.",
      title: "Agenda da equipe",
    };
  }

  const [usuarios, leads, clientes, agendamentos, tarefas, financeiro, negocios] = await Promise.all([
    fetchSupabaseRows("usuarios", { limit: 100, order: "nome.asc" }),
    fetchSupabaseRows("leads", { limit: 200, order: "created_at.desc" }),
    fetchSupabaseRows("clientes", { limit: 200, order: "created_at.desc" }),
    fetchSupabaseRows("agendamentos", { limit: 200, order: "data_agendamento.asc" }),
    fetchSupabaseRows("tarefas", { limit: 200, order: "created_at.desc" }),
    fetchSupabaseRows("financeiro", { limit: 200, order: "created_at.desc" }),
    fetchSupabaseRows("negocios", { limit: 200, order: "created_at.desc" }),
  ]);
  const consultores = usuarios.filter(isConsultor);

  return {
    activeItem: "Relatorios",
    emptyMessage: "Nenhum dado disponivel para relatorio.",
    headers: ["Consultor", "Leads hoje", "Agenda hoje", "Tarefas hoje", "Comissao hoje", "Leads", "Clientes", "Negocios", "Conversao"],
    rows: consultores.map((consultor) => {
      const consultorId = getString(consultor, "id", "");
      const leadsCount = countByConsultor(leads, consultorId);
      const clientesCount = countByConsultor(clientes, consultorId);
      const conversion = leadsCount > 0 ? `${Math.round((clientesCount / leadsCount) * 100)}%` : "0%";

      return [
        getString(consultor, "nome", "Consultor"),
        String(countTodayByConsultor(leads, consultorId, "created_at")),
        String(countTodayByConsultor(agendamentos, consultorId, "data_agendamento")),
        String(countTodayByConsultor(tarefas, consultorId, "data_inicio")),
        formatCurrency(sumTodayByConsultor(financeiro, consultorId, "comissao", "created_at")),
        String(leadsCount),
        String(clientesCount),
        String(countByConsultor(negocios, consultorId)),
        conversion,
      ];
    }),
    subtitle: "Resumo por consultor para acompanhamento gerencial.",
    title: "Relatorios gerenciais",
  };
}
