import Icon from "@/components/ui/icon";

export interface LogEvent {
  id: number;
  time: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

interface EventLogProps {
  events: LogEvent[];
}

const EventLog = ({ events }: EventLogProps) => {
  const typeConfig = {
    info: { icon: "Info", color: "text-scada-blue", bg: "bg-blue-50", dot: "bg-scada-blue" },
    warning: { icon: "AlertTriangle", color: "text-scada-yellow", bg: "bg-yellow-50", dot: "bg-scada-yellow" },
    error: { icon: "AlertCircle", color: "text-scada-red", bg: "bg-red-50", dot: "bg-scada-red" },
    success: { icon: "CheckCircle", color: "text-scada-green", bg: "bg-green-50", dot: "bg-scada-green" },
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-scada-dark flex items-center gap-2">
          <span className="w-1 h-4 bg-scada-red rounded-full inline-block" />
          Журнал событий
        </h3>
        <span className="text-xs text-scada-muted">{events.length} записей</span>
      </div>
      <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
        {events.map((event) => {
          const cfg = typeConfig[event.type];
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 px-3 py-2 rounded-md ${cfg.bg} transition-colors`}
            >
              <Icon name={cfg.icon} size={16} className={`${cfg.color} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-scada-dark">{event.message}</p>
              </div>
              <span className="text-xs font-mono text-scada-muted whitespace-nowrap">{event.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventLog;
