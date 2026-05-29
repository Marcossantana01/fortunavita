const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export type SupabaseRow = Record<string, unknown>;

type SupabaseFetchOptions = {
  count?: boolean;
  filters?: Record<string, string | number | boolean>;
  limit?: number;
  order?: string;
  revalidate?: number;
  select?: string;
};

function getSupabaseHeaders(extraHeaders?: HeadersInit): HeadersInit {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    ...extraHeaders,
  };
}

export async function fetchSupabaseRows(
  table: string,
  options: SupabaseFetchOptions = {},
): Promise<SupabaseRow[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const params = new URLSearchParams({
    select: options.select ?? "*",
  });

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  if (options.order) {
    params.set("order", options.order);
  }

  Object.entries(options.filters ?? {}).forEach(([key, value]) => {
    params.set(key, `eq.${String(value)}`);
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${params}`, {
    ...(options.revalidate === 0
      ? { cache: "no-store" as const }
      : { next: { revalidate: options.revalidate ?? 30 } }),
    headers: getSupabaseHeaders(),
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function countSupabaseRows(
  table: string,
  filters: Record<string, string | number | boolean> = {},
  revalidate = 30,
): Promise<number> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 0;
  }

  const params = new URLSearchParams({
    select: "*",
  });

  Object.entries(filters).forEach(([key, value]) => {
    params.set(key, `eq.${String(value)}`);
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${params}`, {
    ...(revalidate === 0
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
    headers: getSupabaseHeaders({
      Prefer: "count=exact",
      Range: "0-0",
    }),
  });

  if (!response.ok) {
    return 0;
  }

  const contentRange = response.headers.get("content-range");
  const count = contentRange?.split("/")[1];

  return count ? Number(count) || 0 : 0;
}

export async function insertSupabaseRow(
  table: string,
  values: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, error: "Supabase nao configurado." };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    body: JSON.stringify(values),
    cache: "no-store",
    headers: getSupabaseHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();

    return { ok: false, error: error || "Nao foi possivel criar o registro." };
  }

  return { ok: true };
}

export async function updateSupabaseRows(
  table: string,
  filters: Record<string, string | number | boolean>,
  values: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, error: "Supabase nao configurado." };
  }

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    params.set(key, `eq.${String(value)}`);
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${params}`, {
    body: JSON.stringify(values),
    cache: "no-store",
    headers: getSupabaseHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    method: "PATCH",
  });

  if (!response.ok) {
    const error = await response.text();

    return { ok: false, error: error || "Nao foi possivel atualizar o registro." };
  }

  return { ok: true };
}
