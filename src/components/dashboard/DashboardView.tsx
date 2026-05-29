import ActivityList from "@/components/dashboard/ActivityList";
import ChartCard, { PieChartVisual } from "@/components/dashboard/ChartCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChartCard from "@/components/dashboard/PerformanceChartCard";
import type { DashboardData } from "@/services/dashboardData";

type DashboardViewProps = {
  data: DashboardData;
};

export default function DashboardView({ data }: DashboardViewProps) {
  return (
    <DashboardLayout
      activeItem={data.activeItem}
      dateLabel="24 Maio, 2026"
      menuItems={data.menuItems}
      panelTitle={data.panelTitle}
      userAvatar={data.user.avatar}
      userName={data.user.name}
      userRole={data.user.role}
    >
      <div className="dashboard-content">
        <section className="metrics-grid" aria-label="Indicadores principais">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} showSparkline={data.showMetricSparklines} />
          ))}
        </section>

        <section className="dashboard-grid">
          <PerformanceChartCard
            data={data.performance}
            subtitle={data.performanceSubtitle ?? "Ultimos 7 meses"}
            title={data.performanceTitle ?? "Performance de Vendas"}
          />

          <ChartCard title={data.pieTitle ?? "Leads por Origem"}>
            <PieChartVisual
              segments={data.pieSegments}
              totalLabel={data.pieTotalLabel}
              totalValue={data.pieTotalValue}
            />
          </ChartCard>

          <ActivityList activities={data.activities} subtitle={data.activitySubtitle} title={data.activityTitle} />
        </section>

        <section className="dashboard-lower-grid">
          <DataTable
            headers={data.dealsHeaders}
            rows={data.deals}
            subtitle={data.dealsSubtitle}
            title={data.dealsTitle}
          />
          <FinancialSummary {...data.financial} />
        </section>
      </div>
    </DashboardLayout>
  );
}
