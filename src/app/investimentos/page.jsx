"use client";

import Navbar from "@/components/Navbar";
import Contato from "@/components/Contato";

import {
  FaChartLine,
  FaShieldAlt,
  FaCoins,
  FaBullseye,
  FaLock,
  FaChartPie,
} from "react-icons/fa";

import banner from "@/assets/img/banner4.png";

const titleStyle = {
  fontSize: "32px",
  fontWeight: "400",
  color: "#000000",
  marginBottom: "10px",
  lineHeight: "1.25",
  textAlign: "center",
  letterSpacing: "0",
};

const subtitleStyle = {
  color: "#6B7280",
  fontSize: "16px",
  lineHeight: "1.55",
  maxWidth: "720px",
  margin: "0 auto 58px",
  textAlign: "center",
};

export default function Investimentos() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="position-relative overflow-hidden"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",

          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(2,6,15,0.96) 0%,
              rgba(2,6,15,0.92) 45%,
              rgba(2,6,15,0.72) 65%,
              rgba(2,6,15,0.55) 100%
            ),
            url(${banner.src})
          `,

          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center right",
          backgroundColor: "#020611",

          paddingTop: "110px",
          paddingBottom: "90px",
        }}
      >
        {/* OVERLAY MOBILE */}
        <div
          className="d-block d-lg-none position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "#020611",
            zIndex: 1,
          }}
        />

        <div
          className="container position-relative"
          style={{
            zIndex: 2,
          }}
        >
          <div className="row align-items-center">

            <div className="col-lg-7">

              <h1
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  lineHeight: "0.92",
                  marginBottom: "18px",
                  letterSpacing: "-3px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(2.3rem, 7vw, 3.8rem)",
                    paddingBottom: "10px",
                  }}
                >
                  Estratégia de
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(2.1rem, 6vw, 3.2rem)",
                    color: "#D4AF37",
                  }}
                >
                  Investimentos
                </span>

              </h1>

              <h2
                style={{
                  color: "#D4AF37",
                  fontSize: "clamp(0.95rem, 2vw, 1rem)",
                  fontWeight: "600",
                  lineHeight: "1.8",
                  maxWidth: "560px",
                  marginBottom: "18px",
                }}
              >
                Investimentos inteligentes para proteger e acelerar seu
                patrimônio.
              </h2>

              <p
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(0.95rem, 2vw, 1rem)",
                  lineHeight: "1.9",
                  maxWidth: "560px",
                  marginBottom: "34px",
                }}
              >
                Construímos estratégias personalizadas com foco em crescimento
                sustentável, gestão de risco e alta performance patrimonial.
              </p>

              {/* BOTÕES */}
              <div
                className="d-flex flex-column flex-md-row gap-3 w-100"
                style={{
                  maxWidth: "560px",
                }}
              >

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
                    fontSize: "0.92rem",
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
                    fontSize: "0.92rem",
                  }}
                >
                  Conheça nossa estratégia
                </button>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section
        style={{
          padding: "86px 0",
          background: "#F5F5F5",
        }}
      >
        <div className="container text-center">

          <h2 style={titleStyle}>
            Diferenciais em Investimentos
          </h2>

          <p
            style={subtitleStyle}
          >
            Estratégias construídas para preservar capital e gerar crescimento
            consistente.
          </p>

          <div className="row g-4 justify-content-center">

            <CardWhite
              icon={<FaChartLine />}
              title="Alta Performance"
              desc="Estratégias focadas em crescimento patrimonial sustentável."
            />

            <CardWhite
              icon={<FaShieldAlt />}
              title="Controle de Risco"
              desc="Proteção inteligente para diferentes cenários econômicos."
            />

            <CardWhite
              icon={<FaCoins />}
              title="Diversificação"
              desc="Distribuição estratégica para maior segurança financeira."
            />

          </div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section
        style={{
          padding: "86px 0",
          background: "#fff",
        }}
      >
        <div className="container text-center">

          <h2 style={titleStyle}>
            Como estruturamos seus investimentos
          </h2>

          <p
            style={subtitleStyle}
          >
            Um processo estratégico para maximizar resultados e reduzir riscos.
          </p>

          <div className="row g-4 justify-content-center">

            <CardWhite
              icon={<FaBullseye />}
              title="01 Perfil"
              desc="Identificamos seus objetivos e tolerância a risco."
            />

            <CardWhite
              icon={<FaChartPie />}
              title="02 Estratégia"
              desc="Criamos uma carteira personalizada."
            />

            <CardWhite
              icon={<FaChartLine />}
              title="03 Execução"
              desc="Implementamos os investimentos com inteligência."
            />

            <CardWhite
              icon={<FaShieldAlt />}
              title="04 Gestão"
              desc="Monitoramento contínuo e ajustes estratégicos."
            />

          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section
        style={{
          padding: "86px 0",
          background: "#020611",
        }}
      >
        <div className="container text-center">

          <h2
            style={{
              ...titleStyle,
              color: "#fff",
            }}
          >
            Por que investir com a Fortuna Vita
          </h2>

          <p
            style={{
              color: "#9CA3AF",
              fontSize: "16px",
              maxWidth: "700px",
              margin: "0 auto 58px",
              lineHeight: "1.55",
            }}
          >
            Estratégias exclusivas para proteger patrimônio e acelerar
            resultados.
          </p>

          <div className="row g-4 justify-content-center">

            <CardDark
              icon={<FaBullseye />}
              title="Estratégia"
              desc="Planejamento alinhado aos seus objetivos."
            />

            <CardDark
              icon={<FaLock />}
              title="Segurança"
              desc="Gestão patrimonial com foco em proteção."
            />

            <CardDark
              icon={<FaChartLine />}
              title="Crescimento"
              desc="Expansão patrimonial sustentável e consistente."
            />

            <CardDark
              icon={<FaCoins />}
              title="Exclusividade"
              desc="Atendimento premium e personalizado."
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
    <div className="col-lg-3 col-md-6">

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "25px 18px",
          height: "100%",
          border: "1px solid #ECECEC",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
        }}
      >

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#1E293B",
            color: "#D4AF37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "22px",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            color: "#000000",
            fontSize: "15px",
            fontWeight: "400",
            lineHeight: "1.28",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#6B7280",
            lineHeight: "1.45",
            fontSize: "13px",
            margin: 0,
            textAlign: "center",
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
    <div className="col-lg-3 col-md-6">

      <div
        style={{
          background: "#07101F",
          borderRadius: "12px",
          padding: "28px 22px",
          height: "100%",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#0F172A",
            color: "#D4AF37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "22px",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: "400",
            lineHeight: "1.28",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#9CA3AF",
            lineHeight: "1.45",
            fontSize: "13px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {desc}
        </p>

      </div>
    </div>
  );
}
