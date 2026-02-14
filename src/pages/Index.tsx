import { useState, useEffect, useCallback } from "react";
import HeaderPanel from "@/components/scada/HeaderPanel";
import PowerGauge from "@/components/scada/PowerGauge";
import MetricCard from "@/components/scada/MetricCard";
import SectionCard, { SectionData } from "@/components/scada/SectionCard";
import LoadChart from "@/components/scada/LoadChart";
import ConsumptionChart from "@/components/scada/ConsumptionChart";
import EventLog, { LogEvent } from "@/components/scada/EventLog";

const generateHourlyData = () => {
  const data: Array<{ time: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const base = h >= 6 && h <= 22 ? 140 + Math.random() * 120 : 40 + Math.random() * 60;
    data.push({ time: `${h.toString().padStart(2, "0")}:00`, value: Math.round(base) });
  }
  return data;
};

const initialSections: SectionData[] = [
  { name: "Скважина", icon: "Droplets", power: 42, current: 85, cosPhi: 0.94, status: "Норма", bgColor: "bg-green-600", history: [38, 40, 42, 41, 43, 42, 40, 39, 42, 44] },
  { name: "Фильтрация", icon: "Filter", power: 28, current: 60, cosPhi: 0.89, status: "Предупреждение", bgColor: "bg-yellow-500", history: [24, 26, 28, 30, 32, 28, 27, 29, 31, 28] },
  { name: "Линия розлива", icon: "Package", power: 96, current: 180, cosPhi: 0.82, status: "Перегрузка", bgColor: "bg-orange-500", history: [88, 92, 96, 98, 95, 93, 96, 100, 97, 96] },
  { name: "Линия розлива 2", icon: "Package", power: 96, current: 180, cosPhi: 0.85, status: "Перегрузка", bgColor: "bg-red-600", history: [90, 94, 96, 99, 97, 95, 96, 98, 96, 96] },
  { name: "Компрессор", icon: "Wind", power: 52, current: 74, cosPhi: 0.87, status: "Норма", bgColor: "bg-green-600", history: [48, 50, 52, 51, 53, 52, 50, 49, 52, 54] },
];

const initialEvents: LogEvent[] = [
  { id: 1, time: "14:11", message: "Перегрузка на линии розлива", type: "error" },
  { id: 2, time: "14:13", message: "Нагрузка нормализована", type: "success" },
  { id: 3, time: "13:57", message: "Пиковая мощность достигнута", type: "warning" },
  { id: 4, time: "13:45", message: "Повышенный ток на компрессоре", type: "warning" },
  { id: 5, time: "13:30", message: "Включение резервного компрессора", type: "info" },
  { id: 6, time: "13:12", message: "Плановая проверка датчиков завершена", type: "success" },
  { id: 7, time: "12:55", message: "Температура обмотки двигателя 78°C", type: "warning" },
  { id: 8, time: "12:40", message: "Обновление показаний счётчиков", type: "info" },
];

const Index = () => {
  const [totalPower, setTotalPower] = useState(243);
  const [sections, setSections] = useState(initialSections);
  const [chartData] = useState(generateHourlyData);
  const [events, setEvents] = useState(initialEvents);
  const [peakPower] = useState(287);
  const [peakTime] = useState("11:43");
  const [specificEnergy, setSpecificEnergy] = useState(0.048);

  const systemStatus: "НОРМА" | "ПРЕДУПРЕЖДЕНИЕ" | "АВАРИЯ" =
    totalPower >= 280 ? "АВАРИЯ" : totalPower >= 200 ? "ПРЕДУПРЕЖДЕНИЕ" : "НОРМА";

  const simulateUpdate = useCallback(() => {
    setSections((prev) =>
      prev.map((s) => {
        const delta = (Math.random() - 0.5) * 6;
        const newPower = Math.max(10, Math.round(s.power + delta));
        const newCurrent = Math.round(s.current + (Math.random() - 0.5) * 8);
        const newHistory = [...s.history.slice(1), newPower];
        return { ...s, power: newPower, current: Math.max(10, newCurrent), history: newHistory };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateUpdate, 2000);
    return () => clearInterval(interval);
  }, [simulateUpdate]);

  useEffect(() => {
    const total = sections.reduce((sum, s) => sum + s.power, 0);
    setTotalPower(total);
    setSpecificEnergy(Number((total * 0.0002).toFixed(3)));
  }, [sections]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { message: "Проверка связи с датчиками — ОК", type: "info" as const },
        { message: "Обновление показаний счётчиков", type: "success" as const },
        { message: "Кратковременный скачок тока фильтрации", type: "warning" as const },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      setEvents((prev) => [
        { id: Date.now(), time, ...msg },
        ...prev.slice(0, 19),
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const consumptionData = sections.map((s) => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    value: Math.round(s.power * 7.2),
    color: s.bgColor.includes("green") ? "#22c55e" : s.bgColor.includes("yellow") ? "#eab308" : s.bgColor.includes("orange") ? "#f97316" : "#ef4444",
  }));

  const energyBadge =
    specificEnergy < 0.05 ? "Эффективно" : specificEnergy < 0.07 ? "Внимание" : "Критично";
  const energyStatus: "green" | "yellow" | "red" =
    specificEnergy < 0.05 ? "green" : specificEnergy < 0.07 ? "yellow" : "red";

  return (
    <div className="min-h-screen bg-scada-bg font-sans">
      <HeaderPanel systemStatus={systemStatus} />

      <div className="p-4 max-w-[1600px] mx-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-scada-card rounded-lg border border-scada-border p-4 flex justify-center items-center">
            <PowerGauge value={totalPower} max={350} label="Текущая нагрузка" unit="кВт" />
          </div>

          <MetricCard
            title="Энергия на 1 литр"
            value={specificEnergy}
            unit="кВт·ч/л"
            status={energyStatus}
            badge={energyBadge}
          />

          <MetricCard
            title="Пиковая мощность"
            value={peakPower}
            unit="кВт"
            status={peakPower >= 280 ? "red" : "yellow"}
            subtitle={`Время пика: ${peakTime}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sections.map((section) => (
            <SectionCard key={section.name} data={section} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadChart data={chartData} title="График нагрузки за сутки" />
          <ConsumptionChart data={consumptionData} />
        </div>

        <EventLog events={events} />
      </div>
    </div>
  );
};

export default Index;
