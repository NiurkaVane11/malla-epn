export type Base = { promedio: number; aprobados: number; reprobados: number };
export type Cursada = { nota: number; creditos: number };

// Datos de tu currículum: promedio /40, créditos aprobados y reprobados.
export const BASE_INICIAL: Base = { promedio: 30.63, aprobados: 66, reprobados: 10 };

// Nota mínima para aprobar según el Reglamento de Régimen Académico de la EPN (Art. 44): 24/40.
export const MINIMO_APROBAR = 24;

// IRA = tu promedio ponderado de notas × (créditos aprobados ÷ créditos que has intentado)
export function calcularIra(b: Base): number {
  const intentados = b.aprobados + b.reprobados;
  return intentados === 0 ? 0 : (b.promedio * b.aprobados) / intentados;
}

// Suma materias nuevas: si aprueban, entran al promedio; si no, solo suman a "reprobados".
export function proyectar(base: Base, cursadas: Cursada[], minimo = MINIMO_APROBAR): Base {
  let suma = base.promedio * base.aprobados;
  let ap = base.aprobados;
  let rep = base.reprobados;
  for (const c of cursadas) {
    if (c.nota >= minimo) {
      suma += c.nota * c.creditos;
      ap += c.creditos;
    } else {
      rep += c.creditos;
    }
  }
  return { promedio: ap ? suma / ap : 0, aprobados: ap, reprobados: rep };
}
