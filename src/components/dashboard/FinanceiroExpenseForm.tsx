"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const expenseCategories = [
  "Aluguel do escritorio",
  "Condominio e IPTU",
  "Energia eletrica",
  "Agua e saneamento",
  "Internet e telefone",
  "Folha de pagamento",
  "Comissoes de consultores",
  "Beneficios e encargos",
  "Impostos e taxas",
  "Contabilidade",
  "Juridico e contratos",
  "Marketing e trafego pago",
  "Eventos e networking",
  "Softwares e assinaturas",
  "Sistemas financeiros",
  "Material de escritorio",
  "Equipamentos e tecnologia",
  "Manutencao do escritorio",
  "Limpeza e copa",
  "Seguros",
  "Tarifas bancarias",
  "Viagens e deslocamentos",
  "Treinamentos e certificacoes",
  "Reembolsos",
  "Outras despesas",
];

export default function FinanceiroExpenseForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/financeiro/despesas", {
      body: formData,
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel lancar a despesa.");
      return;
    }

    event.currentTarget.reset();
    setIsOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <>
      <button className="dashboard-card-action" onClick={() => setIsOpen(true)} type="button">
        Inserir gasto
      </button>

      {isOpen ? (
        <div className="lead-modal-backdrop" role="presentation">
          <form className="lead-modal financeiro-expense-form" onSubmit={handleSubmit}>
            <div>
              <h3>Novo gasto</h3>
              <p>Registre despesas administrativas, operacionais, comissoes e contas da consultoria.</p>
            </div>

            <label>
              Descricao
              <input name="descricao" placeholder="Ex.: Conta de luz do escritorio" required type="text" />
            </label>

            <div className="financeiro-expense-grid">
              <label>
                Categoria
                <select name="categoria" defaultValue="Aluguel do escritorio" required>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Valor
                <input min="0" name="valor" placeholder="0,00" required step="0.01" type="number" />
              </label>
              <label>
                Vencimento
                <input name="data_vencimento" required type="date" />
              </label>
              <label>
                Status
                <select name="status" defaultValue="pendente">
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="agendado">Agendado</option>
                </select>
              </label>
              <label>
                Forma de pagamento
                <select name="forma_pagamento" defaultValue="pix">
                  <option value="pix">Pix</option>
                  <option value="boleto">Boleto</option>
                  <option value="cartao">Cartao</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="debito_automatico">Debito automatico</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </label>
              <label>
                Fornecedor
                <input name="fornecedor" placeholder="Empresa, prestador ou favorecido" type="text" />
              </label>
              <label>
                Comprovante
                <input accept=".pdf,image/*" name="comprovante" type="file" />
              </label>
            </div>

            <label>
              Observacoes
              <textarea name="observacoes" placeholder="Detalhes da compra, recorrencia, centro de custo ou comprovante." />
            </label>

            <label>
              Responsavel financeiro
              <input name="responsavel_financeiro" placeholder="Nome de quem lancou ou aprovou" required type="text" />
            </label>

            {error ? <span className="lead-modal-error">{error}</span> : null}

            <div className="lead-modal-actions">
              <button className="lead-modal-secondary" disabled={isPending} onClick={() => setIsOpen(false)} type="button">
                Cancelar
              </button>
              <button className="lead-modal-primary" disabled={isPending} type="submit">
                Salvar gasto
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
