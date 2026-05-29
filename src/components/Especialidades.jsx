import {
  FaBuilding,
  FaChartLine,
  FaFileInvoiceDollar,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";

const especialidades = [
  {
    desc: "Estrategias para adquirir patrimonio com a melhor condicao financeira.",
    icon: <FaBuilding />,
    title: "Aquisicao Inteligente de Bens",
  },
  {
    desc: "Curadoria de ativos focada em preservacao, crescimento e multiplicacao.",
    icon: <FaChartLine />,
    title: "Gestao e Crescimento Patrimonial",
  },
  {
    desc: "Protecao do patrimonio familiar para proximas geracoes.",
    icon: <FaShieldAlt />,
    title: "Blindagem de Legado",
  },
  {
    desc: "Uso estrategico do credito para acelerar oportunidades com controle.",
    icon: <FaRocket />,
    title: "Engenharia Financeira de Credito",
  },
  {
    desc: "Estruturacao financeira com eficiencia, previsibilidade e leitura tributaria.",
    icon: <FaFileInvoiceDollar />,
    title: "Otimizacao de Resultados",
  },
];

function Especialidades() {
  return (
    <section
      id="especialidades"
      className="specialties-section"
    >
      <div className="specialties-inner">
        <span className="specialties-kicker">Especialidades</span>
        <h2>Nossas especialidades</h2>
        <p>
          Solucoes inteligentes para cada fase da sua jornada financeira, com estrategia,
          protecao e crescimento sustentavel.
        </p>

        <div className="specialties-grid">
          {especialidades.map((item) => (
            <article className="specialty-card" key={item.title}>
              <div className="specialty-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Especialidades;
