import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { insertSupabaseRow } from "@/services/supabaseClient";

type AppointmentPayload = {
  consultor_id?: string;
  data_agendamento?: string;
  hora_inicio?: string;
  local?: string;
  observacoes?: string;
  pessoa?: string;
  telefone?: string;
  tipo?: string;
};

function clean(value?: FormDataEntryValue | string | null): string {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const payload = await request.json() as AppointmentPayload;
  const pessoa = clean(payload.pessoa);
  const dataAgendamento = clean(payload.data_agendamento);
  const horaInicio = clean(payload.hora_inicio);
  const tipo = clean(payload.tipo) || "reuniao";
  const telefone = clean(payload.telefone);
  const local = clean(payload.local);
  const observacoes = clean(payload.observacoes);

  if (!pessoa || !dataAgendamento || !horaInicio) {
    return NextResponse.json({ error: "Informe pessoa, data e horario." }, { status: 400 });
  }

  const localParts = [
    local || "Local a confirmar",
    telefone ? `Contato: ${telefone}` : "",
    observacoes ? `Obs: ${observacoes}` : "",
  ].filter(Boolean);
  const result = await insertSupabaseRow("agendamentos", {
    consultor_id: clean(payload.consultor_id) || null,
    data_agendamento: dataAgendamento,
    hora_inicio: horaInicio,
    local: localParts.join(" | "),
    status: "agendado",
    tipo,
    titulo: `Reuniao - ${pessoa}`,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  revalidatePath("/recepcao");
  revalidatePath("/recepcao/agenda");
  revalidatePath("/recepcao/reunioes");
  revalidatePath("/consultor/agenda");

  return NextResponse.json({ ok: true });
}
