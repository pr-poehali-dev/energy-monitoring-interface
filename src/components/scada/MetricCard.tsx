import Icon from "@/components/ui/icon";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  status?: "green" | "yellow" | "red";
  subtitle?: string;
}

const MetricCard = ({ title, value, unit, icon, status = "green", subtitle }: MetricCardProps) => {
  const borderColor =
    status === "green"
      ? "border-l-scada-green"
      : status === "yellow"
        ? "border-l-scada-yellow"
        : "border-l-scada-red";

  const valueColor =
    status === "green"
      ? "text-scada-dark"
      : status === "yellow"
        ? "text-scada-yellow"
        : "text-scada-red";

  return (
    <div className={`bg-white rounded-lg border border-slate-200 border-l-4 ${borderColor} p-5 shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name={icon} size={18} className="text-scada-muted" />
        <p className="text-xs font-semibold text-scada-muted uppercase tracking-wider">{title}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold font-mono ${valueColor}`}>{value}</span>
        <span className="text-sm text-scada-muted">{unit}</span>
      </div>
      {subtitle && (
        <p className="text-xs text-scada-muted mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
