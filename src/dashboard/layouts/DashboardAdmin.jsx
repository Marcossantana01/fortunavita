import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import "../styles/dashboardLayout.css";

function DashboardAdmin() {
  return (
    <div
      className="container-fluid vh-100 p-0"
      style={{
        background: "#F5F7FB",
      }}
    >
      <div className="row g-0 h-100">

        {/* SIDEBAR */}
        <aside className="col-2 h-100 overflow-hidden sidebar-width">
          <Sidebar />
        </aside>

        {/* MAIN */}
        <main className="col h-100 d-flex flex-column">

          {/* HEADER */}
          <div
            className="bg-white rounded-4 flex-shrink-0"
            style={{
              height: "70px",
            }}
          >
            <Header />
          </div>

          {/* CONTENT */}
          <div
            className="flex-grow-1 overflow-auto"
            style={{
              padding: "8px",
              marginTop: "8px",
            }}
          >

            <div
              className="row g-2 m-0"
            >

              {/* TROCAR SENHA */}
              <div className="col-6">

                <div
                  className="bg-white border h-100"
                  style={{
                    borderRadius: "18px",
                    padding: "22px",
                    borderColor: "#EEF1F5",
                  }}
                >

                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#111827",
                      marginBottom: "20px",
                    }}
                  >
                    Alterar Senha
                  </h4>

                  <div className="d-flex flex-column gap-3">

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Senha atual"
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                      }}
                    />

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nova senha"
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                      }}
                    />

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmar nova senha"
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                      }}
                    />

                    <button
                      className="btn"
                      style={{
                        height: "48px",
                        background: "#D4AF63",
                        color: "#ffffff",
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Atualizar Senha
                    </button>

                  </div>

                </div>

              </div>

              {/* CHAMADOS */}
              <div className="col-6">

                <div
                  className="bg-white border h-100"
                  style={{
                    borderRadius: "18px",
                    padding: "22px",
                    borderColor: "#EEF1F5",
                  }}
                >

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      Suporte externo
                    </h4>

                    <span
                      className="badge bg-danger"
                    >
                      3 Pendentes
                    </span>

                  </div>

                  <div className="d-flex flex-column gap-3">

                    {/* ITEM */}
                    <div
                      className="border rounded-4"
                      style={{
                        padding: "14px",
                      }}
                    >

                      <div className="d-flex justify-content-between">

                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight: "600",
                            }}
                          >
                            Problema no Login
                          </h6>

                          <small
                            style={{
                              color: "#6B7280",
                            }}
                          >
                            Usuário: Fernanda Lima
                          </small>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-primary"
                        >
                          Responder
                        </button>

                      </div>

                    </div>

                    {/* ITEM */}
                    <div
                      className="border rounded-4"
                      style={{
                        padding: "14px",
                      }}
                    >

                      <div className="d-flex justify-content-between">

                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight: "600",
                            }}
                          >
                            Erro no Dashboard
                          </h6>

                          <small
                            style={{
                              color: "#6B7280",
                            }}
                          >
                            Usuário: Cássio Cunha
                          </small>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-primary"
                        >
                          Responder
                        </button>

                      </div>

                    </div>

                    {/* ITEM */}
                    <div
                      className="border rounded-4"
                      style={{
                        padding: "14px",
                      }}
                    >

                      <div className="d-flex justify-content-between">

                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight: "600",
                            }}
                          >
                            Atualização Financeira
                          </h6>

                          <small
                            style={{
                              color: "#6B7280",
                            }}
                          >
                            Usuário: Ricardo Alves
                          </small>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-primary"
                        >
                          Responder
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default DashboardAdmin;
