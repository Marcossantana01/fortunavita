"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fortuna-vita:last-chance-seen";

function getRegisterLink(trigger) {
  if (typeof window === "undefined") {
    return "/cadastro?origem=ultima-chance";
  }

  const currentPage = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const params = new URLSearchParams({
    gatilho: trigger,
    origem: "ultima-chance",
    pagina: currentPage,
  });

  return `/cadastro?${params.toString()}`;
}

function LastChanceCapture() {
  const [isVisible, setIsVisible] = useState(false);
  const [trigger, setTrigger] = useState("movimento");
  const registerLink = useMemo(() => getRegisterLink(trigger), [trigger]);

  useEffect(() => {
    if (typeof window === "undefined" || sessionStorage.getItem(STORAGE_KEY)) {
      return undefined;
    }

    let interactionCount = 0;
    let idleTimerId;
    const startedAt = Date.now();

    function showOffer(nextTrigger) {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        return;
      }

      setTrigger(nextTrigger);
      setIsVisible(true);
      sessionStorage.setItem(STORAGE_KEY, "shown");
    }

    function resetIdleTimer() {
      window.clearTimeout(idleTimerId);
      idleTimerId = window.setTimeout(() => showOffer("inatividade"), 42000);
    }

    function handleInteraction() {
      interactionCount += 1;
      resetIdleTimer();

      if (interactionCount >= 6 && Date.now() - startedAt > 18000) {
        showOffer("navegacao");
      }
    }

    function handleMouseLeave(event) {
      if (event.clientY <= 8 && Date.now() - startedAt > 7000) {
        showOffer("saida");
      }
    }

    function handleScroll() {
      handleInteraction();

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) {
        return;
      }

      const progress = window.scrollY / scrollableHeight;
      if (progress > 0.58 && Date.now() - startedAt > 9000) {
        showOffer("rolagem");
      }
    }

    resetIdleTimer();
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      window.clearTimeout(idleTimerId);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  function closeOffer() {
    setIsVisible(false);
  }

  function handleRegisterClick() {
    sessionStorage.setItem(STORAGE_KEY, "converted");
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="last-chance-capture" aria-label="Oferta de cadastro">
      <button className="last-chance-close" aria-label="Fechar oferta" onClick={closeOffer} type="button">
        x
      </button>
      <span className="last-chance-kicker">Ultima chance</span>
      <h2>Ganhe uma analise inicial gratuita</h2>
      <p>
        Antes de sair, deixe seus dados e receba um primeiro direcionamento para organizar seu planejamento financeiro.
      </p>
      <a className="last-chance-link" href={registerLink} onClick={handleRegisterClick}>
        Quero minha analise
      </a>
      <small>Sem compromisso. Um especialista entra em contato com voce.</small>
    </aside>
  );
}

export default LastChanceCapture;
