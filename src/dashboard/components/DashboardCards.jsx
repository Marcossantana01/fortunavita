import {
  FiUsers,
  FiUserCheck,
  FiHeart,
  FiDollarSign,
  FiClipboard,
} from "react-icons/fi";

function DashboardCards() {
  const cards = [
    {
      title: "Leads Totais",
      value: "1.250",
      growth: "+12,5% este mês",
      icon: <FiUsers />,
      color: "#d4b06a",
    },

    {
      title: "Clientes Ativos",
      value: "320",
      growth: "+8,3% este mês",
      icon: <FiUserCheck />,
      color: "#6cc070",
    },

    {
      title: "Negociações",
      value: "87",
      growth: "+15,7% este mês",
      icon: <FiHeart />,
      color: "#8b5cf6",
    },

    {
      title: "Faturamento",
      value: "R$ 245.000",
      growth: "+18,6% este mês",
      icon: <FiDollarSign />,
      color: "#3b82f6",
    },

    {
      title: "Tarefas Pendentes",
      value: "23",
      growth: "-5,2% este mês",
      icon: <FiClipboard />,
      color: "#f97316",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="col-12 col-sm-6 col-xl"
        >
          <div
            className="bg-white border h-100"
            style={{
              borderRadius: "18px",
              padding: "14px",
              borderColor: "#eef1f5",
              minHeight: "135px",
            }}
          >
            {/* TOP */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: `${card.color}15`,
                  color: card.color,
                  fontSize: "18px",
                }}
              >
                {card.icon}
              </div>

              <div
                style={{
                  color: "#22c55e",
                  fontSize: "10px",
                  fontWeight: "600",
                }}
              >
                ↗
              </div>
            </div>

            {/* CONTENT */}
            <small
              style={{
                color: "#7b8190",
                fontSize: "11px",
              }}
            >
              {card.title}
            </small>

            <h3
              style={{
                fontWeight: "700",
                margin: "2px 0",
                color: "#111827",
                fontSize: "24px",
                lineHeight: "30px",
              }}
            >
              {card.value}
            </h3>

            <small
              style={{
                color: "#22c55e",
                fontSize: "10px",
                fontWeight: "600",
              }}
            >
              {card.growth}
            </small>
          </div>
        </div>
      ))}
    </>
  );
}

export default DashboardCards;