import type { ReactNode } from "react";
import type { SidebarMenuItem } from "@/components/dashboard/Sidebar";
import {
  countSupabaseRows,
  fetchSupabaseRows,
  type SupabaseRow,
} from "@/services/supabaseClient";

export type DashboardRole = "admin" | "gestor" | "consultor" | "recepcao" | "financeiro";

export type DashboardMetric = {
  title: string;
  value: string;
  change: string;
  tone: "blue" | "gold" | "green" | "red" | "violet";
  icon: ReactNode;
  trend?: "up" | "down";
  sparkline?: string;
  sparkArea?: string;
  sparkPoints?: Array<[number, number]>;
};

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
  tone: "gold" | "blue" | "green" | "orange" | "violet";
};

export type DashboardDeal = {
  client: string;
  product: string;
  amount: string;
  stage: string;
  status: "Ganho" | "Em analise" | "Pendente";
};

export type DashboardPieSegment = {
  label: string;
  value: string;
  color: string;
  count?: number;
};

export type DashboardFinancial = {
  title?: string;
  subtitle?: string;
  income: string;
  incomeLabel?: string;
  goalCaption?: string;
  showDetails?: boolean;
  showGoalProgress?: boolean;
  expenses: string;
  expensesLabel?: string;
  conversion: string;
  conversionLabel?: string;
  goal: string;
};

export type DashboardPerformancePeriod = {
  labels: string[];
  values: number[];
};

export type DashboardPerformance = {
  day: DashboardPerformancePeriod;
  month: DashboardPerformancePeriod;
  year: DashboardPerformancePeriod;
};

export type DashboardUser = {
  name: string;
  role: string;
  avatar: string;
};

export type DashboardData = {
  activeItem: string;
  menuItems: SidebarMenuItem[];
  panelTitle?: string;
  performanceTitle?: string;
  performanceSubtitle?: string;
  pieTitle?: string;
  pieTotalLabel?: string;
  pieTotalValue?: string;
  dealsTitle?: string;
  dealsSubtitle?: string;
  dealsHeaders?: string[];
  performance: DashboardPerformance;
  user: DashboardUser;
  metrics: DashboardMetric[];
  showMetricSparklines?: boolean;
  activityTitle?: string;
  activitySubtitle?: string;
  activities: DashboardActivity[];
  deals: DashboardDeal[];
  pieSegments: DashboardPieSegment[];
  financial: DashboardFinancial;
};

const userAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23c9aa6d'/%3E%3Ccircle cx='48' cy='36' r='17' fill='%2308223e'/%3E%3Cpath d='M18 84c5-19 18-28 30-28s25 9 30 28' fill='%2308223e'/%3E%3C/svg%3E";

const adminMenuItems: SidebarMenuItem[] = [
  { label: "Pagina Inicial", href: "/admin", icon: <span className="nav-glyph nav-glyph-home" /> },
  { label: "Leads", href: "/admin/leads", icon: <span className="nav-glyph nav-glyph-lead" /> },
  { label: "Clientes", href: "/admin/clientes", icon: <span className="nav-glyph nav-glyph-client" /> },
  { label: "Usuarios", href: "/admin/usuarios", icon: <span className="nav-glyph nav-glyph-user" /> },
  { label: "Consultores", href: "/admin/consultores", icon: <span className="nav-glyph nav-glyph-consultant" /> },
  { label: "Financeiro", href: "/admin/financeiro", icon: <span className="nav-glyph nav-glyph-cash" /> },
  { label: "Fornecedores", href: "/admin/fornecedores", icon: <span className="nav-glyph nav-glyph-box" /> },
  { label: "Agenda", href: "/admin/agenda", icon: <span className="nav-glyph nav-glyph-calendar" /> },
  { label: "Relatorios", href: "/admin/relatorios", icon: <span className="nav-glyph nav-glyph-chart" /> },
];

const roleMenuItems: Record<DashboardRole, SidebarMenuItem[]> = {
  admin: adminMenuItems,
  gestor: [
    { label: "Pagina Inicial", href: "/gestor", icon: <span className="nav-glyph nav-glyph-home" /> },
    { label: "Equipe", href: "/gestor/equipe", icon: <span className="nav-glyph nav-glyph-user" /> },
    { label: "Leads", href: "/gestor/leads", icon: <span className="nav-glyph nav-glyph-lead" /> },
    { label: "Clientes", href: "/gestor/clientes", icon: <span className="nav-glyph nav-glyph-client" /> },
    { label: "Metas", href: "/gestor/metas", icon: <span className="nav-glyph nav-glyph-cash" /> },
    { label: "Agenda", href: "/gestor/agenda", icon: <span className="nav-glyph nav-glyph-calendar" /> },
    { label: "Relatorios", href: "/gestor/relatorios", icon: <span className="nav-glyph nav-glyph-chart" /> },
  ],
  consultor: [
    { label: "Pagina Principal", href: "/consultor", icon: <span className="nav-glyph nav-glyph-home" /> },
    { label: "Meus Leads", href: "/consultor/leads", icon: <span className="nav-glyph nav-glyph-lead" /> },
    { label: "Meus Clientes", href: "/consultor/clientes", icon: <span className="nav-glyph nav-glyph-client" /> },
    { label: "Agenda", href: "/consultor/agenda", icon: <span className="nav-glyph nav-glyph-calendar" /> },
    { label: "Propostas", href: "/consultor/propostas", icon: <span className="nav-glyph nav-glyph-box" /> },
    { label: "Tarefas", href: "/consultor/tarefas", icon: <span className="nav-glyph nav-glyph-chart" /> },
    { label: "Contratos", href: "/consultor/contratos", icon: <span className="nav-glyph nav-glyph-cash" /> },
  ],
  recepcao: [
    { label: "Pagina Principal", href: "/recepcao", icon: <span className="nav-glyph nav-glyph-home" /> },
    { label: "Agenda", href: "/recepcao/agenda", icon: <span className="nav-glyph nav-glyph-calendar" /> },
    { label: "Contatos", href: "/recepcao/contatos", icon: <span className="nav-glyph nav-glyph-client" /> },
    { label: "Reunioes", href: "/recepcao/reunioes", icon: <span className="nav-glyph nav-glyph-calendar" /> },
    { label: "Recados", href: "/recepcao/recados", icon: <span className="nav-glyph nav-glyph-box" /> },
    { label: "Encaminhamentos", href: "/recepcao/encaminhamentos", icon: <span className="nav-glyph nav-glyph-consultant" /> },
  ],
  financeiro: [
    { label: "Pagina Principal", href: "/financeiro", icon: <span className="nav-glyph nav-glyph-home" /> },
    { label: "Receitas", href: "/financeiro/receitas", icon: <span className="nav-glyph nav-glyph-cash" /> },
    { label: "Despesas", href: "/financeiro/despesas", icon: <span className="nav-glyph nav-glyph-box" /> },
    { label: "A Receber", href: "/financeiro/a-receber", icon: <span className="nav-glyph nav-glyph-lead" /> },
    { label: "A Pagar", href: "/financeiro/a-pagar", icon: <span className="nav-glyph nav-glyph-client" /> },
    { label: "Relatorios", href: "/financeiro/relatorios", icon: <span className="nav-glyph nav-glyph-chart" /> },
  ],
};

const baseMetrics: DashboardMetric[] = [
  {
    title: "Leads Totais",
    value: "1.250",
    change: "+12,5%",
    tone: "gold",
    icon: <i className="bi bi-people-fill" aria-hidden="true" />,
    sparkline: "M2 24 C16 22 24 19 38 20 C52 21 60 13 74 14 C88 15 95 22 110 17 C124 12 134 9 148 7",
    sparkArea: "M2 24 C16 22 24 19 38 20 C52 21 60 13 74 14 C88 15 95 22 110 17 C124 12 134 9 148 7 L148 34 L2 34 Z",
    sparkPoints: [[2, 24], [38, 20], [74, 14], [110, 17], [148, 7]],
  },
  {
    title: "Clientes Ativos",
    value: "320",
    change: "+8,3%",
    tone: "green",
    icon: <i className="bi bi-person-check-fill" aria-hidden="true" />,
    sparkline: "M2 25 C18 26 26 21 40 21 C54 21 61 16 74 15 C88 14 96 10 110 12 C124 14 134 10 148 8",
    sparkArea: "M2 25 C18 26 26 21 40 21 C54 21 61 16 74 15 C88 14 96 10 110 12 C124 14 134 10 148 8 L148 34 L2 34 Z",
    sparkPoints: [[2, 25], [40, 21], [74, 15], [110, 12], [148, 8]],
  },
  {
    title: "Negociacoes",
    value: "87",
    change: "+15,7%",
    tone: "violet",
    icon: <i className="bi bi-briefcase-fill" aria-hidden="true" />,
    sparkline: "M2 28 C16 24 27 24 40 18 C53 12 62 15 75 10 C88 6 96 14 110 13 C124 12 134 7 148 5",
    sparkArea: "M2 28 C16 24 27 24 40 18 C53 12 62 15 75 10 C88 6 96 14 110 13 C124 12 134 7 148 5 L148 34 L2 34 Z",
    sparkPoints: [[2, 28], [40, 18], [75, 10], [110, 13], [148, 5]],
  },
  {
    title: "Faturamento",
    value: "R$ 245.000",
    change: "+18,6%",
    tone: "blue",
    icon: <i className="bi bi-currency-dollar" aria-hidden="true" />,
    sparkline: "M2 27 C16 25 25 20 38 20 C52 20 60 14 74 15 C88 16 95 9 110 10 C124 11 134 5 148 4",
    sparkArea: "M2 27 C16 25 25 20 38 20 C52 20 60 14 74 15 C88 16 95 9 110 10 C124 11 134 5 148 4 L148 34 L2 34 Z",
    sparkPoints: [[2, 27], [38, 20], [74, 15], [110, 10], [148, 4]],
  },
  {
    title: "Tarefas Pendentes",
    value: "23",
    change: "-5,2%",
    tone: "red",
    icon: <i className="bi bi-list-check" aria-hidden="true" />,
    trend: "down",
    sparkline: "M2 9 C16 12 26 11 39 15 C53 19 61 16 74 18 C88 21 96 18 110 22 C124 26 134 24 148 28",
    sparkArea: "M2 9 C16 12 26 11 39 15 C53 19 61 16 74 18 C88 21 96 18 110 22 C124 26 134 24 148 28 L148 34 L2 34 Z",
    sparkPoints: [[2, 9], [39, 15], [74, 18], [110, 22], [148, 28]],
  },
];

const baseActivities: DashboardActivity[] = [
  { title: "Novo lead cadastrado", description: "Origem campanha de consultoria.", time: "ha 5 min", tone: "green" },
  { title: "Cliente fechou contrato", description: "Contrato premium aprovado.", time: "ha 20 min", tone: "blue" },
  { title: "Reuniao agendada", description: "Planejamento com novo cliente.", time: "ha 1 h", tone: "orange" },
  { title: "Pagamento recebido", description: "Parcela de consultoria confirmada.", time: "ha 2 h", tone: "violet" },
  { title: "Novo usuario criado", description: "Perfil operacional ativado.", time: "ha 4 h", tone: "gold" },
];

const consultantActivities: DashboardActivity[] = [
  { title: "Novo lead recebido", description: "Lead aguardando primeiro contato.", time: "ha 5 min", tone: "green" },
  { title: "Cliente em acompanhamento", description: "Retorno comercial programado.", time: "ha 20 min", tone: "blue" },
  { title: "Reuniao agendada", description: "Planejamento com novo cliente.", time: "ha 1 h", tone: "orange" },
  { title: "Proposta enviada", description: "Cliente recebeu proposta comercial.", time: "ha 2 h", tone: "violet" },
  { title: "Contrato em analise", description: "Documentacao pendente de validacao.", time: "ha 4 h", tone: "gold" },
];

const financialActivities: DashboardActivity[] = [
  { title: "Recebimento conciliado", description: "Entrada confirmada no caixa.", time: "hoje", tone: "green" },
  { title: "Despesa registrada", description: "Lancamento classificado por categoria.", time: "hoje", tone: "orange" },
  { title: "Titulo a receber", description: "Vencimento aguardando baixa.", time: "esta semana", tone: "blue" },
  { title: "Conta a pagar", description: "Pagamento pendente de aprovacao.", time: "esta semana", tone: "violet" },
  { title: "Fluxo revisado", description: "Resumo financeiro atualizado.", time: "agora", tone: "gold" },
];

const baseDeals: DashboardDeal[] = [
  { client: "Arthur Santana", product: "Gestao Patrimonial", amount: "R$ 92.400", stage: "Contrato", status: "Ganho" },
  { client: "Helena Martins", product: "Planejamento Financeiro", amount: "R$ 38.900", stage: "Analise", status: "Em analise" },
  { client: "Grupo Apice", product: "Consultoria Empresarial", amount: "R$ 128.000", stage: "Proposta", status: "Pendente" },
  { client: "Renato Lima", product: "Carteira Premium", amount: "R$ 74.600", stage: "Onboarding", status: "Ganho" },
];

const baseFinancialDeals: DashboardDeal[] = [
  { client: "Receita de consultoria", product: "Receita", amount: "R$ 0", stage: "Mes atual", status: "Ganho" },
  { client: "Despesa operacional", product: "Despesa", amount: "R$ 0", stage: "Mes atual", status: "Pendente" },
  { client: "Contas a receber", product: "A receber", amount: "R$ 0", stage: "Em aberto", status: "Em analise" },
  { client: "Contas a pagar", product: "A pagar", amount: "R$ 0", stage: "Em aberto", status: "Pendente" },
];

const consultantPieSegments: DashboardPieSegment[] = [
  { label: "Indicacao", value: "Prioridade alta", color: "#22c55e" },
  { label: "Recepcao", value: "Prioridade media", color: "#d4b06a" },
  { label: "Google", value: "Campanha", color: "#3f8df3" },
  { label: "Instagram", value: "Social", color: "#8b5cf6" },
  { label: "Outros", value: "Baixa prioridade", color: "#d9dde5" },
];

const basePerformance: DashboardPerformance = {
  day: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    values: [1, 2, 2, 3, 4, 4, 5],
  },
  month: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    values: [28, 44, 56, 51, 66, 61, 78],
  },
  year: {
    labels: ["2022", "2023", "2024", "2025", "2026"],
    values: [18, 32, 45, 58, 76],
  },
};

const roleConfig: Record<DashboardRole, Pick<DashboardData, "activeItem" | "user" | "financial">> = {
  admin: {
    activeItem: "Pagina Inicial",
    user: { name: "Administrador", role: "Administrador", avatar: userAvatar },
    financial: { income: "R$ 284.6k", expenses: "R$ 86.3k", conversion: "64.8%", goal: "78%" },
  },
  gestor: {
    activeItem: "Pagina Inicial",
    user: { name: "Gestor", role: "Gestor", avatar: userAvatar },
    financial: { income: "R$ 212.4k", expenses: "R$ 64.8k", conversion: "61.2%", goal: "72%" },
  },
  consultor: {
    activeItem: "Pagina Principal",
    user: { name: "ARTHUR DOS SANTOS AMARAL", role: "Consultor", avatar: userAvatar },
    financial: {
      income: "R$ 96.8k",
      incomeLabel: "Comissao prevista",
      showDetails: false,
      showGoalProgress: true,
      expenses: "R$ 24.1k",
      conversion: "58.4%",
      goal: "68%",
    },
  },
  recepcao: {
    activeItem: "Pagina Principal",
    user: { name: "Recepcao", role: "Recepcao", avatar: userAvatar },
    financial: { income: "R$ 48.2k", expenses: "R$ 12.9k", conversion: "52.6%", goal: "64%" },
  },
  financeiro: {
    activeItem: "Pagina Principal",
    user: { name: "Financeiro", role: "Financeiro", avatar: userAvatar },
    financial: {
      income: "R$ 0",
      incomeLabel: "Receita recebida",
      expenses: "R$ 0",
      expensesLabel: "Despesas pagas",
      conversion: "R$ 0",
      conversionLabel: "Saldo do mes",
      goal: "0%",
      goalCaption: "Fluxo de caixa",
    },
  },
};

const consultantMonthlyGoal = 100000;
const leadListSelect = "id,nome,origem,prioridade,interesse,telefone,status,consultor_id,created_at,mensagem";
const clientListSelect = "id,nome,email,telefone,objetivo,status,consultor_id,created_at";
const userListSelect = "id,nome,email,tipo,ativo,foto_url";
const financeListSelect = "id,valor,amount,total,comissao,tipo,categoria,status,descricao,titulo,nome,cliente_id,consultor_id,usuario_id,data_vencimento,vencimento,data_pagamento,created_at,data";
const businessListSelect = "id,cliente_id,consultor_id,produto,valor,valor_estimado,amount,total,etapa,status,created_at";
const appointmentListSelect = "id,consultor_id,cliente_id,cliente_nome,nome,telefone,titulo,tipo,status,local,data_agendamento,hora_inicio,created_at";
const taskListSelect = "id,consultor_id,titulo,descricao,cliente_nome,contato,prioridade,status,data_inicio,created_at";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
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

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthStartDateString(date = new Date()): string {
  return getDateKey(new Date(date.getFullYear(), date.getMonth(), 1));
}

function parseRowDate(row: SupabaseRow): Date | null {
  const value = getString(row, ["data_agendamento", "data_inicio", "data_pagamento", "created_at", "data"], "");
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function isCurrentMonth(date: Date | null): boolean {
  if (!date) {
    return false;
  }

  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function isPaidFinanceRow(row: SupabaseRow): boolean {
  const status = normalizeText(getString(row, ["status"], ""));

  if (!status) {
    return true;
  }

  return ["pago", "paga", "recebido", "recebida", "confirmado", "confirmada", "concluido", "concluida"].some((term) =>
    status.includes(term),
  );
}

function isPendingFinanceRow(row: SupabaseRow): boolean {
  return !isPaidFinanceRow(row);
}

function isIncomeFinanceRow(row: SupabaseRow): boolean {
  const type = normalizeText(getString(row, ["tipo"], ""));
  const category = normalizeText(getString(row, ["categoria"], ""));
  const text = `${type} ${category}`;

  return ["receita", "entrada", "faturamento", "venda", "recebimento"].some((term) => text.includes(term));
}

function isExpenseFinanceRow(row: SupabaseRow): boolean {
  const type = normalizeText(getString(row, ["tipo"], ""));
  const category = normalizeText(getString(row, ["categoria"], ""));
  const text = `${type} ${category}`;

  return ["despesa", "saida", "custo", "pagamento"].some((term) => text.includes(term));
}

function getStatus(value: string): DashboardDeal["status"] {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("ganho")
    || normalized.includes("fechado")
    || normalized.includes("concluido")
    || normalized.includes("convertido")
  ) {
    return "Ganho";
  }

  if (normalized.includes("analise") || normalized.includes("andamento") || normalized.includes("negociacao")) {
    return "Em analise";
  }

  return "Pendente";
}

function isWonBusinessRow(row: SupabaseRow): boolean {
  const text = normalizeText(`${getString(row, ["status"], "")} ${getString(row, ["etapa"], "")}`);

  return ["ganho", "fechado", "concluido", "concluida", "convertido", "contrato"].some((term) => text.includes(term));
}

function mapRowsToDeals(rows: SupabaseRow[]): DashboardDeal[] {
  return rows.slice(0, 4).map((row, index) => {
    const amount = getNumber(row, ["valor", "amount", "total", "receita", "valor_estimado"]);

    return {
      client: getString(row, ["cliente", "nome", "name", "razao_social"], `Cliente ${index + 1}`),
      product: getString(row, ["produto", "servico", "plano", "interesse", "origem"], "Atendimento comercial"),
      amount: amount > 0 ? formatCurrency(amount) : getString(row, ["valor_formatado"], "R$ 0"),
      stage: getString(row, ["etapa", "stage", "status", "fase"], "Cadastro"),
      status: getStatus(getString(row, ["status", "etapa", "stage"], "")),
    };
  });
}

function mapFinanceRowsToDeals(rows: SupabaseRow[]): DashboardDeal[] {
  return rows.slice(0, 4).map((row, index) => {
    const amount = getNumber(row, ["valor", "amount", "total"]);
    const type = getString(row, ["tipo", "categoria"], "Lancamento financeiro");
    const description = getString(row, ["descricao", "description", "titulo", "nome"], `Lancamento ${index + 1}`);

    return {
      client: description,
      product: type,
      amount: amount > 0 ? formatCurrency(amount) : "R$ 0",
      stage: formatShortDate(getString(row, ["data_vencimento", "vencimento", "data_pagamento", "created_at", "data"], "")),
      status: isPaidFinanceRow(row) ? "Ganho" : isIncomeFinanceRow(row) ? "Em analise" : "Pendente",
    };
  });
}

function mapBusinessRowsToDeals(rows: SupabaseRow[], clientNames: Map<string, string>): DashboardDeal[] {
  return rows.slice(0, 4).map((row, index) => {
    const clientId = getString(row, ["cliente_id"], "");
    const amount = getNumber(row, ["valor"]);

    return {
      client: clientNames.get(clientId) ?? `Cliente ${index + 1}`,
      product: getString(row, ["produto"], "Atendimento comercial"),
      amount: amount > 0 ? formatCurrency(amount) : "R$ 0",
      stage: getString(row, ["etapa"], "Analise"),
      status: getStatus(getString(row, ["status", "etapa"], "")),
    };
  });
}

function mapRowsToActivities(rows: SupabaseRow[]): DashboardActivity[] {
  return rows.slice(0, 5).map((row, index) => ({
    title: getString(row, ["titulo", "title", "acao", "evento", "tipo"], `Atividade ${index + 1}`),
    description: getString(row, ["descricao", "description", "detalhe", "mensagem"], "Atualizacao registrada no sistema."),
    time: getString(row, ["tempo", "time", "created_at", "data"], "agora"),
    tone: (["green", "blue", "orange", "violet", "gold"] as const)[index % 5],
  }));
}

function mapFinanceRowsToActivities(rows: SupabaseRow[]): DashboardActivity[] {
  return rows.slice(0, 5).map((row, index) => {
    const paid = isPaidFinanceRow(row);
    const income = isIncomeFinanceRow(row);

    return {
      title: paid ? (income ? "Recebimento confirmado" : "Pagamento efetuado") : (income ? "Recebimento pendente" : "Pagamento pendente"),
      description: getString(row, ["descricao", "description", "titulo", "categoria"], "Lancamento financeiro atualizado."),
      time: formatShortDate(getString(row, ["data_pagamento", "data_vencimento", "vencimento", "created_at", "data"], "")),
      tone: (["green", "orange", "blue", "violet", "gold"] as const)[index % 5],
    };
  });
}

function formatShortDate(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR").format(date);
}

function getReceptionActivities(agendamentosRows: SupabaseRow[], leadsRows: SupabaseRow[]): DashboardActivity[] {
  const todayAppointments = agendamentosRows
    .filter((row) => getDateKey(parseRowDate(row) ?? new Date(0)) === getTodayDateString())
    .slice(0, 3)
    .map((row, index) => ({
      title: getString(row, ["titulo", "cliente", "nome"], `Atendimento ${index + 1}`),
      description: "Agenda de hoje",
      time: getString(row, ["hora_inicio", "hora"], "Horario a confirmar"),
      tone: (["orange", "blue", "green"] as const)[index % 3],
    }));
  const recentLeads = leadsRows.slice(0, Math.max(0, 5 - todayAppointments.length)).map((row, index) => ({
    title: getString(row, ["nome"], `Lead ${index + 1}`),
    description: "Novo lead para direcionar",
    time: getString(row, ["origem"], "Origem nao informada"),
    tone: (["gold", "violet"] as const)[index % 2],
  }));

  return [...todayAppointments, ...recentLeads].slice(0, 5);
}

function getReceptionPerformance(agendamentosRows: SupabaseRow[]): DashboardPerformance {
  const now = new Date();
  const dayDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);

    date.setDate(now.getDate() - (6 - index));

    return date;
  });
  const monthDates = Array.from({ length: 7 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
  const yearValues = Array.from({ length: 5 }, (_, index) => now.getFullYear() - (4 - index));
  const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const countByDay = (date: Date) => agendamentosRows.filter((row) => {
    const rowDate = parseRowDate(row);

    return rowDate ? getDateKey(rowDate) === getDateKey(date) : false;
  }).length;
  const countByMonth = (date: Date) => agendamentosRows.filter((row) => {
    const rowDate = parseRowDate(row);

    return rowDate ? getMonthKey(rowDate) === getMonthKey(date) : false;
  }).length;
  const countByYear = (year: number) => agendamentosRows.filter((row) => {
    const rowDate = parseRowDate(row);

    return rowDate ? rowDate.getFullYear() === year : false;
  }).length;

  return {
    day: {
      labels: dayDates.map((date) => weekdayFormatter.format(date).replace(".", "")),
      values: dayDates.map(countByDay),
    },
    month: {
      labels: monthDates.map((date) => monthFormatter.format(date).replace(".", "")),
      values: monthDates.map(countByMonth),
    },
    year: {
      labels: yearValues.map(String),
      values: yearValues.map(countByYear),
    },
  };
}

function mapReceptionAppointmentsToDeals(rows: SupabaseRow[]): DashboardDeal[] {
  return rows.slice(0, 4).map((row, index) => {
    const statusText = getString(row, ["status"], "");

    return {
      client: getString(row, ["cliente", "nome", "titulo"], `Atendimento ${index + 1}`),
      product: getString(row, ["hora_inicio", "hora"], "Horario a confirmar"),
      amount: getString(row, ["telefone", "local"], "-"),
      stage: getString(row, ["tipo", "status"], "Recepcao"),
      status: getStatus(statusText),
    };
  });
}

function getPendingTaskActivitiesByConsultant(
  tarefasRows: SupabaseRow[],
  usuariosRows: SupabaseRow[],
): DashboardActivity[] {
  const consultantNames = new Map(
    usuariosRows.map((row) => [
      getString(row, ["id"], ""),
      getString(row, ["nome", "email"], "Consultor sem nome"),
    ]),
  );
  const pendingByConsultant = new Map<string, number>();

  tarefasRows.forEach((row) => {
    const status = normalizeText(getString(row, ["status"], ""));

    if (["concluido", "concluida", "finalizado", "finalizada", "cancelado", "cancelada"].includes(status)) {
      return;
    }

    const consultantId = getString(row, ["consultor_id", "usuario_id", "responsavel_id"], "");

    if (!consultantId) {
      return;
    }

    pendingByConsultant.set(consultantId, (pendingByConsultant.get(consultantId) ?? 0) + 1);
  });

  return Array.from(pendingByConsultant.entries())
    .map(([consultantId, count], index) => ({
      title: consultantNames.get(consultantId) ?? "Consultor nao identificado",
      description: "Tarefas pendentes",
      time: `${formatNumber(count)} pendencia${count === 1 ? "" : "s"}`,
      tone: (["orange", "gold", "blue", "violet", "green"] as const)[index % 5],
      count,
    }))
    .sort((first, second) => second.count - first.count)
    .slice(0, 5)
    .map((activity) => ({
      description: activity.description,
      time: activity.time,
      title: activity.title,
      tone: activity.tone,
    }));
}

function getConsultantActivitiesFromRows(
  leadsRows: SupabaseRow[],
  agendamentosRows: SupabaseRow[],
  negociosRows: SupabaseRow[],
): DashboardActivity[] {
  const activities: DashboardActivity[] = [];
  const firstLead = leadsRows[0];
  const firstAppointment = agendamentosRows[0];
  const firstBusiness = negociosRows[0];

  if (firstLead) {
    activities.push({
      title: "Novo lead recebido",
      description: getString(firstLead, ["interesse", "origem"], "Lead aguardando primeiro contato."),
      time: "hoje",
      tone: "green",
    });
  }

  if (firstAppointment) {
    activities.push({
      title: "Reuniao agendada",
      description: getString(firstAppointment, ["titulo", "descricao"], "Compromisso com cliente."),
      time: getString(firstAppointment, ["hora_inicio", "hora"], "hoje"),
      tone: "orange",
    });
  }

  if (firstBusiness) {
    activities.push({
      title: "Proposta em andamento",
      description: getString(firstBusiness, ["produto", "etapa"], "Negocio em acompanhamento."),
      time: getString(firstBusiness, ["etapa"], "agora"),
      tone: "violet",
    });
  }

  return [...activities, ...consultantActivities].slice(0, 5);
}

function getConsultantPieSegments(leadsRows: SupabaseRow[]): DashboardPieSegment[] {
  const origins = [
    { key: "indicacao", label: "Indicacao", color: "#22c55e" },
    { key: "recepcao", label: "Recepcao", color: "#d4b06a" },
    { key: "google", label: "Google", color: "#3f8df3" },
    { key: "instagram", label: "Instagram", color: "#8b5cf6" },
    { key: "facebook", label: "Facebook", color: "#2563eb" },
    { key: "tiktok", label: "TikTok", color: "#111827" },
  ];

  const segments = origins.map((origin) => {
    const count = leadsRows.filter((row) => normalizeText(getString(row, ["origem"], "")).includes(origin.key)).length;

    return {
      ...origin,
      count,
      value: `${formatNumber(count)} lead${count === 1 ? "" : "s"}`,
    };
  });

  const knownOrigins = origins.map((origin) => origin.key);
  const otherCount = leadsRows.filter((row) => {
    const origin = normalizeText(getString(row, ["origem"], ""));

    return origin && !knownOrigins.some((item) => origin.includes(item));
  }).length;

  return [
    ...segments,
    {
      label: "Outros",
      count: otherCount,
      value: `${formatNumber(otherCount)} lead${otherCount === 1 ? "" : "s"}`,
      color: "#d9dde5",
    },
  ];
}

function getLeadOriginPieSegments(leadsRows: SupabaseRow[]): DashboardPieSegment[] {
  return getConsultantPieSegments(leadsRows);
}

function getReceptionTaskPieSegments(agendamentosRows: SupabaseRow[], clientesCount: number, recadosCount: number): DashboardPieSegment[] {
  const today = getTodayDateString();
  const todayAppointments = agendamentosRows.filter((row) => {
    const rowDate = parseRowDate(row);

    return rowDate ? getDateKey(rowDate) === today : false;
  });
  const confirmedAppointments = todayAppointments.filter((row) => {
    const status = normalizeText(getString(row, ["status"], ""));

    return status.includes("confirmado") || status.includes("confirmada") || status.includes("concluido") || status.includes("concluida");
  }).length;
  const pendingAppointments = Math.max(0, todayAppointments.length - confirmedAppointments);
  const segments = [
    { label: "Atendimentos feitos", count: confirmedAppointments, color: "#22c55e" },
    { label: "Agenda pendente", count: pendingAppointments, color: "#d4b06a" },
    { label: "Clientes a confirmar", count: clientesCount, color: "#3f8df3" },
    { label: "Recados", count: recadosCount, color: "#8b5cf6" },
  ];

  return segments.map((segment) => ({
    ...segment,
    value: `${formatNumber(segment.count)} item${segment.count === 1 ? "" : "s"}`,
  }));
}

function getConsultantPerformance(negociosRows: SupabaseRow[]): DashboardPerformance {
  const wonRows = negociosRows.filter(isWonBusinessRow);
  const now = new Date();
  const dayDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);

    date.setDate(now.getDate() - (6 - index));

    return date;
  });
  const monthDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);

    return date;
  });
  const yearValues = Array.from({ length: 5 }, (_, index) => now.getFullYear() - (4 - index));
  const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const sumByDate = (date: Date) => wonRows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? getDateKey(rowDate) === getDateKey(date) : false;
    })
    .reduce((total, row) => total + getNumber(row, ["valor"]), 0);
  const sumByMonth = (date: Date) => wonRows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? getMonthKey(rowDate) === getMonthKey(date) : false;
    })
    .reduce((total, row) => total + getNumber(row, ["valor"]), 0);
  const sumByYear = (year: number) => wonRows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? rowDate.getFullYear() === year : false;
    })
    .reduce((total, row) => total + getNumber(row, ["valor"]), 0);
  const cumulative = (values: number[]) => values.reduce<number[]>((totals, value, index) => {
    totals.push(value + (totals[index - 1] ?? 0));

    return totals;
  }, []);

  return {
    day: {
      labels: dayDates.map((date) => weekdayFormatter.format(date).replace(".", "")),
      values: cumulative(dayDates.map(sumByDate)),
    },
    month: {
      labels: monthDates.map((date) => monthFormatter.format(date).replace(".", "")),
      values: cumulative(monthDates.map(sumByMonth)),
    },
    year: {
      labels: yearValues.map(String),
      values: cumulative(yearValues.map(sumByYear)),
    },
  };
}

function sumRows(rows: SupabaseRow[], keys: string[]): number {
  return rows.reduce((total, row) => total + getNumber(row, keys), 0);
}

function sumCurrentMonthBusinessVolume(rows: SupabaseRow[]): number {
  return rows.reduce((total, row) => {
    const date = parseRowDate(row);

    if (!isCurrentMonth(date) || !isWonBusinessRow(row)) {
      return total;
    }

    return total + getNumber(row, ["valor", "valor_estimado", "amount", "total"]);
  }, 0);
}

function sumCurrentMonthCommission(rows: SupabaseRow[]): number {
  return rows.reduce((total, row) => {
    const date = parseRowDate(row);

    if (!isCurrentMonth(date)) {
      return total;
    }

    return total + getNumber(row, ["comissao"]);
  }, 0);
}

function formatGoalProgress(income: number, goal: number): string {
  if (goal <= 0) {
    return "0%";
  }

  return `${Math.round((income / goal) * 100)}%`;
}

function sumFinanceRows(rows: SupabaseRow[], direction: "income" | "expense"): number {
  return rows.reduce((total, row) => {
    const date = parseRowDate(row);
    const isDirection = direction === "income" ? isIncomeFinanceRow(row) : isExpenseFinanceRow(row);

    if (!isCurrentMonth(date) || !isPaidFinanceRow(row) || !isDirection) {
      return total;
    }

    return total + getNumber(row, ["valor"]);
  }, 0);
}

function sumPendingFinanceRows(rows: SupabaseRow[], direction: "income" | "expense"): number {
  return rows.reduce((total, row) => {
    const isDirection = direction === "income" ? isIncomeFinanceRow(row) : isExpenseFinanceRow(row);

    if (!isPendingFinanceRow(row) || !isDirection) {
      return total;
    }

    return total + getNumber(row, ["valor"]);
  }, 0);
}

function countPendingFinanceRows(rows: SupabaseRow[]): number {
  return rows.filter((row) => isPendingFinanceRow(row) && (isIncomeFinanceRow(row) || isExpenseFinanceRow(row))).length;
}

function countPendingTaskRows(rows: SupabaseRow[]): number {
  return rows.filter((row) => {
    const status = normalizeText(getString(row, ["status"], ""));

    return !["concluido", "concluida", "finalizado", "finalizada", "cancelado", "cancelada"].includes(status);
  }).length;
}

function getFinancePieSegments(income: number, expenses: number, pendingIncome: number, pendingExpenses: number): DashboardPieSegment[] {
  return [
    { label: "Recebido", count: income, value: formatCurrency(income), color: "#22c55e" },
    { label: "Despesas pagas", count: expenses, value: formatCurrency(expenses), color: "#f97316" },
    { label: "A receber", count: pendingIncome, value: formatCurrency(pendingIncome), color: "#3f8df3" },
    { label: "A pagar", count: pendingExpenses, value: formatCurrency(pendingExpenses), color: "#8b5cf6" },
  ];
}

function getFinancePerformance(rows: SupabaseRow[]): DashboardPerformance {
  const now = new Date();
  const dayDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);

    date.setDate(now.getDate() - (6 - index));

    return date;
  });
  const monthDates = Array.from({ length: 7 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
  const yearValues = Array.from({ length: 5 }, (_, index) => now.getFullYear() - (4 - index));
  const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const rowValue = (row: SupabaseRow) => getNumber(row, ["valor"]);
  const isFinanceMovement = (row: SupabaseRow) => isIncomeFinanceRow(row) || isExpenseFinanceRow(row);
  const sumByDay = (date: Date) => rows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? getDateKey(rowDate) === getDateKey(date) && isPaidFinanceRow(row) && isFinanceMovement(row) : false;
    })
    .reduce((total, row) => total + rowValue(row), 0);
  const sumByMonth = (date: Date) => rows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? getMonthKey(rowDate) === getMonthKey(date) && isPaidFinanceRow(row) && isFinanceMovement(row) : false;
    })
    .reduce((total, row) => total + rowValue(row), 0);
  const sumByYear = (year: number) => rows
    .filter((row) => {
      const rowDate = parseRowDate(row);

      return rowDate ? rowDate.getFullYear() === year && isPaidFinanceRow(row) && isFinanceMovement(row) : false;
    })
    .reduce((total, row) => total + rowValue(row), 0);

  return {
    day: {
      labels: dayDates.map((date) => weekdayFormatter.format(date).replace(".", "")),
      values: dayDates.map(sumByDay),
    },
    month: {
      labels: monthDates.map((date) => monthFormatter.format(date).replace(".", "")),
      values: monthDates.map(sumByMonth),
    },
    year: {
      labels: yearValues.map(String),
      values: yearValues.map(sumByYear),
    },
  };
}

type DashboardMetricStats = {
  activeConsultantsCount?: number;
  activeUsersCount?: number;
  leadsCount: number;
  assignedLeadsCount?: number;
  contactedLeadsCount?: number;
  clientesCount: number;
  usuariosCount: number;
  tarefasCount: number;
  dealsCount: number;
  income: number;
  expenses: number;
  monthlyGoal?: number;
  pendingExpenses?: number;
  pendingFinancialCount?: number;
  pendingIncome?: number;
};

function metricFromBase(index: number, overrides: Pick<DashboardMetric, "title" | "value" | "change">): DashboardMetric {
  return {
    ...baseMetrics[index],
    ...overrides,
  };
}

function getMetricsByRole(role: DashboardRole, stats: DashboardMetricStats): DashboardMetric[] {
  const {
    activeConsultantsCount = 0,
    activeUsersCount = 0,
    leadsCount,
    assignedLeadsCount = 0,
    contactedLeadsCount = 0,
    clientesCount,
    usuariosCount,
    tarefasCount,
    dealsCount,
    income,
    expenses,
    monthlyGoal = 0,
    pendingExpenses = 0,
    pendingFinancialCount = 0,
    pendingIncome = 0,
  } = stats;

  if (role === "admin") {
    return [
      metricFromBase(0, { title: "Usuarios Ativos", value: formatNumber(activeUsersCount || usuariosCount), change: "Perfis do sistema" }),
      metricFromBase(1, { title: "Consultores Ativos", value: formatNumber(activeConsultantsCount), change: "Equipe comercial" }),
      metricFromBase(2, { title: "Leads Cadastrados", value: formatNumber(leadsCount), change: "Base total" }),
      metricFromBase(3, { title: "Clientes Ativos", value: formatNumber(clientesCount), change: "Carteira ativa" }),
      metricFromBase(4, { title: "Pendencias", value: formatNumber(tarefasCount), change: "Operacional" }),
    ];
  }

  if (role === "gestor") {
    return [
      metricFromBase(0, { title: "Total de Leads", value: formatNumber(leadsCount), change: "+12,5%" }),
      metricFromBase(1, { title: "Leads Enviados", value: formatNumber(assignedLeadsCount), change: "+8,3%" }),
      metricFromBase(2, { title: "Leads Contatados", value: formatNumber(contactedLeadsCount), change: "+10,4%" }),
      metricFromBase(3, { title: "Leads Convertidos", value: formatNumber(dealsCount), change: "+15,7%" }),
      metricFromBase(4, { title: "Meta do Mes", value: formatCurrency(monthlyGoal), change: "+6,4%" }),
    ];
  }

  if (role === "consultor") {
    return [
      metricFromBase(0, { title: "Meus Leads", value: formatNumber(leadsCount), change: "+10,2%" }),
      metricFromBase(1, { title: "Meus Clientes", value: formatNumber(clientesCount), change: "+7,1%" }),
      metricFromBase(2, { title: "Agenda Hoje", value: formatNumber(Math.min(tarefasCount, 8)), change: "+3,4%" }),
      metricFromBase(3, { title: "Propostas Abertas", value: formatNumber(dealsCount), change: "+9,8%" }),
      metricFromBase(4, { title: "Tarefas Pendentes", value: formatNumber(tarefasCount), change: "-5,2%" }),
    ];
  }

  if (role === "recepcao") {
    return [
      metricFromBase(0, { title: "Agenda de Hoje", value: formatNumber(Math.min(tarefasCount, 12)), change: "+4,2%" }),
      metricFromBase(1, { title: "Novos Leads", value: formatNumber(leadsCount), change: "+8,3%" }),
      metricFromBase(2, { title: "Clientes a Confirmar", value: formatNumber(clientesCount), change: "+5,1%" }),
      metricFromBase(3, { title: "Recados", value: formatNumber(Math.min(usuariosCount, 9)), change: "+2,6%" }),
      metricFromBase(4, { title: "Encaminhamentos", value: formatNumber(dealsCount), change: "-3,2%" }),
    ];
  }

  if (role === "financeiro") {
    return [
      metricFromBase(0, { title: "Receita Recebida", value: formatCurrency(income), change: "Mes atual" }),
      metricFromBase(1, { title: "Despesas Pagas", value: formatCurrency(expenses), change: "Mes atual" }),
      metricFromBase(2, { title: "A Receber", value: formatCurrency(pendingIncome), change: "Em aberto" }),
      metricFromBase(3, { title: "A Pagar", value: formatCurrency(pendingExpenses), change: "Em aberto" }),
      metricFromBase(4, { title: "Pendencias", value: formatNumber(pendingFinancialCount), change: "Lancamentos" }),
    ];
  }

  return [
    metricFromBase(0, { title: "Leads Totais", value: formatNumber(leadsCount), change: "+12,5%" }),
    metricFromBase(1, { title: "Clientes Ativos", value: formatNumber(clientesCount), change: "+8,3%" }),
    metricFromBase(2, { title: "Negociacoes", value: formatNumber(dealsCount), change: "+15,7%" }),
    metricFromBase(3, { title: "Faturamento", value: formatCurrency(income), change: "+18,6%" }),
    metricFromBase(4, { title: "Tarefas Pendentes", value: formatNumber(tarefasCount), change: "-5,2%" }),
  ];
}

async function getConsultantDashboardData() {
  const today = getTodayDateString();
  const monthStart = getMonthStartDateString();
  const consultantRows = await fetchSupabaseRows("usuarios", {
    filters: { email: "arthurdossantosamaral15@gmail.com" },
    limit: 1,
    select: "id",
  });
  const consultantId = getString(consultantRows[0] ?? {}, ["id"], "");

  if (!consultantId) {
    return null;
  }

  const [
    leadsRows,
    clientesRows,
    agendamentosRows,
    tarefasRows,
    negociosRows,
    financeiroRows,
    metasRows,
  ] = await Promise.all([
    fetchSupabaseRows("leads", {
      filters: { consultor_id: consultantId },
      limit: 50,
      order: "created_at.desc",
      select: leadListSelect,
    }),
    fetchSupabaseRows("clientes", {
      filters: { consultor_id: consultantId },
      limit: 50,
      order: "created_at.desc",
      select: clientListSelect,
    }),
    fetchSupabaseRows("agendamentos", {
      filters: { consultor_id: consultantId, data_agendamento: today },
      limit: 20,
      order: "hora_inicio.asc",
      select: appointmentListSelect,
    }),
    fetchSupabaseRows("tarefas", {
      filters: { consultor_id: consultantId },
      limit: 50,
      order: "created_at.desc",
      select: taskListSelect,
    }),
    fetchSupabaseRows("negocios", {
      filters: { consultor_id: consultantId },
      limit: 50,
      order: "created_at.desc",
      select: businessListSelect,
    }),
    fetchSupabaseRows("financeiro", {
      filters: { consultor_id: consultantId },
      limit: 50,
      order: "created_at.desc",
      select: financeListSelect,
    }),
    fetchSupabaseRows("metas_consultores", {
      filters: { consultor_id: consultantId, mes: monthStart },
      limit: 1,
      select: "consultor_id,mes,meta_comissao",
    }),
  ]);

  const pendingTasks = tarefasRows.filter((row) => !["concluido", "concluida", "finalizado", "finalizada"].includes(
    normalizeText(getString(row, ["status"], "")),
  ));
  const openDeals = negociosRows.filter((row) => !["ganho", "fechado", "concluido", "concluida"].includes(
    normalizeText(getString(row, ["status"], "")),
  ));
  const clientNames = new Map(
    clientesRows.map((row, index) => [
      getString(row, ["id"], `cliente-${index}`),
      getString(row, ["nome"], `Cliente ${index + 1}`),
    ]),
  );
  const commission = sumRows(financeiroRows, ["comissao"]);
  const monthlyGoal = getNumber(metasRows[0] ?? {}, ["meta_comissao"]);
  const goalProgress = monthlyGoal > 0
    ? formatGoalProgress(commission, monthlyGoal)
    : roleConfig.consultor.financial.goal;
  const deals = mapBusinessRowsToDeals(negociosRows, clientNames);

  return {
    activities: getConsultantActivitiesFromRows(leadsRows, agendamentosRows, negociosRows),
    deals: deals.length > 0 ? deals : baseDeals,
    financial: {
      conversion: roleConfig.consultor.financial.conversion,
      expenses: "R$ 0",
      goal: goalProgress,
      income: formatCurrency(commission),
      incomeLabel: roleConfig.consultor.financial.incomeLabel,
      showDetails: roleConfig.consultor.financial.showDetails,
      showGoalProgress: roleConfig.consultor.financial.showGoalProgress,
    },
    metrics: getMetricsByRole("consultor", {
      clientesCount: clientesRows.length,
      dealsCount: openDeals.length,
      expenses: 0,
      income: commission,
      leadsCount: leadsRows.length,
      tarefasCount: pendingTasks.length,
      usuariosCount: 0,
    }).map((metric) => (
      metric.title === "Agenda Hoje"
        ? { ...metric, value: formatNumber(agendamentosRows.length) }
        : metric
    )),
    performance: getConsultantPerformance(negociosRows),
    pieSegments: getConsultantPieSegments(leadsRows),
    pieTotalValue: formatNumber(leadsRows.length),
  };
}

async function getLiveDashboardData(role: DashboardRole) {
  if (role === "consultor") {
    const consultantData = await getConsultantDashboardData();

    if (consultantData) {
      return consultantData;
    }
  }

  const [
    leadsCount,
    clientesCount,
    usuariosCount,
    tarefasCount,
    leadsRows,
    clientesRows,
    activityRows,
    financeiroRows,
    negociosRows,
    metasRows,
    allLeadsRows,
    allUsersRows,
    allTarefasRows,
    allAgendamentosRows,
  ] = await Promise.all([
    countSupabaseRows("leads"),
    countSupabaseRows("clientes"),
    countSupabaseRows("usuarios"),
    countSupabaseRows("tarefas"),
    fetchSupabaseRows("leads", { limit: 4, select: leadListSelect }),
    fetchSupabaseRows("clientes", { limit: 4, select: clientListSelect }),
    fetchSupabaseRows("atividade_logs", { limit: 5 }),
    fetchSupabaseRows("financeiro", { limit: 80, order: "created_at.desc", select: financeListSelect }),
    fetchSupabaseRows("negocios", { limit: 300, order: "created_at.desc", select: businessListSelect }),
    fetchSupabaseRows("metas_consultores", {
      filters: { mes: getMonthStartDateString() },
      limit: 200,
      select: "consultor_id,mes,meta_comissao",
    }),
    role === "admin" || role === "gestor" || role === "recepcao" ? fetchSupabaseRows("leads", { limit: 300, order: "created_at.desc", select: leadListSelect }) : Promise.resolve([]),
    role === "admin" || role === "gestor" ? fetchSupabaseRows("usuarios", { limit: 300, order: "nome.asc", select: userListSelect }) : Promise.resolve([]),
    role === "admin" || role === "gestor" ? fetchSupabaseRows("tarefas", { limit: 300, order: "created_at.desc" }) : Promise.resolve([]),
    role === "recepcao" ? fetchSupabaseRows("agendamentos", { limit: 300, order: "data_agendamento.asc", select: appointmentListSelect }) : Promise.resolve([]),
  ]);

  const receptionAppointments = role === "recepcao" ? mapReceptionAppointmentsToDeals(allAgendamentosRows) : [];
  const financialDeals = role === "financeiro" ? mapFinanceRowsToDeals(financeiroRows) : [];
  const deals = role === "recepcao"
    ? receptionAppointments
    : role === "financeiro"
      ? financialDeals
      : mapRowsToDeals([...leadsRows, ...clientesRows]);
  const activities = mapRowsToActivities(activityRows);
  const financialRowActivities = role === "financeiro" ? mapFinanceRowsToActivities(financeiroRows) : [];
  const receptionActivities = role === "recepcao" ? getReceptionActivities(allAgendamentosRows, allLeadsRows) : [];
  const pendingTaskActivities = role === "gestor"
    ? getPendingTaskActivitiesByConsultant(allTarefasRows, allUsersRows)
    : [];
  const fallbackActivities = role === "consultor" ? consultantActivities : role === "financeiro" ? financialActivities : baseActivities;
  const income = sumFinanceRows(financeiroRows, "income");
  const expenses = sumFinanceRows(financeiroRows, "expense");
  const pendingIncome = role === "financeiro" ? sumPendingFinanceRows(financeiroRows, "income") : 0;
  const pendingExpenses = role === "financeiro" ? sumPendingFinanceRows(financeiroRows, "expense") : 0;
  const pendingFinancialCount = role === "financeiro" ? countPendingFinanceRows(financeiroRows) : 0;
  const financeBalance = income - expenses;
  const assignedLeadsCount = role === "gestor"
    ? allLeadsRows.filter((row) => getString(row, ["consultor_id"], "")).length
    : 0;
  const contactedLeadsCount = role === "gestor"
    ? allLeadsRows.filter((row) => {
        const status = normalizeText(getString(row, ["status"], ""));

        return status && status !== "novo";
      }).length
    : 0;
  const convertedLeadsCount = role === "gestor"
    ? allLeadsRows.filter((row) => normalizeText(getString(row, ["status"], "")).includes("convertido")).length
    : 0;
  const activeUsersCount = role === "admin"
    ? allUsersRows.filter((row) => getString(row, ["ativo"], "true") !== "false").length
    : usuariosCount;
  const activeConsultantsCount = role === "admin" || role === "gestor"
    ? allUsersRows.filter((row) => (
        normalizeText(getString(row, ["tipo"], "")).includes("consultor")
        && getString(row, ["ativo"], "true") !== "false"
      )).length
    : 0;
  const pendingOperationalTasks = role === "admin" ? countPendingTaskRows(allTarefasRows) : tarefasCount;
  const monthlyGoal = role === "gestor"
    ? activeConsultantsCount * consultantMonthlyGoal
    : sumRows(metasRows, ["meta_comissao"]);
  const dealsCount = role === "gestor" ? convertedLeadsCount : leadsRows.length + clientesRows.length;
  const closedBusinessVolume = role === "gestor" ? sumCurrentMonthBusinessVolume(negociosRows) : 0;
  const commissionVolume = role === "gestor" ? sumCurrentMonthCommission(financeiroRows) : 0;
  const businessVolume = role === "gestor" ? (closedBusinessVolume || commissionVolume) : income;
  const financialGoalProgress = role === "gestor" ? formatGoalProgress(businessVolume, monthlyGoal) : roleConfig[role].financial.goal;

  return {
    activities: role === "gestor"
      ? (pendingTaskActivities.length > 0 ? pendingTaskActivities : fallbackActivities)
      : role === "recepcao"
        ? (receptionActivities.length > 0 ? receptionActivities : fallbackActivities)
        : role === "financeiro"
          ? (financialRowActivities.length > 0 ? financialRowActivities : fallbackActivities)
          : (activities.length > 0 && role !== "consultor" ? activities : fallbackActivities),
    deals: deals.length > 0 ? deals : role === "financeiro" ? baseFinancialDeals : baseDeals,
    financial: {
      conversion: role === "gestor" ? financialGoalProgress : role === "recepcao" ? formatNumber(dealsCount) : role === "financeiro" ? formatCurrency(financeBalance) : roleConfig[role].financial.conversion,
      conversionLabel: role === "gestor" ? "Atingimento" : role === "recepcao" ? "Encaminhamentos" : role === "financeiro" ? "Saldo do mes" : roleConfig[role].financial.conversionLabel,
      expenses: role === "gestor" ? formatCurrency(monthlyGoal) : role === "recepcao" ? formatNumber(clientesCount) : formatCurrency(expenses),
      expensesLabel: role === "gestor" ? "Meta do mes" : role === "recepcao" ? "Clientes a confirmar" : roleConfig[role].financial.expensesLabel,
      goalCaption: role === "recepcao" ? "Painel operacional" : role === "financeiro" ? "Fluxo de caixa" : roleConfig[role].financial.goalCaption,
      goal: financialGoalProgress,
      incomeLabel: role === "gestor" ? "Volume de negocios" : role === "recepcao" ? "Atendimentos na agenda" : roleConfig[role].financial.incomeLabel,
      showDetails: roleConfig[role].financial.showDetails,
      showGoalProgress: roleConfig[role].financial.showGoalProgress,
      income: role === "recepcao" ? formatNumber(allAgendamentosRows.length) : formatCurrency(role === "gestor" ? businessVolume : income),
      subtitle: role === "recepcao" ? "Operacao de atendimento" : roleConfig[role].financial.subtitle,
      title: role === "recepcao" ? "Resumo da recepcao" : roleConfig[role].financial.title,
    },
    metrics: getMetricsByRole(role, {
      activeConsultantsCount,
      activeUsersCount,
      assignedLeadsCount,
      clientesCount,
      contactedLeadsCount,
      dealsCount,
      expenses,
      income,
      leadsCount,
      monthlyGoal,
      pendingExpenses,
      pendingFinancialCount,
      pendingIncome,
      tarefasCount: pendingOperationalTasks,
      usuariosCount,
    }),
    performance: role === "gestor"
      ? getConsultantPerformance(negociosRows)
      : role === "recepcao"
        ? getReceptionPerformance(allAgendamentosRows)
        : role === "financeiro"
          ? getFinancePerformance(financeiroRows)
        : basePerformance,
    pieSegments: role === "consultor"
      ? consultantPieSegments
      : role === "recepcao"
        ? getReceptionTaskPieSegments(allAgendamentosRows, clientesCount, Math.min(usuariosCount, 9))
        : role === "financeiro"
          ? getFinancePieSegments(income, expenses, pendingIncome, pendingExpenses)
        : getLeadOriginPieSegments(allLeadsRows),
    pieTotalValue: role === "recepcao"
      ? formatNumber(allAgendamentosRows.length + clientesCount + Math.min(usuariosCount, 9))
      : role === "financeiro"
        ? formatCurrency(Math.max(0, income + expenses + pendingIncome + pendingExpenses))
        : formatNumber(leadsCount),
  };
}

export async function getDashboardData(role: DashboardRole): Promise<DashboardData> {
  const config = roleConfig[role];
  const liveData = await getLiveDashboardData(role);

  return {
    ...config,
    panelTitle: role === "consultor" ? "Painel do Consultor" : role === "recepcao" ? "Painel da Recepcao" : role === "financeiro" ? "Painel Financeiro" : undefined,
    performanceTitle: role === "consultor" ? "Minha Performance" : role === "recepcao" ? "Fluxo de Atendimentos" : role === "financeiro" ? "Fluxo de Caixa" : undefined,
    performanceSubtitle: role === "consultor" ? "Evolucao dos ultimos 7 meses" : role === "recepcao" ? "Agendamentos registrados" : role === "financeiro" ? "Movimentacoes pagas no periodo" : undefined,
    pieTitle: role === "consultor" ? "Origem e Prioridade" : role === "recepcao" ? "Rotina da Recepcao" : role === "financeiro" ? "Distribuicao Financeira" : undefined,
    pieTotalLabel: role === "consultor" ? "Leads" : role === "recepcao" ? "Itens" : role === "financeiro" ? "Total" : undefined,
    pieTotalValue: liveData.pieTotalValue,
    dealsTitle: role === "consultor" ? "Meus negocios" : role === "recepcao" ? "Agenda e retornos" : role === "financeiro" ? "Lancamentos recentes" : undefined,
    dealsSubtitle: role === "consultor" ? "Oportunidades em andamento" : role === "recepcao" ? "Compromissos que precisam de acompanhamento da recepcao" : role === "financeiro" ? "Receitas, despesas e vencimentos mais recentes" : undefined,
    dealsHeaders: role === "recepcao" ? ["Pessoa", "Horario", "Contato ou local", "Tipo", "Status"] : role === "financeiro" ? ["Lancamento", "Categoria", "Valor", "Vencimento", "Status"] : undefined,
    performance: liveData.performance,
    financial: liveData.financial,
    menuItems: roleMenuItems[role],
    metrics: liveData.metrics,
    showMetricSparklines: false,
    activityTitle: role === "consultor" ? "Atividades de Consultores" : role === "gestor" ? "Tarefas Pendentes" : role === "recepcao" ? "Prioridades da Recepcao" : role === "financeiro" ? "Movimentacoes Financeiras" : undefined,
    activitySubtitle: role === "recepcao" ? "Agenda, retornos e leads para direcionar" : role === "financeiro" ? "Baixas, vencimentos e conciliacoes" : undefined,
    activities: liveData.activities,
    deals: liveData.deals,
    pieSegments: liveData.pieSegments,
  };
}
