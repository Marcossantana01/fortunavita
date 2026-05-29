import { NextResponse } from "next/server";
import { insertSupabaseRow } from "@/services/supabaseClient";

type TicketPayload = {
  assunto?: string;
  categoria?: string;
  descricao?: string;
  prioridade?: string;
  solicitante_nome?: string;
};

function clean(value?: string): string {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const payload = await request.json() as TicketPayload;
  const assunto = clean(payload.assunto);
  const descricao = clean(payload.descricao);

  if (!assunto || !descricao) {
    return NextResponse.json({ error: "Informe assunto e descricao." }, { status: 400 });
  }

  const result = await insertSupabaseRow("chamados", {
    assunto,
    categoria: clean(payload.categoria) || "sistema",
    descricao,
    prioridade: clean(payload.prioridade) || "media",
    solicitante_nome: clean(payload.solicitante_nome) || "Gestor",
    status: "aberto",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
