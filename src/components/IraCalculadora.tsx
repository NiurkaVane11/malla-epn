"use client";

import { useState } from "react";
import { MATERIAS } from "../data/malla";
import { estadoDe } from "../lib/disponibles";
import { useMalla } from "../store/useMalla";
import { BASE_INICIAL, MINIMO_APROBAR, calcularIra, proyectar } from "../lib/iraCalc";

const num = (s: string, def: number) => {
  const n = Number(s.replace(",", "."));
  return s.trim() === "" || Number.isNaN(n) ? def : n;
};

const campo =
  "w-full rounded-md border border-[#1E488F]/40 px-2 py-1.5 text-sm text-[#001F3F] focus:border-[#1E488F] focus:outline-none focus:ring-2 focus:ring-[#1E488F]/20";

export default function IraCalculadora() {
  const estados = useMalla((s) => s.estados);
  const cursando = MATERIAS.filter((m) => estadoDe(estados, m.id) === "cursando" && m.creditos > 0);

  const [base, setBase] = useState({
    promedio: String(BASE_INICIAL.promedio),
    aprobados: String(BASE_INICIAL.aprobados),
    reprobados: String(BASE_INICIAL.reprobados),
  });
  const [notas, setNotas] = useState<Record<string, string>>({});

  const b = {
    promedio: num(base.promedio, 0),
    aprobados: num(base.aprobados, 0),
    reprobados: num(base.reprobados, 0),
  };
  const cursadas = cursando
    .filter((m) => (notas[m.id] ?? "").trim() !== "")
    .map((m) => ({ nota: num(notas[m.id], 0), creditos: m.creditos }));

  const actual = calcularIra(b);
  const proy = calcularIra(proyectar(b, cursadas));
  const dif = proy - actual;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <h2 className="text-sm font-semibold text-[#001F3F]">Calculadora de IRA: ¿qué pasa si...?</h2>
      <p className="text-xs text-[#001F3F]/60">
        Aprobar = {MINIMO_APROBAR}/40 o más. Datos base de tu currículum; edítalos si cambian.
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#001F3F]/70">
        {(["promedio", "aprobados", "reprobados"] as const).map((k) => (
          <label key={k}>
            <span className="capitalize">{k === "promedio" ? "Promedio /40" : `Créd. ${k}`}</span>
            <input
              inputMode="decimal"
              value={base[k]}
              onChange={(e) => setBase({ ...base, [k]: e.target.value })}
              className={campo}
            />
          </label>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[#001F3F]/60">
          Notas estimadas de lo que cursas
        </h3>
        {cursando.length === 0 ? (
          <p className="mt-2 text-sm text-[#001F3F]/60">
            Marca materias como &quot;cursando&quot; (clic en la malla o con el planificador) y aparecerán aquí.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {cursando.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm text-[#001F3F]">
                <span className="flex-1 leading-tight">
                  {m.nombre} <span className="text-xs text-[#001F3F]/50">({m.creditos} cr)</span>
                </span>
                <input
                  inputMode="decimal"
                  placeholder="/40"
                  value={notas[m.id] ?? ""}
                  onChange={(e) => setNotas({ ...notas, [m.id]: e.target.value })}
                  className={`${campo} w-20`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#F6F7ED] p-2">
          <p className="text-[10px] uppercase text-[#001F3F]/60">IRA actual</p>
          <p className="text-xl font-bold text-[#001F3F]">{actual.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-[#1E488F] p-2 text-white">
          <p className="text-[10px] uppercase text-white/70">IRA proyectado</p>
          <p className="text-xl font-bold">{proy.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-[#F6F7ED] p-2">
          <p className="text-[10px] uppercase text-[#001F3F]/60">Cambio</p>
          <p className={`text-xl font-bold ${dif >= 0 ? "text-[#00804C]" : "text-red-700"}`}>
            {dif >= 0 ? "+" : ""}
            {dif.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
}
