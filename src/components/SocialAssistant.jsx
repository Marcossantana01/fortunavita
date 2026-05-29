"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const initialMessages = [
  {
    from: "assistant",
    text: "Ola, sou a Aurea, consultora virtual da Fortuna Vita. Posso te direcionar para um especialista. Para comecar, qual e o seu nome?",
  },
];

function getWhatsappLink({ email, name, phone }) {
  const text = encodeURIComponent(
    `Ola, sou ${name}. Vim pelo site da Fortuna Vita e quero falar com um especialista. Meu telefone e ${phone} e meu e-mail e ${email}.`,
  );

  return `https://wa.me/5511962075007?text=${text}`;
}

function getInputPlaceholder(step) {
  if (step === "name") {
    return "Digite seu nome...";
  }

  if (step === "email") {
    return "Digite seu e-mail...";
  }

  if (step === "phone") {
    return "Digite seu telefone com DDD...";
  }

  return "Atendimento encaminhado";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasEnoughName(value) {
  return value.replace(/\s+/g, "").length >= 3 && !value.includes("@");
}

function hasEnoughPhone(value) {
  return value.replace(/\D/g, "").length >= 10;
}

function AureaAvatar({ compact = false }) {
  return (
    <span className={compact ? "aurea-avatar is-compact" : "aurea-avatar"} aria-hidden="true">
      <img alt="" src="/aurea-avatar.png" />
    </span>
  );
}

function SocialAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState("name");
  const [lead, setLead] = useState({ email: "", name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const whatsappLink = useMemo(() => getWhatsappLink(lead), [lead]);
  const isFinished = step === "done";
  const placeholder = getInputPlaceholder(step);

  function resetChat() {
    setIsOpen(false);
    setMessages(initialMessages);
    setInputValue("");
    setStep("name");
    setLead({ email: "", name: "", phone: "" });
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isFinished || !isOpen) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      resetChat();
    }, 10000);

    return () => window.clearTimeout(timerId);
  }, [isFinished, isOpen]);

  async function registerLead(nextLead) {
    setIsSubmitting(true);

    await fetch("/api/leads", {
      body: JSON.stringify({
        email: nextLead.email,
        interesse: "Consultoria financeira",
        mensagem: "Lead capturado pela consultora virtual Aurea.",
        nome: nextLead.name,
        origem: "assistente-aurea",
        telefone: nextLead.phone,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => null);

    setIsSubmitting(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const value = inputValue.trim();

    if (!value || isSubmitting || isFinished) {
      return;
    }

    const userMessage = { from: "user", text: value };

    if (step === "name") {
      if (!hasEnoughName(value)) {
        setMessages((current) => [
          ...current,
          {
            from: "assistant",
            text: "Antes do e-mail, preciso saber seu nome para direcionar o atendimento corretamente.",
          },
        ]);
        setInputValue("");
        return;
      }

      const nextLead = { ...lead, name: value };
      setLead(nextLead);
      setMessages((current) => [
        ...current,
        userMessage,
        { from: "assistant", text: `Prazer, ${value}. Agora me informe seu melhor e-mail.` },
      ]);
      setStep("email");
      setInputValue("");
      return;
    }

    if (step === "email") {
      if (!isValidEmail(value)) {
        setMessages((current) => [
          ...current,
          userMessage,
          { from: "assistant", text: "Esse e-mail nao parece valido. Pode conferir e me enviar novamente?" },
        ]);
        setInputValue("");
        return;
      }

      const nextLead = { ...lead, email: value };
      setLead(nextLead);
      setMessages((current) => [
        ...current,
        userMessage,
        {
          from: "assistant",
          text: "Perfeito. Ultimo passo: me envie seu telefone com DDD e ja vou encaminhar voce para um especialista.",
        },
      ]);
      setStep("phone");
      setInputValue("");
      return;
    }

    if (!hasEnoughPhone(value)) {
      setMessages((current) => [
        ...current,
        userMessage,
        { from: "assistant", text: "Me envie um telefone com DDD para o especialista conseguir retornar." },
      ]);
      setInputValue("");
      return;
    }

    const nextLead = { ...lead, phone: value };
    setLead(nextLead);
    setMessages((current) => [
      ...current,
      userMessage,
      {
        from: "assistant",
        text: `Pronto, ${nextLead.name}. Salvei seu atendimento como lead e deixei tudo preparado para o especialista falar com voce.`,
      },
    ]);
    setStep("done");
    setInputValue("");
    await registerLead(nextLead);
  }

  return (
    <div className="social-assistant">
      {isOpen && (
        <section className="social-assistant-window" aria-label="Assistente Aurea">
          <header className="social-assistant-header">
            <AureaAvatar />
            <div>
              <strong>Assistente virtual</strong>
              <small>Consultora virtual Fortuna Vita</small>
            </div>
            <button aria-label="Fechar assistente" onClick={resetChat} type="button">
              x
            </button>
          </header>

          <div className="social-assistant-messages">
            {messages.map((message, index) => (
              <p className={message.from === "user" ? "is-user" : ""} key={`${message.from}-${index}`}>
                {message.text}
              </p>
            ))}

            {isFinished && (
              <a className="social-assistant-link" href={whatsappLink} onClick={resetChat} rel="noreferrer" target="_blank">
                Falar com especialista
              </a>
            )}

            <span ref={messagesEndRef} />
          </div>

          <form className="social-assistant-form" onSubmit={handleSubmit}>
            <input
              disabled={isFinished || isSubmitting}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={placeholder}
              type={step === "email" ? "email" : step === "phone" ? "tel" : "text"}
              value={inputValue}
            />
            <button disabled={isFinished || isSubmitting || !inputValue.trim()} type="submit">
              Enviar
            </button>
          </form>
        </section>
      )}

      <button className="social-assistant-toggle" onClick={() => setIsOpen((open) => !open)} type="button">
        <AureaAvatar compact />
        <strong>Assistente virtual</strong>
      </button>
    </div>
  );
}

export default SocialAssistant;
