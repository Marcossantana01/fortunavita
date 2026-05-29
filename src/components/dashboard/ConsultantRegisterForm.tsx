"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const numberValue = Number(digits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(numberValue);
}

function formatCpfInput(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (factor: number) => {
    const total = cpf
      .slice(0, factor - 1)
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0);
    const rest = (total * 10) % 11;

    return rest === 10 ? 0 : rest;
  };

  return calculateDigit(10) === Number(cpf[9]) && calculateDigit(11) === Number(cpf[10]);
}

export default function ConsultantRegisterForm() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [patrimonio, setPatrimonio] = useState(formatCurrencyInput("0"));
  const [rendaMensal, setRendaMensal] = useState(formatCurrencyInput("0"));

  function validateCpfField(value: string): boolean {
    if (value && !isValidCpf(value)) {
      setCpfError("CPF invalido.");
      return false;
    }

    setCpfError("");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    if (!validateCpfField(cpf)) {
      setIsLoading(false);
      setError("Informe um CPF valido.");
      return;
    }

    const response = await fetch("/api/gestor/usuarios", {
      body: JSON.stringify({
        cpf: formData.get("cpf"),
        data_nascimento: formData.get("data_nascimento"),
        email: formData.get("email"),
        estado_civil: formData.get("estado_civil"),
        modalidade_atendimento: formData.get("modalidade_atendimento"),
        nome: formData.get("nome"),
        objetivo: formData.get("objetivo"),
        observacoes: formData.get("observacoes"),
        patrimonio: formData.get("patrimonio"),
        profissao: formData.get("profissao"),
        renda_mensal: formData.get("renda_mensal"),
        senha: formData.get("senha"),
        telefone: formData.get("telefone"),
        tipo: "consultor",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel cadastrar o consultor.");
      return;
    }

    router.push("/gestor/equipe");
    router.refresh();
  }

  return (
    <form className="client-register-form" onSubmit={handleSubmit}>
      <div className="client-register-grid">
        <label>
          Nome completo
          <input name="nome" required type="text" />
        </label>
        <label>
          Telefone
          <input name="telefone" type="tel" />
        </label>
        <label>
          E-mail
          <input name="email" required type="email" />
        </label>
        <label>
          CPF
          <input
            aria-invalid={cpfError ? "true" : "false"}
            className={cpfError ? "field-error" : undefined}
            inputMode="numeric"
            maxLength={14}
            name="cpf"
            onBlur={(event) => validateCpfField(event.target.value)}
            onChange={(event) => {
              const formattedCpf = formatCpfInput(event.target.value);

              setCpf(formattedCpf);
              if (cpfError) {
                validateCpfField(formattedCpf);
              }
            }}
            placeholder="000.000.000-00"
            type="text"
            value={cpf}
          />
          {cpfError ? <small className="field-error-message">{cpfError}</small> : null}
        </label>
        <label>
          Data de nascimento
          <input name="data_nascimento" type="date" />
        </label>
        <label>
          Estado civil
          <select name="estado_civil" defaultValue="">
            <option value="">Selecione</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viuvo(a)</option>
          </select>
        </label>
        <label>
          Profissao
          <input name="profissao" type="text" />
        </label>
        <label>
          Renda mensal
          <div className="money-input-wrap">
            <span>R$</span>
            <input
              inputMode="numeric"
              name="renda_mensal"
              onChange={(event) => setRendaMensal(formatCurrencyInput(event.target.value))}
              placeholder="R$ 0,00"
              type="text"
              value={rendaMensal}
            />
          </div>
        </label>
        <label>
          Patrimonio
          <div className="money-input-wrap">
            <span>R$</span>
            <input
              inputMode="numeric"
              name="patrimonio"
              onChange={(event) => setPatrimonio(formatCurrencyInput(event.target.value))}
              placeholder="R$ 0,00"
              type="text"
              value={patrimonio}
            />
          </div>
        </label>
        <label>
          Objetivo
          <select name="objetivo" defaultValue="">
            <option value="">Selecione</option>
            <option value="Consultoria">Consultoria</option>
            <option value="Consorcio">Consorcio</option>
            <option value="Seguro">Seguro</option>
            <option value="Plano de saude">Plano de saude</option>
          </select>
        </label>
        <label>
          Modalidade de atendimento
          <select name="modalidade_atendimento" defaultValue="online">
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Hibrido</option>
          </select>
        </label>
        <label>
          Perfil
          <input disabled value="Consultor" />
        </label>
        <label>
          Senha inicial
          <input name="senha" required type="text" />
        </label>
      </div>

      <label>
        Observacoes
        <textarea name="observacoes" />
      </label>

      {error ? <span className="client-register-error">{error}</span> : null}

      <div className="client-register-actions">
        <button className="client-register-secondary" onClick={() => router.back()} type="button">
          Cancelar
        </button>
        <button className="client-register-primary" disabled={isLoading} type="submit">
          {isLoading ? "Salvando..." : "Cadastrar consultor"}
        </button>
      </div>
    </form>
  );
}
