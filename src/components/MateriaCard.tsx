"use client";

import type { Materia } from "../types/malla";
import type { Estado } from "../lib/disponibles";
import type { Bimestres } from "../store/useMalla";
import { etiquetaDe } from "../lib/etiquetas";

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
  motivo: string | null;
  faltantes: string[];
  incumplida: boolean;
  notas: Bimestres;
  onCambiar: (estado: Estado) => void;
  onNota: (bimestre: "b1" | "b2", valor: number | null) => void;
};

function CampoNota({ label, valor, onChange }: { label: string; valor: number | null; onChange: (v: number | null) => void }) {
  return (
    <label className="flex items-center gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
      <span className="text-[#001F3F]/60">{label}</span>
      <input
        type="number"
        min={0}
        max={20}
        step={0.01}
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Math.min(20, Math.max(0, Number(e.target.value))))}
        placeholder="/20"
        className="w-12 rounded border border-[#1E488F]/40 bg-white px-1 py-0.5 text-[#001F3F] focus:border-[#1E488F] focus:outline-none"
      />
    </label>
  );
}

export default function MateriaCard({
  materia, estado, disponible, motivo, faltantes, incumplida, notas, onCambiar, onNota,
}: Props) {
  const bloqueada = estado === "pendiente" && !disponible;
  const clases = bloqueada ? "bg-[#F6F7ED] border-[#001F3F]/10 text-[#001F3F]/40" : COLOR[estado];
  const ayuda = bloqueada ? motivo ?? materia.id : faltantes.length ? `Correquisitos pendientes: ${faltantes.join(", ")}` : materia.id;

  const total = notas.b1 !== null && notas.b2 !== null ? notas.b1 + notas.b2 : null;
  const etq = total !== null ? etiquetaDe(total) : null;

  return (
    <div
      role="button"
      tabIndex={bloqueada ? -1 : 0}
      aria-disabled={bloqueada}
      onClick={() => !bloqueada && onCambiar(SIGUIENTE[estado])}
      onKeyDown={(e) => !bloqueada && (e.key === "Enter" || e.key === " ") && onCambiar(SIGUIENTE[estado])}
      title={ayuda}
      className={`w-full rounded-lg border p-2.5 text-left text-xs transition ${clases} ${
        bloqueada ? "cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="font-semibold leading-tight">{materia.nombre}</div>
        {etq && (
          <span
            className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: etq.bg, color: etq.texto }}
            title={etq.nombre}
          >
            {etq.sigla}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] opacity-70">
        <span>{materia.id}</span>
        <span>{materia.creditos} cr</span>
      </div>

      {estado !== "pendiente" && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-black/10 pt-1.5">
          <CampoNota label="B1" valor={notas.b1} onChange={(v) => onNota("b1", v)} />
          <CampoNota label="B2" valor={notas.b2} onChange={(v) => onNota("b2", v)} />
          {total !== null && <span className="text-[10px] font-semibold">Total: {total.toFixed(2)}/40</span>}
        </div>
      )}

      {incumplida && <div className="mt-1 text-[10px] font-semibold text-red-700">⚠ Prerrequisito sin aprobar</div>}
      {faltantes.length > 0 && !bloqueada && estado === "pendiente" && (
        <div className="mt-1 text-[10px] font-medium text-[#1E488F]">Requiere correquisito</div>
      )}
    </div>
  );
}
