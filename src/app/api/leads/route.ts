import { NextResponse } from "next/server";
import { insertSupabaseRow } from "@/services/supabaseClient";

type LeadPayload = {
  email?: string;
  interesse?: string;
  mensagem?: string;
  nome?: string;
  origem?: string;
  telefone?: string;
};

function clean(value?: string): string {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const payload = await request.json() as LeadPayload;
  const nome = clean(payload.nome);
  const telefone = clean(payload.telefone);
  const email = clean(payload.email);
  const interesse = clean(payload.interesse);
  const mensagem = clean(payload.mensagem);

  if (!nome || !telefone) {
    return NextResponse.json({ error: "Informe nome e telefone." }, { status: 400 });
  }

  const result = await insertSupabaseRow("leads", {
    email: email || null,
    interesse: interesse || "Consultoria financeira",
    mensagem: mensagem || null,
    nome,
    origem: clean(payload.origem) || "site",
    prioridade: "media",
    status: "novo",
    telefone,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
