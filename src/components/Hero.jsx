"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import banner from "../assets/img/banner.png";

function Hero() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <section className="home-hero-mobile" id="inicio">
        <div className="home-hero-mobile-copy">
          <h1>
            Seu projeto de vida <br />e o nosso norte.
          </h1>

          <h2>
            Nossa independencia <br />e a sua seguranca.
          </h2>

          <p>
            Consultoria financeira independente para quem busca clareza,
            estrategia e liberdade.
          </p>

          <div className="home-hero-actions">
            <button onClick={() => router.push("/cadastro")} type="button">
              Falar com especialista <FaWhatsapp />
            </button>

            <button onClick={() => router.push("/cadastro")} type="button">
              Conheca nossa metodologia <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "90px 5% 120px",
        color: "#fff",
        backgroundImage: `url(${banner.src})`,
        backgroundSize: "cover",
        backgroundPosition: "95% 40%",
      }}
    >
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "52px" }}>
          Seu projeto de vida <br />e o nosso norte.
        </h1>

        <h2 style={{ color: "#D4AF37", fontSize: "38px" }}>
          Nossa independencia <br />e a sua seguranca.
        </h2>

        <p>
          Consultoria financeira independente para quem busca clareza,
          estrategia e liberdade.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => router.push("/cadastro")}
            style={{
              backgroundColor: "#D4AF37",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              color: "#000",
              cursor: "pointer",
            }}
            type="button"
          >
            Falar com especialista <FaWhatsapp />
          </button>

          <button
            onClick={() => router.push("/cadastro")}
            style={{
              background: "transparent",
              border: "1px solid #fff",
              padding: "12px 20px",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer",
            }}
            type="button"
          >
            Conheca nossa metodologia <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;