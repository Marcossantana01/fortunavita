"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import logo from "../assets/img/logo.png";

const serviceOptions = [
  {
    description: "Diagnostico financeiro e direcionamento para decidir com clareza.",
    href: "/consultoria",
    title: "Consultoria",
  },
  {
    description: "Plano financeiro para organizar metas, patrimonio e proximos passos.",
    href: "/planejamento",
    title: "Planejamento",
  },
  {
    description: "Estrategia para investir com criterio, seguranca e visao de longo prazo.",
    href: "/investimentos",
    title: "Investimentos",
  },
];

function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function getNavbarOffset() {
    if (typeof window !== "undefined" && window.innerWidth <= 760) {
      return 68;
    }

    return document.querySelector(".navbar")?.getBoundingClientRect().height ?? 0;
  }

  function handleSectionClick(event, sectionId) {
    event.preventDefault();
    closeMenu();

    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    const target = document.getElementById(sectionId);

    if (target) {
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        getNavbarOffset();

      window.history.pushState(null, "", `/#${sectionId}`);
      window.scrollTo({ behavior: "smooth", top });
    }
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg w-100 px-3 py-3"
        style={{
          background: "linear-gradient(135deg, #0B0F14, #1A2230)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          left: 0,
          position: "fixed",
          top: 0,
          zIndex: 9999,
        }}
      >
        <Link
          href="/"
          className="d-flex align-items-center"
          aria-label="Fortuna Vita"
        >
          <img
            src={logo.src}
            alt="Fortuna Vita"
            style={{ height: "45px" }}
          />
        </Link>

        <button
          className="navbar-toggler d-lg-none"
          aria-controls="menu"
          aria-expanded={isMenuOpen}
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen((current) => !current)}
          style={{ border: "2px solid #D4AF37" }}
          type="button"
        >
          <span
            className="navbar-toggler-icon"
            style={{
              filter:
                "invert(72%) sepia(45%) saturate(500%) hue-rotate(5deg)",
            }}
          />
        </button>

        <div
          className={
            isMenuOpen
              ? "collapse navbar-collapse justify-content-center show"
              : "collapse navbar-collapse justify-content-center"
          }
          id="menu"
        >
          <ul className="navbar-nav gap-lg-4 text-center w-100">
            <li>
              <Link
                className="nav-link text-light"
                href="/#inicio"
                onClick={(event) =>
                  handleSectionClick(event, "inicio")
                }
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                className="nav-link text-light"
                href="/#sobre"
                onClick={(event) =>
                  handleSectionClick(event, "sobre")
                }
              >
                Sobre nos
              </Link>
            </li>

            <li>
              <Link
                className="nav-link text-light"
                href="/#metodologia"
                onClick={(event) =>
                  handleSectionClick(event, "metodologia")
                }
              >
                Metodologia
              </Link>
            </li>

            <li>
              <Link
                className="nav-link text-light"
                href="/#especialidades"
                onClick={(event) =>
                  handleSectionClick(event, "especialidades")
                }
              >
                Especialidades
              </Link>
            </li>

            <li>
              <Link
                className="nav-link text-light"
                href="/#depoimentos"
                onClick={(event) =>
                  handleSectionClick(event, "depoimentos")
                }
              >
                Depoimentos
              </Link>
            </li>

            <li className="d-flex justify-content-center">
              <button
                className="nav-link text-light services-modal-trigger text-center"
                onClick={() => {
                  closeMenu();
                  setIsServicesOpen(true);
                }}
                type="button"
              >
                Serviços
              </button>
            </li>

            <li>
              <Link
                className="nav-link text-light"
                href="/#contato"
                onClick={(event) =>
                  handleSectionClick(event, "contato")
                }
              >
                Contato
              </Link>
            </li>

            <li className="mt-3 d-lg-none">
              <Link
                href="/login"
                className="btn w-100"
                onClick={closeMenu}
                style={{
                  backgroundColor: "#d4a017",
                  color: "#fff",
                }}
              >
                Entrar
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-none d-lg-block">
          <Link
            href="/login"
            className="btn"
            onClick={closeMenu}
            style={{
              backgroundColor: "#d4a017",
              borderRadius: "6px",
              color: "#fff",
              padding: "10px 20px",
            }}
          >
            Entrar
          </Link>
        </div>
      </nav>

      {isServicesOpen ? (
        <div className="services-modal-backdrop" role="presentation">
          <section
            className="services-modal"
            aria-modal="true"
            role="dialog"
            aria-labelledby="services-modal-title"
          >
            <button
              className="services-modal-close"
              aria-label="Fechar serviços"
              onClick={() => setIsServicesOpen(false)}
              type="button"
            >
              x
            </button>

            <span>Serviços Fortuna Vita</span>

            <h2 id="services-modal-title">
              Escolha a area que deseja conhecer
            </h2>

            <p>
              Direcione sua visita para a solucao mais alinhada ao seu momento.
            </p>

            <div className="services-modal-grid d-flex d-lg-grid flex-column gap-3">
              {serviceOptions.map((service) => (
                <Link
                  className="services-modal-card"
                  href={service.href}
                  key={service.href}
                  onClick={() => {
                    closeMenu();
                    setIsServicesOpen(false);
                  }}
                >
                  <strong>{service.title}</strong>

                  <small>{service.description}</small>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export default Navbar;