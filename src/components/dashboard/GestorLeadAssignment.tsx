"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GestorConsultor, GestorLead } from "@/services/gestorLeadsData";

type GestorLeadAssignmentProps = {
  consultores: GestorConsultor[];
  interests: string[];
  leads: GestorLead[];
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isLeadAssigned(lead: GestorLead): boolean {
  return Boolean(lead.consultorNome && lead.consultorNome !== "Nao atribuido");
}

export default function GestorLeadAssignment({
  consultores,
  interests,
  leads,
}: GestorLeadAssignmentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [consultorId, setConsultorId] = useState("");
  const [redistributeConsultorId, setRedistributeConsultorId] = useState("");
  const [redistributeLead, setRedistributeLead] = useState<GestorLead | null>(
    null,
  );
  const [error, setError] = useState("");
  const [interestFilter, setInterestFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredLeads = useMemo(() => {
    const normalizedQuery = normalize(query);

    return leads.filter((lead) => {
      const matchesInterest =
        interestFilter === "todos" || lead.interesse === interestFilter;
      const matchesStatus =
        statusFilter === "todos" || lead.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        normalize(`${lead.nome} ${lead.telefone} ${lead.origem}`).includes(
          normalizedQuery,
        );

      return matchesInterest && matchesStatus && matchesQuery;
    });
  }, [interestFilter, leads, query, statusFilter]);

  const assignableFilteredLeads = filteredLeads.filter(
    (lead) => !isLeadAssigned(lead),
  );
  const statusOptions = Array.from(
    new Set(leads.map((lead) => lead.status).filter(Boolean)),
  ).sort();
  const selectedVisibleCount = assignableFilteredLeads.filter((lead) =>
    selectedIds.includes(lead.id),
  ).length;

  function selectFirst(quantity: number) {
    setSelectedIds(
      assignableFilteredLeads.slice(0, quantity).map((lead) => lead.id),
    );
  }

  function toggleLead(leadId: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(leadId)
        ? currentIds.filter((id) => id !== leadId)
        : [...currentIds, leadId],
    );
  }

  function toggleVisibleLeads() {
    const visibleIds = assignableFilteredLeads.map((lead) => lead.id);
    const hasSelectedAllVisible = visibleIds.every((id) =>
      selectedIds.includes(id),
    );

    setSelectedIds((currentIds) =>
      hasSelectedAllVisible
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleIds])),
    );
  }

  async function assignLeads(leadIds: string[], targetConsultorId: string) {
    setError("");

    const response = await fetch("/api/gestor/leads/atribuir", {
      body: JSON.stringify({ consultorId: targetConsultorId, leadIds }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel atribuir os leads.");
      return false;
    }

    return true;
  }

  async function assignSelectedLeads() {
    const success = await assignLeads(selectedIds, consultorId);

    if (!success) {
      return;
    }

    setSelectedIds([]);
    startTransition(() => router.refresh());
  }

  async function redistributeSelectedLead() {
    if (!redistributeLead || !redistributeConsultorId) {
      return;
    }

    const success = await assignLeads(
      [redistributeLead.id],
      redistributeConsultorId,
    );

    if (!success) {
      return;
    }

    setRedistributeLead(null);
    setRedistributeConsultorId("");
    startTransition(() => router.refresh());
  }

  return (
    <section className="dashboard-card gestor-leads-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Distribuicao de leads</h2>
          <p>Selecione leads em massa e envie para um consultor.</p>
        </div>
      </div>

      <div className="gestor-leads-toolbar">
        <label>
          Buscar
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome, telefone ou origem"
            type="search"
            value={query}
          />
        </label>

        <label>
          Interesse
          <select
            onChange={(event) => setInterestFilter(event.target.value)}
            value={interestFilter}
          >
            <option value="todos">Todos</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="todos">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Enviar para
          <select
            onChange={(event) => setConsultorId(event.target.value)}
            value={consultorId}
          >
            <option value="">Selecione</option>
            {consultores.map((consultor) => (
              <option key={consultor.id} value={consultor.id}>
                {consultor.nome} - {consultor.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="gestor-leads-bulkbar">
        <button onClick={toggleVisibleLeads} type="button">
          Selecionar visiveis
        </button>

        {[10, 20, 30, 50, 100].map((quantity) => (
          <button
            key={quantity}
            onClick={() => selectFirst(quantity)}
            type="button"
          >
            {quantity}
          </button>
        ))}

        <span>
          {selectedIds.length} selecionado(s) | {selectedVisibleCount} nesta
          lista
        </span>

        <button
          className="gestor-leads-assign"
          disabled={isPending || selectedIds.length === 0 || !consultorId}
          onClick={() => void assignSelectedLeads()}
          type="button"
        >
          Atribuir selecionados
        </button>
      </div>

      {error ? <span className="gestor-leads-error">{error}</span> : null}

      <div className="dashboard-table-wrap">
        <table className="dashboard-table gestor-leads-table">
          <thead>
            <tr>
              <th aria-label="Selecionar" />
              <th>Lead</th>
              <th>Origem</th>
              <th>Interesse</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Motivo</th>
              <th>Consultor atual</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const assigned = isLeadAssigned(lead);

                return (
                  <tr
                    className={
                      assigned
                        ? "table-success gestor-leads-row-assigned"
                        : undefined
                    }
                    key={lead.id}
                  >
                    <td>
                      {assigned ? (
                        <span
                          className="badge rounded-circle bg-success"
                          title="Lead atribuido"
                        >
                          ✓
                        </span>
                      ) : (
                        <input
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          type="checkbox"
                        />
                      )}
                    </td>

                    <td>{lead.nome}</td>
                    <td>{lead.origem}</td>
                    <td>{lead.interesse}</td>
                    <td>{lead.telefone}</td>
                    <td>{lead.status}</td>
                    <td>{lead.motivoNaoFechou}</td>
                    <td>
                      {assigned ? (
                        <button
                          className="btn btn-link p-0 fw-bold text-success text-decoration-none"
                          style={{ fontSize: "10px" }}
                          onClick={() => {
                            setRedistributeLead(lead);
                            setRedistributeConsultorId("");
                          }}
                          title="Clique para redistribuir este lead"
                          type="button"
                        >
                          {lead.consultorNome}
                        </button>
                      ) : (
                        lead.consultorNome
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>
                  Nenhum lead encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {redistributeLead ? (
        <div
          className="modal d-block"
          role="dialog"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redistribuir lead</h5>
                <button
                  aria-label="Fechar"
                  className="btn-close"
                  onClick={() => {
                    setRedistributeLead(null);
                    setRedistributeConsultorId("");
                  }}
                  type="button"
                />
              </div>

              <div className="modal-body">
                <p className="mb-1">
                  <strong>Lead:</strong> {redistributeLead.nome}
                </p>

                <p className="mb-3">
                  <strong>Consultor atual:</strong>{" "}
                  <span className="text-success fw-bold">
                    {redistributeLead.consultorNome}
                  </span>
                </p>

                <label
                  className="form-label fw-bold"
                  htmlFor="redistribute-consultor"
                >
                  Novo consultor
                </label>

                <select
                  className="form-select"
                  id="redistribute-consultor"
                  onChange={(event) =>
                    setRedistributeConsultorId(event.target.value)
                  }
                  value={redistributeConsultorId}
                >
                  <option value="">Selecione</option>
                  {consultores.map((consultor) => (
                    <option key={consultor.id} value={consultor.id}>
                      {consultor.nome} - {consultor.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setRedistributeLead(null);
                    setRedistributeConsultorId("");
                  }}
                  type="button"
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success"
                  disabled={isPending || !redistributeConsultorId}
                  onClick={() => void redistributeSelectedLead()}
                  type="button"
                >
                  Confirmar redistribuicao
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
