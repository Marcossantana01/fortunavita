import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { insertSupabaseRow } from "@/services/supabaseClient";

type ExpensePayload = {
  categoria: string;
  comprovante_nome: string;
  data_vencimento: string;
  descricao: string;
  forma_pagamento: string;
  fornecedor: string;
  observacoes: string;
  responsavel_financeiro: string;
  status: string;
  valor: string;
};

function clean(value?: FormDataEntryValue | string | null): string {
  return String(value ?? "").trim();
}

function parseCurrency(value?: string): number {
  const normalized = clean(value).replace(/\./g, "").replace(",", ".");
  const numberValue = Number(normalized);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const comprovante = formData.get("comprovante");
  const payload: ExpensePayload = {
    categoria: clean(formData.get("categoria")),
    comprovante_nome: comprovante instanceof File && comprovante.size > 0 ? comprovante.name : "",
    data_vencimento: clean(formData.get("data_vencimento")),
    descricao: clean(formData.get("descricao")),
    forma_pagamento: clean(formData.get("forma_pagamento")),
    fornecedor: clean(formData.get("fornecedor")),
    observacoes: clean(formData.get("observacoes")),
    responsavel_financeiro: clean(formData.get("responsavel_financeiro")),
    status: clean(formData.get("status")),
    valor: clean(formData.get("valor")),
  };
  const descricao = clean(payload.descricao);
  const categoria = clean(payload.categoria);
  const dataVencimento = clean(payload.data_vencimento);
  const responsavelFinanceiro = clean(payload.responsavel_financeiro);
  const valor = parseCurrency(payload.valor);
  const observacoes = [
    clean(payload.observacoes),
    payload.comprovante_nome ? `Comprovante: ${payload.comprovante_nome}` : "",
  ].filter(Boolean).join(" | ");

  if (!descricao || !categoria || !dataVencimento || !responsavelFinanceiro || valor <= 0) {
    return NextResponse.json({ error: "Informe descricao, categoria, valor, vencimento e responsavel financeiro." }, { status: 400 });
  }

  const status = clean(payload.status) || "pendente";
  const result = await insertSupabaseRow("financeiro", {
    categoria,
    data_pagamento: status === "pago" ? dataVencimento : null,
    data_vencimento: dataVencimento,
    descricao,
    forma_pagamento: clean(payload.forma_pagamento) || "pix",
    fornecedor: clean(payload.fornecedor) || null,
    observacoes: observacoes || null,
    responsavel_financeiro: responsavelFinanceiro,
    status,
    tipo: "despesa",
    valor,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  revalidatePath("/financeiro");
  revalidatePath("/financeiro/despesas");
  revalidatePath("/financeiro/a-pagar");
  revalidatePath("/financeiro/relatorios");

  return NextResponse.json({ ok: true });
}
