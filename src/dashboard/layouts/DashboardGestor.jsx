import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

import DashboardCards from "../components/DashboardCards.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";
import DashboardActivity from "../components/DashboardActivity.jsx";
import DashboardTasks from "../components/DashboardTasks.jsx";
import DashboardSchedule from "../components/DashboardSchedule.jsx";
import DashboardLeads from "../components/DashboardLeads.jsx";

import "../styles/dashboardLayout.css";

function DashboardGestor() {
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
            className="bg-white flex-shrink-0 rounded-4"
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
              className="d-flex flex-column"
              style={{
                gap: "8px",
              }}
            >

              {/* ROW 1 */}
              <div
                style={{
                  minHeight: "160px",
                }}
              >
                <div className="row g-2 h-100 m-0">
                  <DashboardCards />
                </div>
              </div>

              {/* ROW 2 */}
              <div
                style={{
                  minHeight: "260px",
                }}
              >
                <div className="row g-2 h-100 m-0">

                  <div className="col-5">
                    <DashboardCharts />
                  </div>

                  <div className="col-4">
                    <DashboardLeads />
                  </div>

                  <div className="col-3">
                    <DashboardActivity />
                  </div>

                </div>
              </div>

              {/* ROW 3 */}
              <div
                style={{
                  minHeight: "220px",
                }}
              >
                <div className="row g-2 h-100 m-0">

                  <div className="col-6">
                    <DashboardTasks />
                  </div>

                  <div className="col-6">
                    <DashboardSchedule />
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

export default DashboardGestor;