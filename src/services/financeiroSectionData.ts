import type { GestorSectionData } from "@/services/gestorSectionData";
import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

export type FinanceiroSection = "a-pagar" | "a-receber" | "despesas" | "receitas" | "relatorios";

function getString(row: SupabaseRow, keys: string[], fallback = "-"): string {
  const value = keys.map((key) => row[key]).find((item) => item !== undefined && item !== null && item !== "");

  return value === undefined || value === null || value === "" ? fallback : String(value);
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

function isIncome(row: SupabaseRow): boolean {
  const text = normalizeText(`${getString(row, ["tipo"], "")} ${getString(row, ["categoria"], "")}`);

  return ["receita", "entrada", "faturamento", "venda", "recebimento", "comissao"].some((term) => text.includes(term));
}

function isExpense(row: SupabaseRow): boolean {
  const text = normalizeText(`${getString(row, ["tipo"], "")} ${getString(row, ["categoria"], "")}`);

  return ["despesa", "saida", "custo", "pagamento", "fornecedor"].some((term) => text.includes(term));
}

function isPaid(row: SupabaseRow): boolean {
  const status = normalizeText(getString(row, ["status"], ""));

  if (!status) {
    return true;
  }

  return ["pago", "paga", "recebido", "recebida", "confirmado", "confirmada", "concluido", "concluida"].some((term) =>
    status.includes(term),
  );
}

function getDueDate(row: SupabaseRow): string {
  return getString(row, ["data_vencimento", "vencimento", "data_pagamento", "created_at", "data"], "");
}

function getDescription(row: SupabaseRow, index: number): string {
  return getString(row, ["descricao", "description", "titulo", "nome"], `Lancamento ${index + 1}`);
}

function getResponsible(row: SupabaseRow, usersById: Map<string, string>, clientsById: Map<string, string>): string {
  const clientId = getString(row, ["cliente_id"], "");
  const consultantId = getString(row, ["consultor_id", "usuario_id"], "");

  return clientsById.get(clientId) ?? usersById.get(consultantId) ?? getString(row, ["cliente", "consultor", "responsavel"], "-");
}

function daysUntil(value: string): string {
  if (!value || value === "-") {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const today = new Date();
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);

  if (diff === 0) {
    return "Hoje";
  }

  return diff > 0 ? `${diff} dia${diff === 1 ? "" : "s"}` : `${Math.abs(diff)} dia${diff === -1 ? "" : "s"} atrasado`;
}

function sumRows(rows: SupabaseRow[]): number {
  return rows.reduce((total, row) => total + getNumber(row, ["valor", "amount", "total", "comissao"]), 0);
}

function buildReportRows(incomeRows: SupabaseRow[], expenseRows: SupabaseRow[]): string[][] {
  const received = incomeRows.filter(isPaid);
  const pendingIncome = incomeRows.filter((row) => !isPaid(row));
  const paidExpenses = expenseRows.filter(isPaid);
  const pendingExpenses = expenseRows.filter((row) => !isPaid(row));
  const incomeTotal = sumRows(received);
  const expenseTotal = sumRows(paidExpenses);

  return [
    ["Receita recebida", String(received.length), formatCurrency(incomeTotal), "Entradas confirmadas no periodo"],
    ["Despesas pagas", String(paidExpenses.length), formatCurrency(expenseTotal), "Saidas confirmadas no periodo"],
    ["A receber", String(pendingIncome.length), formatCurrency(sumRows(pendingIncome)), "Titulos aguardando baixa"],
    ["A pagar", String(pendingExpenses.length), formatCurrency(sumRows(pendingExpenses)), "Contas pendentes"],
    ["Saldo do mes", "-", formatCurrency(incomeTotal - expenseTotal), "Receitas recebidas menos despesas pagas"],
  ];
}

export async function getFinanceiroSectionData(section: FinanceiroSection): Promise<GestorSectionData> {
  const financeiro = await fetchSupabaseRows("financeiro", { limit: 300, order: "created_at.desc" });
  const incomeRows = financeiro.filter(isIncome);
  const expenseRows = financeiro.filter(isExpense);
  const pendingIncomeRows = incomeRows.filter((row) => !isPaid(row));
  const pendingExpenseRows = expenseRows.filter((row) => !isPaid(row));
  const needsResponsibleNames = section === "receitas" || section === "a-receber";
  const [usuarios, clientes] = needsResponsibleNames
    ? await Promise.all([
        fetchSupabaseRows("usuarios", { limit: 300 }),
        fetchSupabaseRows("clientes", { limit: 300 }),
      ])
    : [[], []];
  const usersById = new Map(usuarios.map((row) => [getString(row, ["id"], ""), getString(row, ["nome"], "Responsavel")]));
  const clientsById = new Map(clientes.map((row) => [getString(row, ["id"], ""), getString(row, ["nome"], "Cliente")]));

  if (section === "receitas") {
    return {
      activeItem: "Receitas",
      emptyMessage: "Nenhuma receita encontrada.",
      headers: ["Lancamento", "Cliente/consultor", "Categoria", "Valor", "Recebido em", "Status"],
      rows: incomeRows.map((row, index) => [
        getDescription(row, index),
        getResponsible(row, usersById, clientsById),
        getString(row, ["categoria", "tipo"], "Receita"),
        formatCurrency(getNumber(row, ["valor", "amount", "total", "comissao"])),
        formatDate(getString(row, ["data_pagamento", "created_at", "data"], "")),
        isPaid(row) ? "Recebido" : "Pendente",
      ]),
      subtitle: "Entradas confirmadas, comissoes e receitas registradas.",
      title: "Receitas",
    };
  }

  if (section === "despesas") {
    return {
      activeItem: "Despesas",
      emptyMessage: "Nenhuma despesa encontrada.",
      headers: ["Lancamento", "Categoria", "Valor", "Vencimento", "Forma", "Responsavel financeiro", "Status"],
      rows: expenseRows.map((row, index) => [
        getDescription(row, index),
        getString(row, ["categoria", "tipo"], "Despesa"),
        formatCurrency(getNumber(row, ["valor", "amount", "total"])),
        formatDate(getDueDate(row)),
        getString(row, ["forma_pagamento", "metodo_pagamento", "meio_pagamento"], "-"),
        getString(row, ["responsavel_financeiro", "responsavel", "aprovador"], "-"),
        isPaid(row) ? "Pago" : "Pendente",
      ]),
      subtitle: "Custos, saidas, comissoes, folha e pagamentos operacionais.",
      title: "Despesas",
    };
  }

  if (section === "a-receber") {
    return {
      activeItem: "A Receber",
      emptyMessage: "Nenhum recebimento pendente encontrado.",
      headers: ["Titulo", "Cliente/consultor", "Valor", "Vencimento", "Prazo", "Status"],
      rows: pendingIncomeRows.map((row, index) => {
        const dueDate = getDueDate(row);

        return [
          getDescription(row, index),
          getResponsible(row, usersById, clientsById),
          formatCurrency(getNumber(row, ["valor", "amount", "total", "comissao"])),
          formatDate(dueDate),
          daysUntil(dueDate),
          getString(row, ["status"], "Pendente"),
        ];
      }),
      subtitle: "Recebimentos em aberto e vencimentos para acompanhamento.",
      title: "A receber",
    };
  }

  if (section === "a-pagar") {
    return {
      activeItem: "A Pagar",
      emptyMessage: "Nenhuma conta a pagar encontrada.",
      headers: ["Conta", "Fornecedor/categoria", "Valor", "Vencimento", "Prioridade", "Status"],
      rows: pendingExpenseRows.map((row, index) => {
        const dueDate = getDueDate(row);

        return [
          getDescription(row, index),
          getString(row, ["fornecedor", "categoria", "tipo"], "Despesa"),
          formatCurrency(getNumber(row, ["valor", "amount", "total"])),
          formatDate(dueDate),
          daysUntil(dueDate),
          getString(row, ["status"], "Pendente"),
        ];
      }),
      subtitle: "Pagamentos pendentes, fornecedores e prazos.",
      title: "A pagar",
    };
  }

  return {
    activeItem: "Relatorios",
    emptyMessage: "Nenhum indicador financeiro disponivel.",
    headers: ["Indicador", "Quantidade", "Valor", "Observacao"],
    rows: buildReportRows(incomeRows, expenseRows),
    subtitle: "Resumo consolidado de receitas, despesas e pendencias.",
    title: "Relatorios financeiros",
  };
}
