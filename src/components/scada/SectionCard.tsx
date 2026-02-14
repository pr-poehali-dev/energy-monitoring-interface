export interface SectionData {
  name: string;
  icon: string;
  power: number;
  current: number;
  cosPhi: number;
  status: "Норма" | "Предупреждение" | "Перегрузка" | "Авария";
  bgColor: string;
  history: number[];
}

interface SectionCardProps {
  data: SectionData;
}

const SectionCard = ({ data }: SectionCardProps) => {
  const statusColors: Record<string, string> = {
    "Норма": "bg-scada-green/20 text-scada-green border-scada-green/50",
    "Предупреждение": "bg-scada-yellow/20 text-scada-yellow border-scada-yellow/50",
    "Перегрузка": "bg-scada-red/20 text-scada-red border-scada-red/50",
    "Авария": "bg-scada-red/30 text-scada-red border-scada-red/60",
  };

  const maxH = Math.max(...data.history, 1);
  const sparkH = 40;
  const sparkW = data.history.length - 1;

  return (
    <div className={`${data.bgColor} rounded-lg p-4 transition-all hover:brightness-110 cursor-pointer`}>
      <h3 className="text-base font-bold text-white mb-3 text-center">{data.name}</h3>

      <div className="space-y-1 mb-3">
        <p className="text-sm text-white/90">
          Мощность: <span className="font-bold font-mono">{data.power} кВт</span>
        </p>
        <p className="text-sm text-white/90">
          Ток: <span className="font-bold font-mono">{data.current} А</span>
        </p>
      </div>

      <div className="bg-black/15 rounded p-1.5 mb-3">
        <svg width="100%" height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`spark-${data.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <polygon
            fill={`url(#spark-${data.name})`}
            points={`0,${sparkH} ${data.history.map((v, i) => `${i},${sparkH - (v / maxH) * (sparkH - 4)}`).join(" ")} ${sparkW},${sparkH}`}
          />
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            points={data.history.map((v, i) => `${i},${sparkH - (v / maxH) * (sparkH - 4)}`).join(" ")}
          />
        </svg>
      </div>

      <div className="flex justify-center">
        <span className={`text-xs font-semibold px-3 py-1 rounded border ${statusColors[data.status]}`}>
          {data.status === "Норма" ? "Норма" : `Статус: ${data.status}`}
        </span>
      </div>
    </div>
  );
};

export default SectionCard;
