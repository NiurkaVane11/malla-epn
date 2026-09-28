"use client";

import { useState } from "react";
import { MATERIAS } from "../data/malla";
import { creditosDe, disponibles, estadoDe } from "../lib/disponibles";
import { useMalla } from "../store/useMalla";

// Ajusta este tope según tu reglamento; es un valor de referencia, no lo verifiqué.
export const MAX_CREDITOS = 18;

const nombreDe = (id: string) => MATERIAS.find((m) => m.id === id)?.nombre ?? id;

export default function Planificador() {
  const estados = useMalla((s) => s.estados);
  const usarPisos = useMalla((s) => s.usarPisos);
  const marcarCursando = useMalla((s) => s.marcarCursando);
  const [sel, setSel] = useState<string[]>([]);

  const opciones = disponibles(MATERIAS, estados, usarPisos);
  const elegidas = opciones.filter((m) => sel.includes(m.id));
  const yaCursando = creditosDe(MATERIAS, estados, "cursando");
  const total = yaCursando + elegidas.reduce((s, m) => s + m.creditos, 0);

  const avisos = elegidas.flatMap((m) =>
    m.correquisitos
      .filter((c) => estadoDe(estados, c) === "pendiente" && !sel.includes(c))
      .map((c) => `${m.nombre} se cursa junto con ${nombreDe(c)}`)
  );

  const toggle = (id: string) =>
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#001F3F]">Planificador del próximo semestre</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            total > MAX_CREDITOS ? "bg-red-100 text-red-700" : "bg-[#DBE64C] text-[#001F3F]"
          }`}
        >
          {total}/{MAX_CREDITOS} cr
        </span>
      </div>
      {yaCursando > 0 && (
        <p className="mt-1 text-xs text-[#001F3F]/60">Incluye {yaCursando} cr que ya marcaste como cursando.</p>
      )}

      {opciones.length === 0 ? (
        <p className="mt-3 text-sm text-[#001F3F]/60">
          No hay materias disponibles. Carga tu avance o revisa los pisos.
        </p>
      ) : (
        <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
          {opciones.map((m) => (
            <li key={m.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#001F3F] hover:bg-[#F6F7ED]">
                <input
                  type="checkbox"
                  checked={sel.includes(m.id)}
                  onChange={() => toggle(m.id)}
                  className="h-4 w-4 accent-[#00804C]"
                />
                <span className="flex-1 leading-tight">{m.nombre}</span>
                <span className="text-xs text-[#001F3F]/50">
                  N{m.nivel} · {m.creditos} cr
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {total > MAX_CREDITOS && (
        <p className="mt-3 text-xs font-medium text-red-700">Superas el tope de {MAX_CREDITOS} créditos.</p>
      )}
      {avisos.map((a) => (
        <p key={a} className="mt-1 text-xs font-medium text-[#1E488F]">
          ⚠ {a}
        </p>
      ))}

      <button
        type="button"
        disabled={elegidas.length === 0}
        onClick={() => {
          marcarCursando(elegidas.map((m) => m.id));
          setSel([]);
        }}
        className="mt-4 w-full rounded-md bg-[#1E488F] px-4 py-2 text-sm font-medium text-white hover:bg-[#001F3F] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Marcar {elegidas.length || ""} como cursando
      </button>
    </section>
  );
}
