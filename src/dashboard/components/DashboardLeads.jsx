function DashboardLeads() {
  const data = [
    {
      name: "Indicação",
      value: "35%",
      total: "(438)",
      color: "#D4AF63",
    },

    {
      name: "Instagram",
      value: "25%",
      total: "(313)",
      color: "#4A90E2",
    },

    {
      name: "Site",
      value: "20%",
      total: "(250)",
      color: "#8B7CF6",
    },

    {
      name: "Facebook",
      value: "10%",
      total: "(125)",
      color: "#7E57C2",
    },

    {
      name: "Outros",
      value: "10%",
      total: "(124)",
      color: "#BDBDBD",
    },
  ];

  return (
    <div
      className="bg-white rounded-4 h-100"
      style={{
        padding: "20px",
        border: "1px solid #EEF1F5",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div className="mb-4">
        <h5
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
            margin: 0,
          }}
        >
          Leads por Origem
        </h5>
      </div>

      {/* CONTENT */}
      <div
        className="d-flex align-items-center justify-content-between h-100"
        style={{
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* CHART */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "150px",
            height: "150px",
            minWidth: "150px",
            borderRadius: "50%",
            background: `conic-gradient(
              #D4AF63 0% 35%,
              #4A90E2 35% 60%,
              #8B7CF6 60% 80%,
              #7E57C2 80% 90%,
              #D9D9D9 90% 100%
            )`,
          }}
        >
          <div
            className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
            style={{
              width: "95px",
              height: "95px",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#111827",
                lineHeight: "18px",
              }}
            >
              1.250
            </span>

            <span
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginTop: "4px",
              }}
            >
              Total
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div
          className="d-flex flex-column flex-grow-1"
          style={{
            gap: "12px",
            minWidth: "110px",
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center"
              style={{
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: item.color,
                  minWidth: "10px",
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#111827",
                    lineHeight: "12px",
                  }}
                >
                  {item.name}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    marginTop: "4px",
                  }}
                >
                  {item.value} {item.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLeads;
