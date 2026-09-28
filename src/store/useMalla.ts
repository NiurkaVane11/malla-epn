import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Estado, Estados } from "../lib/disponibles";

type MallaState = {
  estados: Estados;
  setEstado: (id: string, estado: Estado) => void;
  reiniciar: () => void;
};

export const useMalla = create<MallaState>()(
  persist(
    (set) => ({
      estados: {},
      setEstado: (id, estado) =>
        set((s) => {
          const estados = { ...s.estados };
          if (estado === "pendiente") delete estados[id];
          else estados[id] = estado;
          return { estados };
        }),
      reiniciar: () => set({ estados: {} }),
    }),
    { name: "malla-epn" } // clave en localStorage
  )
);
