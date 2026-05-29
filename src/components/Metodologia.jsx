import Link from "next/link";

const steps = [
  {
    desc: "Entendemos sua realidade, seus objetivos e suas prioridades de vida.",
    number: "1",
    title: "Diagnostico Profundo",
  },
  {
    desc: "Desenhamos a estrategia personalizada para alcancar seus objetivos.",
    number: "2",
    title: "Planejamento Estrategico",
  },
  {
    desc: "Selecionamos as melhores oportunidades do mercado para voce.",
    number: "3",
    title: "Curadoria Tecnica",
  },
  {
    desc: "Monitoramos, ajustamos e evoluimos sua estrategia constantemente.",
    number: "4",
    title: "Acompanhamento Continuo",
  },
];

function Metodologia() {
  return (
    <section id="metodologia" className="methodology-section">
      <div className="container">
        <div className="methodology-layout">
          <div className="methodology-copy">
            <span>Nossa metodologia</span>
            <h2>Um processo claro para resultados extraordinarios</h2>
            <p>
              Nosso metodo exclusivo garante que cada decisao financeira esteja alinhada ao seu projeto de vida.
            </p>

            <Link href="/cadastro">
              Entenda nosso processo
            </Link>
          </div>

          <div className="methodology-steps">
            {steps.map((step) => (
              <article className="methodology-step" key={step.number}>
                <strong>{step.number}</strong>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Metodologia;
