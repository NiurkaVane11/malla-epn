"use client";

import { useEffect, useState } from "react";
import { MATERIAS } from "../data/malla";
import { AVANCE_APROBADAS } from "../data/avance";
import { REQUISITOS_CUMPLIDOS } from "../data/requisitos";
import { useMalla } from "../store/useMalla";
import {
  correquisitosFaltantes, creditosDe, dependientes, estadoDe, incumplidas, motivoBloqueo, puedeTomar,
} from "../lib/disponibles";
import type { Estado } from "../lib/disponibles";
import MateriaCard from "./MateriaCard";
import ProgresoCarrera from "./ProgresoCarrera";
import IraPeriodos from "./IraPeriodos";
import IraGrafico from "./IraGrafico";
import IraCalculadora from "./IraCalculadora";
import Planificador from "./Planificador";
import Requisitos from "./Requisitos";
import Respaldo from "./Respaldo";

const NIVELES = Array.from({ length: 9 }, (_, i) => i + 1);

export default function Malla() {
  const estados = useMalla((s) => s.estados);
  const notas = useMalla((s) => s.notas);
  const setNota = useMalla((s) => s.setNota);
  const usarPisos = useMalla((s) => s.usarPisos);
  const setUsarPisos = useMalla((s) => s.setUsarPisos);
  const setEstado = useMalla((s) => s.setEstado);
  const cargarAvance = useMalla((s) => s.cargarAvance);
  const reiniciar = useMalla((s) => s.reiniciar);

  const [listo, setListo] = useState(false);
  useEffect(() => setListo(true), []);
  if (!listo) return <p className="p-6 text-[#001F3F]/60">Cargando…</p>;

  const aprobados = creditosDe(MATERIAS, estados, "aprobada");
  const cursando = creditosDe(MATERIAS, estados, "cursando");
  const creditosPiso = usarPisos ? aprobados : undefined;
  const alertas = new Set(incumplidas(MATERIAS, estados));

  function cambiar(id: string, nuevo: Estado) {
    if (estadoDe(estados, id) === "aprobada" && nuevo !== "aprobada") {
      const afectadas = dependientes(MATERIAS, id).filter((d) => estadoDe(estados, d) !== "pendiente");
      if (afectadas.length > 0) {
        const nombres = afectadas.map((d) => MATERIAS.find((m) => m.id === d)?.nombre ?? d).join(", ");
        if (confirm(`Estas materias dependen de esta: ${nombres}.\n\n¿Desmarcarlas también?`)) {
          for (const d of afectadas) setEstado(d, "pendiente");
        }
      }
    }
    setEstado(id, nuevo);
  }

  return (
    <div className="min-h-screen bg-[#F6F7ED] text-[#001F3F]">
      <header className="bg-[#001F3F] text-[#F6F7ED]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold sm:text-xl">Malla curricular</h1>
            <p className="text-xs text-[#DBE64C]">Ingeniería de Software · EPN</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs" title="Bloquea materias hasta tener los créditos aprobados del piso de su nivel">
              <input type="checkbox" checked={usarPisos} onChange={(e) => setUsarPisos(e.target.checked)} className="h-4 w-4 accent-[#DBE64C]" />
              Aplicar pisos
            </label>
            <button type="button"
              onClick={() => confirm("Esto marca 24 materias y 5 requisitos como cumplidos según tu currículum. ¿Continuar?") && cargarAvance(AVANCE_APROBADAS, REQUISITOS_CUMPLIDOS)}
              className="rounded-md bg-[#DBE64C] px-3 py-1.5 text-sm font-semibold text-[#001F3F] hover:bg-[#74C365]">
              Cargar mi avance
            </button>
            <button type="button" onClick={() => confirm("¿Borrar materias y requisitos?") && reiniciar()}
              className="rounded-md border border-[#F6F7ED]/40 px-3 py-1.5 text-sm hover:bg-[#1E488F]">
              Reiniciar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <ProgresoCarrera aprobados={aprobados} cursando={cursando} total={135} />
          </div>
          <Respaldo />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9">
          {NIVELES.map((n) => (
            <section key={n} className="space-y-2">
              <div className="rounded-lg bg-[#1E488F] px-2 py-1.5 text-center text-white">
                <h2 className="text-sm font-semibold">Nivel {n}</h2>
                <p className="text-[10px] text-[#DBE64C]">{creditosDe(MATERIAS, estados, "aprobada", n)}/15 cr</p>
              </div>
              {MATERIAS.filter((m) => m.nivel === n).map((m) => (
                <MateriaCard
                  key={m.id}
                  materia={m}
                  estado={estadoDe(estados, m.id)}
                  disponible={puedeTomar(m, estados, creditosPiso)}
                  motivo={motivoBloqueo(m, estados, creditosPiso)}
                  faltantes={correquisitosFaltantes(m, estados)}
                  incumplida={alertas.has(m.id)}
                  notas={notas[m.id] ?? { b1: null, b2: null }}
                  onCambiar={(e) => cambiar(m.id, e)}
                  onNota={(b, v) => setNota(m.id, b, v)}
                />
              ))}
            </section>
          ))}
        </div>

        <p className="text-xs text-[#001F3F]/60">
          Clic en una materia: pendiente → cursando → aprobada → pendiente. Al marcarla cursando o
          aprobada aparecen los campos B1 y B2 para registrar la nota de cada bimestre (0 a 20 cada uno,
          40 en total).
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <Planificador />
          <IraCalculadora />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <IraPeriodos />
          <IraGrafico />
        </div>

        <Requisitos />
      </main>
    </div>
  );
}
