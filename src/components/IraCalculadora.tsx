"use client";

import { useState } from "react";
import { MATERIAS } from "../data/malla";
import { estadoDe } from "../lib/disponibles";
import { useMalla } from "../store/useMalla";
import { BASE_INICIAL, MINIMO_APROBAR, calcularIra, proyectar } from "../lib/iraCalc";
import { etiquetaDe } from "../lib/etiquetas";

const campo =
  "w-20 rounded-md border border-[#1E488F]/40 px-2 py-1 text-sm text-[#001F3F] focus:border-[#1E488F] focus:outline-none focus:ring-2 focus:ring-[#1E488F]/20";

export default function IraCalculadora() {
  const estados = useMalla((s) => s.estados);
  const notas = useMalla((s) => s.notas);
  const [editarBase, setEditarBase] = useState(false);
  const [base, setBase] = useState(BASE_INICIAL);

  const cursando = MATERIAS.filter((m) => estadoDe(estados, m.id) === "cursando" && m.creditos > 0);
  const conNota = cursando
    .map((m) => {
      const n = notas[m.id];
      const total = n && n.b1 !== null && n.b2 !== null ? n.b1 + n.b2 : null;
      return { materia: m, total };
    })
    .filter((x): x is { materia: (typeof cursando)[number]; total: number } => x.total !== null);

  const actual = calcularIra(base);
  const proy = calcularIra(proyectar(base, conNota.map((x) => ({ nota: x.total, creditos: x.materia.creditos }))));
  const dif = proy - actual;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <h2 className="text-sm font-semibold text-[#001F3F]">¿Cómo va tu IRA?</h2>
      <p className="mt-1 text-xs leading-relaxed text-[#001F3F]/70">
        Tu IRA combina dos cosas: <strong>qué tan buenas son tus notas</strong> y{" "}
        <strong>cuántos créditos apruebas de los que intentas</strong>. Si apruebas con buena nota, sube.
        Si reprobás, baja porque esos créditos cuentan como intentados pero no aprobados.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#F6F7ED] p-3">
          <p className="text-[10px] uppercase text-[#001F3F]/60">Tu IRA hoy</p>
          <p className="text-2xl font-bold text-[#001F3F]">{actual.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-[#1E488F] p-3 text-white">
          <p className="text-[10px] uppercase text-white/70">Con lo que llevas este período</p>
          <p className="text-2xl font-bold">{proy.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-[#F6F7ED] p-3">
          <p className="text-[10px] uppercase text-[#001F3F]/60">Diferencia</p>
          <p className={`text-2xl font-bold ${dif >= 0 ? "text-[#00804C]" : "text-red-700"}`}>
            {dif >= 0 ? "+" : ""}
            {dif.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[#001F3F]/60">
          Materias cursando con nota registrada
        </h3>
        {cursando.length === 0 ? (
          <p className="mt-2 text-sm text-[#001F3F]/60">
            No tienes materias marcadas como &quot;cursando&quot;. Márcalas en la malla o desde el planificador.
          </p>
        ) : conNota.length === 0 ? (
          <p className="mt-2 text-sm text-[#001F3F]/60">
            Ya tienes materias cursando, pero les falta el bimestre 1 y 2. Complétalos en cada tarjeta de la
            malla para ver aquí el efecto en tu IRA.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {conNota.map(({ materia, total }) => {
              const e = etiquetaDe(total);
              const aprueba = total >= MINIMO_APROBAR;
              return (
                <li key={materia.id} className="flex items-center justify-between gap-2 text-sm text-[#001F3F]">
                  <span className="flex-1 leading-tight">{materia.nombre}</span>
                  <span className="text-xs text-[#001F3F]/60">{total.toFixed(2)}/40</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: e.bg, color: e.texto }}
                  >
                    {e.sigla}
                  </span>
                  <span className={`text-xs font-medium ${aprueba ? "text-[#00804C]" : "text-red-700"}`}>
                    {aprueba ? "Aprueba" : "No aprueba"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setEditarBase((v) => !v)}
        className="mt-4 text-xs font-medium text-[#1E488F] underline underline-offset-2"
      >
        {editarBase ? "Ocultar" : "¿Tus datos base no coinciden con tu portal? Edítalos"}
      </button>
      {editarBase && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#001F3F]/70">
          <label>
            Promedio /40
            <input type="number" step="0.01" value={base.promedio}
              onChange={(e) => setBase({ ...base, promedio: Number(e.target.value) })} className={campo} />
          </label>
          <label>
            Créd. aprobados
            <input type="number" value={base.aprobados}
              onChange={(e) => setBase({ ...base, aprobados: Number(e.target.value) })} className={campo} />
          </label>
          <label>
            Créd. reprobados
            <input type="number" value={base.reprobados}
              onChange={(e) => setBase({ ...base, reprobados: Number(e.target.value) })} className={campo} />
          </label>
        </div>
      )}
    </section>
  );
}
