import { useState, useEffect } from "react";

interface HeaderPanelProps {
  systemStatus: "НОРМА" | "ПРЕДУПРЕЖДЕНИЕ" | "АВАРИЯ";
}

const HeaderPanel = ({ systemStatus }: HeaderPanelProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const statusColor =
    systemStatus === "НОРМА"
      ? "text-scada-green"
      : systemStatus === "ПРЕДУПРЕЖДЕНИЕ"
        ? "text-scada-yellow"
        : "text-scada-red animate-pulse";

  return (
    <header className="bg-scada-header border-b border-scada-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white tracking-tight">ООО "Аква"</h1>
        <span className="text-scada-border text-xl">|</span>
        <span className="text-base font-semibold text-scada-blue">АРМ Энергомониторинга</span>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <span className="text-scada-muted">Смена: <span className="text-scada-text font-medium">№2</span></span>
        <span className="text-scada-muted">|</span>
        <span className="text-scada-muted">Оператор: <span className="text-scada-text font-medium">Иванов И.И.</span></span>
        <span className="text-scada-muted">|</span>
        <span className="text-scada-muted">Дата: <span className="text-scada-text font-medium">{formatDate(time)}</span></span>
        <span className="text-scada-muted">|</span>
        <span className="text-scada-muted">Время: <span className="text-white font-bold font-mono text-base">{formatTime(time)}</span></span>
        <span className="text-scada-muted">|</span>
        <span className="text-scada-muted">Статус: <span className={`font-bold text-base ${statusColor}`}>{systemStatus}</span></span>
      </div>
    </header>
  );
};

export default HeaderPanel;
