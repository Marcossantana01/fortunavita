import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchSupabaseRows, updateSupabaseRows, type SupabaseRow } from "@/services/supabaseClient";

type LeadActionPayload = {
  action?: string;
  id?: string;
  reason?: string;
};

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
const reasonMessageLabel = "Justificativa de nao conversao:";

function getExistingReasonColumn(row: SupabaseRow): string {
  return reasonColumns.find((column) => Object.prototype.hasOwnProperty.call(row, column)) ?? "";
}

function getStringValue(row: SupabaseRow, key: string): string {
  const value = row[key];

  return value === undefined || value === null ? "" : String(value);
}

function appendReasonToMessage(row: SupabaseRow, reason: string): string {
  const currentMessage = getStringValue(row, "mensagem").trim();
  const reasonText = `${reasonMessageLabel} ${reason}`;
  const reasonIndex = currentMessage.indexOf(reasonMessageLabel);

  if (reasonIndex >= 0) {
    return `${currentMessage.slice(0, reasonIndex).trim()}\n\n${reasonText}`.trim();
  }

  return [currentMessage, reasonText].filter(Boolean).join("\n\n");
}

async function getLeadRow(id: string): Promise<SupabaseRow> {
  const rows = await fetchSupabaseRows("leads", {
    filters: { id },
    limit: 1,
  });

  return rows[0] ?? {};
}

function getFriendlyError(error?: string): string {
  if (!error) {
    return "Nao foi possivel salvar.";
  }

  if (error.includes("schema cache") || error.includes("Could not find")) {
    return "A coluna de justificativa nao existe na tabela leads. Crie uma coluna chamada motivo_nao_conversao no Supabase.";
  }

  return error;
}

async function assertLeadStatus(id: string, expectedStatus: string): Promise<boolean> {
  const updatedLead = await getLeadRow(id);

  return getStringValue(updatedLead, "status") === expectedStatus;
}

export async function PATCH(request: Request) {
  const payload = await request.json() as LeadActionPayload;
  const id = payload.id?.trim();

  if (!id) {
    return NextResponse.json({ error: "Lead invalido." }, { status: 400 });
  }

  const lead = await getLeadRow(id);
  const reasonColumn = getExistingReasonColumn(lead);

  if (payload.action === "close") {
    const values: Record<string, unknown> = {
      status: "convertido",
    };

    if (reasonColumn) {
      values[reasonColumn] = null;
    }

    const result = await updateSupabaseRows("leads", { id }, values);

    if (!result.ok) {
      return NextResponse.json({ error: getFriendlyError(result.error) }, { status: 500 });
    }

    if (!await assertLeadStatus(id, "convertido")) {
      return NextResponse.json({
        error: "O banco nao confirmou a conversao do lead. Verifique a permissao de update da tabela leads.",
      }, { status: 500 });
    }

    revalidatePath("/consultor/leads");
    revalidatePath("/gestor/leads");
    revalidatePath("/gestor");

    return NextResponse.json({ ok: true });
  }

  if (payload.action === "lost") {
    const reason = payload.reason?.trim();

    if (!reason) {
      return NextResponse.json({ error: "Informe a justificativa." }, { status: 400 });
    }

    if (!reasonColumn && !Object.prototype.hasOwnProperty.call(lead, "mensagem")) {
      return NextResponse.json({
        error: "Para salvar a justificativa, crie no Supabase a coluna motivo_nao_conversao na tabela leads.",
      }, { status: 500 });
    }

    const values: Record<string, unknown> = {
      status: "recusado",
    };

    if (reasonColumn) {
      values[reasonColumn] = reason;
    } else {
      values.mensagem = appendReasonToMessage(lead, reason);
    }

    const result = await updateSupabaseRows("leads", { id }, values);

    if (!result.ok) {
      return NextResponse.json({ error: getFriendlyError(result.error) }, { status: 500 });
    }

    if (!await assertLeadStatus(id, "recusado")) {
      return NextResponse.json({
        error: "O banco nao confirmou que o lead foi encerrado. Verifique a permissao de update da tabela leads.",
      }, { status: 500 });
    }

    revalidatePath("/consultor/leads");
    revalidatePath("/gestor/leads");
    revalidatePath("/gestor");

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acao invalida." }, { status: 400 });
}
