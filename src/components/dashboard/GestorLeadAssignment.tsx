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

export default function GestorLeadAssignment({
  consultores,
  interests,
  leads,
}: GestorLeadAssignmentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [consultorId, setConsultorId] = useState("");
  const [error, setError] = useState("");
  const [interestFilter, setInterestFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const filteredLeads = useMemo(() => {
    const normalizedQuery = normalize(query);

    return leads.filter((lead) => {
      const matchesInterest = interestFilter === "todos" || lead.interesse === interestFilter;
      const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
      const matchesQuery = !normalizedQuery || normalize(`${lead.nome} ${lead.telefone} ${lead.origem}`).includes(normalizedQuery);

      return matchesInterest && matchesStatus && matchesQuery;
    });
  }, [interestFilter, leads, query, statusFilter]);
  const statusOptions = Array.from(new Set(leads.map((lead) => lead.status).filter(Boolean))).sort();
  const selectedVisibleCount = filteredLeads.filter((lead) => selectedIds.includes(lead.id)).length;

  function selectFirst(quantity: number) {
    setSelectedIds(filteredLeads.slice(0, quantity).map((lead) => lead.id));
  }

  function toggleLead(leadId: string) {
    setSelectedIds((currentIds) => (
      currentIds.includes(leadId)
        ? currentIds.filter((id) => id !== leadId)
        : [...currentIds, leadId]
    ));
  }

  function toggleVisibleLeads() {
    const visibleIds = filteredLeads.map((lead) => lead.id);
    const hasSelectedAllVisible = visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((currentIds) => (
      hasSelectedAllVisible
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleIds]))
    ));
  }

  async function assignSelectedLeads() {
    setError("");

    const response = await fetch("/api/gestor/leads/atribuir", {
      body: JSON.stringify({ consultorId, leadIds: selectedIds }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel atribuir os leads.");
      return;
    }

    setSelectedIds([]);
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
          <select onChange={(event) => setInterestFilter(event.target.value)} value={interestFilter}>
            <option value="todos">Todos</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
            <option value="todos">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Enviar para
          <select onChange={(event) => setConsultorId(event.target.value)} value={consultorId}>
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
        <button onClick={toggleVisibleLeads} type="button">Selecionar visiveis</button>
        {[10, 20, 30, 50, 100].map((quantity) => (
          <button key={quantity} onClick={() => selectFirst(quantity)} type="button">
            {quantity}
          </button>
        ))}
        <span>{selectedIds.length} selecionado(s) | {selectedVisibleCount} nesta lista</span>
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
            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <input
                    checked={selectedIds.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)}
                    type="checkbox"
                  />
                </td>
                <td>{lead.nome}</td>
                <td>{lead.origem}</td>
                <td>{lead.interesse}</td>
                <td>{lead.telefone}</td>
                <td>{lead.status}</td>
                <td>{lead.motivoNaoFechou}</td>
                <td>{lead.consultorNome}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8}>Nenhum lead encontrado para os filtros selecionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
