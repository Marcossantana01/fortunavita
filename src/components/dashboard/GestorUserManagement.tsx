"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type GestorUser = {
  ativo: boolean;
  email: string;
  id: string;
  modalidade: string;
  nome: string;
  telefone: string;
  tipo: string;
};

type GestorUserManagementProps = {
  users: GestorUser[];
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function GestorUserManagement({ users }: GestorUserManagementProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const visibleUsers = useMemo(() => {
    const search = normalize(searchTerm.trim());

    if (!search) {
      return users.slice(0, 10);
    }

    return users.filter((user) => normalize(`${user.nome} ${user.email} ${user.telefone} ${user.modalidade}`).includes(search));
  }, [searchTerm, users]);

  useEffect(() => {
    function handleSearch(event: Event) {
      setSearchTerm(String((event as CustomEvent<string>).detail ?? ""));
    }

    window.addEventListener("dashboard-search", handleSearch);

    return () => window.removeEventListener("dashboard-search", handleSearch);
  }, []);

  async function toggleUser(user: GestorUser) {
    setError("");

    const response = await fetch("/api/gestor/usuarios", {
      body: JSON.stringify({
        ativo: !user.ativo,
        email: user.email,
        tipo: user.tipo,
        usuarioId: user.id,
      }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel atualizar o usuario.");
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <section className="dashboard-card gestor-user-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Usuarios e acesso</h2>
          <p>Consulte usuarios e bloqueie acessos quando necessario.</p>
        </div>
        <Link className="dashboard-card-action" href="/gestor/equipe/novo-consultor">
          Novo consultor
        </Link>
      </div>

      {error ? <span className="gestor-leads-error">{error}</span> : null}

      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Modalidade</th>
              <th>Status</th>
              <th>Acesso</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.tipo}</td>
                <td>{user.modalidade || "Nao informado"}</td>
                <td>{user.ativo ? "Ativo" : "Bloqueado"}</td>
                <td>
                  <button
                    aria-label={user.ativo ? "Bloquear usuario" : "Desbloquear usuario"}
                    aria-pressed={!user.ativo}
                    className={`access-toggle${user.ativo ? "" : " is-blocked"}`}
                    disabled={isPending}
                    onClick={() => void toggleUser(user)}
                    type="button"
                  >
                    <span />
                    <em>{user.ativo ? "Liberado" : "Bloqueado"}</em>
                  </button>
                </td>
              </tr>
            ))}
            {visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={6}>Nenhum consultor encontrado para a busca.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
