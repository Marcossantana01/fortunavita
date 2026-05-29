import { NextResponse } from "next/server";
import { insertSupabaseRow, updateSupabaseRows } from "@/services/supabaseClient";

type ClientPayload = {
  clienteId?: string;
  cpf?: string;
  data_nascimento?: string;
  documentos?: string;
  email?: string;
  estado_civil?: string;
  leadId?: string;
  nome?: string;
  objetivo?: string;
  observacoes?: string;
  patrimonio?: string;
  profissao?: string;
  renda_mensal?: string;
  telefone?: string;
  consultor_id?: string;
};

function clean(value?: string): string {
  return String(value ?? "").trim();
}

function cleanNumber(value?: string): number | null {
  const text = clean(value);

  if (!text) {
    return null;
  }

  const digits = text.replace(/\D/g, "");
  const numberValue = Number(digits) / 100;

  return Number.isFinite(numberValue) ? numberValue : null;
}

function isValidCpf(value?: string): boolean {
  const cpf = clean(value).replace(/\D/g, "");

  if (!cpf) {
    return true;
  }

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (factor: number) => {
    const total = cpf
      .slice(0, factor - 1)
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0);
    const rest = (total * 10) % 11;

    return rest === 10 ? 0 : rest;
  };

  return calculateDigit(10) === Number(cpf[9]) && calculateDigit(11) === Number(cpf[10]);
}

function buildObservacoes(observacoes?: string, documentos?: string): string | null {
  const cleanObservacoes = clean(observacoes).replace(/\bdado_teste_consultor\b/gi, "").trim();
  const cleanDocumentos = clean(documentos);
  const value = [
    cleanObservacoes,
    cleanDocumentos ? `Documentos: ${cleanDocumentos}` : "",
  ].filter(Boolean).join("\n\n");

  return value || null;
}

function buildClientValues(payload: ClientPayload, nome: string, telefone: string) {
  return {
    cpf: clean(payload.cpf) || null,
    data_nascimento: clean(payload.data_nascimento) || null,
    email: clean(payload.email) || null,
    estado_civil: clean(payload.estado_civil) || null,
    nome,
    objetivo: clean(payload.objetivo) || null,
    observacoes: buildObservacoes(payload.observacoes, payload.documentos),
    patrimonio: cleanNumber(payload.patrimonio),
    profissao: clean(payload.profissao) || null,
    renda_mensal: cleanNumber(payload.renda_mensal),
    status: "ativo",
    telefone,
    consultor_id: clean(payload.consultor_id) || null,
  };
}

async function saveClient(request: Request, mode: "create" | "update") {
  const payload = await request.json() as ClientPayload;
  const nome = clean(payload.nome);
  const telefone = clean(payload.telefone);

  if (!nome || !telefone) {
    return NextResponse.json({ error: "Informe nome e telefone do cliente." }, { status: 400 });
  }

  if (!isValidCpf(payload.cpf)) {
    return NextResponse.json({ error: "Informe um CPF valido." }, { status: 400 });
  }

  const values = buildClientValues(payload, nome, telefone);
  const clienteId = clean(payload.clienteId);
  const result = mode === "update"
    ? await updateSupabaseRows("clientes", { id: clienteId }, values)
    : await insertSupabaseRow("clientes", values);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const leadId = clean(payload.leadId);

  if (leadId) {
    await updateSupabaseRows("leads", { id: leadId }, { status: "convertido" });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  return saveClient(request, "create");
}

export async function PATCH(request: Request) {
  const payload = await request.clone().json() as ClientPayload;

  if (!clean(payload.clienteId)) {
    return NextResponse.json({ error: "Cliente invalido." }, { status: 400 });
  }

  return saveClient(request, "update");
}
