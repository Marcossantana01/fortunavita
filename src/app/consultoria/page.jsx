"use client";

import Navbar from "@/components/Navbar";
import Contato from "@/components/Contato";
import banner from "@/assets/img/banner2.png";

import {
  FaChartBar,
  FaChartLine,
  FaLock,
  FaBrain,
  FaBullseye,
  FaCogs,
  FaChartPie,
} from "react-icons/fa";

/* PADRÃO TIPOGRAFIA */
const titleStyle = {
  fontSize: "clamp(30px, 2.8vw, 48px)",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "14px",
  lineHeight: "1.2",
  textAlign: "center",
  letterSpacing: "-1px",
};

const subtitleStyle = {
  maxWidth: "760px",
  margin: "auto",
  color: "#6b7280",
  lineHeight: "1.8",
  fontSize: "18px",
  fontWeight: "400",
  textAlign: "center",
};

export default function Consultoria() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="d-flex align-items-center text-white"
        style={{
          minHeight: "100vh",
          paddingTop: "140px",
          paddingBottom: "80px",

          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(2, 6, 14, 0.96) 0%,
              rgba(2, 6, 14, 0.88) 35%,
              rgba(2, 6, 14, 0.45) 60%,
              rgba(2, 6, 14, 0.15) 100%
            ),
            url(${banner.src})
          `,

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">

          <div className="row align-items-center">

            <div className="col-12 col-lg-6">

              {/* TITULO */}
              <div className="mb-4">

                <h1
                  className="fw-bold text-white mb-2"
                  style={{
                    fontSize: "clamp(40px, 5vw, 56px)",
                    lineHeight: "0.95",
                    letterSpacing: "-3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Consultoria Patrimonial
                </h1>

                <h2
                  className="fw-semibold text-warning mb-0"
                  style={{
                    fontSize: "clamp(20px, 6vw, 56px)",
                    lineHeight: "1",
                    letterSpacing: "-2px",
                  }}
                >
                  Estratégica
                </h2>

              </div>

              {/* SUBTITULO */}
              <h3
                className="fw-normal text-light mb-4"
                style={{
                  fontSize: "clamp(18px, 2vw, 24px)",
                  lineHeight: "1.7",
                  maxWidth: "560px",
                }}
              >
                Clareza tática para decisões de alta complexidade.
              </h3>

              {/* TEXTO */}
              <p
                className="mb-5"
                style={{
                  color: "#b7bec8",
                  fontSize: "clamp(15px, 1.1vw, 17px)",
                  lineHeight: "2",
                  maxWidth: "520px",
                }}
              >
                Transformamos dados em inteligência estratégica para decisões
                financeiras com precisão, proteção patrimonial e crescimento
                sustentável.
              </p>

              {/* BOTÕES */}
              <div className="d-flex flex-column flex-md-row gap-3 w-100">

                <button
                  onClick={() =>
                    window.open("https://wa.me/5511962075007", "_blank")
                  }
                  className="
                    btn
                    btn-warning
                    fw-semibold
                    rounded-3
                    w-100
                  "
                  style={{
                    height: "56px",
                    fontSize: "15px",
                  }}
                >
                  Falar com especialista
                </button>

                <button
                  className="
                    btn
                    btn-outline-light
                    rounded-3
                    w-100
                  "
                  style={{
                    height: "56px",
                    fontSize: "15px",
                  }}
                >
                  Conheça nossa metodologia
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section
        style={{
          padding: "90px 0",
          background: "#f8f9fb",
        }}
      >
        <div className="container">

          <div className="mb-5">

            <h2 style={titleStyle}>
              Diferenciais Estratégicos
            </h2>

            <p style={subtitleStyle}>
              Cada decisão é construída com análise técnica,
              visão estratégica e foco em crescimento sustentável.
            </p>

          </div>

          <div className="row g-4 justify-content-center">

            <CardWhite
              icon={<FaChartBar />}
              title="Diagnóstico de Precisão"
              desc="Análise completa da sua estrutura financeira e patrimonial."
            />

            <CardWhite
              icon={<FaChartLine />}
              title="Visão de Longo Prazo"
              desc="Estratégias sustentáveis para crescimento consistente."
            />

            <CardWhite
              icon={<FaLock />}
              title="Sigilo e Estratégia"
              desc="Atendimento reservado e altamente estratégico."
            />

          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        style={{
          padding: "100px 0",
          background: "#fff",
        }}
      >
        <div className="container">

          <div className="mb-5">

            <h2 style={titleStyle}>
              Como funciona nossa consultoria
            </h2>

            <p style={subtitleStyle}>
              Um processo estruturado para transformar complexidade
              financeira em clareza estratégica.
            </p>

          </div>

          <div className="row g-4">

            <CardWhite
              icon={<FaBrain />}
              title="01 Análise"
              desc="Entendemos sua realidade financeira e seus objetivos."
            />

            <CardWhite
              icon={<FaBullseye />}
              title="02 Estratégia"
              desc="Criamos um plano personalizado e eficiente."
            />

            <CardWhite
              icon={<FaCogs />}
              title="03 Execução"
              desc="Aplicamos as estratégias com precisão técnica."
            />

            <CardWhite
              icon={<FaChartPie />}
              title="04 Acompanhamento"
              desc="Monitoramos continuamente seus resultados."
            />

          </div>
        </div>
      </section>

      {/* POR QUE ESCOLHER */}
      <section
        style={{
          padding: "100px 0",
          background: "#050b14",
          color: "#fff",
        }}
      >
        <div className="container">

          <div className="mb-5">

            <h2
              style={{
                ...titleStyle,
                color: "#fff",
              }}
            >
              Por que escolher a Fortuna Vita
            </h2>

            <p
              style={{
                ...subtitleStyle,
                color: "#9ca3af",
              }}
            >
              Independência, estratégia e acompanhamento de alto nível
              para proteger e expandir seu patrimônio.
            </p>

          </div>

          <div className="row g-4">

            <CardDark
              icon={<FaChartLine />}
              title="Experiência"
              desc="Quase duas décadas de atuação no mercado."
            />

            <CardDark
              icon={<FaBullseye />}
              title="Independência"
              desc="Sem conflitos de interesse nas recomendações."
            />

            <CardDark
              icon={<FaChartPie />}
              title="Resultados"
              desc="Foco em crescimento patrimonial sustentável."
            />

            <CardDark
              icon={<FaLock />}
              title="Confidencialidade"
              desc="Sigilo absoluto em todas as etapas."
            />

          </div>
        </div>
      </section>

      <Contato />
    </>
  );
}

/* CARD BRANCO */
function CardWhite({ icon, title, desc }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="h-100"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "35px 25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            color: "#D4AF37",
            marginBottom: "22px",
          }}
        >
          {icon}
        </div>

        <h4
          style={{
            fontSize: "18px",
            marginBottom: "16px",
            color: "#111",
            fontWeight: "700",
            lineHeight: "1.4",
          }}
        >
          {title}
        </h4>

        <p
          style={{
            color: "#666",
            lineHeight: "1.8",
            marginBottom: 0,
            fontSize: "15px",
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

/* CARD ESCURO */
function CardDark({ icon, title, desc }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className="h-100"
        style={{
          background: "linear-gradient(180deg, #0b1726 0%, #09121d 100%)",
          borderRadius: "22px",
          padding: "40px 30px",
          border: "1px solid rgba(212,175,55,0.12)",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            color: "#D4AF37",
            marginBottom: "24px",
          }}
        >
          {icon}
        </div>

        <h5
          style={{
            color: "#fff",
            marginBottom: "18px",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          {title}
        </h5>

        <p
          style={{
            color: "#aeb7c2",
            lineHeight: "1.9",
            marginBottom: 0,
            fontSize: "17px",
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}