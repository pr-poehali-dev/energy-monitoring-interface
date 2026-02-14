import { useState } from "react";
import Icon from "@/components/ui/icon";

export interface SectionData {
  name: string;
  icon: string;
  power: number;
  current: number;
  cosPhi: number;
  status: "Норма" | "Предупреждение" | "Повышенная нагрузка" | "Авария";
  history: number[];
}

interface SectionCardProps {
  data: SectionData;
}

const SectionCard = ({ data }: SectionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    "Норма": { color: "bg-scada-green", text: "text-scada-green", border: "border-scada-green" },
    "Предупреждение": { color: "bg-scada-yellow", text: "text-scada-yellow", border: "border-scada-yellow" },
    "Повышенная нагрузка": { color: "bg-scada-yellow", text: "text-scada-yellow", border: "border-scada-yellow" },
    "Авария": { color: "bg-scada-red", text: "text-scada-red", border: "border-scada-red" },
  };

  const cfg = statusConfig[data.status];

  const maxH = Math.max(...data.history, 1);
  const sparkHeight = 40;

  return (
    <div
      className={`bg-white rounded-lg border-2 ${cfg.border} shadow-sm cursor-pointer transition-all hover:shadow-md`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name={data.icon} size={20} className="text-scada-dark" />
            <h3 className="font-semibold text-scada-dark text-sm">{data.name}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.color} ${data.status === "Авария" ? "animate-pulse" : ""}`} />
            <span className={`text-xs font-medium ${cfg.text}`}>{data.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-scada-muted uppercase">Мощность</p>
            <p className="text-lg font-bold font-mono text-scada-dark">{data.power}<span className="text-xs text-scada-muted ml-1">кВт</span></p>
          </div>
          <div>
            <p className="text-[10px] text-scada-muted uppercase">Ток</p>
            <p className="text-lg font-bold font-mono text-scada-dark">{data.current}<span className="text-xs text-scada-muted ml-1">А</span></p>
          </div>
          <div>
            <p className="text-[10px] text-scada-muted uppercase">cos φ</p>
            <p className="text-lg font-bold font-mono text-scada-dark">{data.cosPhi}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded p-2">
          <svg width="100%" height={sparkHeight} viewBox={`0 0 ${data.history.length - 1} ${sparkHeight}`} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={data.status === "Норма" ? "#22c55e" : data.status === "Авария" ? "#ef4444" : "#eab308"}
              strokeWidth="2"
              points={data.history.map((v, i) => `${i},${sparkHeight - (v / maxH) * (sparkHeight - 4)}`).join(" ")}
            />
          </svg>
          <p className="text-[10px] text-scada-muted mt-1">Последние 10 мин</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-scada-muted text-xs">Среднее за смену</p>
              <p className="font-mono font-semibold">{Math.round(data.history.reduce((a, b) => a + b, 0) / data.history.length)} кВт</p>
            </div>
            <div>
              <p className="text-scada-muted text-xs">Максимум за смену</p>
              <p className="font-mono font-semibold">{Math.max(...data.history)} кВт</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;
