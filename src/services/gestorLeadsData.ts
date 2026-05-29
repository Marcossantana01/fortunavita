import { fetchSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

export type GestorLead = {
  id: string;
  nome: string;
  origem: string;
  prioridade: string;
  interesse: string;
  telefone: string;
  status: string;
  motivoNaoFechou: string;
  consultorId: string;
  consultorNome: string;
};

export type GestorConsultor = {
  id: string;
  nome: string;
  email: string;
};

export type GestorLeadsData = {
  consultores: GestorConsultor[];
  interests: string[];
  leads: GestorLead[];
};

function getString(row: SupabaseRow, key: string, fallback = ""): string {
  const value = row[key];

  return value === undefined || value === null ? fallback : String(value);
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isConsultor(row: SupabaseRow): boolean {
  return normalizeText(getString(row, "tipo")).includes("consultor");
}

function getLeadReason(row: SupabaseRow): string {
  const reasonColumns = [
    "justificativa_nao_conversao",
    "motivo_nao_conversao",
    "motivo_nao_convertido",
    "justificativa_nao_convertido",
    "justificativa",
    "motivo_perda",
    "observacao_perda",
    "observacoes",
    "observacao",
  ];
  const directReason = reasonColumns.map((column) => getString(row, column)).find(Boolean);
  const message = getString(row, "mensagem");
  const reasonLabel = "Justificativa de nao conversao:";
  const reasonIndex = message.indexOf(reasonLabel);

  if (directReason) {
    return directReason;
  }

  if (reasonIndex >= 0) {
    return message.slice(reasonIndex + reasonLabel.length).trim();
  }

  return "";
}

function getLeadStatusLabel(status: string): string {
  const normalized = normalizeText(status);

  if (["recusado", "perdido", "nao_fechou", "nao fechou"].some((item) => normalized.includes(item))) {
    return "Trabalhado - nao fechou";
  }

  if (normalized.includes("convertido")) {
    return "Convertido";
  }

  return status || "-";
}

export async function getGestorLeadsData(): Promise<GestorLeadsData> {
  const [leadsRows, usuariosRows] = await Promise.all([
    fetchSupabaseRows("leads", {
      limit: 200,
      order: "created_at.desc",
    }),
    fetchSupabaseRows("usuarios", {
      limit: 100,
      order: "nome.asc",
    }),
  ]);
  const consultores = usuariosRows
    .filter(isConsultor)
    .map((row) => ({
      email: getString(row, "email", "-"),
      id: getString(row, "id"),
      nome: getString(row, "nome", "Consultor"),
    }))
    .filter((consultor) => consultor.id);
  const consultoresById = new Map(consultores.map((consultor) => [consultor.id, consultor.nome]));
  const leads = leadsRows.map((row) => {
    const consultorId = getString(row, "consultor_id");

    return {
      consultorId,
      consultorNome: consultorId ? consultoresById.get(consultorId) ?? "Consultor nao encontrado" : "Nao atribuido",
      id: getString(row, "id"),
      interesse: getString(row, "interesse", "-"),
      motivoNaoFechou: getLeadReason(row) || "-",
      nome: getString(row, "nome", "Lead sem nome"),
      origem: getString(row, "origem", "-"),
      prioridade: getString(row, "prioridade", "-"),
      status: getLeadStatusLabel(getString(row, "status", "-")),
      telefone: getString(row, "telefone", "-"),
    };
  });
  const interests = Array.from(new Set(
    leads
      .map((lead) => lead.interesse)
      .filter((interest) => interest && interest !== "-"),
  )).sort((a, b) => a.localeCompare(b));

  return {
    consultores,
    interests,
    leads,
  };
}
