"use client";

import Navbar from "@/components/Navbar";
import Contato from "@/components/Contato";

import {
  FaBullseye,
  FaChartPie,
  FaSearchDollar,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";

import banner from "@/assets/img/banner3.png";

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

export default function Planejamento() {
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

          background: `
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
                  Planejamento
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(2.1rem, 6vw, 3.2rem)",
                  }}
                >
                  Financeiro
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
                Estratégias inteligentes para proteger, organizar e expandir seu
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
                Construímos planos financeiros personalizados para decisões mais
                seguras, crescimento sustentável e estabilidade patrimonial.
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
          padding: "86px 0",
          background: "#F5F5F5",
        }}
      >
        <div className="container text-center">

          <h2 style={titleStyle}>
            Diferenciais Estratégicos
          </h2>

          <p
            style={subtitleStyle}
          >
            Cada decisão é construída com análise técnica, visão estratégica e
            foco em crescimento sustentável.
          </p>

          <div className="row g-4 justify-content-center">

            <CardWhite
              icon={<FaSearchDollar />}
              title="Diagnóstico de Precisão"
              desc="Análise completa da sua estrutura financeira e patrimonial."
            />

            <CardWhite
              icon={<FaBullseye />}
              title="Visão de Longo Prazo"
              desc="Estratégias sustentáveis para crescimento consistente."
            />

            <CardWhite
              icon={<FaShieldAlt />}
              title="Sigilo e Estratégia"
              desc="Atendimento reservado e altamente estratégico."
            />

          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        style={{
          padding: "86px 0",
          background: "#fff",
        }}
      >
        <div className="container text-center">

          <h2 style={titleStyle}>
            Como funciona nosso planejamento
          </h2>

          <p
            style={subtitleStyle}
          >
            Um processo estruturado para transformar complexidade financeira em
            clareza estratégica.
          </p>

          <div className="row g-4 justify-content-center">

            <CardWhite
              icon={<FaSearchDollar />}
              title="01 Diagnóstico"
              desc="Analisamos sua estrutura financeira atual."
            />

            <CardWhite
              icon={<FaBullseye />}
              title="02 Estratégia"
              desc="Criamos metas e estratégias personalizadas."
            />

            <CardWhite
              icon={<FaChartPie />}
              title="03 Implementação"
              desc="Aplicamos o plano financeiro com precisão."
            />

            <CardWhite
              icon={<FaChartPie />}
              title="04 Monitoramento"
              desc="Acompanhamos resultados e ajustes."
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
            Por que escolher a Fortuna Vita
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
            Estratégia, independência e acompanhamento premium para proteger e
            expandir seu patrimônio.
          </p>

          <div className="row g-4 justify-content-center">

            <CardDark
              icon={<FaBullseye />}
              title="Independência"
              desc="Sem conflitos de interesse nas recomendações."
            />

            <CardDark
              icon={<FaShieldAlt />}
              title="Proteção"
              desc="Blindagem patrimonial com visão estratégica."
            />

            <CardDark
              icon={<FaChartPie />}
              title="Crescimento"
              desc="Foco em expansão patrimonial sustentável."
            />

            <CardDark
              icon={<FaLock />}
              title="Exclusividade"
              desc="Atendimento personalizado e altamente estratégico."
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
