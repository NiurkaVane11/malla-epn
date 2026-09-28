"use client";

import { useRef, useState } from "react";
import { useMalla } from "../store/useMalla";

export default function Respaldo() {
  const exportar = useMalla((s) => s.exportar);
  const importar = useMalla((s) => s.importar);
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  function descargar() {
    const blob = new Blob([JSON.stringify(exportar(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `malla-epn-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Respaldo descargado.");
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

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#001F3F]/10">
      <h2 className="text-sm font-semibold text-[#001F3F]">Respaldo de tu avance</h2>
      <p className="text-xs text-[#001F3F]/60">
        Tus datos viven solo en este navegador. Descárgalos para no perderlos o para pasarlos al celular.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={descargar}
          className="rounded-md bg-[#00804C] px-4 py-2 text-sm font-medium text-white hover:bg-[#001F3F]"
        >
          Exportar
        </button>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="rounded-md border border-[#1E488F] px-4 py-2 text-sm font-medium text-[#1E488F] hover:bg-[#1E488F] hover:text-white"
        >
          Importar
        </button>
        <input ref={input} type="file" accept="application/json,.json" onChange={leer} className="hidden" />
      </div>
      {msg && <p className="mt-2 text-xs text-[#001F3F]/70">{msg}</p>}
    </section>
  );
}
