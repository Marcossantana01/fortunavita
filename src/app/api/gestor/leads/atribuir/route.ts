import { NextResponse } from "next/server";
import { updateSupabaseRows } from "@/services/supabaseClient";

type AssignLeadsPayload = {
  consultorId?: string;
  leadIds?: string[];
};

export async function PATCH(request: Request) {
  const payload = await request.json() as AssignLeadsPayload;
  const consultorId = payload.consultorId?.trim();
  const leadIds = Array.from(new Set(payload.leadIds ?? [])).filter(Boolean);

  if (!consultorId) {
    return NextResponse.json({ error: "Selecione um consultor." }, { status: 400 });
  }

  if (leadIds.length === 0) {
    return NextResponse.json({ error: "Selecione pelo menos um lead." }, { status: 400 });
  }

  for (const leadId of leadIds) {
    const result = await updateSupabaseRows("leads", { id: leadId }, {
      consultor_id: consultorId,
      status: "em_atendimento",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, updated: leadIds.length });
}
