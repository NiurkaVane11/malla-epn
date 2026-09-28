import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Estado, Estados } from "../lib/disponibles";

type MallaState = {
  estados: Estados;
  requisitos: Record<string, boolean>;
  iraPeriodos: Record<string, number>;
  setEstado: (id: string, estado: Estado) => void;
  toggleRequisito: (id: string) => void;
  cargarAvance: (aprobadas: string[], requisitos: string[]) => void;
  setIra: (periodo: string, valor: number) => void;
  borrarIra: (periodo: string) => void;
  reiniciar: () => void;
};

export const useMalla = create<MallaState>()(
  persist(
    (set) => ({
      estados: {},
      requisitos: {},
      iraPeriodos: {},
      setEstado: (id, estado) =>
        set((s) => {
          const estados = { ...s.estados };
          if (estado === "pendiente") delete estados[id];
          else estados[id] = estado;
          return { estados };
        }),
      toggleRequisito: (id) =>
        set((s) => ({ requisitos: { ...s.requisitos, [id]: !s.requisitos?.[id] } })),
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
      reiniciar: () => set({ estados: {}, requisitos: {} }), // el historial de IRA se conserva
    }),
    { name: "malla-epn" }
  )
);
