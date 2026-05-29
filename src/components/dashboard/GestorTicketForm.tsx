"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function GestorTicketForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/gestor/chamados", {
      body: JSON.stringify({
        assunto: formData.get("assunto"),
        categoria: formData.get("categoria"),
        descricao: formData.get("descricao"),
        prioridade: formData.get("prioridade"),
        solicitante_nome: "Gestor",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel abrir o chamado.");
      return;
    }

    event.currentTarget.reset();
    startTransition(() => router.refresh());
  }

  return (
    <section className="dashboard-card gestor-ticket-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Abrir chamado</h2>
          <p>Registre demandas operacionais, problemas de acesso ou solicitações ao suporte.</p>
        </div>
      </div>
      <form className="support-ticket-form" onSubmit={submitTicket}>
        <input name="assunto" placeholder="Assunto" required type="text" />
        <div className="support-ticket-grid">
          <select name="categoria" defaultValue="sistema">
            <option value="acesso">Acesso</option>
            <option value="lead">Lead ou cliente</option>
            <option value="agenda">Agenda</option>
            <option value="financeiro">Comissao</option>
            <option value="sistema">Sistema</option>
          </select>
          <select name="prioridade" defaultValue="media">
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <textarea name="descricao" placeholder="Descreva o que precisa ser resolvido." required rows={5} />
        {error ? <span className="gestor-leads-error">{error}</span> : null}
        <div className="support-ticket-actions">
          <button disabled={isPending} type="submit">Abrir chamado</button>
        </div>
      </form>
    </section>
  );
}
