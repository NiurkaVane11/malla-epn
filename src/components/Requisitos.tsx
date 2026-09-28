"use client";

import { REQUISITOS } from "../data/requisitos";
import { useMalla } from "../store/useMalla";

export default function Requisitos() {
  const requisitos = useMalla((s) => s.requisitos) ?? {};
  const toggle = useMalla((s) => s.toggleRequisito);
  const cumplidos = REQUISITOS.filter((r) => requisitos[r.id]).length;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#001F3F]">Requisitos para graduación</h2>
          <p className="text-xs text-[#001F3F]/60">Aparte de los 135 créditos de la malla</p>
        </div>
        <span className="rounded-full bg-[#DBE64C] px-3 py-1 text-xs font-bold text-[#001F3F]">
          {cumplidos}/{REQUISITOS.length}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#001F3F]/10">
        <div
          className="h-full rounded-full bg-[#00804C] transition-all"
          style={{ width: `${(cumplidos / REQUISITOS.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {REQUISITOS.map((r) => {
          const ok = !!requisitos[r.id];
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => toggle(r.id)}
                aria-pressed={ok}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition ${
                  ok
                    ? "border-[#00804C] bg-[#74C365]/30 text-[#001F3F]"
                    : "border-[#1E488F]/30 bg-[#F6F7ED] text-[#001F3F] hover:border-[#1E488F]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    ok
                      ? "border-[#00804C] bg-[#00804C] text-white"
                      : "border-[#1E488F]/50 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span>
                  <span className="block font-medium leading-tight">{r.nombre}</span>
                  <span className="block text-xs text-[#001F3F]/60">
                    {r.id}
                    {r.nota ? ` · ${r.nota}` : ""}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
