import type { Estados } from "./disponibles";

export type Respaldo = {
  version: 1;
  estados: Estados;
  requisitos: Record<string, boolean>;
  iraPeriodos: Record<string, number>;
};

const ESTADOS = ["pendiente", "cursando", "aprobada"];
const esObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

export function validarRespaldo(x: unknown): Respaldo | null {
  if (!esObj(x) || x.version !== 1) return null;
  const { estados, requisitos, iraPeriodos } = x;
  if (!esObj(estados) || !esObj(requisitos) || !esObj(iraPeriodos)) return null;
  if (!Object.values(estados).every((v) => typeof v === "string" && ESTADOS.includes(v))) return null;
  if (!Object.values(requisitos).every((v) => typeof v === "boolean")) return null;
  if (!Object.values(iraPeriodos).every((v) => typeof v === "number" && Number.isFinite(v))) return null;
  return {
    version: 1,
    estados: estados as Estados,
    requisitos: requisitos as Record<string, boolean>,
    iraPeriodos: iraPeriodos as Record<string, number>,
  };
}
