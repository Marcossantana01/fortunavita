import {
  FiGrid,
  FiUsers,
  FiUser,
  FiDollarSign,
  FiTruck,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

function Sidebar() {
  return (
    <aside
      className="h-100 d-flex flex-column px-3 py-4 overflow-auto"
      style={{
        background: "linear-gradient(180deg, #041C4A 0%, #021235 100%)",
      }}
    >
      {/* MENU */}
      <div className="d-flex flex-column gap-2">
        <button
          className="btn text-start text-white fw-semibold rounded-4 py-3 border-0"
          style={{
            background: "#D4B06A",
          }}
        >
          <FiGrid className="me-2" />
          Painel Administrativo
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiUsers className="me-2" />
          Leads
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiUser className="me-2" />
          Clientes
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiUsers className="me-2" />
          Usuários
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiUsers className="me-2" />
          Consultores
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiDollarSign className="me-2" />
          Financeiro
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiTruck className="me-2" />
          Fornecedores
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiCalendar className="me-2" />
          Agenda
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiBarChart2 className="me-2" />
          Relatórios
        </button>

        <button className="btn btn-link text-start text-white text-decoration-none py-3">
          <FiSettings className="me-2" />
          Configurações
        </button>
      </div>

      {/* SUPPORT */}
      <div className="mt-auto pt-4">
        <div
          className="rounded-4 p-4 text-white"
          style={{
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-3">
            <FiHelpCircle size={22} />
          </div>

          <h6 className="fw-semibold">Precisa de ajuda?</h6>

          <p
            className="small mb-3"
            style={{
              color: "#c7cfdd",
            }}
          >
            Acione o suporte externo especializado.
          </p>

          <a
            href="mailto:suporte@seopartners.com.br"
            className="btn w-100 fw-semibold border-0"
            style={{
              background: "#D4B06A",
              color: "#ffffff",
            }}
          >
            Acionar suporte
          </a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
