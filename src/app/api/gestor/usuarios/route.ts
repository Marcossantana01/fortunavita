import { NextResponse } from "next/server";
import { fetchSupabaseRows, insertSupabaseRow, updateSupabaseRows } from "@/services/supabaseClient";

type UserPayload = {
  ativo?: boolean;
  cpf?: string;
  data_nascimento?: string;
  email?: string;
  estado_civil?: string;
  modalidade_atendimento?: string;
  nome?: string;
  objetivo?: string;
  observacoes?: string;
  patrimonio?: string;
  profissao?: string;
  renda_mensal?: string;
  senha?: string;
  telefone?: string;
  tipo?: string;
  usuarioId?: string;
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

export async function POST(request: Request) {
  const payload = await request.json() as UserPayload;
  const nome = clean(payload.nome);
  const email = clean(payload.email).toLowerCase();
  const senha = clean(payload.senha);
  const tipo = clean(payload.tipo) || "consultor";

  if (!nome || !email || !senha) {
    return NextResponse.json({ error: "Informe nome, e-mail e senha." }, { status: 400 });
  }

  if (!isValidCpf(payload.cpf)) {
    return NextResponse.json({ error: "Informe um CPF valido." }, { status: 400 });
  }

  const result = await insertSupabaseRow("usuarios", {
    ativo: true,
    cpf: clean(payload.cpf) || null,
    data_nascimento: clean(payload.data_nascimento) || null,
    email,
    estado_civil: clean(payload.estado_civil) || null,
    modalidade_atendimento: clean(payload.modalidade_atendimento) || null,
    nome,
    objetivo: clean(payload.objetivo) || null,
    observacoes: clean(payload.observacoes) || null,
    patrimonio: cleanNumber(payload.patrimonio),
    profissao: clean(payload.profissao) || null,
    renda_mensal: cleanNumber(payload.renda_mensal),
    senha,
    telefone: clean(payload.telefone) || null,
    tipo,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const payload = await request.json() as UserPayload;
  const usuarioId = clean(payload.usuarioId);
  const email = clean(payload.email).toLowerCase();
  const tipo = clean(payload.tipo);

  if (!usuarioId) {
    return NextResponse.json({ error: "Usuario invalido." }, { status: 400 });
  }

  if (!email || !tipo) {
    return NextResponse.json({ error: "Informe e-mail e tipo do usuario." }, { status: 400 });
  }

  const currentRows = await fetchSupabaseRows("usuarios", {
    filters: { id: usuarioId },
    limit: 1,
  });
  const currentUser = currentRows[0];

  if (!currentUser || clean(String(currentUser.email)).toLowerCase() !== email || clean(String(currentUser.tipo)) !== tipo) {
    return NextResponse.json({ error: "Usuario nao encontrado com e-mail e tipo informados." }, { status: 404 });
  }

  const result = await updateSupabaseRows("usuarios", { id: usuarioId }, {
    ativo: Boolean(payload.ativo),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const rows = await fetchSupabaseRows("usuarios", {
    filters: { id: usuarioId },
    limit: 1,
  });
  const updatedUser = rows[0];
  const currentStatus = updatedUser ? Boolean(updatedUser.ativo) : null;

  if (currentStatus !== Boolean(payload.ativo)) {
    return NextResponse.json({
      error: "O banco nao permitiu alterar o acesso. Verifique a policy de update da tabela usuarios.",
    }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
