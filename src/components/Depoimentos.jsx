"use client";

import { useState, useEffect } from "react";

const dados = [
  {
    texto:
      "A consultoria do Cássio é incrível, muito humana e alinhada ao momento de vida. Me ajudou a ter consciência do meu potencial, organizar minhas finanças e tomar decisões com segurança.",
    nome: "João Silva",
  },
  {
    texto:
      "Ter o acompanhamento fez toda diferença. Hoje tenho clareza, organização e segurança para crescer meu patrimônio com estratégia.",
    nome: "Mariana Costa",
  },
  {
    texto:
      "Mais do que organização, me fez acreditar no meu potencial. Hoje sigo confiante, com direcionamento e evolução constante.",
    nome: "Daiane Oliveira",
  },
  {
    texto:
      "Foi fundamental para minha mudança financeira. Hoje tenho tranquilidade, crescimento e muito mais segurança no futuro.",
    nome: "Fernanda F. Cuba",
  },
];

const loop = [...dados, ...dados];

function Depoimentos() {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isMobile ? 100 : 33.33;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (index >= dados.length) {
      setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 500);

      setTimeout(() => {
        setTransition(true);
      }, 50);
    }
  }, [index]);

  return (
    <div
      id="depoimentos"
      style={{
        padding: "100px 0",
        background: "#F7F7F7",
        overflow: "hidden",
      }}
    >
      <div className="container text-center">
        <h2>O que nossos clientes dizem</h2>

        <p style={{ color: "#777", marginBottom: "50px" }}>
          Histórias reais de quem confiou na nossa estratégia.
        </p>

        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              transform: `translateX(-${index * cardWidth}%)`,
              transition: transition ? "0.5s" : "none",
            }}
          >
            {loop.map((item, i) => {
              const isHover = hoverIndex === i;

              return (
                <div
                  key={i}
                  style={{
                    minWidth: `${cardWidth}%`,
                    padding: "10px",
                    transition: "0.3s",
                  }}
                >
                  <div
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "30px",
                      boxShadow: isHover
                        ? "0 10px 30px rgba(0,0,0,0.15)"
                        : "0 5px 20px rgba(0,0,0,0.05)",
                      transform: isHover ? "scale(1.05)" : "scale(1)",
                      height: isHover ? "auto" : "220px",
                      overflow: "hidden",
                      transition: "0.3s",
                    }}
                  >
                    <div style={{ color: "#D4AF37" }}>★★★★★</div>

                    <p style={{ fontSize: "14px", color: "#555" }}>
                      {isHover
                        ? item.texto
                        : item.texto.slice(0, 100) + "..."}
                    </p>

                    <strong>{item.nome}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Depoimentos;