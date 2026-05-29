import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

function Contato() {
  return (
    <div id="contato" style={{ background: "#0B0F14", color: "#fff" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0B0F14, #1A2230)",
          padding: "40px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
          <div>
            <h4 style={{ marginBottom: "10px" }}>
              Vamos conversar sobre o seu projeto de vida?
            </h4>

            <p style={{ color: "#aaa", margin: 0 }}>
              Deixe seu interesse e nossa equipe entrara em contato para entender seu momento e objetivos.
            </p>
          </div>

          <Link
            href="/cadastro"
            style={{
              background: "#D4AF37",
              padding: "12px 22px",
              borderRadius: "6px",
              fontWeight: "600",
              color: "#000",
              textDecoration: "none",
            }}
          >
            Cadastrar
          </Link>
        </div>
      </div>

      <div style={{ padding: "60px 20px" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 style={{ color: "#D4AF37" }}>FORTUNA VITA</h5>

              <p style={{ color: "#aaa" }}>
                Consultoria financeira independente para quem busca estrategia, protecao e liberdade para viver o melhor da vida.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <FaLinkedin />
                <FaInstagram />
              </div>
            </div>

            <div className="col-md-2 mb-4">
              <h6>Navegacao</h6>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <Link href="/#inicio" style={{ color: "#aaa" }}>Inicio</Link>
                </li>
                <li>
                  <Link href="/#sobre" style={{ color: "#aaa" }}>Sobre nos</Link>
                </li>
                <li>
                  <Link href="/#metodologia" style={{ color: "#aaa" }}>Metodologia</Link>
                </li>
                <li>
                  <Link href="/#especialidades" style={{ color: "#aaa" }}>Especialidades</Link>
                </li>
                <li>
                  <Link href="/#depoimentos" style={{ color: "#aaa" }}>Depoimentos</Link>
                </li>
                <li>
                  <Link href="/#contato" style={{ color: "#aaa" }}>Contato</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h6>Especialidades</h6>
              <ul style={{ listStyle: "none", padding: 0, color: "#aaa" }}>
                <li>Aquisicao Inteligente de Bens</li>
                <li>Gestao e Crescimento Patrimonial</li>
                <li>Blindagem de Legado</li>
                <li>Engenharia Financeira de Credito</li>
                <li>Otimizacao de Resultados</li>
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h6>Contato</h6>

              <p style={{ color: "#aaa" }}>(11) 96207-5007</p>
              <p style={{ color: "#aaa" }}>
                relacionamento@fortunavita.com.br
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              marginTop: "40px",
              paddingTop: "20px",
              color: "#777",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <span>2026 Fortuna Vita</span>
            <span>Politica de Privacidade - Termos de Uso</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;
