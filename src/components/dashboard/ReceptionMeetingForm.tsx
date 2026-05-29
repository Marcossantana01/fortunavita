"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type MeetingConsultant = {
  email: string;
  id: string;
  nome: string;
};

type ReceptionMeetingFormProps = {
  consultores: MeetingConsultant[];
};

export default function ReceptionMeetingForm({ consultores }: ReceptionMeetingFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/recepcao/agendamentos", {
      body: JSON.stringify({
        consultor_id: formData.get("consultor_id"),
        data_agendamento: formData.get("data_agendamento"),
        hora_inicio: formData.get("hora_inicio"),
        local: formData.get("local"),
        observacoes: formData.get("observacoes"),
        pessoa: formData.get("pessoa"),
        telefone: formData.get("telefone"),
        tipo: formData.get("tipo"),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel agendar a reuniao.");
      return;
    }

    event.currentTarget.reset();
    setIsOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <>
      <button className="dashboard-card-action" onClick={() => setIsOpen(true)} type="button">
        Nova reuniao
      </button>

      {isOpen ? (
        <div className="lead-modal-backdrop" role="presentation">
          <form className="lead-modal reception-meeting-form" onSubmit={handleSubmit}>
            <div>
              <h3>Nova reuniao</h3>
              <p>Agende o atendimento e direcione para o consultor responsavel.</p>
            </div>

            <div className="reception-meeting-grid">
              <label>
                Pessoa
                <input name="pessoa" placeholder="Nome do cliente ou contato" required type="text" />
              </label>
              <label>
                Telefone
                <input name="telefone" placeholder="+55 11 99999-9999" type="tel" />
              </label>
              <label>
                Data
                <input name="data_agendamento" required type="date" />
              </label>
              <label>
                Horario
                <input name="hora_inicio" required type="time" />
              </label>
              <label>
                Tipo
                <select name="tipo" defaultValue="reuniao">
                  <option value="reuniao">Reuniao</option>
                  <option value="retorno">Retorno</option>
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </label>
              <label>
                Consultor
                <select name="consultor_id" defaultValue="">
                  <option value="">Selecione</option>
                  {consultores.map((consultor) => (
                    <option key={consultor.id} value={consultor.id}>
                      {consultor.nome} - {consultor.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Local ou link
              <input name="local" placeholder="Online, sala, endereco ou link da reuniao" type="text" />
            </label>

            <label>
              Observacoes
              <textarea name="observacoes" placeholder="Pontos importantes para o consultor." />
            </label>

            {error ? <span className="lead-modal-error">{error}</span> : null}

            <div className="lead-modal-actions">
              <button className="lead-modal-secondary" disabled={isPending} onClick={() => setIsOpen(false)} type="button">
                Cancelar
              </button>
              <button className="lead-modal-primary" disabled={isPending} type="submit">
                Salvar reuniao
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
