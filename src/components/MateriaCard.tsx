"use client";

import type { Materia } from "../types/malla";
import type { Estado } from "../lib/disponibles";

const SIGUIENTE: Record<Estado, Estado> = {
  pendiente: "cursando",
  cursando: "aprobada",
  aprobada: "pendiente",
};

const COLOR: Record<Estado, string> = {
  pendiente: "bg-white border-gray-300 text-gray-800",
  cursando: "bg-yellow-100 border-yellow-400 text-yellow-900",
  aprobada: "bg-green-100 border-green-500 text-green-900",
};

type Props = {
  materia: Materia;
  estado: Estado;
  disponible: boolean;
  faltantes: string[];
  onCambiar: (estado: Estado) => void;
};

export default function MateriaCard({ materia, estado, disponible, faltantes, onCambiar }: Props) {
  const bloqueada = estado === "pendiente" && !disponible;
  const clases = bloqueada ? "bg-gray-100 border-gray-200 text-gray-400" : COLOR[estado];

  return (
    <button
      type="button"
      disabled={bloqueada}
      onClick={() => onCambiar(SIGUIENTE[estado])}
      title={faltantes.length ? `Correquisitos pendientes: ${faltantes.join(", ")}` : materia.id}
      className={`w-full rounded border p-2 text-left text-xs transition ${clases} ${
        bloqueada ? "cursor-not-allowed" : "cursor-pointer hover:shadow"
      }`}
    >
      <div className="font-semibold leading-tight">{materia.nombre}</div>
      <div className="mt-1 flex justify-between opacity-80">
        <span>{materia.id}</span>
        <span>{materia.creditos} cr</span>
      </div>
      {faltantes.length > 0 && !bloqueada && estado === "pendiente" && (
        <div className="mt-1 text-[10px] text-orange-600">Requiere correquisito</div>
      )}
    </button>
  );
}
