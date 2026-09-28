"use client";

import type { Materia } from "../types/malla";
import type { Estado } from "../lib/disponibles";

const SIGUIENTE: Record<Estado, Estado> = {
  pendiente: "cursando",
  cursando: "aprobada",
  aprobada: "pendiente",
};

const COLOR: Record<Estado, string> = {
  pendiente: "bg-white border-[#1E488F]/40 text-[#001F3F] hover:border-[#1E488F]",
  cursando: "bg-[#DBE64C] border-[#b9c42a] text-[#001F3F]",
  aprobada: "bg-[#74C365] border-[#00804C] text-[#001F3F]",
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
  const clases = bloqueada
    ? "bg-[#F6F7ED] border-[#001F3F]/10 text-[#001F3F]/40"
    : COLOR[estado];

  return (
    <button
      type="button"
      disabled={bloqueada}
      onClick={() => onCambiar(SIGUIENTE[estado])}
      title={faltantes.length ? `Correquisitos pendientes: ${faltantes.join(", ")}` : materia.id}
      className={`w-full rounded-lg border p-2.5 text-left text-xs transition ${clases} ${
        bloqueada ? "cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="font-semibold leading-tight">{materia.nombre}</div>
      <div className="mt-1.5 flex justify-between text-[11px] opacity-70">
        <span>{materia.id}</span>
        <span>{materia.creditos} cr</span>
      </div>
      {faltantes.length > 0 && !bloqueada && estado === "pendiente" && (
        <div className="mt-1 text-[10px] font-medium text-[#1E488F]">Requiere correquisito</div>
      )}
    </button>
  );
}
