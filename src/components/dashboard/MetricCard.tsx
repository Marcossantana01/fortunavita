import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  tone: "blue" | "gold" | "green" | "red" | "violet";
  icon: ReactNode;
  trend?: "up" | "down";
  showSparkline?: boolean;
  sparkline?: string;
  sparkArea?: string;
  sparkPoints?: Array<[number, number]>;
};

export default function MetricCard({
  title,
  value,
  change,
  tone,
  icon,
  trend = "up",
  showSparkline = true,
  sparkline = "M2 24 C18 20 28 18 40 19 C54 20 61 12 74 13 C89 14 96 21 110 17 C124 13 134 8 148 7",
  sparkArea = "M2 24 C18 20 28 18 40 19 C54 20 61 12 74 13 C89 14 96 21 110 17 C124 13 134 8 148 7 L148 34 L2 34 Z",
  sparkPoints = [
    [2, 24],
    [40, 19],
    [74, 13],
    [110, 17],
    [148, 7],
  ],
}: MetricCardProps) {
  return (
    <article className={`metric-card metric-card-${tone}${showSparkline ? "" : " metric-card-no-sparkline"}`}>
      <div className="metric-card-head">
        <span className="metric-icon">{icon}</span>
        <p>{title}</p>
      </div>
      <strong>{value}</strong>
      <span className={`metric-change metric-change-${trend}`}>{change}</span>
      {showSparkline && (
        <div className="metric-sparkline" aria-hidden="true">
          <svg viewBox="0 0 150 34">
            <path className="metric-sparkline-area" d={sparkArea} />
            <path d={sparkline} />
            {sparkPoints.map(([x, y]) => (
              <circle cx={x} cy={y} key={`${x}-${y}`} r="2.3" />
            ))}
          </svg>
        </div>
      )}
    </article>
  );
}
