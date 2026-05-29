function DashboardSchedule() {
  const schedules = [
    {
      time: "09:00",
      title: "Reunião com cliente",
      type: "Online",
    },
    {
      time: "11:30",
      title: "Análise de investimentos",
      type: "Financeiro",
    },
    {
      time: "14:00",
      title: "Follow-up de leads",
      type: "CRM",
    },
    {
      time: "16:30",
      title: "Atualização de contratos",
      type: "Administrativo",
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
            color: "#041C4A",
          }}
        >
          Agenda
        </h5>

        <small
          style={{
            color: "#7c8196",
            fontSize: "11px",
          }}
        >
          Próximos compromissos
        </small>

      </div>

      {/* LIST */}
      <div
        className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden"
      >
        {schedules.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "#f5f7fb",
              padding: "10px 12px",
              borderRadius: "12px",
              minHeight: "58px",
            }}
          >
            <div className="overflow-hidden">

              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#041C4A",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </p>

              <small
                style={{
                  color: "#7c8196",
                  fontSize: "11px",
                }}
              >
                {item.type}
              </small>

            </div>

            <div
              style={{
                backgroundColor: "#C9A45C",
                color: "#ffffff",
                padding: "6px 10px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              {item.time}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSchedule;