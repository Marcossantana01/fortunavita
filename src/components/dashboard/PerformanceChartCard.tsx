"use client";

import { useState } from "react";
import ChartCard, { LineChartVisual } from "@/components/dashboard/ChartCard";
import type { DashboardPerformance } from "@/services/dashboardData";

type PerformanceChartCardProps = {
  data: DashboardPerformance;
  subtitle: string;
  title: string;
};

const periodLabels: Record<keyof DashboardPerformance, string> = {
  day: "Dia",
  month: "Mensal",
  year: "Ano",
};

export default function PerformanceChartCard({
  data,
  subtitle,
  title,
}: PerformanceChartCardProps) {
  const [period, setPeriod] = useState<keyof DashboardPerformance>("month");
  const activeData = data[period];

  return (
    <ChartCard
      actions={
        <div className="chart-filter">
          {(Object.keys(periodLabels) as Array<keyof DashboardPerformance>).map((item) => (
            <button
              className={period === item ? "active" : ""}
              key={item}
              onClick={() => setPeriod(item)}
              type="button"
            >
              {periodLabels[item]}
            </button>
          ))}
        </div>
      }
      subtitle={subtitle}
      title={title}
    >
      <LineChartVisual labels={activeData.labels} values={activeData.values} />
    </ChartCard>
  );
}
