import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Estado, Estados } from "../lib/disponibles";
import { validarRespaldo } from "../lib/respaldo";
import type { Respaldo } from "../lib/respaldo";

export type Bimestres = { b1: number | null; b2: number | null };
type Notas = Record<string, Bimestres>;

type MallaState = {
  estados: Estados;
  requisitos: Record<string, boolean>;
  iraPeriodos: Record<string, number>;
  notas: Notas;
  usarPisos: boolean;
  setEstado: (id: string, estado: Estado) => void;
  marcarCursando: (ids: string[]) => void;
  toggleRequisito: (id: string) => void;
  setUsarPisos: (v: boolean) => void;
  cargarAvance: (aprobadas: string[], requisitos: string[]) => void;
  setIra: (periodo: string, valor: number) => void;
  borrarIra: (periodo: string) => void;
  setNota: (id: string, bimestre: "b1" | "b2", valor: number | null) => void;
  exportar: () => Respaldo;
  importar: (datos: unknown) => boolean;
  reiniciar: () => void;
};

export const useMalla = create<MallaState>()(
  persist(
    (set, get) => ({
      estados: {},
      requisitos: {},
      iraPeriodos: {},
      notas: {},
      usarPisos: true,
      setEstado: (id, estado) =>
        set((s) => {
          const estados = { ...s.estados };
          if (estado === "pendiente") delete estados[id];
          else estados[id] = estado;
          return { estados };
        }),
      marcarCursando: (ids) =>
        set((s) => {
          const estados = { ...s.estados };
          for (const id of ids) if (!estados[id]) estados[id] = "cursando";
          return { estados };
        }),
      toggleRequisito: (id) =>
        set((s) => ({ requisitos: { ...s.requisitos, [id]: !s.requisitos?.[id] } })),
      setUsarPisos: (v) => set({ usarPisos: v }),
      cargarAvance: (aprobadas, requisitos) =>
        set((s) => {
          const estados = { ...s.estados };
          for (const id of aprobadas) estados[id] = "aprobada";
          const reqs = { ...s.requisitos };
          for (const id of requisitos) reqs[id] = true;
          return { estados, requisitos: reqs };
        }),
      setIra: (periodo, valor) =>
        set((s) => ({ iraPeriodos: { ...s.iraPeriodos, [periodo]: valor } })),
      borrarIra: (periodo) =>
        set((s) => {
          const iraPeriodos = { ...s.iraPeriodos };
          delete iraPeriodos[periodo];
          return { iraPeriodos };
        }),
      setNota: (id, bimestre, valor) =>
        set((s) => ({
          notas: { ...s.notas, [id]: { ...(s.notas[id] ?? { b1: null, b2: null }), [bimestre]: valor } },
        })),
      exportar: () => {
        const s = get();
        return { version: 1, estados: s.estados, requisitos: s.requisitos, iraPeriodos: s.iraPeriodos, notas: s.notas };
      },
      importar: (datos) => {
        const r = validarRespaldo(datos);
        if (!r) return false;
        set({ estados: r.estados, requisitos: r.requisitos, iraPeriodos: r.iraPeriodos, notas: r.notas ?? {} });
        return true;
      },
      reiniciar: () => set({ estados: {}, requisitos: {} }), // el historial de IRA y las notas se conservan
    }),
    { name: "malla-epn" }
  )
);
