import { NextResponse } from "next/server";
import { fetchSupabaseRows, insertSupabaseRow, updateSupabaseRows } from "@/services/supabaseClient";

type InternalMessagePayload = {
  area_destino?: string;
  area_origem?: string;
  assunto?: string;
  id?: string;
  mensagem?: string;
  resposta?: string;
  respondido_por?: string;
  remetente_nome?: string;
  remetente_tipo?: string;
  status?: string;
  titulo?: string;
};

function clean(value?: string): string {
  return String(value ?? "").trim();
}

export async function GET() {
  const rows = await fetchSupabaseRows("comunicacao_interna", {
    limit: 80,
    order: "created_at.asc",
  });

  return NextResponse.json({ messages: rows });
}

export async function POST(request: Request) {
  const payload = await request.json() as InternalMessagePayload;
  const areaDestino = clean(payload.area_destino);
  const areaOrigem = clean(payload.area_origem);
  const mensagem = clean(payload.mensagem);
  const remetenteNome = clean(payload.remetente_nome);
  const titulo = clean(payload.titulo);

  if (!areaDestino || !areaOrigem || !titulo || !mensagem || !remetenteNome) {
    return NextResponse.json({ error: "Informe origem, destino, titulo, remetente e mensagem." }, { status: 400 });
  }

  const result = await insertSupabaseRow("comunicacao_interna", {
    area_destino: areaDestino,
    area_origem: areaOrigem,
    assunto: clean(payload.assunto) || "Comunicacao interna",
    mensagem,
    remetente_nome: remetenteNome,
    remetente_tipo: clean(payload.remetente_tipo) || areaOrigem,
    status: "aberta",
    titulo,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const payload = await request.json() as InternalMessagePayload;
  const id = clean(payload.id);
  const resposta = clean(payload.resposta);
  const status = clean(payload.status) || "em andamento";

  if (!id) {
    return NextResponse.json({ error: "Requisicao invalida." }, { status: 400 });
  }

  if (!resposta) {
    return NextResponse.json({ error: "Informe a resposta da requisicao." }, { status: 400 });
  }

  const result = await updateSupabaseRows("comunicacao_interna", { id }, {
    respondido_em: new Date().toISOString(),
    respondido_por: clean(payload.respondido_por) || "Sistema",
    resposta,
    status,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
