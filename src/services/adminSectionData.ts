import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

export type AdminSection =
  | "agenda"
  | "clientes"
  | "consultores"
  | "financeiro"
  | "fornecedores"
  | "leads"
  | "relatorios"
  | "usuarios";

export type AdminField = {
  label: string;
  type: string;
  required?: boolean;
};

export type AdminSectionData = {
  activeItem: string;
  emptyMessage: string;
  fields: AdminField[];
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

function isCurrentMonth(value: string): boolean {
  if (!value || value === "-") {
    return false;
  }

  const date = new Date(value);
  const now = new Date();

  return !Number.isNaN(date.getTime())
    && date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth();
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

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function countBy(rows: SupabaseRow[], key: string, id: string): number {
  return rows.filter((row) => getString(row, key, "") === id).length;
}

const fieldsBySection: Record<AdminSection, AdminField[]> = {
  agenda: [
    { label: "Data", type: "Data", required: true },
    { label: "Horario", type: "Hora", required: true },
    { label: "Compromisso", type: "Texto", required: true },
    { label: "Cliente", type: "Relacionamento" },
    { label: "Consultor", type: "Relacionamento" },
    { label: "Tipo", type: "Selecao" },
    { label: "Status", type: "Selecao" },
    { label: "Local", type: "Texto" },
  ],
  clientes: [
    { label: "Nome completo", type: "Texto", required: true },
    { label: "CPF/CNPJ", type: "Documento" },
    { label: "Telefone", type: "Telefone", required: true },
    { label: "E-mail", type: "E-mail" },
    { label: "Objetivo financeiro", type: "Texto" },
    { label: "Consultor responsavel", type: "Relacionamento" },
    { label: "Renda mensal", type: "Moeda" },
    { label: "Patrimonio", type: "Moeda" },
  ],
  consultores: [
    { label: "Nome", type: "Texto", required: true },
    { label: "E-mail", type: "E-mail", required: true },
    { label: "Telefone", type: "Telefone" },
    { label: "Modalidade", type: "Selecao" },
    { label: "Especialidade", type: "Texto" },
    { label: "Meta mensal", type: "Moeda" },
    { label: "Status", type: "Selecao" },
  ],
  financeiro: [
    { label: "Data", type: "Data", required: true },
    { label: "Tipo", type: "Receita/Despesa", required: true },
    { label: "Categoria", type: "Selecao", required: true },
    { label: "Descricao", type: "Texto" },
    { label: "Cliente", type: "Relacionamento" },
    { label: "Valor", type: "Moeda", required: true },
    { label: "Status", type: "Selecao" },
    { label: "Vencimento", type: "Data" },
  ],
  fornecedores: [
    { label: "Razao social", type: "Texto", required: true },
    { label: "CNPJ", type: "Documento" },
    { label: "Categoria", type: "Selecao" },
    { label: "Contato", type: "Texto" },
    { label: "Telefone", type: "Telefone" },
    { label: "E-mail", type: "E-mail" },
    { label: "Status", type: "Selecao" },
    { label: "Observacoes", type: "Texto longo" },
  ],
  leads: [
    { label: "Nome", type: "Texto", required: true },
    { label: "Telefone", type: "Telefone", required: true },
    { label: "E-mail", type: "E-mail" },
    { label: "Origem", type: "Selecao", required: true },
    { label: "Interesse", type: "Texto" },
    { label: "Consultor", type: "Relacionamento" },
    { label: "Status", type: "Selecao" },
    { label: "Observacoes", type: "Texto longo" },
  ],
  relatorios: [
    { label: "Indicador", type: "Metrica" },
    { label: "Hoje", type: "Numero" },
    { label: "Mes atual", type: "Numero/Moeda" },
    { label: "Total", type: "Numero/Moeda" },
    { label: "Observacao", type: "Texto" },
  ],
  usuarios: [
    { label: "Nome", type: "Texto", required: true },
    { label: "E-mail", type: "E-mail", required: true },
    { label: "Telefone", type: "Telefone" },
    { label: "Tipo de acesso", type: "Selecao", required: true },
    { label: "Cargo", type: "Texto" },
    { label: "Permissao", type: "Selecao" },
    { label: "Status", type: "Ativo/Inativo" },
  ],
};

export async function getAdminSectionData(section: AdminSection): Promise<AdminSectionData> {
  if (section === "leads") {
    const [leads, usuarios] = await Promise.all([
      fetchSupabaseRows("leads", { limit: 300, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 200, order: "nome.asc" }),
    ]);
    const userNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Leads",
      emptyMessage: "Nenhum lead cadastrado.",
      fields: fieldsBySection.leads,
      headers: ["Nome", "Telefone", "E-mail", "Origem", "Interesse", "Consultor", "Status", "Criado em"],
      rows: leads.map((lead) => [
        getString(lead, "nome", "Lead"),
        getString(lead, "telefone"),
        getString(lead, "email"),
        getString(lead, "origem"),
        getString(lead, "interesse"),
        userNames.get(getString(lead, "consultor_id", "")) ?? "Nao atribuido",
        getString(lead, "status"),
        formatDate(getString(lead, "created_at")),
      ]),
      subtitle: "Entrada, origem, consultor responsavel e status comercial.",
      title: "Leads cadastrados",
    };
  }

  if (section === "clientes") {
    const [clientes, usuarios] = await Promise.all([
      fetchSupabaseRows("clientes", { limit: 300, order: "created_at.desc" }),
      fetchSupabaseRows("usuarios", { limit: 200, order: "nome.asc" }),
    ]);
    const userNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));

    return {
      activeItem: "Clientes",
      emptyMessage: "Nenhum cliente cadastrado.",
      fields: fieldsBySection.clientes,
      headers: ["Cliente", "CPF/CNPJ", "Telefone", "E-mail", "Objetivo", "Consultor", "Patrimonio", "Status"],
      rows: clientes.map((cliente) => [
        getString(cliente, "nome", "Cliente"),
        getString(cliente, "documento", getString(cliente, "cpf_cnpj")),
        getString(cliente, "telefone"),
        getString(cliente, "email"),
        getString(cliente, "objetivo"),
        userNames.get(getString(cliente, "consultor_id", "")) ?? "Nao atribuido",
        formatCurrency(getNumber(cliente, "patrimonio")),
        getString(cliente, "status"),
      ]),
      subtitle: "Carteira ativa com perfil financeiro e responsavel.",
      title: "Clientes",
    };
  }

  if (section === "usuarios" || section === "consultores") {
    const [usuarios, leads, clientes] = await Promise.all([
      fetchSupabaseRows("usuarios", { limit: 300, order: "nome.asc" }),
      fetchSupabaseRows("leads", { limit: 300, order: "created_at.desc" }),
      fetchSupabaseRows("clientes", { limit: 300, order: "created_at.desc" }),
    ]);
    const rows = section === "consultores"
      ? usuarios.filter((row) => normalizeText(getString(row, "tipo", "")).includes("consultor"))
      : usuarios;

    return section === "consultores"
      ? {
          activeItem: "Consultores",
          emptyMessage: "Nenhum consultor cadastrado.",
          fields: fieldsBySection.consultores,
          headers: ["Consultor", "E-mail", "Telefone", "Modalidade", "Especialidade", "Status", "Leads", "Clientes"],
          rows: rows.map((consultor) => {
            const id = getString(consultor, "id", "");

            return [
              getString(consultor, "nome", "Consultor"),
              getString(consultor, "email"),
              getString(consultor, "telefone"),
              getString(consultor, "modalidade_atendimento", "Nao informado"),
              getString(consultor, "especialidade", "Planejamento financeiro"),
              getString(consultor, "ativo") === "false" ? "Inativo" : "Ativo",
              String(countBy(leads, "consultor_id", id)),
              String(countBy(clientes, "consultor_id", id)),
            ];
          }),
          subtitle: "Equipe comercial, carteira atribuida e situacao de acesso.",
          title: "Consultores",
        }
      : {
          activeItem: "Usuarios",
          emptyMessage: "Nenhum usuario cadastrado.",
          fields: fieldsBySection.usuarios,
          headers: ["Nome", "E-mail", "Telefone", "Tipo", "Cargo", "Permissao", "Status", "Criado em"],
          rows: rows.map((usuario) => [
            getString(usuario, "nome", "Usuario"),
            getString(usuario, "email"),
            getString(usuario, "telefone"),
            getString(usuario, "tipo"),
            getString(usuario, "cargo"),
            getString(usuario, "permissao", getString(usuario, "perfil")),
            getString(usuario, "ativo") === "false" ? "Inativo" : "Ativo",
            formatDate(getString(usuario, "created_at")),
          ]),
          subtitle: "Perfis de acesso, cargos e status operacional.",
          title: "Usuarios do sistema",
        };
  }

  if (section === "financeiro") {
    const [financeiro, clientes] = await Promise.all([
      fetchSupabaseRows("financeiro", { limit: 300, order: "created_at.desc" }),
      fetchSupabaseRows("clientes", { limit: 300, order: "created_at.desc" }),
    ]);
    const clientNames = new Map(clientes.map((row) => [getString(row, "id", ""), getString(row, "nome", "Cliente")]));

    return {
      activeItem: "Financeiro",
      emptyMessage: "Nenhuma movimentacao financeira encontrada.",
      fields: fieldsBySection.financeiro,
      headers: ["Data", "Tipo", "Categoria", "Descricao", "Cliente", "Valor", "Status", "Vencimento"],
      rows: financeiro.map((item) => [
        formatDate(getString(item, "created_at")),
        getString(item, "tipo"),
        getString(item, "categoria"),
        getString(item, "descricao"),
        clientNames.get(getString(item, "cliente_id", "")) ?? "-",
        formatCurrency(getNumber(item, "valor") || getNumber(item, "comissao")),
        getString(item, "status"),
        formatDate(getString(item, "vencimento")),
      ]),
      subtitle: "Receitas, despesas, comissoes e vencimentos.",
      title: "Financeiro administrativo",
    };
  }

  if (section === "fornecedores") {
    const fornecedores = await fetchSupabaseRows("fornecedores", { limit: 300, order: "nome.asc" });

    return {
      activeItem: "Fornecedores",
      emptyMessage: "Nenhum fornecedor cadastrado.",
      fields: fieldsBySection.fornecedores,
      headers: ["Fornecedor", "CNPJ", "Categoria", "Contato", "Telefone", "E-mail", "Status", "Observacoes"],
      rows: fornecedores.map((fornecedor) => [
        getString(fornecedor, "nome", getString(fornecedor, "razao_social", "Fornecedor")),
        getString(fornecedor, "cnpj"),
        getString(fornecedor, "categoria"),
        getString(fornecedor, "contato"),
        getString(fornecedor, "telefone"),
        getString(fornecedor, "email"),
        getString(fornecedor, "status"),
        getString(fornecedor, "observacoes"),
      ]),
      subtitle: "Cadastro operacional para parceiros, prestadores e contratos.",
      title: "Fornecedores",
    };
  }

  if (section === "agenda") {
    const [agendamentos, usuarios, clientes] = await Promise.all([
      fetchSupabaseRows("agendamentos", { limit: 300, order: "data_agendamento.asc" }),
      fetchSupabaseRows("usuarios", { limit: 200, order: "nome.asc" }),
      fetchSupabaseRows("clientes", { limit: 300, order: "created_at.desc" }),
    ]);
    const userNames = new Map(usuarios.map((row) => [getString(row, "id", ""), getString(row, "nome", "Consultor")]));
    const clientNames = new Map(clientes.map((row) => [getString(row, "id", ""), getString(row, "nome", "Cliente")]));

    return {
      activeItem: "Agenda",
      emptyMessage: "Nenhum compromisso na agenda.",
      fields: fieldsBySection.agenda,
      headers: ["Data", "Horario", "Compromisso", "Cliente", "Consultor", "Tipo", "Status", "Local"],
      rows: agendamentos.map((appointment) => [
        formatDate(getString(appointment, "data_agendamento")),
        getString(appointment, "hora_inicio"),
        getString(appointment, "titulo", "Compromisso"),
        clientNames.get(getString(appointment, "cliente_id", "")) ?? "-",
        userNames.get(getString(appointment, "consultor_id", "")) ?? "Nao atribuido",
        getString(appointment, "tipo"),
        getString(appointment, "status"),
        getString(appointment, "local"),
      ]),
      subtitle: "Compromissos administrativos, comerciais e operacionais.",
      title: "Agenda geral",
    };
  }

  const [leads, clientes, usuarios, agendamentos, financeiro, fornecedores] = await Promise.all([
    fetchSupabaseRows("leads", { limit: 500, order: "created_at.desc" }),
    fetchSupabaseRows("clientes", { limit: 500, order: "created_at.desc" }),
    fetchSupabaseRows("usuarios", { limit: 500, order: "created_at.desc" }),
    fetchSupabaseRows("agendamentos", { limit: 500, order: "data_agendamento.asc" }),
    fetchSupabaseRows("financeiro", { limit: 500, order: "created_at.desc" }),
    fetchSupabaseRows("fornecedores", { limit: 500, order: "nome.asc" }),
  ]);
  const income = financeiro
    .filter((row) => normalizeText(getString(row, "tipo", "")).includes("receita"))
    .reduce((total, row) => total + getNumber(row, "valor"), 0);
  const expenses = financeiro
    .filter((row) => normalizeText(getString(row, "tipo", "")).includes("despesa"))
    .reduce((total, row) => total + getNumber(row, "valor"), 0);

  return {
    activeItem: "Relatorios",
    emptyMessage: "Nenhum indicador disponivel.",
    fields: fieldsBySection.relatorios,
    headers: ["Indicador", "Hoje", "Mes atual", "Total", "Observacao"],
    rows: [
      ["Leads", String(leads.filter((row) => isToday(getString(row, "created_at"))).length), String(leads.filter((row) => isCurrentMonth(getString(row, "created_at"))).length), String(leads.length), "Novas oportunidades cadastradas"],
      ["Clientes", String(clientes.filter((row) => isToday(getString(row, "created_at"))).length), String(clientes.filter((row) => isCurrentMonth(getString(row, "created_at"))).length), String(clientes.length), "Carteira ativa e historico"],
      ["Usuarios", String(usuarios.filter((row) => isToday(getString(row, "created_at"))).length), String(usuarios.filter((row) => isCurrentMonth(getString(row, "created_at"))).length), String(usuarios.length), "Acessos administrativos e operacionais"],
      ["Agenda", String(agendamentos.filter((row) => isToday(getString(row, "data_agendamento"))).length), String(agendamentos.filter((row) => isCurrentMonth(getString(row, "data_agendamento"))).length), String(agendamentos.length), "Compromissos cadastrados"],
      ["Receitas", "-", formatCurrency(income), formatCurrency(income), "Movimentacoes de entrada"],
      ["Despesas", "-", formatCurrency(expenses), formatCurrency(expenses), "Movimentacoes de saida"],
      ["Fornecedores", "-", "-", String(fornecedores.length), "Prestadores e parceiros"],
    ],
    subtitle: "Indicadores consolidados para decisao administrativa.",
    title: "Relatorios administrativos",
  };
}
