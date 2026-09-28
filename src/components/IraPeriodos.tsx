"use client";

import { useState } from "react";
import { useMalla } from "../store/useMalla";

const PERIODOS = ["2025-A", "2025-B", "2026-A", "2026-B", "2027-A", "2027-B", "2028-A"];

export default function IraPeriodos() {
  const iraPeriodos = useMalla((s) => s.iraPeriodos);
  const setIra = useMalla((s) => s.setIra);
  const borrarIra = useMalla((s) => s.borrarIra);

  const primeroSinDato = PERIODOS.find((p) => iraPeriodos[p] === undefined) ?? PERIODOS[0];
  const [periodo, setPeriodo] = useState(primeroSinDato);
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(valor.replace(",", "."));
    if (valor.trim() === "" || Number.isNaN(n) || n < 0 || n > 40) {
      setError("Ingresa un número entre 0 y 40.");
      return;
    }
    setIra(periodo, n);
    setError("");
    setValor("");
    const siguiente = PERIODOS.find((p) => p !== periodo && iraPeriodos[p] === undefined);
    if (siguiente) setPeriodo(siguiente);
  }

  const registrados = PERIODOS.filter((p) => iraPeriodos[p] !== undefined);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <h2 className="text-sm font-semibold text-[#001F3F]">IRA por período</h2>

      <form onSubmit={guardar} className="mt-3 space-y-3">
        <label className="block text-sm text-[#001F3F]/80">
          En el período{" "}
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-md border border-[#1E488F]/40 bg-[#F6F7ED] px-2 py-1 font-medium text-[#001F3F]"
          >
            {PERIODOS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          , ¿cuál fue tu IRA?
        </label>
        <div className="flex gap-2">
          <input
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ej. 26.60"
            className="w-full rounded-md border border-[#1E488F]/40 px-3 py-2 text-sm text-[#001F3F] focus:border-[#1E488F] focus:outline-none focus:ring-2 focus:ring-[#1E488F]/20"
          />
          <button
            type="submit"
            className="rounded-md bg-[#1E488F] px-4 py-2 text-sm font-medium text-white hover:bg-[#001F3F]"
          >
            Guardar
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>

      <div className="mt-5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[#001F3F]/60">Historial</h3>
        {registrados.length === 0 ? (
          <p className="mt-2 text-sm text-[#001F3F]/60">Aún no registras ningún período.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {registrados.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-[#001F3F]">
                <span className="w-16 shrink-0 font-medium">{p}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#001F3F]/10">
                  <div
                    className="h-full rounded-full bg-[#1E488F]"
                    style={{ width: `${(iraPeriodos[p] / 40) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right tabular-nums">{iraPeriodos[p].toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => borrarIra(p)}
                  aria-label={`Borrar ${p}`}
                  className="text-[#001F3F]/40 hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
