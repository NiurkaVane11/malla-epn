import type { Estados } from "./disponibles";
import type { Bimestres } from "../store/useMalla";

export type Respaldo = {
  version: 1;
  estados: Estados;
  requisitos: Record<string, boolean>;
  iraPeriodos: Record<string, number>;
  notas?: Record<string, Bimestres>;
};

const ESTADOS = ["pendiente", "cursando", "aprobada"];
const esObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const esNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

export function validarRespaldo(x: unknown): Respaldo | null {
  if (!esObj(x) || x.version !== 1) return null;
  const { estados, requisitos, iraPeriodos, notas } = x;
  if (!esObj(estados) || !esObj(requisitos) || !esObj(iraPeriodos)) return null;
  if (!Object.values(estados).every((v) => typeof v === "string" && ESTADOS.includes(v))) return null;
  if (!Object.values(requisitos).every((v) => typeof v === "boolean")) return null;
  if (!Object.values(iraPeriodos).every(esNum)) return null;
  if (notas !== undefined) {
    if (!esObj(notas)) return null;
    const ok = Object.values(notas).every(
      (v) => esObj(v) && (v.b1 === null || esNum(v.b1)) && (v.b2 === null || esNum(v.b2))
    );
    if (!ok) return null;
  }
  return {
    version: 1,
    estados: estados as Estados,
    requisitos: requisitos as Record<string, boolean>,
    iraPeriodos: iraPeriodos as Record<string, number>,
    notas: notas as Respaldo["notas"],
  };
}
