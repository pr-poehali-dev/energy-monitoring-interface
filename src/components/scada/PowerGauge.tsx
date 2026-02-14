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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 30;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;

    const animate = () => {
      const diff = value - animatedValue.current;
      animatedValue.current += diff * 0.08;

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.stroke();

      const greenEnd = startAngle + (200 / max) * (endAngle - startAngle);
      const yellowEnd = startAngle + (280 / max) * (endAngle - startAngle);

      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, Math.min(greenEnd, endAngle));
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.stroke();

      if (max > 200) {
        ctx.beginPath();
        ctx.arc(center, center, radius, greenEnd, Math.min(yellowEnd, endAngle));
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 20;
        ctx.lineCap = "butt";
        ctx.stroke();
      }

      if (max > 280) {
        ctx.beginPath();
        ctx.arc(center, center, radius, yellowEnd, endAngle);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      const valueAngle = startAngle + (animatedValue.current / max) * (endAngle - startAngle);
      const needleLength = radius - 10;
      const needleX = center + Math.cos(valueAngle) * needleLength;
      const needleY = center + Math.sin(valueAngle) * needleLength;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center, center, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#1e293b";
      ctx.fill();

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 36px 'IBM Plex Sans'";
      ctx.textAlign = "center";
      ctx.fillText(Math.round(animatedValue.current).toString(), center, center + 55);

      ctx.fillStyle = "#64748b";
      ctx.font = "500 14px 'IBM Plex Sans'";
      ctx.fillText(unit, center, center + 75);

      const labels = [0, 100, 200, 280, max];
      labels.forEach((lbl) => {
        const angle = startAngle + (lbl / max) * (endAngle - startAngle);
        const lx = center + Math.cos(angle) * (radius + 22);
        const ly = center + Math.sin(angle) * (radius + 22);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px 'IBM Plex Mono'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(lbl.toString(), lx, ly);
      });

      if (Math.abs(diff) > 0.5) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, max, unit]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-semibold text-scada-muted mb-2 uppercase tracking-wider">{label}</p>
      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        className="drop-shadow-sm"
      />
    </div>
  );
};

export default PowerGauge;
