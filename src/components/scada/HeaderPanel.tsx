import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

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
      ? "bg-scada-green"
      : systemStatus === "ПРЕДУПРЕЖДЕНИЕ"
        ? "bg-scada-yellow"
        : "bg-scada-red animate-pulse";

  const statusTextColor =
    systemStatus === "НОРМА"
      ? "text-scada-green"
      : systemStatus === "ПРЕДУПРЕЖДЕНИЕ"
        ? "text-scada-yellow"
        : "text-scada-red animate-pulse";

  return (
    <header className="bg-scada-dark text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={24} className="text-scada-blue" />
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">ООО «Аква»</h1>
            <p className="text-xs text-slate-400">АРМ энергомониторинга</p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-600 mx-2" />
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Icon name="Users" size={16} />
          <span>Смена: №2</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Icon name="User" size={16} />
          <span>Иванов И.И.</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Icon name="Calendar" size={16} />
            <span>{formatDate(time)}</span>
          </div>
          <div className="flex items-center gap-2 text-white text-base font-semibold">
            <Icon name="Clock" size={16} />
            <span>{formatTime(time)}</span>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-600" />
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <span className={`text-sm font-bold ${statusTextColor}`}>
            {systemStatus}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderPanel;
