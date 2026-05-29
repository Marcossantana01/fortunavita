function DashboardActivity() {
  const activities = [
    {
      title: "Novo lead cadastrado",
      time: "há 5 minutos",
      color: "#3b82f6",
    },

    {
      title: "Cliente fechou contrato",
      time: "há 20 minutos",
      color: "#22c55e",
    },

    {
      title: "Reunião agendada",
      time: "há 1 hora",
      color: "#f97316",
    },

    {
      title: "Pagamento recebido",
      time: "há 2 horas",
      color: "#8b5cf6",
    },

    {
      title: "Novo usuário criado",
      time: "há 4 horas",
      color: "#d4b06a",
    },
  ];

  return (
    <div
      className="bg-white border rounded-4 h-100 d-flex flex-column overflow-hidden"
      style={{
        padding: "16px",
        borderColor: "#eef1f5",
      }}
    >
      {/* HEADER */}
      <div className="flex-shrink-0 mb-2">

        <h5
          style={{
            margin: 0,
            fontWeight: "700",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          Atividades Recentes
        </h5>

        <small
          style={{
            color: "#7b8190",
            fontSize: "11px",
          }}
        >
          Últimas movimentações do sistema
        </small>

      </div>

      {/* LIST */}
      <div
        className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden"
      >
        {activities.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-2"
            style={{
              minHeight: "42px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: item.color,
                flexShrink: 0,
              }}
            />

            <div className="overflow-hidden">

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </p>

              <small
                style={{
                  color: "#7b8190",
                  fontSize: "11px",
                }}
              >
                {item.time}
              </small>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardActivity;