import {
  FaBalanceScale,
  FaBullseye,
  FaAward,
  FaChartLine,
  FaGem,
} from "react-icons/fa";

function Porque() {
  return (
    <div
      id="sobre"
      style={{
        padding: "100px 0",
        background: "#F9F9F9",
        textAlign: "center",
      }}
      className="py-5"
    >
      <div className="container">
        <h2 className="mb-2">
          Por que escolher a Fortuna Vita?
        </h2>

        <p className="text-muted mb-5 px-2">
          Nossa consultoria vai além do óbvio. Entregamos clareza, estratégia e independência.
        </p>

        <div className="row g-4 justify-content-center">
          <Card
            icon={<FaBalanceScale />}
            title="Independência e Isenção"
            desc="Não temos exclusividade com bancos. Nosso compromisso é com você."
          />

          <Card
            icon={<FaBullseye />}
            title="Metodologia Life-Centric"
            desc="Seus objetivos são o centro de toda estratégia."
          />

          <Card
            icon={<FaAward />}
            title="16 Anos de Curadoria"
            desc="Experiência para selecionar as melhores oportunidades."
          />

          <Card
            icon={<FaChartLine />}
            title="Alavancagem e Proteção"
            desc="Estratégias inteligentes para crescimento e segurança."
          />

          <Card
            icon={<FaGem />}
            title="Atendimento Boutique"
            desc="Atendimento próximo, personalizado e estratégico."
          />
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl">
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "25px 15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
          height: "100%",
        }}
        className="text-center"
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
            fontSize: "22px",
            margin: "0 auto 15px",
          }}
        >
          {icon}
        </div>

        <h3 style={{ fontSize: "15px" }} className="mb-2">
          {title}
        </h3>

        <p style={{ fontSize: "13px" }} className="text-muted">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default Porque;