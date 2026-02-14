import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ConsumptionChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  return (
    <div className="bg-scada-card rounded-lg border border-scada-border p-5">
      <h3 className="text-base font-bold text-white mb-4">Потребление по участкам</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3a6a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#8896b3", fontFamily: "IBM Plex Sans" }}
            tickLine={false}
            axisLine={{ stroke: "#2a3a6a" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8896b3", fontFamily: "IBM Plex Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#2a3a6a" }}
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
            formatter={(val: number) => [`${val} кВт·ч`, "Потребление"]}
            labelStyle={{ color: "#8896b3" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;
