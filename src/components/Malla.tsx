"use client";

import { useEffect, useState } from "react";
import { MATERIAS } from "../data/malla";
import { AVANCE_APROBADAS } from "../data/avance";
import { useMalla } from "../store/useMalla";
import { estadoDe, puedeTomar, correquisitosFaltantes } from "../lib/disponibles";
import type { Estado } from "../lib/disponibles";
import MateriaCard from "./MateriaCard";
import ProgresoCarrera from "./ProgresoCarrera";
import IraPeriodos from "./IraPeriodos";

const NIVELES = Array.from({ length: 9 }, (_, i) => i + 1);

export default function Malla() {
  const estados = useMalla((s) => s.estados);
  const setEstado = useMalla((s) => s.setEstado);
  const cargarAprobadas = useMalla((s) => s.cargarAprobadas);
  const reiniciar = useMalla((s) => s.reiniciar);

  const [listo, setListo] = useState(false);
  useEffect(() => setListo(true), []);
  if (!listo) return <p className="p-6 text-slate-500">Cargando…</p>;

  const creditos = (est: Estado, nivel?: number) =>
    MATERIAS.filter((m) => (nivel ? m.nivel === nivel : true) && estadoDe(estados, m.id) === est)
      .reduce((s, m) => s + m.creditos, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold sm:text-xl">Malla curricular</h1>
            <p className="text-xs text-slate-300">Ingeniería de Software · EPN</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                confirm("Esto marca 24 materias como aprobadas según tu currículum. ¿Continuar?") &&
                cargarAprobadas(AVANCE_APROBADAS)
              }
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium hover:bg-indigo-400"
            >
              Cargar mi avance
            </button>
            <button
              type="button"
              onClick={() => confirm("¿Borrar el estado de todas las materias?") && reiniciar()}
              className="rounded-md border border-slate-500 px-3 py-1.5 text-sm hover:bg-slate-800"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProgresoCarrera aprobados={creditos("aprobada")} cursando={creditos("cursando")} total={135} />
          </div>
          <IraPeriodos />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9">
          {NIVELES.map((n) => (
            <section key={n} className="space-y-2">
              <div className="rounded-lg bg-slate-800 px-2 py-1.5 text-center text-white">
                <h2 className="text-sm font-semibold">Nivel {n}</h2>
                <p className="text-[10px] text-slate-300">{creditos("aprobada", n)}/15 cr</p>
              </div>
              {MATERIAS.filter((m) => m.nivel === n).map((m) => (
                <MateriaCard
                  key={m.id}
                  materia={m}
                  estado={estadoDe(estados, m.id)}
                  disponible={puedeTomar(m, estados)}
                  faltantes={correquisitosFaltantes(m, estados)}
                  onCambiar={(e) => setEstado(m.id, e)}
                />
              ))}
            </section>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Clic en una materia: pendiente → cursando → aprobada → pendiente. Las grises están
          bloqueadas por prerrequisitos.
        </p>
      </main>
    </div>
  );
}
