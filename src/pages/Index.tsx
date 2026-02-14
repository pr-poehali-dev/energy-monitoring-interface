import { useState, useEffect, useCallback } from "react";
import HeaderPanel from "@/components/scada/HeaderPanel";
import PowerGauge from "@/components/scada/PowerGauge";
import MetricCard from "@/components/scada/MetricCard";
import SectionCard, { SectionData } from "@/components/scada/SectionCard";
import LoadChart from "@/components/scada/LoadChart";
import EventLog, { LogEvent } from "@/components/scada/EventLog";

const generateHourlyData = () => {
  const data: Array<{ time: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const base = h >= 6 && h <= 22 ? 180 + Math.random() * 100 : 60 + Math.random() * 50;
    data.push({ time: `${h.toString().padStart(2, "0")}:00`, value: Math.round(base) });
  }
  return data;
};

const initialSections: SectionData[] = [
  { name: "Скважина", icon: "Droplets", power: 42, current: 85, cosPhi: 0.94, status: "Норма", history: [38, 40, 42, 41, 43, 42, 40, 39, 42, 44] },
  { name: "Фильтрация", icon: "Filter", power: 28, current: 63, cosPhi: 0.89, status: "Предупреждение", history: [24, 26, 28, 30, 32, 28, 27, 29, 31, 28] },
  { name: "Карбонизация", icon: "Beaker", power: 35, current: 72, cosPhi: 0.91, status: "Норма", history: [32, 34, 35, 33, 36, 35, 34, 35, 33, 35] },
  { name: "Линия розлива", icon: "Package", power: 96, current: 180, cosPhi: 0.82, status: "Повышенная нагрузка", history: [88, 92, 96, 98, 95, 93, 96, 100, 97, 96] },
  { name: "Компрессор", icon: "Wind", power: 42, current: 90, cosPhi: 0.87, status: "Норма", history: [40, 41, 42, 43, 42, 41, 40, 42, 43, 42] },
];

const initialEvents: LogEvent[] = [
  { id: 1, time: "14:13", message: "Нагрузка нормализована", type: "success" },
  { id: 2, time: "14:11", message: "Повышенный ток двигателя скважины", type: "warning" },
  { id: 3, time: "13:58", message: "Снижение скорости конвейера", type: "info" },
  { id: 4, time: "13:57", message: "Пиковая мощность превышена (287 кВт)", type: "error" },
  { id: 5, time: "13:45", message: "cos φ линии розлива ниже 0.85", type: "warning" },
  { id: 6, time: "13:30", message: "Включение резервного компрессора", type: "info" },
  { id: 7, time: "13:12", message: "Плановая проверка датчиков завершена", type: "success" },
  { id: 8, time: "12:55", message: "Температура обмотки двигателя скважины 78°C", type: "warning" },
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

  const energyStatus: "green" | "yellow" | "red" =
    specificEnergy < 0.05 ? "green" : specificEnergy < 0.07 ? "yellow" : "red";

  return (
    <div className="min-h-screen bg-scada-bg font-sans">
      <HeaderPanel systemStatus={systemStatus} />

      <div className="p-4 max-w-[1600px] mx-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex justify-center">
            <PowerGauge value={totalPower} max={350} label="Текущая нагрузка" unit="кВт" />
          </div>

          <div className="grid grid-rows-2 gap-4">
            <MetricCard
              title="Пиковая мощность за смену"
              value={peakPower}
              unit="кВт"
              icon="TrendingUp"
              status={peakPower >= 280 ? "red" : peakPower >= 200 ? "yellow" : "green"}
              subtitle={`Время пика: ${peakTime}`}
            />
            <MetricCard
              title="Удельное энергопотребление"
              value={specificEnergy}
              unit="кВт·ч/л"
              icon="Gauge"
              status={energyStatus}
              subtitle="Энергия на 1 литр продукции"
            />
          </div>

          <div className="grid grid-rows-2 gap-4">
            <MetricCard
              title="Суммарная энергия за смену"
              value="1 842"
              unit="кВт·ч"
              icon="Battery"
              status="green"
              subtitle="С начала смены 06:00"
            />
            <MetricCard
              title="Объём производства"
              value="38 200"
              unit="л"
              icon="Droplets"
              status="green"
              subtitle="Продукция за текущую смену"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-scada-green rounded-full inline-block" />
            <h2 className="text-sm font-semibold text-scada-dark uppercase tracking-wider">Участки производства</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sections.map((section) => (
              <SectionCard key={section.name} data={section} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadChart data={chartData} title="Нагрузка за сутки" />
          <EventLog events={events} />
        </div>
      </div>

      <footer className="bg-scada-dark text-slate-500 text-xs text-center py-3 mt-4">
        ООО «Аква» — АРМ энергомониторинга v1.0 | Все данные обновляются в реальном времени
      </footer>
    </div>
  );
};

export default Index;
