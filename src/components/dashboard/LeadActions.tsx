"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type LeadActionsProps = {
  leadId: string;
  leadName: string;
  onLost?: (leadId: string) => void;
};

export default function LeadActions({ leadId, leadName, onLost }: LeadActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function updateLead(action: "close" | "lost", reason?: string) {
    setError("");

    const response = await fetch("/api/consultor/leads", {
      body: JSON.stringify({ action, id: leadId, reason }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel salvar.");
      return;
    }

    setIsModalOpen(false);
    if (action === "lost") {
      onLost?.(leadId);
    }
    startTransition(() => router.refresh());
  }

  function handleLostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reason = String(formData.get("reason") ?? "").trim();

    void updateLead("lost", reason);
  }

  return (
    <>
      <div className="lead-actions">
        <button
          className="lead-action-button lead-action-close"
          disabled={isPending || !leadId}
          onClick={() => router.push(`/consultor/clientes/cadastro?leadId=${encodeURIComponent(leadId)}`)}
          type="button"
        >
          Fechar venda
        </button>
        <button
          className="lead-action-button lead-action-lost"
          disabled={isPending || !leadId}
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          type="button"
        >
          Nao fechou
        </button>
      </div>

      {isModalOpen ? (
        <div className="lead-modal-backdrop" role="presentation">
          <form className="lead-modal" onSubmit={handleLostSubmit}>
            <div>
              <h3>Por que nao fechou?</h3>
              <p>{leadName}</p>
            </div>
            <textarea
              autoFocus
              minLength={5}
              name="reason"
              placeholder="Ex: Cliente achou caro, pediu retorno futuro ou fechou com concorrente."
              required
            />
            {error ? <span className="lead-modal-error">{error}</span> : null}
            <div className="lead-modal-actions">
              <button
                className="lead-modal-secondary"
                disabled={isPending}
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button className="lead-modal-primary" disabled={isPending} type="submit">
                Salvar justificativa
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {!isModalOpen && error ? <span className="lead-action-error">{error}</span> : null}
    </>
  );
}
