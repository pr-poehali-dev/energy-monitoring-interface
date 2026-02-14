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
  const dotColor: Record<string, string> = {
    info: "bg-scada-blue",
    warning: "bg-scada-yellow",
    error: "bg-scada-red",
    success: "bg-scada-green",
  };

  return (
    <div className="bg-scada-card rounded-lg border border-scada-border p-5">
      <h3 className="text-base font-bold text-white mb-4">Журнал событий</h3>
      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 py-1.5">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor[event.type]} ${event.type === "error" ? "animate-pulse" : ""}`} />
            <span className="text-sm font-mono text-scada-muted w-12 shrink-0">{event.time}</span>
            <span className="text-sm text-scada-text">{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;
