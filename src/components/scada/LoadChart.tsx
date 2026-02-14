import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LoadChartProps {
  data: Array<{ time: string; value: number }>;
  title: string;
}

const LoadChart = ({ data, title }: LoadChartProps) => {
  return (
    <div className="bg-scada-card rounded-lg border border-scada-border p-5">
      <h3 className="text-base font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a6a" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#8896b3", fontFamily: "IBM Plex Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#2a3a6a" }}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8896b3", fontFamily: "IBM Plex Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#2a3a6a" }}
            tickFormatter={(v) => `${v} kW`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0c1525",
              border: "1px solid #2a3a6a",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "12px",
              fontFamily: "IBM Plex Mono",
            }}
            formatter={(val: number) => [`${val} кВт`, "Мощность"]}
            labelStyle={{ color: "#8896b3" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadChart;
