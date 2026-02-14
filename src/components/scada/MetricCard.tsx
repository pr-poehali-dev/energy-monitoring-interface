interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  status?: "green" | "yellow" | "red";
  subtitle?: string;
  badge?: string;
}

const MetricCard = ({ title, value, unit, status = "green", subtitle, badge }: MetricCardProps) => {
  const badgeColors =
    status === "green"
      ? "bg-scada-green/20 text-scada-green border-scada-green/40"
      : status === "yellow"
        ? "bg-scada-yellow/20 text-scada-yellow border-scada-yellow/40"
        : "bg-scada-red/20 text-scada-red border-scada-red/40";

  return (
    <div className="bg-scada-card rounded-lg border border-scada-border p-5 flex flex-col justify-between">
      <p className="text-sm font-semibold text-scada-muted mb-3">{title}</p>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold font-mono text-white">{value}</span>
          <span className="text-base text-scada-muted">{unit}</span>
        </div>
        {badge && (
          <span className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded border ${badgeColors}`}>
            {badge}
          </span>
        )}
        {subtitle && (
          <p className="text-xs text-scada-muted mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
