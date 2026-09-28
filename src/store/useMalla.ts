import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Estado, Estados } from "../lib/disponibles";

type MallaState = {
  estados: Estados;
  iraPeriodos: Record<string, number>;
  setEstado: (id: string, estado: Estado) => void;
  cargarAprobadas: (ids: string[]) => void;
  setIra: (periodo: string, valor: number) => void;
  borrarIra: (periodo: string) => void;
  reiniciar: () => void;
};

export const useMalla = create<MallaState>()(
  persist(
    (set) => ({
      estados: {},
      iraPeriodos: {},
      setEstado: (id, estado) =>
        set((s) => {
          const estados = { ...s.estados };
          if (estado === "pendiente") delete estados[id];
          else estados[id] = estado;
          return { estados };
        }),
      cargarAprobadas: (ids) =>
        set((s) => {
          const estados = { ...s.estados };
          for (const id of ids) estados[id] = "aprobada";
          return { estados };
        }),
      setIra: (periodo, valor) =>
        set((s) => ({ iraPeriodos: { ...s.iraPeriodos, [periodo]: valor } })),
      borrarIra: (periodo) =>
        set((s) => {
          const iraPeriodos = { ...s.iraPeriodos };
          delete iraPeriodos[periodo];
          return { iraPeriodos };
        }),
      reiniciar: () => set({ estados: {} }), // el historial de IRA se conserva
    }),
    { name: "malla-epn" }
  )
);
