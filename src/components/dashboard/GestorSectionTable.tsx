"use client";

import { useEffect, useMemo, useState } from "react";
import type { GestorSectionData } from "@/services/gestorSectionData";

type GestorSectionTableProps = {
  maxRowsWhenIdle?: number;
  section: GestorSectionData;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function GestorSectionTable({ maxRowsWhenIdle, section }: GestorSectionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const rows = useMemo(() => {
    const search = normalize(searchTerm.trim());

    if (!search) {
      return maxRowsWhenIdle ? section.rows.slice(0, maxRowsWhenIdle) : section.rows;
    }

    return section.rows.filter((row) => normalize(row.join(" ")).includes(search));
  }, [maxRowsWhenIdle, searchTerm, section.rows]);

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
          {rows.length > 0 ? rows.map((row, rowIndex) => (
            <tr key={`${section.title}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${section.title}-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          )) : (
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
