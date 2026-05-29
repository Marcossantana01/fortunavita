import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const bucketName = "documentos-clientes";

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase nao configurado." }, { status: 500 });
  }

  const formData = await request.formData();
  const clienteId = String(formData.get("clienteId") ?? "novo-cliente");
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ documents: [] });
  }

  const documents = [];

  for (const file of files) {
    const fileName = sanitizeFileName(file.name);
    const path = `${clienteId}/${Date.now()}-${fileName}`;
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${path}`, {
      body: file,
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      method: "POST",
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();

      return NextResponse.json({
        error: error || `Nao foi possivel enviar o arquivo ${file.name}. Verifique o bucket ${bucketName}.`,
      }, { status: 500 });
    }

    documents.push({
      name: file.name,
      path,
      url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`,
    });
  }

  return NextResponse.json({ documents });
}
