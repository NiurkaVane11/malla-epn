"use client";

import { useMalla } from "../store/useMalla";
import { PERIODOS } from "../lib/periodos";

export default function IraGrafico() {
  const ira = useMalla((s) => s.iraPeriodos);
  const puntos = PERIODOS.filter((p) => ira[p] !== undefined).map((p) => ({ p, v: ira[p] }));
  if (puntos.length === 0) return null;

  const W = 320, H = 150, PX = 30, PY = 22;
  const vals = puntos.map((x) => x.v);
  const min = Math.max(0, Math.floor(Math.min(...vals) - 2));
  const max = Math.min(40, Math.ceil(Math.max(...vals) + 2));
  const x = (i: number) => (puntos.length === 1 ? W / 2 : PX + (i * (W - 2 * PX)) / (puntos.length - 1));
  const y = (v: number) => H - PY - ((v - min) / (max - min || 1)) * (H - 2 * PY);
  const linea = puntos.map((pt, i) => `${x(i)},${y(pt.v)}`).join(" ");

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <h2 className="text-sm font-semibold text-[#001F3F]">Tendencia del IRA</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="IRA por período">
        {[min, max].map((v) => (
          <g key={v}>
            <line x1={PX} x2={W - PX} y1={y(v)} y2={y(v)} stroke="#001F3F" strokeOpacity="0.1" />
            <text x={PX - 4} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#001F3F" fillOpacity="0.6">
              {v}
            </text>
          </g>
        ))}
        {puntos.length > 1 && (
          <polyline points={linea} fill="none" stroke="#1E488F" strokeWidth="2.5" strokeLinejoin="round" />
        )}
        {puntos.map((pt, i) => (
          <g key={pt.p}>
            <circle cx={x(i)} cy={y(pt.v)} r="4" fill="#00804C" />
            <text x={x(i)} y={y(pt.v) - 8} textAnchor="middle" fontSize="9" fill="#001F3F">
              {pt.v.toFixed(1)}
            </text>
            <text x={x(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#001F3F" fillOpacity="0.6">
              {pt.p}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
