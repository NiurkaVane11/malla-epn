"use client";

import { useRef, useState } from "react";
import { useMalla } from "../store/useMalla";
import { MATERIAS } from "../data/malla";
import { REQUISITOS } from "../data/requisitos";
import { estadoDe, creditosDe } from "../lib/disponibles";
import { PERIODOS } from "../lib/periodos";

export default function Respaldo() {
  const estados = useMalla((s) => s.estados);
  const requisitos = useMalla((s) => s.requisitos);
  const iraPeriodos = useMalla((s) => s.iraPeriodos);
  const exportar = useMalla((s) => s.exportar);
  const importar = useMalla((s) => s.importar);
  const input = useRef<HTMLInputElement>(null);
  const [avanzado, setAvanzado] = useState(false);
  const [msg, setMsg] = useState("");

  async function exportarPdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 18;
    const linea = (texto: string, tam = 11, salto = 7) => {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(tam);
      doc.text(texto, 14, y);
      y += salto;
    };

    doc.setFont("helvetica", "bold");
    linea("Malla curricular — Ingeniería de Software (EPN)", 14, 9);
    doc.setFont("helvetica", "normal");
    linea(`Generado: ${new Date().toLocaleDateString("es-EC")}`, 9, 8);

    const aprobados = creditosDe(MATERIAS, estados, "aprobada");
    const cursando = creditosDe(MATERIAS, estados, "cursando");
    linea(`Avance: ${((aprobados / 135) * 100).toFixed(1)}%  (${aprobados}/135 créditos aprobados, ${cursando} cursando)`);

    linea("");
    linea("Historial de IRA", 12, 8);
    const registrados = PERIODOS.filter((p) => iraPeriodos[p] !== undefined);
    if (registrados.length === 0) linea("Sin registros.", 10);
    else registrados.forEach((p) => linea(`${p}: ${iraPeriodos[p].toFixed(2)}`, 10, 6));

    linea("");
    linea("Requisitos de graduación", 12, 8);
    REQUISITOS.forEach((r) =>
      linea(`${requisitos[r.id] ? "[x]" : "[ ]"} ${r.nombre} (${r.id})`, 10, 6)
    );

    linea("");
    linea("Materias por nivel", 12, 8);
    for (let n = 1; n <= 9; n++) {
      linea(`Nivel ${n}`, 10, 6);
      MATERIAS.filter((m) => m.nivel === n).forEach((m) => {
        const e = estadoDe(estados, m.id);
        const marca = e === "aprobada" ? "Aprobada" : e === "cursando" ? "Cursando" : "Pendiente";
        linea(`  ${m.nombre} (${m.id}) — ${marca}`, 9, 5);
      });
    }

    doc.save(`malla-epn-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  async function leer(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const datos = JSON.parse(await f.text());
      if (!confirm("Esto reemplaza tu avance actual. ¿Continuar?")) return;
      setMsg(importar(datos) ? "Avance importado." : "El archivo no tiene el formato esperado.");
    } catch {
      setMsg("No se pudo leer el archivo.");
    }
  }

  function exportarJson() {
    const blob = new Blob([JSON.stringify(exportar(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `malla-epn-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={exportarPdf}
        className="rounded-md bg-[#00804C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#001F3F]"
      >
        Exportar PDF
      </button>
      <button
        type="button"
        onClick={() => setAvanzado((v) => !v)}
        className="text-[10px] text-[#001F3F]/50 underline underline-offset-2 hover:text-[#001F3F]"
      >
        Copia de seguridad de tus datos
      </button>
      {avanzado && (
        <div className="mt-1 flex flex-col items-end gap-1 rounded-md border border-[#001F3F]/10 bg-[#F6F7ED] p-2">
          <p className="text-[10px] text-[#001F3F]/60">
            Guarda o restaura tu avance (útil al cambiar de navegador o celular).
          </p>
          <div className="flex gap-1">
            <button type="button" onClick={exportarJson} className="rounded border border-[#1E488F] px-2 py-1 text-[10px] text-[#1E488F] hover:bg-[#1E488F] hover:text-white">
              Guardar
            </button>
            <button type="button" onClick={() => input.current?.click()} className="rounded border border-[#1E488F] px-2 py-1 text-[10px] text-[#1E488F] hover:bg-[#1E488F] hover:text-white">
              Restaurar
            </button>
          </div>
          <input ref={input} type="file" accept="application/json,.json" onChange={leer} className="hidden" />
          {msg && <p className="text-[10px] text-[#001F3F]/70">{msg}</p>}
        </div>
      )}
    </div>
  );
}
