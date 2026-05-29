"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import logo from "@/assets/img/logo.png";

function normalizeOrigin(value: string): string {
  const normalized = value.toLowerCase().trim();

  if (normalized.includes("instagram") || normalized === "ig") return "instagram";
  if (normalized.includes("facebook") || normalized === "fb") return "facebook";
  if (normalized.includes("tiktok") || normalized === "tt") return "tiktok";
  if (normalized.includes("google")) return "google";

  return normalized || "site";
}

function getLeadOrigin(searchParams: ReturnType<typeof useSearchParams>): string {
  const urlOrigin = searchParams.get("origem")
    ?? searchParams.get("utm_source")
    ?? searchParams.get("source");

  if (urlOrigin) {
    return normalizeOrigin(urlOrigin);
  }

  if (typeof document !== "undefined") {
    return normalizeOrigin(document.referrer);
  }

  return "site";
}

function CadastroContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      body: JSON.stringify({
        email: formData.get("email"),
        interesse: formData.get("interesse"),
        mensagem: formData.get("mensagem"),
        nome: formData.get("nome"),
        origem: getLeadOrigin(searchParams),
        telefone: formData.get("telefone"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel enviar seu cadastro.");
      return;
    }

    event.currentTarget.reset();
    setSuccess(true);
  }

  return (
    <main className="lead-register-page">
      <section className="lead-register-panel">
        <div className="lead-register-copy">
          <Link href="/cadastro" className="lead-register-brand" aria-label="Fortuna Vita">
            <img src={logo.src} alt="Fortuna Vita" />
          </Link>
          <h1>Fale com um especialista</h1>
          <p>
            Preencha seus dados para que nossa equipe entenda seu momento e indique o melhor caminho.
          </p>
        </div>

        <form className="lead-register-form" onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input name="nome" placeholder="Seu nome" required type="text" />
          </label>

          <label>
            Telefone
            <input name="telefone" placeholder="+55 11 99999-9999" required type="tel" />
          </label>

          <label>
            E-mail
            <input name="email" placeholder="voce@email.com" type="email" />
          </label>

          <label>
            Interesse
            <select name="interesse" defaultValue="Consultoria financeira">
              <option>Consultoria financeira</option>
              <option>Planejamento financeiro</option>
              <option>Gestao patrimonial</option>
              <option>Investimentos</option>
              <option>Consultoria empresarial</option>
            </select>
          </label>

          <label>
            Mensagem
            <textarea name="mensagem" placeholder="Conte rapidamente o que voce procura." />
          </label>

          {error ? <span className="lead-register-error">{error}</span> : null}
          {success ? <span className="lead-register-success">Cadastro recebido. Em breve entraremos em contato.</span> : null}

          <button disabled={isLoading} type="submit">
            {isLoading ? "Enviando..." : "Enviar cadastro"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroContent />
    </Suspense>
  );
}
