"use client";

import { useEffect, useState } from "react";
import { MATERIAS } from "../data/malla";
import { AVANCE_APROBADAS } from "../data/avance";
import { REQUISITOS_CUMPLIDOS } from "../data/requisitos";
import { useMalla } from "../store/useMalla";
import { estadoDe, puedeTomar, correquisitosFaltantes } from "../lib/disponibles";
import type { Estado } from "../lib/disponibles";
import MateriaCard from "./MateriaCard";
import ProgresoCarrera from "./ProgresoCarrera";
import IraPeriodos from "./IraPeriodos";
import Requisitos from "./Requisitos";

const NIVELES = Array.from({ length: 9 }, (_, i) => i + 1);

export default function Malla() {
  const estados = useMalla((s) => s.estados);
  const setEstado = useMalla((s) => s.setEstado);
  const cargarAvance = useMalla((s) => s.cargarAvance);
  const reiniciar = useMalla((s) => s.reiniciar);

  const [listo, setListo] = useState(false);
  useEffect(() => setListo(true), []);
  if (!listo) return <p className="p-6 text-[#001F3F]/60">Cargando…</p>;

  const creditos = (est: Estado, nivel?: number) =>
    MATERIAS.filter((m) => (nivel ? m.nivel === nivel : true) && estadoDe(estados, m.id) === est)
      .reduce((s, m) => s + m.creditos, 0);

  return (
    <div className="min-h-screen bg-[#F6F7ED] text-[#001F3F]">
      <header className="bg-[#001F3F] text-[#F6F7ED]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold sm:text-xl">Malla curricular</h1>
            <p className="text-xs text-[#DBE64C]">Ingeniería de Software · EPN</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                confirm("Esto marca 24 materias y 5 requisitos como cumplidos según tu currículum. ¿Continuar?") &&
                cargarAvance(AVANCE_APROBADAS, REQUISITOS_CUMPLIDOS)
              }
              className="rounded-md bg-[#DBE64C] px-3 py-1.5 text-sm font-semibold text-[#001F3F] hover:bg-[#74C365]"
            >
              Cargar mi avance
            </button>
            <button
              type="button"
              onClick={() => confirm("¿Borrar materias y requisitos?") && reiniciar()}
              className="rounded-md border border-[#F6F7ED]/40 px-3 py-1.5 text-sm hover:bg-[#1E488F]"
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
              <div className="rounded-lg bg-[#1E488F] px-2 py-1.5 text-center text-white">
                <h2 className="text-sm font-semibold">Nivel {n}</h2>
                <p className="text-[10px] text-[#DBE64C]">{creditos("aprobada", n)}/15 cr</p>
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

        <Requisitos />

        <p className="text-xs text-[#001F3F]/60">
          Clic en una materia: pendiente → cursando → aprobada → pendiente. Las apagadas están
          bloqueadas por prerrequisitos.
        </p>
      </main>
    </div>
  );
}
