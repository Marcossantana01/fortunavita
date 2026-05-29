import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

function DashboardCharts() {
  const data = [
    { name: "Jan", valor: 4000 },
    { name: "Fev", valor: 3000 },
    { name: "Mar", valor: 5000 },
    { name: "Abr", valor: 4500 },
    { name: "Mai", valor: 6200 },
    { name: "Jun", valor: 5400 },
    { name: "Jul", valor: 7200 },
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
      <div className="d-flex justify-content-between align-items-center flex-shrink-0 mb-2">

        <div>
          <h5
            style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "18px",
              color: "#111827",
            }}
          >
            Performance de Vendas
          </h5>

          <small
            style={{
              color: "#7b8190",
              fontSize: "11px",
            }}
          >
            Últimos 7 meses
          </small>
        </div>

        <button
          className="btn btn-light"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "5px 10px",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          Mensal
        </button>

      </div>

      {/* CHART */}
      <div className="flex-grow-1 overflow-hidden">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#d4b06a"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default DashboardCharts;