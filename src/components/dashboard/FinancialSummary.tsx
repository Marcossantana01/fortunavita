type FinancialSummaryProps = {
  title?: string;
  subtitle?: string;
  income: string;
  incomeLabel?: string;
  goalCaption?: string;
  showDetails?: boolean;
  showGoalProgress?: boolean;
  expenses: string;
  expensesLabel?: string;
  conversion: string;
  conversionLabel?: string;
  goal: string;
};

export default function FinancialSummary({
  title = "Resumo financeiro",
  subtitle = "Mes atual",
  income,
  incomeLabel = "Receita liquida",
  goalCaption,
  showDetails = true,
  showGoalProgress = false,
  expenses,
  expensesLabel = "Despesas",
  conversion,
  conversionLabel = "Conversao",
  goal,
}: FinancialSummaryProps) {
  const goalProgress = Math.max(
    0,
    Math.min(100, Number(goal.replace(/[^\d,-]/g, "").replace(",", ".")) || 0),
  );

  return (
    <section className="dashboard-card financial-card">
      <div className="dashboard-card-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="financial-compact">
        <div>
          <span>{incomeLabel}</span>
          <strong>{income}</strong>
        </div>
        <small>{goalCaption ?? `${goal} da meta`}</small>
      </div>

      {showGoalProgress && (
        <div className="financial-goal-progress">
          <div className="financial-goal-progress-head">
            <span>Meta estipulada do mes</span>
            <strong>{goal}</strong>
          </div>
          <div className="financial-goal-progress-track" aria-label={`Meta do mes: ${goal}`}>
            <i style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      )}

      {showDetails && (
        <div className="financial-grid">
          <div>
            <span>{expensesLabel}</span>
            <strong>{expenses}</strong>
          </div>
          <div>
            <span>{conversionLabel}</span>
            <strong>{conversion}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
