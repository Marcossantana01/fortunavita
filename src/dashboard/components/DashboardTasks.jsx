import {
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

function DashboardTasks() {
  const tasks = [
    {
      title: "Entrar em contato com lead premium",
      status: "Urgente",
      done: false,
    },

    {
      title: "Atualizar proposta financeira",
      status: "Hoje",
      done: false,
    },

    {
      title: "Reunião com investidor",
      status: "Concluído",
      done: true,
    },

    {
      title: "Analisar relatório mensal",
      status: "Pendente",
      done: false,
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
          Tarefas
        </h5>

        <small
          style={{
            color: "#7b8190",
            fontSize: "11px",
          }}
        >
          Organização da equipe
        </small>

      </div>

      {/* LIST */}
      <div
        className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden"
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center"
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "#f8fafc",
              minHeight: "58px",
            }}
          >
            <div className="d-flex align-items-center gap-2 overflow-hidden">

              {task.done ? (
                <FiCheckCircle
                  size={18}
                  color="#22c55e"
                />
              ) : (
                <FiClock
                  size={18}
                  color="#f97316"
                />
              )}

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
                  {task.title}
                </p>

                <small
                  style={{
                    color: "#7b8190",
                    fontSize: "11px",
                  }}
                >
                  {task.status}
                </small>

              </div>

            </div>

            <button
              style={{
                border: "none",
                background: "#d4b06a",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Abrir
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTasks;