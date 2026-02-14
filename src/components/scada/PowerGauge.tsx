import { useEffect, useRef } from "react";

interface PowerGaugeProps {
  value: number;
  max?: number;
  label: string;
  unit: string;
}

const PowerGauge = ({ value, max = 350, label, unit }: PowerGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animatedValue = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = 220;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
    ctx.scale(dpr, dpr);

    const center = displaySize / 2;
    const radius = displaySize / 2 - 28;
    const startAngle = 0.8 * Math.PI;
    const endAngle = 2.2 * Math.PI;
    const totalArc = endAngle - startAngle;

    const zones = [
      { from: 0, to: 100, color: "#22c55e" },
      { from: 100, to: 200, color: "#84cc16" },
      { from: 200, to: 280, color: "#eab308" },
      { from: 280, to: max, color: "#ef4444" },
    ];

    const animate = () => {
      const diff = value - animatedValue.current;
      animatedValue.current += diff * 0.06;

      ctx.clearRect(0, 0, displaySize, displaySize);

      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.strokeStyle = "#1a2850";
      ctx.lineWidth = 22;
      ctx.lineCap = "butt";
      ctx.stroke();

      zones.forEach((zone) => {
        const a1 = startAngle + (zone.from / max) * totalArc;
        const a2 = startAngle + (zone.to / max) * totalArc;
        ctx.beginPath();
        ctx.arc(center, center, radius, a1, a2);
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 22;
        ctx.lineCap = "butt";
        ctx.stroke();
      });

      for (let i = 0; i <= max; i += 20) {
        const angle = startAngle + (i / max) * totalArc;
        const isMajor = i % 100 === 0;
        const innerR = radius - (isMajor ? 14 : 8);
        const outerR = radius + 12;
        ctx.beginPath();
        ctx.moveTo(center + Math.cos(angle) * innerR, center + Math.sin(angle) * innerR);
        ctx.lineTo(center + Math.cos(angle) * outerR, center + Math.sin(angle) * outerR);
        ctx.strokeStyle = isMajor ? "#8896b3" : "#4a5a8a";
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.stroke();
      }

      const labelValues = [0, 100, 200, 280, max];
      labelValues.forEach((lbl) => {
        const angle = startAngle + (lbl / max) * totalArc;
        const lx = center + Math.cos(angle) * (radius + 24);
        const ly = center + Math.sin(angle) * (radius + 24);
        ctx.fillStyle = "#8896b3";
        ctx.font = "bold 10px 'IBM Plex Mono'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(lbl.toString(), lx, ly);
      });

      const needleAngle = startAngle + (Math.min(animatedValue.current, max) / max) * totalArc;
      const needleLen = radius - 4;
      const nx = center + Math.cos(needleAngle) * needleLen;
      const ny = center + Math.sin(needleAngle) * needleLen;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(center, center, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#cbd5e1";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center, center, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#1a2850";
      ctx.fill();

      if (Math.abs(diff) > 0.3) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [value, max]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-semibold text-scada-text mb-1">{label}</p>
      <canvas ref={canvasRef} className="drop-shadow-lg" />
      <div className="text-center -mt-2">
        <span className="text-3xl font-bold font-mono text-white">{Math.round(value)}</span>
        <span className="text-sm text-scada-muted ml-2">{unit}</span>
      </div>
    </div>
  );
};

export default PowerGauge;
