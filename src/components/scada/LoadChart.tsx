import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface LoadChartProps {
  data: Array<{ time: string; value: number }>;
  title: string;
}

const LoadChart = ({ data, title }: LoadChartProps) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-scada-dark mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-scada-blue rounded-full inline-block" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#64748b", fontFamily: "IBM Plex Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b", fontFamily: "IBM Plex Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            unit=" кВт"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "IBM Plex Mono",
            }}
            formatter={(val: number) => [`${val} кВт`, "Мощность"]}
          />
          <ReferenceLine y={280} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Макс", fill: "#ef4444", fontSize: 11 }} />
          <ReferenceLine y={200} stroke="#eab308" strokeDasharray="5 5" label={{ value: "Внимание", fill: "#eab308", fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadChart;
