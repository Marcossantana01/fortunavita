"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LeadActions from "@/components/dashboard/LeadActions";
import type { ConsultorSectionData } from "@/services/consultorData";

type ConsultorSectionTableProps = {
  section: ConsultorSectionData;
};

const statusClasses = {
  Ganho: "status-won",
  "Em analise": "status-review",
  Pendente: "status-pending",
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ConsultorSectionTable({ section }: ConsultorSectionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenLeadIds, setHiddenLeadIds] = useState<string[]>([]);
  const reasonCellIndex = section.headers.findIndex((header) => header === "Por que nao converteu");
  const filteredRows = useMemo(() => {
    const normalizedSearch = normalize(searchTerm.trim());
    const visibleRows = section.rows.filter((row) => !row.id || !hiddenLeadIds.includes(row.id));

    if (!normalizedSearch) {
      return visibleRows;
    }

    return visibleRows.filter((row) => normalize(row.cells.join(" ")).includes(normalizedSearch));
  }, [hiddenLeadIds, searchTerm, section.rows]);

  useEffect(() => {
    function handleSearch(event: Event) {
      setSearchTerm(String((event as CustomEvent<string>).detail ?? ""));
    }

    window.addEventListener("dashboard-search", handleSearch);

    return () => window.removeEventListener("dashboard-search", handleSearch);
  }, []);

  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            {section.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row, rowIndex) => (
              <tr key={`${section.title}-${row.id ?? rowIndex}`}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    className={cellIndex === reasonCellIndex ? "table-text-cell" : undefined}
                    key={`${section.title}-${rowIndex}-${cellIndex}`}
                  >
                    {cellIndex === (row.statusCellIndex ?? row.cells.length - 1) && row.status ? (
                      <span className={`status-pill ${statusClasses[row.status]}`}>
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                {row.actions === "lead" ? (
                  <td>
                    <LeadActions
                      leadId={row.id ?? ""}
                      leadName={row.cells[0] ?? "Lead"}
                      onLost={(leadId) => setHiddenLeadIds((currentIds) => [...currentIds, leadId])}
                    />
                  </td>
                ) : null}
                {row.actions === "client" ? (
                  <td>
                    <Link
                      className="table-action-link"
                      href={`/consultor/clientes/cadastro?clienteId=${encodeURIComponent(row.id ?? "")}`}
                    >
                      Editar
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={section.headers.length}>
                {searchTerm ? "Nenhum resultado encontrado para a busca." : section.emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
