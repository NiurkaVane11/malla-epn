import type { Materia, Registro } from "../types/malla";

export interface ResumenIRA {
  creditosAprobados: number;
  creditosInscritos: number;
  sumaPonderada: number; // suma de nota × créditos de las aprobadas
  ppc: number;
  ca: number;
  ira: number;
}

export function calcularIRA(registros: Registro[], materias: Materia[]): ResumenIRA {
  const creditos = new Map(materias.map((m) => [m.id, m.creditos]));
  let aprobados = 0;
  let inscritos = 0;
  let suma = 0;

  for (const r of registros) {
    const c = creditos.get(r.materiaId);
    if (c === undefined) continue;
    if (r.estado === "aprobada" && r.nota !== undefined) {
      aprobados += c;
      inscritos += c;
      suma += r.nota * c;
    } else if (r.estado === "reprobada") {
      inscritos += c; // cuenta para el CA, pero no para el PPC
    }
  }

  const ppc = aprobados > 0 ? suma / aprobados : 0;
  const ca = inscritos > 0 ? aprobados / inscritos : 0;
  return {
    creditosAprobados: aprobados,
    creditosInscritos: inscritos,
    sumaPonderada: suma,
    ppc,
    ca,
    ira: ppc * ca,
  };
}

// Nota promedio (sobre 40) que necesitas en las materias que vas a cursar
// para llegar a la meta, suponiendo que las apruebas todas.
// Como IRA = PPC × CA = sumaPonderada / créditosInscritos, la cuenta es directa.
export function notaNecesaria(
  resumen: ResumenIRA,
  creditosNuevos: number,
  meta: number
): number | null {
  if (creditosNuevos <= 0) return null;
  return (
    (meta * (resumen.creditosInscritos + creditosNuevos) - resumen.sumaPonderada) /
    creditosNuevos
  );
}