import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

export type ConsultorSection =
  | "leads"
  | "clientes"
  | "agenda"
  | "propostas"
  | "tarefas"
  | "contratos";

export type ConsultorTableRow = {
  actions?: "client" | "lead";
  cells: string[];
  id?: string;
  status?: "Ganho" | "Em analise" | "Pendente";
  statusCellIndex?: number;
};

export type ConsultorSectionData = {
  activeItem: string;
  title: string;
  subtitle: string;
  headers: string[];
  rows: ConsultorTableRow[];
  emptyMessage: string;
};

const sectionLabels: Record<ConsultorSection, string> = {
  agenda: "Agenda",
  clientes: "Meus Clientes",
  contratos: "Contratos",
  leads: "Meus Leads",
  propostas: "Propostas",
  tarefas: "Tarefas",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getString(row: SupabaseRow, keys: string[], fallback = ""): string {
  const value = keys.map((key) => row[key]).find((item) => item !== undefined && item !== null);

  return value === undefined || value === null ? fallback : String(value);
}

function getNumber(row: SupabaseRow, keys: string[]): number {
  const value = keys.map((key) => row[key]).find((item) => item !== undefined && item !== null);
  const numberValue = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d,-]/g, "").replace(",", "."));

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getLeadNonConversionReason(row: SupabaseRow, status: string): string {
  const reason = getString(
    row,
    [
      "justificativa_nao_conversao",
      "motivo_nao_conversao",
      "motivo_nao_convertido",
      "justificativa_nao_convertido",
      "justificativa",
      "motivo_perda",
      "observacao_perda",
      "observacoes",
      "observacao",
    ],
  );
  const message = getString(row, ["mensagem"]);
  const reasonLabel = "Justificativa de nao conversao:";
  const reasonIndex = message.indexOf(reasonLabel);

  if (reason) {
    return reason;
  }

  if (reasonIndex >= 0) {
    return message.slice(reasonIndex + reasonLabel.length).trim() || "Sem justificativa";
  }

  return normalizeText(status).includes("convertido") ? "Convertido" : "Sem justificativa";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR").format(date);
}

function getStatus(value: string): ConsultorTableRow["status"] {
  const normalized = normalizeText(value);

  if (
    normalized.includes("ganho")
    || normalized.includes("fechado")
    || normalized.includes("contrato")
    || normalized.includes("convertido")
  ) {
    return "Ganho";
  }

  if (normalized.includes("recusado") || normalized.includes("pendente")) {
    return "Pendente";
  }

  return "Em analise";
}

async function getConsultorId(): Promise<string> {
  const rows = await fetchSupabaseRows("usuarios", {
    filters: { email: "consultor@seopartners.com.br" },
    limit: 1,
  });

  return getString(rows[0] ?? {}, ["id"], "");
}

function buildLeadRows(rows: SupabaseRow[]): ConsultorTableRow[] {
  return rows.filter((row) => {
    const status = normalizeText(getString(row, ["status"], ""));

    return !["recusado", "perdido", "nao_fechou", "nao fechou"].some((closedStatus) => status.includes(closedStatus));
  }).map((row) => {
    const status = getString(row, ["status"], "-");
    const nonConversionReason = getLeadNonConversionReason(row, status);

    return {
      actions: "lead",
      cells: [
        getString(row, ["nome"], "Lead sem nome"),
        getString(row, ["origem"], "-"),
        getString(row, ["prioridade"], "-"),
        getString(row, ["interesse"], "-"),
        getString(row, ["telefone"], "-"),
        status,
        nonConversionReason,
      ],
      id: getString(row, ["id"], ""),
      status: getStatus(status),
      statusCellIndex: 5,
    };
  });
}

function buildClientRows(rows: SupabaseRow[]): ConsultorTableRow[] {
  return rows.map((row) => ({
    actions: "client",
    cells: [
      getString(row, ["nome"], "Cliente sem nome"),
      getString(row, ["email"], "-"),
      getString(row, ["telefone"], "-"),
      getString(row, ["objetivo"], "-"),
      getString(row, ["status"], "-"),
    ],
    id: getString(row, ["id"], ""),
    status: getStatus(getString(row, ["status"], "")),
  }));
}

function buildAgendaRows(rows: SupabaseRow[]): ConsultorTableRow[] {
  return rows.map((row) => ({
    cells: [
      formatDate(getString(row, ["data_agendamento"], "")),
      getString(row, ["hora_inicio"], "-"),
      getString(row, ["titulo"], "Compromisso"),
      getString(row, ["tipo"], "-"),
      getString(row, ["local"], "-"),
      getString(row, ["status"], "-"),
    ],
    status: getStatus(getString(row, ["status"], "")),
  }));
}

function buildTaskRows(rows: SupabaseRow[]): ConsultorTableRow[] {
  return rows.map((row) => ({
    cells: [
      getString(row, ["titulo"], "Tarefa"),
      getString(row, ["tipo"], "-"),
      getString(row, ["prioridade"], "-"),
      formatDate(getString(row, ["data_inicio"], "")),
      getString(row, ["hora"], "-"),
      getString(row, ["status"], "-"),
    ],
    status: getStatus(getString(row, ["status"], "")),
  }));
}

function buildBusinessRows(rows: SupabaseRow[]): ConsultorTableRow[] {
  return rows.map((row) => ({
    cells: [
      getString(row, ["produto"], "Produto"),
      formatCurrency(getNumber(row, ["valor"])),
      getString(row, ["etapa"], "-"),
      getString(row, ["status"], "-"),
      formatDate(getString(row, ["created_at"], "")),
    ],
    status: getStatus(getString(row, ["status", "etapa"], "")),
  }));
}

export async function getConsultorSectionData(section: ConsultorSection): Promise<ConsultorSectionData> {
  const consultorId = await getConsultorId();
  const activeItem = sectionLabels[section];

  if (!consultorId) {
    return {
      activeItem,
      emptyMessage: "Consultor nao encontrado.",
      headers: ["Informacao"],
      rows: [],
      subtitle: "Dados indisponiveis",
      title: activeItem,
    };
  }

  if (section === "leads") {
    const rows = await fetchSupabaseRows("leads", {
      filters: { consultor_id: consultorId },
      limit: 50,
      order: "created_at.desc",
    });

    return {
      activeItem,
      emptyMessage: "Nenhum lead encontrado para este consultor.",
      headers: ["Lead", "Origem", "Prioridade", "Interesse", "Telefone", "Status", "Por que nao converteu", "Acoes"],
      rows: buildLeadRows(rows),
      subtitle: "Leads recebidos, prioridade e etapa atual de atendimento.",
      title: "Meus Leads",
    };
  }

  if (section === "clientes") {
    const rows = await fetchSupabaseRows("clientes", {
      filters: { consultor_id: consultorId },
      limit: 50,
      order: "created_at.desc",
    });

    return {
      activeItem,
      emptyMessage: "Nenhum cliente vinculado a este consultor.",
      headers: ["Cliente", "E-mail", "Telefone", "Objetivo", "Status", "Acoes"],
      rows: buildClientRows(rows),
      subtitle: "Clientes convertidos e acompanhados pelo consultor.",
      title: "Meus Clientes",
    };
  }

  if (section === "agenda") {
    const rows = await fetchSupabaseRows("agendamentos", {
      filters: { consultor_id: consultorId },
      limit: 50,
      order: "data_agendamento.asc",
    });

    return {
      activeItem,
      emptyMessage: "Nenhum compromisso agendado.",
      headers: ["Data", "Horario", "Compromisso", "Tipo", "Local", "Status"],
      rows: buildAgendaRows(rows),
      subtitle: "Reunioes, retornos e compromissos agendados.",
      title: "Agenda",
    };
  }

  if (section === "propostas") {
    const rows = await fetchSupabaseRows("negocios", {
      filters: { consultor_id: consultorId },
      limit: 50,
      order: "created_at.desc",
    });
    const proposals = rows.filter((row) => !["ganho", "fechado", "concluido", "concluida"].includes(normalizeText(getString(row, ["status"], ""))));

    return {
      activeItem,
      emptyMessage: "Nenhuma proposta aberta.",
      headers: ["Produto", "Valor", "Etapa", "Status", "Criado em"],
      rows: buildBusinessRows(proposals),
      subtitle: "Propostas em analise, retorno ou aguardando decisao.",
      title: "Propostas",
    };
  }

  if (section === "tarefas") {
    const rows = await fetchSupabaseRows("tarefas", {
      filters: { consultor_id: consultorId },
      limit: 50,
      order: "data_inicio.asc",
    });

    return {
      activeItem,
      emptyMessage: "Nenhuma tarefa pendente.",
      headers: ["Tarefa", "Tipo", "Prioridade", "Data", "Hora", "Status"],
      rows: buildTaskRows(rows),
      subtitle: "Pendencias, retornos e proximas acoes comerciais.",
      title: "Tarefas",
    };
  }

  const rows = await fetchSupabaseRows("negocios", {
    filters: { consultor_id: consultorId },
    limit: 50,
    order: "created_at.desc",
  });
  const contracts = rows.filter((row) => ["ganho", "fechado", "concluido", "concluida", "contrato"].some((status) =>
    normalizeText(`${getString(row, ["status"], "")} ${getString(row, ["etapa"], "")}`).includes(status),
  ));

  return {
    activeItem,
    emptyMessage: "Nenhum contrato fechado.",
    headers: ["Produto", "Valor", "Etapa", "Status", "Criado em"],
    rows: buildBusinessRows(contracts),
    subtitle: "Negocios ganhos e contratos em andamento.",
    title: "Contratos",
  };
}
