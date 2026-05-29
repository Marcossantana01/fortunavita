"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

type ClientRegisterFormProps = {
  initialValues: {
    consultor_id: string;
    cpf: string;
    data_nascimento: string;
    documentos: string;
    email: string;
    estado_civil: string;
    clienteId: string;
    leadId: string;
    nome: string;
    objetivo: string;
    observacoes: string;
    patrimonio: string;
    profissao: string;
    renda_mensal: string;
    telefone: string;
  };
};

const requiredDocuments = [
  "Foto do CPF",
  "Foto do RG ou CNH",
  "Comprovante de residencia",
  "Comprovante de renda",
  "Certidao de estado civil",
  "Declaracao de imposto de renda",
];

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

export default function ClientRegisterForm({ initialValues }: ClientRegisterFormProps) {
  const router = useRouter();
  const [cpf, setCpf] = useState(formatCpfInput(initialValues.cpf));
  const [cpfError, setCpfError] = useState("");
  const [documents, setDocuments] = useState(initialValues.documentos);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [patrimonio, setPatrimonio] = useState(formatCurrencyInput(initialValues.patrimonio || "0"));
  const [rendaMensal, setRendaMensal] = useState(formatCurrencyInput(initialValues.renda_mensal || "0"));
  const savedDocuments = documents
    .split("\n")
    .map((document) => document.trim())
    .filter(Boolean)
    .map((document) => {
      const separatorIndex = document.indexOf(": http");

      if (separatorIndex < 0) {
        return { name: document, url: "" };
      }

      return {
        name: document.slice(0, separatorIndex).trim(),
        url: document.slice(separatorIndex + 2).trim(),
      };
    });
  const savedDocumentNames = savedDocuments.map((document) => document.name.toLowerCase());

  async function uploadDocuments(): Promise<string> {
    const selectedDocuments = Object.entries(files);

    if (selectedDocuments.length === 0) {
      return documents;
    }

    const formData = new FormData();

    formData.set("clienteId", initialValues.clienteId || initialValues.leadId || "novo-cliente");
    selectedDocuments.forEach(([, file]) => formData.append("files", file));

    const response = await fetch("/api/consultor/clientes/documentos", {
      body: formData,
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error ?? "Nao foi possivel enviar os documentos.");
    }

    const uploadedDocuments = Array.isArray(data.documents)
      ? data.documents.map((document: { url: string }, index: number) => {
          const [documentLabel] = selectedDocuments[index] ?? [];

          return `${documentLabel}: ${document.url}`;
        })
      : [];

    return [documents, ...uploadedDocuments].filter(Boolean).join("\n");
  }

  function handleFilesChange(documentLabel: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFiles((currentFiles) => ({
      ...currentFiles,
      [documentLabel]: file,
    }));
  }

  function isDocumentUploaded(documentLabel: string): boolean {
    return savedDocumentNames.some((name) => name.includes(documentLabel.toLowerCase()));
  }

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

    let uploadedDocuments = documents;

    try {
      uploadedDocuments = await uploadDocuments();
      setDocuments(uploadedDocuments);
    } catch (uploadError) {
      setIsLoading(false);
      setError(uploadError instanceof Error ? uploadError.message : "Nao foi possivel enviar os documentos.");
      return;
    }

    const response = await fetch("/api/consultor/clientes", {
      body: JSON.stringify({
        clienteId: initialValues.clienteId,
        consultor_id: initialValues.consultor_id,
        cpf: formData.get("cpf"),
        data_nascimento: formData.get("data_nascimento"),
        documentos: uploadedDocuments,
        email: formData.get("email"),
        estado_civil: formData.get("estado_civil"),
        leadId: initialValues.leadId,
        nome: formData.get("nome"),
        objetivo: formData.get("objetivo"),
        observacoes: formData.get("observacoes"),
        patrimonio: formData.get("patrimonio"),
        profissao: formData.get("profissao"),
        renda_mensal: formData.get("renda_mensal"),
        telefone: formData.get("telefone"),
      }),
      headers: { "Content-Type": "application/json" },
      method: initialValues.clienteId ? "PATCH" : "POST",
    });
    const data = await response.json().catch(() => ({}));

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel cadastrar o cliente.");
      return;
    }

    router.push("/consultor/clientes");
    router.refresh();
  }

  return (
    <form className="client-register-form" onSubmit={handleSubmit}>
      <div className="client-register-grid">
        <label>
          Nome completo
          <input defaultValue={initialValues.nome} name="nome" required type="text" />
        </label>
        <label>
          Telefone
          <input defaultValue={initialValues.telefone} name="telefone" required type="tel" />
        </label>
        <label>
          E-mail
          <input defaultValue={initialValues.email} name="email" type="email" />
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
          <input defaultValue={initialValues.data_nascimento} name="data_nascimento" type="date" />
        </label>
        <label>
          Estado civil
          <select name="estado_civil" defaultValue={initialValues.estado_civil}>
            <option value="">Selecione</option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viuvo(a)</option>
          </select>
        </label>
        <label>
          Profissao
          <input defaultValue={initialValues.profissao} name="profissao" type="text" />
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
          <select name="objetivo" defaultValue={initialValues.objetivo}>
            <option value="">Selecione</option>
            <option value="Consultoria">Consultoria</option>
            <option value="Consorcio">Consorcio</option>
            <option value="Seguro">Seguro</option>
            <option value="Plano de saude">Plano de saude</option>
          </select>
        </label>
      </div>

      <label>
        Observacoes
        <textarea defaultValue={initialValues.observacoes} name="observacoes" />
      </label>

      <div className="client-register-field">
        <span>Documentos</span>
        <div className="document-checklist">
          {requiredDocuments.map((documentLabel) => {
            const inputId = `document-${documentLabel.replace(/\s+/g, "-").toLowerCase()}`;
            const selectedFile = files[documentLabel];
            const isUploaded = isDocumentUploaded(documentLabel);

            return (
              <div className="document-checklist-row" key={documentLabel}>
                <div>
                  <strong>{documentLabel}</strong>
                  <small>
                    {isUploaded
                      ? "Documento enviado"
                      : selectedFile
                        ? selectedFile.name
                        : "Adicionar arquivo"}
                  </small>
                </div>
                <input
                  id={inputId}
                  onChange={(event) => handleFilesChange(documentLabel, event)}
                  type="file"
                />
                <label
                  className={`document-checklist-action ${isUploaded ? "is-uploaded" : ""}`}
                  htmlFor={inputId}
                  title={isUploaded ? "Documento enviado" : "Anexar documento"}
                >
                  <i className={`bi ${isUploaded ? "bi-check2-circle" : "bi-paperclip"}`} aria-hidden="true" />
                </label>
              </div>
            );
          })}
        </div>
        {savedDocuments.length > 0 ? (
          <div className="document-saved-list">
            <strong>Documentos salvos</strong>
            {savedDocuments.map((document) => (
              document.url ? (
                <a href={document.url} key={`${document.name}-${document.url}`} rel="noreferrer" target="_blank">
                  <i className="bi bi-file-earmark-check" aria-hidden="true" />
                  {document.name}
                </a>
              ) : (
                <span key={document.name}>
                  <i className="bi bi-file-earmark-check" aria-hidden="true" />
                  {document.name}
                </span>
              )
            ))}
          </div>
        ) : null}
      </div>

      {error ? <span className="client-register-error">{error}</span> : null}

      <div className="client-register-actions">
        <button className="client-register-secondary" onClick={() => router.back()} type="button">
          Cancelar
        </button>
        <button className="client-register-primary" disabled={isLoading} type="submit">
          {isLoading ? "Salvando..." : initialValues.clienteId ? "Salvar alteracoes" : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
