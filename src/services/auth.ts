export type UsuarioTipo =
  | "administrador"
  | "gestor"
  | "consultor"
  | "recepcao"
  | "financeiro";

export type UsuarioLogado = {
  id: string;
  nome: string;
  email: string;
  tipo: UsuarioTipo;
  foto_url?: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const tipoRoutes: Record<UsuarioTipo, string> = {
  administrador: "/admin",
  consultor: "/consultor",
  financeiro: "/financeiro",
  gestor: "/gestor",
  recepcao: "/recepcao",
};

function normalizeTipo(tipo: string): UsuarioTipo | null {
  const normalized = tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    normalized === "administrador" ||
    normalized === "gestor" ||
    normalized === "consultor" ||
    normalized === "recepcao" ||
    normalized === "financeiro"
  ) {
    return normalized;
  }

  return null;
}

export function getRouteByUsuarioTipo(tipo: UsuarioTipo): string {
  return tipoRoutes[tipo];
}

export async function loginUsuario(email: string, senha: string): Promise<UsuarioLogado | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/login_usuario`, {
    body: JSON.stringify({
      p_email: email.trim().toLowerCase(),
      p_senha: senha.trim(),
    }),
    cache: "no-store",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  const rows = (Array.isArray(result) ? result : [result]).filter(Boolean) as Array<{
    id: string;
    nome: string;
    email: string;
    tipo: string;
    foto_url?: string | null;
  }>;

  const usuario = rows[0];
  const tipo = usuario ? normalizeTipo(usuario.tipo) : null;

  if (!usuario || !tipo) {
    return null;
  }

  const activeResponse = await fetch(`${supabaseUrl}/rest/v1/usuarios?select=ativo&id=eq.${usuario.id}&limit=1`, {
    cache: "no-store",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!activeResponse.ok) {
    return null;
  }

  const activeRows = await activeResponse.json() as Array<{ ativo?: boolean | null }>;

  if (activeRows[0]?.ativo === false) {
    return null;
  }

  return {
    email: usuario.email,
    foto_url: usuario.foto_url,
    id: usuario.id,
    nome: usuario.nome,
    tipo,
  };
}
