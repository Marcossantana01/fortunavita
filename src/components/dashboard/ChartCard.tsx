import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type LineChartVisualProps = {
  labels?: string[];
  values?: number[];
};

export function LineChartVisual({
  labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
  values = [28, 44, 56, 51, 66, 61, 78],
}: LineChartVisualProps) {
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 380 : 24 + (index * 712) / (values.length - 1);
    const y = 220 - (value / maxValue) * 182;

    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 736} 220 L${points[0]?.x ?? 24} 220 Z`;

  return (
    <div className="line-chart-wrap" aria-label="Grafico de receita mensal">
      <div className="chart-grid">
        <span />
        <span />
        <span />
        <span />
      </div>
      <svg className="line-chart-svg" viewBox="0 0 760 260" role="img">
        <defs>
          <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d4b06a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d4b06a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#lineFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#d4b06a"
          strokeLinecap="round"
          strokeWidth="3"
        />
        {points.map((point) => (
          <circle
            cx={point.x}
            cy={point.y}
            fill="#ffffff"
            key={`${point.x}-${point.y}`}
            r="4"
            stroke="#d4b06a"
            strokeWidth="2.5"
          />
        ))}
      </svg>
      <div className="line-chart-labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

type PieSegment = {
  label: string;
  value: string;
  color: string;
  count?: number;
};

export function PieChartVisual({
  segments,
  totalLabel = "Total",
  totalValue,
}: {
  segments: PieSegment[];
  totalLabel?: string;
  totalValue?: string;
}) {
  const totalCount = segments.reduce((sum, segment) => sum + (segment.count ?? 0), 0);
  let currentPercent = 0;
  const chartStops = totalCount > 0
    ? segments.map((segment) => {
        const nextPercent = currentPercent + ((segment.count ?? 0) / totalCount) * 100;
        const stop = `${segment.color} ${currentPercent}% ${nextPercent}%`;

        currentPercent = nextPercent;

        return stop;
      })
    : segments.map((segment, index) => {
        const start = (index / segments.length) * 100;
        const end = ((index + 1) / segments.length) * 100;

        return `${segment.color} ${start}% ${end}%`;
      });

  return (
    <div className="pie-chart-wrap">
      <div className="pie-chart-stage">
        <div
          className="pie-chart"
          aria-label="Leads por origem"
          style={{ background: `conic-gradient(from 0deg, ${chartStops.join(", ")})` }}
        />
        <div className="pie-total">
          <strong>{totalValue ?? totalCount.toString()}</strong>
          <span>{totalLabel}</span>
        </div>
      </div>
      <div className="pie-legend">
        {segments.map((segment) => (
          <div key={segment.label}>
            <span style={{ backgroundColor: segment.color }} />
            <p>{segment.label}</p>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartCard({
  title,
  subtitle,
  actions,
  children,
}: ChartCardProps) {
  return (
    <section className="dashboard-card chart-card">
      <div className="dashboard-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
