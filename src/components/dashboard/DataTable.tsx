type DataRow = {
  client: string;
  product: string;
  amount: string;
  stage: string;
  status: "Ganho" | "Em analise" | "Pendente";
};

type DataTableProps = {
  rows: DataRow[];
  title?: string;
  subtitle?: string;
  headers?: string[];
};

const statusClasses: Record<DataRow["status"], string> = {
  Ganho: "status-won",
  "Em analise": "status-review",
  Pendente: "status-pending",
};

export default function DataTable({
  rows,
  title = "Ultimos negocios",
  subtitle = "Oportunidades movimentadas recentemente",
  headers = ["Cliente", "Produto", "Valor", "Etapa", "Status"],
}: DataTableProps) {
  return (
    <section className="dashboard-card data-table-card">
      <div className="dashboard-card-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button">Ver todos</button>
      </div>

      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.client}-${row.product}`}>
                <td>{row.client}</td>
                <td>{row.product}</td>
                <td>{row.amount}</td>
                <td>{row.stage}</td>
                <td>
                  <span className={`status-pill ${statusClasses[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
